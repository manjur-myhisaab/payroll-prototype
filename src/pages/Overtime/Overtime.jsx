import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR, formatDate, formatMonthName, STATUS_COLORS } from "../../utils/formatters";
import {
  Clock,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function Overtime() {
  const { showToast } = useToast();
  const [overtimes, setOvertimes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    payrollPeriod: "2026-08",
    date: new Date().toISOString().split("T")[0],
    hours: 4,
    ratePerHour: 300,
    amount: 1200,
    reason: "",
    status: "PENDING",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setOvertimes(storageService.getOvertime());
    setEmployees(storageService.getEmployees());
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      employeeId: employees[0]?.id || "",
      payrollPeriod: "2026-08",
      date: new Date().toISOString().split("T")[0],
      hours: 4,
      ratePerHour: 300,
      amount: 1200,
      reason: "",
      status: "APPROVED",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ot) => {
    setEditingId(ot.id);
    setForm({ ...ot });
    setModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    storageService.updateOvertime(id, { status: newStatus });
    loadData();
    showToast(`Overtime marked as ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this overtime entry?")) {
      storageService.deleteOvertime(id);
      loadData();
      showToast("Overtime entry deleted");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.hours || !form.ratePerHour) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const calculatedAmount = Math.round(Number(form.hours) * Number(form.ratePerHour));
    const payload = {
      ...form,
      hours: Number(form.hours),
      ratePerHour: Number(form.ratePerHour),
      amount: calculatedAmount,
    };

    if (editingId) {
      storageService.updateOvertime(editingId, payload);
      showToast("Overtime entry updated successfully");
    } else {
      storageService.createOvertime(payload);
      showToast("Overtime entry logged successfully");
    }
    setModalOpen(false);
    loadData();
  };

  const empMap = new Map(employees.map((e) => [e.id, e]));

  const filtered = overtimes.filter((o) => {
    const emp = empMap.get(o.employeeId);
    const matchSearch =
      (emp && emp.name.toLowerCase().includes(search.toLowerCase())) ||
      o.reason?.toLowerCase().includes(search.toLowerCase()) ||
      o.payrollPeriod.includes(search);
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalOTAmount = filtered
    .filter((o) => o.status === "APPROVED")
    .reduce((s, o) => s + (o.amount || 0), 0);

  const totalOTHours = filtered
    .filter((o) => o.status === "APPROVED")
    .reduce((s, o) => s + (o.hours || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Clock className="size-5 text-indigo-400" />
            Overtime Pay Ledger
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track and approve employee overtime hours to automatically flow into monthly payroll disbursements.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
        >
          <Plus className="size-4" />
          Log Overtime
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-zinc-400">Approved OT Total Amount</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{formatINR(totalOTAmount)}</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-zinc-400">Approved OT Hours</div>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{totalOTHours} Hours</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-zinc-400">Pending Approvals</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {overtimes.filter((o) => o.status === "PENDING").length} Requests
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
        <div className="flex items-center gap-2">
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
            placeholder="Search employee or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Overtime Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Employee</th>
              <th className="p-4">Payroll Period</th>
              <th className="p-4">OT Date</th>
              <th className="p-4 text-center">Hours</th>
              <th className="p-4 text-right">Hourly Rate</th>
              <th className="p-4 text-right">Calculated Total</th>
              <th className="p-4">Reason / Notes</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.map((ot) => {
              const emp = empMap.get(ot.employeeId);
              return (
                <tr key={ot.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-200">{emp?.name || ot.employeeId}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{ot.employeeId}</div>
                  </td>
                  <td className="p-4 font-semibold text-zinc-300">{formatMonthName(ot.payrollPeriod)}</td>
                  <td className="p-4 text-zinc-400">{formatDate(ot.date)}</td>
                  <td className="p-4 text-center font-bold font-mono text-zinc-200">{ot.hours} hrs</td>
                  <td className="p-4 text-right font-mono text-zinc-400">{formatINR(ot.ratePerHour)}/hr</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">{formatINR(ot.amount)}</td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate">{ot.reason || "—"}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        STATUS_COLORS[ot.status] || STATUS_COLORS.PENDING
                      }`}
                    >
                      {ot.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {ot.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(ot.id, "APPROVED")}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                            title="Approve Overtime"
                          >
                            <CheckCircle2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(ot.id, "REJECTED")}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="size-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleOpenEdit(ot)}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ot.id)}
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
                <td colSpan={9} className="p-10 text-center text-zinc-500 italic">
                  No overtime entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Log Overtime Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Overtime Entry" : "Log Employee Overtime"}
        description="Enter hours and hourly rate. Approved overtime is automatically added to the period payroll run."
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
                  {emp.name} ({emp.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Payroll Month Period *</label>
              <input
                type="month"
                required
                value={form.payrollPeriod}
                onChange={(e) => setForm({ ...form, payrollPeriod: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Overtime Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Overtime Hours *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={form.hours}
                onChange={(e) => {
                  const h = +e.target.value;
                  setForm({ ...form, hours: h, amount: Math.round(h * form.ratePerHour) });
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Hourly Rate (₹ / hr) *</label>
              <input
                type="number"
                step="10"
                required
                value={form.ratePerHour}
                onChange={(e) => {
                  const r = +e.target.value;
                  setForm({ ...form, ratePerHour: r, amount: Math.round(form.hours * r) });
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex justify-between items-center">
            <span className="text-zinc-400 font-medium">Calculated Total OT Pay:</span>
            <span className="font-mono text-base font-black text-emerald-400">
              {formatINR(Math.round(form.hours * form.ratePerHour))}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Reason / Work Justification</label>
            <input
              type="text"
              placeholder="e.g. Critical database migration on Sunday"
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
              {editingId ? "Save Changes" : "Log Overtime"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
