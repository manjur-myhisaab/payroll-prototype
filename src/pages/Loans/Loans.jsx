import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR } from "../../utils/formatters";
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  TrendingDown,
  Calendar,
  Layers,
  ChevronRight,
  AlertCircle,
  Trash2,
  Zap,
  Building,
  FileSpreadsheet,
  Percent,
} from "lucide-react";

export default function LoansAndAdvances() {
  const { showToast } = useToast();
  // 2 Distinct Tabs: ADVANCES vs LOANS
  const [activeTab, setActiveTab] = useState("ADVANCES"); // "ADVANCES" | "LOANS"

  const [advances, setAdvances] = useState([]);
  const [loans, setLoans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("2026-08");

  // Modals
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [scheduleModalLoan, setScheduleModalLoan] = useState(null);

  // Forms
  const [advanceForm, setAdvanceForm] = useState({
    employeeId: "",
    amount: "",
    disbursementDate: new Date().toISOString().split("T")[0],
    recoveryPeriod: "2026-08",
    reason: "",
  });

  const [loanForm, setLoanForm] = useState({
    employeeId: "",
    loanTitle: "",
    loanType: "PERSONAL_LOAN",
    principalAmount: "",
    interestRate: 0,
    repaymentType: "FIXED_EMI",
    tenureMonths: 12,
    disbursementDate: new Date().toISOString().split("T")[0],
    repaymentStartPeriod: "2026-08",
    reason: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAdvances(storageService.getSalaryAdvances());
    setLoans(storageService.getLoans());
    const emps = storageService.getEmployees();
    setEmployees(emps);
    if (emps.length > 0 && !advanceForm.employeeId) {
      setAdvanceForm((prev) => ({ ...prev, employeeId: emps[0].id }));
      setLoanForm((prev) => ({ ...prev, employeeId: emps[0].id }));
    }
  };

  // -------------------------------------------------------------
  // SALARY ADVANCES HANDLERS (Same-Month Full Deduction)
  // -------------------------------------------------------------
  const handleOpenCreateAdvance = () => {
    setAdvanceForm({
      employeeId: employees[0]?.id || "",
      amount: "",
      disbursementDate: new Date().toISOString().split("T")[0],
      recoveryPeriod: filterPeriod === "ALL" ? "2026-08" : filterPeriod,
      reason: "",
    });
    setAdvanceModalOpen(true);
  };

  const handleCreateAdvance = (e) => {
    e.preventDefault();
    if (!advanceForm.employeeId || !advanceForm.amount) {
      showToast("Please select employee and advance amount", "warning");
      return;
    }

    const emp = employees.find((e) => e.id === advanceForm.employeeId);
    const newAdv = {
      ...advanceForm,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Unknown",
      amount: Number(advanceForm.amount),
      status: "APPROVED",
    };

    storageService.createSalaryAdvance(newAdv);
    loadData();
    setAdvanceModalOpen(false);
    showToast(`Salary advance of ${formatINR(newAdv.amount)} approved for full recovery in ${newAdv.recoveryPeriod} payroll!`);
  };

  const handleDeleteAdvance = (id) => {
    if (window.confirm("Are you sure you want to delete this salary advance entry?")) {
      storageService.deleteSalaryAdvance(id);
      loadData();
      showToast("Salary advance entry deleted");
    }
  };

  // -------------------------------------------------------------
  // MULTI-MONTH LOANS & EMI HANDLERS
  // -------------------------------------------------------------
  const calculateLoanEMI = (principal, tenureMonths, annualInterestRate, repaymentType) => {
    const P = Number(principal) || 0;
    const N = Number(tenureMonths) || 1;
    const R = (Number(annualInterestRate) || 0) / 12 / 100;

    if (repaymentType === "FIXED_EMI" || R === 0) {
      return Math.round(P / N);
    }
    // Reducing balance EMI formula: [P * R * (1+R)^N] / [(1+R)^N - 1]
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    return Math.round(emi);
  };

  const handleOpenCreateLoan = () => {
    setLoanForm({
      employeeId: employees[0]?.id || "",
      loanTitle: "Personal Emergency Loan",
      loanType: "PERSONAL_LOAN",
      principalAmount: "",
      interestRate: 0,
      repaymentType: "FIXED_EMI",
      tenureMonths: 12,
      disbursementDate: new Date().toISOString().split("T")[0],
      repaymentStartPeriod: "2026-08",
      reason: "",
    });
    setLoanModalOpen(true);
  };

  const handleCreateLoan = (e) => {
    e.preventDefault();
    if (!loanForm.employeeId || !loanForm.principalAmount || !loanForm.tenureMonths) {
      showToast("Please fill all required loan parameters", "warning");
      return;
    }

    const emp = employees.find((e) => e.id === loanForm.employeeId);
    const emi = calculateLoanEMI(
      loanForm.principalAmount,
      loanForm.tenureMonths,
      loanForm.interestRate,
      loanForm.repaymentType
    );

    const newLoan = {
      ...loanForm,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Unknown",
      principalAmount: Number(loanForm.principalAmount),
      interestRate: Number(loanForm.interestRate) || 0,
      tenureMonths: Number(loanForm.tenureMonths),
      monthlyEMI: emi,
      paidAmount: 0,
      remainingBalance: Number(loanForm.principalAmount),
      installmentsPaid: 0,
      totalInstallments: Number(loanForm.tenureMonths),
      status: "ACTIVE",
    };

    storageService.createLoan(newLoan);
    loadData();
    setLoanModalOpen(false);
    showToast(`Employee loan of ${formatINR(newLoan.principalAmount)} created with EMI of ${formatINR(emi)}/month`);
  };

  const handleDeleteLoan = (id) => {
    if (window.confirm("Are you sure you want to delete this loan record?")) {
      storageService.deleteLoan(id);
      loadData();
      showToast("Loan record deleted");
    }
  };

  // Generate month-by-month repayment schedule
  const generateRepaymentSchedule = (loan) => {
    if (!loan) return [];
    const schedule = [];
    let currentBalance = loan.principalAmount;
    const startStr = loan.repaymentStartPeriod || "2026-08";
    const [startYear, startMonth] = startStr.split("-").map(Number);

    for (let i = 0; i < loan.tenureMonths; i++) {
      const d = new Date(startYear, startMonth - 1 + i, 1);
      const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const isPaid = i < (loan.installmentsPaid || 0);
      const emi = Math.min(loan.monthlyEMI, currentBalance);
      currentBalance = Math.max(0, currentBalance - emi);

      schedule.push({
        installmentNumber: i + 1,
        period,
        monthName: d.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        emiAmount: loan.monthlyEMI,
        remainingBalance: currentBalance,
        status: isPaid ? "PAID" : i === (loan.installmentsPaid || 0) ? "UPCOMING" : "SCHEDULED",
      });
    }
    return schedule;
  };

  // Filtered Lists
  const filteredAdvances = advances.filter((a) => {
    const matchSearch =
      (a.employeeName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.reason || "").toLowerCase().includes(search.toLowerCase());
    const matchPeriod = filterPeriod === "ALL" || a.recoveryPeriod === filterPeriod;
    return matchSearch && matchPeriod;
  });

  const filteredLoans = loans.filter((l) => {
    return (
      (l.employeeName || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.loanTitle || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.loanType || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  // KPIs
  const totalAdvancesThisMonth = filteredAdvances.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const totalActiveLoansPrincipal = filteredLoans
    .filter((l) => l.status === "ACTIVE")
    .reduce((s, l) => s + (Number(l.principalAmount) || 0), 0);
  const totalRemainingLoansBalance = filteredLoans
    .filter((l) => l.status === "ACTIVE")
    .reduce((s, l) => s + (Number(l.remainingBalance) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <DollarSign className="size-5 text-indigo-400" />
            Salary Advances & Employee Loans Hub
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Separate workflows for immediate same-month salary advances and multi-period EMI loans with tenures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "ADVANCES" ? (
            <button
              onClick={handleOpenCreateAdvance}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-600/15 flex items-center gap-2"
            >
              <Zap className="size-4" />
              Issue Salary Advance
            </button>
          ) : (
            <button
              onClick={handleOpenCreateLoan}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
            >
              <Plus className="size-4" />
              Create Employee Loan
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation (Distinct Tabs for Salary Advance vs Multi-Month Loan) */}
      <div className="flex border-b border-zinc-800 gap-8 text-xs font-bold text-zinc-400 px-2">
        <button
          onClick={() => setActiveTab("ADVANCES")}
          className={`pb-3 transition-all flex items-center gap-2 ${
            activeTab === "ADVANCES"
              ? "text-amber-400 border-b-2 border-amber-500 font-extrabold"
              : "hover:text-zinc-200"
          }`}
        >
          <Zap className="size-4" />
          <span>⚡ Salary Advances (Same-Month 100% Recovery)</span>
          <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/20">
            {advances.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("LOANS")}
          className={`pb-3 transition-all flex items-center gap-2 ${
            activeTab === "LOANS"
              ? "text-indigo-400 border-b-2 border-indigo-500 font-extrabold"
              : "hover:text-zinc-200"
          }`}
        >
          <Building className="size-4" />
          <span>🏦 Employee Loans & EMI Tenures (Multi-Month)</span>
          <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full text-[10px] border border-indigo-500/20">
            {loans.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SALARY ADVANCES (Same-Month 100% Recovery) */}
      {/* ========================================================= */}
      {activeTab === "ADVANCES" && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
            <Zap className="size-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold text-amber-300">How Salary Advance Works:</strong>
              Salary advance is a short-term wage advance given mid-month before salary credit. It is <strong>deducted 100% in full</strong> from the employee's upcoming salary payout for that target month.
            </div>
          </div>

          {/* Advances KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Total Advances ({filterPeriod})</span>
              <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">{formatINR(totalAdvancesThisMonth)}</div>
              <span className="text-[11px] text-zinc-500 mt-1 block">To be recovered in {filterPeriod} payroll</span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Approved for Recovery</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {filteredAdvances.filter((a) => a.status === "APPROVED").length} Advances
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">Auto-deducted in upcoming pay cycle</span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Recovery Policy</span>
              <div className="text-sm font-bold text-zinc-200 mt-1">100% Full Deduction</div>
              <span className="text-[11px] text-zinc-500 mt-1 block">0% Interest • Single monthly deduction</span>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/30 p-3.5 rounded-xl border border-zinc-800/60 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="size-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search employee, advance reason..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500 w-64"
                />
              </div>

              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-amber-500 font-semibold"
              >
                <option value="ALL">All Recovery Periods</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-09">September 2026</option>
              </select>
            </div>
          </div>

          {/* Advances Table */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Employee</th>
                  <th className="p-3.5">Disbursement Date</th>
                  <th className="p-3.5">Target Recovery Month</th>
                  <th className="p-3.5 text-right">Advance Amount (₹)</th>
                  <th className="p-3.5">Reason / Purpose</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredAdvances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-zinc-500">
                      No salary advances issued for this period.
                    </td>
                  </tr>
                ) : (
                  filteredAdvances.map((adv) => (
                    <tr key={adv.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-zinc-200">{adv.employeeName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{adv.employeeId}</div>
                      </td>
                      <td className="p-3.5 text-zinc-300 font-mono text-[11px]">{adv.disbursementDate}</td>
                      <td className="p-3.5 font-bold text-amber-400 font-mono">{adv.recoveryPeriod} (100% Deduct)</td>
                      <td className="p-3.5 text-right font-mono font-bold text-zinc-100 text-sm">
                        {formatINR(adv.amount)}
                      </td>
                      <td className="p-3.5 text-zinc-400 max-w-xs truncate">{adv.reason || "Short-term wage advance"}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {adv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteAdvance(adv.id)}
                          className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete Advance Entry"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: EMPLOYEE LOANS & EMI TENURES (Multi-Month) */}
      {/* ========================================================= */}
      {activeTab === "LOANS" && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl flex items-start gap-3 text-xs text-indigo-200">
            <Building className="size-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold text-indigo-300">How Multi-Month Loans Work:</strong>
              Employee loans support multi-month tenures (e.g. 6, 12, 24 months) with **Fixed Principal EMI** or **Reducing Balance Interest**. Monthly EMIs are deducted continuously across payroll periods until the balance is ₹0.
            </div>
          </div>

          {/* Loans KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Total Active Loans Principal</span>
              <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">{formatINR(totalActiveLoansPrincipal)}</div>
              <span className="text-[11px] text-zinc-500 mt-1 block">Disbursed company loans</span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Outstanding Balance</span>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{formatINR(totalRemainingLoansBalance)}</div>
              <span className="text-[11px] text-zinc-500 mt-1 block">Yet to be recovered across tenures</span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Total Principal Recovered</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {formatINR(totalActiveLoansPrincipal - totalRemainingLoansBalance)}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">Recovered via payroll EMIs</span>
            </div>
          </div>

          {/* Loans Cards / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLoans.map((loan) => {
              const percentPaid = Math.round((loan.paidAmount / loan.principalAmount) * 100) || 0;
              return (
                <div
                  key={loan.id}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4 hover:border-zinc-700 transition-all shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100">{loan.loanTitle}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {loan.employeeName} <span className="font-mono text-zinc-500">({loan.employeeId})</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {loan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Principal</span>
                      <span className="font-mono font-bold text-zinc-200">{formatINR(loan.principalAmount)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Monthly EMI</span>
                      <span className="font-mono font-bold text-indigo-400">{formatINR(loan.monthlyEMI)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block uppercase font-bold">Tenure</span>
                      <span className="font-bold text-zinc-200">{loan.tenureMonths} Months</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Repayment Progress ({percentPaid}%)</span>
                      <span className="font-mono text-zinc-300">
                        {loan.installmentsPaid || 0} of {loan.tenureMonths} Months Paid
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentPaid}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>Paid: {formatINR(loan.paidAmount)}</span>
                      <span>Remaining: {formatINR(loan.remainingBalance)}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80 text-xs">
                    <button
                      type="button"
                      onClick={() => setScheduleModalLoan(loan)}
                      className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline flex items-center gap-1"
                    >
                      <FileSpreadsheet className="size-3.5" />
                      View Repayment Schedule <ChevronRight className="size-3" />
                    </button>

                    <button
                      onClick={() => handleDeleteLoan(loan.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800"
                      title="Delete Loan"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: Issue Salary Advance (100% Same-Month Recovery) */}
      {/* ========================================================= */}
      <Modal
        isOpen={advanceModalOpen}
        onClose={() => setAdvanceModalOpen(false)}
        title="Issue Salary Advance (Short-Term)"
        description="Advance amount will be deducted 100% in full from upcoming monthly payroll."
      >
        <form onSubmit={handleCreateAdvance} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Employee *</label>
            <select
              required
              value={advanceForm.employeeId}
              onChange={(e) => setAdvanceForm({ ...advanceForm, employeeId: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-amber-500 font-semibold"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Advance Amount (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 10000"
                value={advanceForm.amount}
                onChange={(e) => setAdvanceForm({ ...advanceForm, amount: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Recovery Payroll Month *</label>
              <select
                value={advanceForm.recoveryPeriod}
                onChange={(e) => setAdvanceForm({ ...advanceForm, recoveryPeriod: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-amber-500 font-semibold"
              >
                <option value="2026-08">August 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-10">October 2026</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Disbursement Date</label>
            <input
              type="date"
              value={advanceForm.disbursementDate}
              onChange={(e) => setAdvanceForm({ ...advanceForm, disbursementDate: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Reason / Emergency Description</label>
            <textarea
              rows={2}
              placeholder="e.g. Festival advance / Medical emergency advance"
              value={advanceForm.reason}
              onChange={(e) => setAdvanceForm({ ...advanceForm, reason: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setAdvanceModalOpen(false)}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-amber-600/15"
            >
              Approve Advance
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: Create Multi-Month Loan with Tenure & EMI */}
      {/* ========================================================= */}
      <Modal
        isOpen={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        title="Create Employee Loan (Multi-Month Tenure)"
        description="Configure principal, tenure, interest rate, and monthly EMI deduction plan."
      >
        <form onSubmit={handleCreateLoan} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Employee *</label>
              <select
                required
                value={loanForm.employeeId}
                onChange={(e) => setLoanForm({ ...loanForm, employeeId: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Loan Type *</label>
              <select
                value={loanForm.loanType}
                onChange={(e) => setLoanForm({ ...loanForm, loanType: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="PERSONAL_LOAN">Personal Emergency Loan</option>
                <option value="EQUIPMENT_LOAN">Laptop / Device Upgrade Loan</option>
                <option value="VEHICLE_LOAN">Vehicle Advance Loan</option>
                <option value="EDUCATION_LOAN">Higher Education Loan</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Loan Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Home Relocation & Rental Deposit Loan"
              value={loanForm.loanTitle}
              onChange={(e) => setLoanForm({ ...loanForm, loanTitle: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Principal (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 60000"
                value={loanForm.principalAmount}
                onChange={(e) => setLoanForm({ ...loanForm, principalAmount: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Tenure (Months) *</label>
              <select
                value={loanForm.tenureMonths}
                onChange={(e) => setLoanForm({ ...loanForm, tenureMonths: +e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-bold outline-none focus:border-indigo-500"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={10}>10 Months</option>
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0% for Interest-Free"
                value={loanForm.interestRate}
                onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Calculated EMI Preview Box */}
          {loanForm.principalAmount > 0 && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-zinc-400 block text-[11px]">Computed Monthly Payroll EMI:</span>
                <span className="text-base font-bold font-mono text-indigo-300">
                  {formatINR(
                    calculateLoanEMI(
                      loanForm.principalAmount,
                      loanForm.tenureMonths,
                      loanForm.interestRate,
                      loanForm.repaymentType
                    )
                  )} / month
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                {loanForm.tenureMonths} monthly installments
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setLoanModalOpen(false)}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15"
            >
              Create Loan Plan
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 3: EMI Repayment Amortization Schedule */}
      {/* ========================================================= */}
      <Modal
        isOpen={!!scheduleModalLoan}
        onClose={() => setScheduleModalLoan(null)}
        title={`Repayment Schedule — ${scheduleModalLoan?.loanTitle || "Loan"}`}
        description={`Employee: ${scheduleModalLoan?.employeeName} • Principal: ${formatINR(scheduleModalLoan?.principalAmount)} • Monthly EMI: ${formatINR(scheduleModalLoan?.monthlyEMI)}`}
      >
        <div className="space-y-4 text-xs">
          <div className="max-h-72 overflow-y-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase font-bold sticky top-0">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Payroll Period</th>
                  <th className="p-3 text-right">Monthly EMI (₹)</th>
                  <th className="p-3 text-right">Remaining Principal (₹)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {generateRepaymentSchedule(scheduleModalLoan).map((row) => (
                  <tr key={row.installmentNumber} className="hover:bg-zinc-900/40 font-mono">
                    <td className="p-3 text-zinc-500">{row.installmentNumber}</td>
                    <td className="p-3 text-zinc-200 font-sans font-semibold">
                      {row.period} ({row.monthName})
                    </td>
                    <td className="p-3 text-right font-bold text-indigo-400">{formatINR(row.emiAmount)}</td>
                    <td className="p-3 text-right text-zinc-300">{formatINR(row.remainingBalance)}</td>
                    <td className="p-3 text-center font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          row.status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : row.status === "UPCOMING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-800">
            <button
              onClick={() => setScheduleModalLoan(null)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-4 py-2 rounded-xl"
            >
              Close Schedule
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
