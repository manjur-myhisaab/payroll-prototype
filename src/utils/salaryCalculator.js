/**
 * Centralized High-Precision Salary Calculation Engine
 * 
 * Hierarchy:
 * Salary Components -> Template Rules -> Employee Salary Assignment -> Dual Monthly/Annual Breakdown
 * 
 * Rules:
 * - Gross Earnings = Sum of all Earning components
 * - Employer Contributions (Employer PF, Gratuity, ESIC Employer, LWF Employer) = Part of CTC, NOT in Gross or Net Pay
 * - Employee Deductions (EPF, ESI, PT, LWF, TDS) = Deducted from Gross Pay to get Net Pay
 * - Monthly CTC = Gross Earnings + Employer Contributions
 * - Net Pay = Gross Earnings - Employee Deductions
 */

export function calculateSalaryBreakdown({
  annualCTC = 0,
  monthlyCTCOverride = null,
  template,
  assignedComponents = null,
  allComponents = [],
  customTDS = 0,
  settings = {},
}) {
  const annual = Number(annualCTC) || (monthlyCTCOverride ? Number(monthlyCTCOverride) * 12 : 0);
  const monthlyCTC = monthlyCTCOverride ? Number(monthlyCTCOverride) : Math.round(annual / 12);
  const rawComponents = assignedComponents && assignedComponents.length > 0
    ? assignedComponents
    : (template && template.components ? template.components : []);

  if (!monthlyCTC || rawComponents.length === 0) {
    return {
      monthlyCTC: 0,
      annualCTC: 0,
      basicMonthly: 0,
      basicAnnual: 0,
      earnings: [],
      deductions: [],
      employerContributions: [],
      totalGross: 0,
      totalGrossMonthly: 0,
      totalGrossAnnual: 0,
      totalDeductions: 0,
      totalDeductionsMonthly: 0,
      totalDeductionsAnnual: 0,
      totalEmployerCost: 0,
      totalEmployerCostMonthly: 0,
      totalEmployerCostAnnual: 0,
      netPay: 0,
      netPayMonthly: 0,
      netPayAnnual: 0,
      totalCTC: 0,
      wageCodeRatio: 0,
      isWageCodeCompliant: false,
    };
  }

  const pfCappingEnabled = settings.pfCappingEnabled !== false;
  const pfWageCeiling = settings.pfWageCeiling || 15000;

  // Map master components by ID & Code for resilient lookup
  const compMap = new Map(allComponents.map((c) => [c.id, c]));

  // Normalize components with master metadata
  const templateComps = [...rawComponents].map((tc) => {
    const master = compMap.get(tc.componentId) || {};
    const code = (master.code || tc.code || tc.componentId || "").toUpperCase();
    const type = master.type || tc.type || (code.includes("ER_") || code.includes("EMPLOYER") ? "EMPLOYER_CONTRIBUTION" : code.includes("DEDUCT") || code.includes("PF") || code.includes("ESI") || code.includes("PT") || code.includes("TDS") ? "DEDUCTION" : "EARNING");
    const name = master.name || tc.name || code;
    const calculationMethod = tc.calculationMethod || master.calculationMethod || "PERCENTAGE";

    return {
      ...master,
      ...tc,
      masterType: type,
      masterCode: code,
      masterName: name,
      calculationMethod,
    };
  });

  // Calculation state tracking
  let basic = 0;
  let grossEarningsAcc = 0;
  let employerCostAcc = 0;

  const earnings = [];
  const deductions = [];
  const employerContributions = [];

  // Track evaluated amounts per component ID and Code
  const evaluatedAmounts = new Map();

  // Helper: Detect if a component represents Basic Salary
  const isBasicComponent = (item) => {
    const c = item.masterCode;
    return c === "BASIC" || c === "COMP_BASIC" || c === "BASIC_SALARY";
  };

  // Helper: Detect if a component is Special Allowance / Balance
  const isSpecialComponent = (item) => {
    const c = item.masterCode;
    return item.calculationMethod === "BALANCE" || c === "SPECIAL" || c === "COMP_SPECIAL" || c === "SPECIAL_ALLOWANCE";
  };

  // -------------------------------------------------------------
  // PASS 1: Calculate Fixed Earnings and Percentage of CTC (Specifically Basic)
  // -------------------------------------------------------------
  templateComps.forEach((item) => {
    if (item.masterType !== "EARNING" || isSpecialComponent(item)) return;

    let amount = 0;
    const isBaseCTC =
      item.percentageBaseType === "CTC" ||
      item.basedOn === "MONTHLY_CTC" ||
      (!item.percentageBaseType && !item.basedOn && item.calculationMethod === "PERCENTAGE");

    if (item.calculationMethod === "PERCENTAGE" && isBaseCTC) {
      amount = Math.round((monthlyCTC * Number(item.value || 0)) / 100);
    } else if (item.calculationMethod === "FIXED") {
      amount = Number(item.value) || 0;
    }

    if (amount > 0 || item.calculationMethod === "FIXED") {
      evaluatedAmounts.set(item.componentId, amount);
      evaluatedAmounts.set(item.masterCode, amount);
    }

    if (isBasicComponent(item)) {
      basic = amount;
      evaluatedAmounts.set("COMP_BASIC", basic);
      evaluatedAmounts.set("BASIC", basic);
    }
  });

  // -------------------------------------------------------------
  // PASS 2: Calculate Percentage of Selected Component(s) (e.g. HRA = 40% of Basic)
  // -------------------------------------------------------------
  templateComps.forEach((item) => {
    if (item.masterType !== "EARNING" || isSpecialComponent(item)) return;

    let amount = 0;
    if (item.calculationMethod === "PERCENTAGE") {
      const isBaseCTC = item.percentageBaseType === "CTC" || item.basedOn === "MONTHLY_CTC";

      if (!isBaseCTC) {
        // Multi-component base calculation
        const baseIds =
          item.baseComponentIds && item.baseComponentIds.length > 0
            ? item.baseComponentIds
            : ["COMP_BASIC"];

        const baseSum = baseIds.reduce((sum, bId) => {
          const val = evaluatedAmounts.get(bId) || (bId.includes("BASIC") ? basic : 0);
          return sum + val;
        }, 0);

        amount = Math.round((baseSum * Number(item.value || 0)) / 100);
      } else {
        amount = Math.round((monthlyCTC * Number(item.value || 0)) / 100);
      }
    } else if (item.calculationMethod === "FIXED") {
      amount = Number(item.value) || 0;
    }

    evaluatedAmounts.set(item.componentId, amount);
    evaluatedAmounts.set(item.masterCode, amount);

    grossEarningsAcc += amount;
    earnings.push({
      id: item.componentId,
      componentId: item.componentId,
      code: item.masterCode,
      name: item.masterName,
      type: "EARNING",
      calculationMethod: item.calculationMethod,
      percentageBaseType: item.percentageBaseType || "CTC",
      baseComponentIds: item.baseComponentIds || [],
      value: item.value,
      amount,
      annualAmount: amount * 12,
    });
  });

  // -------------------------------------------------------------
  // PASS 3: Calculate Employer Contributions & Statutory Liabilities
  // -------------------------------------------------------------
  const pfWageBase = pfCappingEnabled ? Math.min(basic, pfWageCeiling) : basic;

  templateComps.forEach((item) => {
    if (item.masterType !== "EMPLOYER_CONTRIBUTION" && item.masterType !== "BENEFIT") return;

    let amount = 0;
    const code = item.masterCode;

    // 1. Employer EPF / EPS (12% of PF Wage)
    if (code.includes("ER_PF") || code.includes("EMPLOYER_PF") || item.statutoryRuleType === "ER_PF_12") {
      const rate = Number(item.value) || 12;
      amount = Math.round((pfWageBase * rate) / 100);
    }
    // 2. EDLI & Admin Charges (1.0% of PF Wage)
    else if (code.includes("EDLI") || code.includes("ADMIN")) {
      const rate = Number(item.value) || 1.0;
      amount = Math.round((pfWageBase * rate) / 100);
    }
    // 3. Employer ESIC (3.25% of Gross, only if Gross <= 21000)
    else if (code.includes("ER_ESI") || code.includes("EMPLOYER_ESI") || item.statutoryRuleType === "ER_ESI_325") {
      const rate = Number(item.value) || 3.25;
      amount = grossEarningsAcc <= 21000 ? Math.round((grossEarningsAcc * rate) / 100) : 0;
    }
    // 4. Gratuity Provision (4.81% of Basic / 15/26 Rule)
    else if (code.includes("GRATUITY") || item.statutoryRuleType === "GRATUITY_481") {
      const rate = Number(item.value) || 4.81;
      amount = Math.round((basic * rate) / 100);
    }
    // 5. Employer LWF (State fixed rule e.g. ₹40)
    else if (code.includes("ER_LWF") || code.includes("LWF_ER")) {
      amount = Number(item.value) || 40;
    }
    // 6. Statutory Bonus (8.33% of Basic)
    else if (code.includes("BONUS") || item.statutoryRuleType === "BONUS_833") {
      const rate = Number(item.value) || 8.33;
      amount = Math.round((basic * rate) / 100);
    }
    // 7. Employer Corporate NPS (10% of Basic)
    else if (code.includes("ER_NPS") || code.includes("NPS_ER")) {
      const rate = Number(item.value) || 10;
      amount = Math.round((basic * rate) / 100);
    }
    // General Percentage Rule
    else if (item.calculationMethod === "PERCENTAGE") {
      if (item.basedOn === "PF_WAGE") {
        amount = Math.round((pfWageBase * Number(item.value || 0)) / 100);
      } else if (item.percentageBaseType === "COMPONENTS" || item.basedOn === "BASIC") {
        const baseIds = item.baseComponentIds?.length ? item.baseComponentIds : ["COMP_BASIC"];
        const baseSum = baseIds.reduce((sum, bId) => sum + (evaluatedAmounts.get(bId) || (bId.includes("BASIC") ? basic : 0)), 0);
        amount = Math.round((baseSum * Number(item.value || 0)) / 100);
      } else {
        amount = Math.round((monthlyCTC * Number(item.value || 0)) / 100);
      }
    }
    // Fixed Rule
    else if (item.calculationMethod === "FIXED" || item.calculationMethod === "RULE" || item.calculationMethod === "STATUTORY_RULE") {
      amount = Number(item.value) || 0;
    }

    evaluatedAmounts.set(item.componentId, amount);
    evaluatedAmounts.set(item.masterCode, amount);
    employerCostAcc += amount;

    employerContributions.push({
      id: item.componentId,
      componentId: item.componentId,
      code: item.masterCode,
      name: item.masterName,
      type: "EMPLOYER_CONTRIBUTION",
      calculationMethod: item.calculationMethod,
      statutoryRuleType: item.statutoryRuleType,
      value: item.value,
      amount,
      annualAmount: amount * 12,
    });
  });

  // -------------------------------------------------------------
  // PASS 4: Balance / Special Allowance calculation (Residual of CTC)
  // Special Allowance = Monthly CTC - (Other Earnings + Employer Contributions)
  // -------------------------------------------------------------
  const specialComp = templateComps.find(isSpecialComponent);

  let specialAllowance = 0;
  if (specialComp) {
    specialAllowance = Math.max(0, monthlyCTC - (grossEarningsAcc + employerCostAcc));
    earnings.push({
      id: specialComp.componentId,
      componentId: specialComp.componentId,
      code: specialComp.masterCode || "SPECIAL",
      name: specialComp.masterName || "Special Allowance",
      type: "EARNING",
      calculationMethod: "BALANCE",
      value: specialAllowance,
      amount: specialAllowance,
      annualAmount: specialAllowance * 12,
    });
    grossEarningsAcc += specialAllowance;
    evaluatedAmounts.set(specialComp.componentId, specialAllowance);
    evaluatedAmounts.set("SPECIAL", specialAllowance);
  }

  // Total Gross Salary
  const totalGross = grossEarningsAcc;

  // -------------------------------------------------------------
  // PASS 5: Calculate Employee Deductions (EPF, ESI, PT, LWF, NPS, TDS)
  // -------------------------------------------------------------
  let totalDeductionsAcc = 0;

  templateComps.forEach((item) => {
    if (item.masterType !== "DEDUCTION") return;

    let amount = 0;
    const code = item.masterCode;

    // 1. Employee EPF (12% of PF Wage)
    if (code === "EPF" || code.includes("EPF_EE") || code.includes("COMP_EPF") || code.includes("EMPLOYEE_PF") || item.statutoryRuleType === "EPF_12") {
      const rate = Number(item.value) || 12;
      amount = Math.round((pfWageBase * rate) / 100);
    }
    // 2. Voluntary PF (VPF)
    else if (code.includes("VPF")) {
      const rate = Number(item.value) || 0;
      amount = Math.round((basic * rate) / 100);
    }
    // 3. Employee ESIC (0.75% of Gross, only if Gross <= 21000)
    else if (code === "ESI" || code.includes("ESI_EE") || code.includes("COMP_ESI") || item.statutoryRuleType === "ESI_075") {
      const rate = Number(item.value) || 0.75;
      amount = totalGross <= 21000 ? Math.round((totalGross * rate) / 100) : 0;
    }
    // 4. Professional Tax (PT)
    else if (code === "PT" || code.includes("PT_") || code.includes("PROFESSIONAL_TAX") || item.statutoryRuleType === "PT_STATE_SLAB") {
      amount = totalGross >= 15000 ? (Number(item.value) || 200) : 0;
    }
    // 5. Labour Welfare Fund (LWF Employee)
    else if (code === "LWF" || code.includes("LWF_EE") || code.includes("LABOUR_WELFARE")) {
      amount = Number(item.value) || 20;
    }
    // 6. Employee NPS (10% of Basic)
    else if (code.includes("NPS_EE") || code.includes("NPS")) {
      const rate = Number(item.value) || 10;
      amount = Math.round((basic * rate) / 100);
    }
    // 7. TDS / Income Tax
    else if (code === "TDS" || code.includes("TAX") || item.calculationMethod === "TAX_RULE") {
      amount = customTDS || Number(item.value) || 0;
    }
    // General Percentage Rule
    else if (item.calculationMethod === "PERCENTAGE") {
      if (item.basedOn === "PF_WAGE") {
        amount = Math.round((pfWageBase * Number(item.value || 0)) / 100);
      } else if (item.basedOn === "GROSS") {
        amount = Math.round((totalGross * Number(item.value || 0)) / 100);
      } else if (item.percentageBaseType === "COMPONENTS" || item.basedOn === "BASIC") {
        const baseIds = item.baseComponentIds?.length ? item.baseComponentIds : ["COMP_BASIC"];
        const baseSum = baseIds.reduce((sum, bId) => sum + (evaluatedAmounts.get(bId) || (bId.includes("BASIC") ? basic : 0)), 0);
        amount = Math.round((baseSum * Number(item.value || 0)) / 100);
      } else {
        amount = Math.round((monthlyCTC * Number(item.value || 0)) / 100);
      }
    }
    // Fixed Rule
    else if (item.calculationMethod === "FIXED" || item.calculationMethod === "RULE" || item.calculationMethod === "STATUTORY_RULE") {
      amount = Number(item.value) || 0;
    }

    // Override custom TDS if provided
    if ((code === "TDS" || code.includes("TAX")) && customTDS > 0) {
      amount = Number(customTDS);
    }

    totalDeductionsAcc += amount;
    deductions.push({
      id: item.componentId,
      componentId: item.componentId,
      code: item.masterCode,
      name: item.masterName,
      type: "DEDUCTION",
      calculationMethod: item.calculationMethod,
      value: item.value,
      amount,
      annualAmount: amount * 12,
    });
  });

  // If custom TDS was specified on employee assignment but not explicitly in template
  if (customTDS > 0 && !deductions.some((d) => d.code === "TDS" || d.code.includes("TAX"))) {
    deductions.push({
      id: "COMP_TDS",
      componentId: "COMP_TDS",
      code: "TDS",
      name: "Tax Deducted at Source (TDS)",
      type: "DEDUCTION",
      calculationMethod: "FIXED",
      value: customTDS,
      amount: customTDS,
      annualAmount: customTDS * 12,
    });
    totalDeductionsAcc += customTDS;
  }

  const netPay = totalGross - totalDeductionsAcc;
  const totalCTC = totalGross + employerCostAcc;

  // Wage Code 2019 compliance check: Basic must be >= 50% of monthly CTC
  const wageCodeRatio = monthlyCTC > 0 ? parseFloat((basic / monthlyCTC).toFixed(4)) : 0;
  const isWageCodeCompliant = wageCodeRatio >= 0.5;

  return {
    monthlyCTC,
    annualCTC: monthlyCTC * 12,
    basicMonthly: basic,
    basicAnnual: basic * 12,
    earnings,
    deductions,
    employerContributions,
    totalGross,
    totalGrossMonthly: totalGross,
    totalGrossAnnual: totalGross * 12,
    totalDeductions: totalDeductionsAcc,
    totalDeductionsMonthly: totalDeductionsAcc,
    totalDeductionsAnnual: totalDeductionsAcc * 12,
    totalEmployerCost: employerCostAcc,
    totalEmployerCostMonthly: employerCostAcc,
    totalEmployerCostAnnual: employerCostAcc * 12,
    netPay,
    netPayMonthly: netPay,
    netPayAnnual: netPay * 12,
    totalCTC,
    totalCTCMonthly: totalCTC,
    totalCTCAnnual: totalCTC * 12,
    wageCodeRatio,
    isWageCodeCompliant,
  };
}

