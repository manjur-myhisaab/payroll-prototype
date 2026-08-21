import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { processPayrollForPeriod } from "../../utils/payrollCalculator";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR, formatMonthName, formatDate, STATUS_COLORS } from "../../utils/formatters";
import {
  PlayCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  Lock,
  ArrowRight,
  FileText,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function PayrollRuns({ onNavigate, onSelectPayslip }) {
  const { showToast } = useToast();
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [components, setComponents] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [overtimeList, setOvertimeList] = useState([]);
  const [incentivesList, setIncentivesList] = useState([]);
  const [loansList, setLoansList] = useState([]);
  const [settings, setSettings] = useState({});

  // Active run processing / review state
  const [activeRunMonth, setActiveRunMonth] = useState("2026-08");
  const [calculatedRun, setCalculatedRun] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null);

  // New run modal
  const [newRunModalOpen, setNewRunModalOpen] = useState(false);
  const [selectedNewMonth, setSelectedNewMonth] = useState("2026-08");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const runs = storageService.getPayrollRuns();
    const emps = storageService.getEmployees();
    const sals = storageService.getEmployeeSalaries();
    const tpls = storageService.getTemplates();
    const comps = storageService.getComponents();
    const att = storageService.getAttendance();
    const ot = storageService.getOvertime();
    const inc = storageService.getIncentives();
    const loans = storageService.getLoans();
    const sets = storageService.getSettings();

    setPayrollRuns(runs);
    setEmployees(emps);
    setEmployeeSalaries(sals);
    setTemplates(tpls);
    setComponents(comps);
    setAttendanceList(att);
    setOvertimeList(ot);
    setIncentivesList(inc);
    setLoansList(loans);
    setSettings(sets);

    // Auto-calculate for activeRunMonth
    runCalculation(activeRunMonth, emps, sals, tpls, comps, att, ot, inc, loans, sets);
  };

  const runCalculation = (month, emps, sals, tpls, comps, att, ot, inc, loans, sets) => {
    const result = processPayrollForPeriod({
      month,
      employees: emps || employees,
      employeeSalaries: sals || employeeSalaries,
      templates: tpls || templates,
      components: comps || components,
      attendanceList: att || attendanceList,
      overtimeList: ot || overtimeList,
      incentivesList: inc || incentivesList,
      loansList: loans || loansList,
      settings: sets || settings,
    });
    setCalculatedRun(result);
  };

  const handleCreateRun = (e) => {
    e.preventDefault();
    const existing = payrollRuns.find((r) => r.month === selectedNewMonth);
    if (existing && existing.status === "PAID") {
      showToast(`Payroll for ${formatMonthName(selectedNewMonth)} is already processed & paid!`, "warning");
      return;
    }

    setActiveRunMonth(selectedNewMonth);
    runCalculation(selectedNewMonth, employees, employeeSalaries, templates, components, attendanceList, overtimeList, incentivesList, loansList, settings);

    if (!existing) {
      const newRun = {
        id: `RUN_${selectedNewMonth.replace("-", "_")}`,
        month: selectedNewMonth,
        name: `${formatMonthName(selectedNewMonth)} Regular Payroll`,
        status: "DRAFT",
        totalEmployees: employees.length,
        totalGross: 0,
        totalDeductions: 0,
        totalNetPay: 0,
        totalEmployerCost: 0,
        totalCTC: 0,
        createdDate: new Date().toISOString().split("T")[0],
      };
      storageService.createPayrollRun(newRun);
      loadData();
    }

    setNewRunModalOpen(false);
    showToast(`Initialized draft payroll run for ${formatMonthName(selectedNewMonth)}`);
  };

  const handleApprovePayroll = () => {
    if (!calculatedRun) return;

    const runId = `RUN_${activeRunMonth.replace("-", "_")}`;
    const runUpdate = {
      id: runId,
      month: activeRunMonth,
      name: `${formatMonthName(activeRunMonth)} Regular Payroll`,
      status: "APPROVED",
      totalEmployees: calculatedRun.totalEmployees,
      totalGross: calculatedRun.totalGross,
      totalDeductions: calculatedRun.totalDeductions,
      totalNetPay: calculatedRun.totalNetPay,
      totalEmployerCost: calculatedRun.totalEmployerCost,
      totalCTC: calculatedRun.totalCTC,
      approvedDate: new Date().toISOString().split("T")[0],
      approvedBy: "HR Admin",
    };

    storageService.createPayrollRun(runUpdate); // creates or updates

    // Generate Payslips for all employees in this run
    const payslips = calculatedRun.records.map((r) => ({
      id: `SLIP_${activeRunMonth.replace("-", "_")}_${r.employeeId}`,
      payrollMonth: activeRunMonth,
      payrollRunId: runId,
      employeeId: r.employeeId,
      employeeName: r.employeeName,
      employeeCode: r.employeeCode,
      designation: r.designation,
      department: r.department,
      bankName: r.bankName,
      bankAccount: r.bankAccount,
      ifscCode: r.ifscCode,
      pan: r.pan,
      uan: r.uan,
      totalDays: r.totalDays,
      payableDays: r.payableDays,
      lopDays: r.lopDays,
      grossEarnings: r.earnedGross,
      totalDeductions: r.totalDeductions,
      netPay: r.netPay,
      employerCost: r.totalEmployerCost,
      totalCTC: r.totalCTC,
      earnings: r.earnings,
      deductions: r.deductions,
      employerContributions: r.employerContributions,
      generatedDate: new Date().toISOString().split("T")[0],
      status: "GENERATED",
    }));

    storageService.savePayslips(payslips);
    loadData();
    showToast(`Payroll for ${formatMonthName(activeRunMonth)} APPROVED! ${payslips.length} payslips generated.`);
  };

  const handleMarkAsPaid = () => {
    const runId = `RUN_${activeRunMonth.replace("-", "_")}`;
    storageService.updatePayrollRun(runId, {
      status: "PAID",
      paidDate: new Date().toISOString().split("T")[0],
    });
    loadData();
    showToast(`Payroll for ${formatMonthName(activeRunMonth)} marked as PAID & Disbursed!`);
  };

  // Check current month run status
  const currentRunMeta = payrollRuns.find((r) => r.month === activeRunMonth) || {
    status: "DRAFT",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <PlayCircle className="size-5 text-indigo-400" />
            Monthly Payroll Processing & Approvals
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Calculate gross-to-net pay with pro-ration, overtime, bonuses, and loan recoveries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
            <Calendar className="size-4 text-zinc-400" />
            <select
              value={activeRunMonth}
              onChange={(e) => {
                setActiveRunMonth(e.target.value);
                runCalculation(e.target.value);
              }}
              className="bg-transparent text-xs text-zinc-200 font-bold outline-none cursor-pointer"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
          </div>

          <button
            onClick={() => setNewRunModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
          >
            <RefreshCw className="size-4" />
            New Period Run
          </button>
        </div>
      </div>

      {/* Period Run Summary KPI Banner */}
      {calculatedRun && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-zinc-100">
                  {formatMonthName(activeRunMonth)} Payroll Run
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[currentRunMeta.status] || STATUS_COLORS.DRAFT
                    }`}
                >
                  {currentRunMeta.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Processing {calculatedRun.totalEmployees} active employees with live attendance & variable pay integration.
              </p>
            </div>

            {/* Approval Action Buttons */}
            <div className="flex items-center gap-3">
              {currentRunMeta.status === "DRAFT" && (
                <button
                  onClick={handleApprovePayroll}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="size-4" />
                  Approve & Generate Payslips
                </button>
              )}

              {currentRunMeta.status === "APPROVED" && (
                <button
                  onClick={handleMarkAsPaid}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Lock className="size-4" />
                  Mark as Paid & Lock
                </button>
              )}

              {currentRunMeta.status === "PAID" && (
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Disbursed & Finalized
                </span>
              )}
            </div>
          </div>

          {/* KPI Numbers Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center text-xs">
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold">Total Employees</div>
              <div className="text-xl font-bold text-zinc-200 mt-1">{calculatedRun.totalEmployees}</div>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold">Earned Gross Pay</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {formatINR(calculatedRun.totalGross)}
              </div>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold">Total Deductions</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                {formatINR(calculatedRun.totalDeductions)}
              </div>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold">Employer Cost</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                {formatINR(calculatedRun.totalEmployerCost)}
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-900/50 col-span-2 lg:col-span-1">
              <div className="text-[10px] text-indigo-300 uppercase font-semibold">Total Net Disbursement</div>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
                {formatINR(calculatedRun.totalNetPay)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Payroll Breakdown Table */}
      {calculatedRun && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Employee-Wise Pro-Rated Calculations ({calculatedRun.records.length})
            </h3>
            <span className="text-[11px] text-zinc-500">Click View to see step-by-step formula trace</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4">Employee</th>
                <th className="p-4 text-center">Payable / LOP</th>
                <th className="p-4 text-right">Earned Basic</th>
                <th className="p-4 text-right">OT / Incentives</th>
                <th className="p-4 text-right">Gross Pay</th>
                <th className="p-4 text-right">Deductions</th>
                <th className="p-4 text-right">Net Take-Home</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {calculatedRun.records.map((r) => (
                <tr key={r.employeeId} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-200">{r.employeeName}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {r.employeeId} • {r.designation}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-zinc-200">{r.payableDays}</span>
                    <span className="text-zinc-500 font-mono"> / {r.totalDays}d</span>
                    {r.lopDays > 0 && (
                      <span className="ml-2 text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                        {r.lopDays} LOP
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-zinc-300">
                    {formatINR(r.earnedBasic)}
                  </td>
                  <td className="p-4 text-right font-mono text-zinc-300">
                    {r.overtimeAmount > 0 || r.incentivesAmount > 0 ? (
                      <span className="text-emerald-400 font-bold">
                        +{formatINR(r.overtimeAmount + r.incentivesAmount)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">
                    {formatINR(r.earnedGross)}
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-rose-400">
                    {formatINR(r.totalDeductions)}
                  </td>
                  <td className="p-4 text-right font-mono font-black text-indigo-400 text-sm">
                    {formatINR(r.netPay)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setDetailRecord(r)}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-semibold px-2.5"
                    >
                      <Eye className="size-3.5" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Employee Payroll Record Drawer/Modal */}
      {detailRecord && (
        <Modal
          isOpen={!!detailRecord}
          onClose={() => setDetailRecord(null)}
          title={`Payroll Breakdown: ${detailRecord.employeeName}`}
          description={`${detailRecord.employeeId} • ${detailRecord.designation} (${detailRecord.department}) • ${formatMonthName(activeRunMonth)}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 text-xs">
            {/* Top Quick Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 text-center">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Payable Days</div>
                <div className="text-base font-bold text-zinc-200 mt-0.5">
                  {detailRecord.payableDays} of {detailRecord.totalDays}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Earned Gross</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  {formatINR(detailRecord.earnedGross)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Total Deductions</div>
                <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                  {formatINR(detailRecord.totalDeductions)}
                </div>
              </div>
              <div className="bg-indigo-950/40 rounded-lg p-1 border border-indigo-900/40">
                <div className="text-[10px] text-indigo-300 uppercase font-semibold">Net Disbursement</div>
                <div className="text-base font-black font-mono text-indigo-400 mt-0.5">
                  {formatINR(detailRecord.netPay)}
                </div>
              </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Earnings */}
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="font-bold text-emerald-400 uppercase text-[10px]">Earnings</span>
                  <span className="font-mono font-bold text-emerald-400">{formatINR(detailRecord.earnedGross)}</span>
                </div>
                <div className="space-y-2">
                  {detailRecord.earnings.map((e) => (
                    <div key={e.id} className="flex justify-between items-center text-[11px]">
                      <div>
                        <span className="text-zinc-300">{e.name}</span>
                        {e.isVariable && <span className="ml-1 text-[9px] text-amber-400 font-bold">Variable</span>}
                      </div>
                      <span className="font-mono font-semibold text-zinc-200">{formatINR(e.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="font-bold text-rose-400 uppercase text-[10px]">Deductions</span>
                  <span className="font-mono font-bold text-rose-400">{formatINR(detailRecord.totalDeductions)}</span>
                </div>
                <div className="space-y-2">
                  {detailRecord.deductions.map((d) => (
                    <div key={d.id} className="flex justify-between items-center text-[11px]">
                      <div>
                        <span className="text-zinc-300">{d.name}</span>
                        {d.isVariable && <span className="ml-1 text-[9px] text-amber-400 font-bold">EMI</span>}
                      </div>
                      <span className="font-mono font-semibold text-rose-400">{formatINR(d.amount)}</span>
                    </div>
                  ))}
                  {detailRecord.deductions.length === 0 && <div className="text-zinc-600 italic">No deductions</div>}
                </div>
              </div>

              {/* Employer Contributions */}
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="font-bold text-purple-400 uppercase text-[10px]">Employer Cost</span>
                  <span className="font-mono font-bold text-purple-400">
                    {formatINR(detailRecord.totalEmployerCost)}
                  </span>
                </div>
                <div className="space-y-2">
                  {detailRecord.employerContributions.map((ec) => (
                    <div key={ec.id} className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-300">{ec.name}</span>
                      <span className="font-mono font-semibold text-purple-400">{formatINR(ec.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bank Snapshot */}
            <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/80 flex flex-wrap justify-between items-center gap-4 text-zinc-400 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Bank Account</span>
                <span className="font-mono text-zinc-200 font-semibold">{detailRecord.bankName} - {detailRecord.bankAccount}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">IFSC Code</span>
                <span className="font-mono text-zinc-200 font-semibold">{detailRecord.ifscCode}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-500 block">PAN / UAN</span>
                <span className="font-mono text-zinc-200 font-semibold">{detailRecord.pan} / {detailRecord.uan}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDetailRecord(null)}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Period Modal */}
      <Modal
        isOpen={newRunModalOpen}
        onClose={() => setNewRunModalOpen(false)}
        title="Initialize New Monthly Payroll Run"
        description="Select the payroll period to calculate. System will pull attendance, overtime, and loan schedules."
      >
        <form onSubmit={handleCreateRun} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Select Payroll Month *</label>
            <input
              type="month"
              required
              value={selectedNewMonth}
              onChange={(e) => setSelectedNewMonth(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 font-bold outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-2 text-zinc-400 text-xs leading-relaxed">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              Automated Data Pipeline:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-[11px]">
              <li>Applies active salary structures for each employee in the selected month</li>
              <li>Calculates pro-ration using configured calendar / working days divisor</li>
              <li>Includes approved Overtime hours and sales / performance incentives</li>
              <li>Deducts active Loan EMIs and updates outstanding loan balances</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setNewRunModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15"
            >
              Start Payroll Calculation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
