import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { ALL_STATUTORY_COMPONENTS_MASTER } from "../../data/seedData";
import { useToast } from "../../components/ui/Toast";
import { Modal, Badge } from "../../components/ui/Modal";
import { TYPE_COLORS, STATUS_COLORS } from "../../utils/formatters";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  ToggleLeft,
  ToggleRight,
  Info,
  CheckCircle2,
  Trash2,
  Layers,
  ChevronDown,
  Percent,
  Calculator,
  CheckSquare,
  Square,
  Calendar,
  Shield,
  Sparkles,
  Zap,
  Receipt,
} from "lucide-react";

const CALCULATION_METHODS = [
  { value: "FIXED", label: "Fixed Amount (₹)" },
  { value: "PERCENTAGE", label: "Percentage (%)" },
  { value: "BALANCE", label: "Balance / Residual Amount" },
  { value: "TAX_RULE", label: "Tax Rule" },
  { value: "STATUTORY_RULE", label: "Statutory Rule" },
];

const TAX_RULES = [
  { value: "TDS_PROJECTED", label: "Monthly Income Tax TDS (Projected Annual Liability)" },
  { value: "HRA_EXEMPTION", label: "Sec 10(13A) House Rent Allowance Exemption Rule" },
  { value: "STANDARD_DEDUCTION", label: "Statutory Standard Tax Deduction" },
];

const STATUTORY_RULES = [
  { value: "EPF_12", label: "EPFO Employee EPF (12% of PF Wage, Capped at ₹15,000 ceiling)" },
  { value: "ER_PF_12", label: "EPFO Employer Matching PF (12% of PF Wage)" },
  { value: "ESI_075", label: "ESIC Employee Contribution (0.75% of Gross when Gross ≤ ₹21,000)" },
  { value: "PT_STATE_SLAB", label: "State Professional Tax Slab (₹200 / month for Gross > ₹15,000)" },
  { value: "GRATUITY_481", label: "Statutory Gratuity Provision (4.81% of Basic / 15/26 Rule)" },
];

const EMPTY_FORM = {
  name: "",
  code: "",
  type: "EARNING",
  category: "FIXED",
  calculationMethod: "PERCENTAGE",
  value: 0,
  percentageBaseType: "CTC", // "CTC" or "COMPONENTS"
  baseComponentIds: ["COMP_BASIC"],
  taxRuleType: "TDS_PROJECTED",
  statutoryRuleType: "EPF_12",
  maxDeductionAmount: "",
  isProrated: true,
  recurring: true,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "ACTIVE",
  description: "",
};

