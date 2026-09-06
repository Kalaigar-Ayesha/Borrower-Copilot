# Borrower Copilot - Rules, Assumptions & Limitations (`RULES.md`)

This document outlines the explicit financial assumptions, mathematical formulas, data sourcing, and product decision rules governing the **Borrower Copilot Decision Engine**.

---

## 📊 Comprehensive Rules & Assumptions Table

| What | Value | Why | Source |
| :--- | :--- | :--- | :--- |
| **RBI Repo-Linked Base Rate** | `8.50% p.a.` | Reference baseline interest rate for prime retail lending in India. | **Externally Sourced** (RBI Monetary Policy & Retail Bank Margins) |
| **Max Salaried FOIR Ceiling** | `55%` of Net Income | Maximum allowable Fixed Obligation to Income Ratio for salaried applicants. | **Externally Sourced** (Private & PSU Indian Banking Standards) |
| **Max Self-Employed FOIR** | `50%` of Net Profit | Bank sanction limit for self-employed individuals based on reported ITR net profit. | **Externally Sourced** (Indian MSME / Self-Employed Bank Guidelines) |
| **Max Informal / Gig FOIR** | `40%` of Cash Flow | Conservative bank sanction limit for gig/contract workers due to income volatility. | **Product Assumption** (Copilot Risk Policy) |
| **Borrower-Safe Income EMI Cap** | `30%` of Net Income | Recommends that no borrower allocate >30% of net monthly income to loan EMIs. | **Product Assumption** (Personal Financial Planning Safety Standards) |
| **Borrower-Safe Surplus Cap** | `40%` of Cash Surplus | Limits new EMI to 40% of unencumbered disposable cash surplus after living costs. | **Product Assumption** (Copilot Cashflow Protection Model) |
| **Default Urban Expenses Ratio** | `38%` of Net Income | Default benchmark used when household living expenses are skipped or unknown. | **My Judgment** (Urban Indian Household Expenditure Averages) |
| **LAP Property Max LTV** | `50%` of Property Value | Maximum Loan Against Property (LAP) sanction limit against commercial/residential property. | **Externally Sourced** (RBI LTV Directives on Property Mortgages) |
| **Collateral Rate Discount** | `-2.50%` Interest Discount | Interest rate reduction granted when borrower pledges unencumbered real estate property. | **Externally Sourced** (Secured vs Unsecured Pricing Spreads) |
| **GST Rate on Financial Fees** | `18%` | Mandatory Indian Government tax applied to all bank processing fees and documentation charges. | **Externally Sourced** (Indian Goods and Services Tax Act) |
| **Predatory APR Threshold** | `24.0%` All-In APR | Triggers an immediate `DO NOT BORROW` decision if effective all-in cost exceeds 24% p.a. | **My Judgment** (RBI Microfinance & Usury Cap Directives) |
| **Income Stress Shock** | `-20%` Income Reduction | Simulates salary cut, job loss gap, or lean business quarter in stress testing. | **Product Assumption** (Economic Shock Resilience Simulation) |
| **Interest Rate Hike Shock** | `+2.00%` Rate Spike | Simulates a 200 bps tightening cycle by the RBI on floating-rate retail loans. | **Product Assumption** (RBI Rate Hike Sensitivity Testing) |

---

## 🔍 Data Source & Judgment Classification

### 1. Externally Sourced Information
- **RBI Repo Rate & Banking Margins**: Baseline retail rate of 8.50% p.a.
- **Bank FOIR Standards**: 50–55% maximum debt-to-income limits.
- **GST Rate**: Mandatory 18% tax on processing fees.
- **Property LTV Directives**: 50% LTV limit for Loan Against Property (LAP).

### 2. Product Assumptions
- **Borrower-Safe EMI Ceiling**: Capped at 30% of Net Income or 40% of Unencumbered Cash Surplus.
- **Unknown Parameter Handling**: Unknown fields trigger conservative market benchmarks (e.g. 38% living expenses) and widen rate ranges without assuming ₹0.
- **Stress Test Scenarios**: -20% Income Reduction & +2.0% RBI Rate Spike.

### 3. Developer / Product Judgment
- **Unrated CIBIL Handling**: Unknown credit scores widen rate ranges (e.g. `10.0% – 13.5%`) and lower confidence score without automatically rejecting the applicant.
- **Predatory APR Cap (24%)**: Protects retail borrowers from high-cost informal or unregulated payday/BNPL debt traps.
- **Product Routing**: Automatically routes self-employed applicants with property collateral to LAP / Secured Business loans (Ravi's scenario).

---

## ⚠️ Important Limitations & Disclaimers

1. **No Credit Bureau Data**: Copilot does not pull official CIBIL/Experian bureau credit reports. Credit score inputs are self-reported by the user.
2. **User-Provided Income**: Income and living expense figures are user-stated and unverified by bank statements or tax portals.
3. **Self-Assessment Tool (Not a Lender)**: Borrower Copilot is an objective decision-support and negotiation-support tool. It does not provide formal bank underwriting or guaranteed loan approvals.
4. **Rate & APR Estimates**: Interest rate ranges (`11.0% – 12.5%`) and All-In APRs are estimates based on documented market assumptions. Actual bank quotes may differ based on individual lender risk policies.
5. **Educational Decision Support**: This application does not constitute formal financial, legal, or investment advice.
