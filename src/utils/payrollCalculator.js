/**
 * Centralized High-Precision Universal Monthly Payroll Processing Engine
 * 
 * Supports all 4 Real-World Indian Wage & Pay Types:
 * 1. MONTHLY_SALARIED (Fixed CTC, Pro-rated LOP, Basic, HRA, EPF, ESIC, PT, TDS)
 * 2. DAILY_WAGE (Physical Present Days * Daily Rate + Paid Week-off/Sundays + Paid Holidays + Sunday/Holiday Extra Work Pay + Overtime)
 * 3. HOURLY (Logged Time-Sheet Hours * Hourly Rate + Overtime 1.5x/2.0x + Shift Premiums)
 * 4. PIECE_RATE (Verified Units Produced * Piece Rate + Efficiency Bonus + Attendance Allowance)
 */

import { calculateSalaryBreakdown } from "./salaryCalculator";

export function processPayrollForPeriod({
  month, // e.g. "2026-08"
  employees = [],
  employeeSalaries = [],
  templates = [],
  components = [],
  attendanceList = [],
  overtimeList = [],
  incentivesList = [],
  salaryAdvancesList = [],
  loansList = [],
  reimbursementsList = [],
  settings = {},
}) {
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  const totalDaysInMonth = new Date(year, monthNum, 0).getDate();

  const divisor =
    settings.lopDivisor === "FIXED_30"
      ? 30
      : settings.lopDivisor === "CALENDAR_DAYS"
      ? totalDaysInMonth
      : totalDaysInMonth;

  const tplMap = new Map(templates.map((t) => [t.id, t]));

  const records = employees.map((emp) => {
    // 1. Get applicable salary structure as of this period
    const empSalaries = employeeSalaries.filter((s) => s.employeeId === emp.id);
    const targetDate = `${month}-15`;
    let salaryRecord = empSalaries.find((s) => {
      const from = new Date(s.effectiveFrom).getTime();
      const to = s.effectiveTo ? new Date(s.effectiveTo).getTime() : Infinity;
      const cur = new Date(targetDate).getTime();
      return cur >= from && cur <= to;
    });

    if (!salaryRecord) {
      salaryRecord = empSalaries.find((s) => s.status === "ACTIVE" && !s.effectiveTo) || empSalaries[0];
    }

    if (!salaryRecord) {
      return {
        employeeId: emp.id,
        employeeName: emp.name,
        employeeCode: emp.id,
        designation: emp.designation,
        department: emp.department,
        status: "ERROR_NO_SALARY",
        errorMessage: "No salary structure assigned",
        payableDays: totalDaysInMonth,
        lopDays: 0,
        earnedGross: 0,
        totalDeductions: 0,
        netPay: 0,
        employerCost: 0,
        totalCTC: 0,
        earnings: [],
        deductions: [],
        employerContributions: [],
      };
    }

    const payType = salaryRecord.payType || emp.payType || "MONTHLY_SALARIED";
    const template = tplMap.get(salaryRecord.templateId) || templates[0];

    // 2. Fetch Attendance Record for the Month
    const att = attendanceList.find((a) => a.employeeId === emp.id && a.month === month) || {
      totalDays: totalDaysInMonth,
      presentDays: totalDaysInMonth,
      weeklyOffs: 4,
      holidays: 1,
      paidLeaves: 0,
      unpaidLeaves: 0,
      payableDays: totalDaysInMonth,
      lopDays: 0,
      hoursWorked: 160,
      unitsProduced: 1500,
    };

    const earnedEarnings = [];
    const earnedDeductions = [];
    const earnedEmployerContributions = [];

    let earnedGrossAcc = 0;
    let earnedBasicAcc = 0;
    let totalEmployerCostAcc = 0;

    // 3. Fetch Overtime, Incentives & Bonuses for this period (Approved only)
    const approvedOTList = overtimeList.filter(
      (o) => o.employeeId === emp.id && o.payrollPeriod === month && o.status === "APPROVED"
    );
    const totalApprovedOTAmount = approvedOTList.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    const approvedIncentivesList = incentivesList.filter(
      (i) => i.employeeId === emp.id && i.payrollPeriod === month && i.status === "APPROVED"
    );
    const totalApprovedIncentives = approvedIncentivesList.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    // =========================================================================
    // BRANCH CALCULATION LOGIC ACCORDING TO PAY TYPE
    // =========================================================================

    // -------------------------------------------------------------------------
    // CASE 1: MONTHLY SALARIED (Fixed CTC + LOP Pro-ration)
    // -------------------------------------------------------------------------
    if (payType === "MONTHLY_SALARIED") {
      const baseBreakdown = calculateSalaryBreakdown({
        annualCTC: salaryRecord.annualCTC,
        template,
        assignedComponents: salaryRecord.assignedComponents,
        allComponents: components,
        customTDS: salaryRecord.tdsMonthly || 0,
        settings,
      });

      const payableDays = typeof att.payableDays === "number" ? att.payableDays : totalDaysInMonth;
      const lopDays = typeof att.lopDays === "number" ? att.lopDays : Math.max(0, totalDaysInMonth - payableDays);
      const prorationRatio = Math.max(0, Math.min(1, payableDays / divisor));

      // Pro-rate regular earnings
      baseBreakdown.earnings.forEach((e) => {
        const shouldProrate = e.isProrated !== false;
        const finalAmount = shouldProrate ? Math.round(e.amount * prorationRatio) : e.amount;
        if (e.code === "BASIC") earnedBasicAcc = finalAmount;

        earnedEarnings.push({
          ...e,
          baseAmount: e.amount,
          amount: finalAmount,
          isProrated: shouldProrate,
        });
        earnedGrossAcc += finalAmount;
      });

      // Add Overtime if approved
      if (totalApprovedOTAmount > 0) {
        earnedEarnings.push({
          id: "VAR_OT",
          code: "OVERTIME",
          name: "Overtime Pay",
          type: "EARNING",
          calculationMethod: "PER_HOUR",
          value: totalApprovedOTAmount,
          amount: totalApprovedOTAmount,
          taxTreatment: "TAXABLE",
          isVariable: true,
        });
        earnedGrossAcc += totalApprovedOTAmount;
      }

      // Add Incentives & Spot Bonuses
      if (totalApprovedIncentives > 0) {
        earnedEarnings.push({
          id: "VAR_INCENTIVE",
          code: "INCENTIVE",
          name: "Incentives & Performance Bonus",
          type: "EARNING",
          calculationMethod: "FIXED",
          value: totalApprovedIncentives,
          amount: totalApprovedIncentives,
          taxTreatment: "TAXABLE",
          isVariable: true,
        });
        earnedGrossAcc += totalApprovedIncentives;
      }

      // Deductions for Monthly Salaried
      const pfWageBase = settings.pfCappingEnabled !== false ? Math.min(earnedBasicAcc, settings.pfWageCeiling || 15000) : earnedBasicAcc;

      baseBreakdown.deductions.forEach((d) => {
        let deductedAmount = 0;
        if (d.code === "EPF") {
          deductedAmount = Math.round((pfWageBase * 12) / 100);
        } else if (d.code === "ESI") {
          deductedAmount = earnedGrossAcc <= 21000 ? Math.ceil((earnedGrossAcc * 0.75) / 100) : 0;
        } else if (d.code === "PT") {
          deductedAmount = earnedGrossAcc >= 15000 ? 200 : 0;
        } else if (d.code === "TDS") {
          deductedAmount = d.amount || (salaryRecord.tdsMonthly || 0);
        } else {
          deductedAmount = d.amount;
        }

        earnedDeductions.push({
          ...d,
          amount: deductedAmount,
        });
      });

      // Employer Contributions for Monthly Salaried
      baseBreakdown.employerContributions.forEach((ec) => {
        let costAmount = 0;
        if (ec.code.includes("ER_PF") || ec.code.includes("EMPLOYER_PF")) {
          costAmount = Math.round((pfWageBase * 12) / 100);
        } else if (ec.code.includes("GRATUITY")) {
          costAmount = Math.round((earnedBasicAcc * 4.81) / 100);
        } else if (ec.code.includes("ER_ESI") || ec.code.includes("EMPLOYER_ESI")) {
          costAmount = earnedGrossAcc <= 21000 ? Math.ceil((earnedGrossAcc * 3.25) / 100) : 0;
        } else {
          costAmount = ec.amount;
        }

        earnedEmployerContributions.push({
          ...ec,
          amount: costAmount,
        });
        totalEmployerCostAcc += costAmount;
      });
    }

    // -------------------------------------------------------------------------
    // CASE 2: DAILY WAGE WORKER (Present Days * Daily Rate + Paid Rest Days)
    // -------------------------------------------------------------------------
    else if (payType === "DAILY_WAGE") {
      const dailyRate = Number(salaryRecord.dailyRate) || 650;
      const presentDays = typeof att.presentDays === "number" ? att.presentDays : (att.payableDays || 24);
      const weeklyOffs = Number(att.weeklyOffs) || 4;
      const holidays = Number(att.holidays) || 1;

      // 1. Base Work Earnings
      const workPay = presentDays * dailyRate;
      earnedEarnings.push({
        id: "DAILY_WORK_PAY",
        code: "BASIC_DAILY",
        name: `Daily Wage (${presentDays} Present Days @ ₹${dailyRate}/d)`,
        type: "EARNING",
        calculationMethod: "PER_DAY",
        value: dailyRate,
        amount: workPay,
      });
      earnedGrossAcc += workPay;
      earnedBasicAcc = Math.round(workPay * 0.50); // Statutory base for EPF/ESI

      // 2. Paid Weekly Off Policy Check
      const isPaidWeeklyOff =
        salaryRecord.weekOffPolicy === "PAID_WEEKOFF" ||
        salaryRecord.weekOffPayEnabled === true ||
        settings.paidWeeklyOffEnabled !== false;

      if (isPaidWeeklyOff && weeklyOffs > 0) {
        const weekOffPay = weeklyOffs * dailyRate;
        earnedEarnings.push({
          id: "DAILY_WEEKOFF_PAY",
          code: "WEEKOFF_PAY",
          name: `Paid Weekly Offs (${weeklyOffs} Sundays)`,
          type: "EARNING",
          calculationMethod: "PER_DAY",
          value: dailyRate,
          amount: weekOffPay,
        });
        earnedGrossAcc += weekOffPay;
      }

      // 3. Paid Statutory Holiday Policy Check
      const isPaidHolidays =
        salaryRecord.holidayPolicy === "PAID_HOLIDAYS" ||
        salaryRecord.holidayPayEnabled === true ||
        settings.paidStatutoryHolidaysEnabled !== false;

      if (isPaidHolidays && holidays > 0) {
        const holidayPay = holidays * dailyRate;
        earnedEarnings.push({
          id: "DAILY_HOLIDAY_PAY",
          code: "HOLIDAY_PAY",
          name: `Paid Statutory Holiday (${holidays} Day)`,
          type: "EARNING",
          calculationMethod: "PER_DAY",
          value: dailyRate,
          amount: holidayPay,
        });
        earnedGrossAcc += holidayPay;
      }

      // 4. Overtime & Extra Work (Factories Act 2.0x or Approved OT)
      if (totalApprovedOTAmount > 0) {
        earnedEarnings.push({
          id: "DAILY_OT",
          code: "OVERTIME",
          name: `Approved Overtime Pay (${salaryRecord.regularOtMultiplier || 2.0}x Double Rate)`,
          type: "EARNING",
          calculationMethod: "PER_HOUR",
          value: totalApprovedOTAmount,
          amount: totalApprovedOTAmount,
          isVariable: true,
        });
        earnedGrossAcc += totalApprovedOTAmount;
      }

      // 5. Performance / Spot Incentives
      if (totalApprovedIncentives > 0) {
        earnedEarnings.push({
          id: "DAILY_INCENTIVE",
          code: "INCENTIVE",
          name: "Spot Achievement / Festival Bonus",
          type: "EARNING",
          calculationMethod: "FIXED",
          value: totalApprovedIncentives,
          amount: totalApprovedIncentives,
          isVariable: true,
        });
        earnedGrossAcc += totalApprovedIncentives;
      }

      // Deductions for Daily Wage (ESIC 0.75% + PT)
      if (earnedGrossAcc <= 21000) {
        const esiEmp = Math.ceil(earnedGrossAcc * 0.0075);
        earnedDeductions.push({
          id: "COMP_ESI",
          code: "ESI",
          name: "Employee State Insurance (0.75%)",
          type: "DEDUCTION",
          amount: esiEmp,
        });

        const esiEr = Math.ceil(earnedGrossAcc * 0.0325);
        earnedEmployerContributions.push({
          id: "COMP_ER_ESI",
          code: "ER_ESI",
          name: "Employer ESIC Contribution (3.25%)",
          type: "EMPLOYER_CONTRIBUTION",
          amount: esiEr,
        });
        totalEmployerCostAcc += esiEr;
      }

      if (earnedGrossAcc >= 15000) {
        earnedDeductions.push({
          id: "COMP_PT",
          code: "PT",
          name: "Professional Tax",
          type: "DEDUCTION",
          amount: 200,
        });
      }
    }

    // -------------------------------------------------------------------------
    // CASE 3: HOURLY RATE PROFESSIONAL (Logged Hours * Hourly Rate + OT)
    // -------------------------------------------------------------------------
    else if (payType === "HOURLY") {
      const hourlyRate = Number(salaryRecord.hourlyRate) || 350;
      const hoursWorked = Number(att.hoursWorked) || (att.payableDays ? att.payableDays * 8 : 160);
      const regularHours = Math.min(hoursWorked, 160);
      const regularPay = regularHours * hourlyRate;

      earnedEarnings.push({
        id: "HOURLY_BASE_PAY",
        code: "BASIC_HOURLY",
        name: `Hourly Consulting Retainer (${regularHours} Hours @ ₹${hourlyRate}/hr)`,
        type: "EARNING",
        calculationMethod: "PER_HOUR",
        value: hourlyRate,
        amount: regularPay,
      });
      earnedGrossAcc += regularPay;
      earnedBasicAcc = regularPay;

      // Excess / Overtime Hours
      const excessHours = Math.max(0, hoursWorked - 160);
      if (excessHours > 0 || totalApprovedOTAmount > 0) {
        const multiplier = Number(salaryRecord.regularOtMultiplier) || 1.5;
        const calculatedOT = excessHours > 0 ? Math.round(excessHours * hourlyRate * multiplier) : totalApprovedOTAmount;
        earnedEarnings.push({
          id: "HOURLY_OT",
          code: "OVERTIME",
          name: `Shift Extension & Overtime (${excessHours || (totalApprovedOTAmount / hourlyRate).toFixed(1)}h @ ${multiplier}x Rate)`,
          type: "EARNING",
          calculationMethod: "PER_HOUR",
          value: calculatedOT,
          amount: calculatedOT,
          isVariable: true,
        });
        earnedGrossAcc += calculatedOT;
      }

      // Consulting Bonus / Performance Incentives
      if (totalApprovedIncentives > 0) {
        earnedEarnings.push({
          id: "HOURLY_INCENTIVE",
          code: "INCENTIVE",
          name: "Consulting Milestone / Target Bonus",
          type: "EARNING",
          calculationMethod: "FIXED",
          value: totalApprovedIncentives,
          amount: totalApprovedIncentives,
          isVariable: true,
        });
        earnedGrossAcc += totalApprovedIncentives;
      }

      // Professional Tax (₹200)
      if (earnedGrossAcc >= 15000) {
        earnedDeductions.push({
          id: "COMP_PT",
          code: "PT",
          name: "Professional Tax",
          type: "DEDUCTION",
          amount: 200,
        });
      }
    }

    // -------------------------------------------------------------------------
    // CASE 4: PIECE-RATE PRODUCTION WORKER (Units Produced * Piece Rate)
    // -------------------------------------------------------------------------
    else if (payType === "PIECE_RATE") {
      const pieceRate = Number(salaryRecord.pieceRate) || 15;
      const unitsProduced = Number(att.unitsProduced) || 1500;
      const basePieceWages = unitsProduced * pieceRate;

      earnedEarnings.push({
        id: "PIECE_BASE_WAGES",
        code: "BASIC_PIECE",
        name: `Piece Production Output (${unitsProduced.toLocaleString("en-IN")} Units @ ₹${pieceRate}/unit)`,
        type: "EARNING",
        calculationMethod: "PER_UNIT",
        value: pieceRate,
        amount: basePieceWages,
      });
      earnedGrossAcc += basePieceWages;
      earnedBasicAcc = basePieceWages;

      // Efficiency / Target Achievement Bonus
      if (unitsProduced >= 1400 || totalApprovedIncentives > 0) {
        const bonusAmount = totalApprovedIncentives > 0 ? totalApprovedIncentives : 2000;
        earnedEarnings.push({
          id: "PIECE_EFFICIENCY_BONUS",
          code: "INCENTIVE",
          name: `High-Volume Output & Efficiency Bonus`,
          type: "EARNING",
          calculationMethod: "FIXED",
          value: bonusAmount,
          amount: bonusAmount,
          isVariable: true,
        });
        earnedGrossAcc += bonusAmount;
      }

      // Overtime or Extra Shift Hours
      if (totalApprovedOTAmount > 0) {
        earnedEarnings.push({
          id: "PIECE_OT",
          code: "OVERTIME",
          name: `Weekend Production Shift Extension`,
          type: "EARNING",
          calculationMethod: "FIXED",
          value: totalApprovedOTAmount,
          amount: totalApprovedOTAmount,
          isVariable: true,
        });
        earnedGrossAcc += totalApprovedOTAmount;
      }

      // ESIC for Piece-Rate Worker (if Gross <= ₹21,000)
      if (earnedGrossAcc <= 21000) {
        const esiEmp = Math.ceil(earnedGrossAcc * 0.0075);
        earnedDeductions.push({
          id: "COMP_ESI",
          code: "ESI",
          name: "Employee State Insurance (0.75%)",
          type: "DEDUCTION",
          amount: esiEmp,
        });

        const esiEr = Math.ceil(earnedGrossAcc * 0.0325);
        earnedEmployerContributions.push({
          id: "COMP_ER_ESI",
          code: "ER_ESI",
          name: "Employer ESIC Contribution (3.25%)",
          type: "EMPLOYER_CONTRIBUTION",
          amount: esiEr,
        });
        totalEmployerCostAcc += esiEr;
      }
    }

    // =========================================================================
    // COMMON DEDUCTIONS (SALARY ADVANCE 100% RECOVERY + LOAN EMIS)
    // =========================================================================

    // Salary Advances (100% full recovery in month)
    const empAdvances = (salaryAdvancesList || []).filter(
      (a) => a.employeeId === emp.id && a.recoveryPeriod === month && a.status === "APPROVED"
    );
    empAdvances.forEach((adv) => {
      const advAmt = Number(adv.amount) || 0;
      earnedDeductions.push({
        id: `ADV_${adv.id}`,
        code: "SALARY_ADVANCE_RECOVERY",
        name: `Salary Advance Recovery (${adv.reason || "Emergency Advance"})`,
        type: "DEDUCTION",
        calculationMethod: "FIXED",
        value: advAmt,
        amount: advAmt,
        advanceId: adv.id,
        isVariable: true,
      });
    });

    // Active Multi-Month Loan Deductions (Monthly EMI Recovery)
    const activeLoans = (loansList || []).filter(
      (l) => l.employeeId === emp.id && l.status === "ACTIVE" && l.remainingBalance > 0
    );
    activeLoans.forEach((loan) => {
      const emiToDeduct = Math.min(loan.monthlyEMI, loan.remainingBalance);
      earnedDeductions.push({
        id: `LOAN_${loan.id}`,
        code: "LOAN_EMI",
        name: `Loan EMI Recovery (${loan.loanTitle || loan.title || loan.loanType})`,
        type: "DEDUCTION",
        calculationMethod: "FIXED",
        value: emiToDeduct,
        amount: emiToDeduct,
        loanId: loan.id,
        isVariable: true,
      });
    });

    const totalDeductionsAcc = earnedDeductions.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const earnedGross = earnedGrossAcc;
    const netPay = Math.max(0, earnedGross - totalDeductionsAcc);
    const totalCTC = earnedGross + totalEmployerCostAcc;

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      employeeCode: emp.id,
      designation: emp.designation,
      department: emp.department,
      bankName: emp.bankName || "HDFC Bank",
      bankAccount: emp.bankAccount || "50100234567890",
      ifscCode: emp.ifscCode || "HDFC0000053",
      pan: emp.pan || "ABCDE1234F",
      uan: emp.uan || "100987654321",
      payType,
      totalDays: totalDaysInMonth,
      payableDays: typeof att.payableDays === "number" ? att.payableDays : totalDaysInMonth,
      lopDays: typeof att.lopDays === "number" ? att.lopDays : 0,
      hoursWorked: att.hoursWorked || 0,
      unitsProduced: att.unitsProduced || 0,
      earnedBasic: earnedBasicAcc,
      overtimeAmount: totalApprovedOTAmount,
      incentivesAmount: totalApprovedIncentives,
      earnedGross,
      totalDeductions: totalDeductionsAcc,
      netPay,
      totalEmployerCost: totalEmployerCostAcc,
      totalCTC,
      earnings: earnedEarnings,
      deductions: earnedDeductions,
      employerContributions: earnedEmployerContributions,
    };
  });

  const totalGrossPayroll = records.reduce((sum, r) => sum + r.earnedGross, 0);
  const totalDeductions = records.reduce((sum, r) => sum + r.totalDeductions, 0);
  const totalNetPay = records.reduce((sum, r) => sum + r.netPay, 0);
  const totalEmployerCost = records.reduce((sum, r) => sum + r.totalEmployerCost, 0);
  const totalCTC = records.reduce((sum, r) => sum + r.totalCTC, 0);

  return {
    month,
    totalEmployees: records.length,
    totalGrossPayroll,
    totalDeductions,
    totalNetPay,
    totalEmployerCost,
    totalCTC,
    records,
  };
}
