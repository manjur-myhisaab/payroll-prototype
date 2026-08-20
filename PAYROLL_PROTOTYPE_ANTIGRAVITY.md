# Payroll Prototype --- Product & Development Specification

## 1. Project Goal

Build a professional, Zoho Payroll-inspired **Payroll Management
Prototype** using:

-   React
-   Vite
-   JavaScript
-   React Router
-   Tailwind CSS
-   LocalStorage
-   Context API or Zustand
-   Reusable components
-   Centralized payroll calculation/business logic

This is a **frontend-first prototype**. No Laravel/MySQL/API is required
initially.

The prototype must behave like a real payroll application so that later
LocalStorage can be replaced with Laravel APIs and MySQL without
redesigning the product architecture.

------------------------------------------------------------------------

# 2. Core Business Concept

The payroll system follows this hierarchy:

``` text
Salary Components
        ↓
Salary Template
        ↓
Employee Salary Assignment
        ↓
Salary Breakdown
        ↓
Monthly Payroll Run
        ↓
Attendance / Leave / Overtime / Incentive / Loan
        ↓
Payroll Calculation
        ↓
Gross Salary
        ↓
Employee Deductions
        ↓
Net Pay
```

Employer-side contributions are separate from employee earnings and
deductions:

``` text
Gross Earnings
        +
Employer Contributions
        +
Other CTC Benefits
        =
CTC
```

And:

``` text
Gross Earnings
        -
Employee Deductions
        =
Net Pay
```

Important distinction:

-   Salary Component = reusable building block/rule
-   Salary Template = collection of salary components and their rules
-   Employee Salary = a template assigned to an employee with actual
    CTC/salary values
-   Payroll Run = actual salary calculation for a specific payroll
    period

------------------------------------------------------------------------

# 3. Prototype Scope

## Phase 1 --- Core

Build these modules first:

1.  Dashboard
2.  Salary Components
3.  Salary Templates
4.  Employee Salaries
5.  Payroll Runs
6.  Overtime
7.  Incentives & Bonuses
8.  Loans & Advances
9.  Payslips
10. Reports
11. Settings

Future/advanced modules:

-   Reimbursements
-   Statutory configuration
-   Payments
-   Tax declarations
-   Advanced reports
-   Full & Final Settlement
-   Arrears
-   Salary revision workflows
-   Bank/payment integrations

Do not overbuild advanced statutory logic in the first prototype. Use
configurable placeholder/rule-based logic where appropriate.

------------------------------------------------------------------------

# 4. Admin Sidebar

The admin sidebar should contain:

``` text
Dashboard

Salary Components
Salary Templates
Employee Salaries

Payroll
  ├── Payroll Runs
  ├── Draft Payroll
  ├── Processed Payroll
  └── Payroll History

Overtime
Incentives & Bonuses
Loans & Advances

Payslips
Reports
Settings
```

The navigation should be clean, professional and scalable.

------------------------------------------------------------------------

# 5. Dashboard

## Purpose

Give the payroll administrator a quick overview of the current payroll
state.

## KPI Cards

Show:

-   Total Employees
-   Employees with Salary
-   Employees Missing Salary Structure
-   Current Month Payroll
-   Total Gross
-   Total Deductions
-   Total Employer Contributions
-   Total Net Pay
-   Total CTC

## Payroll Status

Example:

``` text
August 2026
Draft
Processing
Approved
Paid
```

## Alerts

Examples:

-   Employees without salary structure
-   Employees with missing salary information
-   Payroll calculation errors
-   Pending overtime approval
-   Pending incentive approval
-   Pending loan deduction
-   Payroll awaiting approval

## Recent Payroll Runs

Columns:

-   Payroll Month
-   Employees
-   Gross
-   Deductions
-   Net Pay
-   Status
-   Created Date
-   Actions

------------------------------------------------------------------------

# 6. Salary Components

## Purpose

Salary Components are the reusable building blocks of payroll.

Examples:

### Earnings

-   Basic Salary
-   HRA
-   Conveyance Allowance
-   Special Allowance
-   Medical Allowance
-   Internet Allowance
-   Overtime
-   Incentive
-   Bonus
-   Commission

### Deductions

-   Employee PF
-   ESI
-   Professional Tax
-   TDS
-   Loan EMI
-   LOP
-   Other Deduction

### Employer Contributions / CTC Components

-   Employer PF
-   Employer ESI
-   Gratuity
-   Employer Insurance
-   Other Benefits

