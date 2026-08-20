import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { useToast } from "../../components/ui/Toast";
import { Modal, Badge } from "../../components/ui/Modal";
import { formatINR, STATUS_COLORS } from "../../utils/formatters";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Trash2,
  Calendar,
  User,
  Sparkles,
} from "lucide-react";

export default function Reimbursements() {
  const { showToast } = useToast();
  const [claims, setClaims] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("2026-08");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    componentId: "",
    payrollPeriod: "2026-08",
    claimedAmount: "",
    billNumber: "",
    billDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setClaims(storageService.getReimbursements());
    setEmployees(storageService.getEmployees());
    // Filter reimbursement components
    const allComps = storageService.getComponents();
    const reimbComps = allComps.filter((c) => c.type === "REIMBURSEMENT");
    setComponents(reimbComps);
    if (reimbComps.length > 0 && !form.componentId) {
      setForm((prev) => ({ ...prev, componentId: reimbComps[0].id }));
    }
  };

  const handleOpenCreate = () => {
    setForm({
      employeeId: employees[0]?.id || "",
      componentId: components[0]?.id || "COMP_REIMB_FUEL",
      payrollPeriod: filterPeriod,
      claimedAmount: "",
      billNumber: "",
      billDate: new Date().toISOString().split("T")[0],
      remarks: "",
    });
    setModalOpen(true);
  };

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.claimedAmount || !form.componentId) {
      showToast("Please enter all required fields", "warning");
      return;
    }

    const emp = employees.find((e) => e.id === form.employeeId);
    const comp = components.find((c) => c.id === form.componentId);

    const newClaim = {
      ...form,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Unknown",
      componentName: comp ? comp.name : "Reimbursement",
      claimedAmount: Number(form.claimedAmount),
      approvedAmount: Number(form.claimedAmount),
      status: "PENDING",
    };

    storageService.createReimbursement(newClaim);
    loadData();
    setModalOpen(false);
    showToast("Reimbursement claim submitted successfully!");
  };

  const handleApproveClaim = (id) => {
    storageService.updateReimbursement(id, {
      status: "APPROVED",
      approvedDate: new Date().toISOString().split("T")[0],
    });
    loadData();
    showToast("Claim approved and queued for monthly payroll payout!");
  };

  const handleRejectClaim = (id) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    storageService.updateReimbursement(id, {
      status: "REJECTED",
      rejectionReason: reason || "Ineligible / Missing proof",
    });
    loadData();
    showToast("Claim rejected", "warning");
  };

  const handleDeleteClaim = (id) => {
    if (window.confirm("Are you sure you want to delete this claim?")) {
      storageService.deleteReimbursement(id);
      loadData();
      showToast("Claim deleted");
    }
  };

  // Filtered Claims
  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      (c.employeeName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.componentName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.billNumber || "").toLowerCase().includes(search.toLowerCase());
    const matchesPeriod = filterPeriod === "ALL" || c.payrollPeriod === filterPeriod;
    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  // KPIs
  const totalClaimed = filteredClaims.reduce((s, c) => s + (Number(c.claimedAmount) || 0), 0);
  const totalApproved = filteredClaims
    .filter((c) => c.status === "APPROVED")
    .reduce((s, c) => s + (Number(c.approvedAmount) || 0), 0);
  const pendingCount = filteredClaims.filter((c) => c.status === "PENDING").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Receipt className="size-5 text-indigo-400" />
            Salary Reimbursements & Claims
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage tax-exempt flexible benefits, fuel, communication, meal & travel reimbursements paid out in payroll.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
        >
          <Plus className="size-4" />
          Submit Reimbursement Claim
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Claimed ({filterPeriod})</span>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">
            {formatINR(totalClaimed)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Across {filteredClaims.length} submitted claims</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Approved for Payroll</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {formatINR(totalApproved)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Non-taxable payout directly on payslip</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Pending Verification</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {pendingCount} Claims
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Awaiting bill proof approval</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/30 p-3.5 rounded-xl border border-zinc-800/60">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="size-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee, claim, bill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500 w-56 font-medium"
            />
          </div>

          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="ALL">All Periods</option>
            <option value="2026-08">August 2026</option>
            <option value="2026-07">July 2026</option>
            <option value="2026-06">June 2026</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="p-3.5">Employee</th>
              <th className="p-3.5">Reimbursement Component</th>
              <th className="p-3.5">Bill / Proof Ref</th>
              <th className="p-3.5 text-right">Claimed (₹)</th>
              <th className="p-3.5 text-right">Approved (₹)</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-zinc-500">
                  No reimbursement claims found for the selected period.
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-zinc-200">{claim.employeeName}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{claim.employeeId} • {claim.payrollPeriod}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Receipt className="size-3.5 text-indigo-400" />
                      {claim.componentName}
                    </div>
                    {claim.remarks && (
                      <div className="text-[10px] text-zinc-400 mt-0.5 max-w-xs truncate">{claim.remarks}</div>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-zinc-300">
                    <div>{claim.billNumber || "Self-declaration"}</div>
                    <div className="text-[10px] text-zinc-500">{claim.billDate}</div>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-zinc-200">
                    {formatINR(claim.claimedAmount)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                    {claim.status === "APPROVED" ? formatINR(claim.approvedAmount) : "—"}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        claim.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : claim.status === "REJECTED"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {claim.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApproveClaim(claim.id)}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                            title="Approve Claim"
                          >
                            <CheckCircle className="size-4" />
                          </button>
                          <button
                            onClick={() => handleRejectClaim(claim.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                            title="Reject Claim"
                          >
                            <XCircle className="size-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteClaim(claim.id)}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete Claim"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Claim Submission Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Reimbursement Claim"
        description="Add an employee expense claim for tax-exempt monthly payroll payout."
      >
        <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Employee *</label>
              <select
                required
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Reimbursement Component *</label>
              <select
                required
                value={form.componentId}
                onChange={(e) => setForm({ ...form, componentId: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                {components.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Payroll Period *</label>
              <select
                value={form.payrollPeriod}
                onChange={(e) => setForm({ ...form, payrollPeriod: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-09">September 2026</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Claim Amount (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 3500"
                value={form.claimedAmount}
                onChange={(e) => setForm({ ...form, claimedAmount: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Bill / Invoice Reference Number</label>
              <input
                type="text"
                placeholder="e.g. INV-99881"
                value={form.billNumber}
                onChange={(e) => setForm({ ...form, billNumber: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Bill Date</label>
              <input
                type="date"
                value={form.billDate}
                onChange={(e) => setForm({ ...form, billDate: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Remarks / Expense Details</label>
            <textarea
              rows={2}
              placeholder="e.g. Official client meeting travel fuel charges"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
