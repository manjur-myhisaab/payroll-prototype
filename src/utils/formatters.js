/**
 * Formatting helpers for currency, numbers, dates, and status badges.
 */

export function formatINR(val, showZero = true) {
  if (val === null || val === undefined || isNaN(val)) return showZero ? "₹0" : "—";
  const num = Math.round(Number(val));
  return "₹" + num.toLocaleString("en-IN");
}

export function formatNumber(val) {
  if (val === null || val === undefined || isNaN(val)) return "0";
  return Number(val).toLocaleString("en-IN");
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function formatMonthName(yearMonthStr) {
  if (!yearMonthStr) return "—";
  try {
    const [year, month] = yearMonthStr.split("-").map(Number);
    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  } catch {
    return yearMonthStr;
  }
}

export const STATUS_COLORS = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  INACTIVE: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PAID: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DRAFT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PROCESSING: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export const TYPE_COLORS = {
  EARNING: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DEDUCTION: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  EMPLOYER_CONTRIBUTION: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  REIMBURSEMENT: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  BENEFIT: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};