/**
 * Section 192 Income Tax (TDS) Projection Engine
 * Supports New Tax Regime (Section 115BAC - Budget 2024 revised) and Old Tax Regime
 */
export function calculateTaxProjection({
  annualCTC = 0,
  grossAnnual = 0,
  taxRegime = "NEW",
  standardDeductionOverride = null,
  chapter6ADeductions = 0,
  hraExemption = 0,
  tdsAlreadyPaid = 0,
  remainingMonths = 12,
}) {
  const gross = grossAnnual > 0 ? Number(grossAnnual) : Number(annualCTC);
  let standardDeduction = 0;
  let taxableIncome = gross;
  let slabBreakdown = [];
  let baseTax = 0;

  if (taxRegime === "NEW") {
    // Budget 2024 revised standard deduction for New Regime = ₹75,000
    standardDeduction = standardDeductionOverride !== null ? standardDeductionOverride : 75000;
    taxableIncome = Math.max(0, gross - standardDeduction);

    // Section 115BAC Slabs (Budget 2024 revised):
    // 0 - 3,00,000: Nil
    // 3,00,001 - 7,00,000: 5%
    // 7,00,001 - 10,00,000: 10%
    // 10,00,001 - 12,00,000: 15%
    // 12,00,001 - 15,00,000: 20%
    // Above 15,00,000: 30%
    const slabs = [
      { min: 0, max: 300000, rate: 0, label: "₹0 to ₹3,00,000" },
      { min: 300000, max: 700000, rate: 0.05, label: "₹3,00,001 to ₹7,00,000" },
      { min: 700000, max: 1000000, rate: 0.10, label: "₹7,00,001 to ₹10,00,000" },
      { min: 1000000, max: 1200000, rate: 0.15, label: "₹10,00,001 to ₹12,00,000" },
      { min: 1200000, max: 1500000, rate: 0.20, label: "₹12,00,001 to ₹15,00,000" },
      { min: 1500000, max: Infinity, rate: 0.30, label: "Above ₹15,00,000" },
    ];

    for (const s of slabs) {
      if (taxableIncome > s.min) {
        const slabTaxable = Math.min(taxableIncome, s.max) - s.min;
        const taxInSlab = Math.round(slabTaxable * s.rate);
        baseTax += taxInSlab;
        slabBreakdown.push({
          slab: s.label,
          rate: `${Math.round(s.rate * 100)}%`,
          taxableAmount: slabTaxable,
          tax: taxInSlab,
        });
      }
    }

    // Section 87A Rebate for New Regime: If Taxable Income <= ₹7,00,000, rebate gives zero tax
    let rebate87A = 0;
    if (taxableIncome <= 700000) {
      rebate87A = baseTax;
      baseTax = 0;
    }
  } else {
    // Old Tax Regime
    standardDeduction = standardDeductionOverride !== null ? standardDeductionOverride : 50000;
    const totalDeductions = standardDeduction + (Number(hraExemption) || 0) + (Number(chapter6ADeductions) || 0);
    taxableIncome = Math.max(0, gross - totalDeductions);

    // Old Slabs: 0-2.5L: Nil, 2.5-5L: 5%, 5-10L: 20%, >10L: 30%
    const slabs = [
      { min: 0, max: 250000, rate: 0, label: "₹0 to ₹2,50,000" },
      { min: 250000, max: 500000, rate: 0.05, label: "₹2,50,001 to ₹5,00,000" },
      { min: 500000, max: 1000000, rate: 0.20, label: "₹5,00,001 to ₹10,00,000" },
      { min: 1000000, max: Infinity, rate: 0.30, label: "Above ₹10,00,000" },
    ];

    for (const s of slabs) {
      if (taxableIncome > s.min) {
        const slabTaxable = Math.min(taxableIncome, s.max) - s.min;
        const taxInSlab = Math.round(slabTaxable * s.rate);
        baseTax += taxInSlab;
        slabBreakdown.push({
          slab: s.label,
          rate: `${Math.round(s.rate * 100)}%`,
          taxableAmount: slabTaxable,
          tax: taxInSlab,
        });
      }
    }

    if (taxableIncome <= 500000) {
      baseTax = 0;
    }
  }

  // 4% Health & Education Cess
  const cess4Percent = Math.round(baseTax * 0.04);
  const totalAnnualTax = baseTax + cess4Percent;

  // Monthly TDS Withholding under Section 192
  const remMonths = remainingMonths > 0 ? remainingMonths : 12;
  const remTax = Math.max(0, totalAnnualTax - Number(tdsAlreadyPaid));
  const recommendedMonthlyTDS = Math.round(remTax / remMonths);

  return {
    grossAnnual: gross,
    taxRegime,
    standardDeduction,
    hraExemption: Number(hraExemption) || 0,
    sec80C: Number(chapter6ADeductions) || 0,
    taxableIncome,
    slabBreakdown,
    baseTax,
    cess4Percent,
    totalAnnualTax,
    tdsAlreadyPaid: Number(tdsAlreadyPaid) || 0,
    remainingMonths: remMonths,
    recommendedMonthlyTDS,
  };
}