------------------------------------------------------------------------

# 7. Salary Component Fields

Each component should support:

``` text
Name
Code
Category / Type
Calculation Method
Value / Percentage
Based On
Tax Treatment
Recurring
Effective From
Effective To
Status
Description
```

## Name

Human-readable name.

Example:

``` text
House Rent Allowance
```

## Code

Unique machine-readable identifier.

Examples:

``` text
BASIC
HRA
EPF
EMPLOYER_PF
PT
TDS
```

Codes should be unique per tenant/company.

## Category / Type

Use at least:

``` text
EARNING
DEDUCTION
EMPLOYER_CONTRIBUTION
BENEFIT
```

## Calculation Method

Support:

``` text
FIXED
PERCENTAGE
PER_DAY
PER_HOUR
FORMULA
RULE
BALANCE
```

Examples:

``` text
Basic = Fixed
HRA = 40% of Basic
Overtime = Hours × Rate
LOP = Unpaid Days × Per Day Salary
Special Allowance = Balance
Employer PF = Rule
```

## Value / Percentage

For fixed:

``` text
₹25,000
```

For percentage:

``` text
40%
```

## Based On

For percentage/formula/rule components.

Examples:

``` text
Basic Salary
Gross Salary
Basic + HRA
PF Wage
Working Days
Overtime Hours
```

## Tax Treatment

Keep this configurable.

Possible prototype values:

``` text
TAXABLE
EXEMPT
PARTIALLY_EXEMPT
RULE_BASED
NOT_APPLICABLE
```

Do not hard-code complicated Indian tax law into individual React
components.

## Recurring

Boolean:

``` text
Yes
No
```

Example:

-   Basic = Yes
-   HRA = Yes
-   Monthly Bonus = No

## Effective From / To

Required for historical salary/rule changes.

Example:

``` text
01-Apr-2026 → 30-Jun-2026
01-Jul-2026 → NULL
```

Never overwrite historical payroll configuration if a new effective
period is needed.

## Status

``` text
ACTIVE
INACTIVE
```

Prefer deactivation instead of deletion when the component has
historical usage.

------------------------------------------------------------------------

# 8. Salary Component UI

Create page:

``` text
Payroll → Salary Components
```

List view columns:

-   Name
-   Code
-   Type
-   Calculation
-   Based On
-   Recurring
-   Effective From
-   Status
-   Actions

Actions:

-   View
-   Edit
-   Duplicate
-   Activate/Deactivate

Create/Edit form:

``` text
Component Name
Component Code
Component Type
Calculation Method
Amount / Percentage
Based On
Tax Treatment
Recurring
Effective From
Effective To
Description
Status
```

Use conditional form fields.

For example:

If Calculation Method = PERCENTAGE:

Show:

``` text
Percentage
Based On
```

If FIXED:

Show:

``` text
Amount
```

If FORMULA:

Show formula builder/preview.

------------------------------------------------------------------------

# 9. Salary Templates

## Purpose

A Salary Template combines multiple Salary Components into a reusable
salary structure.

Example:

``` text
Developer Standard

Basic Salary
HRA
Special Allowance
Employer PF
Gratuity
Benefits
```

## Template Fields

``` text
Template Name
Code
Description
Salary Basis
Components
Effective From
Effective To
Status
```

## Salary Basis

Prototype should support:

``` text
CTC_BASED
GROSS_BASED
MANUAL
```

Future:

``` text
HOURLY
DAILY
```

------------------------------------------------------------------------

# 10. Template Component Rules

Each selected component should have configuration.

Example:

``` text
Basic
Calculation: 50% of Gross

HRA
Calculation: 40% of Basic

Special Allowance
Calculation: Balance

Employer PF
Calculation: Rule

Gratuity
Calculation: Rule
```

The template should not duplicate the global component master
unnecessarily.

Instead it references a component and stores template-specific
configuration/overrides.

Example conceptual structure:

``` text
Template
  └── Template Components
        ├── componentId
        ├── calculationMethod
        ├── value
        ├── basedOn
        ├── priority
        └── override settings
```

------------------------------------------------------------------------

# 11. Salary Calculation Order

Calculation order is important.

Example:

``` text
1. Basic
2. HRA
3. Other Earnings
4. Employer Contributions
5. Gross
6. Employee Deductions
7. Net Pay
8. CTC
```

But dependency should be handled by the calculation engine rather than
blindly relying on array order.

Example:

``` text
HRA depends on BASIC
```

