import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR } from "../../utils/formatters";
import {
  Shield,
  Edit2,
  Check,
  Info,
  Building,
  Calculator,
  HelpCircle,
  Lock,
  Sparkles,
  AlertCircle,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Gift,
  Award,
  Landmark,
  FileSpreadsheet,
} from "lucide-react";

// Real-world State PT Slabs Master Data
const STATE_PT_SLABS = {
  Karnataka: {
    number: "PT/KA/0987654321",
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 14999, tax: 0 },
      { min: 15000, max: null, tax: 200 },
    ],
    note: "Deducted monthly @ ₹200 for gross salary ≥ ₹15,000.",
  },
  Maharashtra: {
    number: "PT/MH/4455667788",
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 7499, tax: 0 },
      { min: 7500, max: 9999, tax: 175 },
      { min: 10000, max: null, tax: 200, febTax: 300 },
    ],
    note: "Men earning > ₹10,000 pay ₹200/month, and ₹300 in February. Women earning ≤ ₹25,000 exempt.",
  },
  "Tamil Nadu": {
    number: "PT/TN/1122334455",
    cycle: "Half-Yearly (Sep & Mar)",
    slabs: [
      { min: 0, max: 21000, tax: 0 },
      { min: 21001, max: 30000, tax: 135 },
      { min: 30001, max: 45000, tax: 315 },
      { min: 45001, max: 60000, tax: 690 },
      { min: 60001, max: 75000, tax: 1025 },
      { min: 75001, max: null, tax: 1250 },
    ],
    note: "Calculated half-yearly on average gross salary.",
  },
  Telangana: {
    number: "PT/TG/8899001122",
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 15000, tax: 0 },
      { min: 15001, max: 20000, tax: 150 },
      { min: 20001, max: null, tax: 200 },
    ],
    note: "₹150 for ₹15k-₹20k, ₹200 for > ₹20k gross.",
  },
  "West Bengal": {
    number: "PT/WB/5566778899",
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 10000, tax: 0 },
      { min: 10001, max: 15000, tax: 110 },
      { min: 15001, max: 25000, tax: 130 },
      { min: 25001, max: 40000, tax: 150 },
      { min: 40001, max: null, tax: 200 },
    ],
    note: "Graduated monthly rates from ₹110 to ₹200.",
  },
  Gujarat: {
    number: "PT/GJ/3344556677",
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 12000, tax: 0 },
      { min: 12001, max: null, tax: 200 },
    ],
    note: "Zero tax up to ₹12,000; flat ₹200 for gross > ₹12,000.",
  },
};

// Real-world State LWF Master Data
const STATE_LWF_RULES = {
  Karnataka: {
    frequency: "Annual (December)",
    employeeRate: 20,
    employerRate: 40,
    total: 60,
    note: "Deducted once a year in December payroll.",
  },
  Maharashtra: {
    frequency: "Half-Yearly (June & December)",
    employeeRate: 12,
    employerRate: 36,
    total: 48,
    note: "Deducted twice a year in June and December payroll.",
  },
  "Tamil Nadu": {
    frequency: "Annual (December)",
    employeeRate: 20,
    employerRate: 40,
    total: 60,
    note: "Deducted in December payroll.",
  },
  Gujarat: {
    frequency: "Half-Yearly (June & December)",
    employeeRate: 6,
    employerRate: 12,
    total: 18,
    note: "Deducted in June and December.",
  },
  Delhi: {
    frequency: "Half-Yearly (June & December)",
    employeeRate: 0.75,
    employerRate: 2.25,
    total: 3,
    note: "Deducted half-yearly.",
  },
  Haryana: {
    frequency: "Monthly",
    employeeRate: 25,
    employerRate: 50,
    total: 75,
    note: "0.2% of salary up to max ₹25 for employee, 2x for employer monthly.",
  },
};

