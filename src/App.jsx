import React, { useState } from "react";
import { ToastProvider } from "./components/ui/Toast";
import AdminLayout from "./layouts/AdminLayout";

// Import all 11 specification pages
import Dashboard from "./pages/Dashboard/Dashboard";
import SalaryComponents from "./pages/SalaryComponents/SalaryComponents";
import StatutoryComponents from "./pages/Statutory/StatutoryComponents";
import SalaryTemplates from "./pages/SalaryTemplates/SalaryTemplates";
import EmployeeSalaries from "./pages/EmployeeSalaries/EmployeeSalaries";
import PayrollRuns from "./pages/PayrollRuns/PayrollRuns";
import Overtime from "./pages/Overtime/Overtime";
import Incentives from "./pages/Incentives/Incentives";
import Loans from "./pages/Loans/Loans";
import Reimbursements from "./pages/Reimbursements/Reimbursements";
import Payslips from "./pages/Payslips/Payslips";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

export default function App() {
  const [activePage, setActivePage] = useState("reimbursements");

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "statutory_components":
        return <StatutoryComponents />;
      case "components":
        return <SalaryComponents />;
      case "templates":
        return <SalaryTemplates onNavigate={setActivePage} />;
      case "salaries":
        return <EmployeeSalaries />;
      case "payroll_runs":
        return <PayrollRuns onNavigate={setActivePage} />;
      case "reimbursements":
        return <Reimbursements />;
      case "overtime":
        return <Overtime />;
      case "incentives":
        return <Incentives />;
      case "loans":
        return <Loans />;
      case "payslips":
        return <Payslips />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <ToastProvider>
      <AdminLayout activePage={activePage} onNavigate={setActivePage}>
        {renderActivePage()}
      </AdminLayout>
    </ToastProvider>
  );
}
