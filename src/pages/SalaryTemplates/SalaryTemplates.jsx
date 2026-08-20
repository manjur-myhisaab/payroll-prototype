import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { calculateSalaryBreakdown } from "../../utils/salaryCalculator";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR, TYPE_COLORS } from "../../utils/formatters";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Search,
  Eye,
  GripVertical,
  Check,
} from "lucide-react";

const PREVIEW_CTC = 600000;

export default function SalaryTemplates({ onNavigate }) {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [components, setComponents] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const [settings, setSettings] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    salaryBasis: "CTC_BASED",
    components: [],
  });

  const [previewOpen, setPreviewOpen] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTemplates(storageService.getTemplates());
    setComponents(storageService.getComponents());
    setEmployeeSalaries(storageService.getEmployeeSalaries());
    setSettings(storageService.getSettings());
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      code: `TPL_${Date.now().toString().slice(-4)}`,
      description: "",
      salaryBasis: "CTC_BASED",
      components: [
        { componentId: "COMP_BASIC", calculationMethod: "PERCENTAGE", value: 50, basedOn: "MONTHLY_CTC", priority: 1 },
        { componentId: "COMP_HRA", calculationMethod: "PERCENTAGE", value: 40, basedOn: "BASIC", priority: 2 },
        { componentId: "COMP_SPECIAL", calculationMethod: "BALANCE", value: 0, basedOn: "CTC_REMAINDER", priority: 3 },
        { componentId: "COMP_EPF", calculationMethod: "PERCENTAGE", value: 12, basedOn: "PF_WAGE", priority: 4 },
        { componentId: "COMP_PT", calculationMethod: "RULE", value: 200, basedOn: "STATE_SLAB", priority: 5 },
        { componentId: "COMP_ER_PF", calculationMethod: "PERCENTAGE", value: 12, basedOn: "PF_WAGE", priority: 6 },
        { componentId: "COMP_GRATUITY", calculationMethod: "PERCENTAGE", value: 4.81, basedOn: "BASIC", priority: 7 },
      ],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (tpl) => {
    setEditingId(tpl.id);
    setForm({
      ...tpl,
      components: [...(tpl.components || [])],
    });
    setModalOpen(true);
  };

  const handleDelete = (tpl) => {
    storageService.deleteTemplate(tpl.id);
    loadData();
    showToast(`Template "${tpl.name}" deleted successfully`);
  };

  // Component toggle in modal
  const isComponentSelected = (compId) => {
    return form.components.some((c) => c.componentId === compId);
  };

  const toggleComponent = (comp) => {
    if (isComponentSelected(comp.id)) {
      setForm({
        ...form,
        components: form.components.filter((c) => c.componentId !== comp.id),
      });
    } else {
      setForm({
        ...form,
        components: [
          ...form.components,
          {
            componentId: comp.id,
            calculationMethod: comp.calculationMethod,
            value: comp.value,
            basedOn: comp.basedOn,
            priority: form.components.length + 1,
          },
        ],
      });
    }
  };

  const updateComponentValue = (compId, key, val) => {
    setForm({
      ...form,
      components: form.components.map((c) => (c.componentId === compId ? { ...c, [key]: val } : c)),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      showToast("Please enter template name", "error");
      return;
    }
    if (form.components.length === 0) {
      showToast("Please include at least one salary component", "error");
      return;
    }

    if (editingId) {
      storageService.updateTemplate(editingId, form);
      showToast("Salary template updated successfully");
    } else {
      storageService.createTemplate({
        ...form,
        id: form.code ? `TPL_${form.code.toUpperCase()}` : `TPL_${Date.now()}`,
        status: "ACTIVE",
        effectiveFrom: new Date().toISOString().split("T")[0],
      });
      showToast("Salary template created successfully");
    }
    setModalOpen(false);
    loadData();
  };

  // Live breakdown calculation for preview
  const previewBreakdown = calculateSalaryBreakdown({
    annualCTC: PREVIEW_CTC,
    template: form,
    allComponents: components,
    settings,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Layers className="size-5 text-indigo-400" />
            Salary Templates & Structures
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Collections of component rules forming reusable compensation packages for roles and departments.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
        >
          <Plus className="size-4" />
          Create Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const breakdown = calculateSalaryBreakdown({
            annualCTC: PREVIEW_CTC,
            template: tpl,
            allComponents: components,
            settings,
          });

          const activeCount = employeeSalaries.filter(
            (s) => s.templateId === tpl.id && s.status === "ACTIVE"
          ).length;

          return (
            <div
              key={tpl.id}
              className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-lg space-y-5"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-zinc-100">{tpl.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {tpl.description || "Custom salary compensation rule template."}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold">
                    {tpl.code || tpl.id}
                  </span>
                </div>

                {/* Component Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(tpl.components || []).map((tc) => {
                    const comp = components.find((c) => c.id === tc.componentId);
                    if (!comp) return null;
                    return (
                      <span
                        key={tc.componentId}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          TYPE_COLORS[comp.type] || TYPE_COLORS.EARNING
                        }`}
                      >
                        {comp.name} ({tc.calculationMethod === "PERCENTAGE" ? `${tc.value}%` : tc.calculationMethod === "BALANCE" ? "Balance" : tc.calculationMethod === "TAX_RULE" ? "Tax Rule" : tc.calculationMethod === "STATUTORY_RULE" ? "Statutory" : `₹${tc.value}`})
                      </span>
                    );
                  })}
                </div>

                {/* Example Breakdown Snapshot (at ₹6,00,000 CTC) */}
                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60 space-y-2 text-xs">
                  <div className="flex justify-between text-[11px] text-zinc-500 font-semibold uppercase tracking-wider pb-1 border-b border-zinc-800">
                    <span>Illustrative Snapshot</span>
                    <span>₹6,00,000 CTC</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-400">Gross Salary:</span>
                    <span className="font-mono font-semibold text-emerald-400">{formatINR(breakdown.totalGross)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-400">Employer Cost:</span>
                    <span className="font-mono font-semibold text-purple-400">{formatINR(breakdown.totalEmployerCost)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-400">Employee Deductions:</span>
                    <span className="font-mono font-semibold text-rose-400">{formatINR(breakdown.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-indigo-400 pt-1 border-t border-zinc-800">
                    <span>Est. Net Take-Home:</span>
                    <span className="font-mono">{formatINR(breakdown.netPay)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                <span className="text-[11px] text-zinc-500 font-medium">
                  Assigned to <strong className="text-zinc-300">{activeCount}</strong> employees
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(tpl)}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors"
                    title="Edit Template Rules"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tpl)}
                    className="p-1.5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                    title="Delete Template"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Builder Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? `Edit Template: ${form.name}` : "Create Salary Template"}
        description="Select salary components, configure calculation rules, and preview the live CTC breakdown."
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Top Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-zinc-300">Template Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Developer Standard"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Template Code</label>
              <input
                type="text"
                placeholder="e.g. DEV_STD"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-mono uppercase font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Description</label>
            <input
              type="text"
              placeholder="e.g. Standard structure for engineering staff with PF & HRA"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Component Selection & Configuration Box */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
                Included Salary Components ({form.components.length})
              </h4>
              <span className="text-[11px] text-zinc-500">Pick from component library below</span>
            </div>

            {/* Component Picker Categorized by Earning, Deduction, Employer Contribution, Reimbursement */}
            <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
              {[
                {
                  type: "EARNING",
                  title: "1. Earnings (Adds to Gross Salary)",
                  badge: "Gross Earnings",
                  badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  filter: (c) => c.type === "EARNING",
                },
                {
                  type: "DEDUCTION",
                  title: "2. Deductions (Deducted from Net Pay)",
                  badge: "Employee Deductions",
                  badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                  filter: (c) => c.type === "DEDUCTION",
                },
                {
                  type: "EMPLOYER_CONTRIBUTION",
                  title: "3. Employer Contributions (Part of CTC Cost)",
                  badge: "Employer Liabilities",
                  badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                  filter: (c) => c.type === "EMPLOYER_CONTRIBUTION",
                },
                {
                  type: "REIMBURSEMENT",
                  title: "4. Reimbursements & FBP (Non-Taxable Claims)",
                  badge: "Tax-Exempt Claims",
                  badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                  filter: (c) => c.type === "REIMBURSEMENT" || c.type === "BENEFIT",
                },
              ].map((category) => {
                const categoryComponents = components.filter(category.filter);
                if (categoryComponents.length === 0) return null;

                const selectedCount = categoryComponents.filter((c) => isComponentSelected(c.id)).length;

                return (
                  <div key={category.type} className="space-y-2 pt-2 first:pt-0">
                    <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5">
                      <span className="font-bold text-xs text-zinc-200 flex items-center gap-2">
                        {category.title}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${category.badgeClass}`}>
                          {selectedCount} / {categoryComponents.length} selected
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categoryComponents.map((comp) => {
                        const selected = isComponentSelected(comp.id);
                        return (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => toggleComponent(comp)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-2 ${
                              selected
                                ? "bg-indigo-600/15 border-indigo-500 text-zinc-100 shadow-sm"
                                : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-bold truncate text-zinc-200 flex items-center gap-1.5">
                                <span className={selected ? "text-indigo-300" : "text-zinc-300"}>
                                  {comp.name}
                                </span>
                              </div>
                              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                                {comp.code} • {comp.calculationMethod === "PERCENTAGE" ? `${comp.value}%` : comp.calculationMethod}
                              </div>
                            </div>

                            <span
                              className={`size-4 rounded-md flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                                selected
                                  ? "bg-indigo-600 border-indigo-500 text-white"
                                  : "border-zinc-700 bg-zinc-800/40 text-transparent"
                              }`}
                            >
                              <Check className="size-3" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Components Table with Value Overrides */}
            <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase text-[10px]">
                    <th className="p-3">Component</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Calculation Method</th>
                    <th className="p-3">Value / Rate</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {form.components.map((tc) => {
                    const comp = components.find((c) => c.id === tc.componentId);
                    if (!comp) return null;
                    return (
                      <tr key={tc.componentId} className="hover:bg-zinc-900/40">
                        <td className="p-3 font-semibold text-zinc-200">
                          {comp.name}
                          <span className="font-mono text-[10px] text-zinc-500 ml-2">({comp.code})</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              TYPE_COLORS[comp.type] || TYPE_COLORS.EARNING
                            }`}
                          >
                            {comp.type === "EMPLOYER_CONTRIBUTION" ? "EMPLOYER COST" : comp.type}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-400">
                          {tc.calculationMethod} {tc.basedOn && `(${tc.basedOn})`}
                        </td>
                        <td className="p-3">
                          {tc.calculationMethod === "BALANCE" ? (
                            <span className="text-indigo-400 font-semibold text-xs">Auto Residual Balance</span>
                          ) : tc.calculationMethod === "TAX_RULE" ? (
                            <span className="text-amber-400 font-semibold text-xs">Tax Compliance Rule</span>
                          ) : tc.calculationMethod === "STATUTORY_RULE" ? (
                            <span className="text-purple-400 font-semibold text-xs">Statutory Rate Rule</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="0.01"
                                value={tc.value}
                                onChange={(e) =>
                                  updateComponentValue(tc.componentId, "value", +e.target.value)
                                }
                                className="w-20 bg-zinc-900 border border-zinc-700 rounded-lg p-1.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500 text-right"
                              />
                              <span className="text-zinc-500 font-mono">
                                {tc.calculationMethod === "PERCENTAGE" ? "%" : "₹"}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleComponent(comp)}
                            className="p-1 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-300">
                Live Salary Calculation Preview (at ₹6,00,000 Annual CTC)
              </span>
              <span
                className={`text-[11px] font-bold flex items-center gap-1 ${
                  previewBreakdown.isWageCodeCompliant ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {previewBreakdown.isWageCodeCompliant ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <AlertTriangle className="size-3.5" />
                )}
                Basic Ratio: {Math.round(previewBreakdown.wageCodeRatio * 100)}% of CTC
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Monthly Gross</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                  {formatINR(previewBreakdown.totalGross)}
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Employer Cost</div>
                <div className="text-sm font-bold font-mono text-purple-400 mt-0.5">
                  {formatINR(previewBreakdown.totalEmployerCost)}
                </div>
              </div>

              <div className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800/60">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Employee Deductions</div>
                <div className="text-sm font-bold font-mono text-rose-400 mt-0.5">
                  {formatINR(previewBreakdown.totalDeductions)}
                </div>
              </div>

              <div className="p-2.5 bg-indigo-950/40 rounded-lg border border-indigo-900/50">
                <div className="text-[10px] text-indigo-300 uppercase font-semibold">Est. Net Take-Home</div>
                <div className="text-sm font-bold font-mono text-indigo-400 mt-0.5">
                  {formatINR(previewBreakdown.netPay)}
                </div>
              </div>
            </div>
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
              {editingId ? "Save Template" : "Create Template"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
