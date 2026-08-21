import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { useToast } from "../../components/ui/Toast";
import {
  Settings as SettingsIcon,
  Building,
  Save,
  RotateCcw,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function Settings() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    companyPAN: "",
    companyTAN: "",
    companyEPF: "",
    companyESIC: "",
    payrollFrequency: "MONTHLY",
    salaryPaymentDay: 30,
    workingDaysInMonth: "CALENDAR_DAYS",
    lopDivisor: "CALENDAR_DAYS",
    roundingRule: "NEAREST_RUPEE",
    pfCappingEnabled: true,
    pfWageCeiling: 15000,
    approvalWorkflowEnabled: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const sets = storageService.getSettings();
    setForm(sets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    storageService.updateSettings(form);
    showToast("Payroll configuration & company settings saved successfully!");
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all prototype data to initial seed records? This will restore 4 employees, templates, components, and sample runs."
      )
    ) {
      storageService.resetToDefaults();
      loadData();
      showToast("All prototype data reset to initial demo state!");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <SettingsIcon className="size-5 text-indigo-400" />
            Payroll & Statutory Settings
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure company legal metadata, LOP calculation rules, EPFO capping, and approval workflows.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Company Profile Box */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-zinc-200 flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Building className="size-4 text-indigo-400" />
            Company Profile & Legal Registrations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Company Legal Name *</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Corporate PAN Number</label>
              <input
                type="text"
                value={form.companyPAN}
                onChange={(e) => setForm({ ...form, companyPAN: e.target.value.toUpperCase() })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono uppercase font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Registered Office Address</label>
            <input
              type="text"
              value={form.companyAddress}
              onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Tax Deduction TAN</label>
              <input
                type="text"
                value={form.companyTAN}
                onChange={(e) => setForm({ ...form, companyTAN: e.target.value.toUpperCase() })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono uppercase outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">EPFO Establishment Code</label>
              <input
                type="text"
                value={form.companyEPF}
                onChange={(e) => setForm({ ...form, companyEPF: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">ESIC Registration No.</label>
              <input
                type="text"
                value={form.companyESIC}
                onChange={(e) => setForm({ ...form, companyESIC: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Calculation & Payroll Rules Box */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-zinc-200 flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Calendar className="size-4 text-indigo-400" />
            Payroll Calculation & Statutory Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Loss of Pay (LOP) Divisor Method *</label>
              <select
                value={form.lopDivisor}
                onChange={(e) => setForm({ ...form, lopDivisor: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="CALENDAR_DAYS">Actual Calendar Days (e.g. 31 days in Aug, 30 in Jun)</option>
                <option value="FIXED_30">Fixed 30 Days Basis</option>
              </select>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Determines how per-day salary deduction is computed for unpaid leaves and LOP.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Salary Payment Disbursement Day</label>
              <input
                type="number"
                min="1"
                max="31"
                value={form.salaryPaymentDay}
                onChange={(e) => setForm({ ...form, salaryPaymentDay: +e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-zinc-500">Day of the month when salary is credited.</p>
            </div>
          </div>

          <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200 block text-xs">
                  EPF Statutory Wage Ceiling Capping (₹15,000 / month)
                </span>
                <span className="text-[11px] text-zinc-400">
                  When enabled, statutory EPF (12%) is capped at max ₹1,800/mo on Basic wages above ₹15k.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.pfCappingEnabled}
                  onChange={(e) => setForm({ ...form, pfCappingEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Paid Weekly Off Policy Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <div>
                <span className="font-semibold text-zinc-200 block text-xs">
                  Paid Weekly Off Policy (Shops & Establishment / Factories Act)
                </span>
                <span className="text-[11px] text-zinc-400">
                  When enabled, weekly rest days are counted as paid/payable days in monthly salary processing.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.paidWeeklyOffEnabled !== false}
                  onChange={(e) => setForm({ ...form, paidWeeklyOffEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Paid Statutory Holidays Policy Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <div>
                <span className="font-semibold text-zinc-200 block text-xs">
                  Paid Statutory Holidays Policy (National & Festival Holidays)
                </span>
                <span className="text-[11px] text-zinc-400">
                  When enabled, declared public holidays are treated as fully paid days for staff.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.paidStatutoryHolidaysEnabled !== false}
                  onChange={(e) => setForm({ ...form, paidStatutoryHolidaysEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/15 flex items-center gap-2"
          >
            <Save className="size-4" />
            Save Configuration
          </button>
        </div>

        {/* Danger Zone: Reset Data */}
        <div className="bg-rose-950/20 border border-rose-900/30 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-rose-400 text-sm flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Reset Prototype Data
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Restore all 4 demo employees, templates, salary structures, and sample runs to initial state.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetData}
              className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/30 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2"
            >
              <RotateCcw className="size-3.5" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
