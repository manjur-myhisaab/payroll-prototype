/**
 * Centralized Salary Calculation Engine
 * 
 * Hierarchy:
 * Salary Components -> Template Rules -> Employee Salary Assignment -> Breakdown
 * 
 * Rules:
 * - Gross Earnings = Sum of all Earning components
 * - Employer Contributions (Employer PF, Gratuity, Benefits) = Part of CTC, NOT in Gross or Net Pay
 * - Employee Deductions (EPF, ESI, PT, TDS) = Deducted from Gross Pay to get Net Pay
 * - Monthly CTC = Gross Earnings + Employer Contributions
 * - Net Pay = Gross Earnings - Employee Deductions
 */

export function calculateSalaryBreakdown({
  annualCTC = 0,
  template,
  allComponents = [],
  customTDS = 0,
  settings = {},
}) {
  if (!annualCTC || !template || !template.components) {
    return {
      monthlyCTC: 0,
      annualCTC: 0,
      earnings: [],
      deductions: [],
      employerContributions: [],
      totalGross: 0,
      totalDeductions: 0,
      totalEmployerCost: 0,
      netPay: 0,
      wageCodeRatio: 0,
      isWageCodeCompliant: false,
    };
  }

  const monthlyCTC = Math.round(Number(annualCTC) / 12);
  const pfCappingEnabled = settings.pfCappingEnabled !== false;
  const pfWageCeiling = settings.pfWageCeiling || 15000;

  // Map master components by ID for quick lookup
  const compMap = new Map(allComponents.map((c) => [c.id, c]));

  // Sort template components by priority or natural dependency
  const templateComps = [...template.components].map((tc) => {
    const master = compMap.get(tc.componentId) || {};
    return {
      ...master,
      ...tc,
      masterType: master.type || tc.type,
      masterName: master.name || tc.name,
      masterCode: master.code || tc.code,
    };
  });

  // Calculation state tracking
  let basic = 0;
  let grossEarningsAcc = 0;
  let employerCostAcc = 0;

  const earnings = [];
  const deductions = [];
  const employerContributions = [];

  // Track evaluated amounts per component for multi-component percentage dependencies
  const evaluatedAmounts = new Map();

  // Pass 1: Calculate Fixed Earnings and Percentage of CTC (specifically Basic)
  templateComps.forEach((item) => {
    if (item.masterType !== "EARNING") return;

    let amount = 0;
    const isBaseCTC =
      item.percentageBaseType === "CTC" ||
      item.basedOn === "MONTHLY_CTC" ||
      (!item.percentageBaseType && !item.basedOn && item.calculationMethod === "PERCENTAGE");

    if (item.calculationMethod === "PERCENTAGE" && isBaseCTC) {
      amount = Math.round((monthlyCTC * Number(item.value)) / 100);
    } else if (item.calculationMethod === "FIXED") {
      amount = Number(item.value) || 0;
    }

    if (amount > 0 || item.calculationMethod === "FIXED") {
      evaluatedAmounts.set(item.componentId, amount);
    }

    if (item.masterCode === "BASIC" || item.code === "BASIC") {
      basic = amount;
      evaluatedAmounts.set("COMP_BASIC", basic);
    }
  });

  // Pass 2: Calculate Percentage of Selected Component(s) (e.g. HRA = 40% of Basic, or % of multiple components)
  templateComps.forEach((item) => {
    if (item.masterType !== "EARNING") return;
    if (item.calculationMethod === "BALANCE") return; // Handled in residual pass

    let amount = 0;
    if (item.calculationMethod === "PERCENTAGE") {
      const isBaseCTC =
        item.percentageBaseType === "CTC" || item.basedOn === "MONTHLY_CTC";

      if (!isBaseCTC) {
        // Multi-component base calculation
        const baseIds =
          item.baseComponentIds && item.baseComponentIds.length > 0
            ? item.baseComponentIds
            : item.basedOn === "BASIC"
              ? ["COMP_BASIC"]
              : ["COMP_BASIC"];

        const baseSum = baseIds.reduce((sum, bId) => {
          return sum + (evaluatedAmounts.get(bId) || (bId === "COMP_BASIC" ? basic : 0));
        }, 0);

        amount = Math.round((baseSum * Number(item.value)) / 100);
      } else {
        amount = Math.round((monthlyCTC * Number(item.value)) / 100);
      }
    } else if (item.calculationMethod === "FIXED") {
      amount = Number(item.value) || 0;
    }

    evaluatedAmounts.set(item.componentId, amount);

    if (item.masterCode !== "SPECIAL") {
      grossEarningsAcc += amount;
      earnings.push({
        id: item.componentId,
        code: item.masterCode || item.code,
        name: item.masterName || item.name,
        type: "EARNING",
        calculationMethod: item.calculationMethod,
        percentageBaseType: item.percentageBaseType || "CTC",
        baseComponentIds: item.baseComponentIds || [],
        isProrated: item.isProrated !== false,
        value: item.value,
        amount,
        taxTreatment: item.taxTreatment || "TAXABLE",
      });
    }
  });

  // Pass 3: Calculate Employer Contributions (Employer PF, Gratuity, Insurance)
  const pfWageBase = pfCappingEnabled ? Math.min(basic, pfWageCeiling) : basic;

  templateComps.forEach((item) => {
    if (item.masterType !== "EMPLOYER_CONTRIBUTION" && item.masterType !== "BENEFIT") return;

    let amount = 0;
    if (item.calculationMethod === "PERCENTAGE") {
      if (item.basedOn === "PF_WAGE") {
        amount = Math.round((pfWageBase * Number(item.value)) / 100);
      } else if (item.percentageBaseType === "COMPONENTS" || item.basedOn === "BASIC") {
        const baseIds = item.baseComponentIds?.length ? item.baseComponentIds : ["COMP_BASIC"];
        const baseSum = baseIds.reduce((sum, bId) => sum + (evaluatedAmounts.get(bId) || (bId === "COMP_BASIC" ? basic : 0)), 0);
        amount = Math.round((baseSum * Number(item.value)) / 100);
      } else {
        amount = Math.round((monthlyCTC * Number(item.value)) / 100);
      }
    } else if (item.calculationMethod === "STATUTORY_RULE") {
      if (item.statutoryRuleType === "ER_PF_12" || item.masterCode === "EMPLOYER_PF") {
        amount = Math.round(pfWageBase * 0.12);
      } else if (item.statutoryRuleType === "GRATUITY_481" || item.masterCode === "GRATUITY") {
        amount = Math.round(basic * 0.0481);
      }
    } else if (item.calculationMethod === "FIXED") {
      amount = Number(item.value) || 0;
    }

    employerCostAcc += amount;
    employerContributions.push({
      id: item.componentId,
      code: item.masterCode || item.code,
      name: item.masterName || item.name,
      type: "EMPLOYER_CONTRIBUTION",
      calculationMethod: item.calculationMethod,
      statutoryRuleType: item.statutoryRuleType,
      isProrated: item.isProrated !== false,
      value: item.value,
      amount,
    });
  });

  // Pass 4: Balance / Special Allowance calculation (Residual of CTC)
  // Special Allowance = Monthly CTC - (Other Earnings + Employer Contributions)
  const specialComp = templateComps.find(
    (c) => c.calculationMethod === "BALANCE" || c.masterCode === "SPECIAL" || c.code === "SPECIAL"
  );

  let specialAllowance = 0;
  if (specialComp) {
    specialAllowance = Math.max(0, monthlyCTC - (grossEarningsAcc + employerCostAcc));
    earnings.push({
      id: specialComp.componentId,
      code: specialComp.masterCode || "SPECIAL",
      name: specialComp.masterName || "Special Allowance",
      type: "EARNING",
      calculationMethod: "BALANCE",
      value: specialAllowance,
      amount: specialAllowance,
    });
    grossEarningsAcc += specialAllowance;
  }

  // Total Gross Salary
  const totalGross = grossEarningsAcc;

  // Pass 5: Calculate Employee Deductions (EPF, ESI, PT, TDS)
  let totalDeductionsAcc = 0;

  templateComps.forEach((item) => {
    if (item.masterType !== "DEDUCTION") return;

    let amount = 0;
    if (item.calculationMethod === "PERCENTAGE") {
      if (item.basedOn === "PF_WAGE") {
        amount = Math.round((pfWageBase * Number(item.value)) / 100);
      } else if (item.basedOn === "GROSS") {
        amount = totalGross <= 21000 ? Math.round((totalGross * Number(item.value)) / 100) : 0;
      } else if (item.basedOn === "BASIC") {
        amount = Math.round((basic * Number(item.value)) / 100);
      }
    } else if (item.calculationMethod === "STATUTORY_RULE") {
      if (item.statutoryRuleType === "EPF_12" || item.masterCode === "EPF" || item.code === "EPF") {
        amount = Math.round(pfWageBase * 0.12);
      } else if (item.statutoryRuleType === "ESI_075" || item.masterCode === "ESI" || item.code === "ESI") {
        amount = totalGross <= 21000 ? Math.round(totalGross * 0.0075) : 0;
      } else if (item.statutoryRuleType === "PT_STATE_SLAB" || item.masterCode === "PT" || item.code === "PT") {
        amount = totalGross > 15000 ? 200 : 0;
      }
    } else if (item.calculationMethod === "TAX_RULE") {
      amount = customTDS || Number(item.value) || 0;
    } else if (item.calculationMethod === "FIXED") {
      amount = Number(item.value) || 0;
    }

    // If item is TDS and custom TDS was passed
    if ((item.masterCode === "TDS" || item.code === "TDS") && customTDS) {
      amount = Number(customTDS);
    }

    // Apply Maximum Deduction Amount Upper Cap (if configured)
    if (item.maxDeductionAmount && Number(item.maxDeductionAmount) > 0) {
      amount = Math.min(amount, Number(item.maxDeductionAmount));
    }

    totalDeductionsAcc += amount;
    deductions.push({
      id: item.componentId,
      code: item.masterCode || item.code,
      name: item.masterName || item.name,
      type: "DEDUCTION",
      calculationMethod: item.calculationMethod,
      maxDeductionAmount: item.maxDeductionAmount,
      value: item.value,
      amount,
    });
  });

  // If TDS was specified on employee assignment but not explicitly in template
  if (customTDS > 0 && !deductions.some((d) => d.code === "TDS")) {
    deductions.push({
      id: "COMP_TDS",
      code: "TDS",
      name: "Tax Deducted at Source (TDS)",
      type: "DEDUCTION",
      calculationMethod: "FIXED",
      value: customTDS,
      amount: customTDS,
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
    annualCTC: Number(annualCTC),
    basicMonthly: basic,
    earnings,
    deductions,
    employerContributions,
    totalGross,
    totalDeductions: totalDeductionsAcc,
    totalEmployerCost: employerCostAcc,
    netPay,
    totalCTC,
    wageCodeRatio,
    isWageCodeCompliant,
  };
}
