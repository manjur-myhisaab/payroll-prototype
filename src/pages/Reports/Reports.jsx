import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { processPayrollForPeriod } from "../../utils/payrollCalculator";
import { formatINR, formatMonthName, formatDate } from "../../utils/formatters";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Layers,
  Search,
} from "lucide-react";

const REPORT_TYPES = [
  { id: "PAYROLL_SUMMARY", name: "Payroll Summary Register", icon: FileSpreadsheet, desc: "Complete monthly gross, deductions, employer cost, and net pay breakdown." },
  { id: "GROSS_VS_NET", name: "Gross vs Net Variance", icon: BarChart3, desc: "Comparison of gross earned wages against final net take-home pay." },
  { id: "DEDUCTIONS_SUMMARY", name: "Deductions & Statutory Report", icon: PieChart, desc: "Detailed breakdown of EPF, ESI, PT, TDS, and Loan EMI recoveries." },
  { id: "EMPLOYER_COST", name: "Employer Contributions & CTC Report", icon: Layers, desc: "Monthly employer PF, gratuity provisions, and employee benefits." },
  { id: "VARIABLE_PAY", name: "Overtime & Incentives Register", icon: TrendingUp, desc: "Summary of approved overtime earnings and sales/performance incentives." },
  { id: "LOANS_REGISTER", name: "Loan & Advances Outstanding", icon: DollarSign, desc: "All company loans, paid amounts, EMIs, and remaining balances." },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("PAYROLL_SUMMARY");
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [employees, setEmployees] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [calculatedData, setCalculatedData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [overtimes, setOvertimes] = useState([]);
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = () => {
    const emps = storageService.getEmployees();
    const sals = storageService.getEmployeeSalaries();
    const tpls = storageService.getTemplates();
    const comps = storageService.getComponents();
    const att = storageService.getAttendance();
    const ot = storageService.getOvertime();
    const inc = storageService.getIncentives();
    const lns = storageService.getLoans();
    const sets = storageService.getSettings();
    const runs = storageService.getPayrollRuns();

    setEmployees(emps);
    setPayrollRuns(runs);
    setLoans(lns);
    setOvertimes(ot);
    setIncentives(inc);

    const calc = processPayrollForPeriod({
      month: selectedMonth,
      employees: emps,
      employeeSalaries: sals,
      templates: tpls,
      components: comps,
      attendanceList: att,
      overtimeList: ot,
      incentivesList: inc,
      loansList: lns,
      settings: sets,
    });
    setCalculatedData(calc);
  };

  const handleExportCSV = () => {
    if (!calculatedData || calculatedData.records.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";

    if (selectedReport === "PAYROLL_SUMMARY" || selectedReport === "GROSS_VS_NET") {
      csvContent += "Employee Code,Employee Name,Department,Designation,Payable Days,Earned Basic,Gross Salary,Total Deductions,Employer Cost,Net Pay,Total CTC\n";
      calculatedData.records.forEach((r) => {
        csvContent += `"${r.employeeId}","${r.employeeName}","${r.department}","${r.designation}",${r.payableDays},${r.earnedBasic},${r.earnedGross},${r.totalDeductions},${r.totalEmployerCost},${r.netPay},${r.totalCTC}\n`;
      });
    } else if (selectedReport === "DEDUCTIONS_SUMMARY") {
      csvContent += "Employee Code,Employee Name,Department,Gross Salary,EPF,ESI,PT,TDS,Loan EMI,Total Deductions\n";
      calculatedData.records.forEach((r) => {
        const epf = r.deductions.find((d) => d.code === "EPF")?.amount || 0;
        const esi = r.deductions.find((d) => d.code === "ESI")?.amount || 0;
        const pt = r.deductions.find((d) => d.code === "PT")?.amount || 0;
        const tds = r.deductions.find((d) => d.code === "TDS")?.amount || 0;
        const loan = r.loanDeductionAmount || 0;
        csvContent += `"${r.employeeId}","${r.employeeName}","${r.department}",${r.earnedGross},${epf},${esi},${pt},${tds},${loan},${r.totalDeductions}\n`;
      });
    } else if (selectedReport === "LOANS_REGISTER") {
      csvContent += "Employee Code,Employee Name,Loan Type,Title,Principal,Monthly EMI,Paid Amount,Remaining Balance,Status\n";
      loans.forEach((l) => {
        const emp = employees.find((e) => e.id === l.employeeId);
        csvContent += `"${l.employeeId}","${emp?.name || l.employeeId}","${l.loanType}","${l.title}",${l.principalAmount},${l.monthlyEMI},${l.paidAmount || 0},${l.remainingBalance},"${l.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-indigo-400" />
            Payroll Reports & Statutory Registers
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Generate and export salary registers, gross-to-net audits, deduction sheets, and employer cost statements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
            <Calendar className="size-4 text-zinc-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 font-bold outline-none cursor-pointer"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/15 flex items-center gap-2"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Types Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {REPORT_TYPES.map((rep) => {
          const Icon = rep.icon;
          const isSelected = selectedReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              <Icon className="size-4 mb-2 opacity-80" />
              <div className="font-bold text-xs leading-snug">{rep.name}</div>
            </button>
          );
        })}
      </div>

      {/* Report Table View */}
      {calculatedData && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl space-y-4">
          <div className="p-4 bg-zinc-950/40 border-b border-zinc-800 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-zinc-200 uppercase tracking-wider text-[11px]">
                {REPORT_TYPES.find((r) => r.id === selectedReport)?.name}
              </span>
              <span className="text-zinc-500 ml-2">({formatMonthName(selectedMonth)})</span>
            </div>
            <div className="font-mono text-zinc-400">
              Total Disbursement: <strong className="text-indigo-400">{formatINR(calculatedData.totalNetPay)}</strong>
            </div>
          </div>

          {/* 1. PAYROLL_SUMMARY or GROSS_VS_NET */}
          {(selectedReport === "PAYROLL_SUMMARY" || selectedReport === "GROSS_VS_NET") && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Employee</th>
                    <th className="p-4">Department</th>
                    <th className="p-4 text-center">Days</th>
                    <th className="p-4 text-right">Earned Basic</th>
                    <th className="p-4 text-right">Gross Salary</th>
                    <th className="p-4 text-right">Total Deductions</th>
                    <th className="p-4 text-right">Employer Cost</th>
                    <th className="p-4 text-right">Net Take-Home</th>
                    <th className="p-4 text-right">Total CTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {calculatedData.records.map((r) => (
                    <tr key={r.employeeId} className="hover:bg-zinc-800/20">
                      <td className="p-4 font-bold text-zinc-200">
                        {r.employeeName}
                        <div className="text-[10px] text-zinc-500 font-mono">{r.employeeId}</div>
                      </td>
                      <td className="p-4 text-zinc-400">{r.department}</td>
                      <td className="p-4 text-center font-mono text-zinc-300">
                        {r.payableDays}/{r.totalDays}
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-300">{formatINR(r.earnedBasic)}</td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-400">{formatINR(r.earnedGross)}</td>
                      <td className="p-4 text-right font-mono font-semibold text-rose-400">{formatINR(r.totalDeductions)}</td>
                      <td className="p-4 text-right font-mono text-purple-400">{formatINR(r.totalEmployerCost)}</td>
                      <td className="p-4 text-right font-mono font-black text-indigo-400">{formatINR(r.netPay)}</td>
                      <td className="p-4 text-right font-mono font-bold text-zinc-200">{formatINR(r.totalCTC)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-zinc-950 font-bold border-t-2 border-zinc-800">
                    <td colSpan={3} className="p-4 text-zinc-300 uppercase text-[10px]">
                      Totals ({calculatedData.records.length} Employees)
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-300">
                      {formatINR(calculatedData.records.reduce((s, r) => s + r.earnedBasic, 0))}
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-400">
                      {formatINR(calculatedData.totalGross)}
                    </td>
                    <td className="p-4 text-right font-mono text-rose-400">
                      {formatINR(calculatedData.totalDeductions)}
                    </td>
                    <td className="p-4 text-right font-mono text-purple-400">
                      {formatINR(calculatedData.totalEmployerCost)}
                    </td>
                    <td className="p-4 text-right font-mono text-indigo-400 text-sm font-black">
                      {formatINR(calculatedData.totalNetPay)}
                    </td>
                    <td className="p-4 text-right font-mono text-zinc-100">
                      {formatINR(calculatedData.totalCTC)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* 2. DEDUCTIONS_SUMMARY */}
          {selectedReport === "DEDUCTIONS_SUMMARY" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Employee</th>
                    <th className="p-4 text-right">Earned Gross</th>
                    <th className="p-4 text-right">Employee PF (12%)</th>
                    <th className="p-4 text-right">ESIC (0.75%)</th>
                    <th className="p-4 text-right">Prof. Tax (PT)</th>
                    <th className="p-4 text-right">TDS (IT)</th>
                    <th className="p-4 text-right">Loan Recovery</th>
                    <th className="p-4 text-right">Total Deductions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {calculatedData.records.map((r) => {
                    const epf = r.deductions.find((d) => d.code === "EPF")?.amount || 0;
                    const esi = r.deductions.find((d) => d.code === "ESI")?.amount || 0;
                    const pt = r.deductions.find((d) => d.code === "PT")?.amount || 0;
                    const tds = r.deductions.find((d) => d.code === "TDS")?.amount || 0;
                    const loan = r.loanDeductionAmount || 0;
                    return (
                      <tr key={r.employeeId} className="hover:bg-zinc-800/20">
                        <td className="p-4 font-bold text-zinc-200">
                          {r.employeeName}
                          <div className="text-[10px] text-zinc-500 font-mono">{r.employeeId}</div>
                        </td>
                        <td className="p-4 text-right font-mono text-emerald-400">{formatINR(r.earnedGross)}</td>
                        <td className="p-4 text-right font-mono text-zinc-300">{formatINR(epf)}</td>
                        <td className="p-4 text-right font-mono text-zinc-300">{formatINR(esi)}</td>
                        <td className="p-4 text-right font-mono text-zinc-300">{formatINR(pt)}</td>
                        <td className="p-4 text-right font-mono text-zinc-300">{formatINR(tds)}</td>
                        <td className="p-4 text-right font-mono text-rose-400">{formatINR(loan)}</td>
                        <td className="p-4 text-right font-mono font-bold text-rose-400">
                          {formatINR(r.totalDeductions)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. EMPLOYER_COST */}
          {selectedReport === "EMPLOYER_COST" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Employee</th>
                    <th className="p-4 text-right">Earned Basic</th>
                    <th className="p-4 text-right">Employer PF (12%)</th>
                    <th className="p-4 text-right">Gratuity (4.81%)</th>
                    <th className="p-4 text-right">Medical Benefits</th>
                    <th className="p-4 text-right">Total Employer Cost</th>
                    <th className="p-4 text-right">Total Monthly CTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {calculatedData.records.map((r) => {
                    const erPf = r.employerContributions.find((ec) => ec.code === "EMPLOYER_PF")?.amount || 0;
                    const grat = r.employerContributions.find((ec) => ec.code === "GRATUITY")?.amount || 0;
                    const ins = r.employerContributions.find((ec) => ec.code === "INSURANCE")?.amount || 0;
                    return (
                      <tr key={r.employeeId} className="hover:bg-zinc-800/20">
                        <td className="p-4 font-bold text-zinc-200">
                          {r.employeeName}
                          <div className="text-[10px] text-zinc-500 font-mono">{r.employeeId}</div>
                        </td>
                        <td className="p-4 text-right font-mono text-zinc-300">{formatINR(r.earnedBasic)}</td>
                        <td className="p-4 text-right font-mono text-purple-400">{formatINR(erPf)}</td>
                        <td className="p-4 text-right font-mono text-purple-400">{formatINR(grat)}</td>
                        <td className="p-4 text-right font-mono text-purple-400">{formatINR(ins)}</td>
                        <td className="p-4 text-right font-mono font-bold text-purple-400">
                          {formatINR(r.totalEmployerCost)}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-zinc-100">{formatINR(r.totalCTC)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. VARIABLE_PAY (OT + Incentives) */}
          {selectedReport === "VARIABLE_PAY" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Employee</th>
                    <th className="p-4 text-right">Approved Overtime</th>
                    <th className="p-4 text-right">Sales / KPI Incentive</th>
                    <th className="p-4 text-right">Total Variable Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {calculatedData.records.map((r) => (
                    <tr key={r.employeeId} className="hover:bg-zinc-800/20">
                      <td className="p-4 font-bold text-zinc-200">
                        {r.employeeName}
                        <div className="text-[10px] text-zinc-500 font-mono">{r.employeeId}</div>
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-400">{formatINR(r.overtimeAmount)}</td>
                      <td className="p-4 text-right font-mono text-emerald-400">{formatINR(r.incentivesAmount)}</td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {formatINR(r.overtimeAmount + r.incentivesAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. LOANS_REGISTER */}
          {selectedReport === "LOANS_REGISTER" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Employee</th>
                    <th className="p-4">Title & Type</th>
                    <th className="p-4 text-right">Principal</th>
                    <th className="p-4 text-right">Monthly EMI</th>
                    <th className="p-4 text-right">Paid Amount</th>
                    <th className="p-4 text-right">Remaining Balance</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {loans.map((l) => {
                    const emp = employees.find((e) => e.id === l.employeeId);
                    return (
                      <tr key={l.id} className="hover:bg-zinc-800/20">
                        <td className="p-4 font-bold text-zinc-200">
                          {emp?.name || l.employeeId}
                          <div className="text-[10px] text-zinc-500 font-mono">{l.employeeId}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-zinc-200">{l.title}</div>
                          <div className="text-[10px] text-zinc-500">{l.loanType}</div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-zinc-200">{formatINR(l.principalAmount)}</td>
                        <td className="p-4 text-right font-mono text-rose-400">{formatINR(l.monthlyEMI)}</td>
                        <td className="p-4 text-right font-mono text-emerald-400">{formatINR(l.paidAmount || 0)}</td>
                        <td className="p-4 text-right font-mono font-bold text-zinc-100">{formatINR(l.remainingBalance)}</td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
