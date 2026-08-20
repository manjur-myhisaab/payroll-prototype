import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { calculateSalaryBreakdown } from "../../utils/salaryCalculator";
import { formatINR, formatDate, formatMonthName, STATUS_COLORS } from "../../utils/formatters";
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  PlayCircle,
  FileText,
} from "lucide-react";

export default function Dashboard({ onNavigate }) {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [components, setComponents] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [overtimes, setOvertimes] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [loans, setLoans] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEmployees(storageService.getEmployees());
    setSalaries(storageService.getEmployeeSalaries());
    setTemplates(storageService.getTemplates());
    setComponents(storageService.getComponents());
    setPayrollRuns(storageService.getPayrollRuns());
    setOvertimes(storageService.getOvertime());
    setIncentives(storageService.getIncentives());
    setLoans(storageService.getLoans());
    setSettings(storageService.getSettings());
  };

  // KPIs calculation
  const totalEmployees = employees.length;
  const activeSalaries = salaries.filter((s) => s.status === "ACTIVE" && !s.effectiveTo);
  const employeesWithSalary = activeSalaries.length;
  const employeesMissingSalary = totalEmployees - employeesWithSalary;

  // Calculate total monthly projected CTC, Gross, Deductions, Net
  const tplMap = new Map(templates.map((t) => [t.id, t]));
  let totalMonthlyCTC = 0;
  let totalMonthlyGross = 0;
  let totalMonthlyDeductions = 0;
  let totalMonthlyEmployerCost = 0;
  let totalMonthlyNet = 0;

  activeSalaries.forEach((sal) => {
    const tpl = tplMap.get(sal.templateId) || templates[0];
    const bd = calculateSalaryBreakdown({
      annualCTC: sal.annualCTC,
      template: tpl,
      allComponents: components,
      customTDS: sal.tdsMonthly || 0,
      settings,
    });
    totalMonthlyCTC += bd.monthlyCTC;
    totalMonthlyGross += bd.totalGross;
    totalMonthlyDeductions += bd.totalDeductions;
    totalMonthlyEmployerCost += bd.totalEmployerCost;
    totalMonthlyNet += bd.netPay;
  });

  // Pending approval items
  const pendingOT = overtimes.filter((o) => o.status === "PENDING").length;
  const pendingIncentives = incentives.filter((i) => i.status === "PENDING").length;
  const activeLoans = loans.filter((l) => l.status === "ACTIVE").length;

  const currentMonth = "2026-08";
  const recentRuns = payrollRuns.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900 p-6 sm:p-8 rounded-2xl border border-indigo-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
              Zoho-Grade Payroll System
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-medium">{settings.companyName || "Acme Technologies"}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-100">
            Payroll Ledger Overview
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Centralized salary structuring, attendance-driven pro-ration, statutory compliance, and one-click monthly disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("payroll_runs")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <PlayCircle className="size-4" />
            Process August 2026 Payroll
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Employees</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-100">{totalEmployees}</div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-emerald-400 font-bold">{employeesWithSalary} Assigned</span>
              <span>•</span>
              <span className={employeesMissingSalary > 0 ? "text-amber-400 font-bold" : "text-zinc-500"}>
                {employeesMissingSalary} Missing
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Monthly Total CTC</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-400 font-mono">{formatINR(totalMonthlyCTC)}</div>
            <div className="text-[11px] text-zinc-400 mt-1 font-medium">
              Annual: <span className="font-mono text-zinc-200">{formatINR(totalMonthlyCTC * 12)}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Monthly Gross Earnings</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{formatINR(totalMonthlyGross)}</div>
            <div className="text-[11px] text-zinc-400 mt-1 font-medium">
              Employer Cost: <span className="font-mono text-zinc-300">{formatINR(totalMonthlyEmployerCost)}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Estimated Net Take-Home</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-400 font-mono">{formatINR(totalMonthlyNet)}</div>
            <div className="text-[11px] text-zinc-400 mt-1 font-medium">
              Deductions: <span className="font-mono text-rose-400">{formatINR(totalMonthlyDeductions)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Actionable Alerts & Live Period Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Payroll Status & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actionable Alerts */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-400" />
              Actionable Alerts & Approvals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => onNavigate("overtime")}
                className="p-4 bg-zinc-950/60 border border-zinc-800/60 rounded-xl hover:border-indigo-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Pending Overtime</span>
                  <Clock className="size-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-xl font-bold text-zinc-100 mt-2">{pendingOT} Requests</div>
                <span className="text-[10px] text-indigo-400 mt-1 inline-flex items-center gap-1 font-semibold">
                  Review & Approve <ArrowRight className="size-3" />
                </span>
              </div>

              <div
                onClick={() => onNavigate("incentives")}
                className="p-4 bg-zinc-950/60 border border-zinc-800/60 rounded-xl hover:border-indigo-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Pending Incentives</span>
                  <Sparkles className="size-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-xl font-bold text-zinc-100 mt-2">{pendingIncentives} Requests</div>
                <span className="text-[10px] text-indigo-400 mt-1 inline-flex items-center gap-1 font-semibold">
                  Review & Approve <ArrowRight className="size-3" />
                </span>
              </div>

              <div
                onClick={() => onNavigate("loans")}
                className="p-4 bg-zinc-950/60 border border-zinc-800/60 rounded-xl hover:border-indigo-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Active Loans</span>
                  <DollarSign className="size-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-xl font-bold text-zinc-100 mt-2">{activeLoans} Active</div>
                <span className="text-[10px] text-indigo-400 mt-1 inline-flex items-center gap-1 font-semibold">
                  Manage Schedules <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Recent Payroll Runs */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Recent Payroll Runs</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Historical and draft periods ledger</p>
              </div>
              <button
                onClick={() => onNavigate("payroll_runs")}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View All Runs <ArrowRight className="size-3.5" />
              </button>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Period</th>
                  <th className="p-4 text-center">Employees</th>
                  <th className="p-4 text-right">Total Gross</th>
                  <th className="p-4 text-right">Total Net Pay</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 font-bold text-zinc-200">
                      {formatMonthName(run.month)}
                      <div className="text-[10px] text-zinc-500 font-normal">{run.name}</div>
                    </td>
                    <td className="p-4 text-center text-zinc-300 font-semibold">{run.totalEmployees}</td>
                    <td className="p-4 text-right font-mono font-semibold text-emerald-400">
                      {formatINR(run.totalGross)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-indigo-400">
                      {formatINR(run.totalNetPay)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          STATUS_COLORS[run.status] || STATUS_COLORS.DRAFT
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onNavigate("payroll_runs")}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Master Data Status */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="size-4 text-indigo-400" />
              Hierarchy Architecture Status
            </h3>

            <div className="space-y-3.5 text-xs">
              <div
                onClick={() => onNavigate("components")}
                className="p-3.5 bg-zinc-950/60 border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-zinc-200">Salary Components</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {components.filter((c) => c.status === "ACTIVE").length} Active building blocks
                  </div>
                </div>
                <ArrowRight className="size-4 text-zinc-600" />
              </div>

              <div
                onClick={() => onNavigate("templates")}
                className="p-3.5 bg-zinc-950/60 border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-zinc-200">Salary Templates</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {templates.length} Pre-configured rule sets
                  </div>
                </div>
                <ArrowRight className="size-4 text-zinc-600" />
              </div>

              <div
                onClick={() => onNavigate("salaries")}
                className="p-3.5 bg-zinc-950/60 border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-zinc-200">Employee Salaries</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {employeesWithSalary} of {totalEmployees} Assigned CTC
                  </div>
                </div>
                <ArrowRight className="size-4 text-zinc-600" />
              </div>

              <div
                onClick={() => onNavigate("payslips")}
                className="p-3.5 bg-zinc-950/60 border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-zinc-200">Salary Slips / Payslips</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Printable employee salary slips</div>
                </div>
                <ArrowRight className="size-4 text-zinc-600" />
              </div>
            </div>
          </div>

          {/* Statutory Compliance Note */}
          <div className="bg-emerald-950/20 border border-emerald-900/30 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="size-4" />
              Wage Code 2019 Ready
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              All employee salary templates are validated against the 50% Basic+DA wage ceiling ratio. Employer contributions remain segregated from take-home pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
