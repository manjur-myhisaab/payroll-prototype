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
  Scale,
  FileText,
  Briefcase,
  CheckCheck,
  Heart,
  HeartPulse,
} from "lucide-react";

// Real-world State PT Slabs Master Data (Universal SaaS Master Catalog)
const MASTER_STATE_PT_SLABS = {
  Karnataka: {
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 14999, tax: 0 },
      { min: 15000, max: null, tax: 200 },
    ],
    act: "Karnataka Tax on Professions, Trades, Callings and Employments Act, 1976",
    note: "Flat ₹200/month for monthly gross salary ≥ ₹15,000.",
  },
  Maharashtra: {
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 7499, tax: 0 },
      { min: 7500, max: 9999, tax: 175 },
      { min: 10000, max: null, tax: 200, febTax: 300 },
    ],
    act: "Maharashtra State Tax on Professions Act, 1975",
    note: "₹200/month for > ₹10,000; ₹300 in February. Women earning ≤ ₹25,000 exempt.",
  },
  "Tamil Nadu": {
    cycle: "Half-Yearly (Sep & Mar)",
    slabs: [
      { min: 0, max: 21000, tax: 0 },
      { min: 21001, max: 30000, tax: 135 },
      { min: 30001, max: 45000, tax: 315 },
      { min: 45001, max: 60000, tax: 690 },
      { min: 60001, max: 75000, tax: 1025 },
      { min: 75001, max: null, tax: 1250 },
    ],
    act: "Tamil Nadu Municipal Laws (Amendment) Act, 1998",
    note: "Calculated half-yearly on average gross salary.",
  },
  Telangana: {
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 15000, tax: 0 },
      { min: 15001, max: 20000, tax: 150 },
      { min: 20001, max: null, tax: 200 },
    ],
    act: "Telangana Tax on Professions Act, 1987",
    note: "₹150 for ₹15k-₹20k, ₹200 for > ₹20k gross.",
  },
  "West Bengal": {
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 10000, tax: 0 },
      { min: 10001, max: 15000, tax: 110 },
      { min: 15001, max: 25000, tax: 130 },
      { min: 25001, max: 40000, tax: 150 },
      { min: 40001, max: null, tax: 200 },
    ],
    act: "West Bengal State Tax on Professions Act, 1979",
    note: "Graduated monthly rates from ₹110 to ₹200.",
  },
  Gujarat: {
    cycle: "Monthly",
    slabs: [
      { min: 0, max: 12000, tax: 0 },
      { min: 12001, max: null, tax: 200 },
    ],
    act: "Gujarat Panchayats, Municipalities & State Tax on Professions Act, 1976",
    note: "Zero tax up to ₹12,000; flat ₹200 for gross > ₹12,000.",
  },
};

// Real-world State LWF Master Data (Universal SaaS Master Catalog)
const MASTER_STATE_LWF_RULES = {
  Karnataka: {
    frequency: "Annual (December)",
    employeeRate: 20,
    employerRate: 40,
    total: 60,
    act: "Karnataka Labour Welfare Fund Act, 1965",
    note: "Deducted once a year in December payroll.",
  },
  Maharashtra: {
    frequency: "Half-Yearly (June & December)",
    employeeRate: 12,
    employerRate: 36,
    total: 48,
    act: "Maharashtra Labour Welfare Fund Act, 1953",
    note: "Deducted twice a year in June and December payroll.",
  },
  "Tamil Nadu": {
    frequency: "Annual (December)",
    employeeRate: 20,
    employerRate: 40,
    total: 60,
    act: "Tamil Nadu Labour Welfare Fund Act, 1972",
    note: "Deducted in December payroll.",
  },
  Gujarat: {
    frequency: "Half-Yearly (June & December)",
    employeeRate: 6,
    employerRate: 12,
    total: 18,
    act: "Gujarat Labour Welfare Fund Act, 1953",
    note: "Deducted in June and December.",
  },
  Delhi: {
    frequency: "Half-Yearly (June & December)",
    employeeRate: 0.75,
    employerRate: 2.25,
    total: 3,
    act: "Delhi Labour Welfare Fund Rules, 1997",
    note: "Deducted half-yearly.",
  },
  Haryana: {
    frequency: "Monthly",
    employeeRate: 25,
    employerRate: 50,
    total: 75,
    act: "Punjab Labour Welfare Fund (Haryana Amendment) Act, 1965",
    note: "0.2% of salary up to max ₹25 for employee, 2x for employer monthly.",
  },
};

