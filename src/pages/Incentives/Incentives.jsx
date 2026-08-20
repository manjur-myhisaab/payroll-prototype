import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR, formatMonthName, STATUS_COLORS } from "../../utils/formatters";
import {
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Gift,
  Award,
  DollarSign,
} from "lucide-react";

const INCENTIVE_TYPES = [
  { value: "SALES_COMMISSION", label: "Sales Commission" },
  { value: "PERFORMANCE_BONUS", label: "Performance / KPI Bonus" },
  { value: "FESTIVAL_BONUS", label: "Festival / Statutory Bonus" },
  { value: "SPOT_AWARD", label: "Spot Recognition Award" },
  { value: "RETENTION_BONUS", label: "Retention Bonus" },
];

export default function Incentives() {
  const { showToast } = useToast();
  const [incentives, setIncentives] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    payrollPeriod: "2026-08",
    type: "SALES_COMMISSION",
    title: "",
    amount: 5000,
    reason: "",
    status: "APPROVED",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIncentives(storageService.getIncentives());
    setEmployees(storageService.getEmployees());
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      employeeId: employees[0]?.id || "",
      payrollPeriod: "2026-08",
      type: "SALES_COMMISSION",
      title: "",
      amount: 5000,
      reason: "",
      status: "APPROVED",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (inc) => {
    setEditingId(inc.id);
    setForm({ ...inc });
    setModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    storageService.updateIncentive(id, { status: newStatus });
    loadData();
    showToast(`Incentive marked as ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this incentive entry?")) {
      storageService.deleteIncentive(id);
      loadData();
      showToast("Incentive entry deleted");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.amount) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    if (editingId) {
      storageService.updateIncentive(editingId, payload);
      showToast("Incentive updated successfully");
    } else {
      storageService.createIncentive(payload);
      showToast("Incentive added successfully");
    }
    setModalOpen(false);
    loadData();
  };

  const empMap = new Map(employees.map((e) => [e.id, e]));

  const filtered = incentives.filter((inc) => {
    const emp = empMap.get(inc.employeeId);
    const matchSearch =
      (emp && emp.name.toLowerCase().includes(search.toLowerCase())) ||
      inc.title?.toLowerCase().includes(search.toLowerCase()) ||
      inc.reason?.toLowerCase().includes(search.toLowerCase()) ||
      inc.payrollPeriod.includes(search);
    const matchType = filterType === "ALL" || inc.type === filterType;
    const matchStatus = filterStatus === "ALL" || inc.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalApprovedIncentives = filtered
    .filter((i) => i.status === "APPROVED")
    .reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="size-5 text-indigo-400" />
            Incentives & Performance Bonuses
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage variable compensation, sales commissions, and one-off spot bonuses for monthly payroll inclusion.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Incentive / Bonus
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-zinc-400">Total Approved Bonuses & Incentives</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {formatINR(totalApprovedIncentives)}
          </div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-zinc-400">Approved Entries</div>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
            {incentives.filter((i) => i.status === "APPROVED").length} Approved
          </div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-zinc-400">Pending Approvals</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {incentives.filter((i) => i.status === "PENDING").length} Requests
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="ALL">All Types</option>
            {INCENTIVE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved Only</option>
            <option value="PENDING">Pending Only</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search employee, title, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Incentives Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Employee</th>
              <th className="p-4">Period</th>
              <th className="p-4">Incentive / Bonus Title</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4">Reason / Notes</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.map((inc) => {
              const emp = empMap.get(inc.employeeId);
              return (
                <tr key={inc.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-200">{emp?.name || inc.employeeId}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{inc.employeeId}</div>
                  </td>
                  <td className="p-4 font-semibold text-zinc-300">{formatMonthName(inc.payrollPeriod)}</td>
                  <td className="p-4 font-bold text-zinc-200">{inc.title || "Variable Bonus"}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {inc.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    {formatINR(inc.amount)}
                  </td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate">{inc.reason || "—"}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        STATUS_COLORS[inc.status] || STATUS_COLORS.PENDING
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {inc.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(inc.id, "APPROVED")}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                            title="Approve Incentive"
                          >
                            <CheckCircle2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(inc.id, "REJECTED")}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="size-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleOpenEdit(inc)}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(inc.id)}
                        className="p-1.5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-zinc-500 italic">
                  No incentives found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Incentive Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Incentive Entry" : "Add Incentive or Bonus"}
        description="Configure variable pay for an employee. Approved amounts will be credited in the selected payroll run."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Employee *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Incentive Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                {INCENTIVE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Payroll Period *</label>
              <input
                type="month"
                required
                value={form.payrollPeriod}
                onChange={(e) => setForm({ ...form, payrollPeriod: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Award / Bonus Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Q2 Deal Closer Bonus"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Amount (₹) *</label>
              <input
                type="number"
                required
                step="100"
                placeholder="e.g. 10000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: +e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Reason / Target Justification</label>
            <input
              type="text"
              placeholder="e.g. Exceeded quarterly enterprise sales target by 120%"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500"
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
              {editingId ? "Save Changes" : "Save Incentive"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