Therefore BASIC must be available before HRA is evaluated.

Store a `priority` or dependency information for the prototype.

------------------------------------------------------------------------

# 12. Employee Salaries

## Purpose

Assign a salary template to an employee and configure actual salary/CTC.

Example:

``` text
Employee:
Rahul Sharma

Template:
Developer Standard

Annual CTC:
₹6,00,000

Effective From:
01-Aug-2026
```

The system calculates and displays the breakdown.

## Employee Salary Page

Sections:

### Salary Overview

``` text
Annual CTC
Monthly CTC
Salary Template
Effective From
Current Status
```

### Earnings

``` text
Basic
HRA
Special Allowance
Other Earnings
Gross Salary
```

### Employer Contributions

``` text
Employer PF
Gratuity
Benefits
Employer Cost
```

### Deductions Preview

``` text
Employee PF
PT
TDS
Loan
Other Deductions
```

### Net Pay Preview

``` text
Gross
- Deductions
= Estimated Net Pay
```

------------------------------------------------------------------------

# 13. Salary History

Never overwrite historical salary assignments.

Example:

``` text
Rahul Sharma

01-Apr-2026
CTC: ₹6,00,000
Template: Developer Standard

01-Jul-2026
CTC: ₹7,20,000
Template: Senior Developer
```

The system must preserve historical salary versions.

Payroll for April/May/June must continue using the historical salary
applicable to those periods.

------------------------------------------------------------------------

# 14. Salary Breakdown Example

Employee:

``` text
Rahul Sharma
Annual CTC: ₹6,00,000
Monthly CTC: ₹50,000
```

Example breakdown:

``` text
Earnings
-------------------------
Basic                 ₹25,000
HRA                   ₹10,000
Special                ₹7,000
-------------------------
Gross                 ₹42,000

Employer Contributions
-------------------------
Employer PF            ₹3,000
Gratuity               ₹1,000
Other Benefit          ₹4,000
-------------------------
Employer Cost          ₹8,000

Monthly CTC            ₹50,000
```

Then employee deductions:

``` text
Employee PF            ₹3,000
Professional Tax         ₹200
TDS                      ₹500
Loan EMI               ₹2,000
-------------------------
Total Deductions       ₹5,700
```

Net:

``` text
₹42,000 - ₹5,700
= ₹36,300
```

The prototype should label this as an illustrative calculation. Actual
statutory rules should be configurable.

------------------------------------------------------------------------

# 15. Payroll Runs

## Purpose

A Payroll Run represents payroll for a specific period.

Example:

``` text
August 2026 Payroll
```

Flow:

``` text
Create Payroll Run
       ↓
Select Payroll Period
       ↓
Fetch Employees
       ↓
Fetch Salary
       ↓
Fetch Attendance
       ↓
Fetch Leave
       ↓
Fetch Overtime
       ↓
Fetch Incentives
       ↓
Fetch Loans
       ↓
Calculate Payroll
       ↓
Draft
       ↓
Review
       ↓
Approve
       ↓
Lock
       ↓
Payslips
```

------------------------------------------------------------------------

# 16. Payroll Run Status

Use:

``` text
DRAFT
CALCULATING
READY_FOR_REVIEW
APPROVED
LOCKED
PAID
CANCELLED
```

For the first prototype, at minimum:

``` text
DRAFT
PROCESSING
APPROVED
PAID
```

------------------------------------------------------------------------

# 17. Payroll Calculation

For every employee:

``` text
Employee Salary
      +
Variable Earnings
      -
Employee Deductions
      =
Net Pay
```

Employer-side:

``` text
Gross Earnings
      +
Employer Contributions
      +
CTC Benefits
      =
CTC / Employer Cost
```

Payroll calculation should be centralized in:

``` text
src/utils/payrollCalculator.js
```

Do not duplicate calculations inside page components.

------------------------------------------------------------------------

# 18. Attendance Integration

Payroll should consume attendance data.

Inputs may include:

``` text
Working Days
Present Days
Absent Days
Paid Leave
Unpaid Leave
Half Days
LOP Days
```

Example:

``` text
Monthly Salary = ₹30,000
Payroll Days = 30
LOP = 2 days
```

Illustrative LOP:

``` text
Per Day = ₹30,000 / 30
        = ₹1,000

LOP = ₹1,000 × 2
    = ₹2,000
```

Make the divisor configurable in Settings.

------------------------------------------------------------------------

# 19. Overtime

Fields:

``` text
Employee
Payroll Period
OT Date
Hours
Rate
Amount
Status
```

Example:

``` text
OT Hours = 10
Rate = ₹250/hour
OT Amount = ₹2,500
```

OT should flow into payroll as an earning.

------------------------------------------------------------------------

# 20. Incentives & Bonuses

Support:

``` text
Employee
Type
Amount
Percentage
Reason
Period
Status
```

Examples:

``` text
Performance Incentive = ₹5,000
Sales Commission = ₹10,000
Festival Bonus = ₹8,000
```

Approved variable earnings flow into payroll.

------------------------------------------------------------------------

# 21. Loans & Advances

Fields:

``` text
Employee
Loan Type
Principal Amount
Start Date
Tenure
EMI
Remaining Balance
Status
```

Example:

``` text
Loan = ₹60,000
Tenure = 12 months
EMI = ₹5,000
```

Payroll automatically deducts the EMI for applicable periods.

When remaining balance reaches zero, deduction stops.

------------------------------------------------------------------------

# 22. Payslips

Payslip should show:

``` text
Company Information

Employee Information

Payroll Period

Attendance Summary

Earnings
  Basic
  HRA
  Allowances
  OT
  Incentive

Gross Earnings

Employee Deductions
  PF
  PT
  TDS
  Loan
  LOP

Net Pay

Employer Contributions
```

Actions:

-   View
-   Print
-   Download PDF
-   Send/mark sent

For the prototype, PDF can be added after the core payroll calculation
is stable.

------------------------------------------------------------------------

# 23. Reports

Prototype reports:

``` text
Payroll Summary
Salary Register
Employee Salary Report
Gross vs Net Report
Deduction Report
Employer Contribution Report
Overtime Report
Incentive Report
Loan Deduction Report
```

Filters:

``` text
Month
Department
Employee
Designation
Status
```

Exports can initially be CSV/Excel.

------------------------------------------------------------------------

# 24. Settings

Payroll Settings:

``` text
Payroll Frequency
Payroll Period
Salary Payment Day
Working Days
LOP Calculation Method
Rounding Rules
Payslip Settings
Approval Workflow
```

Example:

``` text
Frequency:
Monthly

LOP Calculation:
Calendar Days

Rounding:
Nearest Rupee

Payroll Approval:
Enabled
```

------------------------------------------------------------------------

# 25. LocalStorage Data Architecture

Use separate LocalStorage keys.

Recommended:

``` text
payroll_settings
salary_components
salary_templates
template_components
employee_salaries
salary_history
overtimes
incentives
loans
payroll_runs
payroll_records
payslips
```

Use a centralized storage service.

Example:

``` text
src/services/storageService.js
```

Do not directly call `localStorage.getItem()` everywhere.

------------------------------------------------------------------------

# 26. Suggested React Project Structure

``` text
src/
│
├── assets/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── tables/
│   ├── forms/
│   └── payroll/
│
├── layouts/
│   └── AdminLayout.jsx
│
├── pages/
│   ├── Dashboard/
│   ├── SalaryComponents/
│   ├── SalaryTemplates/
│   ├── EmployeeSalaries/
│   ├── PayrollRuns/
│   ├── Overtime/
│   ├── Incentives/
│   ├── Loans/
│   ├── Payslips/
│   ├── Reports/
│   └── Settings/
│
├── services/
│   ├── storageService.js
│   ├── salaryService.js
│   └── payrollService.js
│
├── utils/
│   ├── salaryCalculator.js
│   ├── payrollCalculator.js
│   ├── formulaEngine.js
│   └── formatters.js
│
├── hooks/
│
├── context/
│
├── data/
│   └── seedData.js
│
├── routes/
│   └── AppRoutes.jsx
│
└── App.jsx
```

------------------------------------------------------------------------

# 27. State Management

For the prototype use either:

``` text
Context API
```

or:

``` text
Zustand
```

Recommended for simplicity:

``` text
Zustand
```

But avoid unnecessary global state.

Persistent business data should ultimately come from the storage/service
layer.

------------------------------------------------------------------------

# 28. Seed Data

The prototype should load realistic demo data on first launch.

Example employees:

``` text
Rahul Sharma
Frontend Developer
CTC: ₹6,00,000

Amit Das
Backend Developer
CTC: ₹7,20,000

Priya Roy
HR Executive
CTC: ₹4,80,000

Suman Ghosh
Sales Executive
CTC: ₹5,40,000
```

Example components:

``` text
Basic Salary
HRA
Conveyance
Special Allowance
Employer PF
Employee PF
Professional Tax
TDS
Overtime
Incentive
Bonus
Loan EMI
LOP
Gratuity
```

Example templates:

``` text
Developer Standard
Manager Standard
Sales Employee
HR Executive
```

------------------------------------------------------------------------

# 29. Formula Engine

Do not make calculations hard-coded per page.

The system should conceptually support:

``` text
FIXED
PERCENTAGE
PER_DAY
PER_HOUR
BALANCE
FORMULA
RULE
```

Example:

``` text
HRA = 40% of BASIC
```

Example:

``` text
OT = OT_HOURS × OT_RATE
```

Example:

``` text
LOP = LOP_DAYS × PER_DAY_SALARY
```

Example:

``` text
SPECIAL = GROSS_BUDGET - SUM(OTHER_EARNINGS)
```

For the prototype, keep the formula engine controlled and safe. Do not
use raw `eval()` on user input.

------------------------------------------------------------------------

# 30. Important Business Rules

## Rule 1 --- Never destroy payroll history

Once a payroll run is approved/locked, changing current salary
configuration must not change the historical payroll.

## Rule 2 --- Effective dates matter

Salary changes must create new versions rather than overwriting old
salary history.

## Rule 3 --- Components are reusable

A Salary Component can be used by multiple Salary Templates.

## Rule 4 --- Templates are reusable

One template can be assigned to multiple employees.

## Rule 5 --- Employee-specific overrides must be possible

Example:

Template HRA = 40% of Basic.

But an employee may have a custom HRA amount/rule if company policy
allows.

## Rule 6 --- Employer contributions are separate

Employer PF/gratuity/benefits:

-   Do not reduce Net Pay
-   Can contribute to CTC/employer cost
-   Must remain separately visible

## Rule 7 --- Employee deductions reduce Net Pay

Examples:

-   Employee PF
-   PT
-   TDS
-   Loan EMI
-   LOP
-   Other deductions

## Rule 8 --- Variable earnings are period-specific

OT, incentive and bonus should be associated with a payroll period.

------------------------------------------------------------------------

# 31. UI/UX Direction

The application should look like a serious SaaS HR/payroll product.

Design goals:

-   Clean
-   Professional
-   Minimal
-   Data-dense but readable
-   Responsive
-   Consistent spacing
-   Strong table design
-   Clear status badges
-   Good empty states
-   Confirmation dialogs for destructive actions
-   Toast notifications
-   Loading states
-   Error states
-   Skeleton loaders where useful

Avoid a generic beginner-dashboard look.

------------------------------------------------------------------------

# 32. Important Screens

The prototype must include:

### Dashboard

``` text
KPIs
Payroll Status
Alerts
Recent Payroll Runs
```

### Salary Components

``` text
List
Search
Filter
Create
Edit
Activate/Deactivate
```

### Salary Template

``` text
Template Details
Component Selection
Calculation Rules
Preview
```

### Employee Salary

``` text
Employee
Template
CTC
Effective Date
Salary Breakdown
Salary History
```

### Payroll Run

``` text
Period
Employee List
Gross
Deductions
Employer Contribution
Net Pay
Status
```

### Payroll Details

``` text
Employee
Attendance
Earnings
Deductions
Employer Contributions
Gross
Net
CTC
Calculation Breakdown
```

### Payslip

Professional printable salary slip.

------------------------------------------------------------------------

# 33. Prototype Development Order

Do NOT build everything at once.

Build in this exact order:

``` text
STEP 1
Project Setup
        ↓
STEP 2
Admin Layout + Routing
        ↓
STEP 3
LocalStorage Service
        ↓
STEP 4
Seed Data
        ↓
STEP 5
Salary Components CRUD
        ↓
STEP 6
Salary Templates
        ↓
STEP 7
Salary Template Calculation Rules
        ↓
STEP 8
Employee Salary Assignment
        ↓
STEP 9
Salary Calculation Engine
        ↓
STEP 10
Salary History
        ↓
STEP 11
Overtime
        ↓
STEP 12
Incentives
        ↓
STEP 13
Loans
        ↓
STEP 14
Payroll Run
        ↓
STEP 15
Payroll Review/Approval
        ↓
STEP 16
Payslips
        ↓
STEP 17
Reports
        ↓
STEP 18
Settings
        ↓
STEP 19
Polish + Validation
```

------------------------------------------------------------------------

# 34. First Milestone