export default function SalaryComponents() {
  const { showToast } = useToast();
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setComponents(storageService.getComponents());
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      effectiveFrom: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingId(comp.id);
    setForm({
      ...comp,
      maxDeductionAmount: comp.maxDeductionAmount || "",
      percentageBaseType: comp.percentageBaseType || (comp.basedOn === "BASIC" ? "COMPONENTS" : "CTC"),
      baseComponentIds: comp.baseComponentIds || (comp.basedOn === "BASIC" ? ["COMP_BASIC"] : []),
      isProrated: comp.isProrated !== false,
    });
    setModalOpen(true);
  };

  const handleDuplicate = (comp) => {
    const duplicated = {
      ...comp,
      name: `${comp.name} (Copy)`,
      code: `${comp.code}_COPY`,
      id: `COMP_${Date.now()}`,
    };
    storageService.createComponent(duplicated);
    loadData();
    showToast(`Component duplicated as ${duplicated.name}`);
  };

  const handleToggleStatus = (comp) => {
    const updatedStatus = comp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    storageService.updateComponent(comp.id, { status: updatedStatus });
    loadData();
    showToast(`Component ${comp.name} set to ${updatedStatus}`);
  };

  const handleDelete = (comp) => {
    const templates = storageService.getTemplates();
    const usingTemplates = templates.filter((t) =>
      (t.components || []).some((tc) => tc.componentId === comp.id)
    );

    if (usingTemplates.length > 0) {
      const names = usingTemplates.map((t) => t.name).join(", ");
      if (
        !window.confirm(
          `Warning: Component "${comp.name}" is currently used in ${usingTemplates.length} template(s): [${names}].\n\nDeleting it will remove it from those templates. Do you want to delete it?`
        )
      ) {
        return;
      }
      // Remove from referencing templates
      usingTemplates.forEach((t) => {
        const cleaned = (t.components || []).filter((tc) => tc.componentId !== comp.id);
        storageService.updateTemplate(t.id, { components: cleaned });
      });
    } else {
      if (!window.confirm(`Are you sure you want to delete component "${comp.name}"?`)) {
        return;
      }
    }

    storageService.deleteComponent(comp.id);
    loadData();
    showToast(`Component "${comp.name}" deleted successfully`);
  };

  const toggleBaseComponent = (compId) => {
    const current = form.baseComponentIds || [];
    if (current.includes(compId)) {
      setForm({
        ...form,
        baseComponentIds: current.filter((id) => id !== compId),
      });
    } else {
      setForm({
        ...form,
        baseComponentIds: [...current, compId],
      });
    }
  };

  const handleSelectStatutoryPreset = (presetId) => {
    if (!presetId) return;
    const preset = ALL_STATUTORY_COMPONENTS_MASTER.find((s) => s.id === presetId);
    if (!preset) return;

    setForm((prev) => ({
      ...prev,
      name: preset.name,
      code: preset.code,
      type: preset.type,
      calculationMethod: preset.calculationMethod,
      value: preset.value !== undefined ? preset.value : 0,
      percentageBaseType: preset.percentageBaseType || "COMPONENTS",
      baseComponentIds: preset.baseComponentIds || ["COMP_BASIC"],
      maxDeductionAmount: preset.wageCeiling || prev.maxDeductionAmount || "",
      isProrated: preset.isProrated !== false,
      recurring: preset.recurring !== false,
      taxRuleType: preset.taxRuleType || "TDS_PROJECTED",
      description: preset.description || prev.description,
    }));

    showToast(`Loaded statutory standard preset: ${preset.name} (${preset.authority.split(" ")[0]})`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      showToast("Please enter component name and unique code", "error");
      return;
    }

    if (
      form.calculationMethod === "PERCENTAGE" &&
      form.percentageBaseType === "COMPONENTS" &&
      (!form.baseComponentIds || form.baseComponentIds.length === 0)
    ) {
      showToast("Please select at least one base component for percentage calculation", "error");
      return;
    }

    const payload = {
      ...form,
      basedOn:
        form.calculationMethod === "PERCENTAGE"
          ? form.percentageBaseType === "CTC"
            ? "MONTHLY_CTC"
            : "COMPONENTS"
          : null,
    };

    if (editingId) {
      storageService.updateComponent(editingId, payload);
      showToast("Salary component updated successfully");
    } else {
      storageService.createComponent({
        ...payload,
        id: `COMP_${form.code.toUpperCase().replace(/\s+/g, "_")}`,
        code: form.code.toUpperCase().replace(/\s+/g, "_"),
      });
      showToast("Salary component created successfully");
    }
    setModalOpen(false);
    loadData();
  };

  // List of all earning components eligible to be base components
  const availableBaseEarnings = components.filter(
    (c) => c.type === "EARNING" && c.id !== editingId && c.calculationMethod !== "BALANCE"
  );

  // Helper to format formula display
  const getFormulaDisplay = (comp) => {
    if (comp.calculationMethod === "FIXED") {
      return `Fixed ₹${Number(comp.value).toLocaleString("en-IN")}`;
    }
    if (comp.calculationMethod === "BALANCE") {
      return "Residual CTC Balance";
    }
    if (comp.calculationMethod === "PERCENTAGE") {
      if (comp.percentageBaseType === "COMPONENTS" || comp.basedOn === "BASIC") {
        const baseIds = comp.baseComponentIds?.length ? comp.baseComponentIds : ["COMP_BASIC"];
        const names = baseIds
          .map((id) => components.find((c) => c.id === id)?.name || id)
          .join(" + ");
        return `${comp.value}% of (${names || "Basic"})`;
      }
      return `${comp.value}% of Monthly CTC`;
    }
    if (comp.calculationMethod === "TAX_RULE") {
      const match = TAX_RULES.find((t) => t.value === comp.taxRuleType);
      return `Tax Rule: ${match ? match.label.split(" (")[0] : comp.taxRuleType || "TDS"}`;
    }
    if (comp.calculationMethod === "STATUTORY_RULE") {
      const match = STATUTORY_RULES.find((s) => s.value === comp.statutoryRuleType);
      return `Statutory Rule: ${match ? match.label.split(" (")[0] : comp.statutoryRuleType || "Statutory"}`;
    }
    return "Custom";
  };

  // Filtered components
  const filtered = components.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || c.type === filterType;
    const matchStatus = filterStatus === "ALL" || c.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="size-5 text-indigo-400" />
            Salary Components Master
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure flexible earnings, deductions, proration rules, and multi-component percentage formulas.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
        >
          <Plus className="size-4" />
          Create Component
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="ALL">All Categories / Types</option>
            <option value="EARNING">Earnings Only</option>
            <option value="DEDUCTION">Deductions Only</option>
            <option value="EMPLOYER_CONTRIBUTION">Employer Contributions</option>
            <option value="REIMBURSEMENT">Reimbursements (FBP Claims)</option>
            <option value="BENEFIT">Benefits Only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Components Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Name & Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Formula & Calculation Rule</th>
              <th className="p-4 text-center">Value</th>
              <th className="p-4 text-center">Proration (LOP)</th>
              <th className="p-4 text-center">Recurring</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.map((comp) => (
              <React.Fragment key={comp.id}>
                <tr
                  className={`hover:bg-zinc-800/20 transition-colors ${comp.status === "INACTIVE" ? "opacity-50" : ""
                    }`}
                >
                  <td className="p-4">
                    <div className="font-bold text-zinc-200">{comp.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-zinc-500 font-semibold">{comp.code}</span>
                      {comp.description && (
                        <button
                          onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                          className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                        >
                          {expandedId === comp.id ? "less" : "info"}
                          <ChevronDown
                            className={`size-2.5 transition-transform ${expandedId === comp.id ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${TYPE_COLORS[comp.type] || TYPE_COLORS.EARNING
                        }`}
                    >
                      {comp.type === "EMPLOYER_CONTRIBUTION" ? "EMPLOYER COST" : comp.type}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-300">
                    <div className="font-semibold text-zinc-200">{getFormulaDisplay(comp)}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Method: {comp.calculationMethod}</div>
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-zinc-200">
                    {comp.calculationMethod === "PERCENTAGE"
                      ? `${comp.value}%`
                      : comp.calculationMethod === "FIXED"
                        ? `₹${Number(comp.value).toLocaleString("en-IN")}`
                        : "Balance"}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${comp.isProrated !== false
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                    >
                      {comp.isProrated !== false ? "Prorated" : "Non-Prorated"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${comp.recurring !== false
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                    >
                      {comp.recurring !== false ? "Recurring" : "One-time / Variable"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(comp)}
                      title={comp.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      className="inline-flex items-center justify-center transition-transform hover:scale-110"
                    >
                      {comp.status === "ACTIVE" ? (
                        <ToggleRight className="size-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="size-5 text-zinc-600" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(comp)}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors"
                        title="Edit Component"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(comp)}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(comp)}
                        className="p-1.5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete Component"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Description Details */}
                {expandedId === comp.id && (
                  <tr className="bg-zinc-950/40 border-b border-zinc-800/60">
                    <td colSpan={8} className="p-4 text-xs text-zinc-400 leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <Info className="size-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-zinc-300">Statutory / Business Rule: </span>
                          {comp.description || "No description provided."}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-zinc-500 italic">
                  No salary components matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Salary Component Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Salary Component" : "Create Master Salary Component"}
        description="Configure component rules, proration setting, and flexible percentage base."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Component Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. House Rent Allowance"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Component Code *</label>
              <input
                type="text"
                required
                disabled={!!editingId}
                placeholder="e.g. HRA"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-mono uppercase font-bold disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Type / Category *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="EARNING">Earning (Adds to Gross Salary)</option>
                <option value="DEDUCTION">Deduction (Deducted from Net Pay)</option>
                <option value="EMPLOYER_CONTRIBUTION">Employer Contribution (Part of CTC only)</option>
                <option value="REIMBURSEMENT">Reimbursement (Tax-Exempt FBP / Claims)</option>
                <option value="BENEFIT">Benefit (Insurance/Perk)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Calculation Method *</label>
              <select
                value={form.calculationMethod}
                onChange={(e) => setForm({ ...form, calculationMethod: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applicable Statutory Component Preset Selector */}
          {(form.type === "DEDUCTION" || form.type === "EMPLOYER_CONTRIBUTION") && (
            <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                  <Shield className="size-3.5 text-indigo-400" />
                  <span>Applicable Indian Statutory Component (Auto-Fill Preset)</span>
                </label>
                <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {form.type === "DEDUCTION" ? "Employee Deductions" : "Employer Liabilities"}
                </span>
              </div>

              <select
                defaultValue=""
                onChange={(e) => handleSelectStatutoryPreset(e.target.value)}
                className="w-full bg-zinc-950 border border-indigo-500/40 rounded-xl p-2.5 text-xs text-zinc-200 outline-none focus:border-indigo-400 font-semibold"
              >
                <option value="">-- Quick Select an Applicable Statutory Component --</option>
                {ALL_STATUTORY_COMPONENTS_MASTER.filter((s) => s.type === form.type).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} • {item.authority.split(" ")[0]} ({item.calculationMethod === "PERCENTAGE" ? `${item.value}%` : "Rule Based"})
                  </option>
                ))}
              </select>

              <p className="text-[11px] text-zinc-400">
                Selecting a statutory preset automatically loads verified rates, wage bases, and legal descriptions.
              </p>
            </div>
          )}

          {/* Reimbursement Configuration Card (Appears only for Reimbursements) */}
          {form.type === "REIMBURSEMENT" && (
            <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-3 animate-in fade-in text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Receipt className="size-4 text-cyan-400" />
                  Flexible Benefit Plan (FBP) / Expense Claim Rules
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Tax-Exempt against bills
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Max Monthly Entitlement (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4000"
                    value={form.maxClaimLimit || form.value || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        value: +e.target.value,
                        maxClaimLimit: +e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 font-mono font-bold text-zinc-200 outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Bill Proof Requirement</label>
                  <select
                    value={form.requiresProof !== false ? "YES" : "NO"}
                    onChange={(e) =>
                      setForm({ ...form, requiresProof: e.target.value === "YES" })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 outline-none focus:border-cyan-400 font-semibold"
                  >
                    <option value="YES">Mandatory Bill Proof Upload</option>
                    <option value="NO">Self-Declaration / Voucher</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Reimbursements are paid out non-taxable on the payslip once employee claims and invoice proofs are approved by HR.
              </p>
            </div>
          )}

          {/* Optional Maximum Deduction Cap Field (Appears only for Deductions) */}
          {form.type === "DEDUCTION" && (
            <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5 animate-in fade-in">
              <label className="font-semibold text-zinc-300 flex items-center justify-between">
                <span>Maximum Deduction Amount (₹ / month)</span>
                <span className="text-[10px] text-zinc-500 font-normal bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                  Optional / Non-mandatory
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 2500 (Leave empty for uncapped deduction)"
                  value={form.maxDeductionAmount || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxDeductionAmount: e.target.value ? +e.target.value : "",
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 pl-8 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                If specified, the calculated deduction in any monthly run will not exceed this upper cap.
              </p>
            </div>
          )}

          {/* Conditional Calculation fields */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 space-y-4">
            {form.calculationMethod === "PERCENTAGE" && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-300">Percentage Value (%) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 40"
                        value={form.value}
                        onChange={(e) => setForm({ ...form, value: +e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 pr-8 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-3 top-2.5 text-zinc-500 font-bold">%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-300">Percentage Calculation Base *</label>
                    <select
                      value={form.percentageBaseType || "CTC"}
                      onChange={(e) => setForm({ ...form, percentageBaseType: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
                    >
                      <option value="CTC">% of Monthly CTC (Default)</option>
                      <option value="COMPONENTS">% of Another Component(s)</option>
                    </select>
                  </div>
                </div>

                {/* When % of Another Component(s) is selected: Show Multi-select Earning Components */}
                {form.percentageBaseType === "COMPONENTS" && (
                  <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-700/80 space-y-2.5 animate-in fade-in">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-200 flex items-center gap-1.5 text-xs">
                        <CheckSquare className="size-3.5 text-indigo-400" />
                        Select Base Components (Multi-select) *
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {form.baseComponentIds?.length || 0} component(s) selected
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-snug">
                      Formula will calculate {form.value}% of the combined sum of the selected components:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                      {availableBaseEarnings.map((c) => {
                        const isChecked = (form.baseComponentIds || []).includes(c.id);
                        return (
                          <label
                            key={c.id}
                            onClick={() => toggleBaseComponent(c.id)}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer select-none transition-all ${isChecked
                                ? "bg-indigo-950/60 border-indigo-500 text-indigo-200 font-semibold"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => { }}
                              className="size-3.5 accent-indigo-600 rounded cursor-pointer"
                            />
                            <div className="text-xs truncate">
                              <span className="text-zinc-200">{c.name}</span>
                              <span className="font-mono text-[10px] text-zinc-500 ml-1.5">({c.code})</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Formula Live Preview Banner */}
                    <div className="p-2.5 bg-indigo-950/30 border border-indigo-800/40 rounded-lg text-[11px] text-indigo-300 font-mono flex items-center gap-2">
                      <Calculator className="size-3.5 text-indigo-400 shrink-0" />
                      <span>
                        Formula: {form.value}% of (
                        {form.baseComponentIds?.length > 0
                          ? form.baseComponentIds
                            .map((id) => components.find((c) => c.id === id)?.name || id)
                            .join(" + ")
                          : "Please select components above"}
                        )
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {form.calculationMethod === "FIXED" && (
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Fixed Amount (₹ / month) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: +e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {form.calculationMethod === "BALANCE" && (
              <div className="text-zinc-400 text-xs leading-relaxed">
                <p className="font-semibold text-indigo-400">Residual Balance Calculation:</p>
                <p className="mt-0.5">
                  Formula: Monthly CTC − Sum(All Other Earnings + Employer Contributions).
                  Automatically balances CTC without rounding errors.
                </p>
              </div>
            )}

            {form.calculationMethod === "TAX_RULE" && (
              <div className="space-y-2.5 animate-in fade-in">
                <label className="font-semibold text-zinc-300 block">Select Income Tax Rule *</label>
                <select
                  value={form.taxRuleType || "TDS_PROJECTED"}
                  onChange={(e) => setForm({ ...form, taxRuleType: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
                >
                  {TAX_RULES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Evaluated per Income Tax Act rules, statutory tax brackets, and employee tax declarations (Section 80C, 80D, etc.).
                </p>
              </div>
            )}

            {form.calculationMethod === "STATUTORY_RULE" && (
              <div className="space-y-2.5 animate-in fade-in">
                <label className="font-semibold text-zinc-300 block">Select Statutory Compliance Rule *</label>
                <select
                  value={form.statutoryRuleType || "EPF_12"}
                  onChange={(e) => setForm({ ...form, statutoryRuleType: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
                >
                  {STATUTORY_RULES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Automatically adheres to government statutory rates (EPFO wage ceiling ₹15,000, ESIC ₹21,000 threshold, or state-specific PT slabs).
                </p>
              </div>
            )}
          </div>

          {/* Proration Calculation & Recurring Monthly Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 flex items-center justify-between">
                <span>Proration Calculation *</span>
                <span className="text-[10px] text-zinc-500">Attendance / LOP</span>
              </label>
              <select
                value={form.isProrated ? "true" : "false"}
                onChange={(e) => setForm({ ...form, isProrated: e.target.value === "true" })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="true">Yes — Prorated (Attendance / LOP will deduct)</option>
                <option value="false">No — Non-Prorated (Full flat payout)</option>
              </select>
              <p className="text-[10px] text-zinc-500">
                {form.isProrated
                  ? "Prorated based on actual payable days."
                  : "Paid in full without attendance loss."}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 flex items-center justify-between">
                <span>Recurring Component *</span>
                <span className="text-[10px] text-zinc-500">Monthly Frequency</span>
              </label>
              <select
                value={form.recurring ? "true" : "false"}
                onChange={(e) => setForm({ ...form, recurring: e.target.value === "true" })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="true">Yes — Recurring (Included in every monthly run)</option>
                <option value="false">No — Variable / One-time (Ad-hoc or conditional payout)</option>
              </select>
              <p className="text-[10px] text-zinc-500">
                {form.recurring
                  ? "Automatically part of every standard monthly payroll run."
                  : "Treated as variable compensation or spot component."}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Statutory / Business Rule Description</label>
            <textarea
              rows={2}
              placeholder="e.g. House Rent Allowance exempt under Sec 10(13A)..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15"
            >
              {editingId ? "Save Changes" : "Create Component"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