export default function StatutoryComponents() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("EPF");

  // Firm-Level Stored Settings
  const [firmSettings, setFirmSettings] = useState({
    // 1. EPF & VPF (Firm Level)
    epfEnabled: true,
    epfEstablishmentCode: "TN/TBM/9987788/688",
    epfWageCappingPolicy: "RESTRICT_15000", // "RESTRICT_15000" or "ACTUAL_BASIC"
    epfIncludeEmployerInCTC: true,
    epfIncludeEdliInCTC: true,
    epfIncludeAdminInCTC: true,
    vpfEnabled: true,

    // 2. ESI (Firm Level)
    esiEnabled: true,
    esiEstablishmentCode: "31000123450001001",
    esiIncludeInCTC: true,

    // 3. Professional Tax (Firm Level)
    ptEnabled: true,
    ptPrimaryState: "Karnataka",
    ptRegistrationNumbers: {
      Karnataka: "PT/KA/0987654321",
      Maharashtra: "PT/MH/4455667788",
      "Tamil Nadu": "PT/TN/1122334455",
      Telangana: "PT/TG/8899001122",
      "West Bengal": "PT/WB/5566778899",
      Gujarat: "PT/GJ/3344556677",
    },

    // 4. Labour Welfare Fund (Firm Level)
    lwfEnabled: true,
    lwfPrimaryState: "Karnataka",
    lwfEstablishmentId: "LWF/KA/2026/8989",

    // 5. Gratuity (Firm Level)
    gratuityEnabled: true,
    gratuityIncludeInCTC: true,
    gratuityTenurePolicy: "STATUTORY_5_YEARS",

    // 6. Statutory Bonus (Firm Level)
    bonusEnabled: true,
    bonusPaymentFrequency: "Annual",
    bonusCustomRate: 8.33,

    // 7. Income Tax TDS (Firm Level)
    tdsEnabled: true,
    tdsTanNumber: "BLRK12345F",
    tdsDeductorPan: "ABCDE1234F",
    tdsDefaultRegime: "NEW_REGIME_115BAC",

    // 8. NPS Corporate (Firm Level)
    npsEnabled: true,
    npsCorporateSchemeId: "NPS/CORP/ACME/99",
    npsEmployerRate: 10,
    npsIncludeInCTC: true,
  });

  const [form, setForm] = useState(firmSettings);
  const [sampleWage, setSampleWage] = useState(30000);

  useEffect(() => {
    const stored = storageService.getSettings();
    if (stored?.firmStatutorySettings) {
      setFirmSettings((prev) => ({ ...prev, ...stored.firmStatutorySettings }));
      setForm((prev) => ({ ...prev, ...stored.firmStatutorySettings }));
    }
  }, []);

  const handleSaveFirmSettings = (e) => {
    if (e) e.preventDefault();
    setFirmSettings(form);
    const existing = storageService.getSettings();
    storageService.updateSettings({
      ...existing,
      firmStatutorySettings: form,
      pfCappingEnabled: form.epfWageCappingPolicy === "RESTRICT_15000",
      pfWageCeiling: 15000,
      esiGrossLimit: 21000,
    });
    showToast("Firm Statutory configuration saved successfully!", "success");
  };

  const tabs = [
    { id: "EPF", name: "EPF & VPF", act: "EPF Act, 1952", icon: Landmark, mandatory: "12% + 12%" },
    { id: "ESI", name: "ESIC Medical", act: "ESI Act, 1948", icon: Shield, mandatory: "0.75% / 3.25%" },
    { id: "PT", name: "Professional Tax", act: "State PT Acts", icon: Building, mandatory: "State Slabs" },
    { id: "GRATUITY", name: "Gratuity", act: "Gratuity Act, 1972", icon: Award, mandatory: "15/26 (4.81%)" },
    { id: "BONUS", name: "Bonus Act", act: "Bonus Act, 1965", icon: Gift, mandatory: "8.33% - 20%" },
    { id: "LWF", name: "Labour Welfare (LWF)", act: "State LWF Acts", icon: Heart, mandatory: "State Fixed" },
    { id: "TDS", name: "Income Tax TDS", act: "IT Act Sec 192", icon: FileText, mandatory: "Slabs + Cess" },
    { id: "NPS", name: "Corporate NPS", act: "PFRDA Sec 80CCD(2)", icon: Scale, mandatory: "Up to 10%" },
  ];

  // Helper calculation for live simulator
  const simWage = Number(sampleWage) || 0;
  const simPFBase = form.epfWageCappingPolicy === "RESTRICT_15000" ? Math.min(simWage, 15000) : simWage;
  const simEmpPF = Math.round(simPFBase * 0.12);
  const simEpsCost = Math.round(Math.min(simWage, 15000) * 0.0833);
  const simErPfCost = Math.round(simPFBase * 0.12) - simEpsCost;
  const simEdli = Math.round(Math.min(simWage, 15000) * 0.005);
  const simAdmin = Math.round(Math.min(simWage, 15000) * 0.005);

  const simIsEsiEligible = simWage <= 21000;
  const simEmpEsi = simIsEsiEligible ? Math.ceil(simWage * 0.0075) : 0;
  const simErEsi = simIsEsiEligible ? Math.ceil(simWage * 0.0325) : 0;
  const simGratuity = Math.round(simWage * 0.0481);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400">
                <Shield className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                  Statutory Compliance & Legal Regulations
                </h2>
                <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider block mt-0.5">
                  2-Tier Architecture: Central Government Rules & Firm Configuration
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2 max-w-3xl leading-relaxed">
              <strong>Tier 1 (Master Law):</strong> Government-mandated statutory percentages and official ceilings are maintained centrally by the SaaS platform master database. 
              <strong> Tier 2 (Firm Level):</strong> Your organization only configures firm registration codes and legally permitted policy options.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Lock className="size-3.5 text-emerald-400" />
              Central Master Law Active
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
              <span>{t.name}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-md font-mono ${
                isActive ? "bg-indigo-700 text-indigo-100" : "bg-zinc-800 text-zinc-400"
              }`}>
                {t.mandatory}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EPF & VPF */}
      {/* ========================================================================= */}
      {activeTab === "EPF" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT STATUTORY MANDATE (READ-ONLY) */}
          <div className="bg-zinc-950 border border-indigo-500/30 p-5 rounded-2xl space-y-4 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-800">
                  <Landmark className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Government Mandated Law: Employees' Provident Funds & Miscellaneous Provisions Act, 1952
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database • Universal across all firms</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Employee EPF Share:</span>
                <strong className="text-emerald-400 text-xs">12.0% of Basic Pay</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Deducted from Employee Gross</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Employer EPS Share:</span>
                <strong className="text-blue-400 text-xs">8.33% (Capped ₹1,250)</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Transferred to Pension Scheme</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Employer EPF Share:</span>
                <strong className="text-indigo-400 text-xs">3.67% Balance</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Accumulates in EPF account</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">EDLI & Admin Charges:</span>
                <strong className="text-amber-400 text-xs">0.50% + 0.50% = 1.0%</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Govt Insurance & Handling fee</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-900/40 text-[11px] text-zinc-300 flex items-start gap-2">
              <Info className="size-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Statutory Wage Ceiling:</strong> Statutory law mandates EPF coverage for all employees earning Basic &le; ₹15,000/month. For higher earners, organizations can choose either the statutory ₹15,000 ceiling or contribute on actual basic wages.
              </span>
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM-LEVEL CONFIGURATION (EDITABLE WHERE LEGALLY PERMITTED) */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-indigo-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm-Level EPF Registration & Policy Settings</h3>
                  <span className="text-[11px] text-zinc-400">Configure your company's establishment ID and allowed policy options</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Firm EPF Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Firm PF Establishment Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.epfEstablishmentCode}
                    onChange={(e) => setForm({ ...form, epfEstablishmentCode: e.target.value })}
                    placeholder="e.g. TN/TBM/9987788/688"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-zinc-500 block">Official 15-digit EPFO establishment identifier.</span>
                </div>

                {/* Policy Option: Capping */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Firm Contribution Policy (Wage Capping Choice)
                  </label>
                  <select
                    value={form.epfWageCappingPolicy}
                    onChange={(e) => setForm({ ...form, epfWageCappingPolicy: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="RESTRICT_15000">Restrict to Statutory Ceiling (₹15,000 / Max ₹1,800/mo)</option>
                    <option value="ACTUAL_BASIC">Contribute on Full Actual Basic Salary (12% of Basic)</option>
                  </select>
                  <span className="text-[10px] text-zinc-500 block">Select how your organization treats employees earning &gt; ₹15,000/mo.</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700">
                  <div>
                    <span className="font-bold text-zinc-200 text-xs block">Include Employer PF in CTC</span>
                    <span className="text-[10px] text-zinc-500">12% Employer cost added to CTC</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.epfIncludeEmployerInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeEmployerInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                </label>

                <label className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700">
                  <div>
                    <span className="font-bold text-zinc-200 text-xs block">Include Admin / EDLI in CTC</span>
                    <span className="text-[10px] text-zinc-500">1.0% admin fee part of CTC</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.epfIncludeEdliInCTC}
                    onChange={(e) => setForm({ ...form, epfIncludeEdliInCTC: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                </label>

                <label className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700">
                  <div>
                    <span className="font-bold text-zinc-200 text-xs block">Enable Voluntary PF (VPF)</span>
                    <span className="text-[10px] text-zinc-500">Allow employees extra voluntary PF</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.vpfEnabled}
                    onChange={(e) => setForm({ ...form, vpfEnabled: e.target.checked })}
                    className="size-4 accent-indigo-600 rounded"
                  />
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm EPF Settings
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: 🧮 LIVE STATUTORY WAGE SIMULATOR */}
          <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Calculator className="size-4" /> Live Statutory EPF Split Simulator
              </span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-[11px] font-sans">Sample Basic Wage:</span>
                <input
                  type="number"
                  value={sampleWage}
                  onChange={(e) => setSampleWage(Number(e.target.value) || 0)}
                  className="w-28 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-100 text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
              <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">PF Wage Base:</span>
                <strong className="text-zinc-200">{formatINR(simPFBase)}</strong>
              </div>
              <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Employee EPF (12%):</span>
                <strong className="text-emerald-400">{formatINR(simEmpPF)}</strong>
              </div>
              <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Employer EPS (8.33%):</span>
                <strong className="text-blue-400">{formatINR(simEpsCost)}</strong>
              </div>
              <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Employer EPF (3.67%):</span>
                <strong className="text-indigo-400">{formatINR(simErPfCost)}</strong>
              </div>
              <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Admin + EDLI (1%):</span>
                <strong className="text-amber-400">{formatINR(simEdli + simAdmin)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ESIC */}
      {/* ========================================================================= */}
      {activeTab === "ESI" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT LAW */}
          <div className="bg-zinc-950 border border-emerald-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">
                  <Shield className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Government Mandated Law: Employees' State Insurance Act, 1948
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Statutory Wage Threshold:</span>
                <strong className="text-emerald-400 text-xs">Gross Pay &le; ₹21,000 / month</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">(₹25,000 for employees with disability)</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Employee Contribution:</span>
                <strong className="text-rose-400 text-xs">0.75% of Gross Wages</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Deducted from monthly payslip</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Employer Contribution:</span>
                <strong className="text-blue-400 text-xs">3.25% of Gross Wages</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Paid by employer to ESIC fund</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/40 text-[11px] text-zinc-300 flex items-start gap-2">
              <Info className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Contribution Period Rule:</strong> If an employee's salary exceeds ₹21,000 during a contribution period (Apr-Sep or Oct-Mar), they continue to be covered until the end of that contribution period.
              </span>
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM CONFIGURATION */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-emerald-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm ESIC Registration & Policy Options</h3>
                  <span className="text-[11px] text-zinc-400">Configure your company's ESIC registration number</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Firm ESIC 17-Digit Registration Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.esiEstablishmentCode}
                    onChange={(e) => setForm({ ...form, esiEstablishmentCode: e.target.value })}
                    placeholder="e.g. 31000123450001001"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-zinc-500 block">Issued by ESIC regional office.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Include 3.25% Employer ESIC in CTC
                  </label>
                  <select
                    value={form.esiIncludeInCTC ? "YES" : "NO"}
                    onChange={(e) => setForm({ ...form, esiIncludeInCTC: e.target.value === "YES" })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="YES">Yes, include Employer 3.25% in Employee Annual CTC</option>
                    <option value="NO">No, Company bears ESIC as external overhead cost</option>
                  </select>
                  <span className="text-[10px] text-zinc-500 block">Determines if employer share is part of CTC package.</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm ESIC Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROFESSIONAL TAX */}
      {/* ========================================================================= */}
      {activeTab === "PT" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT STATE SLABS */}
          <div className="bg-zinc-950 border border-cyan-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
                  <Building className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Official State Professional Tax (PT) Slabs Catalog
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database as per State Acts</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Slabs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(MASTER_STATE_PT_SLABS).map(([state, data]) => (
                <div key={state} className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-xs">{state}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded font-mono">{data.cycle}</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">{data.note}</p>
                  <span className="text-[9px] text-zinc-500 block truncate" title={data.act}>Act: {data.act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM STATE REGISTRATION NUMBERS */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-cyan-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm State-wise PT Registration Identifiers</h3>
                  <span className="text-[11px] text-zinc-400">Enter your company's official PT registration numbers for states where you employ staff</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(MASTER_STATE_PT_SLABS).map((state) => (
                  <div key={state} className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                      <span>{state} PT Registration Number</span>
                      <span className="text-[10px] text-zinc-500 font-normal">State PT Certificate</span>
                    </label>
                    <input
                      type="text"
                      value={form.ptRegistrationNumbers[state] || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          ptRegistrationNumbers: {
                            ...form.ptRegistrationNumbers,
                            [state]: e.target.value,
                          },
                        })
                      }
                      placeholder={`e.g. PT/${state.slice(0, 2).toUpperCase()}/12345`}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm PT Registrations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GRATUITY */}
      {/* ========================================================================= */}
      {activeTab === "GRATUITY" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT LAW */}
          <div className="bg-zinc-950 border border-purple-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-purple-950 text-purple-400 rounded-lg border border-purple-800">
                  <Award className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Government Mandated Law: Payment of Gratuity Act, 1972
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Statutory Formula:</span>
                <strong className="text-purple-400 text-xs">15/26 &times; Last Basic &times; Years</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">15 days wage for every completed year</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Monthly CTC Provision Rate:</span>
                <strong className="text-emerald-400 text-xs">4.81% of Monthly Basic</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">(15 / 26 / 12 months = 4.81%)</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Statutory Tax-Exempt Limit:</span>
                <strong className="text-amber-400 text-xs">₹20,00,000 (₹20 Lakhs)</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Under Section 10(10) of IT Act</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM POLICY */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-purple-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm Gratuity Accrual Policy</h3>
                  <span className="text-[11px] text-zinc-400">Configure whether Gratuity provision is included in monthly CTC</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Include 4.81% Gratuity in CTC Structure
                  </label>
                  <select
                    value={form.gratuityIncludeInCTC ? "YES" : "NO"}
                    onChange={(e) => setForm({ ...form, gratuityIncludeInCTC: e.target.value === "YES" })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="YES">Yes, Accrue 4.81% Gratuity as part of Annual CTC</option>
                    <option value="NO">No, Gratuity paid only on exit from corporate reserves</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Vesting Eligibility Rule
                  </label>
                  <select
                    value={form.gratuityTenurePolicy}
                    onChange={(e) => setForm({ ...form, gratuityTenurePolicy: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="STATUTORY_5_YEARS">5 Years Continuous Service (Statutory Mandate)</option>
                    <option value="EARLY_1_YEAR">1 Year Early Benefit (Company Policy)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm Gratuity Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STATUTORY BONUS */}
      {/* ========================================================================= */}
      {activeTab === "BONUS" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT LAW */}
          <div className="bg-zinc-950 border border-amber-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-950 text-amber-400 rounded-lg border border-amber-800">
                  <Gift className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Government Mandated Law: Payment of Bonus Act, 1965
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Eligibility Ceiling:</span>
                <strong className="text-amber-400 text-xs">Salary &le; ₹21,000 / month</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Mandatory for establishments with 20+ staff</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Calculation Base Ceiling:</span>
                <strong className="text-zinc-200 text-xs">₹7,000 / month</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">(or State minimum wage, whichever is higher)</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Statutory Rate Range:</span>
                <strong className="text-emerald-400 text-xs">8.33% (Min) to 20.0% (Max)</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">8.33% = ₹583.10/mo (₹6,997/yr)</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM POLICY */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-amber-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm Bonus Distribution Schedule</h3>
                  <span className="text-[11px] text-zinc-400">Configure payout frequency for statutory and performance bonuses</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Bonus Payment Frequency
                  </label>
                  <select
                    value={form.bonusPaymentFrequency}
                    onChange={(e) => setForm({ ...form, bonusPaymentFrequency: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Annual">Annual (Diwali / Festive Payroll Run)</option>
                    <option value="Monthly">Monthly Pro-rata Provision (8.33% added monthly)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Firm Approved Bonus Percentage (8.33% to 20%)
                  </label>
                  <input
                    type="number"
                    min="8.33"
                    max="20"
                    step="0.01"
                    value={form.bonusCustomRate}
                    onChange={(e) => setForm({ ...form, bonusCustomRate: Number(e.target.value) || 8.33 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm Bonus Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: LWF */}
      {/* ========================================================================= */}
      {activeTab === "LWF" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT LAW */}
          <div className="bg-zinc-950 border border-rose-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-950 text-rose-400 rounded-lg border border-rose-800">
                  <HeartPulse className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Official State Labour Welfare Fund (LWF) Master Rules
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Rules
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(MASTER_STATE_LWF_RULES).map(([state, data]) => (
                <div key={state} className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 text-xs">{state}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">{data.frequency}</span>
                  </div>
                  <div className="text-[10px] text-zinc-300 space-y-0.5 font-sans">
                    <div>Employee: <strong>₹{data.employeeRate}</strong> • Employer: <strong>₹{data.employerRate}</strong></div>
                    <div className="text-zinc-500 text-[9px]">Total Annual: ₹{data.total} ({data.note})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM REGISTRATION */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-rose-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm LWF Establishment Registration</h3>
                  <span className="text-[11px] text-zinc-400">Configure your company's primary state LWF establishment code</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Primary Operational State for LWF
                  </label>
                  <select
                    value={form.lwfPrimaryState}
                    onChange={(e) => setForm({ ...form, lwfPrimaryState: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-rose-500 focus:outline-none"
                  >
                    {Object.keys(MASTER_STATE_LWF_RULES).map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Firm LWF Registration Number
                  </label>
                  <input
                    type="text"
                    value={form.lwfEstablishmentId}
                    onChange={(e) => setForm({ ...form, lwfEstablishmentId: e.target.value })}
                    placeholder="e.g. LWF/KA/2026/8989"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm LWF Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: INCOME TAX TDS */}
      {/* ========================================================================= */}
      {activeTab === "TDS" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT LAW */}
          <div className="bg-zinc-950 border border-blue-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-950 text-blue-400 rounded-lg border border-blue-800">
                  <FileText className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Government Mandated Law: Income Tax Act, 1961 (Section 192 TDS on Salary)
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database (FY 2026-27)</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Law
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Default New Regime (115BAC):</span>
                <strong className="text-emerald-400 text-xs">Standard Deduction ₹75,000</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Full rebate up to ₹7.75 Lakhs taxable</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Optional Old Tax Regime:</span>
                <strong className="text-blue-400 text-xs">Standard Deduction ₹50,000</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Allows 80C, 80D, HRA & Home Loan deductions</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Health & Education Cess:</span>
                <strong className="text-amber-400 text-xs">4.0% mandatory</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Calculated on gross income tax liability</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM TAN CONFIGURATION */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-blue-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm TAN & TDS Deductor Profile</h3>
                  <span className="text-[11px] text-zinc-400">Configure your company's Tax Deduction Account Number for Form 24Q quarterly returns</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Firm TAN Number (10 Alphanumeric) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.tdsTanNumber}
                    onChange={(e) => setForm({ ...form, tdsTanNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. BLRK12345F"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-blue-500 focus:outline-none uppercase"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Company PAN Number
                  </label>
                  <input
                    type="text"
                    value={form.tdsDeductorPan}
                    onChange={(e) => setForm({ ...form, tdsDeductorPan: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-blue-500 focus:outline-none uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Default Tax Regime for New Joiners
                  </label>
                  <select
                    value={form.tdsDefaultRegime}
                    onChange={(e) => setForm({ ...form, tdsDefaultRegime: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="NEW_REGIME_115BAC">New Tax Regime (Section 115BAC - Default)</option>
                    <option value="OLD_REGIME">Old Tax Regime (With Declarations)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm TDS Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: NPS */}
      {/* ========================================================================= */}
      {activeTab === "NPS" && (
        <div className="space-y-6">
          {/* SECTION 1: 🏛️ MASTER GOVERNMENT LAW */}
          <div className="bg-zinc-950 border border-teal-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-teal-950 text-teal-400 rounded-lg border border-teal-800">
                  <Scale className="size-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    Government Mandated Law: Corporate NPS (Section 80CCD(2) of IT Act)
                  </h3>
                  <span className="text-[11px] text-zinc-400">Maintained centrally in Master SaaS Compliance Database</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-teal-950 text-teal-300 border border-teal-800 rounded-lg font-mono font-bold flex items-center gap-1">
                <Lock className="size-3" /> Central Master Rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Maximum Tax-Free Contribution:</span>
                <strong className="text-teal-400 text-xs">Up to 10% of Basic Pay</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">(14% for Central Govt entities)</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Annual Tax Exemption Cap:</span>
                <strong className="text-zinc-200 text-xs">₹7,50,000 Combined</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">(Combined cap for EPF + NPS + Superannuation)</span>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Tax Regime Exemption:</span>
                <strong className="text-emerald-400 text-xs">100% Exempt in Both Regimes</strong>
                <span className="text-zinc-500 block text-[9px] font-sans">Available under both New & Old regimes</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: 🏢 FIRM POLICY */}
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-zinc-800 text-zinc-200 rounded-lg">
                  <Building className="size-4 text-teal-400" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">Firm Corporate NPS Scheme Settings</h3>
                  <span className="text-[11px] text-zinc-400">Configure your company's corporate NPS entity code and rate</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveFirmSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Firm Corporate NPS Scheme ID
                  </label>
                  <input
                    type="text"
                    value={form.npsCorporateSchemeId}
                    onChange={(e) => setForm({ ...form, npsCorporateSchemeId: e.target.value })}
                    placeholder="e.g. NPS/CORP/ACME/99"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-200">
                    Employer Contribution Rate (% of Basic)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={form.npsEmployerRate}
                    onChange={(e) => setForm({ ...form, npsEmployerRate: Number(e.target.value) || 10 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2"
                >
                  <Save className="size-4" />
                  Save Firm NPS Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