The first working milestone should only contain:

``` text
Admin Layout
Dashboard
Salary Components
Salary Templates
Employee Salaries
LocalStorage
Seed Data
```

At the end of Milestone 1, the following should work:

``` text
Create Component
       ↓
Create Template
       ↓
Select Components
       ↓
Assign Template to Employee
       ↓
Enter CTC
       ↓
Calculate Salary
       ↓
Show Salary Breakdown
       ↓
Persist Data in LocalStorage
```

Do not start Monthly Payroll until this flow is stable.

------------------------------------------------------------------------

# 35. Final Prototype Goal

The complete prototype should allow a user to perform this realistic
workflow:

``` text
1. Create Salary Components

2. Create Salary Template

3. Add Basic/HRA/Allowances/
   Employer Contributions etc.

4. Define calculation rules

5. Assign template to employee

6. Enter employee CTC

7. Generate salary breakdown

8. Maintain salary history

9. Add attendance/leave impact

10. Add overtime

11. Add incentives/bonus

12. Add loan EMI

13. Create monthly payroll

14. Calculate all employees

15. Review payroll

16. Approve payroll

17. Generate payslips

18. View reports
```

------------------------------------------------------------------------

# 36. Future Production Migration

After the React + LocalStorage prototype is validated:

``` text
Current:

React
  ↓
LocalStorage


Production:

React
  ↓
Laravel API
  ↓
MySQL
```

The UI should not need to be completely rebuilt.

Replace:

``` text
storageService.js
```

with API-backed services.

Example:

``` text
getSalaryComponents()
createSalaryComponent()
updateSalaryComponent()

getSalaryTemplates()
createSalaryTemplate()

getEmployeeSalary()
assignSalaryTemplate()

createPayrollRun()
calculatePayroll()
approvePayroll()
```

The calculation architecture should also be designed so that
production-grade server-side payroll calculation can eventually be
implemented in Laravel.

------------------------------------------------------------------------

# 37. Critical Architecture Principle

The prototype must not become a collection of UI-only screens.

Every major screen should connect to actual business data.

Bad:

``` text
Dashboard → fake numbers
Salary Template → fake form
Payroll → static table
```

Good:

``` text
Component
   ↓
Template
   ↓
Employee
   ↓
Calculation
   ↓
Payroll
   ↓
Payslip
```

Every step must use the data created in the previous step.

------------------------------------------------------------------------

# 38. Antigravity Implementation Instruction

When implementing this specification:

1.  First inspect the existing project.
2.  Do not unnecessarily replace the existing setup.
3.  Create the application architecture incrementally.
4.  Build reusable UI components.
5.  Keep business logic separate from UI.
6.  Keep LocalStorage access centralized.
7.  Use realistic seed data.
8.  Make every CRUD flow functional.
9.  Validate forms.
10. Handle loading, empty and error states.
11. Keep salary calculations centralized.
12. Preserve historical data.
13. Do not use hard-coded payroll values in multiple components.
14. Do not use `eval()` for arbitrary user formulas.
15. Keep the code ready for future Laravel/MySQL API migration.

------------------------------------------------------------------------

# 39. Definition of Done

The prototype is considered successful when:

-   Admin can create salary components.
-   Admin can edit/deactivate components.
-   Admin can create salary templates.
-   Admin can add components to templates.
-   Admin can configure calculation rules.
-   Admin can assign templates to employees.
-   Admin can set employee CTC.
-   System calculates salary breakdown.
-   Employer contributions are separate from Gross/Net.
-   Employee deductions are separate.
-   Salary history is preserved.
-   Data survives browser refresh.
-   Payroll run can be created for a month.
-   Overtime can affect payroll.
-   Incentives can affect payroll.
-   Loans can affect payroll.
-   Payroll can be reviewed and approved.
-   Payslip data can be generated.
-   Reports show real prototype data.
-   No major business logic is duplicated in UI components.

------------------------------------------------------------------------

# 40. Product Philosophy

The goal is NOT to build a simple salary calculator.

The goal is to build a **miniature payroll product** whose architecture
can later evolve into a production HRMS payroll module.

Think in these layers:

``` text
MASTER DATA
    ↓
SALARY CONFIGURATION
    ↓
EMPLOYEE SALARY
    ↓
VARIABLE PAY
    ↓
PAYROLL ENGINE
    ↓
PAYROLL PROCESSING
    ↓
PAYSLIP
    ↓
REPORTING
```

Build the prototype with this architecture from day one.
