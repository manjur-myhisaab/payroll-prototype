import {
  INITIAL_SETTINGS,
  INITIAL_COMPONENTS,
  INITIAL_TEMPLATES,
  INITIAL_EMPLOYEES,
  INITIAL_EMPLOYEE_SALARIES,
  INITIAL_OVERTIME,
  INITIAL_INCENTIVES,
  INITIAL_LOANS,
  INITIAL_SALARY_ADVANCES,
  INITIAL_ATTENDANCE_SUMMARY,
  INITIAL_PAYROLL_RUNS,
  INITIAL_REIMBURSEMENTS,
} from "../data/seedData";

const STORAGE_KEYS = {
  SETTINGS: "hisaab_payroll_settings",
  COMPONENTS: "hisaab_salary_components",
  TEMPLATES: "hisaab_salary_templates",
  EMPLOYEES: "hisaab_employees",
  EMPLOYEE_SALARIES: "hisaab_employee_salaries",
  OVERTIME: "hisaab_overtime",
  INCENTIVES: "hisaab_incentives",
  SALARY_ADVANCES: "hisaab_salary_advances",
  LOANS: "hisaab_loans",
  REIMBURSEMENTS: "hisaab_reimbursements",
  ATTENDANCE: "hisaab_attendance",
  PAYROLL_RUNS: "hisaab_payroll_runs",
  PAYSLIPS: "hisaab_payslips",
};

