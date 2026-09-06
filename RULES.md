# Borrower Copilot - Decision Engine Rules & Assumptions Documentation (`RULES.md`)

This document outlines the explicit financial assumptions, mathematical formulas, and product decision rules governing the **Borrower Copilot Decision Engine**.

---

## 🏛️ Centralized Financial Assumptions (`src/data/assumptions.js`)

All thresholds are centralized in `src/data/assumptions.js` to ensure zero magic numbers exist in codebase logic:

| Assumption Name | Threshold / Value | Purpose & Financial Explanation |
| :--- | :--- | :--- |
| `MAX_SALARIED_FOIR` | 55% of Net Income | Max allowable Fixed Obligation to Income Ratio for salaried corporate applicants. |
| `MAX_SELF_EMPLOYED_FOIR` | 50% of ITR Net Profit | Bank sanction ceiling for self-employed individuals based on reported ITR returns. |
| `MAX_INFORMAL_GIG_FOIR` | 40% of Monthly Cashflow | Conservative bank sanction limit accounting for gig cash flow volatility. |
| `SAFE_INCOME_EMI_CAP` | 30% of Net Income | Borrower-safe limit recommending EMI should never exceed 30% of net monthly income. |
| `SAFE_SURPLUS_EMI_CAP` | 40% of Unencumbered Surplus | Caps EMI at 40% of cash surplus remaining after deducting household living costs and existing debts. |
| `DEFAULT_ESTIMATED_LIVING_COST_RATIO` | 38% of Net Income | Benchmark used when living expenses are skipped or unknown. Prevents treating unknown as ₹0. |
| `LAP_MAX_LTV` | 50% of Property Valuation | Maximum Loan Against Property (LAP) sanction limit against commercial/residential real estate. |
| `COLLATERAL_LAP_RATE_DISCOUNT` | -2.50% Interest Discount | Interest rate reduction granted when borrower pledges unencumbered property collateral. |
| `GST_RATE` | 18% | Mandatory Indian Government GST tax applied to bank processing fees and documentation charges. |
| `STRESS_INCOME_SHOCK` | -20% Income Reduction | Simulates salary cut, job loss gap, or lean business quarter in stress testing. |
| `STRESS_RATE_HIKE` | +2.00% Interest Spike | Simulates a 200 bps tightening cycle by the RBI on floating-rate retail loans. |
| `PREDATORY_APR_THRESHOLD` | 24.0% All-In APR | Triggers an immediate `DO NOT BORROW` decision if effective all-in cost exceeds 24% p.a. |

---

## ⚖️ Lender Sanction vs. Borrower-Safe Capacity

Borrower Copilot explicitly separates **what banks will lend** from **what you can safely afford**:

### 1. Lender-Style Sanction Capacity
Estimates what a commercial bank may sanction based on their risk limits:
$$\text{Lender Max EMI} = (\text{Evaluated Monthly Income} \times \text{FOIR Cap}) - \text{Existing Monthly EMIs}$$
- **Salaried**: Evaluated on net monthly salary credited to bank account.
- **Self-Employed**: Evaluated on latest filed ITR net profit divided by 12.
- **Secured / LAP**: Evaluated on Property Valuation $\times$ 50% LTV, capped by FOIR.

### 2. Borrower-Safe Capacity
Calculates conservative borrowing limits to preserve cash flow and prevent debt traps:
$$\text{Effective Disposable Surplus} = \text{Net Income} + \text{Productive ROI Boost} - \text{Household Living Costs} - \text{Existing EMIs}$$
$$\text{Safe EMI Ceiling} = \min\Big(\text{Net Income} \times 30\%, \text{Disposable Surplus} \times 40\%\Big)$$

---

## 🚦 Decision Verdict Tree (`BORROW`, `BORROW_LESS`, `DONT_BORROW`)

### `DONT_BORROW` Conditions (Reachability Guaranteed)
1. **Active High-Cost Informal Debt**: Borrower carries BNPL, credit card roll-overs, or local money lender debt.
2. **Recent Payment Bounces**: Cheque, NACH, or EMI bounces in past 6 months.
3. **Negative Cash Flow**: Proposed EMI exceeds unencumbered monthly surplus after living costs.
4. **Severe Debt Burden**: Total post-loan FOIR exceeds 55%.
5. **Predatory All-In APR**: Effective APR exceeds 24.0% p.a.

### `BORROW_LESS` Conditions
1. **Over Safe Capacity**: Requested loan principal exceeds Borrower-Safe Capacity by >15%.
2. **Bank Over-Sanction**: Bank sanction limit is significantly higher than safe capacity, tempting borrower to over-borrow.
3. **Young Business Risk**: Business operating history < 2 years requesting high unsecured principal.

### `BORROW` Conditions
1. Requested loan amount is within Borrower-Safe Capacity.
2. Post-loan FOIR remains below 40-45%.
3. Positive surplus cushion remains after paying proposed EMI.

---

## 🔀 Product-Aware Routing Logic (Ravi's Persona Case)

Standard retail loan portals evaluate all applicants as unsecured personal loan seekers. Borrower Copilot implements **Product-Aware Routing**:

- **Trigger Condition**:
  - `incomeType === 'SELF_EMPLOYED'`
  - `hasCollateral === true` (e.g. ₹45 Lakh unencumbered shop property)
  - `loanPurpose === 'BUSINESS'` (Business expansion)
- **Routing Decision**:
  - Routes applicant from *Unsecured Personal Loan* (16–18% interest) to **Secured Business Loan / Loan Against Property (LAP)**.
- **Impact**:
  - Unlocks lower fair interest rate range (**9.5% – 11.0%**).
  - Unlocks higher bank sanction capacity based on 50% Property LTV (up to ₹22.5 Lakhs).
  - Recognizes borrowing as **Productive Revenue-Generating**, offsetting EMI strain with expected business income growth.

---

## ❓ Unknown Values & Confidence Principles

1. **Unknown Credit Score**: If credit score is unknown or unrated, Copilot does **NOT** treat it as 0 or assume bad credit. It widens the fair interest rate range (e.g. `10.0% – 13.5%`) and lowers the Confidence Rating (`Medium` or `Low`).
2. **Unknown Living Expenses**: Estimated automatically at 38% of net income.
3. **Confidence Rating**:
   - **High**: All key parameters verified (Income, Expenses, Credit Tier, Quoted Terms).
   - **Medium**: 1-2 parameters estimated (Wide ranges applied).
   - **Low**: 3+ parameters skipped or unverified (Very wide ranges applied).
