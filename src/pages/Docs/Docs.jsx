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
} from "lucide-react";

export default function Docs() {
  const [activeTab, setActiveTab] = useState("salary_components");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "salary_components", label: "All Salary Components (Real-World)", icon: FileCode2, count: "25+" },
    { id: "statutory_compliance", label: "Statutory Acts & Compliance Rules", icon: ShieldCheck, count: "10 Acts" },
    { id: "employee_salaries", label: "Employee Salaries & Multi-Wage", icon: Users, count: "4 Types" },
    { id: "overtime_policies", label: "Overtime & Shift Policies", icon: Clock, count: "Factories Act" },
    { id: "incentives_bonuses", label: "Incentives & Bonuses", icon: Sparkles, count: "Bonus Act" },
    { id: "loans_advances", label: "Loans & Salary Advances", icon: DollarSign, count: "Recovery" },
    { id: "payroll_lifecycle", label: "Payroll Run Lifecycle", icon: PlayCircle, count: "4 Steps" },
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
              Under Section 59 of the Factories Act, 1948, when an employee works in any factory for more than 9 hours in any day or for more than 48 hours in any week, they are entitled to overtime wages at <strong>twice the ordinary rate of wages (2.0x Double Pay)</strong>.
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
              <span className="font-bold text-blue-400 text-xs">Sunday / Week-off Work</span>
              <p className="text-zinc-400 text-[11px]">
                Working on designated weekly rest day. System provides <strong>2.0x Multiplier</strong> + optional compensatory off (Comp-off).
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-purple-400 text-xs">Statutory Festival Holiday</span>
              <p className="text-zinc-400 text-[11px]">
                Working on declared National Holidays (Republic Day, Independence Day, Gandhi Jayanti). Compensated at <strong>2.5x to 3.0x</strong> rate.
              </p>
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
              <span className="font-bold text-emerald-400 text-xs">2. Sales Performance Incentives</span>
              <p className="text-zinc-400 text-[11px]">
                Direct monthly commission paid on verified target achievements (e.g. 5% on closed revenue). Added to monthly gross as fully taxable earning.
              </p>
            </div>

            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
              <span className="font-bold text-amber-400 text-xs">3. Festive / Diwali Discretionary Bonus</span>
              <p className="text-zinc-400 text-[11px]">
                One-time company-wide festive distribution. Can be allocated as a flat lump-sum or % of annual basic during festival payroll runs.
              </p>
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
                    <code className="text-emerald-300 bg-zinc-950 px-1.5 py-0.5 rounded">Earned Gross = Monthly Gross − LOP Deduction</code>
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
                  Concrete Example: Rahul Sharma (Annual CTC ₹12,00,000 • ₹1,00,000/mo) in August (31 Days with 2 Unpaid LOP Days)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Monthly Gross:</span>
                    <strong className="text-zinc-200">₹92,300</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Per-Day Wage (31d):</span>
                    <strong className="text-zinc-200">₹2,977.42 / day</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">2 Days LOP Deduct:</span>
                    <strong className="text-rose-400">- ₹5,955</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Take-Home:</span>
                    <strong className="text-emerald-400">₹77,645</strong>
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
                    Obtained directly from biometric punch logs (e.g. 24 days physically present).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Evaluate Paid Week-Off Policy:</strong><br />
                    If company settings mandate <strong>Paid Weekly Off</strong> under Factories Act, count weekly rest days (e.g. 4 Sundays) as payable days: <code className="text-emerald-300 bg-zinc-950 px-1.5 py-0.5 rounded">Total Payable Days = 24 Present + 4 Sundays = 28 Days</code>.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Calculate Base Gross Wages:</strong><br />
                    <code className="text-emerald-300 bg-zinc-950 px-1.5 py-0.5 rounded">Base Wages = Total Payable Days × Daily Rate (e.g. 28 × ₹650 = ₹18,200)</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Add Sunday / Holiday Overtime:</strong><br />
                    If employee worked on Sunday or declared holiday with Extra Pay Enabled, apply <strong>2.0x Double Multiplier</strong> for extra hours worked.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Apply Statutory Deductions:</strong><br />
                    If Total Monthly Gross $\le$ ₹21,000 $\rightarrow$ Deduct <strong>ESIC (0.75%)</strong>. Deduct EPF (12% of Basic portion) if applicable − Mid-month Advance Recovery = <strong>Net Cash Payout</strong>.
                  </li>
                </ol>
              </div>

              {/* Concrete Example Box */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Concrete Example: Ramesh Kumar (Daily Rate ₹650/day • 24 Present Days + 4 Paid Sundays)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Present Work (24d):</span>
                    <strong className="text-zinc-200">₹15,600</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Paid Week-Off (4d):</span>
                    <strong className="text-blue-300">+ ₹2,600</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">ESIC Deduct (0.75%):</span>
                    <strong className="text-rose-400">- ₹137</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Payout:</span>
                    <strong className="text-emerald-400">₹18,063</strong>
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
                    Aggregate all punch-in to punch-out timestamps in the month (e.g. 176 total hours).
                  </li>
                  <li>
                    <strong className="text-zinc-200">Split into Regular vs Overtime Hours:</strong><br />
                    Standard Monthly Quota = 160 Hours (20 days × 8 hrs). Excess Hours = 16 Hours Overtime.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Regular Hours Pay:</strong><br />
                    <code className="text-cyan-300 bg-zinc-950 px-1.5 py-0.5 rounded">Regular Pay = 160 Hours × ₹450/hr = ₹72,000</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Overtime at Policy Multiplier (1.5x):</strong><br />
                    <code className="text-amber-300 bg-zinc-950 px-1.5 py-0.5 rounded">OT Pay = 16 Hours × (₹450 × 1.5) = 16 × ₹675 = ₹10,800</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Total Gross & Tax Withholding:</strong><br />
                    Total Gross = ₹72,000 + ₹10,800 = <strong>₹82,800</strong>. Deduct TDS / Professional Tax = <strong>Net Take-Home</strong>.
                  </li>
                </ol>
              </div>

              {/* Concrete Example Box */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                  Concrete Example: Deepa Krishnan (Hourly Rate ₹450/hr • 160 Regular Hours + 16 OT Hours at 1.5x)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Regular Pay (160h):</span>
                    <strong className="text-zinc-200">₹72,000</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Overtime Pay (16h):</span>
                    <strong className="text-amber-400">+ ₹10,800</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Professional Tax:</span>
                    <strong className="text-rose-400">- ₹200</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Payout:</span>
                    <strong className="text-cyan-400">₹82,600</strong>
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
                    Production supervisor verifies finished items (e.g. 1,700 stitched garments). Subtract defective/rejected items (50 units) = <strong>1,650 Verified Net Units</strong>.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Calculate Base Piece-Rate Wages:</strong><br />
                    <code className="text-purple-300 bg-zinc-950 px-1.5 py-0.5 rounded">Piece Earnings = 1,650 Units × ₹18/unit = ₹29,700</code>
                  </li>
                  <li>
                    <strong className="text-zinc-200">Evaluate Production Efficiency Bonus:</strong><br />
                    If units produced exceed monthly benchmark quota (e.g. &gt; 1,500 units), add target achievement bonus of ₹2,000.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Compute Gross & Statutory Net Pay:</strong><br />
                    Total Gross = ₹29,700 + ₹2,000 = <strong>₹31,700</strong>. Subtract mid-month wage advances = <strong>Net Cash Transferred</strong>.
                  </li>
                </ol>
              </div>

              {/* Concrete Example Box */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
                  Concrete Example: Manoj Yadav (Piece Rate ₹18/unit • 1,650 Verified Units + Target Bonus)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">1,650 Units Produced:</span>
                    <strong className="text-zinc-200">₹29,700</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Target Bonus:</span>
                    <strong className="text-purple-300">+ ₹2,000</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Mid-Month Advance:</span>
                    <strong className="text-rose-400">- ₹5,000</strong>
                  </div>
                  <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Net Bank Pay:</span>
                    <strong className="text-emerald-400">₹26,700</strong>
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
    </div>
  );
}

