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
  Save,
  RotateCcw,
  Sliders,
  Percent,
  CheckCircle2,
} from "lucide-react";

// Real-world State PT Slabs Master Data (Fully editable by admin)
const DEFAULT_STATE_PT_SLABS = {
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

// Real-world State LWF Master Data (Fully editable by admin)
const DEFAULT_STATE_LWF_RULES = {
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
  const [activeTab, setActiveTab] = useState("EPF");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [splitupModalOpen, setSplitupModalOpen] = useState(false);
  const [customSlabModalOpen, setCustomSlabModalOpen] = useState(false);

  // Stored Statutory Settings (Master Config)
  const [settings, setSettings] = useState({
    // 1. EPF & VPF
    epfEnabled: true,
    epfNumber: "TN/TBM/9987788/688",
    epfDeductionCycle: "Monthly",
    epfEmployeeRate: "RESTRICT_15000", // "RESTRICT_15000" or "ACTUAL_WAGE"
    epfWageCeiling: 15000,
    epfEmployeePercent: 12,
    epfEmployerPercent: 12,
    epfEpsPercent: 8.33,
    epfEpsCapAmount: 1250,
    epfEdliPercent: 0.50,
    epfAdminPercent: 0.50,
    epfIncludeEmployerInCTC: true,
    epfIncludeEdliInCTC: true,
    epfIncludeAdminChargesInCTC: true,
    epfAllowEmployeeOverride: true,
    epfProrateRestrictedWage: false,
    epfConsiderLop: true,
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
    ptStateSlabs: DEFAULT_STATE_PT_SLABS,

    // 4. Labour Welfare Fund
    lwfEnabled: true,
    lwfState: "Karnataka",
    lwfStateRules: DEFAULT_STATE_LWF_RULES,

    // 5. Gratuity (Payment of Gratuity Act 1972)
    gratuityEnabled: true,
    gratuityRate: 4.81, // (15 / 26 / 12)
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
    if (e) e.preventDefault();
    setSettings(form);
    const existing = storageService.getSettings();
    storageService.updateSettings({
      ...existing,
      statutorySettings: form,
      pfCappingEnabled: form.epfEmployeeRate === "RESTRICT_15000",
      pfWageCeiling: form.epfWageCeiling || 15000,
    });
    setEditModalOpen(false);
    showToast(`${activeTab} statutory configuration & rules updated successfully!`);
  };

  // Calculations for EPF Sample Breakdown based on active custom settings
  const calculateEPFSample = (pfWage) => {
    const isCapped = form.epfEmployeeRate === "RESTRICT_15000";
    const ceiling = form.epfWageCeiling || 15000;
    const applicableWage = isCapped ? Math.min(pfWage, ceiling) : pfWage;
    const eePercent = (form.epfEmployeePercent || 12) / 100;
    const employeeEPF = Math.round(applicableWage * eePercent);
    const epsWage = Math.min(applicableWage, ceiling);
    const epsPercent = (form.epfEpsPercent || 8.33) / 100;
    const epsCap = form.epfEpsCapAmount || 1250;
    const eps = Math.min(Math.round(epsWage * epsPercent), epsCap);
    const employerEPF = Math.max(0, employeeEPF - eps);
    const edliPercent = (form.epfEdliPercent || 0.50) / 100;
    const adminPercent = (form.epfAdminPercent || 0.50) / 100;
    const edli = Math.round(epsWage * edliPercent);
    const adminCharges = Math.round(epsWage * adminPercent);
    const employerTotal =
      (form.epfIncludeEmployerInCTC ? eps + employerEPF : 0) +
      (form.epfIncludeEdliInCTC ? edli : 0) +
      (form.epfIncludeAdminChargesInCTC ? adminCharges : 0);

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

  // Calculations for ESI Sample Breakdown based on active custom settings
  const calculateESISample = (grossWage) => {
    if (grossWage > form.esiWageThreshold) {
      return { isEligible: false, employeeESI: 0, employerESI: 0, total: 0 };
    }
    const employeeESI = Math.ceil((grossWage * (form.esiEmployeeRate || 0.75)) / 100);
    const employerESI = Math.ceil((grossWage * (form.esiEmployerRate || 3.25)) / 100);
    return {
      isEligible: true,
      employeeESI,
      employerESI,
      total: employeeESI + employerESI,
    };
  };

  const epfSample = calculateEPFSample(sampleWage);
  const currentPtData = (form.ptStateSlabs && form.ptStateSlabs[form.ptState]) || DEFAULT_STATE_PT_SLABS[form.ptState] || DEFAULT_STATE_PT_SLABS.Karnataka;
  const currentLwfData = (form.lwfStateRules && form.lwfStateRules[form.lwfState]) || DEFAULT_STATE_LWF_RULES[form.lwfState] || DEFAULT_STATE_LWF_RULES.Karnataka;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Shield className="size-5 text-indigo-400" />
            Statutory Components & Flexible Compliance Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure rates, wage ceilings, and calculation rules for EPF, ESIC, Professional Tax, Gratuity, Bonus, LWF, TDS, and NPS with full admin flexibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleSaveSettings()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <Save className="size-3.5" />
            Save Active Config
          </button>

          <button
            onClick={() => {
              setForm(settings);
              setEditModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
          >
            <Edit2 className="size-3.5" />
            Edit {activeTab} Master Rules
          </button>
        </div>
      </div>

      {/* 8 Indian Statutory Tabs */}
      <div className="flex border-b border-zinc-800 gap-6 text-xs font-bold text-zinc-400 px-2 overflow-x-auto">
        {[
          { id: "EPF", label: "EPF & VPF" },
          { id: "ESI", label: "ESI Health Cover" },
          { id: "PT", label: "Professional Tax" },
          { id: "LWF", label: "Labour Welfare Fund" },
          { id: "GRATUITY", label: "Gratuity (Act 1972)" },
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

      {/* Main Tab Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* TAB 1: EPF & VPF */}
        {/* ========================================================= */}
        {activeTab === "EPF" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">EPF & VPF Statutory Rules & Rates</h3>
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

              {/* Flexible Inline Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">EPFO Establishment Code</label>
                  <input
                    type="text"
                    value={form.epfNumber}
                    onChange={(e) => setForm({ ...form, epfNumber: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Wage Ceiling Mode</label>
                  <select
                    value={form.epfEmployeeRate}
                    onChange={(e) => setForm({ ...form, epfEmployeeRate: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                  >
                    <option value="RESTRICT_15000">Restrict to Ceiling (₹15,000 / month)</option>
                    <option value="ACTUAL_WAGE">Uncapped (12% on Actual Basic Wage)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Statutory Wage Ceiling (₹ / mo)</label>
                  <input
                    type="number"
                    value={form.epfWageCeiling || 15000}
                    onChange={(e) => setForm({ ...form, epfWageCeiling: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Employee EPF Deduction Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.epfEmployeePercent || 12}
                    onChange={(e) => setForm({ ...form, epfEmployeePercent: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>
              </div>

              {/* CTC Inclusions Toggles */}
              <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2.5">
                <span className="text-zinc-300 font-bold text-xs block">Cost to Company (CTC) Inclusions</span>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.epfIncludeEmployerInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeEmployerInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                  <span>Include Employer's Contribution (12%) in the CTC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.epfIncludeEdliInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeEdliInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                  <span>Include Employer's EDLI Insurance (0.50%) in the CTC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={form.epfIncludeAdminChargesInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeAdminChargesInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                  <span>Include EPF Administration Charges (0.50%) in the CTC</span>
                </label>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setSplitupModalOpen(true)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-bold underline flex items-center gap-1"
                >
                  View Official EPFO Splitup Breakdown →
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save EPF Settings
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Calculator Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">Interactive EPF Simulator</h4>
                    <span className="text-[11px] text-zinc-400">Test calculation on custom basic wages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">Wage:</span>
                    <input
                      type="number"
                      step="1000"
                      value={sampleWage}
                      onChange={(e) => setSampleWage(+e.target.value)}
                      className="w-24 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-emerald-400 font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-zinc-200">
                    <span>Applicable PF Wage</span>
                    <span className="font-mono font-bold text-zinc-100">₹ {epfSample.applicableWage.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-200">
                    <span>Employee EPF ({form.epfEmployeePercent || 12}%)</span>
                    <span className="font-mono font-bold text-amber-400">₹ {epfSample.employeeEPF.toLocaleString("en-IN")}</span>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="space-y-1.5 text-zinc-400 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span>• EPS Pension (8.33% - Cap ₹1,250)</span>
                      <span className="font-mono text-zinc-300">₹ {epfSample.eps.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>• EPF Employer (12% − EPS)</span>
                      <span className="font-mono text-zinc-300">₹ {epfSample.employerEPF.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>• EDLI Insurance (0.50%)</span>
                      <span className="font-mono text-zinc-300">₹ {epfSample.edli.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>• EPF Admin Fee (0.50%)</span>
                      <span className="font-mono text-zinc-300">₹ {epfSample.adminCharges.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <hr className="border-zinc-800/80" />
                  <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                    <span>Total Employer Cost</span>
                    <span className="font-mono text-indigo-400">₹ {epfSample.employerTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">View multiple wage cases preview matrix:</span>
                  <button
                    onClick={() => setPreviewModalOpen(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Open Matrix →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ESIC HEALTH COVER */}
        {/* ========================================================= */}
        {activeTab === "ESI" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">ESIC Health Insurance Rules & Wage Threshold</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">ESIC Registration Number</label>
                  <input
                    type="text"
                    value={form.esiNumber}
                    onChange={(e) => setForm({ ...form, esiNumber: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Eligibility Wage Threshold (₹ / mo)</label>
                  <input
                    type="number"
                    value={form.esiWageThreshold || 21000}
                    onChange={(e) => setForm({ ...form, esiWageThreshold: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Employee Contribution Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.esiEmployeeRate || 0.75}
                    onChange={(e) => setForm({ ...form, esiEmployeeRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Employer Contribution Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.esiEmployerRate || 3.25}
                    onChange={(e) => setForm({ ...form, esiEmployerRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
                <span className="font-bold text-zinc-200 text-xs block">6-Month Contribution Cycle Rule</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  If an employee's gross wage crosses ₹21,000 during a contribution period (Apr-Sep or Oct-Mar), statutory ESIC deduction continues till the end of that contribution period.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save ESIC Settings
                </button>
              </div>
            </div>

            {/* Live ESIC Simulator */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
                <h4 className="font-bold text-sm text-zinc-100">Live ESI Calculation Simulator</h4>
                <p className="text-[11px] text-zinc-400">For gross salary of <strong className="text-zinc-200">₹ {sampleWage.toLocaleString("en-IN")}</strong>:</p>

                {sampleWage <= (form.esiWageThreshold || 21000) ? (
                  <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center text-zinc-200">
                      <span>Employee ESI ({form.esiEmployeeRate}%)</span>
                      <span className="font-mono font-bold text-amber-400">
                        ₹ {Math.ceil((sampleWage * (form.esiEmployeeRate || 0.75)) / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-200">
                      <span>Employer ESI ({form.esiEmployerRate}%)</span>
                      <span className="font-mono font-bold text-purple-400">
                        ₹ {Math.ceil((sampleWage * (form.esiEmployerRate || 3.25)) / 100)}
                      </span>
                    </div>
                    <hr className="border-zinc-800/80" />
                    <div className="flex justify-between items-center font-bold text-zinc-100 text-sm">
                      <span>Total ESI Remittance</span>
                      <span className="font-mono text-indigo-400">
                        ₹ {Math.ceil((sampleWage * ((form.esiEmployeeRate || 0.75) + (form.esiEmployerRate || 3.25))) / 100)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-300 text-xs">
                    ⚠️ Gross wage of ₹ {sampleWage.toLocaleString("en-IN")} exceeds the statutory threshold of ₹ {form.esiWageThreshold.toLocaleString("en-IN")}. ESIC is exempt for this wage.
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PROFESSIONAL TAX (STATE SLABS BUILDER) */}
        {/* ========================================================= */}
        {activeTab === "PT" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Professional Tax - State Slabs & Slabs Builder</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {form.ptState} Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Select State Jurisdiction</label>
                  <select
                    value={form.ptState}
                    onChange={(e) => setForm({ ...form, ptState: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                  >
                    {Object.keys(DEFAULT_STATE_PT_SLABS).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">PT Registration Number</label>
                  <input
                    type="text"
                    value={form.ptNumber}
                    onChange={(e) => setForm({ ...form, ptNumber: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              {/* Active State Slabs Table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-zinc-300 text-xs">Active Tax Slabs for {form.ptState}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Deduction Cycle: {currentPtData.cycle}</span>
                </div>

                <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase font-sans">
                      <tr>
                        <th className="p-3">Salary Range (Gross Wage)</th>
                        <th className="p-3 text-right">Tax Deduction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {currentPtData.slabs.map((slab, i) => (
                        <tr key={i} className="hover:bg-zinc-900/40">
                          <td className="p-3 text-zinc-300">
                            {slab.max ? `₹ ${slab.min.toLocaleString("en-IN")} to ₹ ${slab.max.toLocaleString("en-IN")}` : `Above ₹ ${slab.min.toLocaleString("en-IN")}`}
                          </td>
                          <td className="p-3 text-right text-emerald-400 font-bold">
                            ₹ {slab.tax} / month {slab.febTax ? `(₹${slab.febTax} in Feb)` : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save PT Configuration
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="font-bold text-sm text-zinc-100">Professional Tax Constitutional Rules</h4>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Under <strong>Article 276</strong> of the Indian Constitution, the maximum Professional Tax that can be levied by any state is capped at <strong>₹ 2,500 per year</strong> per employee.
                </p>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs space-y-1">
                  <span className="text-zinc-400 block font-semibold">State Slabs Flexibility:</span>
                  <p className="text-zinc-500 text-[11px]">
                    If a state government amends its PT tax brackets in their state budget, the admin can update the slabs dynamically without code changes.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LABOUR WELFARE FUND (LWF) */}
        {/* ========================================================= */}
        {activeTab === "LWF" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-sm text-zinc-100">Labour Welfare Fund (LWF) Rules</h3>
                  <button onClick={() => { setForm(settings); setEditModalOpen(true); }} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded">
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {form.lwfState} Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Select LWF State</label>
                  <select
                    value={form.lwfState}
                    onChange={(e) => setForm({ ...form, lwfState: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                  >
                    {Object.keys(DEFAULT_STATE_LWF_RULES).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Deduction Frequency</label>
                  <input
                    type="text"
                    disabled
                    value={currentLwfData.frequency}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 text-zinc-400 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Employee Contribution (₹)</label>
                  <input
                    type="number"
                    value={currentLwfData.employeeRate}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Employer Contribution (₹)</label>
                  <input
                    type="number"
                    value={currentLwfData.employerRate}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save LWF Settings
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="font-bold text-sm text-zinc-100">Labour Welfare Board Notice</h4>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  {currentLwfData.note}
                </p>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Total Statutory Contribution:</span>
                  <span className="font-mono font-bold text-emerald-400">₹ {currentLwfData.total}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 5: GRATUITY (ACT 1972) */}
        {/* ========================================================= */}
        {activeTab === "GRATUITY" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-100">Payment of Gratuity Act, 1972 Configuration</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  4.81% Provision
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Monthly CTC Provision Factor (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.gratuityRate || 4.81}
                    onChange={(e) => setForm({ ...form, gratuityRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-purple-400 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-500">Standard 15/26 days per year factor (4.81%)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Statutory Exemption Ceiling (₹)</label>
                  <input
                    type="number"
                    value={form.gratuityMaxLimit || 2000000}
                    onChange={(e) => setForm({ ...form, gratuityMaxLimit: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-500">Section 10(10) limit (₹ 20,00,000)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Minimum Eligibility Service (Years)</label>
                  <input
                    type="number"
                    value={form.gratuityEligibilityYears || 5}
                    onChange={(e) => setForm({ ...form, gratuityEligibilityYears: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300 pt-3">
                    <input
                      type="checkbox"
                      checked={form.gratuityIncludeInCTC}
                      onChange={(e) => setForm({ ...form, gratuityIncludeInCTC: e.target.checked })}
                      className="size-4 accent-indigo-600 rounded"
                    />
                    <span className="text-xs">Include Gratuity in Employee CTC</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save Gratuity Rules
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="font-bold text-sm text-zinc-100">Statutory Settlement Formula</h4>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs space-y-1 text-purple-300">
                  <span>Gratuity Payout = (15 × Last Basic × Tenure) ÷ 26</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Example: An employee with 10 years service and Last Basic of ₹40,000 gets <strong className="text-zinc-200">₹ 2,30,769</strong> tax-free gratuity on retirement or separation.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 6: STATUTORY BONUS */}
        {/* ========================================================= */}
        {activeTab === "BONUS" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-100">Payment of Bonus Act, 1965 Rules</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  8.33% - 20%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Eligibility Wage Limit (₹ / mo)</label>
                  <input
                    type="number"
                    value={form.bonusWageThreshold || 21000}
                    onChange={(e) => setForm({ ...form, bonusWageThreshold: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-500">Applicable for salary ≤ ₹ 21,000/mo</span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Calculation Wage Ceiling (₹ / mo)</label>
                  <input
                    type="number"
                    value={form.bonusCalculationCeiling || 7000}
                    onChange={(e) => setForm({ ...form, bonusCalculationCeiling: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-500">₹ 7,000 or State Minimum Wage</span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Minimum Statutory Bonus (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.bonusMinRate || 8.33}
                    onChange={(e) => setForm({ ...form, bonusMinRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Maximum Statutory Bonus (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.bonusMaxRate || 20.0}
                    onChange={(e) => setForm({ ...form, bonusMaxRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save Bonus Rules
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="font-bold text-sm text-zinc-100">Annual Statutory Minimum Bonus</h4>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Minimum Annual Bonus:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹ {Math.round((form.bonusCalculationCeiling || 7000) * 12 * ((form.bonusMinRate || 8.33) / 100)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 7: INCOME TAX TDS */}
        {/* ========================================================= */}
        {activeTab === "TDS" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-100">Income Tax TDS u/s 192 (FY 2026-27)</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  New Regime Default
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Standard Deduction - New Regime (₹)</label>
                  <input
                    type="number"
                    value={form.tdsStandardDeductionNew || 75000}
                    onChange={(e) => setForm({ ...form, tdsStandardDeductionNew: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Standard Deduction - Old Regime (₹)</label>
                  <input
                    type="number"
                    value={form.tdsStandardDeductionOld || 50000}
                    onChange={(e) => setForm({ ...form, tdsStandardDeductionOld: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Health & Education Cess (%)</label>
                  <input
                    type="number"
                    value={form.tdsCessRate || 4}
                    onChange={(e) => setForm({ ...form, tdsCessRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Default Tax Regime</label>
                  <select
                    value={form.tdsDefaultRegime}
                    onChange={(e) => setForm({ ...form, tdsDefaultRegime: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                  >
                    <option value="NEW_REGIME_115BAC">Section 115BAC (New Regime)</option>
                    <option value="OLD_REGIME">Old Tax Regime (With 80C/80D/HRA)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save TDS Settings
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="font-bold text-sm text-zinc-100">New Tax Regime Highlights</h4>
                <ul className="text-zinc-400 text-[11px] space-y-1.5 list-disc pl-4">
                  <li>Standard deduction of ₹ 75,000 applicable for salaried employees.</li>
                  <li>Rebate under Section 87A ensures zero income tax up to ₹ 7,75,000 taxable income.</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 8: CORPORATE NPS */}
        {/* ========================================================= */}
        {activeTab === "NPS" && (
          <>
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-100">Corporate NPS (Section 80CCD(2))</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  10% of Basic+DA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Employer NPS Contribution Rate (%)</label>
                  <input
                    type="number"
                    value={form.npsEmployerRate || 10}
                    onChange={(e) => setForm({ ...form, npsEmployerRate: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-cyan-400 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-500">Up to 10% Basic for private employers</span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold">Annual Exemption Ceiling (₹)</label>
                  <input
                    type="number"
                    value={form.npsMaxExemptionCap || 750000}
                    onChange={(e) => setForm({ ...form, npsMaxExemptionCap: +e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                  />
                  <span className="text-[10px] text-zinc-500">Combined PF+NPS+Superannuation cap (₹7.5L)</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save NPS Settings
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="font-bold text-sm text-zinc-100">Section 80CCD(2) Tax Shield</h4>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Employer's contribution to NPS up to 10% of (Basic + DA) is completely tax-deductible in both Old and New tax regimes over and above 80C limits.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal for deep edits */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit ${activeTab} Statutory Preferences & Parameters`}
        description="Update rates, statutory wage ceilings, CTC inclusion rules, or state jurisdictions."
      >
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <p className="text-zinc-400 text-xs">
            Any modification made here will immediately update the active statutory engine across all employee salary templates and payroll calculations.
          </p>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
            <span className="font-bold text-zinc-200 block">Confirm Updates:</span>
            <span className="text-emerald-400 font-mono font-bold block">
              Active Module: {activeTab}
            </span>
          </div>

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
              Apply & Save Changes
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
                        {wage <= (form.epfWageCeiling || 15000) ? "Below / At Ceiling" : "Above Wage Ceiling"}
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

      {/* EPFO Employer Contribution Splitup Modal */}
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
