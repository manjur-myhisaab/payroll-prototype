import React, { useState, useEffect } from "react";
import { storageService } from "../../services/storageService";
import { calculateSalaryBreakdown } from "../../utils/salaryCalculator";
import { useToast } from "../../components/ui/Toast";
import { Modal } from "../../components/ui/Modal";
import { formatINR, formatDate, TYPE_COLORS } from "../../utils/formatters";
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  TrendingUp,
  History,
  Eye,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
  Percent,
  Calculator,
  FileText,
  ShieldCheck,
  Zap,
  Filter,
  DollarSign,
  Clock,
  Package,
  Sliders,
  Check,
  X,
  Edit,
  UserPlus,
  Calendar,
  Building,
  Briefcase,
  CreditCard,
  Sun,
  Coffee,
} from "lucide-react";

export default function EmployeeSalaries() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [employeeSalaries, setEmployeeSalaries] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [components, setComponents] = useState([]);
  const [settings, setSettings] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [payTypeFilter, setPayTypeFilter] = useState("ALL");

  // Modals state
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reviseModalOpen, setReviseModalOpen] = useState(false);
  const [detailEmp, setDetailEmp] = useState(null);
  const [viewMonth, setViewMonth] = useState("2026-08");
  const [componentSelectionMode, setComponentSelectionMode] = useState("TEMPLATE"); // "TEMPLATE" | "INDEPENDENT"

  // Master Form State for Add / Edit Employee & Salary Structure
  const [empForm, setEmpForm] = useState({
    // Profile Fields
    id: "",
    name: "",
    email: "",
    department: "Engineering",
    designation: "Software Engineer",
    category: "WHITE_COLLAR",
    subCategory: "L2_SENIOR",
    joiningDate: new Date().toISOString().split("T")[0],
    bankAccount: "50100234567890",
    bankName: "HDFC Bank",
    ifscCode: "HDFC0000053",
    pan: "ABCDE1234F",
    uan: "100987654321",
    status: "ACTIVE",

    // Salary Structure & Compensation
    templateId: "TPL_DEV_STD",
    payType: "MONTHLY_SALARIED",
    annualCTC: 720000,
    dailyRate: 650,
    hourlyRate: 350,
    pieceRate: 15,
    
    // Effective Duration (effectiveFrom to effectiveTo)
    effectiveFrom: "2026-04-01",
    effectiveTo: "",
    revisionReason: "Initial Compensation Structure",

    // Work Extra Pay Togglers & Multipliers
    weekOffPayEnabled: true,
    weekOffOtMultiplier: 2.0,
    holidayPayEnabled: true,
    holidayOtMultiplier: 2.5,

    // Overtime Policy
    overtimeEnabled: true,
    otRateMode: "AUTO_MULTIPLIER", // "AUTO_MULTIPLIER" | "FIXED_RATE"
    otFixedHourlyRate: 250,
    regularOtMultiplier: 1.5,
    minStartThresholdMinutes: 30,
    maxMonthlyHoursCap: 50,
    otRoundingRule: "NEAREST_15_MIN",

    // Assigned Salary Components Array
    assignedComponents: [],
  });

  // Quick CTC / Rate Revision Form State
  const [reviseForm, setReviseForm] = useState({
    employeeId: "",
    payType: "MONTHLY_SALARIED",
    currentCTC: 720000,
    currentMonthlyCTC: 60000,
    currentRate: 650,
    newRate: 750,
    templateId: "",
    newAnnualCTC: 792000,
    newMonthlyCTC: 66000,
    hikePercentage: 10,
    effectiveFrom: new Date().toISOString().split("T")[0],
    effectiveTo: "",
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

  // Helper: Get components associated with a template
  const getComponentsForTemplate = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl || !tpl.components) return [];
    return tpl.components.map((tc) => {
      const comp = components.find((c) => c.id === tc.componentId) || {};
      return {
        componentId: tc.componentId,
        name: comp.name || tc.componentId,
        type: comp.type || "EARNING",
        calculationMethod: tc.calculationMethod || comp.calculationMethod || "PERCENTAGE",
        value: tc.value !== undefined ? tc.value : comp.value || 0,
        basedOn: tc.basedOn || null,
        selected: true,
      };
    });
  };

  // -----------------------------------------------------------------
  // 1. ADD / EDIT EMPLOYEE & SALARY WORKFLOW
  // -----------------------------------------------------------------
  const handleOpenAddEmployee = () => {
    setIsEditMode(false);
    setComponentSelectionMode("TEMPLATE");
    const defaultTpl = templates[0];
    const initialComps = defaultTpl ? getComponentsForTemplate(defaultTpl.id) : [];

    setEmpForm({
      id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
      name: "",
      email: "",
      department: "Engineering",
      designation: "Software Engineer",
      category: "WHITE_COLLAR",
      subCategory: "L2_SENIOR",
      joiningDate: new Date().toISOString().split("T")[0],
      bankAccount: "",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0000053",
      pan: "",
      uan: "",
      status: "ACTIVE",
      templateId: defaultTpl ? defaultTpl.id : "CUSTOM",
      payType: "MONTHLY_SALARIED",
      annualCTC: 720000,
      dailyRate: 650,
      hourlyRate: 350,
      pieceRate: 15,
      effectiveFrom: new Date().toISOString().split("T")[0],
      effectiveTo: "",
      revisionReason: "Initial Compensation Setup",
      weekOffPayEnabled: true,
      weekOffOtMultiplier: 2.0,
      holidayPayEnabled: true,
      holidayOtMultiplier: 2.5,
      overtimeEnabled: true,
      otRateMode: "AUTO_MULTIPLIER",
      otFixedHourlyRate: 250,
      regularOtMultiplier: 1.5,
      minStartThresholdMinutes: 30,
      maxMonthlyHoursCap: 50,
      otRoundingRule: "NEAREST_15_MIN",
      assignedComponents: initialComps,
    });
    setEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setIsEditMode(true);
    const activeSal = storageService.getActiveSalaryForEmployee(emp.id);
    const templateId = activeSal?.templateId || templates[0]?.id || "CUSTOM";
    setComponentSelectionMode(activeSal?.templateId && activeSal.templateId !== "CUSTOM" ? "TEMPLATE" : "INDEPENDENT");

    let assignedComps = [];
    if (activeSal?.assignedComponents && activeSal.assignedComponents.length > 0) {
      assignedComps = activeSal.assignedComponents;
    } else {
      assignedComps = getComponentsForTemplate(templateId);
    }

    setEmpForm({
      id: emp.id,
      name: emp.name || "",
      email: emp.email || "",
      department: emp.department || "Engineering",
      designation: emp.designation || "",
      category: emp.category || "WHITE_COLLAR",
      subCategory: emp.subCategory || "L2_SENIOR",
      joiningDate: emp.joiningDate || new Date().toISOString().split("T")[0],
      bankAccount: emp.bankAccount || "",
      bankName: emp.bankName || "",
      ifscCode: emp.ifscCode || "",
      pan: emp.pan || "",
      uan: emp.uan || "",
      status: emp.status || "ACTIVE",
      templateId: templateId,
      payType: activeSal?.payType || emp.payType || "MONTHLY_SALARIED",
      annualCTC: activeSal?.annualCTC || 720000,
      dailyRate: activeSal?.dailyRate || 650,
      hourlyRate: activeSal?.hourlyRate || 350,
      pieceRate: activeSal?.pieceRate || 15,
      effectiveFrom: activeSal?.effectiveFrom || new Date().toISOString().split("T")[0],
      effectiveTo: activeSal?.effectiveTo || "",
      revisionReason: activeSal?.revisionReason || "Profile & Salary Revision",
      weekOffPayEnabled: activeSal?.weekOffPayEnabled !== undefined ? activeSal.weekOffPayEnabled : true,
      weekOffOtMultiplier: activeSal?.weekOffOtMultiplier || 2.0,
      holidayPayEnabled: activeSal?.holidayPayEnabled !== undefined ? activeSal.holidayPayEnabled : true,
      holidayOtMultiplier: activeSal?.holidayOtMultiplier || 2.5,
      overtimeEnabled: activeSal?.overtimeEnabled !== undefined ? activeSal.overtimeEnabled : true,
      otRateMode: activeSal?.otRateMode || "AUTO_MULTIPLIER",
      otFixedHourlyRate: activeSal?.otFixedHourlyRate || 250,
      regularOtMultiplier: activeSal?.regularOtMultiplier || 1.5,
      minStartThresholdMinutes: activeSal?.minStartThresholdMinutes !== undefined ? activeSal.minStartThresholdMinutes : 30,
      maxMonthlyHoursCap: activeSal?.maxMonthlyHoursCap !== undefined ? activeSal.maxMonthlyHoursCap : 50,
      otRoundingRule: activeSal?.otRoundingRule || "NEAREST_15_MIN",
      assignedComponents: assignedComps,
    });
    setEmployeeModalOpen(true);
  };

  const handleTemplateChangeInForm = (tplId) => {
    if (tplId === "CUSTOM") {
      setEmpForm({ ...empForm, templateId: "CUSTOM" });
      setComponentSelectionMode("INDEPENDENT");
    } else {
      const templateComps = getComponentsForTemplate(tplId);
      setEmpForm({
        ...empForm,
        templateId: tplId,
        assignedComponents: templateComps,
      });
    }
  };

  const handleToggleComponentInForm = (comp) => {
    const exists = empForm.assignedComponents.find((c) => (c.componentId || c.id) === comp.id);
    let updated;
    if (exists) {
      updated = empForm.assignedComponents.filter((c) => (c.componentId || c.id) !== comp.id);
    } else {
      updated = [
        ...empForm.assignedComponents,
        {
          componentId: comp.id,
          name: comp.name,
          type: comp.type,
          calculationMethod: comp.calculationMethod || "PERCENTAGE",
          value: comp.value || 0,
          basedOn: comp.percentageBaseType || null,
          selected: true,
        },
      ];
    }
    setEmpForm({ ...empForm, assignedComponents: updated });
  };

  const handleSaveEmployeeAndSalary = (e) => {
    e.preventDefault();
    if (!empForm.name || !empForm.id) {
      showToast("Please provide employee name and ID", "error");
      return;
    }

    const employeeData = {
      id: empForm.id,
      name: empForm.name,
      email: empForm.email,
      department: empForm.department,
      designation: empForm.designation,
      category: empForm.category,
      subCategory: empForm.subCategory,
      joiningDate: empForm.joiningDate,
      bankAccount: empForm.bankAccount,
      bankName: empForm.bankName,
      ifscCode: empForm.ifscCode,
      pan: empForm.pan,
      uan: empForm.uan,
      status: empForm.status,
      payType: empForm.payType,
    };

    const salaryData = {
      employeeId: empForm.id,
      templateId: empForm.templateId,
      payType: empForm.payType,
      annualCTC: empForm.payType === "MONTHLY_SALARIED" ? Number(empForm.annualCTC) : 0,
      dailyRate: empForm.payType === "DAILY_WAGE" ? Number(empForm.dailyRate) : 0,
      hourlyRate: empForm.payType === "HOURLY" ? Number(empForm.hourlyRate) : 0,
      pieceRate: empForm.payType === "PIECE_RATE" ? Number(empForm.pieceRate) : 0,
      // Extra Work Pay Togglers & Multipliers
      weekOffPayEnabled: Boolean(empForm.weekOffPayEnabled),
      weekOffOtMultiplier: empForm.weekOffPayEnabled ? Number(empForm.weekOffOtMultiplier) || 2.0 : 1.0,
      holidayPayEnabled: Boolean(empForm.holidayPayEnabled),
      holidayOtMultiplier: empForm.holidayPayEnabled ? Number(empForm.holidayOtMultiplier) || 2.5 : 1.0,
      // Overtime
      overtimeEnabled: Boolean(empForm.overtimeEnabled),
      otRateMode: empForm.otRateMode,
      otFixedHourlyRate: Number(empForm.otFixedHourlyRate) || 0,
      regularOtMultiplier: Number(empForm.regularOtMultiplier) || 1.5,
      minStartThresholdMinutes: Number(empForm.minStartThresholdMinutes) || 0,
      maxMonthlyHoursCap: Number(empForm.maxMonthlyHoursCap) || 0,
      otRoundingRule: empForm.otRoundingRule,
      // Effective Duration
      effectiveFrom: empForm.effectiveFrom,
      effectiveTo: empForm.effectiveTo ? empForm.effectiveTo : null,
      revisionReason: isEditMode ? empForm.revisionReason : "Initial Employee & Salary Structure Setup",
      assignedComponents: empForm.assignedComponents,
    };

    storageService.saveEmployeeWithSalary({
      employeeData,
      salaryData,
      isEdit: isEditMode,
    });

    showToast(isEditMode ? `Employee "${empForm.name}" updated successfully!` : `Employee "${empForm.name}" added with salary structure!`);
    setEmployeeModalOpen(false);
    loadData();
  };

  // -----------------------------------------------------------------
  // 2. QUICK REVISION WORKFLOW
  // -----------------------------------------------------------------
  const handleOpenRevise = (emp = null) => {
    const selectedEmp = emp || employees[0];
    const activeSalary = selectedEmp
      ? storageService.getActiveSalaryForEmployee(selectedEmp.id)
      : null;

    const payType = activeSalary?.payType || selectedEmp?.payType || "MONTHLY_SALARIED";
    const currentCTC = activeSalary?.annualCTC || 720000;
    const currentRate =
      payType === "DAILY_WAGE"
        ? activeSalary?.dailyRate || 650
        : payType === "HOURLY"
        ? activeSalary?.hourlyRate || 350
        : payType === "PIECE_RATE"
        ? activeSalary?.pieceRate || 15
        : currentCTC;

    const defaultHikePercent = 10;
    const newAnnualCTC = Math.round(currentCTC * (1 + defaultHikePercent / 100));
    const newRate = Math.round(currentRate * (1 + defaultHikePercent / 100));

    setReviseForm({
      employeeId: selectedEmp ? selectedEmp.id : employees[0]?.id || "",
      payType,
      currentCTC,
      currentMonthlyCTC: Math.round(currentCTC / 12),
      currentRate,
      newRate,
      templateId: activeSalary ? activeSalary.templateId : templates[0]?.id || "",
      newAnnualCTC,
      newMonthlyCTC: Math.round(newAnnualCTC / 12),
      hikePercentage: defaultHikePercent,
      effectiveFrom: new Date().toISOString().split("T")[0],
      effectiveTo: "",
      revisionReason: "Annual Performance Appraisal",
    });
    setReviseModalOpen(true);
  };

  const handleSaveRevision = (e) => {
    e.preventDefault();
    const activeSal = storageService.getActiveSalaryForEmployee(reviseForm.employeeId);
    const isMonthly = reviseForm.payType === "MONTHLY_SALARIED";

    storageService.assignSalaryStructure({
      employeeId: reviseForm.employeeId,
      templateId: reviseForm.templateId || activeSal?.templateId || "TPL_DEV_STD",
      payType: reviseForm.payType,
      annualCTC: isMonthly ? Number(reviseForm.newAnnualCTC) : 0,
      dailyRate: reviseForm.payType === "DAILY_WAGE" ? Number(reviseForm.newRate) : 0,
      hourlyRate: reviseForm.payType === "HOURLY" ? Number(reviseForm.newRate) : 0,
      pieceRate: reviseForm.payType === "PIECE_RATE" ? Number(reviseForm.newRate) : 0,
      weekOffPayEnabled: activeSal?.weekOffPayEnabled !== undefined ? activeSal.weekOffPayEnabled : true,
      weekOffOtMultiplier: activeSal?.weekOffOtMultiplier || 2.0,
      holidayPayEnabled: activeSal?.holidayPayEnabled !== undefined ? activeSal.holidayPayEnabled : true,
      holidayOtMultiplier: activeSal?.holidayOtMultiplier || 2.5,
      overtimeEnabled: activeSal?.overtimeEnabled !== undefined ? activeSal.overtimeEnabled : true,
      otRateMode: activeSal?.otRateMode || "AUTO_MULTIPLIER",
      otFixedHourlyRate: activeSal?.otFixedHourlyRate || 250,
      regularOtMultiplier: activeSal?.regularOtMultiplier || 1.5,
      minStartThresholdMinutes: activeSal?.minStartThresholdMinutes || 30,
      maxMonthlyHoursCap: activeSal?.maxMonthlyHoursCap || 50,
      otRoundingRule: activeSal?.otRoundingRule || "NEAREST_15_MIN",
      assignedComponents: activeSal?.assignedComponents || [],
      effectiveFrom: reviseForm.effectiveFrom,
      effectiveTo: reviseForm.effectiveTo ? reviseForm.effectiveTo : null,
      revisionReason: `${reviseForm.revisionReason} (${reviseForm.hikePercentage >= 0 ? "+" : ""}${reviseForm.hikePercentage}% Increment)`,
    });

    showToast(`Compensation revised successfully!`);
    setReviseModalOpen(false);
    loadData();
  };

  // Filtered employees list
  const filtered = employees.filter((e) => {
    const activeSal = storageService.getActiveSalaryForEmployee(e.id);
    const payType = activeSal?.payType || e.payType || "MONTHLY_SALARIED";

    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || e.category === categoryFilter;
    const matchesPayType = payTypeFilter === "ALL" || payType === payTypeFilter;

    return matchesSearch && matchesCat && matchesPayType;
  });

  const tplMap = new Map(templates.map((t) => [t.id, t]));

  // Month-wise historical salary resolution for View Modal
  const getSalaryForMonth = (empId, monthStr) => {
    const allSalaries = employeeSalaries.filter((s) => s.employeeId === empId);
    if (!monthStr || allSalaries.length === 0) return storageService.getActiveSalaryForEmployee(empId);

    const targetTime = new Date(`${monthStr}-15`).getTime();
    const matched = allSalaries.find((s) => {
      const fromTime = new Date(s.effectiveFrom).getTime();
      const toTime = s.effectiveTo ? new Date(s.effectiveTo).getTime() : Infinity;
      return targetTime >= fromTime && targetTime <= toTime;
    });

    return matched || storageService.getActiveSalaryForEmployee(empId);
  };

  const selectedMonthSalary = detailEmp ? getSalaryForMonth(detailEmp.id, viewMonth) : null;
  const selectedTemplate = selectedMonthSalary ? tplMap.get(selectedMonthSalary.templateId) || templates[0] : templates[0];

  const detailBreakdown =
    detailEmp && selectedMonthSalary
      ? calculateSalaryBreakdown({
          annualCTC: selectedMonthSalary.annualCTC || 720000,
          payType: selectedMonthSalary.payType || detailEmp.payType || "MONTHLY_SALARIED",
          dailyRate: selectedMonthSalary.dailyRate || 650,
          hourlyRate: selectedMonthSalary.hourlyRate || 350,
          pieceRate: selectedMonthSalary.pieceRate || 15,
          template: selectedTemplate,
          assignedComponents: selectedMonthSalary.assignedComponents && selectedMonthSalary.assignedComponents.length > 0 ? selectedMonthSalary.assignedComponents : null,
          allComponents: components,
          settings,
        })
      : null;

  const empHistory = detailEmp
    ? employeeSalaries
        .filter((s) => s.employeeId === detailEmp.id)
        .sort((a, b) => new Date(b.effectiveFrom) - new Date(a.effectiveFrom))
    : [];

  // Group components by type for the Add/Edit form selector
  const earningComponents = components.filter((c) => c.type === "EARNING");
  const deductionComponents = components.filter((c) => c.type === "DEDUCTION");
  const employerCostComponents = components.filter((c) => c.type === "EMPLOYER_CONTRIBUTION");

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Users className="size-5 text-indigo-400" />
            Universal Employee Salaries & Component Hub
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage Employee Profiles, Multi-Wage Structures, Week-off/Holiday Extra Pay Multipliers, Template & Independent Component Assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddEmployee}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <UserPlus className="size-4" />
            Add Employee & Salary
          </button>

          <button
            onClick={() => handleOpenRevise()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/15 flex items-center gap-2"
          >
            <TrendingUp className="size-4" />
            Revise Rate / CTC
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Total Staff Count</span>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-1">{employees.length} Employees</div>
        </div>

        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Monthly Salaried</span>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
            {employees.filter((e) => (storageService.getActiveSalaryForEmployee(e.id)?.payType || e.payType) === "MONTHLY_SALARIED").length} Staff
          </div>
        </div>

        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Daily Wage Workers</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {employees.filter((e) => (storageService.getActiveSalaryForEmployee(e.id)?.payType || e.payType) === "DAILY_WAGE").length} Workers
          </div>
        </div>

        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Hourly & Piece-Rate</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {employees.filter((e) => ["HOURLY", "PIECE_RATE"].includes(storageService.getActiveSalaryForEmployee(e.id)?.payType || e.payType)).length} Units/Specs
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">Category:</span>
            {["ALL", "WHITE_COLLAR", "BLUE_COLLAR", "MANAGEMENT", "CONTRACTUAL"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all text-[11px] ${
                  categoryFilter === cat
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search employee, ID, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Pay Type Filters */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-800/60">
          <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">Wage Driver:</span>
          {[
            { id: "ALL", label: "All Pay Types" },
            { id: "MONTHLY_SALARIED", label: "Monthly Salaried" },
            { id: "DAILY_WAGE", label: "Daily Wage" },
            { id: "HOURLY", label: "Hourly Rate" },
            { id: "PIECE_RATE", label: "Piece-Rate" },
          ].map((pt) => (
            <button
              key={pt.id}
              onClick={() => setPayTypeFilter(pt.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all text-[10px] ${
                payTypeFilter === pt.id
                  ? "bg-amber-600 text-white shadow-sm shadow-amber-600/20"
                  : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Salaries Table with Active Component Details & Policies */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Employee</th>
              <th className="p-4">Category & Pay Type</th>
              <th className="p-4">Rate & Duration</th>
              <th className="p-4">Active Assigned Components</th>
              <th className="p-4">Week-off / Holiday Multipliers</th>
              <th className="p-4 text-right">Est. Monthly Gross</th>
              <th className="p-4 text-right">Est. Net Take-Home</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.map((emp) => {
              const activeSal = storageService.getActiveSalaryForEmployee(emp.id);
              const payType = activeSal?.payType || emp.payType || "MONTHLY_SALARIED";
              const isOtEnabled = activeSal?.overtimeEnabled !== undefined ? activeSal.overtimeEnabled : true;
              const isWeekOffPay = activeSal?.weekOffPayEnabled !== false;
              const isHolidayPay = activeSal?.holidayPayEnabled !== false;
              const tpl = activeSal ? tplMap.get(activeSal.templateId) : null;
              
              const assignedComps = activeSal?.assignedComponents && activeSal.assignedComponents.length > 0
                ? activeSal.assignedComponents
                : tpl && tpl.components
                ? tpl.components
                : [];

              const breakdown =
                activeSal
                  ? calculateSalaryBreakdown({
                      annualCTC: activeSal.annualCTC,
                      payType,
                      dailyRate: activeSal.dailyRate,
                      hourlyRate: activeSal.hourlyRate,
                      pieceRate: activeSal.pieceRate,
                      template: tpl || templates[0],
                      assignedComponents: assignedComps,
                      allComponents: components,
                      settings,
                    })
                  : null;

              // Filter assigned components by type for display
              const assignedEarnings = assignedComps.filter((c) => {
                const master = components.find((mc) => mc.id === (c.componentId || c.id));
                return (c.type === "EARNING" || master?.type === "EARNING");
              });
              const assignedDeductions = assignedComps.filter((c) => {
                const master = components.find((mc) => mc.id === (c.componentId || c.id));
                return (c.type === "DEDUCTION" || master?.type === "DEDUCTION");
              });
              const assignedEmployerCosts = assignedComps.filter((c) => {
                const master = components.find((mc) => mc.id === (c.componentId || c.id));
                return (c.type === "EMPLOYER_CONTRIBUTION" || master?.type === "EMPLOYER_CONTRIBUTION");
              });

              return (
                <tr key={emp.id} className="hover:bg-zinc-800/20 transition-colors">
                  {/* 1. Employee */}
                  <td className="p-4">
                    <div className="font-bold text-zinc-200">{emp.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{emp.id} • {emp.designation}</div>
                  </td>

                  {/* 2. Category & Pay Type */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        emp.category === "BLUE_COLLAR"
                          ? "bg-amber-950/40 text-amber-300 border-amber-800/60"
                          : emp.category === "MANAGEMENT"
                          ? "bg-purple-950/40 text-purple-300 border-purple-800/60"
                          : "bg-blue-950/40 text-blue-300 border-blue-800/60"
                      }`}>
                        {emp.category || "WHITE_COLLAR"}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        payType === "DAILY_WAGE"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : payType === "HOURLY"
                          ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                          : payType === "PIECE_RATE"
                          ? "bg-purple-950 text-purple-400 border border-purple-800"
                          : "bg-indigo-950 text-indigo-400 border border-indigo-800"
                      }`}>
                        {payType.replace("_", " ")}
                      </span>
                    </div>
                  </td>

                  {/* 3. Rate & Duration (Effective From -> Effective To) */}
                  <td className="p-4">
                    <div className="font-mono text-zinc-200 font-bold text-xs">
                      {payType === "DAILY_WAGE" ? (
                        <span>{formatINR(activeSal?.dailyRate || 650)} <span className="text-[10px] text-zinc-500 font-normal">/ day</span></span>
                      ) : payType === "HOURLY" ? (
                        <span>{formatINR(activeSal?.hourlyRate || 350)} <span className="text-[10px] text-zinc-500 font-normal">/ hr</span></span>
                      ) : payType === "PIECE_RATE" ? (
                        <span>{formatINR(activeSal?.pieceRate || 15)} <span className="text-[10px] text-zinc-500 font-normal">/ unit</span></span>
                      ) : (
                        <span>
                          {formatINR(activeSal?.annualCTC || 720000)} <span className="text-[10px] text-zinc-500 font-normal">/ yr</span>
                          <span className="text-[10px] text-zinc-400 block font-normal font-sans">
                            ({formatINR(Math.round((activeSal?.annualCTC || 720000) / 12))} / mo)
                          </span>
                        </span>
                      )}
                    </div>
                    {/* Effective Duration */}
                    <div className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-1">
                      <Calendar className="size-2.5 text-zinc-500" />
                      <span>{formatDate(activeSal?.effectiveFrom)} {activeSal?.effectiveTo ? `to ${formatDate(activeSal.effectiveTo)}` : "→ Present"}</span>
                    </div>
                  </td>

                  {/* 4. Active Assigned Components Column */}
                  <td className="p-4 max-w-[280px]">
                    <div className="space-y-1">
                      {/* Earnings Badges */}
                      {assignedEarnings.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-emerald-400 font-bold uppercase mr-0.5">Earn:</span>
                          {assignedEarnings.map((c, idx) => {
                            const master = components.find((mc) => mc.id === (c.componentId || c.id));
                            const name = c.name || master?.name || c.componentId;
                            return (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 text-[9px] font-medium"
                                title={`${name} (${c.calculationMethod || "PERCENTAGE"})`}
                              >
                                {name.split(" ")[0]}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Deductions Badges */}
                      {assignedDeductions.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-rose-400 font-bold uppercase mr-0.5">Ded:</span>
                          {assignedDeductions.map((c, idx) => {
                            const master = components.find((mc) => mc.id === (c.componentId || c.id));
                            const name = c.name || master?.name || c.componentId;
                            return (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/60 text-[9px] font-medium"
                                title={name}
                              >
                                {name.split(" ")[0]}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Employer Cost Badges */}
                      {assignedEmployerCosts.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-purple-400 font-bold uppercase mr-0.5">Cost:</span>
                          {assignedEmployerCosts.map((c, idx) => {
                            const master = components.find((mc) => mc.id === (c.componentId || c.id));
                            const name = c.name || master?.name || c.componentId;
                            return (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/60 text-[9px] font-medium"
                                title={name}
                              >
                                {name.split(" ")[0]}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 5. Week-off / Holiday Multipliers & Overtime */}
                  <td className="p-4">
                    <div className="space-y-1">
                      {/* Week-off & Holiday Multipliers */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isWeekOffPay ? (
                          <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                            WO: {activeSal?.weekOffOtMultiplier || 2.0}x
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 text-[10px]">
                            WO: 1.0x (Flat)
                          </span>
                        )}

                        {isHolidayPay ? (
                          <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                            Hol: {activeSal?.holidayOtMultiplier || 2.5}x
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 text-[10px]">
                            Hol: 1.0x (Flat)
                          </span>
                        )}
                      </div>

                      {/* Regular Overtime */}
                      {isOtEnabled ? (
                        <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                          <Clock className="size-2.5" />
                          <span>
                            {activeSal?.otRateMode === "FIXED_RATE"
                              ? `OT: ₹${activeSal?.otFixedHourlyRate || 250}/hr`
                              : `OT: ${activeSal?.regularOtMultiplier || 1.5}x`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-zinc-500 italic block">✕ OT Exempt</span>
                      )}
                    </div>
                  </td>

                  {/* 6. Gross Pay */}
                  <td className="p-4 text-right font-mono font-semibold text-emerald-400">
                    {breakdown ? (
                      <div>
                        <span className="text-sm font-bold">{formatINR(breakdown.totalGross)}</span>
                        <span className="text-[10px] text-zinc-500 block font-sans">
                          {payType === "DAILY_WAGE"
                            ? "~26 days work"
                            : payType === "HOURLY"
                            ? "~160 hrs work"
                            : payType === "PIECE_RATE"
                            ? "~1,500 units"
                            : `(${formatINR(breakdown.totalGross * 12)} / yr)`}
                        </span>
                      </div>
                    ) : "—"}
                  </td>

                  {/* 7. Net Take-Home */}
                  <td className="p-4 text-right font-mono font-bold text-indigo-400">
                    {breakdown ? (
                      <div>
                        <span className="text-sm">{formatINR(breakdown.netPay)}</span>
                        <span className="text-[10px] text-zinc-400 font-normal block font-sans">
                          Net Pay
                        </span>
                      </div>
                    ) : "—"}
                  </td>

                  {/* 8. Actions */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setDetailEmp(emp);
                          setViewMonth("2026-08");
                        }}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold px-2.5"
                        title="View Month-wise Salary Breakdown"
                      >
                        <Eye className="size-3 text-indigo-400" /> View Salary
                      </button>

                      <button
                        onClick={() => handleOpenEditEmployee(emp)}
                        className="p-1.5 bg-blue-950/60 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg border border-blue-800/60 transition-colors flex items-center gap-1 text-[11px] font-semibold px-2"
                        title="Edit Employee & Salary Components"
                      >
                        <Edit className="size-3" /> Edit
                      </button>

                      <button
                        onClick={() => handleOpenRevise(emp)}
                        className="p-1.5 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-800/60 transition-colors flex items-center gap-1 text-[11px] font-semibold px-2"
                        title="Revise Rate / CTC Hike"
                      >
                        <TrendingUp className="size-3" /> Revise
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================================= */}
      {/* 1. ADD / EDIT EMPLOYEE & SALARY STRUCTURE MODAL */}
      {/* ============================================================= */}
      <Modal
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        title={isEditMode ? `Edit Employee & Salary Structure: ${empForm.name}` : "Add New Employee & Salary Structure"}
        description="Configure employee profile details, wage type, compensation rate, week-off/holiday extra pay multipliers, and select assigned salary components."
      >
        <form onSubmit={handleSaveEmployeeAndSalary} className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
          {/* SECTION 1: EMPLOYEE PROFILE DETAILS */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-3">
            <h4 className="font-bold text-zinc-200 text-xs flex items-center gap-2">
              <Users className="size-4 text-indigo-400" />
              1. Employee Profile Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Employee ID *</label>
                <input
                  type="text"
                  required
                  disabled={isEditMode}
                  value={empForm.id}
                  onChange={(e) => setEmpForm({ ...empForm, id: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-bold"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-400 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={empForm.name}
                  onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={empForm.email}
                  onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Department</label>
                <input
                  type="text"
                  value={empForm.department}
                  onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Designation</label>
                <input
                  type="text"
                  value={empForm.designation}
                  onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Category</label>
                <select
                  value={empForm.category}
                  onChange={(e) => setEmpForm({ ...empForm, category: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                >
                  <option value="WHITE_COLLAR">White Collar</option>
                  <option value="BLUE_COLLAR">Blue Collar</option>
                  <option value="MANAGEMENT">Management</option>
                  <option value="CONTRACTUAL">Contractual</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Sub-Category / Skill Grade</label>
                <select
                  value={empForm.subCategory}
                  onChange={(e) => setEmpForm({ ...empForm, subCategory: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                >
                  <option value="L1_JUNIOR">L1 - Junior / Associate</option>
                  <option value="L2_SENIOR">L2 - Senior Professional</option>
                  <option value="L3_LEAD">L3 - Lead / Architect</option>
                  <option value="HIGHLY_SKILLED">Highly Skilled Worker</option>
                  <option value="SKILLED">Skilled Worker</option>
                  <option value="SEMI_SKILLED">Semi-Skilled Worker</option>
                  <option value="UNSKILLED">Unskilled Worker</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Date of Joining</label>
                <input
                  type="date"
                  value={empForm.joiningDate}
                  onChange={(e) => setEmpForm({ ...empForm, joiningDate: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">PAN Number</label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={empForm.pan}
                  onChange={(e) => setEmpForm({ ...empForm, pan: e.target.value.toUpperCase() })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">UAN / EPF Number</label>
                <input
                  type="text"
                  placeholder="100987654321"
                  value={empForm.uan}
                  onChange={(e) => setEmpForm({ ...empForm, uan: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold">Bank Account Number</label>
                <input
                  type="text"
                  placeholder="Account Number"
                  value={empForm.bankAccount}
                  onChange={(e) => setEmpForm({ ...empForm, bankAccount: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: WAGE TYPE, COMPENSATION RATE & DURATION */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-3">
            <h4 className="font-bold text-zinc-200 text-xs flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-400" />
              2. Wage / Pay Type, Compensation Rate & Effective Duration
            </h4>

            {/* Pay Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "MONTHLY_SALARIED", label: "Monthly Salaried", desc: "Fixed CTC & LOP" },
                { id: "DAILY_WAGE", label: "Daily Wage", desc: "₹ / day present" },
                { id: "HOURLY", label: "Hourly Rate", desc: "₹ / logged hour" },
                { id: "PIECE_RATE", label: "Piece Rate", desc: "₹ / unit produced" },
              ].map((pt) => {
                const isSelected = empForm.payType === pt.id;
                return (
                  <div
                    key={pt.id}
                    onClick={() => setEmpForm({ ...empForm, payType: pt.id })}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500 text-zinc-100"
                        : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-bold text-zinc-200 text-xs">{pt.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{pt.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Rate Inputs */}
            {empForm.payType === "MONTHLY_SALARIED" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Annual CTC (₹ / year) *</label>
                  <input
                    type="number"
                    step="1000"
                    value={empForm.annualCTC}
                    onChange={(e) => setEmpForm({ ...empForm, annualCTC: +e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-400">Monthly CTC (₹ / mo)</label>
                  <input
                    type="number"
                    disabled
                    value={Math.round(empForm.annualCTC / 12)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 text-zinc-400 font-mono font-bold"
                  />
                </div>
              </div>
            )}

            {empForm.payType === "DAILY_WAGE" && (
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                <label className="font-semibold text-zinc-300">Daily Wage Rate (₹ / Day) *</label>
                <input
                  type="number"
                  step="10"
                  value={empForm.dailyRate}
                  onChange={(e) => setEmpForm({ ...empForm, dailyRate: +e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Estimated Monthly Gross at 26 Days = {formatINR(empForm.dailyRate * 26)}
                </span>
              </div>
            )}

            {empForm.payType === "HOURLY" && (
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                <label className="font-semibold text-zinc-300">Hourly Rate (₹ / Hour) *</label>
                <input
                  type="number"
                  step="10"
                  value={empForm.hourlyRate}
                  onChange={(e) => setEmpForm({ ...empForm, hourlyRate: +e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-cyan-400 font-mono font-bold"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Estimated Monthly at 160 Logged Hours = {formatINR(empForm.hourlyRate * 160)}
                </span>
              </div>
            )}

            {empForm.payType === "PIECE_RATE" && (
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                <label className="font-semibold text-zinc-300">Piece Production Rate (₹ / Unit) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={empForm.pieceRate}
                  onChange={(e) => setEmpForm({ ...empForm, pieceRate: +e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-purple-400 font-mono font-bold"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Estimated Monthly at 1,500 Units = {formatINR(empForm.pieceRate * 1500)}
                </span>
              </div>
            )}

            {/* Effective Duration (Effective From to Effective To) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Effective From Date *</label>
                <input
                  type="date"
                  required
                  value={empForm.effectiveFrom}
                  onChange={(e) => setEmpForm({ ...empForm, effectiveFrom: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Effective To Date (Optional)</label>
                <input
                  type="date"
                  placeholder="Ongoing / No End Date"
                  value={empForm.effectiveTo}
                  onChange={(e) => setEmpForm({ ...empForm, effectiveTo: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-mono"
                />
                <span className="text-[10px] text-zinc-500">Leave blank if currently ongoing</span>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Revision / Setup Reason</label>
                <input
                  type="text"
                  value={empForm.revisionReason}
                  onChange={(e) => setEmpForm({ ...empForm, revisionReason: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: WEEK-OFF & HOLIDAY WORK EXTRA PAY TOGGLERS + OVERTIME */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-4">
            <h4 className="font-bold text-zinc-200 text-xs flex items-center gap-2">
              <Sun className="size-4 text-amber-400" />
              3. Week-off / Holiday Work Extra Pay & Overtime Rules
            </h4>

            {/* 2 Clean Work Compensation Togglers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Week-off Work Extra Pay Toggle */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Coffee className="size-3.5 text-blue-400" />
                    <span className="font-semibold text-zinc-200 text-xs">Week-off Work Extra Pay</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empForm.weekOffPayEnabled}
                      onChange={(e) => setEmpForm({ ...empForm, weekOffPayEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {empForm.weekOffPayEnabled ? (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] text-zinc-400 block font-medium">Week-off Rate Multiplier</label>
                    <select
                      value={empForm.weekOffOtMultiplier}
                      onChange={(e) => setEmpForm({ ...empForm, weekOffOtMultiplier: +e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-blue-300 font-bold text-xs"
                    >
                      <option value="2.0">2.0x (Double Pay)</option>
                      <option value="1.5">1.5x (150% Wage)</option>
                      <option value="2.5">2.5x (Special Rate)</option>
                      <option value="1.0">1.0x (Standard Rate)</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500 italic pt-1">No extra multiplier; regular flat pay or comp-off.</p>
                )}
              </div>

              {/* 2. Holiday Work Extra Pay Toggle */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sun className="size-3.5 text-purple-400" />
                    <span className="font-semibold text-zinc-200 text-xs">Holiday Work Extra Pay</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empForm.holidayPayEnabled}
                      onChange={(e) => setEmpForm({ ...empForm, holidayPayEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {empForm.holidayPayEnabled ? (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] text-zinc-400 block font-medium">Holiday Rate Multiplier</label>
                    <select
                      value={empForm.holidayOtMultiplier}
                      onChange={(e) => setEmpForm({ ...empForm, holidayOtMultiplier: +e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-purple-300 font-bold text-xs"
                    >
                      <option value="2.5">2.5x (Festival Multiplier)</option>
                      <option value="2.0">2.0x (Double Pay)</option>
                      <option value="3.0">3.0x (Triple Pay)</option>
                      <option value="1.0">1.0x (Standard Rate)</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500 italic pt-1">No extra multiplier on declared holidays.</p>
                )}
              </div>
            </div>

            {/* Overtime Policy Card */}
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-emerald-400" />
                  <span className="font-bold text-zinc-200 text-xs">Standard Overtime Eligibility (Shift Extension)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={empForm.overtimeEnabled}
                    onChange={(e) => setEmpForm({ ...empForm, overtimeEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-[11px] font-semibold text-zinc-300">
                    {empForm.overtimeEnabled ? "OT Enabled" : "OT Ineligible"}
                  </span>
                </label>
              </div>

              {empForm.overtimeEnabled && (
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">OT Rate Mode</label>
                      <select
                        value={empForm.otRateMode}
                        onChange={(e) => setEmpForm({ ...empForm, otRateMode: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                      >
                        <option value="AUTO_MULTIPLIER">Auto Multipliers (from Base Wage)</option>
                        <option value="FIXED_RATE">Fixed Flat Rate (₹ / Hour)</option>
                      </select>
                    </div>

                    {empForm.otRateMode === "FIXED_RATE" ? (
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-400">Fixed OT Rate (₹ / Hour)</label>
                        <input
                          type="number"
                          step="10"
                          value={empForm.otFixedHourlyRate}
                          onChange={(e) => setEmpForm({ ...empForm, otFixedHourlyRate: +e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-400 font-mono font-bold"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-400">Normal Day Multiplier</label>
                        <select
                          value={empForm.regularOtMultiplier}
                          onChange={(e) => setEmpForm({ ...empForm, regularOtMultiplier: +e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 font-semibold"
                        >
                          <option value="1.5">1.5x (Standard Shift Extension)</option>
                          <option value="2.0">2.0x (Factories Act Double)</option>
                          <option value="1.0">1.0x (Single Flat)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block">Monthly Capping</span>
                      <select
                        value={empForm.maxMonthlyHoursCap}
                        onChange={(e) => setEmpForm({ ...empForm, maxMonthlyHoursCap: +e.target.value })}
                        className="w-full bg-transparent text-xs text-cyan-300 font-bold outline-none mt-1 cursor-pointer"
                      >
                        <option value="50">50 Hours Cap</option>
                        <option value="40">40 Hours Cap</option>
                        <option value="60">60 Hours Cap</option>
                        <option value="0">No Capping</option>
                      </select>
                    </div>

                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block">Rounding Rule</span>
                      <select
                        value={empForm.otRoundingRule}
                        onChange={(e) => setEmpForm({ ...empForm, otRoundingRule: e.target.value })}
                        className="w-full bg-transparent text-xs text-zinc-200 font-bold outline-none mt-1 cursor-pointer"
                      >
                        <option value="NEAREST_15_MIN">15m Split (Quarter Hour)</option>
                        <option value="NEAREST_30_MIN">30m Split</option>
                        <option value="EXACT">Exact Mins</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: SALARY COMPONENTS ASSIGNMENT (TEMPLATE VS INDEPENDENT) */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="font-bold text-zinc-200 text-xs flex items-center gap-2">
                  <Layers className="size-4 text-purple-400" />
                  4. Salary Components Assignment (Template & Independent)
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Select a template to auto-fill standard components, or pick and configure components independently.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setComponentSelectionMode("TEMPLATE")}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    componentSelectionMode === "TEMPLATE"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Template Mode
                </button>
                <button
                  type="button"
                  onClick={() => setComponentSelectionMode("INDEPENDENT")}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    componentSelectionMode === "INDEPENDENT"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Independent Mode
                </button>
              </div>
            </div>

            {/* Template Selector Row */}
            {componentSelectionMode === "TEMPLATE" && (
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                <span className="text-zinc-300 font-semibold whitespace-nowrap text-xs">Choose Master Template:</span>
                <select
                  value={empForm.templateId}
                  onChange={(e) => handleTemplateChangeInForm(e.target.value)}
                  className="w-full sm:w-80 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 font-semibold text-xs outline-none focus:border-indigo-500"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.code || tpl.id})
                    </option>
                  ))}
                  <option value="CUSTOM">Custom (No Template)</option>
                </select>
              </div>
            )}

            {/* Type-wise Components Grid */}
            <div className="space-y-4 pt-1">
              {/* 1. EARNINGS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <span>🟢 Earnings & Allowances</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {empForm.assignedComponents.filter((c) => earningComponents.some((ec) => ec.id === (c.componentId || c.id))).length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {earningComponents.map((comp) => {
                    const isChecked = empForm.assignedComponents.some((c) => (c.componentId || c.id) === comp.id);
                    return (
                      <div
                        key={comp.id}
                        onClick={() => handleToggleComponentInForm(comp)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-200"
                            : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`size-4 rounded flex items-center justify-center border ${
                              isChecked ? "bg-emerald-600 border-emerald-500 text-white" : "border-zinc-700 bg-zinc-900"
                            }`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-zinc-200 block">{comp.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {comp.calculationMethod === "PERCENTAGE"
                                ? `${comp.value}% of ${comp.percentageBaseType || "CTC"}`
                                : comp.calculationMethod === "BALANCE"
                                ? "Balancing Amount"
                                : `Fixed ₹${comp.value}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. DEDUCTIONS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  <span>🔴 Employee Statutory & Other Deductions</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {empForm.assignedComponents.filter((c) => deductionComponents.some((dc) => dc.id === (c.componentId || c.id))).length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {deductionComponents.map((comp) => {
                    const isChecked = empForm.assignedComponents.some((c) => (c.componentId || c.id) === comp.id);
                    return (
                      <div
                        key={comp.id}
                        onClick={() => handleToggleComponentInForm(comp)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-rose-950/30 border-rose-800/80 text-rose-200"
                            : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`size-4 rounded flex items-center justify-center border ${
                              isChecked ? "bg-rose-600 border-rose-500 text-white" : "border-zinc-700 bg-zinc-900"
                            }`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-zinc-200 block">{comp.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {comp.calculationMethod === "PERCENTAGE"
                                ? `${comp.value}% deduction`
                                : `Fixed ₹${comp.value}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. EMPLOYER CONTRIBUTIONS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  <span>🟣 Employer Contributions (CTC Cost)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {empForm.assignedComponents.filter((c) => employerCostComponents.some((ec) => ec.id === (c.componentId || c.id))).length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {employerCostComponents.map((comp) => {
                    const isChecked = empForm.assignedComponents.some((c) => (c.componentId || c.id) === comp.id);
                    return (
                      <div
                        key={comp.id}
                        onClick={() => handleToggleComponentInForm(comp)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-purple-950/30 border-purple-800/80 text-purple-200"
                            : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`size-4 rounded flex items-center justify-center border ${
                              isChecked ? "bg-purple-600 border-purple-500 text-white" : "border-zinc-700 bg-zinc-900"
                            }`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-zinc-200 block">{comp.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {comp.calculationMethod === "PERCENTAGE"
                                ? `${comp.value}% contribution`
                                : `Fixed ₹${comp.value}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setEmployeeModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
            >
              <CheckCircle2 className="size-4" />
              {isEditMode ? "Save Changes" : "Create Employee & Assign Salary"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================= */}
      {/* 2. REVISE RATE / CTC MODAL (Quick Increment / Hike) */}
      {/* ============================================================= */}
      <Modal
        isOpen={reviseModalOpen}
        onClose={() => setReviseModalOpen(false)}
        title="Revise Compensation & Increment"
        description="Quickly adjust CTC / Hourly / Daily / Piece-rate with synchronized percentage hike."
      >
        <form onSubmit={handleSaveRevision} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Select Employee *</label>
            <select
              required
              value={reviseForm.employeeId}
              onChange={(e) => {
                const empId = e.target.value;
                const emp = employees.find((x) => x.id === empId);
                const activeSalary = storageService.getActiveSalaryForEmployee(empId);
                const payType = activeSalary?.payType || emp?.payType || "MONTHLY_SALARIED";
                const currentCTC = activeSalary?.annualCTC || 720000;
                const currentRate =
                  payType === "DAILY_WAGE"
                    ? activeSalary?.dailyRate || 650
                    : payType === "HOURLY"
                    ? activeSalary?.hourlyRate || 350
                    : payType === "PIECE_RATE"
                    ? activeSalary?.pieceRate || 15
                    : currentCTC;

                const newAnnualCTC = Math.round(currentCTC * (1 + reviseForm.hikePercentage / 100));
                const newRate = Math.round(currentRate * (1 + reviseForm.hikePercentage / 100));

                setReviseForm({
                  ...reviseForm,
                  employeeId: empId,
                  payType,
                  currentCTC,
                  currentMonthlyCTC: Math.round(currentCTC / 12),
                  currentRate,
                  newRate,
                  templateId: activeSalary ? activeSalary.templateId : templates[0]?.id || "",
                  newAnnualCTC,
                  newMonthlyCTC: Math.round(newAnnualCTC / 12),
                });
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-indigo-500 font-semibold"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id} - {emp.category} - {emp.designation})
                </option>
              ))}
            </select>
          </div>

          {/* Current Compensation Snapshot */}
          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Current Active Rate</span>
              <span className="text-sm font-bold font-mono text-zinc-200">
                {reviseForm.payType === "MONTHLY_SALARIED"
                  ? `${formatINR(reviseForm.currentCTC)} / yr`
                  : reviseForm.payType === "DAILY_WAGE"
                  ? `${formatINR(reviseForm.currentRate)} / day`
                  : reviseForm.payType === "HOURLY"
                  ? `${formatINR(reviseForm.currentRate)} / hr`
                  : `${formatINR(reviseForm.currentRate)} / unit`}
              </span>
              {reviseForm.payType === "MONTHLY_SALARIED" && (
                <span className="text-[11px] text-zinc-400 ml-2">
                  ({formatINR(reviseForm.currentMonthlyCTC)} / mo)
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Pay Type</span>
              <span className="text-xs font-semibold text-indigo-300">
                {reviseForm.payType.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Hike % & Rate Inputs */}
          {reviseForm.payType === "MONTHLY_SALARIED" ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 flex items-center gap-1">
                  <Percent className="size-3.5 text-emerald-400" />
                  Hike %
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={reviseForm.hikePercentage}
                  onChange={(e) => {
                    const p = parseFloat(e.target.value) || 0;
                    const newCTC = Math.round(reviseForm.currentCTC * (1 + p / 100));
                    setReviseForm({
                      ...reviseForm,
                      hikePercentage: p,
                      newAnnualCTC: newCTC,
                      newMonthlyCTC: Math.round(newCTC / 12),
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Revised Annual CTC (₹/yr) *</label>
                <input
                  type="number"
                  required
                  value={reviseForm.newAnnualCTC}
                  onChange={(e) => {
                    const newCTC = Number(e.target.value) || 0;
                    const diff = newCTC - reviseForm.currentCTC;
                    const p = reviseForm.currentCTC > 0 ? ((diff / reviseForm.currentCTC) * 100).toFixed(2) : 0;
                    setReviseForm({
                      ...reviseForm,
                      newAnnualCTC: newCTC,
                      newMonthlyCTC: Math.round(newCTC / 12),
                      hikePercentage: parseFloat(p),
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Revised Monthly CTC (₹/mo)</label>
                <input
                  type="number"
                  required
                  step="100"
                  value={reviseForm.newMonthlyCTC}
                  onChange={(e) => {
                    const mCTC = Number(e.target.value) || 0;
                    const newCTC = mCTC * 12;
                    const diff = newCTC - reviseForm.currentCTC;
                    const p = reviseForm.currentCTC > 0 ? ((diff / reviseForm.currentCTC) * 100).toFixed(2) : 0;
                    setReviseForm({
                      ...reviseForm,
                      newAnnualCTC: newCTC,
                      newMonthlyCTC: mCTC,
                      hikePercentage: parseFloat(p),
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 flex items-center gap-1">
                  <Percent className="size-3.5 text-emerald-400" />
                  Increment %
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={reviseForm.hikePercentage}
                  onChange={(e) => {
                    const p = parseFloat(e.target.value) || 0;
                    const newR = Math.round(reviseForm.currentRate * (1 + p / 100));
                    setReviseForm({
                      ...reviseForm,
                      hikePercentage: p,
                      newRate: newR,
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">
                  New Rate ({reviseForm.payType === "DAILY_WAGE" ? "₹ / Day" : reviseForm.payType === "HOURLY" ? "₹ / Hour" : "₹ / Unit"}) *
                </label>
                <input
                  type="number"
                  required
                  step="1"
                  value={reviseForm.newRate}
                  onChange={(e) => {
                    const nR = Number(e.target.value) || 0;
                    const diff = nR - reviseForm.currentRate;
                    const p = reviseForm.currentRate > 0 ? ((diff / reviseForm.currentRate) * 100).toFixed(2) : 0;
                    setReviseForm({
                      ...reviseForm,
                      newRate: nR,
                      hikePercentage: parseFloat(p),
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Effective From Date *</label>
              <input
                type="date"
                required
                value={reviseForm.effectiveFrom}
                onChange={(e) => setReviseForm({ ...reviseForm, effectiveFrom: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Revision Reason</label>
              <input
                type="text"
                value={reviseForm.revisionReason}
                onChange={(e) => setReviseForm({ ...reviseForm, revisionReason: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setReviseModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/15 flex items-center gap-2"
            >
              <TrendingUp className="size-4" />
              Confirm & Save Revision
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================= */}
      {/* 3. MONTH-WISE SALARY VIEW MODAL (Historical Duration Resolution) */}
      {/* ============================================================= */}
      {detailEmp && (
        <Modal
          isOpen={!!detailEmp}
          onClose={() => setDetailEmp(null)}
          title={`Salary Structure & Month-wise Breakdown: ${detailEmp.name}`}
          description={`${detailEmp.id} • ${detailEmp.category || "WHITE_COLLAR"} • ${detailEmp.designation} (${detailEmp.department})`}
        >
          <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Month Selector Bar & Effective History Resolution */}
            <div className="p-3.5 bg-zinc-950/90 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-indigo-400" />
                <span className="text-zinc-300 font-semibold">Select Payroll Month to View:</span>
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-100 font-bold px-3 py-1.5 rounded-lg outline-none focus:border-indigo-500 font-mono text-xs"
                >
                  <option value="2026-08">August 2026 (Active Period)</option>
                  <option value="2026-07">July 2026</option>
                  <option value="2026-06">June 2026</option>
                  <option value="2026-05">May 2026</option>
                  <option value="2026-04">April 2026</option>
                  <option value="2026-01">January 2026</option>
                  <option value="2025-10">October 2025 (Historical)</option>
                  <option value="2025-04">April 2025 (Initial)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const emp = detailEmp;
                    setDetailEmp(null);
                    handleOpenEditEmployee(emp);
                  }}
                  className="px-3 py-1.5 bg-blue-950/60 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-800/60 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-[11px]"
                >
                  <Edit className="size-3.5" />
                  Edit Structure
                </button>
              </div>
            </div>

            {/* Resolved Effective Structure Banner */}
            {selectedMonthSalary && (
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 uppercase font-bold text-[10px]">Active in {viewMonth}:</span>
                  <span className="font-bold text-zinc-100 font-mono">
                    {selectedMonthSalary.payType.replace("_", " ")}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {selectedMonthSalary.payType === "MONTHLY_SALARIED"
                      ? `${formatINR(selectedMonthSalary.annualCTC)} / yr`
                      : selectedMonthSalary.payType === "DAILY_WAGE"
                      ? `${formatINR(selectedMonthSalary.dailyRate)} / day`
                      : selectedMonthSalary.payType === "HOURLY"
                      ? `${formatINR(selectedMonthSalary.hourlyRate)} / hr`
                      : `${formatINR(selectedMonthSalary.pieceRate)} / unit`}
                  </span>
                </div>
                <span className="text-zinc-400 font-mono text-[10px]">
                  Duration: {formatDate(selectedMonthSalary.effectiveFrom)} {selectedMonthSalary.effectiveTo ? `to ${formatDate(selectedMonthSalary.effectiveTo)}` : "→ Present"}
                </span>
              </div>
            )}

            {/* Compensation KPIs in Selected Month */}
            {selectedMonthSalary && detailBreakdown && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Base Compensation</span>
                  <div className="font-mono font-bold text-zinc-100 text-sm mt-0.5">
                    {selectedMonthSalary.payType === "MONTHLY_SALARIED"
                      ? formatINR(selectedMonthSalary.annualCTC)
                      : selectedMonthSalary.payType === "DAILY_WAGE"
                      ? `${formatINR(selectedMonthSalary.dailyRate)}/day`
                      : selectedMonthSalary.payType === "HOURLY"
                      ? `${formatINR(selectedMonthSalary.hourlyRate)}/hr`
                      : `${formatINR(selectedMonthSalary.pieceRate)}/unit`}
                  </div>
                  {selectedMonthSalary.payType === "MONTHLY_SALARIED" && (
                    <span className="text-[10px] text-zinc-500">
                      ({formatINR(Math.round(selectedMonthSalary.annualCTC / 12))} / mo)
                    </span>
                  )}
                </div>
                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Monthly Gross</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                    {formatINR(detailBreakdown.totalGross)}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    ({formatINR(detailBreakdown.totalGross * 12)} / yr)
                  </span>
                </div>
                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Monthly Deductions</span>
                  <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">
                    {formatINR(detailBreakdown.totalDeductions)}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    ({formatINR(detailBreakdown.totalDeductions * 12)} / yr)
                  </span>
                </div>
                <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Est. Take-Home</span>
                  <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                    {formatINR(detailBreakdown.netPay)}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    ({formatINR(detailBreakdown.netPay * 12)} / yr)
                  </span>
                </div>
              </div>
            )}

            {/* Policy Snapshot Card */}
            {selectedMonthSalary && (
              <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sun className="size-3.5 text-amber-400" />
                    Work Extra Pay & Overtime Configuration
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      WO Extra Pay: {selectedMonthSalary.weekOffPayEnabled !== false ? `${selectedMonthSalary.weekOffOtMultiplier || 2.0}x` : "Disabled"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      Holiday Extra Pay: {selectedMonthSalary.holidayPayEnabled !== false ? `${selectedMonthSalary.holidayOtMultiplier || 2.5}x` : "Disabled"}
                    </span>
                  </div>
                </div>

                {selectedMonthSalary.overtimeEnabled !== false ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-zinc-300">
                    <div className="p-2 bg-zinc-900 rounded-lg">
                      <span className="text-[10px] text-zinc-500 block">Regular Shift OT:</span>
                      <strong className="text-emerald-400">
                        {selectedMonthSalary.otRateMode === "FIXED_RATE"
                          ? `₹${selectedMonthSalary.otFixedHourlyRate}/hr`
                          : `${selectedMonthSalary.regularOtMultiplier || 1.5}x Rate`}
                      </strong>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded-lg">
                      <span className="text-[10px] text-zinc-500 block">Monthly Capping:</span>
                      <strong className="text-cyan-400">{selectedMonthSalary.maxMonthlyHoursCap || 50} Hours Max</strong>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded-lg">
                      <span className="text-[10px] text-zinc-500 block">Rounding Rule:</span>
                      <strong className="text-amber-400">{selectedMonthSalary.otRoundingRule === "NEAREST_15_MIN" ? "15m Split" : "30m Split"}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 italic">
                    This executive / lead role is exempt from overtime compensation.
                  </p>
                )}
              </div>
            )}

            {/* Assigned Component Breakdown Table */}
            {detailBreakdown && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Layers className="size-3.5 text-indigo-400" />
                    Assigned Component Breakdown ({selectedTemplate?.name || "Active Structure"})
                  </h4>
                  <span className="text-zinc-500 text-[11px]">
                    Template: <strong className="text-zinc-300">{selectedTemplate?.name}</strong>
                  </span>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-semibold uppercase text-[10px]">
                        <th className="p-3">Component</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-right">Monthly (₹)</th>
                        <th className="p-3 text-right">Annual (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {detailBreakdown.earnings.map((c) => (
                        <tr key={c.id || c.componentId} className="hover:bg-zinc-900/40">
                          <td className="p-3 font-semibold text-zinc-200">{c.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${TYPE_COLORS.EARNING}`}>
                              Earning
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">
                            {formatINR(c.amount)}
                          </td>
                          <td className="p-3 text-right font-mono text-zinc-400">
                            {formatINR(c.annualAmount || c.amount * 12)}
                          </td>
                        </tr>
                      ))}

                      {detailBreakdown.deductions.map((c) => (
                        <tr key={c.id || c.componentId} className="hover:bg-zinc-900/40">
                          <td className="p-3 font-semibold text-zinc-200">{c.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${TYPE_COLORS.DEDUCTION}`}>
                              Deduction
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-rose-400">
                            {formatINR(c.amount)}
                          </td>
                          <td className="p-3 text-right font-mono text-zinc-400">
                            {formatINR(c.annualAmount || c.amount * 12)}
                          </td>
                        </tr>
                      ))}

                      {detailBreakdown.employerContributions.map((c) => (
                        <tr key={c.id || c.componentId} className="hover:bg-zinc-900/40">
                          <td className="p-3 font-semibold text-zinc-200">{c.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${TYPE_COLORS.EMPLOYER_CONTRIBUTION}`}>
                              Employer Contribution
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-purple-400">
                            {formatINR(c.amount)}
                          </td>
                          <td className="p-3 text-right font-mono text-zinc-400">
                            {formatINR(c.annualAmount || c.amount * 12)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Revision History */}
            <div className="space-y-3">
              <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <History className="size-3.5 text-indigo-400" />
                Salary Revision History ({empHistory.length} versions)
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {empHistory.map((rev, idx) => {
                  const revTpl = tplMap.get(rev.templateId);
                  const isCurrent = rev.status === "ACTIVE";
                  return (
                    <div
                      key={rev.id}
                      className={`p-3 rounded-xl border flex justify-between items-center ${
                        isCurrent
                          ? "bg-zinc-900/80 border-indigo-500/40"
                          : "bg-zinc-950/40 border-zinc-800/60 opacity-60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCurrent
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {isCurrent ? "Current Active" : `Version ${empHistory.length - idx}`}
                          </span>
                          <span className="font-bold text-zinc-200 font-mono">
                            {rev.payType === "MONTHLY_SALARIED"
                              ? `${formatINR(rev.annualCTC)} / yr`
                              : rev.payType === "DAILY_WAGE"
                              ? `${formatINR(rev.dailyRate)} / day`
                              : rev.payType === "HOURLY"
                              ? `${formatINR(rev.hourlyRate)} / hr`
                              : `${formatINR(rev.pieceRate)} / unit`}
                          </span>
                          <span className="text-zinc-500 text-xs">•</span>
                          <span className="text-zinc-400 font-semibold">{revTpl?.name || rev.templateId}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          {rev.revisionReason || "Structure initialized"}
                        </p>
                      </div>

                      <div className="text-right font-mono text-[11px] text-zinc-400">
                        <span>Duration: {formatDate(rev.effectiveFrom)} {rev.effectiveTo ? `to ${formatDate(rev.effectiveTo)}` : "→ Present"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800">
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
    </div>
  );
}