export default function StatutoryComponents() {
  const { showToast } = useToast();
  // 8 Indian Statutory Component Tabs
  const [activeTab, setActiveTab] = useState("EPF"); 
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [splitupModalOpen, setSplitupModalOpen] = useState(false);

  // Stored Statutory Settings
  const [settings, setSettings] = useState({
    // 1. EPF & VPF
    epfEnabled: true,
    epfNumber: "TN/TBM/9987788/688",
    epfDeductionCycle: "Monthly",
    epfEmployeeRate: "RESTRICT_15000", // "RESTRICT_15000" or "ACTUAL_WAGE"
    epfEmployerRate: "RESTRICT_15000",
    epfIncludeEmployerInCTC: true,
    epfIncludeEdliInCTC: true,
    epfIncludeAdminChargesInCTC: true,
    epfAllowEmployeeOverride: true,
    epfProrateRestrictedWage: false,
    epfConsiderLop: false,
    epfAbryScheme: false,
    vpfEnabled: true,
    vpfMaxLimitPercent: 100,

    // 2. ESI
    esiEnabled: true,
    esiNumber: "31000123450001001",
    esiDeductionCycle: "Monthly",
    esiEmployeeRate: 0.75,
    esiEmployerRate: 3.25,
    esiIncludeInCTC: true,
    esiWageThreshold: 21000,
    esiDisabilityThreshold: 25000,
    esiAllowEmployeeOverride: true,

    // 3. Professional Tax
    ptEnabled: true,
    ptState: "Karnataka",
    ptNumber: "PT/KA/0987654321",

    // 4. Labour Welfare Fund
    lwfEnabled: true,
    lwfState: "Karnataka",

    // 5. Gratuity (Payment of Gratuity Act 1972)
    gratuityEnabled: true,
    gratuityRate: 4.81,
    gratuityMaxLimit: 2000000, // ₹20 Lakhs
    gratuityEligibilityYears: 5,
    gratuityIncludeInCTC: true,

    // 6. Statutory Bonus (Payment of Bonus Act 1965)
    bonusEnabled: true,
    bonusWageThreshold: 21000,
    bonusCalculationCeiling: 7000,
    bonusMinRate: 8.33,
    bonusMaxRate: 20.0,
    bonusPaymentFrequency: "Annual",

    // 7. Income Tax TDS (CBDT Sec 192)
    tdsEnabled: true,
    tdsTaxYear: "2026-2027",
    tdsDefaultRegime: "NEW_REGIME_115BAC",
    tdsStandardDeductionNew: 75000,
    tdsStandardDeductionOld: 50000,
    tdsCessRate: 4,
    tdsAllowRegimeSwitch: true,

    // 8. NPS Corporate (Sec 80CCD(2))
    npsEnabled: true,
    npsEmployerRate: 10,
    npsMaxExemptionCap: 750000,
    npsIncludeInCTC: true,
  });

  const [form, setForm] = useState(settings);
  const [sampleWage, setSampleWage] = useState(20000);

  useEffect(() => {
    const stored = storageService.getSettings();
    if (stored?.statutorySettings) {
      setSettings((prev) => ({ ...prev, ...stored.statutorySettings }));
      setForm((prev) => ({ ...prev, ...stored.statutorySettings }));
    }
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(form);
    const existing = storageService.getSettings();
    storageService.updateSettings({
      ...existing,
      statutorySettings: form,
      pfCappingEnabled: form.epfEmployeeRate === "RESTRICT_15000",
    });
    setEditModalOpen(false);
    showToast(`${activeTab} statutory configuration saved successfully!`);
  };

  // Calculations for EPF Sample Breakdown
  const calculateEPFSample = (pfWage) => {
    const isCapped = settings.epfEmployeeRate === "RESTRICT_15000";
    const applicableWage = isCapped ? Math.min(pfWage, 15000) : pfWage;
    const employeeEPF = Math.round(applicableWage * 0.12);
    const epsWage = Math.min(applicableWage, 15000);
    const eps = Math.min(Math.round(epsWage * 0.0833), 1250);
    const employerEPF = Math.max(0, employeeEPF - eps);
    const edli = Math.round(epsWage * 0.005);
    const adminCharges = Math.round(epsWage * 0.005);
    const employerTotal =
      (settings.epfIncludeEmployerInCTC ? eps + employerEPF : 0) +
      (settings.epfIncludeEdliInCTC ? edli : 0) +
      (settings.epfIncludeAdminChargesInCTC ? adminCharges : 0);

    return {
      applicableWage,
      employeeEPF,
      eps,
      employerEPF,
      edli,
      adminCharges,
      employerTotal,
    };
  };

  // Calculations for ESI Sample Breakdown
  const calculateESISample = (grossWage) => {
    if (grossWage > settings.esiWageThreshold) {
      return { isEligible: false, employeeESI: 0, employerESI: 0, total: 0 };
    }
    const employeeESI = Math.ceil((grossWage * (settings.esiEmployeeRate || 0.75)) / 100);
    const employerESI = Math.ceil((grossWage * (settings.esiEmployerRate || 3.25)) / 100);
    return {
      isEligible: true,
      employeeESI,
      employerESI,
      total: employeeESI + employerESI,
    };
  };

  const epfSample = calculateEPFSample(sampleWage);
  const currentPtData = STATE_PT_SLABS[settings.ptState] || STATE_PT_SLABS.Karnataka;
  const currentLwfData = STATE_LWF_RULES[settings.lwfState] || STATE_LWF_RULES.Karnataka;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Shield className="size-5 text-indigo-400" />
            Statutory Components & Compliance Master
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Complete Indian payroll statutory rules: EPFO, ESIC, Professional Tax, Labour Welfare, Gratuity, Bonus, TDS & NPS.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(settings);
            setEditModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
        >
          <Edit2 className="size-3.5" />
          Edit {activeTab} Preferences
        </button>
      </div>

      {/* 8 Indian Statutory Tabs (Zoho Payroll Style Navigation) */}
      <div className="flex border-b border-zinc-800 gap-6 text-xs font-bold text-zinc-400 px-2 overflow-x-auto">
        {[
          { id: "EPF", label: "EPF & VPF" },
          { id: "ESI", label: "ESI" },
          { id: "PT", label: "Professional Tax" },
          { id: "LWF", label: "Labour Welfare Fund" },
          { id: "GRATUITY", label: "Gratuity" },
          { id: "BONUS", label: "Statutory Bonus" },
          { id: "TDS", label: "Income Tax / TDS" },
          { id: "NPS", label: "Corporate NPS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 transition-all whitespace-nowrap relative ${
              activeTab === tab.id
                ? "text-indigo-400 border-b-2 border-indigo-500 font-extrabold"
                : "hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* TAB 1: EPF & VPF */}
        {/* ========================================================= */}
        {activeTab === "EPF" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Employees' Provident Fund & VPF</h3>
                  <button
                    onClick={() => {
                      setForm(settings);
                      setEditModalOpen(true);
                    }}
                    className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded transition-colors"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active & Enforced
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">EPF Number</span>
                  <span className="font-mono font-bold text-zinc-200 text-sm">
                    {settings.epfNumber || "TN/TBM/9987788/688"}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-400 block mb-1">Deduction Cycle</span>
                  <span className="font-semibold text-zinc-200">{settings.epfDeductionCycle || "Monthly"}</span>
                </div>

                <div>
                  <span className="text-zinc-400 block mb-1">Employee Contribution Rate</span>
                  <span className="font-semibold text-zinc-200">
                    {settings.epfEmployeeRate === "RESTRICT_15000"
                      ? "Restrict Contribution to ₹15,000 of PF Wage"
                      : "12% of Actual PF Wage (Uncapped)"}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-400 block mb-1">Employer Contribution Rate</span>
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    {settings.epfEmployerRate === "RESTRICT_15000"
                      ? "Restrict Contribution to ₹15,000 of PF Wage"
                      : "12% of Actual PF Wage"}
                    <button
                      type="button"
                      onClick={() => setSplitupModalOpen(true)}
                      className="text-indigo-400 text-[10px] underline hover:text-indigo-300 transition-colors font-bold cursor-pointer"
                    >
                      (View Splitup)
                    </button>
                  </span>
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-zinc-800/80">
                  <span className="text-zinc-400 block mb-2 font-semibold">CTC Inclusions</span>
                  <div className="space-y-2 text-zinc-300">
                    {settings.epfIncludeEmployerInCTC && (
                      <div className="flex items-center gap-2">
                        <Check className="size-4 text-emerald-400" />
                        <span>Employer's contribution is included in the CTC.</span>
                      </div>
                    )}
                    {settings.epfIncludeEdliInCTC && (
                      <div className="flex items-center gap-2">
                        <Check className="size-4 text-emerald-400" />
                        <span className="flex items-center gap-1">
                          Employer's EDLI contribution is included in the CTC.
                          <HelpCircle className="size-3 text-zinc-500 cursor-pointer" />
                        </span>
                      </div>
                    )}
                    {settings.epfIncludeAdminChargesInCTC && (
                      <div className="flex items-center gap-2">
                        <Check className="size-4 text-emerald-400" />
                        <span className="flex items-center gap-1">
                          Admin charges is included in the CTC.
                          <HelpCircle className="size-3 text-zinc-500 cursor-pointer" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800/80 text-[11px]">
                  <div>
                    <span className="text-zinc-400 block">Voluntary PF (VPF) Allowed</span>
                    <span className="font-semibold text-emerald-400">{settings.vpfEnabled ? "Yes (Up to 100% Basic)" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Allow Employee level Override</span>
                    <span className="font-semibold text-zinc-200">{settings.epfAllowEmployeeOverride ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Pro-rate Restricted PF Wage</span>
                    <span className="font-semibold text-zinc-200">{settings.epfProrateRestrictedWage ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Eligible for ABRY Scheme</span>
                    <span className="font-semibold text-zinc-200">{settings.epfAbryScheme ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sample EPF Calculation Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-zinc-100">Sample EPF Calculation</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Let's assume the PF wage is <strong className="text-zinc-200">₹ {sampleWage.toLocaleString("en-IN")}</strong>. The breakup of contribution will be:
                  </p>
                </div>

                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-zinc-400 text-[11px] uppercase tracking-wider block mb-2">
                      Employee's Contribution
                    </span>
                    <div className="flex justify-between items-center text-zinc-200">
                      <span>EPF (12% of {epfSample.applicableWage.toLocaleString("en-IN")})</span>
                      <span className="font-mono font-bold">₹ {epfSample.employeeEPF.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <hr className="border-zinc-800/80" />

                  <div className="space-y-2">
                    <span className="font-bold text-zinc-400 text-[11px] uppercase tracking-wider block">
                      Employer's Contribution
                    </span>
                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="text-[11px]">EPS (8.33% of 15000 (Max ₹15,000))</span>
                      <span className="font-mono font-semibold">₹ {epfSample.eps.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="text-[11px]">EPF (12% of 15000 − EPS)</span>
                      <span className="font-mono font-semibold">₹ {epfSample.employerEPF.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="text-[11px]">EDLI Contribution (0.50% of 15000)</span>
                      <span className="font-mono font-semibold">₹ {epfSample.edli.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-300">
                      <span className="text-[11px]">EPF Admin Charges (0.50% of 15000)</span>
                      <span className="font-mono font-semibold">₹ {epfSample.adminCharges.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <hr className="border-zinc-800/80" />

                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Total Employer Cost</span>
                    <span className="font-mono text-indigo-400">₹ {epfSample.employerTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-2 text-[11px]">
                  <div className="flex items-start gap-2 text-zinc-400">
                    <Sparkles className="size-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Preview EPF calculation for multiple wage cases:</span>
                  </div>
                  <button
                    onClick={() => setPreviewModalOpen(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline flex items-center gap-1"
                  >
                    Preview Wage Matrix <ChevronRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ESI */}
        {/* ========================================================= */}
        {activeTab === "ESI" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Employees' State Insurance (ESIC)</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">ESI Number</span>
                  <span className="font-mono font-bold text-zinc-200 text-sm">{settings.esiNumber}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Deduction Cycle</span>
                  <span className="font-semibold text-zinc-200">{settings.esiDeductionCycle}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Employee Contribution Rate</span>
                  <span className="font-semibold text-zinc-200 font-mono">0.75% of Gross Wages</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Employer Contribution Rate</span>
                  <span className="font-semibold text-zinc-200 font-mono">3.25% of Gross Wages</span>
                </div>
                <div className="sm:col-span-2 pt-3 border-t border-zinc-800/80">
                  <span className="text-zinc-400 block mb-2 font-semibold">Eligibility Threshold</span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    Mandatory for all employees whose monthly gross wage is <strong>≤ ₹ {settings.esiWageThreshold.toLocaleString("en-IN")}</strong>. (Disability threshold: ₹25,000/month).
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Sample ESI Calculation</h4>
                <p className="text-[11px] text-zinc-400">For monthly gross salary of <strong className="text-zinc-200">₹ 18,000</strong> (≤ ₹21k limit):</p>
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-zinc-200">
                    <span>Employee ESI (0.75%)</span>
                    <span className="font-mono font-bold">₹ 135</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-200">
                    <span>Employer ESI (3.25%)</span>
                    <span className="font-mono font-bold">₹ 585</span>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Total ESI Remittance</span>
                    <span className="font-mono text-indigo-400">₹ 720</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 3: Professional Tax */}
        {/* ========================================================= */}
        {activeTab === "PT" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Professional Tax - {settings.ptState}</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  State Compliant
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-400 block mb-1">Active Jurisdiction</span>
                    <span className="font-bold text-zinc-200 text-sm">{settings.ptState}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">PT Registration Certificate</span>
                    <span className="font-mono font-bold text-zinc-200">{currentPtData.number}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <span className="text-zinc-400 block mb-2 font-semibold">Official State Slabs Table</span>
                  <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                        <tr>
                          <th className="p-3">Salary Range (Monthly Gross)</th>
                          <th className="p-3 text-right">Tax Deducted (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850">
                        {currentPtData.slabs.map((slab, i) => (
                          <tr key={i}>
                            <td className="p-3 text-zinc-300 font-mono">
                              ₹ {slab.min.toLocaleString("en-IN")} {slab.max ? `to ₹ ${slab.max.toLocaleString("en-IN")}` : "and above"}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-zinc-200">
                              ₹ {slab.tax} {slab.febTax ? `(₹${slab.febTax} in Feb)` : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2 italic">{currentPtData.note}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Sample PT Calculation</h4>
                <p className="text-[11px] text-zinc-400">For gross salary of <strong className="text-zinc-200">₹ 45,000</strong> in {settings.ptState}:</p>
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Monthly Gross Salary</span>
                    <span className="font-mono font-bold text-zinc-100">₹ 45,000</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Applicable State Slab</span>
                    <span className="font-mono text-zinc-400">Highest Slab</span>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Professional Tax Deduction</span>
                    <span className="font-mono text-indigo-400">₹ 200 / month</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 4: Labour Welfare Fund (LWF) */}
        {/* ========================================================= */}
        {activeTab === "LWF" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Labour Welfare Fund - {settings.lwfState}</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Configured
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">State Jurisdiction</span>
                  <span className="font-bold text-zinc-200 text-sm">{settings.lwfState}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Deduction Schedule</span>
                  <span className="font-semibold text-zinc-200">{currentLwfData.frequency}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Employee Contribution</span>
                  <span className="font-mono font-bold text-zinc-200">₹ {currentLwfData.employeeRate}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Employer Contribution</span>
                  <span className="font-mono font-bold text-zinc-200">₹ {currentLwfData.employerRate}</span>
                </div>
                <div className="col-span-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                  {currentLwfData.note}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Sample LWF Contribution</h4>
                <p className="text-[11px] text-zinc-400">Total remittance per eligible worker:</p>
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Employee Share</span>
                    <span className="font-mono font-bold text-zinc-100">₹ {currentLwfData.employeeRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Employer Share</span>
                    <span className="font-mono font-bold text-zinc-100">₹ {currentLwfData.employerRate}</span>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Total LWF Remittance</span>
                    <span className="font-mono text-indigo-400">₹ {currentLwfData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 5: Gratuity Provision (Payment of Gratuity Act 1972) */}
        {/* ========================================================= */}
        {activeTab === "GRATUITY" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Payment of Gratuity Act 1972</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Employer Liability
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">Statutory Formula</span>
                  <span className="font-mono font-bold text-zinc-200">(15 / 26 / 12) × Basic = 4.81%</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Statutory Tax Exemption Cap</span>
                  <span className="font-mono font-bold text-zinc-200">₹ 20,00,000 (₹20 Lakhs)</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Vesting Eligibility Period</span>
                  <span className="font-semibold text-zinc-200">5 Continuous Years of Service</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Part of Monthly CTC</span>
                  <span className="font-semibold text-emerald-400">Yes (Employer Cost)</span>
                </div>
                <div className="col-span-2 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                  Companies accrue 4.81% of Basic Salary monthly as a provision for future gratuity payout upon resignation or retirement.
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Sample Gratuity Provision</h4>
                <p className="text-[11px] text-zinc-400">For an employee with Basic Salary of <strong className="text-zinc-200">₹ 35,000 / month</strong>:</p>
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Monthly Basic Salary</span>
                    <span className="font-mono font-bold text-zinc-100">₹ 35,000</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Statutory Accrual Rate</span>
                    <span className="font-mono text-zinc-400">4.81% (15/26 / 12)</span>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Monthly Gratuity Cost</span>
                    <span className="font-mono text-purple-400">₹ 1,683 / month</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 6: Statutory Bonus (Payment of Bonus Act 1965) */}
        {/* ========================================================= */}
        {activeTab === "BONUS" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Payment of Bonus Act 1965</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Annual Compliance
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">Eligibility Wage Ceiling</span>
                  <span className="font-mono font-bold text-zinc-200">Gross Salary ≤ ₹ 21,000 / month</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Calculation Ceiling Base</span>
                  <span className="font-mono font-bold text-zinc-200">₹ 7,000 or State Minimum Wage</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Statutory Minimum Bonus</span>
                  <span className="font-bold text-zinc-200">8.33% (or ₹100 minimum)</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Statutory Maximum Bonus</span>
                  <span className="font-bold text-zinc-200">20.0% of Wage</span>
                </div>
                <div className="col-span-2 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                  Mandatory for all establishments with 20+ workers. Disbursed annually within 8 months of the financial year close.
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Sample Statutory Bonus</h4>
                <p className="text-[11px] text-zinc-400">For an eligible worker earning ₹18,000/month:</p>
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Calculation Base</span>
                    <span className="font-mono font-bold text-zinc-100">₹ 7,000 (Capped)</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Min Rate (8.33%)</span>
                    <span className="font-mono text-zinc-400">₹ 583 / month</span>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Annual Statutory Bonus</span>
                    <span className="font-mono text-amber-400">₹ 7,000 / year</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 7: Income Tax TDS (CBDT Sec 192) */}
        {/* ========================================================= */}
        {activeTab === "TDS" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Income Tax TDS (Section 192)</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  CBDT Regulated
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">Default Tax Regime</span>
                  <span className="font-bold text-zinc-200">New Tax Regime (Section 115BAC)</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Standard Deduction</span>
                  <span className="font-mono font-bold text-zinc-200">₹ 75,000 (New) / ₹ 50,000 (Old)</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Sec 87A Full Rebate Limit</span>
                  <span className="font-mono font-bold text-emerald-400">Zero Tax up to ₹ 7,00,000</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Health & Education Cess</span>
                  <span className="font-mono font-bold text-zinc-200">4% on Total Tax</span>
                </div>
                <div className="col-span-2 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                  Monthly TDS is calculated by projecting full-year annual taxable income, subtracting standard deductions and proof declarations, and dividing remaining tax equally across payroll periods.
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Tax Slabs (New Regime 2026-27)</h4>
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Income Slab</th>
                        <th className="p-2.5 text-right">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                      <tr><td className="p-2.5 text-zinc-300">₹ 0 - ₹ 3,00,000</td><td className="p-2.5 text-right text-emerald-400 font-bold">Nil</td></tr>
                      <tr><td className="p-2.5 text-zinc-300">₹ 3,00,001 - ₹ 7,00,000</td><td className="p-2.5 text-right text-zinc-300">5% (Rebate 87A)</td></tr>
                      <tr><td className="p-2.5 text-zinc-300">₹ 7,00,001 - ₹ 10,00,000</td><td className="p-2.5 text-right text-zinc-200 font-bold">10%</td></tr>
                      <tr><td className="p-2.5 text-zinc-300">₹ 10,00,001 - ₹ 12,00,000</td><td className="p-2.5 text-right text-zinc-200 font-bold">15%</td></tr>
                      <tr><td className="p-2.5 text-zinc-300">₹ 12,00,001 - ₹ 15,00,000</td><td className="p-2.5 text-right text-zinc-200 font-bold">20%</td></tr>
                      <tr><td className="p-2.5 text-zinc-300">&gt; ₹ 15,00,000</td><td className="p-2.5 text-right text-rose-400 font-bold">30%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 8: Corporate NPS (Section 80CCD(2)) */}
        {/* ========================================================= */}
        {activeTab === "NPS" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Corporate NPS (Section 80CCD(2))</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Tax Efficient Benefit
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs">
                <div>
                  <span className="text-zinc-400 block mb-1">Employer Contribution Limit</span>
                  <span className="font-bold text-zinc-200">10% of (Basic + DA)</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Tax Exemption Benefit</span>
                  <span className="font-semibold text-emerald-400">100% Tax-Free under Sec 80CCD(2)</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Combined Cap Limit</span>
                  <span className="font-mono font-bold text-zinc-200">₹ 7.50 Lakhs / year</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-1">Part of CTC</span>
                  <span className="font-semibold text-zinc-200">Yes (Employer Benefit)</span>
                </div>
                <div className="col-span-2 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                  Employer's contribution up to 10% of salary is tax-free in both New and Old tax regimes without falling under Section 80C's ₹1.5 Lakh limit.
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Sample Corporate NPS Saving</h4>
                <p className="text-[11px] text-zinc-400">For Basic Salary of <strong className="text-zinc-200">₹ 60,000 / month</strong>:</p>
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Monthly 10% NPS Deposit</span>
                    <span className="font-mono font-bold text-zinc-100">₹ 6,000 / month</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Annual Tax-Free Investment</span>
                    <span className="font-mono font-bold text-emerald-400">₹ 72,000 / year</span>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Annual Income Tax Saved (30% slab)</span>
                    <span className="font-mono text-indigo-400">₹ 22,464</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Preferences Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit ${activeTab} Statutory Preferences`}
        description="Update organisation-wide statutory registration and contribution rules."
      >
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          {activeTab === "EPF" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">EPF Registration Number *</label>
                <input
                  type="text"
                  required
                  value={form.epfNumber}
                  onChange={(e) => setForm({ ...form, epfNumber: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Employee Contribution Rate *</label>
                  <select
                    value={form.epfEmployeeRate}
                    onChange={(e) => setForm({ ...form, epfEmployeeRate: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="RESTRICT_15000">Restrict Contribution to ₹15,000 of PF Wage</option>
                    <option value="ACTUAL_WAGE">12% of Actual PF Wage (Uncapped)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Employer Contribution Rate *</label>
                  <select
                    value={form.epfEmployerRate}
                    onChange={(e) => setForm({ ...form, epfEmployerRate: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="RESTRICT_15000">Restrict Contribution to ₹15,000 of PF Wage</option>
                    <option value="ACTUAL_WAGE">12% of Actual PF Wage</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <span className="font-semibold text-zinc-300 block">CTC Inclusions</span>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.epfIncludeEmployerInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeEmployerInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                  <span>Include Employer's contribution in the CTC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.epfIncludeEdliInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeEdliInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                  <span>Include Employer's EDLI contribution (0.50%) in the CTC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.epfIncludeAdminChargesInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeAdminChargesInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                  <span>Include EPF Admin charges (0.50%) in the CTC</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "ESI" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">ESI Insurance Number *</label>
                <input
                  type="text"
                  required
                  value={form.esiNumber}
                  onChange={(e) => setForm({ ...form, esiNumber: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Employee Contribution (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.esiEmployeeRate}
                    onChange={(e) => setForm({ ...form, esiEmployeeRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Employer Contribution (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.esiEmployerRate}
                    onChange={(e) => setForm({ ...form, esiEmployerRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "PT" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">State Jurisdiction *</label>
                <select
                  value={form.ptState}
                  onChange={(e) => setForm({ ...form, ptState: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
                >
                  {Object.keys(STATE_PT_SLABS).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Registration Number</label>
                <input
                  type="text"
                  value={form.ptNumber}
                  onChange={(e) => setForm({ ...form, ptNumber: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === "LWF" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">State Jurisdiction *</label>
                <select
                  value={form.lwfState}
                  onChange={(e) => setForm({ ...form, lwfState: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
                >
                  {Object.keys(STATE_LWF_RULES).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "GRATUITY" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Monthly Accrual Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.gratuityRate}
                    onChange={(e) => setForm({ ...form, gratuityRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Exemption Ceiling (₹)</label>
                  <input
                    type="number"
                    value={form.gratuityMaxLimit}
                    onChange={(e) => setForm({ ...form, gratuityMaxLimit: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "BONUS" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Eligibility Wage Limit (₹)</label>
                  <input
                    type="number"
                    value={form.bonusWageThreshold}
                    onChange={(e) => setForm({ ...form, bonusWageThreshold: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-300">Calculation Ceiling (₹)</label>
                  <input
                    type="number"
                    value={form.bonusCalculationCeiling}
                    onChange={(e) => setForm({ ...form, bonusCalculationCeiling: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "NPS" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Employer NPS Rate (% of Basic+DA)</label>
                <input
                  type="number"
                  value={form.npsEmployerRate}
                  onChange={(e) => setForm({ ...form, npsEmployerRate: +e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </Modal>

      {/* Multi-Case Preview Simulator Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="EPF Calculation Preview Matrix"
        description="Verify EPF contributions across multiple wage scenarios under current organisation rules."
      >
        <div className="space-y-4 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase">
                <tr>
                  <th className="p-3">Sample Case</th>
                  <th className="p-3">Monthly PF Wage</th>
                  <th className="p-3">Applicable Wage</th>
                  <th className="p-3">Employee EPF (12%)</th>
                  <th className="p-3">EPS (8.33%)</th>
                  <th className="p-3">Employer EPF (3.67%)</th>
                  <th className="p-3">Total Remittance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {[10000, 15000, 20000, 35000, 60000].map((wage, i) => {
                  const calc = calculateEPFSample(wage);
                  return (
                    <tr key={i} className="hover:bg-zinc-900/40 font-mono">
                      <td className="p-3 font-sans font-semibold text-zinc-200">
                        {wage <= 15000 ? "Below / At Ceiling" : "Above Wage Ceiling"}
                      </td>
                      <td className="p-3 text-zinc-300">₹ {wage.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-zinc-200 font-bold">₹ {calc.applicableWage.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-amber-400">₹ {calc.employeeEPF.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-zinc-300">₹ {calc.eps.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-zinc-300">₹ {calc.employerEPF.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-indigo-400 font-bold">
                        ₹ {(calc.employeeEPF + calc.eps + calc.employerEPF).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-3 border-t border-zinc-800">
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Close Preview
            </button>
          </div>
        </div>
      </Modal>

      {/* EPFO Employer Contribution Statutory Bifurcation / Splitup Modal */}
      <Modal
        isOpen={splitupModalOpen}
        onClose={() => setSplitupModalOpen(false)}
        title="EPFO Employer Contribution Statutory Splitup"
        description="Official bifurcation of employer's 12% statutory PF contribution per EPFO Acts and guidelines."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-indigo-200 text-[11px] leading-relaxed">
            Employer contributes a total of <strong>12% of PF Wage</strong>, which is bifurcated into pension (EPS) and provident fund (EPF) corpora across official EPFO accounts:
          </div>

          <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase">
                <tr>
                  <th className="p-3">EPFO Component</th>
                  <th className="p-3">EPFO A/C No.</th>
                  <th className="p-3">Statutory Rate</th>
                  <th className="p-3">Wage Ceiling</th>
                  <th className="p-3 text-right">Sample Amount (₹15k Wage)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                <tr className="hover:bg-zinc-900/40">
                  <td className="p-3 font-semibold text-zinc-200">
                    <div>Employees' Pension Scheme (EPS)</div>
                    <div className="text-[10px] text-zinc-500">Government pension pool post retirement</div>
                  </td>
                  <td className="p-3 font-mono text-zinc-400">Account 10</td>
                  <td className="p-3 font-mono text-zinc-200 font-bold">8.33%</td>
                  <td className="p-3 font-mono text-zinc-400">Max ₹15,000 (Cap ₹1,250)</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">₹ 1,250</td>
                </tr>

                <tr className="hover:bg-zinc-900/40">
                  <td className="p-3 font-semibold text-zinc-200">
                    <div>Employees' Provident Fund (EPF)</div>
                    <div className="text-[10px] text-zinc-500">Employee individual retirement corpus (12% − EPS)</div>
                  </td>
                  <td className="p-3 font-mono text-zinc-400">Account 1</td>
                  <td className="p-3 font-mono text-zinc-200 font-bold">3.67%</td>
                  <td className="p-3 font-mono text-zinc-400">Capped or Actual</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">₹ 550</td>
                </tr>

                <tr className="hover:bg-zinc-900/40">
                  <td className="p-3 font-semibold text-zinc-200">
                    <div>EDLI Insurance Contribution</div>
                    <div className="text-[10px] text-zinc-500">Life insurance coverage up to ₹7,00,000 for family</div>
                  </td>
                  <td className="p-3 font-mono text-zinc-400">Account 21</td>
                  <td className="p-3 font-mono text-zinc-200 font-bold">0.50%</td>
                  <td className="p-3 font-mono text-zinc-400">Max ₹15,000</td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-300">₹ 75</td>
                </tr>

                <tr className="hover:bg-zinc-900/40">
                  <td className="p-3 font-semibold text-zinc-200">
                    <div>EPF Administration Charges</div>
                    <div className="text-[10px] text-zinc-500">EPFO service administration (Min ₹500/establishment)</div>
                  </td>
                  <td className="p-3 font-mono text-zinc-400">Account 2</td>
                  <td className="p-3 font-mono text-zinc-200 font-bold">0.50%</td>
                  <td className="p-3 font-mono text-zinc-400">Max ₹15,000</td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-300">₹ 75</td>
                </tr>
              </tbody>
              <tfoot className="bg-zinc-900/90 font-bold text-zinc-100 border-t border-zinc-800">
                <tr>
                  <td colSpan={4} className="p-3">
                    Total Employer Monthly Statutory Liability per Employee:
                  </td>
                  <td className="p-3 text-right font-mono text-indigo-400 text-sm">
                    ₹ 1,950
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end pt-3 border-t border-zinc-800">
            <button
              onClick={() => setSplitupModalOpen(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Close Splitup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
