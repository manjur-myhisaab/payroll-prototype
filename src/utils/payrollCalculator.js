/**
 * Centralized Monthly Payroll Processing Engine
 * 
 * Takes:
 * - List of Employees
 * - Salary Assignments & Templates & Master Components
 * - Period Attendance (Payable Days & LOP Days)
 * - Approved Overtime entries for the period
 * - Approved Incentives & Bonuses for the period
 * - Active Loans & Advances EMIs
 * - Settings (Divisor rules, PF capping)
 * 
 * Returns fully calculated payroll items with detailed breakdown and payslip generator.
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
    // Find active salary for this month
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
      // Employee has no assigned salary structure
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
        earningsBreakdown: [],
        deductionsBreakdown: [],
        employerCostBreakdown: [],
      };
    }

    const template = tplMap.get(salaryRecord.templateId) || templates[0];
    const baseBreakdown = calculateSalaryBreakdown({
      annualCTC: salaryRecord.annualCTC,
      template,
      allComponents: components,
      customTDS: salaryRecord.tdsMonthly || 0,
      settings,
    });

    // 2. Fetch Attendance for the month
    const att = attendanceList.find((a) => a.employeeId === emp.id && a.month === month) || {
      totalDays: totalDaysInMonth,
      presentDays: totalDaysInMonth,
      weeklyOffs: 0,
      holidays: 0,
      paidLeaves: 0,
      unpaidLeaves: 0,
      payableDays: totalDaysInMonth,
      lopDays: 0,
    };

    const payableDays = typeof att.payableDays === "number" ? att.payableDays : totalDaysInMonth;
    const lopDays = typeof att.lopDays === "number" ? att.lopDays : Math.max(0, totalDaysInMonth - payableDays);
    const prorationRatio = Math.max(0, Math.min(1, payableDays / divisor));

    // 3. Pro-rate fixed earnings based on payable days
    const earnedEarnings = [];
    let earnedGrossAcc = 0;
    let proRatedBasic = 0;

    baseBreakdown.earnings.forEach((e) => {
      // Pro-rate regular earnings only if isProrated is true
      const shouldProrate = e.isProrated !== false;
      const finalAmount = shouldProrate ? Math.round(e.amount * prorationRatio) : e.amount;
      if (e.code === "BASIC") proRatedBasic = finalAmount;

      earnedEarnings.push({
        ...e,
        baseAmount: e.amount,
        amount: finalAmount,
        isProrated: shouldProrate,
      });
      earnedGrossAcc += finalAmount;
    });

    // 4. Overtime for this period (Approved only)
    const empOT = overtimeList
      .filter((o) => o.employeeId === emp.id && o.payrollPeriod === month && o.status === "APPROVED")
      .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    if (empOT > 0) {
      earnedEarnings.push({
        id: "VAR_OT",
        code: "OVERTIME",
        name: "Overtime Pay",
        type: "EARNING",
        calculationMethod: "PER_HOUR",
        value: empOT,
        amount: empOT,
        taxTreatment: "TAXABLE",
        isVariable: true,
      });
      earnedGrossAcc += empOT;
    }

    // 5. Incentives & Bonuses for this period (Approved only)
    const empIncentives = incentivesList
      .filter((i) => i.employeeId === emp.id && i.payrollPeriod === month && i.status === "APPROVED")
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    if (empIncentives > 0) {
      earnedEarnings.push({
        id: "VAR_INCENTIVE",
        code: "INCENTIVE",
        name: "Incentives & Performance Bonus",
        type: "EARNING",
        calculationMethod: "FIXED",
        value: empIncentives,
        amount: empIncentives,
        taxTreatment: "TAXABLE",
        isVariable: true,
      });
      earnedGrossAcc += empIncentives;
    }

    // Total Earned Gross
    const earnedGross = earnedGrossAcc;

    // 6. Calculate Deductions on pro-rated earnings
    const earnedDeductions = [];
    let totalDeductionsAcc = 0;

    const pfWageBase = settings.pfCappingEnabled !== false ? Math.min(proRatedBasic, settings.pfWageCeiling || 15000) : proRatedBasic;

    baseBreakdown.deductions.forEach((d) => {
      let deductedAmount = 0;
      if (d.code === "EPF") {
        deductedAmount = Math.round((pfWageBase * 12) / 100);
      } else if (d.code === "ESI") {
        deductedAmount = earnedGross <= 21000 ? Math.round((earnedGross * 0.75) / 100) : 0;
      } else if (d.code === "PT") {
        deductedAmount = earnedGross > 15000 ? 200 : 0;
      } else if (d.code === "TDS") {
        deductedAmount = d.amount; // Monthly TDS
      } else {
        deductedAmount = d.amount;
      }

      // Apply Maximum Deduction Cap (if specified)
      if (d.maxDeductionAmount && Number(d.maxDeductionAmount) > 0) {
        deductedAmount = Math.min(deductedAmount, Number(d.maxDeductionAmount));
      }

      earnedDeductions.push({
        ...d,
        amount: deductedAmount,
      });
      totalDeductionsAcc += deductedAmount;
    });

    // 7a. Salary Advance Deductions (100% full recovery in target recovery period)
    const empAdvances = (salaryAdvancesList || []).filter(
      (a) => a.employeeId === emp.id && a.recoveryPeriod === month && a.status === "APPROVED"
    );
    let totalAdvanceRecovery = 0;
    empAdvances.forEach((adv) => {
      totalAdvanceRecovery += Number(adv.amount);
      earnedDeductions.push({
        id: `ADV_${adv.id}`,
        code: "SALARY_ADVANCE_RECOVERY",
        name: `Salary Advance Recovery (${adv.reason || "Full Deduction"})`,
        type: "DEDUCTION",
        calculationMethod: "FIXED",
        value: adv.amount,
        amount: adv.amount,
        advanceId: adv.id,
        isVariable: true,
      });
    });
    totalDeductionsAcc += totalAdvanceRecovery;

    // 7b. Active Multi-Month Loan Deductions (Monthly EMI Recovery)
    const activeLoans = (loansList || []).filter(
      (l) => l.employeeId === emp.id && l.status === "ACTIVE" && l.remainingBalance > 0
    );
    let totalLoanEMI = 0;

    activeLoans.forEach((loan) => {
      const emiToDeduct = Math.min(loan.monthlyEMI, loan.remainingBalance);
      totalLoanEMI += emiToDeduct;
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

    totalDeductionsAcc += totalLoanEMI;

    // 8. Employer contributions recalculation on pro-rated basic
    const earnedEmployerCost = [];
    let totalEmployerCostAcc = 0;

    baseBreakdown.employerContributions.forEach((ec) => {
      let amount = 0;
      if (ec.code === "EMPLOYER_PF") {
        amount = Math.round((pfWageBase * 12) / 100);
      } else if (ec.code === "GRATUITY") {
        amount = Math.round(proRatedBasic * 0.0481);
      } else {
        amount = ec.amount;
      }

      earnedEmployerCost.push({
        ...ec,
        amount,
      });
      totalEmployerCostAcc += amount;
    });

    // 9. Approved Tax-Exempt Reimbursements for this period
    const empReimbursements = (reimbursementsList || [])
      .filter((r) => r.employeeId === emp.id && r.payrollPeriod === month && r.status === "APPROVED");
    const totalReimbursements = empReimbursements.reduce((sum, r) => sum + (Number(r.approvedAmount) || 0), 0);

    // Final Net Pay = (Earned Gross - Total Deductions) + Non-taxable Reimbursements Payout
    const netPay = earnedGross - totalDeductionsAcc + totalReimbursements;
    const totalCTC = earnedGross + totalEmployerCostAcc;

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      employeeCode: emp.id,
      designation: emp.designation,
      department: emp.department,
      bankName: emp.bankName || "HDFC Bank",
      bankAccount: emp.bankAccount,
      ifscCode: emp.ifscCode,
      pan: emp.pan,
      uan: emp.uan,
      templateName: template.name,
      templateId: template.id,
      annualCTC: salaryRecord.annualCTC,
      monthlyCTC: baseBreakdown.monthlyCTC,
      totalDays: totalDaysInMonth,
      payableDays,
      lopDays,
      earnedBasic: proRatedBasic,
      earnedGross,
      totalDeductions: totalDeductionsAcc,
      reimbursementsAmount: totalReimbursements,
      netPay,
      totalEmployerCost: totalEmployerCostAcc,
      totalCTC,
      overtimeAmount: empOT,
      incentivesAmount: empIncentives,
      salaryAdvanceAmount: totalAdvanceRecovery,
      loanDeductionAmount: totalLoanEMI,
      earnings: earnedEarnings,
      deductions: earnedDeductions,
      reimbursements: empReimbursements,
      employerContributions: earnedEmployerCost,
      status: "CALCULATED",
    };
  });

  // Roll-up summary totals
  const totalEmployees = records.length;
  const totalGross = records.reduce((s, r) => s + (r.earnedGross || 0), 0);
  const totalDeductions = records.reduce((s, r) => s + (r.totalDeductions || 0), 0);
  const totalNetPay = records.reduce((s, r) => s + (r.netPay || 0), 0);
  const totalEmployerCost = records.reduce((s, r) => s + (r.totalEmployerCost || 0), 0);
  const totalCTC = records.reduce((s, r) => s + (r.totalCTC || 0), 0);

  return {
    month,
    totalEmployees,
    totalGross,
    totalDeductions,
    totalNetPay,
    totalEmployerCost,
    totalCTC,
    records,
  };
}
