import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { calculateSalaryBreakdown } from "../../utils/salaryCalculator";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR, formatDate, TYPE_COLORS } from "../../utils/formatters";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  Building,
  CreditCard,
  Layers,
} from "lucide-react";

export default function EmployeeSalaries() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [components, setComponents] = useState([]);
  const [settings, setSettings] = useState({});
  const [search, setSearch] = useState("");

  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [detailEmp, setDetailEmp] = useState(null);

  // Assignment Form state
  const [form, setForm] = useState({
    employeeId: "",
    templateId: "",
    annualCTC: 600000,
    tdsMonthly: 0,
    effectiveFrom: new Date().toISOString().split("T")[0],
    revisionReason: "Annual Performance Appraisal",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEmployees(storageService.getEmployees());
    setEmployeeSalaries(storageService.getEmployeeSalaries());
    setTemplates(storageService.getTemplates());
    setComponents(storageService.getComponents());
    setSettings(storageService.getSettings());
  };

  const handleOpenAssign = (emp = null) => {
    const selectedEmp = emp || employees[0];
    const activeSalary = selectedEmp
      ? storageService.getActiveSalaryForEmployee(selectedEmp.id)
      : null;

    setForm({
      employeeId: selectedEmp ? selectedEmp.id : employees[0]?.id || "",
      templateId: activeSalary ? activeSalary.templateId : templates[0]?.id || "",
      annualCTC: activeSalary ? activeSalary.annualCTC : 600000,
      tdsMonthly: activeSalary ? activeSalary.tdsMonthly || 0 : 0,
      effectiveFrom: new Date().toISOString().split("T")[0],
      revisionReason: activeSalary ? "Salary Hike / Structure Revision" : "Initial Salary Assignment",
    });
    setAssignModalOpen(true);
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.templateId || !form.annualCTC) {
      showToast("Please complete all required fields", "error");
      return;
    }

    storageService.assignSalaryStructure({
      employeeId: form.employeeId,
      templateId: form.templateId,
      annualCTC: Number(form.annualCTC),
      tdsMonthly: Number(form.tdsMonthly) || 0,
      effectiveFrom: form.effectiveFrom,
      revisionReason: form.revisionReason,
    });

    showToast("Salary structure assigned & new revision activated!");
    setAssignModalOpen(false);
    loadData();
  };

  // Filtered employees list
  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  const tplMap = new Map(templates.map((t) => [t.id, t]));

  // For Detail modal: get active salary and breakdown
  const activeDetailSalary = detailEmp
    ? storageService.getActiveSalaryForEmployee(detailEmp.id)
    : null;
  const detailTemplate = activeDetailSalary
    ? tplMap.get(activeDetailSalary.templateId) || templates[0]
    : null;
  const detailBreakdown =
    activeDetailSalary && detailTemplate
      ? calculateSalaryBreakdown({
          annualCTC: activeDetailSalary.annualCTC,
          template: detailTemplate,
          allComponents: components,
          customTDS: activeDetailSalary.tdsMonthly || 0,
          settings,
        })
      : null;

  // Detail history revisions
  const empHistory = detailEmp
    ? employeeSalaries
        .filter((s) => s.employeeId === detailEmp.id)
        .sort((a, b) => new Date(b.effectiveFrom) - new Date(a.effectiveFrom))
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Users className="size-5 text-indigo-400" />
            Employee Salaries & Structure Assignments
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Assign salary templates, set annual CTC, compute live breakdowns, and maintain immutable revision history.
          </p>
        </div>

        <button
          onClick={() => handleOpenAssign()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
        >
          <Plus className="size-4" />
          Assign / Revise Salary
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
        <div className="text-xs text-zinc-400 font-medium">
          Showing <strong className="text-zinc-200">{filtered.length}</strong> employees
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search employee, ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Employee</th>
              <th className="p-4">Department & Role</th>
              <th className="p-4">Assigned Template</th>
              <th className="p-4 text-right">Annual CTC</th>
              <th className="p-4 text-right">Monthly Gross</th>
              <th className="p-4 text-right">Est. Net Pay</th>
              <th className="p-4 text-center">Effective Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.map((emp) => {
              const activeSal = storageService.getActiveSalaryForEmployee(emp.id);
              const tpl = activeSal ? tplMap.get(activeSal.templateId) : null;
              const breakdown =
                activeSal && tpl
                  ? calculateSalaryBreakdown({
                      annualCTC: activeSal.annualCTC,
                      template: tpl,
                      allComponents: components,
                      customTDS: activeSal.tdsMonthly || 0,
                      settings,
                    })
                  : null;

              return (
                <tr key={emp.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-200">{emp.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{emp.id} • {emp.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-300 font-semibold">{emp.designation}</div>
                    <div className="text-[10px] text-zinc-500">{emp.department}</div>
                  </td>
                  <td className="p-4">
                    {tpl ? (
                      <span className="font-semibold text-zinc-300">{tpl.name}</span>
                    ) : (
                      <span className="text-amber-400 font-semibold italic text-[11px]">Not Assigned</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-zinc-200">
                    {activeSal ? formatINR(activeSal.annualCTC) : "—"}
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-emerald-400">
                    {breakdown ? formatINR(breakdown.totalGross) : "—"}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-indigo-400">
                    {breakdown ? formatINR(breakdown.netPay) : "—"}
                  </td>
                  <td className="p-4 text-center text-zinc-400">
                    {activeSal ? formatDate(activeSal.effectiveFrom) : "—"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setDetailEmp(emp)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold px-2.5"
                      >
                        <Eye className="size-3.5" /> View Breakdown
                      </button>
                      <button
                        onClick={() => handleOpenAssign(emp)}
                        className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold px-2.5"
                      >
                        <Edit3 className="size-3.5" /> Revise
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Salary Breakdown & History Drawer/Modal */}
      {detailEmp && (
        <Modal
          isOpen={!!detailEmp}
          onClose={() => setDetailEmp(null)}
          title={`Salary Structure: ${detailEmp.name}`}
          description={`${detailEmp.id} • ${detailEmp.designation} (${detailEmp.department}) • Joined ${formatDate(detailEmp.joiningDate)}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 text-xs">
            {/* Overview Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
              <div className="p-2">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Annual CTC</div>
                <div className="text-base font-black font-mono text-zinc-100 mt-0.5">
                  {activeDetailSalary ? formatINR(activeDetailSalary.annualCTC) : "—"}
                </div>
              </div>
              <div className="p-2">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Monthly CTC</div>
                <div className="text-base font-black font-mono text-purple-400 mt-0.5">
                  {detailBreakdown ? formatINR(detailBreakdown.monthlyCTC) : "—"}
                </div>
              </div>
              <div className="p-2">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Gross Pay / Mo</div>
                <div className="text-base font-black font-mono text-emerald-400 mt-0.5">
                  {detailBreakdown ? formatINR(detailBreakdown.totalGross) : "—"}
                </div>
              </div>
              <div className="p-2 bg-indigo-950/40 rounded-lg border border-indigo-900/40">
                <div className="text-[10px] text-indigo-300 uppercase font-semibold">Est. Net Take-Home</div>
                <div className="text-base font-black font-mono text-indigo-400 mt-0.5">
                  {detailBreakdown ? formatINR(detailBreakdown.netPay) : "—"}
                </div>
              </div>
            </div>

            {/* Breakdown Tables (Earnings vs Deductions vs Employer Cost) */}
            {detailBreakdown ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Earnings */}
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                      Gross Earnings
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatINR(detailBreakdown.totalGross)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {detailBreakdown.earnings.map((e) => (
                      <div key={e.id} className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400">{e.name}</span>
                        <span className="font-mono font-semibold text-zinc-200">{formatINR(e.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Employee Deductions */}
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px]">
                      Employee Deductions
                    </span>
                    <span className="font-mono font-bold text-rose-400">
                      {formatINR(detailBreakdown.totalDeductions)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {detailBreakdown.deductions.map((d) => (
                      <div key={d.id} className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400">{d.name}</span>
                        <span className="font-mono font-semibold text-zinc-200">{formatINR(d.amount)}</span>
                      </div>
                    ))}
                    {detailBreakdown.deductions.length === 0 && (
                      <div className="text-zinc-600 italic text-[11px]">No deductions</div>
                    )}
                  </div>
                </div>

                {/* 3. Employer Cost */}
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">
                      Employer Contributions
                    </span>
                    <span className="font-mono font-bold text-purple-400">
                      {formatINR(detailBreakdown.totalEmployerCost)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {detailBreakdown.employerContributions.map((ec) => (
                      <div key={ec.id} className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400">{ec.name}</span>
                        <span className="font-mono font-semibold text-zinc-200">{formatINR(ec.amount)}</span>
                      </div>
                    ))}
                    {detailBreakdown.employerContributions.length === 0 && (
                      <div className="text-zinc-600 italic text-[11px]">No employer cost components</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 italic bg-zinc-950/40 rounded-xl">
                No active salary template assigned to this employee.
              </div>
            )}

            {/* Salary History Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <History className="size-4 text-indigo-400" />
                Salary Revision History ({empHistory.length} Versions)
              </h4>

              <div className="space-y-2.5">
                {empHistory.map((rev, idx) => {
                  const isCurrent = rev.status === "ACTIVE" && !rev.effectiveTo;
                  const revTpl = tplMap.get(rev.templateId);
                  return (
                    <div
                      key={rev.id}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                        isCurrent
                          ? "bg-indigo-950/20 border-indigo-500/30"
                          : "bg-zinc-950/40 border-zinc-800/60 opacity-60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCurrent
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {isCurrent ? "Current Active" : `Version ${empHistory.length - idx}`}
                          </span>
                          <span className="font-bold text-zinc-200 font-mono">
                            {formatINR(rev.annualCTC)} / year
                          </span>
                          <span className="text-zinc-500 text-xs">•</span>
                          <span className="text-zinc-400 font-semibold">{revTpl?.name || rev.templateId}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                          Reason: {rev.revisionReason || "Standard compensation update"}
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-400 font-mono">
                        {formatDate(rev.effectiveFrom)} → {rev.effectiveTo ? formatDate(rev.effectiveTo) : "Present"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  const emp = detailEmp;
                  setDetailEmp(null);
                  handleOpenAssign(emp);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="size-3.5" />
                Add New Revision
              </button>
              <button
                type="button"
                onClick={() => setDetailEmp(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign / Revise Salary Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign / Revise Salary Structure"
        description="Select employee, template, and enter annual CTC. System automatically preserves previous revisions."
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Select Employee *</label>
            <select
              required
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id} - {emp.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Salary Template *</label>
            <select
              required
              value={form.templateId}
              onChange={(e) => setForm({ ...form, templateId: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Annual Cost to Company (CTC ₹) *</label>
              <input
                type="number"
                required
                step="1000"
                placeholder="e.g. 600000"
                value={form.annualCTC}
                onChange={(e) => setForm({ ...form, annualCTC: +e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
              <div className="text-[10px] text-zinc-500">
                Monthly CTC: <strong className="text-zinc-300 font-mono">{formatINR(form.annualCTC / 12)}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Monthly TDS Deduction (₹)</label>
              <input
                type="number"
                step="100"
                placeholder="e.g. 1500"
                value={form.tdsMonthly}
                onChange={(e) => setForm({ ...form, tdsMonthly: +e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Effective From Date *</label>
              <input
                type="date"
                required
                value={form.effectiveFrom}
                onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Revision Reason</label>
              <input
                type="text"
                placeholder="e.g. Annual Appraisal / Promotion"
                value={form.revisionReason}
                onChange={(e) => setForm({ ...form, revisionReason: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15"
            >
              Save & Activate Structure
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
