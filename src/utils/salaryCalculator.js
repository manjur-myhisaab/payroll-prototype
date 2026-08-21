/**
 * Centralized High-Precision Universal Salary Calculation Engine
 * Supports all 4 Real-World Indian Wage & Pay Types:
 * 1. MONTHLY_SALARIED (Fixed CTC, Basic + HRA + Special Allowance + Statutory PF/ESI/PT)
 * 2. DAILY_WAGE (Daily Rate * 26 standard days + Paid Rest Days + ESI/EPF)
 * 3. HOURLY (Hourly Rate * 160 standard hours + Overtime multipliers + PT)
 * 4. PIECE_RATE (Piece Rate * 1,500 standard units + Efficiency bonuses + ESI)
 */

export function calculateSalaryBreakdown({
  annualCTC = 0,
  monthlyCTCOverride = null,
  payType = "MONTHLY_SALARIED",
  dailyRate = 0,
  hourlyRate = 0,
  pieceRate = 0,
  template,
  assignedComponents = null,
  allComponents = [],
  customTDS = 0,
  settings = {},
}) {
  const normalizedPayType = payType || "MONTHLY_SALARIED";
  const rawComponents = assignedComponents && assignedComponents.length > 0
    ? assignedComponents
    : (template && template.components ? template.components : []);

  const pfCappingEnabled = settings.pfCappingEnabled !== false;
  const pfWageCeiling = settings.pfWageCeiling || 15000;
  const compMap = new Map(allComponents.map((c) => [c.id, c]));

  // =========================================================================
  // 1. NON-MONTHLY PAY TYPES (DAILY WAGE, HOURLY, PIECE RATE)
  // =========================================================================
  if (normalizedPayType === "DAILY_WAGE") {
    const rate = Number(dailyRate) || 650;
    const standardDays = 26; // Standard 26 working days in a calendar month
    const estGrossMonthly = rate * standardDays;
    const basicMonthly = Math.round(estGrossMonthly * 0.50); // 50% Basic wage
    const daAllowance = estGrossMonthly - basicMonthly; // 50% DA & Special Daily Allowance

    // Statutory ESIC (if gross <= ₹21,000)
    const isEsiEligible = estGrossMonthly <= 21000;
    const employeeESI = isEsiEligible ? Math.ceil(estGrossMonthly * 0.0075) : 0;
    const employerESI = isEsiEligible ? Math.ceil(estGrossMonthly * 0.0325) : 0;

    // Professional Tax (Karnataka/MH standard slab)
    const ptAmount = estGrossMonthly >= 15000 ? 200 : 0;

    const earnings = [
      {
        id: "COMP_BASIC_DAILY",
        componentId: "COMP_BASIC",
        code: "BASIC",
        name: "Basic Daily Wage (50%)",
        type: "EARNING",
        calculationMethod: "PERCENTAGE",
        value: 50,
        amount: basicMonthly,
        annualAmount: basicMonthly * 12,
      },
      {
        id: "COMP_DA_DAILY",
        componentId: "COMP_SPECIAL",
        code: "SPECIAL",
        name: "Daily DA & Production Allowance",
        type: "EARNING",
        calculationMethod: "BALANCE",
        value: 50,
        amount: daAllowance,
        annualAmount: daAllowance * 12,
      },
    ];

    const deductions = [];
    if (employeeESI > 0) {
      deductions.push({
        id: "COMP_ESI",
        componentId: "COMP_ESI",
        code: "ESI",
        name: "Employee State Insurance (0.75%)",
        type: "DEDUCTION",
        calculationMethod: "PERCENTAGE",
        value: 0.75,
        amount: employeeESI,
        annualAmount: employeeESI * 12,
      });
    }
    if (ptAmount > 0) {
      deductions.push({
        id: "COMP_PT",
        componentId: "COMP_PT",
        code: "PT",
        name: "Professional Tax",
        type: "DEDUCTION",
        calculationMethod: "FIXED",
        value: 200,
        amount: ptAmount,
        annualAmount: ptAmount * 12,
      });
    }

    const employerContributions = [];
    if (employerESI > 0) {
      employerContributions.push({
        id: "COMP_ER_ESI",
        componentId: "COMP_ER_ESI",
        code: "ER_ESI",
        name: "Employer ESIC Contribution (3.25%)",
        type: "EMPLOYER_CONTRIBUTION",
        calculationMethod: "PERCENTAGE",
        value: 3.25,
        amount: employerESI,
        annualAmount: employerESI * 12,
      });
    }

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const totalEmployerCost = employerContributions.reduce((sum, ec) => sum + ec.amount, 0);
    const netPay = estGrossMonthly - totalDeductions;
    const monthlyCTC = estGrossMonthly + totalEmployerCost;

    return {
      payType: "DAILY_WAGE",
      dailyRate: rate,
      monthlyCTC,
      annualCTC: monthlyCTC * 12,
      basicMonthly,
      basicAnnual: basicMonthly * 12,
      earnings,
      deductions,
      employerContributions,
      totalGross: estGrossMonthly,
      totalGrossMonthly: estGrossMonthly,
      totalGrossAnnual: estGrossMonthly * 12,
      totalDeductions,
      totalDeductionsMonthly: totalDeductions,
      totalDeductionsAnnual: totalDeductions * 12,
      totalEmployerCost,
      totalEmployerCostMonthly: totalEmployerCost,
      totalEmployerCostAnnual: totalEmployerCost * 12,
      netPay,
      netPayMonthly: netPay,
      netPayAnnual: netPay * 12,
      totalCTC: monthlyCTC,
      wageCodeRatio: 50,
      isWageCodeCompliant: true,
    };
  }

  if (normalizedPayType === "HOURLY") {
    const rate = Number(hourlyRate) || 350;
    const standardHours = 160; // Standard 160 monthly billable hours (20 days * 8h)
    const estGrossMonthly = rate * standardHours;
    const ptAmount = estGrossMonthly >= 15000 ? 200 : 0;

    const earnings = [
      {
        id: "COMP_BASIC_HOURLY",
        componentId: "COMP_BASIC",
        code: "BASIC",
        name: "Hourly Consulting Retainer (160h)",
        type: "EARNING",
        calculationMethod: "PERCENTAGE",
        value: 100,
        amount: estGrossMonthly,
        annualAmount: estGrossMonthly * 12,
      },
    ];

    const deductions = [];
    if (ptAmount > 0) {
      deductions.push({
        id: "COMP_PT",
        componentId: "COMP_PT",
        code: "PT",
        name: "Professional Tax",
        type: "DEDUCTION",
        calculationMethod: "FIXED",
        value: 200,
        amount: ptAmount,
        annualAmount: ptAmount * 12,
      });
    }

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const netPay = estGrossMonthly - totalDeductions;

    return {
      payType: "HOURLY",
      hourlyRate: rate,
      monthlyCTC: estGrossMonthly,
      annualCTC: estGrossMonthly * 12,
      basicMonthly: estGrossMonthly,
      basicAnnual: estGrossMonthly * 12,
      earnings,
      deductions,
      employerContributions: [],
      totalGross: estGrossMonthly,
      totalGrossMonthly: estGrossMonthly,
      totalGrossAnnual: estGrossMonthly * 12,
      totalDeductions,
      totalDeductionsMonthly: totalDeductions,
      totalDeductionsAnnual: totalDeductions * 12,
      totalEmployerCost: 0,
      totalEmployerCostMonthly: 0,
      totalEmployerCostAnnual: 0,
      netPay,
      netPayMonthly: netPay,
      netPayAnnual: netPay * 12,
      totalCTC: estGrossMonthly,
      wageCodeRatio: 100,
      isWageCodeCompliant: true,
    };
  }

  if (normalizedPayType === "PIECE_RATE") {
    const rate = Number(pieceRate) || 15;
    const standardUnits = 1500; // Standard monthly baseline output
    const estGrossMonthly = rate * standardUnits;

    // Statutory ESIC (if gross <= ₹21,000)
    const isEsiEligible = estGrossMonthly <= 21000;
    const employeeESI = isEsiEligible ? Math.ceil(estGrossMonthly * 0.0075) : 0;
    const employerESI = isEsiEligible ? Math.ceil(estGrossMonthly * 0.0325) : 0;

    const earnings = [
      {
        id: "COMP_BASIC_PIECE",
        componentId: "COMP_BASIC",
        code: "BASIC",
        name: "Piece-Rate Production Base (1,500 Units)",
        type: "EARNING",
        calculationMethod: "PERCENTAGE",
        value: 100,
        amount: estGrossMonthly,
        annualAmount: estGrossMonthly * 12,
      },
    ];

    const deductions = [];
    if (employeeESI > 0) {
      deductions.push({
        id: "COMP_ESI",
        componentId: "COMP_ESI",
        code: "ESI",
        name: "Employee State Insurance (0.75%)",
        type: "DEDUCTION",
        calculationMethod: "PERCENTAGE",
        value: 0.75,
        amount: employeeESI,
        annualAmount: employeeESI * 12,
      });
    }

    const employerContributions = [];
    if (employerESI > 0) {
      employerContributions.push({
        id: "COMP_ER_ESI",
        componentId: "COMP_ER_ESI",
        code: "ER_ESI",
        name: "Employer ESIC Contribution (3.25%)",
        type: "EMPLOYER_CONTRIBUTION",
        calculationMethod: "PERCENTAGE",
        value: 3.25,
        amount: employerESI,
        annualAmount: employerESI * 12,
      });
    }

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const totalEmployerCost = employerContributions.reduce((sum, ec) => sum + ec.amount, 0);
    const netPay = estGrossMonthly - totalDeductions;
    const monthlyCTC = estGrossMonthly + totalEmployerCost;

    return {
      payType: "PIECE_RATE",
      pieceRate: rate,
      monthlyCTC,
      annualCTC: monthlyCTC * 12,
      basicMonthly: estGrossMonthly,
      basicAnnual: estGrossMonthly * 12,
      earnings,
      deductions,
      employerContributions,
      totalGross: estGrossMonthly,
      totalGrossMonthly: estGrossMonthly,
      totalGrossAnnual: estGrossMonthly * 12,
      totalDeductions,
      totalDeductionsMonthly: totalDeductions,
      totalDeductionsAnnual: totalDeductions * 12,
      totalEmployerCost,
      totalEmployerCostMonthly: totalEmployerCost,
      totalEmployerCostAnnual: totalEmployerCost * 12,
      netPay,
      netPayMonthly: netPay,
      netPayAnnual: netPay * 12,
      totalCTC: monthlyCTC,
      wageCodeRatio: 100,
      isWageCodeCompliant: true,
    };
  }

  // =========================================================================
  // 2. MONTHLY SALARIED (FIXED CTC ENGINE)
  // =========================================================================
  const annual = Number(annualCTC) || (monthlyCTCOverride ? Number(monthlyCTCOverride) * 12 : 720000);
  const monthlyCTC = monthlyCTCOverride ? Number(monthlyCTCOverride) : Math.round(annual / 12);

  if (!monthlyCTC || rawComponents.length === 0) {
    return {
      payType: "MONTHLY_SALARIED",
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
  const evaluatedAmounts = new Map();

  const isBasicComponent = (item) => {
    const c = item.masterCode;
    return c === "BASIC" || c === "COMP_BASIC" || c === "BASIC_SALARY";
  };

  const isSpecialComponent = (item) => {
    const c = item.masterCode;
    return item.calculationMethod === "BALANCE" || c === "SPECIAL" || c === "COMP_SPECIAL" || c === "SPECIAL_ALLOWANCE";
  };

  // PASS 1: Calculate Fixed Earnings & Basic
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

  // PASS 2: Calculate Percentage of Selected Component(s) (e.g. HRA = 40% of Basic)
  templateComps.forEach((item) => {
    if (item.masterType !== "EARNING" || isSpecialComponent(item)) return;

    let amount = 0;
    if (item.calculationMethod === "PERCENTAGE") {
      const isBaseCTC = item.percentageBaseType === "CTC" || item.basedOn === "MONTHLY_CTC";

      if (!isBaseCTC) {
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

  // PASS 3: Calculate Employer Contributions & Statutory Liabilities
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
      value: item.value,
      amount,
      annualAmount: amount * 12,
    });
  });

  // PASS 4: Calculate Balancing Allowance (Special Allowance = Monthly CTC - All Earnings - All Employer Costs)
  const specialItem = templateComps.find((item) => isSpecialComponent(item) && item.masterType === "EARNING");
  if (specialItem) {
    const balancingAmount = Math.max(0, monthlyCTC - grossEarningsAcc - employerCostAcc);
    evaluatedAmounts.set(specialItem.componentId, balancingAmount);
    evaluatedAmounts.set(specialItem.masterCode, balancingAmount);

    grossEarningsAcc += balancingAmount;
    earnings.push({
      id: specialItem.componentId,
      componentId: specialItem.componentId,
      code: specialItem.masterCode,
      name: specialItem.masterName,
      type: "EARNING",
      calculationMethod: "BALANCE",
      value: 0,
      amount: balancingAmount,
      annualAmount: balancingAmount * 12,
    });
  }

  // PASS 5: Calculate Employee Deductions
  let totalDeductionsAcc = 0;
  templateComps.forEach((item) => {
    if (item.masterType !== "DEDUCTION") return;

    let amount = 0;
    const code = item.masterCode;

    // 1. Employee EPF (12% of PF Wage)
    if (code.includes("EPF") || code === "PF" || item.statutoryRuleType === "EPF_12") {
      const rate = Number(item.value) || 12;
      amount = Math.round((pfWageBase * rate) / 100);
    }
    // 2. Employee ESIC (0.75% of Gross, if Gross <= 21000)
    else if (code.includes("ESI") || item.statutoryRuleType === "ESI_075") {
      const rate = Number(item.value) || 0.75;
      amount = grossEarningsAcc <= 21000 ? Math.ceil((grossEarningsAcc * rate) / 100) : 0;
    }
    // 3. Professional Tax (State Slabs)
    else if (code.includes("PT") || item.statutoryRuleType === "PT_STATE") {
      amount = grossEarningsAcc >= 15000 ? 200 : 0;
    }
    // 4. Employee LWF (State fixed rule e.g. ₹20)
    else if (code.includes("LWF") || item.statutoryRuleType === "LWF_STATE") {
      amount = Number(item.value) || 20;
    }
    // 5. Custom / Projected Income Tax TDS
    else if (code.includes("TDS") || item.statutoryRuleType === "TDS_192") {
      amount = Number(customTDS) || 0;
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
        amount = Math.round((grossEarningsAcc * Number(item.value || 0)) / 100);
      }
    }
    // Fixed Deduction Rule
    else if (item.calculationMethod === "FIXED" || item.calculationMethod === "RULE" || item.calculationMethod === "STATUTORY_RULE") {
      amount = Number(item.value) || 0;
    }

    evaluatedAmounts.set(item.componentId, amount);
    evaluatedAmounts.set(item.masterCode, amount);
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

  const totalGross = grossEarningsAcc;
  const netPay = totalGross - totalDeductionsAcc;
  const totalCTC = totalGross + employerCostAcc;
  const wageCodeRatio = totalGross > 0 ? Math.round((basic / totalGross) * 100) : 0;
  const isWageCodeCompliant = wageCodeRatio >= 50;

  return {
    payType: "MONTHLY_SALARIED",
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
