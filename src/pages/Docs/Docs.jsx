import React, { useState } from "react";
import {
  BookOpen,
  FileCode2,
  Users,
  ShieldCheck,
  Clock,
  Sparkles,
  DollarSign,
  PlayCircle,
  HelpCircle,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Info,
  Calendar,
  Percent,
  Layers,
  Building,
  CreditCard,
  Sun,
  Coffee,
  FileText,
  AlertCircle,
  TrendingUp,
  Search,
  Check,
  ChevronRight,
  Landmark,
  Receipt,
  HeartPulse,
  Award,
  GraduationCap,
  Car,
  Home,
  Shield,
  Briefcase,
  Gift,
  Database,
  Server,
  Key,
  Cpu,
  FolderGit2,
  Table,
  Factory,
  Package,
  Wrench,
  Printer,
  BadgeCheck,
  Scale,
} from "lucide-react";

export default function Docs() {
  const [activeTab, setActiveTab] = useState("wage_types");
  const [activeWageSubTab, setActiveWageSubTab] = useState("piece_rate");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "wage_types", label: "Wage Types & Pay Models", icon: Users, count: "4 Models" },
    { id: "salary_components", label: "All Salary Components (Real-World)", icon: FileCode2, count: "25+" },
    { id: "statutory_compliance", label: "Statutory Acts & Compliance Rules", icon: ShieldCheck, count: "10 Acts" },
    { id: "employee_salaries", label: "Salary Assignments & History", icon: Layers, count: "Structure" },
    { id: "overtime_policies", label: "Overtime & Shift Policies", icon: Clock, count: "Factories Act" },
    { id: "incentives_bonuses", label: "Incentives & Bonuses", icon: Sparkles, count: "Bonus Act" },
    { id: "loans_advances", label: "Loans & Salary Advances", icon: DollarSign, count: "Recovery" },
    { id: "payroll_lifecycle", label: "Payroll Run Lifecycle", icon: PlayCircle, count: "4 Steps" },
    { id: "database_schema", label: "Database Schema & Architecture Patterns", icon: Database, count: "12 Collections" },
  ];

  const wageSubTabs = [
    { id: "piece_rate", label: "Piece Rate (Production & Packaging)", icon: Package, badge: "Output Based" },
    { id: "daily_wage", label: "Daily Wage (Plant & Factory Staff)", icon: Factory, badge: "Per-Day Rate" },
    { id: "hourly_rate", label: "Hourly Rate (Specialists & Retainers)", icon: Clock, badge: "Timesheet Based" },
    { id: "monthly_salaried", label: "Monthly Salaried (White-Collar CTC)", icon: Briefcase, badge: "Annual CTC" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-zinc-900/80 p-6 rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600/20 rounded-xl border border-indigo-500/40 text-indigo-400">
                <BookOpen className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-100 tracking-tight">
                  Hisaab Payroll Master Documentation & Compliance Guide
                </h2>
                <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-widest block mt-0.5">
                  Complete Real-World Indian HRMS & Statutory Encyclopedia
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-300 mt-2.5 max-w-3xl leading-relaxed">
              Every single salary allowance, statutory government deduction, employer contribution formula, multi-wage model, and compliance law explained in <strong>crystal-clear, simple English</strong> with real calculation walkthroughs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              FY 2026-27 Compliant
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Icon className="size-4" />
              <span>{t.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-md font-mono ${
                isActive ? "bg-indigo-700 text-indigo-100" : "bg-zinc-800 text-zinc-400"
              }`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: WAGE TYPES & REAL-WORLD PAY MODELS (WITH LIVE REALISTIC PAYSLIPS) */}
      {/* ========================================================================= */}
      {activeTab === "wage_types" && (
        <div className="space-y-6 text-xs leading-relaxed">
          {/* Main Context Card */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Users className="size-4 text-indigo-400" />
                  Real-World Indian Wage Types & Output Payment Systems
                </h3>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  How modern Indian enterprises calculate compensation across White-Collar, Blue-Collar, Freelance, and Production Factory Staff.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-purple-950/80 text-purple-300 border border-purple-800/60 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                  <Scale className="size-3" />
                  Minimum Wages Act Compliant
                </span>
              </div>
            </div>

            {/* Sub-tabs Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {wageSubTabs.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeWageSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveWageSubTab(sub.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSubActive
                        ? "bg-indigo-950/70 border-indigo-500 text-white shadow-lg shadow-indigo-950/50"
                        : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-lg ${isSubActive ? "bg-indigo-600 text-white" : "bg-zinc-900 text-zinc-400"}`}>
                        <SubIcon className="size-4" />
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                        isSubActive ? "bg-indigo-900/80 text-indigo-200" : "bg-zinc-900 text-zinc-500"
                      }`}>
                        {sub.badge}
                      </span>
                    </div>
                    <span className="font-bold text-xs tracking-tight">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SUB-TAB 1: PIECE-RATE PRODUCTION WAGE (OUTPUT BASED) */}
          {/* --------------------------------------------------------------------- */}
          {activeWageSubTab === "piece_rate" && (
            <div className="space-y-6">
              {/* Industry & Legal Rules Card */}
              <div className="bg-zinc-900/60 border border-purple-500/30 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                      <Package className="size-4" />
                      1. Piece-Rate Output System: Real-World Industry Operation
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      Standard in Garment/Apparel, Automotive Machining, Fabrication, Sorting & Packaging, Footwear & FMCG plants.
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg font-mono font-bold">
                    Formula: (Passed Units × Unit Rate) + Efficiency Bonus + 2.0x OT
                  </span>
                </div>

                {/* 5 Core Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-purple-300 block font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" />
                      A. QA Inspection & Rejection Rules
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Workers log daily Job Cards. Payment is made strictly on <strong>QA Passed/Approved Units</strong>. Under the <em>Payment of Wages Act (Sec 9 & 10)</em>, arbitrary scrap fines are prohibited—unapproved pieces are simply excluded from the billable output count.
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-purple-300 block font-semibold flex items-center gap-1.5">
                      <Scale className="size-3.5" />
                      B. Guaranteed Fall-Back Wage (Sec 17)
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Under <em>Section 17 of Minimum Wages Act</em>, if machine breakdown, power cut, or raw material shortage halts production (without worker fault), the worker is legally guaranteed the <strong>State Minimum Daily Time Wage</strong> so earnings never drop to zero.
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-purple-300 block font-semibold flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      C. Piece-Rate Overtime (Factories Act Sec 59)
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Ordinary Hourly Rate = <code className="text-zinc-200">Total Piece Earnings ÷ Total Regular Hours</code>. Any extra shift or weekend production beyond 9h/day is paid at <strong>Double Rate (2.0x of Ordinary Hourly Rate)</strong>.
                    </p>
                  </div>
                </div>

                {/* EPF & ESIC Treatment */}
                <div className="p-3.5 bg-purple-950/30 border border-purple-800/50 rounded-xl text-zinc-300 flex items-start gap-2.5">
                  <Info className="size-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-purple-200 block text-xs">Statutory EPF & ESIC Treatment for Piece-Rate:</strong>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      EPFO considers total piece output earnings as statutory Basic Wages for calculating <strong>12% Employee EPF</strong> (capped at ₹15,000 ceiling). If monthly gross is ≤ ₹21,000, <strong>0.75% Employee ESIC</strong> & <strong>3.25% Employer ESIC</strong> is mandatory deducted.
                    </p>
                  </div>
                </div>
              </div>

              {/* LIVE REALISTIC SALARY SLIP (PIECE RATE) */}
              <div className="bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Payslip Header */}
                <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-5 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-purple-950 border border-purple-700 text-purple-300 rounded-lg font-bold font-mono text-[11px]">
                        PAYSLIP
                      </span>
                      <h3 className="font-black text-sm text-zinc-100 tracking-tight">ACME MANUFACTURING INDIA PVT LTD</h3>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      Plot 45, Peenya Industrial Area, Phase II, Bengaluru, Karnataka 560058 • CIN: U72200KA2024PTC123456
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-purple-400 block">PAYSLIP FOR: AUGUST 2026</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Generated: 2026-08-31 • Cycle: Monthly</span>
                  </div>
                </div>

                {/* Employee Details & Production Meta Grid */}
                <div className="p-5 bg-zinc-900/40 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Employee ID / Name</span>
                    <strong className="text-zinc-100 font-bold text-xs">EMP007 - Manoj Yadav</strong>
                    <span className="text-zinc-400 block text-[10px]">Machine Fabricator & Welder</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Department / Wage Type</span>
                    <strong className="text-purple-300 font-bold">Fabrication Unit • PIECE_RATE</strong>
                    <span className="text-zinc-400 block text-[10px]">Job Card: JC-2026-AUG-882</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Bank Details</span>
                    <strong className="text-zinc-200 font-mono">Punjab National Bank</strong>
                    <span className="text-zinc-400 block text-[10px] font-mono">A/c: 7788XXXXXX112</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Statutory IDs</span>
                    <span className="text-zinc-300 font-mono block text-[10px]">UAN: 100778899001</span>
                    <span className="text-zinc-400 font-mono block text-[10px]">ESIC: 50000123450000001</span>
                  </div>
                </div>

                {/* Production & QA Summary Card */}
                <div className="m-5 p-4 bg-purple-950/20 border border-purple-800/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-800/30">
                    <span className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                      <BadgeCheck className="size-4 text-purple-400" />
                      Verified Production Log & Quality Assurance Summary
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      Standard Quota: 1,300 Units
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-[11px]">
                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Total Fabricated</span>
                      <strong className="text-zinc-100">1,620 Units</strong>
                    </div>
                    <div className="p-2 bg-zinc-950 rounded-lg border border-emerald-900/60">
                      <span className="text-emerald-500 block text-[10px]">QA Passed (Billable)</span>
                      <strong className="text-emerald-400 font-bold">1,550 Units</strong>
                    </div>
                    <div className="p-2 bg-zinc-950 rounded-lg border border-rose-900/60">
                      <span className="text-rose-500 block text-[10px]">QA Rejected (Scrap)</span>
                      <strong className="text-rose-400">70 Units (0 ₹)</strong>
                    </div>
                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Unit Piece Rate</span>
                      <strong className="text-purple-300">₹ 18.00 / Unit</strong>
                    </div>
                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px]">Ordinary Hourly Avg</span>
                      <strong className="text-amber-300">₹ 145.31 / Hr</strong>
                    </div>
                  </div>
                </div>

                {/* Earnings & Deductions Tables */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Earnings Column */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-emerald-800/60">
                      <strong className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Earnings (Gross Pay)</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Piece Production Output Wages</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">1,550 Approved Units × ₹18.00/unit</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 27,900.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">High-Efficiency Target Bonus</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Exceeded 1,300 quota (+250 extra units)</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">₹ 2,500.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Overtime Pay (Factories Act 2.0x)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">24 OT Hours @ (₹145.31 × 2.0x)</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 6,975.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Paid Weekly Rest Days (Sundays)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">4 Sundays mandatory statutory rest pay</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 1,392.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-800/40">
                      <span>TOTAL GROSS EARNINGS (A):</span>
                      <span className="font-mono text-sm">₹ 38,767.00</span>
                    </div>
                  </div>

                  {/* Deductions Column */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-rose-800/60">
                      <strong className="text-rose-400 font-bold text-xs uppercase tracking-wider">Deductions (Statutory & Advance)</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Employee Provident Fund (EPF 12%)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Statutory 12% capped on ₹15,000 base</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 1,800.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Employee State Insurance (ESIC 0.75%)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">0.75% of Gross Wages</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 291.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Professional Tax (PT Karnataka)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Applicable for monthly earnings &gt; ₹15,000</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 200.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Salary Advance / Tool Kit Recovery</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Mid-month emergency advance recovery</span>
                        </div>
                        <span className="font-mono font-bold text-rose-400">₹ 1,500.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-rose-400 bg-rose-950/20 p-2.5 rounded-xl border border-rose-800/40">
                      <span>TOTAL DEDUCTIONS (B):</span>
                      <span className="font-mono text-sm">₹ 3,791.00</span>
                    </div>
                  </div>
                </div>

                {/* Net Pay Highlight Bar */}
                <div className="p-5 bg-gradient-to-r from-purple-950/60 via-indigo-950/80 to-purple-950/60 border-t border-b border-purple-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-purple-300 font-bold uppercase tracking-widest block">
                      NET PAYABLE TAKE-HOME (GROSS A − DEDUCTIONS B)
                    </span>
                    <strong className="text-2xl font-black text-white font-mono tracking-tight">₹ 34,976.00</strong>
                    <span className="text-[11px] text-zinc-300 block mt-0.5">
                      Amount in Words: <strong>Rupees Thirty Four Thousand Nine Hundred Seventy Six Only</strong>
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Direct Bank Transfer (NEFT)
                  </div>
                </div>

                {/* Employer Statutory Cost Summary */}
                <div className="p-4 bg-zinc-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] border-b border-zinc-800">
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono">
                    <span className="text-zinc-500 block text-[10px]">Employer EPF (12% on ₹15k):</span>
                    <strong className="text-zinc-200">₹ 1,800.00</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono">
                    <span className="text-zinc-500 block text-[10px]">Employer ESIC (3.25%):</span>
                    <strong className="text-zinc-200">₹ 1,260.00</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono">
                    <span className="text-zinc-500 block text-[10px]">Gratuity Provision (4.81%):</span>
                    <strong className="text-zinc-200">₹ 745.00</strong>
                  </div>
                </div>

                {/* Payslip Footnote */}
                <div className="p-4 bg-zinc-950 text-[10px] text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span>This is a computer-generated statutory payroll statement under the Payment of Wages Act, 1936. No physical signature required.</span>
                  <span className="font-mono text-zinc-400">Employer Cost (CTC): ₹ 42,572.00</span>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SUB-TAB 2: DAILY WAGE WORKER (PER-DAY RATE & WEEKLY OFFS) */}
          {/* --------------------------------------------------------------------- */}
          {activeWageSubTab === "daily_wage" && (
            <div className="space-y-6">
              <div className="bg-zinc-900/60 border border-emerald-500/30 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                      <Factory className="size-4" />
                      2. Daily Wage Worker: Real-World Plant & Factory Operations
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      Standard in Assembly Lines, Construction, Heavy Machinery, Warehouses, and Plant Maintenance.
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg font-mono font-bold">
                    Formula: (Present Days × Daily Rate) + Paid Sundays + 2.0x Double OT
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-emerald-300 block font-semibold flex items-center gap-1.5">
                      <Sun className="size-3.5" />
                      A. Mandatory Paid Weekly Offs (Sundays)
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Under <em>Section 52 of the Factories Act & Weekly Holidays Act</em>, every worker who completes a 6-day work week is entitled to a <strong>Paid Weekly Rest Day</strong> at their full daily rate.
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-emerald-300 block font-semibold flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      B. Factories Act 2.0x Overtime Multiplier
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Hourly Base Rate = <code className="text-zinc-200">Daily Rate ÷ 8 Hours</code>. Any extra shift hours worked on weekdays or Sundays receive statutory <strong>2.0x Double Wages</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-emerald-300 block font-semibold flex items-center gap-1.5">
                      <HeartPulse className="size-3.5" />
                      C. ESIC Medical Cover (0.75% / 3.25%)
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Since daily wage workers typically earn under ₹21,000 monthly gross, ESIC deduction gives them and their families 100% free medical treatment in ESIC dispensaries and cash sickness benefits.
                    </p>
                  </div>
                </div>
              </div>

              {/* LIVE REALISTIC SALARY SLIP (DAILY WAGE) */}
              <div className="bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-5 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-lg font-bold font-mono text-[11px]">
                        PAYSLIP
                      </span>
                      <h3 className="font-black text-sm text-zinc-100 tracking-tight">ACME TECHNOLOGIES PVT LTD</h3>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Manufacturing & Heavy Assembly Division • Peenya Plant 1</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">PAYSLIP FOR: AUGUST 2026</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Muster Roll Ref: MR-2026-08</span>
                  </div>
                </div>

                <div className="p-5 bg-zinc-900/40 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Employee Name</span>
                    <strong className="text-zinc-100 font-bold text-xs">EMP003 - Ramesh Kumar</strong>
                    <span className="text-zinc-400 block text-[10px]">Plant Machine Operator (Skilled)</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Wage Structure</span>
                    <strong className="text-emerald-300 font-bold">DAILY_WAGE @ ₹650 / Day</strong>
                    <span className="text-zinc-400 block text-[10px]">Ordinary Hr: ₹81.25 / hr</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Attendance Breakdown</span>
                    <strong className="text-zinc-200">24 Present + 4 Sundays + 1 Holiday</strong>
                    <span className="text-zinc-400 block text-[10px]">Payable Days: 29 Days</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Bank & ESIC</span>
                    <span className="text-zinc-300 font-mono block text-[10px]">SBI A/c: 3012XXXXX789</span>
                    <span className="text-zinc-400 font-mono block text-[10px]">ESIC: 50000123450000001</span>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-emerald-800/60">
                      <strong className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Earnings (Gross Pay)</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Daily Work Wages</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">24 Present Days × ₹650.00/day</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 15,600.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Paid Weekly Offs (Sundays)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">4 Sundays × ₹650.00/day</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 2,600.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Paid Statutory Holiday (Independence Day)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">1 Declared Public Holiday × ₹650.00</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 650.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Approved Overtime (Factories Act 2.0x)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">16 OT Hours @ (₹81.25 × 2.0x Double)</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">₹ 2,600.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-800/40">
                      <span>TOTAL GROSS EARNINGS (A):</span>
                      <span className="font-mono text-sm">₹ 21,450.00</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-rose-800/60">
                      <strong className="text-rose-400 font-bold text-xs uppercase tracking-wider">Deductions</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Employee State Insurance (ESIC 0.75%)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">0.75% of Gross Wages</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 161.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Professional Tax (PT)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">State Professional Tax Deduction</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 200.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Plant Canteen / Mess Recovery</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Subsidized monthly meal coupon charges</span>
                        </div>
                        <span className="font-mono font-bold text-rose-400">₹ 1,000.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-rose-400 bg-rose-950/20 p-2.5 rounded-xl border border-rose-800/40">
                      <span>TOTAL DEDUCTIONS (B):</span>
                      <span className="font-mono text-sm">₹ 1,361.00</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-emerald-950/60 border-t border-b border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest block">
                      NET TAKE-HOME PAY (BANK CREDIT)
                    </span>
                    <strong className="text-2xl font-black text-white font-mono tracking-tight">₹ 20,089.00</strong>
                    <span className="text-[11px] text-zinc-300 block mt-0.5">
                      Amount in Words: <strong>Rupees Twenty Thousand Eighty Nine Only</strong>
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-emerald-950 border border-emerald-700/60 rounded-xl text-emerald-300 font-mono text-xs font-bold">
                    SBI Direct Bank Transfer
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SUB-TAB 3: HOURLY RATE (SPECIALISTS & CONSULTANTS) */}
          {/* --------------------------------------------------------------------- */}
          {activeWageSubTab === "hourly_rate" && (
            <div className="space-y-6">
              <div className="bg-zinc-900/60 border border-cyan-500/30 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <Clock className="size-4" />
                      3. Hourly Rate Consulting: Tech Specialists & Freelance Retainers
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      Standard for UI/UX Specialists, On-Call DevOps Engineers, Corporate Trainers, and Visiting Doctors.
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg font-mono font-bold">
                    Formula: (Logged Hours × Hourly Rate) + 1.5x Shift Extension + Milestone Bonus
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-cyan-300 block font-semibold flex items-center gap-1.5">
                      <FileText className="size-3.5" />
                      A. Verified Timesheet Billing
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Consultants log hours into project management tools (Jira, Clockify, Git commits). Payroll runs on approved timesheets up to monthly contract cap (typically 160 hrs).
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-cyan-300 block font-semibold flex items-center gap-1.5">
                      <TrendingUp className="size-3.5" />
                      B. Emergency On-Call & Extension Multiplier
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Weekend critical maintenance, incident response, or rush deliverables beyond 160 hrs are compensated at <strong>1.5x or 2.0x contract multiplier</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-cyan-300 block font-semibold flex items-center gap-1.5">
                      <Landmark className="size-3.5" />
                      C. Professional TDS (Sec 194J / Sec 192)
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Depending on contract structure (Employee vs Retained Professional), statutory TDS under Section 194J (10%/2%) or salary slab TDS is deducted at source.
                    </p>
                  </div>
                </div>
              </div>

              {/* LIVE REALISTIC SALARY SLIP (HOURLY) */}
              <div className="bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-5 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-cyan-950 border border-cyan-700 text-cyan-300 rounded-lg font-bold font-mono text-[11px]">
                        PAYSLIP
                      </span>
                      <h3 className="font-black text-sm text-zinc-100 tracking-tight">ACME TECHNOLOGIES PVT LTD</h3>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Specialized Consulting & Digital Advisory Services</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400 block">PAYSLIP FOR: AUGUST 2026</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Timesheet Batch: TS-2026-AUG</span>
                  </div>
                </div>

                <div className="p-5 bg-zinc-900/40 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Consultant Name</span>
                    <strong className="text-zinc-100 font-bold text-xs">EMP005 - Deepa Krishnan</strong>
                    <span className="text-zinc-400 block text-[10px]">Design Systems Lead Consultant</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Billing Rate</span>
                    <strong className="text-cyan-300 font-bold">HOURLY @ ₹450 / Hour</strong>
                    <span className="text-zinc-400 block text-[10px]">Overtime Multiplier: 1.5x</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Timesheet Logged</span>
                    <strong className="text-zinc-200">160 Regular + 20 Emergency OT</strong>
                    <span className="text-zinc-400 block text-[10px]">Total Hours: 180 Hours</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Bank Details</span>
                    <span className="text-zinc-300 font-mono block text-[10px]">Kotak Bank: 4019XXXX645</span>
                    <span className="text-zinc-400 font-mono block text-[10px]">PAN: KRNJ4567D</span>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-emerald-800/60">
                      <strong className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Earnings (Gross Pay)</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Regular Retainer Consulting Pay</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">160 Approved Timesheet Hours × ₹450.00/hr</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 72,000.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Shift Extension & Overtime Pay</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">20 Night On-Call Hours @ (₹450 × 1.5x = ₹675/hr)</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 13,500.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Design System Milestone Bonus</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Figma Design Token Release Target Bonus</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">₹ 5,000.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-800/40">
                      <span>TOTAL GROSS EARNINGS (A):</span>
                      <span className="font-mono text-sm">₹ 90,500.00</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-rose-800/60">
                      <strong className="text-rose-400 font-bold text-xs uppercase tracking-wider">Deductions & TDS</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Professional Tax (PT)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">State Professional Tax Deduction</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 200.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Tax Deducted at Source (TDS Sec 194J)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Professional Technical Fees 5% TDS</span>
                        </div>
                        <span className="font-mono font-bold text-rose-400">₹ 4,525.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-rose-400 bg-rose-950/20 p-2.5 rounded-xl border border-rose-800/40">
                      <span>TOTAL DEDUCTIONS (B):</span>
                      <span className="font-mono text-sm">₹ 4,725.00</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-cyan-950/60 via-zinc-900 to-cyan-950/60 border-t border-b border-cyan-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest block">
                      NET REMITTANCE TO CONSULTANT
                    </span>
                    <strong className="text-2xl font-black text-white font-mono tracking-tight">₹ 85,775.00</strong>
                    <span className="text-[11px] text-zinc-300 block mt-0.5">
                      Amount in Words: <strong>Rupees Eighty Five Thousand Seven Hundred Seventy Five Only</strong>
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-cyan-950 border border-cyan-700/60 rounded-xl text-cyan-300 font-mono text-xs font-bold">
                    Kotak IMPS Credit
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SUB-TAB 4: MONTHLY SALARIED (CORPORATE WHITE-COLLAR CTC) */}
          {/* --------------------------------------------------------------------- */}
          {activeWageSubTab === "monthly_salaried" && (
            <div className="space-y-6">
              <div className="bg-zinc-900/60 border border-indigo-500/30 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                      <Briefcase className="size-4" />
                      4. Monthly Salaried: Corporate Cost to Company (CTC) Structure
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      Standard for Software Engineers, Product Managers, Corporate Finance, HR, and Operations Management.
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg font-mono font-bold">
                    Formula: (Monthly CTC − Employer PF/Gratuity) Pro-rated by LOP Days
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-indigo-300 block font-semibold flex items-center gap-1.5">
                      <Calculator className="size-3.5" />
                      A. 50% Basic Salary Rule
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      Under the <em>Code on Wages 2019</em>, Basic + DA must comprise at least <strong>50% of total compensation</strong> to ensure robust statutory retirement benefits (EPF, Gratuity, and Leave Encashment).
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-indigo-300 block font-semibold flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      B. Loss of Pay (LOP) Pro-ration
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      When an employee takes unpaid leave: <code className="text-zinc-200">Proration Ratio = Payable Days ÷ Calendar Days (31)</code>. All prorated earnings (Basic, HRA, Special Allowance) are automatically adjusted.
                    </p>
                  </div>

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1.5">
                    <strong className="text-indigo-300 block font-semibold flex items-center gap-1.5">
                      <Home className="size-3.5" />
                      C. Tax Exemption under Sec 10(13A)
                    </strong>
                    <p className="text-zinc-400 text-[11px]">
                      HRA (40% to 50% of Basic) provides tax exemptions under Old Regime. Special Allowance acts as the residual balance component to match exact agreed monthly CTC.
                    </p>
                  </div>
                </div>
              </div>

              {/* LIVE REALISTIC SALARY SLIP (MONTHLY SALARIED) */}
              <div className="bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-5 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded-lg font-bold font-mono text-[11px]">
                        PAYSLIP
                      </span>
                      <h3 className="font-black text-sm text-zinc-100 tracking-tight">ACME TECHNOLOGIES PVT LTD</h3>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Corporate HQ, Outer Ring Road, Bengaluru 560103</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-indigo-400 block">PAYSLIP FOR: AUGUST 2026</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Tax Regime: New Regime (Sec 115BAC)</span>
                  </div>
                </div>

                <div className="p-5 bg-zinc-900/40 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Employee Name</span>
                    <strong className="text-zinc-100 font-bold text-xs">EMP001 - Rahul Sharma</strong>
                    <span className="text-zinc-400 block text-[10px]">Lead Systems Architect (Engineering)</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Annual CTC</span>
                    <strong className="text-indigo-300 font-bold font-mono">₹ 12,00,000 / Annum</strong>
                    <span className="text-zinc-400 block text-[10px]">Monthly CTC: ₹ 1,00,000 / mo</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Working Days (LOP: 1 Day)</span>
                    <strong className="text-zinc-200">30 Payable Days (out of 31)</strong>
                    <span className="text-zinc-400 block text-[10px]">LOP Proration: 30/31</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Statutory Details</span>
                    <span className="text-zinc-300 font-mono block text-[10px]">HDFC A/c: 5010XXXXXX7890</span>
                    <span className="text-zinc-400 font-mono block text-[10px]">PAN: ABCDE1234F • UAN: 100987654321</span>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-emerald-800/60">
                      <strong className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Earnings (Gross Pay)</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Basic Salary (50% CTC)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Base ₹50,000 (Prorated for 30/31 Days)</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 48,387.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">House Rent Allowance (HRA 40%)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">40% of Basic (Prorated for 30/31 Days)</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 19,355.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Internet & WFH Allowance</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Broadband & remote work support</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 1,500.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Special Balancing Allowance</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Residual allowance (Prorated for 30/31 Days)</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 22,091.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Quarterly Architecture Incentive</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">Approved Performance Spot Reward</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">₹ 5,000.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-800/40">
                      <span>TOTAL GROSS EARNINGS (A):</span>
                      <span className="font-mono text-sm">₹ 96,333.00</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-rose-800/60">
                      <strong className="text-rose-400 font-bold text-xs uppercase tracking-wider">Deductions & Taxes</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">Amount (₹)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Employee Provident Fund (EPF 12%)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">12% on ₹15,000 statutory ceiling</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 1,800.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Professional Tax (PT Karnataka)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">State Professional Tax</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-100">₹ 200.00</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-zinc-800/60">
                        <div>
                          <strong className="text-zinc-200 block">Income Tax TDS (Monthly Installment)</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">TDS under New Tax Regime projected tax</span>
                        </div>
                        <span className="font-mono font-bold text-rose-400">₹ 4,500.00</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-rose-400 bg-rose-950/20 p-2.5 rounded-xl border border-rose-800/40">
                      <span>TOTAL DEDUCTIONS (B):</span>
                      <span className="font-mono text-sm">₹ 6,500.00</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-indigo-950/60 border-t border-b border-indigo-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block">
                      NET SALARY CREDITED TO BANK
                    </span>
                    <strong className="text-2xl font-black text-white font-mono tracking-tight">₹ 89,833.00</strong>
                    <span className="text-[11px] text-zinc-300 block mt-0.5">
                      Amount in Words: <strong>Rupees Eighty Nine Thousand Eight Hundred Thirty Three Only</strong>
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-indigo-950 border border-indigo-700/60 rounded-xl text-indigo-300 font-mono text-xs font-bold">
                    HDFC Direct Salary Account
                  </div>
                </div>

                {/* Employer Contributions breakdown */}
                <div className="p-4 bg-zinc-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] border-b border-zinc-800">
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono">
                    <span className="text-zinc-500 block text-[10px]">Employer EPF (12% on ₹15k):</span>
                    <strong className="text-zinc-200">₹ 1,800.00</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono">
                    <span className="text-zinc-500 block text-[10px]">Gratuity Provision (4.81% of Basic):</span>
                    <strong className="text-zinc-200">₹ 2,327.00</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono">
                    <span className="text-zinc-500 block text-[10px]">Group Health & Life Insurance:</span>
                    <strong className="text-zinc-200">₹ 1,000.00</strong>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950 text-[10px] text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <span>Confidential Payroll Document • Generated by Hisaab Centralized Payroll Engine</span>
                  <span className="font-mono text-zinc-400">Total Employer Cost (CTC): ₹ 1,01,460.00</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ALL REAL-WORLD SALARY COMPONENTS (EARNINGS, DEDUCTIONS, EMPLOYER) */}
      {/* ========================================================================= */}
      {activeTab === "salary_components" && (
        <div className="space-y-6 text-xs leading-relaxed">
          {/* Introduction Card */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <FileCode2 className="size-4 text-indigo-400" />
              Understanding Salary Components in Real-World Indian Payroll
            </h3>
            <p className="text-zinc-300">
              In India, an employee's total compensation package (Cost to Company - CTC) cannot be paid as a single raw lump sum. Indian Labour Laws and Income Tax regulations divide compensation into <strong>3 major categories</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl">
                <strong className="text-emerald-300 block text-xs">1. Fixed & Variable Earnings</strong>
                <span className="text-zinc-400 text-[11px]">Direct pay credited to employee bank account (Gross Salary).</span>
              </div>
              <div className="p-3 bg-rose-950/30 border border-rose-800/50 rounded-xl">
                <strong className="text-rose-300 block text-xs">2. Employee Deductions</strong>
                <span className="text-zinc-400 text-[11px]">Legally mandated or voluntary deductions withheld before payout.</span>
              </div>
              <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-xl">
                <strong className="text-purple-300 block text-xs">3. Employer Contributions</strong>
                <span className="text-zinc-400 text-[11px]">Company-paid statutory retirement & insurance benefits in CTC.</span>
              </div>
            </div>
          </div>

          {/* 1. COMPREHENSIVE EARNINGS & ALLOWANCES */}
          <div className="space-y-3">
            <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <span className="p-1 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">🟢</span>
              1. Full Real-World Earnings & Allowances Catalogue
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Basic */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Basic Salary</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">40% - 50% CTC</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  The foundational core of Indian salary. Fully taxable. Acts as the statutory calculation base for EPF, Gratuity, Bonus, and Overtime.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Taxable: 100% • Base for PF: Yes</div>
              </div>

              {/* DA */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Dearness Allowance (DA)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">Cost of Living</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Inflation-linked allowance primarily used in government, public sector, and minimum wage blue-collar manufacturing industries.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Taxable: 100% • Base for PF: Yes</div>
              </div>

              {/* HRA */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">House Rent Allowance (HRA)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">40% / 50% Basic</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  50% of Basic for Metro cities (Mumbai, Delhi, Kolkata, Chennai); 40% for Non-Metro. Tax exemption available under Section 10(13A).
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Exemption: Min of 3 rules (Sec 10(13A))</div>
              </div>

              {/* Conveyance */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Conveyance / Travel Allowance</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">₹1,600 / month</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Fixed transport allowance granted to employees to meet daily expenditure on commuting between residence and workplace.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Taxable in New Regime</div>
              </div>

              {/* Medical Allowance */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Medical Allowance</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">₹1,250 / month</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Fixed allowance (₹15,000/year) paid to employees for outpatient medical consultations, medicines, and diagnostic checkups.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Taxable since FY 2018 (Standard Ded)</div>
              </div>

              {/* Leave Travel Allowance (LTA) */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Leave Travel Allowance (LTA)</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono">Annual / Monthly</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Covers domestic travel fare (air/train/bus) for employee and family. Tax-free for 2 journeys in a 4-calendar-year block under Sec 10(5).
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Exempt with actual travel proof</div>
              </div>

              {/* Children Education Allowance */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Children Education Allowance</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">₹100/child/mo</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Allowance to support children's schooling. Tax-exempt up to ₹100 per month per child (maximum 2 children = ₹200/month) under Sec 10(14).
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Hostel Allowance: Extra ₹300/child/mo</div>
              </div>

              {/* Internet & Phone Reimbursement */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Internet & Phone Allowance</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">₹1,500 - ₹3,000/mo</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Compensation for home broadband and mobile connectivity used for official duties. 100% tax-free against monthly telephone bills.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Non-taxable official expense</div>
              </div>

              {/* Meal Allowance / Food Coupons */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Meal Coupons (Sodexo / Zeta)</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">₹50 / meal</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Prepaid meal vouchers or digital food cards. Tax exemption up to ₹50 per working meal (approx. ₹2,200/month for 22 days × 2 meals).
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Tax exemption under Rule 3(7)(iii)</div>
              </div>

              {/* Shift Allowance / Night Premium */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Shift / Night Allowance</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">₹250 - ₹500/shift</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Special compensation paid to employees working in rotational evening, night (US/UK hours), or graveyard shifts in 24×7 operations.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Fully Taxable Earning</div>
              </div>

              {/* Attendance Bonus */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Attendance Reward Bonus</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">₹1,000 - ₹3,000</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Incentive reward disbursed to factory workers or retail staff who maintain 100% scheduled attendance without unexcused leaves.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Variable Earning</div>
              </div>

              {/* Special / Balancing Allowance */}
              <div className="p-4 bg-zinc-900/60 border border-indigo-800/60 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Special / Balancing Allowance</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">Balancing Residual</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  The mathematical balancing figure that absorbs the remaining CTC after allocating Basic, HRA, Fixed Allowances, and Employer Costs.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Formula: CTC − All Other Items</div>
              </div>
            </div>
          </div>

          {/* 2. COMPREHENSIVE DEDUCTIONS */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <span className="p-1 bg-rose-950 text-rose-400 rounded-lg border border-rose-800">🔴</span>
              2. Full Deductions Catalogue (Statutory, Tax & Variable Recoveries)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* EPF Employee */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">EPF Employee Share</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">12% Basic</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Deducted at 12% on Basic + DA. Capped at ₹1,800/month (12% of ₹15,000 ceiling) or uncapped based on company policy.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Section 80C Tax Benefit (Old Regime)</div>
              </div>

              {/* VPF */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Voluntary PF (VPF)</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono">Up to 100% Basic</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Voluntary additional retirement savings chosen by employee above mandatory 12%. Earns the same government interest rate as EPF.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Voluntary Employee Request</div>
              </div>

              {/* ESIC Employee */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">ESIC Employee Share</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">0.75% Gross</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Mandatory medical insurance deduction for all employees earning Gross Wages $\le$ ₹21,000/month.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Wage Ceiling: ₹21,000/month</div>
              </div>

              {/* Professional Tax */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Professional Tax (PT)</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">₹0 - ₹200/mo</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  State government employment tax. Karnataka charges ₹200 (for gross $\ge$ ₹15k), Maharashtra charges ₹200 (₹300 in Feb). Capped at ₹2,500/yr.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Article 276 Constitutional Cap</div>
              </div>

              {/* Labour Welfare Fund (LWF) */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Labour Welfare Fund (LWF)</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">₹6 - ₹25</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Statutory state contribution for blue-collar labour welfare boards. Deducted annually (Dec) or half-yearly (Jun & Dec) based on state act.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">State Specific Frequency</div>
              </div>

              {/* TDS (Income Tax Sec 192) */}
              <div className="p-4 bg-zinc-900/60 border border-rose-800/60 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Income Tax TDS (Sec 192)</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">Slab Based</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Projected annual taxable income divided by remaining months in the fiscal year under Old vs New Tax Regime (Section 115BAC).
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Standard Deduction: ₹75,000</div>
              </div>

              {/* Salary Advance Recovery */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Salary Advance Recovery</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">100% Recovery</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Single-month recovery of emergency mid-month cash advance given to employee. Deducted directly on immediate month-end payslip.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Short-Term Direct Deduction</div>
              </div>

              {/* Loan EMI Recovery */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Company Loan EMI</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono">Tenure Amortized</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Fixed monthly installment (EMI) deducted against longer tenure company personal loan until remaining balance principal reaches ₹0.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Multi-Month Amortization</div>
              </div>

              {/* Loss of Pay (LOP) */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Loss of Pay (LOP Deduction)</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono">Per-Day Salary</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Pro-rata salary deduction for unauthorized absence or unpaid leave days. Formula: <code className="text-rose-300">Gross Salary ÷ Calendar Days × Unpaid Days</code>.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-800">Attendance Driven Deduction</div>
              </div>
            </div>
          </div>

          {/* 3. COMPREHENSIVE EMPLOYER CONTRIBUTIONS & CTC COSTS */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <span className="p-1 bg-purple-950 text-purple-400 rounded-lg border border-purple-800">🟣</span>
              3. Full Employer Statutory Contributions & Company CTC Costs
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Employer EPF */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Employer EPF (3.67%)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">A/C 1</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Part of the employer's 12% contribution credited directly to employee's individual EPF retirement passbook balance.
                </p>
              </div>

              {/* Employer EPS */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Employer EPS (8.33%)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">A/C 10</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Employees' Pension Scheme pool for post-retirement monthly pension. Capped at ₹1,250/month (8.33% of ₹15,000).
                </p>
              </div>

              {/* EDLI */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">EDLI Insurance (0.50%)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">A/C 21</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Employees' Deposit Linked Insurance. Provides up to ₹7,00,000 life insurance coverage to family in case of death in service. Max ₹75/mo.
                </p>
              </div>

              {/* EPF Admin */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">EPF Admin Charges (0.50%)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">A/C 2</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Administrative operational fee paid to EPFO. 0.50% on ₹15k wage ceiling (Max ₹75/mo, minimum ₹500/establishment per month).
                </p>
              </div>

              {/* Employer ESIC */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Employer ESIC (3.25%)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">Health Cover</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Statutory health insurance contribution paid by company for employees earning gross $\le$ ₹21,000/month.
                </p>
              </div>

              {/* Gratuity Accrual */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Gratuity Provision (4.81%)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">15/26 Days</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Monthly CTC accounting provision calculated as <code className="text-purple-300">Basic × 15 ÷ (26 × 12) = 4.81%</code> under Payment of Gratuity Act 1972.
                </p>
              </div>

              {/* Corporate NPS */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Corporate NPS (10%)</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">Sec 80CCD(2)</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Employer contribution to employee's National Pension System account up to 10% of Basic+DA. 100% tax deductible under Section 80CCD(2).
                </p>
              </div>

              {/* Group Health Insurance */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-zinc-200 text-xs">Group Mediclaim / Term</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">Premium / mo</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Company-sponsored group health & term life insurance policy premium per employee included in total CTC.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STATUTORY ACTS & COMPLIANCE RULES (DETAILED LEGAL REFERENCE) */}
      {/* ========================================================================= */}
      {activeTab === "statutory_compliance" && (
        <div className="space-y-6 text-xs leading-relaxed">
          {/* Statutory Header */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="size-4 text-indigo-400" />
              Comprehensive Indian Labour Laws & Statutory Acts Reference
            </h3>
            <p className="text-zinc-300">
              India has strict central and state labour codes. Employers who fail to comply face severe penalties, interest charges, and legal notices. Here is the complete statutory roadmap:
            </p>
          </div>

          {/* Act 1 to 8 Cards */}
          <div className="space-y-4">
            {/* 1. EPFO */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-950 rounded-lg border border-indigo-800 font-mono">01</span>
                    Employees' Provident Funds & Miscellaneous Provisions Act, 1952 (EPFO)
                  </h4>
                  <span className="text-[11px] text-zinc-400">Governed by Ministry of Labour & Employment, Govt of India</span>
                </div>
                <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg font-mono font-bold">
                  12% (Employee) + 12% (Employer)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Applicability & Threshold:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Mandatory for any business employing <strong>20 or more persons</strong>. Mandatory for employees whose Basic + DA is up to <strong>₹15,000/month</strong>. Employees earning above ₹15,000 can be capped at ₹15,000 or contribute on actual wages voluntarily.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Official EPFO Account Splitup:</strong>
                  <ul className="text-zinc-400 text-[11px] space-y-1">
                    <li>• <strong>A/C 1 (EPF Employee):</strong> 12% deducted from salary (Max ₹1,800/mo)</li>
                    <li>• <strong>A/C 10 (EPS Pension Employer):</strong> 8.33% of wage (Max ₹1,250/mo)</li>
                    <li>• <strong>A/C 1 (EPF Employer):</strong> 3.67% of wage (12% − 8.33% EPS = Max ₹550/mo)</li>
                    <li>• <strong>A/C 21 (EDLI Life Insurance):</strong> 0.50% of wage (Max ₹75/mo)</li>
                    <li>• <strong>A/C 2 (EPF Admin Fee):</strong> 0.50% of wage (Min ₹500/month per company)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. ESIC */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                    <span className="p-1.5 bg-cyan-950 rounded-lg border border-cyan-800 font-mono">02</span>
                    Employees' State Insurance Act, 1948 (ESIC)
                  </h4>
                  <span className="text-[11px] text-zinc-400">Autonomous body under Ministry of Labour & Employment</span>
                </div>
                <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg font-mono font-bold">
                  0.75% (Employee) + 3.25% (Employer)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Eligibility & Wage Ceiling:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Applicable to non-seasonal factories/firms with 10+ employees. Covers all employees with <strong>Total Monthly Gross Wage ≤ ₹21,000</strong> (₹25,000 for employees with physical disabilities).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">6-Month Contribution Period Rule:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    ESIC operates in 2 contribution cycles: <strong>April to September</strong> and <strong>October to March</strong>. If an employee's salary increases above ₹21,000 mid-cycle, ESIC deduction continues till the end of that 6-month contribution cycle.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Payment of Gratuity Act */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                    <span className="p-1.5 bg-purple-950 rounded-lg border border-purple-800 font-mono">03</span>
                    Payment of Gratuity Act, 1972
                  </h4>
                  <span className="text-[11px] text-zinc-400">Statutory retirement lumpsum benefit</span>
                </div>
                <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg font-mono font-bold">
                  Formula: (15 × Last Basic × Years) / 26
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">5-Year Continuous Service Rule:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Gratuity becomes payable when an employee completes <strong>5 or more continuous years of service</strong> with the employer. (The 5-year condition is waived in case of death or permanent disablement).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Monthly CTC Accrual & ₹20 Lakh Cap:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    15 days wages per year based on a 26-day working month: <code className="text-purple-300">15 ÷ (26 × 12) = 4.81% of Basic</code>. Maximum statutory tax-exempt gratuity payout is capped at <strong>₹20,00,000</strong> (Section 10(10)).
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Professional Tax */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                    <span className="p-1.5 bg-amber-950 rounded-lg border border-amber-800 font-mono">04</span>
                    State Professional Tax (PT) Acts
                  </h4>
                  <span className="text-[11px] text-zinc-400">Empowered by Article 276 of the Indian Constitution</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg font-mono font-bold">
                  Max ₹2,500 / year Limit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-300">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <strong className="text-amber-300 text-xs">Karnataka PT:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    • Gross &lt; ₹15,000 = ₹0<br />
                    • Gross $\ge$ ₹15,000 = <strong>₹200/month</strong>
                  </p>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <strong className="text-amber-300 text-xs">Maharashtra PT:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    • Gross &lt; ₹7,500 = ₹0<br />
                    • Men &gt; ₹10k = <strong>₹200/mo (₹300 in Feb)</strong><br />
                    • Women $\le$ ₹25,000 = Exempt
                  </p>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <strong className="text-amber-300 text-xs">Tamil Nadu PT:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Half-yearly deduction in Sept & March:<br />
                    • ₹21k-₹30k = ₹135<br />
                    • ₹75k+ = <strong>₹1,250 half-yearly</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Payment of Bonus Act */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-950 rounded-lg border border-emerald-800 font-mono">05</span>
                    Payment of Bonus Act, 1965
                  </h4>
                  <span className="text-[11px] text-zinc-400">Statutory Annual Profit-Sharing Bonus</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg font-mono font-bold">
                  8.33% to 20% on ₹7,000 Ceiling
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Eligibility & Minimum Rate:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Applicable to establishments with 20+ workers. Eligible employees earn <strong>Salary $\le$ ₹21,000/month</strong>. Minimum statutory bonus is <strong>8.33%</strong> of annual Basic (equivalent to 1 full month salary).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Calculation Ceiling:</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Bonus is computed on <strong>₹7,000/month or state minimum wage</strong> (whichever is higher). Minimum bonus payable is <code className="text-emerald-300">₹7,000 × 12 × 8.33% = ₹6,997/year</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Income Tax Act 1961 - Section 192 (TDS) */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="font-bold text-sm text-rose-300 flex items-center gap-2">
                    <span className="p-1.5 bg-rose-950 rounded-lg border border-rose-800 font-mono">06</span>
                    Income Tax Act, 1961 - Section 192 (Salaries TDS)
                  </h4>
                  <span className="text-[11px] text-zinc-400">CBDT Annual Tax Withholding Obligations</span>
                </div>
                <span className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg font-mono font-bold">
                  New Regime 115BAC vs Old Regime
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Default New Tax Regime (Section 115BAC):</strong>
                  <ul className="text-zinc-400 text-[11px] space-y-1">
                    <li>• Standard Deduction: <strong>₹75,000</strong></li>
                    <li>• Zero Tax on total income up to <strong>₹7,75,000</strong> (with Sec 87A rebate)</li>
                    <li>• Simplified tax slabs, no 80C/80D paperwork required</li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <strong className="text-zinc-100 block">Optional Old Tax Regime:</strong>
                  <ul className="text-zinc-400 text-[11px] space-y-1">
                    <li>• Standard Deduction: <strong>₹50,000</strong></li>
                    <li>• Section 80C deductions up to ₹1,50,000 (EPF, ELSS, PPF, Life Insurance)</li>
                    <li>• Section 10(13A) HRA exemption + Section 80D Health Insurance deduction</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 7. Factories Act & Overtime */}
            <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="font-bold text-sm text-blue-300 flex items-center gap-2">
                    <span className="p-1.5 bg-blue-950 rounded-lg border border-blue-800 font-mono">07</span>
                    Factories Act, 1948 - Section 59 (Overtime Wages)
                  </h4>
                  <span className="text-[11px] text-zinc-400">Working hours, rest intervals & overtime limits</span>
                </div>
                <span className="px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded-lg font-mono font-bold">
                  2.0x Double Rate for Overtime
                </span>
              </div>

              <p className="text-zinc-300 text-[11px]">
                Under Section 59, any employee working more than <strong>9 hours in a day</strong> or more than <strong>48 hours in a week</strong> is legally entitled to overtime wages at <strong>twice the ordinary rate of wages (2.0x Double Rate)</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMPLOYEE SALARIES & MULTI-WAGE */}
      {activeTab === "employee_salaries" && (
        <div className="space-y-6 text-xs leading-relaxed">
          {/* Why Multi-Wage Architecture */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Users className="size-4 text-indigo-400" />
              Universal Multi-Wage Architecture: Why 4 Pay Types?
            </h3>
            <p className="text-zinc-300">
              Modern enterprises employ diverse workforces: IT software engineers, sales executives, factory machine operators, security guards, delivery agents, and freelance consultants. A single monthly salary model cannot serve all of them. Our system supports <strong>4 distinct Pay Types</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-indigo-950/30 border border-indigo-800/50 rounded-xl space-y-1">
                <span className="font-bold text-indigo-300 text-xs">1. Monthly Salaried</span>
                <p className="text-zinc-400 text-[11px]">
                  Fixed monthly CTC with Loss of Pay (LOP) per-day deductions for unpaid leaves. Standard for corporate & management staff.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-1">
                <span className="font-bold text-emerald-300 text-xs">2. Daily Wage</span>
                <p className="text-zinc-400 text-[11px]">
                  Fixed rate per day present (e.g. ₹650/day). Gross earned = Rate × Total Present Days. Standard for manufacturing & blue-collar.
                </p>
              </div>

              <div className="p-3.5 bg-cyan-950/30 border border-cyan-800/50 rounded-xl space-y-1">
                <span className="font-bold text-cyan-300 text-xs">3. Hourly Rate</span>
                <p className="text-zinc-400 text-[11px]">
                  Pay computed on logged work hours (e.g. ₹350/hr). Ideal for part-time professionals, trainers, and shift-based consultants.
                </p>
              </div>

              <div className="p-3.5 bg-purple-950/30 border border-purple-800/50 rounded-xl space-y-1">
                <span className="font-bold text-purple-300 text-xs">4. Piece-Rate</span>
                <p className="text-zinc-400 text-[11px]">
                  Compensation directly tied to verified production units (e.g. ₹15/finished unit). Standard for textile, assembly, and packaging.
                </p>
              </div>
            </div>
          </div>

          {/* Why We Separate Attendance from Overtime Policies */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-zinc-200 flex items-center gap-2">
              <HelpCircle className="size-4 text-amber-400" />
              Core Architecture Principle: Separation of Attendance & Payroll Multipliers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
              <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="font-bold text-zinc-200">Raw Attendance Engine (Facts Only):</span>
                <p className="text-zinc-400 text-[11px]">
                  Biometric machines and punch cards only know physical time (In-Time: 09:00, Out-Time: 20:30, Total Work: 11.5 hours, Day Type: Sunday). They do not know salary multipliers.
                </p>
              </div>

              <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="font-bold text-zinc-200">Payroll Calculation Engine (Policy & Money):</span>
                <p className="text-zinc-400 text-[11px]">
                  The Payroll Engine takes raw hours and applies employee-specific rules: Is employee eligible for OT? What multiplier (1.5x, 2.0x double, 2.5x holiday)? Is there a 50-hour monthly cap?
                </p>
              </div>
            </div>
          </div>

          {/* Effective Duration & Historical Records */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-zinc-200 flex items-center gap-2">
              <Calendar className="size-4 text-indigo-400" />
              How Effective Duration Works (effectiveFrom to effectiveTo)
            </h4>
            <p className="text-zinc-300 text-xs">
              When an employee receives an annual promotion or appraisal hike, we never delete or overwrite past salary records. Instead:
            </p>
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 font-mono text-[11px]">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-amber-400">Version 1 (Old):</span>
                <span>₹6,00,000/yr • Effective: 2025-04-01 to 2026-03-31</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span>Version 2 (Active):</span>
                <span>₹7,20,000/yr • Effective: 2026-04-01 to Present (null)</span>
              </div>
            </div>
            <p className="text-zinc-400 text-[11px]">
              When you view or process payroll for <strong>October 2025</strong>, the system automatically resolves Version 1. When you process <strong>August 2026</strong>, it resolves Version 2 seamlessly.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: OVERTIME & SHIFT POLICIES */}
      {activeTab === "overtime_policies" && (
        <div className="space-y-6 text-xs leading-relaxed">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Clock className="size-4 text-amber-400" />
              Overtime Calculation & Indian Factories Act Compliance
            </h3>
            <p className="text-zinc-300">
              Under <strong>Section 59 of the Factories Act, 1948</strong>, when an employee works in any factory for more than 9 hours in any day or for more than 48 hours in any week, they are entitled to overtime wages at <strong>twice the ordinary rate of wages (2.0x Double Pay)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-emerald-400 text-xs">Normal Shift Extension</span>
              <p className="text-zinc-400 text-[11px]">
                Working beyond scheduled 8-hour shift on regular workdays. Typically compensated at <strong>1.5x</strong> or <strong>2.0x</strong> hourly base wage.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-blue-400 text-xs">Sunday / Week-off Work Extra Pay</span>
              <p className="text-zinc-400 text-[11px]">
                Working on designated weekly rest day. When Extra Pay is enabled, employee receives <strong>2.0x Double Pay Multiplier</strong> for the hours/day worked.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-purple-400 text-xs">Statutory Festival Holiday Work Extra Pay</span>
              <p className="text-zinc-400 text-[11px]">
                Working on declared National Holidays (Republic Day, Independence Day, Gandhi Jayanti). Compensated at <strong>2.5x to 3.0x</strong> festival holiday multiplier.
              </p>
            </div>
          </div>

          {/* REAL NUMERICAL EXAMPLES OF OVERTIME & EXTRA WORK PAY */}
          <div className="p-5 bg-zinc-900/60 border border-amber-500/40 rounded-2xl space-y-4">
            <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center gap-2">
              <Calculator className="size-4 text-amber-400" />
              Real-World Numerical Calculation Walkthroughs
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Example 1: Daily Worker on Sunday */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <strong className="text-blue-300 text-xs block font-bold">
                  Case A: Daily Wage Worker (Ramesh Kumar @ ₹850/day) works 1 Sunday (Week-off Extra Pay @ 2.0x)
                </strong>
                <p className="text-zinc-400 text-[11px]">
                  • Ordinary Hourly Wage: <code className="text-zinc-200">₹850 ÷ 8 hrs = ₹106.25 / hr</code><br />
                  • Sunday Work Rate (2.0x Double): <code className="text-zinc-200">₹106.25 × 2.0 = ₹212.50 / hr</code><br />
                  • 8 Hours Sunday Payout: <code className="text-emerald-400 font-bold">8 × ₹212.50 = ₹1,700 Extra Sunday Pay</code>
                </p>
              </div>

              {/* Example 2: Hourly Consultant on Holiday */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <strong className="text-purple-300 text-xs block font-bold">
                  Case B: Hourly Consultant (Deepa Krishnan @ ₹450/hr) works 6h on Independence Day (Holiday Extra Pay @ 2.5x)
                </strong>
                <p className="text-zinc-400 text-[11px]">
                  • Base Hourly Wage: <code className="text-zinc-200">₹450 / hr</code><br />
                  • Holiday Multiplier (2.5x): <code className="text-zinc-200">₹450 × 2.5 = ₹1,125 / hr</code><br />
                  • 6 Hours Holiday Payout: <code className="text-emerald-400 font-bold">6 × ₹1,125 = ₹6,750 Extra Holiday Pay</code>
                </p>
              </div>
            </div>
          </div>

          {/* 15-Min Split Rule */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <h4 className="font-bold text-zinc-200 flex items-center gap-2">
              <Percent className="size-4 text-amber-400" />
              15-Minute Quarter Hour Rounding Rule (Industry Standard)
            </h4>
            <p className="text-zinc-300 text-[11px]">
              To avoid micro-minute disputes, real-world HRMS round overtime to the nearest 15-minute interval:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-500 block">1 to 7 Minutes</span>
                <strong className="text-rose-400">0 Minutes (Discarded)</strong>
              </div>
              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-500 block">8 to 22 Minutes</span>
                <strong className="text-emerald-400">15 Minutes (0.25 hr)</strong>
              </div>
              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-500 block">23 to 37 Minutes</span>
                <strong className="text-emerald-400">30 Minutes (0.50 hr)</strong>
              </div>
              <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-500 block">38 to 52 Minutes</span>
                <strong className="text-emerald-400">45 Minutes (0.75 hr)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INCENTIVES & BONUSES */}
      {activeTab === "incentives_bonuses" && (
        <div className="space-y-6 text-xs leading-relaxed">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Sparkles className="size-4 text-indigo-400" />
              Incentives, Statutory Bonus & Variable Pay
            </h3>
            <p className="text-zinc-300">
              Variable compensation motivates performance and ensures statutory compliance under the Payment of Bonus Act, 1965:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-indigo-400 text-xs">1. Statutory Annual Bonus (Payment of Bonus Act)</span>
              <p className="text-zinc-400 text-[11px]">
                Mandatory for establishments with 20+ employees. Applicable to employees earning ≤ ₹21,000/mo. Minimum <strong>8.33%</strong> (one month Basic) up to maximum <strong>20%</strong> on ₹7,000 wage ceiling.
              </p>
            </div>

            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-emerald-400 text-xs">2. Sales Performance Commission</span>
              <p className="text-zinc-400 text-[11px]">
                Direct monthly commission paid on verified target achievements (e.g. ₹15,000 for closing an enterprise deal). Added to monthly gross as fully taxable earning.
              </p>
            </div>

            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-amber-400 text-xs">3. Festive / Spot Achievement Reward</span>
              <p className="text-zinc-400 text-[11px]">
                One-time spot awards (e.g. ₹5,000 zero-defect app delivery bonus or ₹2,500 Independence Day cultural spot reward).
              </p>
            </div>
          </div>

          {/* BONUS CALCULATION WALKTHROUGH */}
          <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
            <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">
              Statutory Bonus Mathematical Example (Section 10 of Bonus Act):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Wage Ceiling:</span>
                <strong className="text-zinc-200">₹7,000 / month</strong>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Minimum Rate (8.33%):</span>
                <strong className="text-amber-400">₹583.10 / mo (₹6,997 / yr)</strong>
              </div>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Maximum Rate (20.0%):</span>
                <strong className="text-emerald-400">₹1,400 / mo (₹16,800 / yr)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: LOANS & ADVANCES */}
      {activeTab === "loans_advances" && (
        <div className="space-y-6 text-xs leading-relaxed">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-400" />
              Salary Advances vs Long-Term Tenure Loans
            </h3>
            <p className="text-zinc-300">
              Employees often request financial assistance. Our system handles two distinct financial recovery models:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
              <span className="font-bold text-amber-400 text-xs flex items-center gap-2">
                <CreditCard className="size-4" />
                Short-Term Salary Advance (Single Month 100% Recovery)
              </span>
              <p className="text-zinc-400 text-[11px]">
                Advance given mid-month for emergency expenses (e.g. ₹10,000 on the 15th). The full ₹10,000 is automatically deducted from the immediate next month-end payroll payslip.
              </p>
            </div>

            <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
              <span className="font-bold text-indigo-400 text-xs flex items-center gap-2">
                <Building className="size-4" />
                Company Personal Loan (Multi-Month EMI Plan)
              </span>
              <p className="text-zinc-400 text-[11px]">
                Larger principal amount (e.g. ₹60,000 for 12 months). The system generates a structured amortization schedule and deducts fixed monthly EMI (e.g. ₹5,000/month) until balance reaches ₹0.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: PAYROLL RUN LIFECYCLE & 4 PAY TYPES CALCULATION ENGINE */}
      {/* ========================================================================= */}
      {activeTab === "payroll_lifecycle" && (
        <div className="space-y-6 text-xs leading-relaxed">
          {/* Header */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <PlayCircle className="size-4 text-indigo-400" />
              How the Payroll Engine Calculates Wages Across All 4 Pay Types
            </h3>
            <p className="text-zinc-300">
              When an HR administrator clicks <strong>"Execute Payroll Run"</strong> for a month (e.g., August 2026), the engine does not treat all employees identically. It dynamically inspects each employee's <strong>`payType`</strong>, resolves their active salary version from `effectiveFrom` to `effectiveTo`, and executes the specific mathematical algorithm designed for their wage driver:
            </p>
          </div>

          {/* 4 DEDICATED PAY TYPE CALCULATION BREAKDOWNS */}
          <div className="space-y-6">
            {/* 1. MONTHLY SALARIED */}
            <div className="p-5 bg-zinc-900/60 border border-indigo-500/40 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg font-mono font-bold text-xs">
                    Pay Type 1
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">Monthly Salaried (Fixed CTC + Loss of Pay Calculation)</h4>
                    <span className="text-[11px] text-zinc-400">Used for Corporate Staff, Executives, IT Engineers & Management</span>
                  </div>
                </div>
                <span className="text-indigo-400 font-mono font-bold text-xs">Fixed Monthly Base</span>
              </div>

              <div className="space-y-2 text-zinc-300">
                <strong className="text-zinc-100 text-xs block">Mathematical Step-by-Step Algorithm:</strong>
                <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-zinc-400">
                  <li>
                    <strong className="text-zinc-200">Determine Total Payable Days:</strong><br />
                    Total Days in Month (e.g. 31 in Aug) − Unpaid Absent Days (LOP).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Calculate Per-Day Salary (LOP Divisor):</strong><br />
                    <code className="text-indigo-300 bg-zinc-950 px-1.5 py-0.5 rounded">Per Day Rate = Monthly Gross CTC ÷ Calendar Days in Month (e.g. 31)</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Loss of Pay (LOP) Deduction:</strong><br />
                    <code className="text-rose-300 bg-zinc-950 px-1.5 py-0.5 rounded">LOP Deduction = Per Day Rate × Total Unpaid Days</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Earned Gross:</strong><br />
                    <code className="text-emerald-300 bg-zinc-950 px-1.5 py-0.5 rounded">Earned Gross = Monthly Gross − LOP Deduction + Overtime + Incentives</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Pro-rate Individual Components:</strong><br />
                    Basic, HRA, Conveyance, and Special Allowance are scaled by the payable factor <code className="text-zinc-200">(Payable Days ÷ Total Days)</code>.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Statutory & Adjustments:</strong><br />
                    EPF (12% of Earned Basic) + PT (₹200) + TDS + Approved Overtime + Performance Incentives − Loan EMI = <strong>Net Take-Home Pay</strong>.
                  </li>
                </ol>
              </div>

              {/* Concrete Example Box */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  Concrete Example: Rahul Sharma (Annual CTC ₹12,00,000 • ₹1,00,000/mo) in August (31 Days, 8h Approved OT @ ₹300/h = ₹2,400 + ₹5,000 Spot Bonus)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Monthly Base Gross:</span>
                    <strong className="text-zinc-200">₹92,300</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">OT & Spot Bonus:</span>
                    <strong className="text-emerald-400">+ ₹7,400</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">EPF + PT + TDS:</span>
                    <strong className="text-rose-400">- ₹6,500</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Take-Home:</span>
                    <strong className="text-indigo-400 font-bold">₹93,200</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DAILY WAGE WORKERS */}
            <div className="p-5 bg-zinc-900/60 border border-emerald-500/40 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg font-mono font-bold text-xs">
                    Pay Type 2
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">Daily Wage Worker (Present Days × Daily Rate + Rest Day Policies)</h4>
                    <span className="text-[11px] text-zinc-400">Used for Manufacturing, Blue-Collar Staff, Warehouse & Security</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-xs">₹ / Day Present</span>
              </div>

              <div className="space-y-2 text-zinc-300">
                <strong className="text-zinc-100 text-xs block">Mathematical Step-by-Step Algorithm:</strong>
                <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-zinc-400">
                  <li>
                    <strong className="text-zinc-200">Count Physical Present Days:</strong><br />
                    Obtained directly from biometric punch logs (e.g. 26 physical days present @ ₹850/day = ₹22,100).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Evaluate Paid Week-Off & Holiday Policies:</strong><br />
                    If company settings or worker profile has <strong>Paid Week-offs / Holidays</strong>: add 4 Sundays (4 × ₹850 = ₹3,400) + 1 Holiday (1 × ₹850 = ₹850).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Add Sunday / Holiday Work Extra Pay (2.0x / 2.5x Multiplier):</strong><br />
                    If employee physically worked on Sunday or declared holiday with Extra Pay Enabled, apply <strong>2.0x Double Multiplier</strong> or <strong>2.5x Holiday Multiplier</strong>.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Apply Statutory Deductions & Advance Recovery:</strong><br />
                    If Total Monthly Gross $\le$ ₹21,000 $\rightarrow$ Deduct <strong>ESIC (0.75%)</strong>. Deduct mid-month salary advance 100% full recovery = <strong>Net Cash Payout</strong>.
                  </li>
                </ol>
              </div>

              {/* Concrete Example Box */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Concrete Example: Ramesh Kumar (Daily Rate ₹850/day • 26 Present Days + 4 Paid Sundays + 1 Paid Holiday)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">26 Present Days:</span>
                    <strong className="text-zinc-200">₹22,100</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">4 Sundays + 1 Holiday:</span>
                    <strong className="text-blue-300">+ ₹4,250</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">PT Deduction:</span>
                    <strong className="text-rose-400">- ₹200</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Take-Home:</span>
                    <strong className="text-emerald-400 font-bold">₹26,150</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. HOURLY RATE PROFESSIONALS */}
            <div className="p-5 bg-zinc-900/60 border border-cyan-500/40 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg font-mono font-bold text-xs">
                    Pay Type 3
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">Hourly Rate Professional (Total Logged Hours × Hourly Rate)</h4>
                    <span className="text-[11px] text-zinc-400">Used for Part-time Specialists, Corporate Trainers, Shift Contractors</span>
                  </div>
                </div>
                <span className="text-cyan-400 font-mono font-bold text-xs">₹ / Logged Hour</span>
              </div>

              <div className="space-y-2 text-zinc-300">
                <strong className="text-zinc-100 text-xs block">Mathematical Step-by-Step Algorithm:</strong>
                <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-zinc-400">
                  <li>
                    <strong className="text-zinc-200">Import & Verify Total Time-Sheet Hours:</strong><br />
                    Aggregate verified biometric/timesheet hours in the month (e.g. 110 logged hours).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Regular Hours Pay:</strong><br />
                    <code className="text-cyan-300 bg-zinc-950 px-1.5 py-0.5 rounded">Regular Pay = 110 Hours × ₹450/hr = ₹49,500</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Shift Extension / Overtime (if excess hours &gt; 160h):</strong><br />
                    Overtime Pay = <code className="text-amber-300 bg-zinc-950 px-1.5 py-0.5 rounded">Excess Hours × Hourly Rate × 1.5x Multiplier</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Total Gross & Deductions:</strong><br />
                    Total Gross = ₹49,500. Deduct Professional Tax (₹200) = <strong>₹49,300 Net Take-Home</strong>.
                  </li>
                </ol>
              </div>

              {/* Concrete Example Box */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                  Concrete Example: Deepa Krishnan (Hourly Rate ₹450/hr • 110 Logged Hours in August)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Logged Hours:</span>
                    <strong className="text-zinc-200">110 Hours</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Gross Pay (₹450/h):</span>
                    <strong className="text-cyan-300">₹49,500</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Professional Tax:</span>
                    <strong className="text-rose-400">- ₹200</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Bank Transfer:</span>
                    <strong className="text-cyan-400 font-bold">₹49,300</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. PIECE-RATE PRODUCTION WORKERS */}
            <div className="p-5 bg-zinc-900/60 border border-purple-500/40 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg font-mono font-bold text-xs">
                    Pay Type 4
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">Piece-Rate Worker (Verified Units Produced × Unit Rate)</h4>
                    <span className="text-[11px] text-zinc-400">Used for Textile, Stitching, Assembly Lines, Packaging & Logistics</span>
                  </div>
                </div>
                <span className="text-purple-400 font-mono font-bold text-xs">₹ / Unit Finished</span>
              </div>

              <div className="space-y-2 text-zinc-300">
                <strong className="text-zinc-100 text-xs block">Mathematical Step-by-Step Algorithm:</strong>
                <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-zinc-400">
                  <li>
                    <strong className="text-zinc-200">Import Verified Finished Units:</strong><br />
                    Production supervisor verifies finished items (e.g. 1,400 fabricated precision metal parts @ ₹18/unit).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Calculate Base Piece-Rate Wages:</strong><br />
                    <code className="text-purple-300 bg-zinc-950 px-1.5 py-0.5 rounded">Piece Earnings = 1,400 Units × ₹18/unit = ₹25,200</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Add Efficiency / Target Bonus:</strong><br />
                    Add high-output performance bonus of ₹2,000 for meeting benchmark targets.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Gross & Net Pay:</strong><br />
                    Total Gross = ₹25,200 + ₹2,000 = <strong>₹27,200</strong>.
                  </li>
                </ol>
              </div>

              {/* Concrete Example Box */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
                  Concrete Example: Manoj Yadav (Piece Rate ₹18/unit • 1,400 Units Produced + Target Bonus)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">1,400 Units Output:</span>
                    <strong className="text-zinc-200">₹25,200</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Efficiency Bonus:</span>
                    <strong className="text-purple-300">+ ₹2,000</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Total Gross:</span>
                    <strong className="text-emerald-400 font-bold">₹27,200</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Bank Transfer:</span>
                    <strong className="text-purple-400 font-bold">₹27,200</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-STEP UNIVERSAL PAYROLL RUN EXECUTION PIPELINE */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <span className="p-1 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-800">🔄</span>
              The 4-Step Universal Payroll Run Pipeline (All 4 Pay Types Unified)
            </h4>

            <div className="space-y-3">
              {[
                {
                  step: "Step 1",
                  title: "Attendance & Production Units Freeze",
                  desc: "Import biometric punch logs, verify physical present days for daily wage, logged hours for hourly staff, finished units for piece rate, and calculate LOP for monthly staff.",
                  color: "border-indigo-500/60 text-indigo-400",
                },
                {
                  step: "Step 2",
                  title: "Dynamic Wage Engine & Base Breakdown",
                  desc: "Resolve active salary version (`effectiveFrom` to `effectiveTo`). Execute type-specific wage formulas (Monthly LOP, Daily rate, Hourly rate, Piece rate) and compute Basic, HRA, EPF, ESIC, and PT.",
                  color: "border-emerald-500/60 text-emerald-400",
                },
                {
                  step: "Step 3",
                  title: "Merge Variable Adjustments & Approvals",
                  desc: "Automatically merge approved Overtime hours with policy multipliers (1.5x, 2.0x, 2.5x), sales incentives, approved medical/travel reimbursement claims, and subtract loan EMI recoveries.",
                  color: "border-amber-500/60 text-amber-400",
                },
                {
                  step: "Step 4",
                  title: "Run Lock, Bank Transfer Sheet & Payslip Disbursement",
                  desc: "Lock the payroll run to make records immutable. Generate NEFT bank transfer CSV file, EPFO ECR electronic return text file, and distribute PDF payslips to all employees.",
                  color: "border-purple-500/60 text-purple-400",
                },
              ].map((s, idx) => (
                <div key={idx} className={`p-4 bg-zinc-950/80 rounded-xl border-l-4 ${s.color} border-zinc-800 space-y-1`}>
                  <div className="flex items-center gap-2 font-bold text-zinc-200">
                    <span className="text-[10px] font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {s.step}
                    </span>
                    <span>{s.title}</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] pl-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* TAB 8: DATABASE SCHEMA & ARCHITECTURE PATTERNS */}
      {/* ========================================================================= */}
      {activeTab === "database_schema" && (
        <div className="space-y-6 text-xs leading-relaxed">
          {/* Header */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/40 text-indigo-400">
                <Database className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">
                  Database Schema & System Architecture Patterns
                </h3>
                <span className="text-[11px] text-zinc-400 block">
                  12 Storage Collections, SCD Type-2 Temporal History, Multi-Wage Polymorphism & Immutable Payroll Ledgers
                </span>
              </div>
            </div>
            <p className="text-zinc-300">
              The Hisaab Payroll prototype utilizes a <strong>Normalized Document Store Schema</strong> backed by a resilient <code className="text-indigo-300 bg-zinc-950 px-1.5 py-0.5 rounded">storageService</code> abstraction facade. Every entity, transaction log, and compliance policy is modeled following industry-standard enterprise ERP patterns:
            </p>
          </div>

          {/* SYSTEM ARCHITECTURE FLOW PIPELINE */}
          <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
            <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="size-4 text-indigo-400" />
              Enterprise Data Flow & Relational Dependency Graph
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
                <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded font-bold text-[10px] uppercase">
                  1. Master Data Layer
                </span>
                <p className="text-zinc-400 text-[10px] font-sans">
                  • <code className="text-zinc-200">hisaab_payroll_settings</code><br />
                  • <code className="text-zinc-200">hisaab_salary_components</code><br />
                  • <code className="text-zinc-200">hisaab_salary_templates</code><br />
                  • <code className="text-zinc-200">hisaab_employees</code>
                </p>
              </div>

              <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold text-[10px] uppercase">
                  2. Temporal Comp & Logs
                </span>
                <p className="text-zinc-400 text-[10px] font-sans">
                  • <code className="text-emerald-300">hisaab_employee_salaries (SCD-2)</code><br />
                  • <code className="text-zinc-200">hisaab_attendance (Biometric)</code><br />
                  • <code className="text-zinc-200">hisaab_overtime (Approved)</code><br />
                  • <code className="text-zinc-200">hisaab_incentives (Bonuses)</code>
                </p>
              </div>

              <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded font-bold text-[10px] uppercase">
                  3. Recovery & Ledgers
                </span>
                <p className="text-zinc-400 text-[10px] font-sans">
                  • <code className="text-amber-300">hisaab_salary_advances (100%)</code><br />
                  • <code className="text-amber-300">hisaab_loans (Amortized EMI)</code><br />
                  • <code className="text-zinc-200">hisaab_reimbursements (Claims)</code>
                </p>
              </div>

              <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
                <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded font-bold text-[10px] uppercase">
                  4. Immutable Execution
                </span>
                <p className="text-zinc-400 text-[10px] font-sans">
                  • <code className="text-purple-300">hisaab_payroll_runs (Locked)</code><br />
                  • <code className="text-purple-300">hisaab_payslips (Artifacts)</code><br />
                  • NEFT Bank Sheet CSV<br />
                  • EPFO ECR Return TXT
                </p>
              </div>
            </div>
          </div>

          {/* THE 12 CORE DATABASE COLLECTIONS WITH SCHEMA DETAILS */}
          <div className="space-y-4">
            <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <Table className="size-4 text-indigo-400" />
              The 12 Core Database Collections & Field Structures
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. hisaab_payroll_settings */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-indigo-400 text-xs">1. hisaab_payroll_settings</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Singleton Object</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Global organization parameters, statutory tax registration IDs, and company-wide computation switches.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-indigo-400">companyName</span>: string, <span className="text-indigo-400">companyPan</span>: string, <span className="text-indigo-400">companyTan</span>: string</div>
                  <div><span className="text-indigo-400">lopDivisor</span>: <span className="text-amber-400">"CALENDAR_DAYS" | "FIXED_30"</span></div>
                  <div><span className="text-indigo-400">pfCappingEnabled</span>: boolean, <span className="text-indigo-400">pfWageCeiling</span>: number (15000)</div>
                  <div><span className="text-indigo-400">esiGrossLimit</span>: number (21000), <span className="text-indigo-400">esiEmployeeRate</span>: number (0.75)</div>
                  <div><span className="text-indigo-400">paidWeeklyOffEnabled</span>: boolean, <span className="text-indigo-400">paidStatutoryHolidaysEnabled</span>: boolean</div>
                </div>
              </div>

              {/* 2. hisaab_salary_components */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-emerald-400 text-xs">2. hisaab_salary_components</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Master Array</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Master salary catalog defining calculation formulas, tax treatment, and multi-component base relationships.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-emerald-400">id</span>: string (e.g. "COMP_HRA"), <span className="text-emerald-400">code</span>: string ("HRA")</div>
                  <div><span className="text-emerald-400">type</span>: <span className="text-amber-400">"EARNING" | "DEDUCTION" | "EMPLOYER_CONTRIBUTION" | "REIMBURSEMENT"</span></div>
                  <div><span className="text-emerald-400">calculationMethod</span>: <span className="text-amber-400">"PERCENTAGE" | "FIXED" | "BALANCE" | "RULE"</span></div>
                  <div><span className="text-emerald-400">percentageBaseType</span>: <span className="text-amber-400">"CTC" | "COMPONENTS"</span>, <span className="text-emerald-400">baseComponentIds</span>: string[]</div>
                  <div><span className="text-emerald-400">isProrated</span>: boolean, <span className="text-emerald-400">taxTreatment</span>: <span className="text-amber-400">"TAXABLE" | "EXEMPT" | "NON_TAXABLE"</span></div>
                </div>
              </div>

              {/* 3. hisaab_salary_templates */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-cyan-400 text-xs">3. hisaab_salary_templates</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Blueprint Archetype</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Reusable structure blueprints allowing bulk salary configuration across engineering, sales, or ops departments.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-cyan-400">id</span>: string ("TPL_DEV_STD"), <span className="text-cyan-400">name</span>: string ("Developer Standard")</div>
                  <div><span className="text-cyan-400">salaryBasis</span>: <span className="text-amber-400">"CTC_BASED" | "GROSS_BASED"</span>, <span className="text-cyan-400">status</span>: "ACTIVE"</div>
                  <div><span className="text-cyan-400">components</span>: Array&lt;&#123; componentId, calculationMethod, value, basedOn, priority &#125;&gt;</div>
                </div>
              </div>

              {/* 4. hisaab_employees */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-purple-400 text-xs">4. hisaab_employees</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Master Entity</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Employee master directory containing personal records, statutory bank accounts, PAN/UAN, and wage driver classification.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-purple-400">id</span>: string ("EMP001"), <span className="text-purple-400">name</span>: string, <span className="text-purple-400">department</span>: string</div>
                  <div><span className="text-purple-400">payType</span>: <span className="text-amber-400">"MONTHLY_SALARIED" | "DAILY_WAGE" | "HOURLY" | "PIECE_RATE"</span></div>
                  <div><span className="text-purple-400">taxRegime</span>: <span className="text-amber-400">"NEW" | "OLD"</span>, <span className="text-purple-400">joiningDate</span>: string</div>
                  <div><span className="text-purple-400">bankAccount</span>: string, <span className="text-purple-400">ifscCode</span>: string, <span className="text-purple-400">pan</span>: string, <span className="text-purple-400">uan</span>: string</div>
                </div>
              </div>

              {/* 5. hisaab_employee_salaries (SCD Type-2) */}
              <div className="p-4 bg-zinc-900/60 border border-indigo-500/50 rounded-xl space-y-2 shadow-lg shadow-indigo-950/20">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-indigo-300 text-xs">5. hisaab_employee_salaries</span>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded font-mono font-bold">SCD-2 Temporal</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Time-versioned compensation structure. Stores historical appraisals with <code className="text-indigo-300">effectiveFrom</code> and <code className="text-indigo-300">effectiveTo</code> date intervals.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-indigo-300">id</span>: string ("SAL_EMP001_V2"), <span className="text-indigo-300">employeeId</span>: string ("EMP001")</div>
                  <div><span className="text-indigo-300">annualCTC</span>: number, <span className="text-indigo-300">dailyRate</span>: number, <span className="text-indigo-300">hourlyRate</span>: number, <span className="text-indigo-300">pieceRate</span>: number</div>
                  <div><span className="text-indigo-300">effectiveFrom</span>: string ("2026-04-01"), <span className="text-indigo-300">effectiveTo</span>: string | null</div>
                  <div><span className="text-indigo-300">weekOffPolicy</span>: string, <span className="text-indigo-300">holidayPolicy</span>: string, <span className="text-indigo-300">overtimeEnabled</span>: boolean</div>
                  <div><span className="text-indigo-300">regularOtMultiplier</span>: number (1.5), <span className="text-indigo-300">weekOffOtMultiplier</span>: number (2.0)</div>
                  <div><span className="text-indigo-300">assignedComponents</span>: Array&lt;&#123; componentId, calculationMethod, value, basedOn &#125;&gt;</div>
                </div>
              </div>

              {/* 6. hisaab_attendance */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-amber-400 text-xs">6. hisaab_attendance</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Time-Series Snapshot</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Monthly biometric attendance summary driving LOP deductions, daily wages, and timesheet hours.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-amber-400">employeeId</span>: string, <span className="text-amber-400">month</span>: string ("2026-08"), <span className="text-amber-400">totalDays</span>: 31</div>
                  <div><span className="text-amber-400">presentDays</span>: number (26), <span className="text-amber-400">weeklyOffs</span>: number (4), <span className="text-amber-400">holidays</span>: number (1)</div>
                  <div><span className="text-amber-400">payableDays</span>: number, <span className="text-amber-400">lopDays</span>: number, <span className="text-amber-400">hoursWorked</span>: number, <span className="text-amber-400">unitsProduced</span>: number</div>
                </div>
              </div>

              {/* 7. hisaab_overtime */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-rose-400 text-xs">7. hisaab_overtime</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Period Log</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Discrete overtime transactions submitted by supervisors and approved by HR before payroll merging.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-rose-400">id</span>: string ("OT_001"), <span className="text-rose-400">employeeId</span>: string, <span className="text-rose-400">payrollPeriod</span>: "2026-08"</div>
                  <div><span className="text-rose-400">date</span>: string, <span className="text-rose-400">hours</span>: number (8), <span className="text-rose-400">ratePerHour</span>: number, <span className="text-rose-400">amount</span>: number (2400)</div>
                  <div><span className="text-rose-400">status</span>: <span className="text-amber-400">"PENDING" | "APPROVED" | "REJECTED"</span></div>
                </div>
              </div>

              {/* 8. hisaab_incentives */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-teal-400 text-xs">8. hisaab_incentives</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Variable Earnings</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Sales commissions, quarterly spot awards, festival bonuses, and productivity incentives.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-teal-400">id</span>: string, <span className="text-teal-400">employeeId</span>: string, <span className="text-teal-400">payrollPeriod</span>: "2026-08"</div>
                  <div><span className="text-teal-400">type</span>: <span className="text-amber-400">"SALES_COMMISSION" | "PERFORMANCE_BONUS" | "FESTIVAL_BONUS" | "SPOT_AWARD"</span></div>
                  <div><span className="text-teal-400">title</span>: string, <span className="text-teal-400">amount</span>: number (15000), <span className="text-teal-400">status</span>: "APPROVED"</div>
                </div>
              </div>

              {/* 9. hisaab_salary_advances */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-amber-300 text-xs">9. hisaab_salary_advances</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">100% Single-Period</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Emergency cash advances given mid-month that are 100% deducted in full from the immediate payslip.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-amber-300">id</span>: string ("ADV_001"), <span className="text-amber-300">employeeId</span>: string, <span className="text-amber-300">amount</span>: number (10000)</div>
                  <div><span className="text-amber-300">disbursementDate</span>: string, <span className="text-amber-300">recoveryPeriod</span>: "2026-08", <span className="text-amber-300">status</span>: "APPROVED"</div>
                </div>
              </div>

              {/* 10. hisaab_loans */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-indigo-400 text-xs">10. hisaab_loans</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Amortized Ledger</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Multi-month personal or equipment loans with structured monthly EMI schedules and balance tracking.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-indigo-400">id</span>: string ("LOAN_001"), <span className="text-indigo-400">principalAmount</span>: 60000, <span className="text-indigo-400">tenureMonths</span>: 12</div>
                  <div><span className="text-indigo-400">monthlyEMI</span>: 5000, <span className="text-indigo-400">paidAmount</span>: 15000, <span className="text-indigo-400">remainingBalance</span>: 45000</div>
                  <div><span className="text-indigo-400">installmentsPaid</span>: 3, <span className="text-indigo-400">totalInstallments</span>: 12, <span className="text-indigo-400">status</span>: "ACTIVE"</div>
                </div>
              </div>

              {/* 11. hisaab_payroll_runs */}
              <div className="p-4 bg-zinc-900/60 border border-emerald-500/50 rounded-xl space-y-2 shadow-lg shadow-emerald-950/20">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-emerald-300 text-xs">11. hisaab_payroll_runs</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono font-bold">Immutable Ledger</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Frozen monthly execution snapshot containing finalized totals and itemized breakdowns per employee.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-emerald-300">id</span>: string ("RUN_2026_08"), <span className="text-emerald-300">month</span>: "2026-08", <span className="text-emerald-300">status</span>: <span className="text-amber-400">"DRAFT" | "LOCKED" | "DISBURSED"</span></div>
                  <div><span className="text-emerald-300">totalGrossPayroll</span>: number, <span className="text-emerald-300">totalDeductions</span>: number, <span className="text-emerald-300">totalNetPay</span>: number</div>
                  <div><span className="text-emerald-300">records</span>: Array&lt;&#123; employeeId, earnedGross, netPay, earnings[], deductions[], employerCost[] &#125;&gt;</div>
                </div>
              </div>

              {/* 12. hisaab_payslips */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                  <span className="font-mono font-bold text-blue-400 text-xs">12. hisaab_payslips</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Disbursement Artifact</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Generated payslip documents with company letterhead, tax regime, bank account details, and net pay in words.
                </p>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                  <div><span className="text-blue-400">id</span>: string, <span className="text-blue-400">runId</span>: string, <span className="text-blue-400">employeeId</span>: string, <span className="text-blue-400">month</span>: string</div>
                  <div><span className="text-blue-400">metadataSnapshot</span>: &#123; pan, uan, bankName, designation &#125;, <span className="text-blue-400">netPayInWords</span>: string</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 CORE ARCHITECTURAL DESIGN PATTERNS */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h4 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
              <Cpu className="size-4 text-indigo-400" />
              5 Core Enterprise Architectural Design Patterns in Hisaab
            </h4>

            <div className="space-y-3">
              {/* Pattern 1 */}
              <div className="p-4 bg-zinc-900/70 border-l-4 border-indigo-500 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                    Pattern 1
                  </span>
                  <span>Slowly Changing Dimensions Type-2 (SCD-2) for Salary Revisions</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Instead of mutating an employee's salary in place (which would corrupt all previous month's tax returns and payslips), the system closes the existing version by setting its <code className="text-indigo-300 bg-zinc-950 px-1 py-0.5 rounded">effectiveTo = "2026-03-31"</code> and creates a brand-new record with <code className="text-indigo-300 bg-zinc-950 px-1 py-0.5 rounded">effectiveFrom = "2026-04-01"</code>. The payroll engine resolves active compensation using point-in-time temporal queries.
                </p>
              </div>

              {/* Pattern 2 */}
              <div className="p-4 bg-zinc-900/70 border-l-4 border-emerald-500 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    Pattern 2
                  </span>
                  <span>Directed Acyclic Graph (DAG) Component Dependency Resolution</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Salary components have strict mathematical dependencies: <code className="text-emerald-300 bg-zinc-950 px-1 py-0.5 rounded">HRA depends on Basic</code>, <code className="text-emerald-300 bg-zinc-950 px-1 py-0.5 rounded">EPF depends on Basic</code>, and <code className="text-emerald-300 bg-zinc-950 px-1 py-0.5 rounded">Special Allowance balances CTC</code>. The engine evaluates in 5 discrete passes: (1) Fixed & Basic % of CTC $\rightarrow$ (2) Multi-component base % $\rightarrow$ (3) Employer Costs $\rightarrow$ (4) Balancing Special Allowance $\rightarrow$ (5) Statutory Deductions.
                </p>
              </div>

              {/* Pattern 3 */}
              <div className="p-4 bg-zinc-900/70 border-l-4 border-cyan-500 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Pattern 3
                  </span>
                  <span>Polymorphic Wage Engine Strategy Pattern</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  The payroll calculation engine delegates execution based on the employee's <code className="text-cyan-300 bg-zinc-950 px-1 py-0.5 rounded">payType</code>: (1) Monthly Salaried uses Fixed CTC pro-ration; (2) Daily Wage evaluates present days, paid rest days, and double overtime; (3) Hourly computes logged timesheet hours and shift extension rates; (4) Piece-Rate evaluates verified units output and volume bonuses.
                </p>
              </div>

              {/* Pattern 4 */}
              <div className="p-4 bg-zinc-900/70 border-l-4 border-amber-500 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <span className="text-[10px] font-mono uppercase bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                    Pattern 4
                  </span>
                  <span>Immutable Event Ledger & Snapshot Isolation</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Once a payroll run is executed and moved to <code className="text-amber-300 bg-zinc-950 px-1 py-0.5 rounded">LOCKED</code> or <code className="text-amber-300 bg-zinc-950 px-1 py-0.5 rounded">DISBURSED</code> status, all employee payout snapshots, earned gross, and tax deductions are frozen in <code className="text-amber-300 bg-zinc-950 px-1 py-0.5 rounded">hisaab_payroll_runs</code>. Subsequent employee promotions or master component rule changes will never alter past finalized runs.
                </p>
              </div>

              {/* Pattern 5 */}
              <div className="p-4 bg-zinc-900/70 border-l-4 border-purple-500 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-zinc-200">
                  <span className="text-[10px] font-mono uppercase bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                    Pattern 5
                  </span>
                  <span>Resilient Storage Facade Pattern with Self-Healing Fallback</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  The <code className="text-purple-300 bg-zinc-950 px-1 py-0.5 rounded">storageService</code> wraps browser storage with safe JSON parsing, deep clone defaults, and automatic fallback. If local storage is empty or corrupted, it transparently recovers standard seed data without crashing the client application.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