// Generic safe storage helper
function getStoredItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export const storageService = {
  // Initialize storage with seed data if not present
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(INITIAL_COMPONENTS));
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE_SALARIES, JSON.stringify(INITIAL_EMPLOYEE_SALARIES));
    localStorage.setItem(STORAGE_KEYS.OVERTIME, JSON.stringify(INITIAL_OVERTIME));
    localStorage.setItem(STORAGE_KEYS.INCENTIVES, JSON.stringify(INITIAL_INCENTIVES));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE_SUMMARY));
    localStorage.setItem(STORAGE_KEYS.PAYROLL_RUNS, JSON.stringify(INITIAL_PAYROLL_RUNS));
    localStorage.setItem(STORAGE_KEYS.PAYSLIPS, JSON.stringify([]));
  },

  // Settings
  getSettings() {
    return getStoredItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  updateSettings(data) {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    setStoredItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Components
  getComponents() {
    return getStoredItem(STORAGE_KEYS.COMPONENTS, INITIAL_COMPONENTS);
  },
  createComponent(component) {
    const list = this.getComponents();
    const newComp = { ...component, id: component.id || `COMP_${Date.now()}` };
    list.unshift(newComp);
    setStoredItem(STORAGE_KEYS.COMPONENTS, list);
    return newComp;
  },
  updateComponent(id, data) {
    const list = this.getComponents();
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.COMPONENTS, list);
      return list[idx];
    }
    return null;
  },
  deleteComponent(id) {
    const list = this.getComponents().filter((c) => c.id !== id);
    setStoredItem(STORAGE_KEYS.COMPONENTS, list);
  },

  // Templates
  getTemplates() {
    return getStoredItem(STORAGE_KEYS.TEMPLATES, INITIAL_TEMPLATES);
  },
  createTemplate(template) {
    const list = this.getTemplates();
    const newTpl = { ...template, id: template.id || `TPL_${Date.now()}` };
    list.unshift(newTpl);
    setStoredItem(STORAGE_KEYS.TEMPLATES, list);
    return newTpl;
  },
  updateTemplate(id, data) {
    const list = this.getTemplates();
    const idx = list.findIndex((t) => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.TEMPLATES, list);
      return list[idx];
    }
    return null;
  },
  deleteTemplate(id) {
    const list = this.getTemplates().filter((t) => t.id !== id);
    setStoredItem(STORAGE_KEYS.TEMPLATES, list);
  },

  // Employees
  getEmployees() {
    return getStoredItem(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },
  createEmployee(employee) {
    const list = this.getEmployees();
    const newEmp = { ...employee, id: employee.id || `EMP${String(list.length + 1).padStart(3, "0")}` };
    list.push(newEmp);
    setStoredItem(STORAGE_KEYS.EMPLOYEES, list);
    return newEmp;
  },
  updateEmployee(id, data) {
    const list = this.getEmployees();
    const idx = list.findIndex((e) => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.EMPLOYEES, list);
      return list[idx];
    }
    return null;
  },

  // Employee Salaries (History aware)
  getEmployeeSalaries() {
    return getStoredItem(STORAGE_KEYS.EMPLOYEE_SALARIES, INITIAL_EMPLOYEE_SALARIES);
  },
  getActiveSalaryForEmployee(employeeId, asOfDate = null) {
    const all = this.getEmployeeSalaries().filter((s) => s.employeeId === employeeId);
    if (!asOfDate) {
      return all.find((s) => s.status === "ACTIVE" && !s.effectiveTo) || all[0];
    }
    // Date effective lookup
    const target = new Date(asOfDate).getTime();
    return all.find((s) => {
      const from = new Date(s.effectiveFrom).getTime();
      const to = s.effectiveTo ? new Date(s.effectiveTo).getTime() : Infinity;
      return target >= from && target <= to;
    }) || all[0];
  },
  assignSalaryStructure(assignment) {
    const list = this.getEmployeeSalaries();
    // Deactivate previous active structure for this employee
    const effectiveDate = new Date(assignment.effectiveFrom);
    const dayBefore = new Date(effectiveDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    const dayBeforeStr = dayBefore.toISOString().split("T")[0];

    const updatedList = list.map((item) => {
      if (item.employeeId === assignment.employeeId && item.status === "ACTIVE" && !item.effectiveTo) {
        return {
          ...item,
          effectiveTo: dayBeforeStr,
          status: "INACTIVE",
        };
      }
      return item;
    });

    const newRecord = {
      ...assignment,
      id: assignment.id || `SAL_${assignment.employeeId}_${Date.now().toString().slice(-4)}`,
      status: "ACTIVE",
      effectiveTo: null,
    };

    updatedList.unshift(newRecord);
    setStoredItem(STORAGE_KEYS.EMPLOYEE_SALARIES, updatedList);
    return newRecord;
  },
  saveEmployeeWithSalary({ employeeData, salaryData, isEdit = false }) {
    let savedEmp;
    if (isEdit && employeeData.id) {
      savedEmp = this.updateEmployee(employeeData.id, employeeData);
    } else {
      savedEmp = this.createEmployee(employeeData);
    }

    if (savedEmp && salaryData) {
      this.assignSalaryStructure({
        ...salaryData,
        employeeId: savedEmp.id,
      });
    }
    return savedEmp;
  },

  // Overtime
  getOvertime() {
    return getStoredItem(STORAGE_KEYS.OVERTIME, INITIAL_OVERTIME);
  },
  createOvertime(ot) {
    const list = this.getOvertime();
    const newOt = { ...ot, id: `OT_${Date.now().toString().slice(-5)}`, status: ot.status || "PENDING" };
    list.unshift(newOt);
    setStoredItem(STORAGE_KEYS.OVERTIME, list);
    return newOt;
  },
  updateOvertime(id, data) {
    const list = this.getOvertime();
    const idx = list.findIndex((o) => o.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.OVERTIME, list);
      return list[idx];
    }
    return null;
  },
  deleteOvertime(id) {
    const list = this.getOvertime().filter((o) => o.id !== id);
    setStoredItem(STORAGE_KEYS.OVERTIME, list);
  },

  // Incentives
  getIncentives() {
    return getStoredItem(STORAGE_KEYS.INCENTIVES, INITIAL_INCENTIVES);
  },
  createIncentive(inc) {
    const list = this.getIncentives();
    const newInc = { ...inc, id: `INC_${Date.now().toString().slice(-5)}`, status: inc.status || "PENDING" };
    list.unshift(newInc);
    setStoredItem(STORAGE_KEYS.INCENTIVES, list);
    return newInc;
  },
  updateIncentive(id, data) {
    const list = this.getIncentives();
    const idx = list.findIndex((i) => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.INCENTIVES, list);
      return list[idx];
    }
    return null;
  },
  deleteIncentive(id) {
    const list = this.getIncentives().filter((i) => i.id !== id);
    setStoredItem(STORAGE_KEYS.INCENTIVES, list);
  },

  // Salary Advances (1-month immediate recovery)
  getSalaryAdvances() {
    return getStoredItem(STORAGE_KEYS.SALARY_ADVANCES, INITIAL_SALARY_ADVANCES);
  },
  createSalaryAdvance(advance) {
    const list = this.getSalaryAdvances();
    const newAdvance = {
      ...advance,
      id: `ADV_${Date.now().toString().slice(-5)}`,
      status: advance.status || "PENDING",
      recoveredInPayrollRun: null,
    };
    list.unshift(newAdvance);
    setStoredItem(STORAGE_KEYS.SALARY_ADVANCES, list);
    return newAdvance;
  },
  updateSalaryAdvance(id, data) {
    const list = this.getSalaryAdvances();
    const idx = list.findIndex((a) => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.SALARY_ADVANCES, list);
      return list[idx];
    }
    return null;
  },
  deleteSalaryAdvance(id) {
    const list = this.getSalaryAdvances().filter((a) => a.id !== id);
    setStoredItem(STORAGE_KEYS.SALARY_ADVANCES, list);
  },

  // Multi-Month Loans with EMI & Tenures
  getLoans() {
    return getStoredItem(STORAGE_KEYS.LOANS, INITIAL_LOANS);
  },
  createLoan(loan) {
    const list = this.getLoans();
    const newLoan = {
      ...loan,
      id: `LOAN_${Date.now().toString().slice(-5)}`,
      paidAmount: 0,
      remainingBalance: loan.principalAmount,
      installmentsPaid: 0,
      totalInstallments: Number(loan.tenureMonths) || 12,
      status: "ACTIVE",
    };
    list.unshift(newLoan);
    setStoredItem(STORAGE_KEYS.LOANS, list);
    return newLoan;
  },
  updateLoan(id, data) {
    const list = this.getLoans();
    const idx = list.findIndex((l) => l.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.LOANS, list);
      return list[idx];
    }
    return null;
  },
  deleteLoan(id) {
    const list = this.getLoans().filter((l) => l.id !== id);
    setStoredItem(STORAGE_KEYS.LOANS, list);
  },

  // Reimbursements & Claims
  getReimbursements() {
    return getStoredItem(STORAGE_KEYS.REIMBURSEMENTS, INITIAL_REIMBURSEMENTS);
  },
  createReimbursement(reimb) {
    const list = this.getReimbursements();
    const newReimb = {
      ...reimb,
      id: `CLM_${Date.now().toString().slice(-5)}`,
      submittedDate: new Date().toISOString().split("T")[0],
      status: reimb.status || "PENDING",
    };
    list.unshift(newReimb);
    setStoredItem(STORAGE_KEYS.REIMBURSEMENTS, list);
    return newReimb;
  },
  updateReimbursement(id, data) {
    const list = this.getReimbursements();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.REIMBURSEMENTS, list);
      return list[idx];
    }
    return null;
  },
  deleteReimbursement(id) {
    const list = this.getReimbursements().filter((r) => r.id !== id);
    setStoredItem(STORAGE_KEYS.REIMBURSEMENTS, list);
  },

  // Attendance
  getAttendance() {
    return getStoredItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_SUMMARY);
  },
  updateAttendance(employeeId, month, data) {
    const list = this.getAttendance();
    const idx = list.findIndex((a) => a.employeeId === employeeId && a.month === month);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
    } else {
      list.push({ employeeId, month, ...data });
    }
    setStoredItem(STORAGE_KEYS.ATTENDANCE, list);
  },

  // Payroll Runs
  getPayrollRuns() {
    return getStoredItem(STORAGE_KEYS.PAYROLL_RUNS, INITIAL_PAYROLL_RUNS);
  },
  createPayrollRun(run) {
    const list = this.getPayrollRuns();
    const newRun = { ...run, id: run.id || `RUN_${run.month.replace("-", "_")}` };
    list.unshift(newRun);
    setStoredItem(STORAGE_KEYS.PAYROLL_RUNS, list);
    return newRun;
  },
  updatePayrollRun(id, data) {
    const list = this.getPayrollRuns();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.PAYROLL_RUNS, list);
      return list[idx];
    }
    return null;
  },

  // Payslips
  getPayslips() {
    return getStoredItem(STORAGE_KEYS.PAYSLIPS, []);
  },
  savePayslips(payslipsList) {
    const current = this.getPayslips();
    // Upsert payslips
    const map = new Map(current.map((p) => [p.id, p]));
    payslipsList.forEach((p) => map.set(p.id, p));
    const merged = Array.from(map.values());
    setStoredItem(STORAGE_KEYS.PAYSLIPS, merged);
    return merged;
  },
};

// Initialize right away
storageService.init();
