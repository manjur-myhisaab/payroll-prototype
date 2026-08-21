import React, { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  FileCode2,
  Users,
  PlayCircle,
  Clock,
  Sparkles,
  DollarSign,
  FileText,
  FileSpreadsheet,
  Settings,
  Building,
  Menu,
  X,
  Receipt,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function AdminLayout({ activePage, onNavigate, children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "CORE" },
    { id: "statutory_components", label: "Statutory Components", icon: ShieldCheck, section: "SALARY SETUP" },
    { id: "components", label: "Salary Components", icon: FileCode2, section: "SALARY SETUP" },
    { id: "templates", label: "Salary Templates", icon: Layers, section: "SALARY SETUP" },
    { id: "salaries", label: "Employee Salaries", icon: Users, section: "SALARY SETUP" },
    { id: "payroll_runs", label: "Payroll Runs", icon: PlayCircle, section: "PAYROLL" },
    { id: "reimbursements", label: "Reimbursements & Claims", icon: Receipt, section: "VARIABLE PAY" },
    { id: "overtime", label: "Overtime", icon: Clock, section: "VARIABLE PAY" },
    { id: "incentives", label: "Incentives & Bonuses", icon: Sparkles, section: "VARIABLE PAY" },
    { id: "loans", label: "Loans & Advances", icon: DollarSign, section: "VARIABLE PAY" },
    { id: "payslips", label: "Payslips", icon: FileText, section: "REPORTS & OUTPUT" },
    { id: "reports", label: "Reports & Registers", icon: FileSpreadsheet, section: "REPORTS & OUTPUT" },
    { id: "settings", label: "Settings", icon: Settings, section: "ADMIN" },
    { id: "docs", label: "Docs & Knowledge Base", icon: BookOpen, section: "ADMIN" },
  ];

  const groupedNav = navigationItems.reduce((acc, item) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800/80 z-50 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                <Building className="size-5" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-white leading-tight">
                  Hisaab Payroll
                </h1>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">
                  Enterprise HRMS
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-zinc-500 hover:text-zinc-200 p-1"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="p-3.5 space-y-5 flex-1">
            {Object.entries(groupedNav).map(([sectionTitle, items]) => (
              <div key={sectionTitle} className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 px-3 block mb-1.5">
                  {sectionTitle}
                </span>

                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`size-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="size-3.5 opacity-80" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer Metadata */}
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/20 text-[10px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="size-3.5" />
              <span>Wage Code 2019 Ready</span>
            </div>
            <div>Prototype v2.0 • LocalStorage Engine</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white"
            >
              <Menu className="size-5" />
            </button>

            <div className="text-xs text-zinc-400 font-medium hidden sm:block">
              <span className="text-zinc-500">Payroll Admin Console</span>
              <span className="mx-2 text-zinc-700">/</span>
              <span className="text-zinc-200 font-bold capitalize">
                {activePage.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* Right Action Profile & Badge */}
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full hidden sm:inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              4 Demo Employees Active
            </span>

            <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
              <div className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white shadow">
                HR
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-zinc-200 leading-none">Priya Roy</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Payroll Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-zinc-800/60 py-4 px-8 text-center text-[10px] text-zinc-500 bg-zinc-950/40 flex flex-col sm:flex-row justify-between items-center gap-2 print:hidden">
          <p>© 2026 Hisaab Payroll Prototype • Architected per Antigravity Spec Specification.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-400">LocalStorage Persistent</span>
            <span>•</span>
            <span className="hover:text-zinc-400">Laravel / MySQL Schema Ready</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
