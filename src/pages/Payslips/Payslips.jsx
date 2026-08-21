import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { formatINR, formatMonthName, formatDate } from "../../utils/formatters";
import {
  FileText,
  Printer,
  Download,
  Search,
  Calendar,
  Building,
  User,
  CreditCard,
  CheckCircle2,
  Share2,
  Mail,
} from "lucide-react";

export default function Payslips() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [settings, setSettings] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const slips = storageService.getPayslips();
    const emps = storageService.getEmployees();
    const sets = storageService.getSettings();
    setPayslips(slips);
    setEmployees(emps);
    setSettings(sets);

    // If no payslips generated yet for August 2026, auto-select first available or sample
    if (slips.length > 0) {
      setSelectedPayslip(slips[0]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filtered = payslips.filter((p) => {
    const matchMonth = !selectedMonth || p.payrollMonth === selectedMonth;
    const matchSearch =
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase());
    return matchMonth && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <FileText className="size-5 text-indigo-400" />
            Salary Slips / Payslips Portal
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            View, print, and export official statutory payslips for processed payroll periods.
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
              <option value="">All Periods</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            disabled={!selectedPayslip}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2 disabled:opacity-50"
          >
            <Printer className="size-4" />
            Print Payslip
          </button>
        </div>
      </div>

      {/* Main Grid: Left side Payslips list, Right side Live Printable Payslip document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Payslip Selector (Hidden when printing) */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-2 space-y-1 max-h-[600px] overflow-y-auto">
            {filtered.map((slip) => {
              const isSelected = selectedPayslip?.id === slip.id;
              return (
                <div
                  key={slip.id}
                  onClick={() => setSelectedPayslip(slip)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-500/50 shadow-md"
                      : "bg-zinc-950/40 border-zinc-800/50 hover:bg-zinc-850 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs text-zinc-100">{slip.employeeName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {slip.employeeCode} • {slip.designation}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {formatINR(slip.netPay)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-zinc-400">
                    <span>{formatMonthName(slip.payrollMonth)}</span>
                    <span className="text-emerald-400 font-semibold">{slip.payableDays} Payable Days</span>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-8 text-center text-zinc-500 italic text-xs">
                No payslips found for this period. Process the payroll run to generate payslips.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Printable Official Salary Slip View */}
        <div className="lg:col-span-8">
          {selectedPayslip ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-zinc-200 shadow-2xl print:border-none print:shadow-none print:p-0 print:m-0">
              {/* Slip Header */}
              <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight">
                    {settings.companyName || "Acme Technologies Pvt Ltd"}
                  </h1>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md">
                    {settings.companyAddress || "Tech Park, Bengaluru, Karnataka"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500 font-mono mt-2">
                    <span>PAN: <strong className="text-zinc-300">{settings.companyPAN || "AABCA1234F"}</strong></span>
                    <span>TAN: <strong className="text-zinc-300">{settings.companyTAN || "BLRA12345C"}</strong></span>
                    <span>EPF: <strong className="text-zinc-300">{settings.companyEPF || "KN/BNG/0012345"}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                    Payslip for {formatMonthName(selectedPayslip.payrollMonth)}
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-2 font-mono">
                    Ref: {selectedPayslip.id}
                  </div>
                </div>
              </div>

              {/* Employee & Bank Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Employee Name</span>
                  <span className="font-bold text-zinc-100">{selectedPayslip.employeeName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Employee ID</span>
                  <span className="font-mono font-semibold text-zinc-300">{selectedPayslip.employeeCode}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Designation</span>
                  <span className="font-semibold text-zinc-300">{selectedPayslip.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Department</span>
                  <span className="font-semibold text-zinc-300">{selectedPayslip.department}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Monthly CTC</span>
                  <span className="font-mono font-bold text-indigo-400">
                    {formatINR(selectedPayslip.totalCTC || (selectedPayslip.grossEarnings + (selectedPayslip.employerCost || 0)))} / mo
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Annual CTC</span>
                  <span className="font-mono font-bold text-purple-400">
                    {formatINR((selectedPayslip.totalCTC || (selectedPayslip.grossEarnings + (selectedPayslip.employerCost || 0))) * 12)} / yr
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">PAN / UAN</span>
                  <span className="font-mono text-zinc-300 font-semibold">
                    {selectedPayslip.pan} / {selectedPayslip.uan}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Payable / LOP Days</span>
                  <span className="font-bold text-emerald-400">
                    {selectedPayslip.payableDays}d <span className="text-zinc-500 font-normal">({selectedPayslip.lopDays} LOP)</span>
                  </span>
                </div>
              </div>

              {/* Two Column Earnings & Deductions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Earnings Table */}
                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="bg-zinc-900 p-3 border-b border-zinc-800 flex justify-between font-bold text-xs text-emerald-400 uppercase tracking-wider">
                    <span>Earnings</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="divide-y divide-zinc-850 p-2 text-xs space-y-1">
                    {(selectedPayslip.earnings || []).map((e) => (
                      <div key={e.id} className="flex justify-between py-1.5 px-2">
                        <span className="text-zinc-300">{e.name}</span>
                        <span className="font-mono font-semibold text-zinc-100">{formatINR(e.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-zinc-900/80 p-3 border-t border-zinc-800 flex justify-between font-bold text-xs">
                    <span className="text-zinc-200">Total Gross Earnings</span>
                    <span className="font-mono text-emerald-400">{formatINR(selectedPayslip.grossEarnings)}</span>
                  </div>
                </div>

                {/* Deductions Table */}
                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="bg-zinc-900 p-3 border-b border-zinc-800 flex justify-between font-bold text-xs text-rose-400 uppercase tracking-wider">
                    <span>Deductions</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="divide-y divide-zinc-850 p-2 text-xs space-y-1">
                    {(selectedPayslip.deductions || []).map((d) => (
                      <div key={d.id} className="flex justify-between py-1.5 px-2">
                        <span className="text-zinc-300">{d.name}</span>
                        <span className="font-mono font-semibold text-zinc-100">{formatINR(d.amount)}</span>
                      </div>
                    ))}
                    {(selectedPayslip.deductions || []).length === 0 && (
                      <div className="p-4 text-zinc-600 text-center italic">No deductions</div>
                    )}
                  </div>
                  <div className="bg-zinc-900/80 p-3 border-t border-zinc-800 flex justify-between font-bold text-xs">
                    <span className="text-zinc-200">Total Deductions</span>
                    <span className="font-mono text-rose-400">{formatINR(selectedPayslip.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight Banner */}
              <div className="bg-gradient-to-r from-indigo-950/60 to-zinc-900 border border-indigo-800/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 block">
                    Net Take-Home Pay (Disbursement)
                  </span>
                  <div className="text-2xl font-black font-mono text-indigo-400 mt-0.5">
                    {formatINR(selectedPayslip.netPay)}
                  </div>
                </div>
                <div className="text-xs text-zinc-400 font-medium sm:text-right">
                  <span>Gross: <strong className="font-mono text-emerald-400">{formatINR(selectedPayslip.grossEarnings)}</strong></span>
                  <span className="mx-2">•</span>
                  <span>Deductions: <strong className="font-mono text-rose-400">{formatINR(selectedPayslip.totalDeductions)}</strong></span>
                </div>
              </div>

              {/* Employer Contributions Note */}
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800 text-xs flex justify-between items-center text-zinc-400">
                <span>Total Employer Benefits & Statutory Cost (CTC Component):</span>
                <span className="font-mono font-bold text-purple-400">
                  {formatINR(selectedPayslip.employerCost)}
                </span>
              </div>

              {/* Footer Statutory Declaration */}
              <div className="text-center pt-4 border-t border-zinc-850 text-[10px] text-zinc-500 leading-relaxed">
                <p>This is a computer-generated salary slip and requires no physical signature.</p>
                <p className="mt-0.5">Generated via Hisaab Payroll HRMS System in compliance with Wage Code 2019.</p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-dashed border-zinc-800 p-16 rounded-2xl text-center space-y-2">
              <FileText className="size-8 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-300">No Payslip Selected</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Select an employee from the left panel to preview or print their official monthly salary slip.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
