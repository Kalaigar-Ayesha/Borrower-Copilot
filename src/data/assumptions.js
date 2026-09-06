/**
 * Borrower Copilot - Centralized Financial Assumptions & Thresholds
 *
 * Every assumption contains:
 * - name: Human readable title
 * - value: Numeric/Boolean threshold value
 * - purpose: Product engineering rationale
 * - explanation: Technical & financial reasoning for interview defense
 */

export const ASSUMPTIONS = {
  // 1. Lender Sanction FOIR Caps
  MAX_SALARIED_FOIR: {
    name: 'Max Salaried FOIR Ceiling',
    value: 0.55, // 55%
    purpose: 'Defines the maximum allowable Fixed Obligation to Income Ratio for salaried applicants used by Indian retail banks.',
    explanation: 'Banks allow existing EMIs plus new EMI to consume up to 55% of net monthly income for salaried employees with steady income credit.',
  },
  MAX_SELF_EMPLOYED_FOIR: {
    name: 'Max Self-Employed FOIR Ceiling',
    value: 0.50, // 50%
    purpose: 'Standard private/PSU bank FOIR limit for self-employed individuals.',
    explanation: 'Self-employed income carries business cycle risk, so banks apply a slightly stricter 50% FOIR cap on reported ITR net profit.',
  },
  MAX_INFORMAL_GIG_FOIR: {
    name: 'Max Informal / Gig FOIR Ceiling',
    value: 0.40, // 40%
    purpose: 'Conservative bank sanction limit for gig/contract workers.',
    explanation: 'Informal/gig cash flows fluctuate month-to-month, requiring a lower FOIR cap to prevent defaults during lean months.',
  },

  // 2. Borrower-Safe Affordability Caps
  SAFE_INCOME_EMI_CAP: {
    name: 'Borrower-Safe Net Income EMI Cap',
    value: 0.30, // 30%
    purpose: 'Recommends that no borrower should allocate more than 30% of total net monthly income to loan EMIs.',
    explanation: 'Allocating more than 30% of net salary to debt payments severely restricts lifestyle flexibility and emergency savings accumulation.',
  },
  SAFE_SURPLUS_EMI_CAP: {
    name: 'Borrower-Safe Surplus EMI Cap',
    value: 0.40, // 40%
    purpose: 'Limits new EMI to 40% of unencumbered disposable cash surplus (Net Income - Essential Expenses - Existing EMIs).',
    explanation: 'Protects household living costs (rent, groceries, utilities, tuition) before allocating money to debt service.',
  },
  DEFAULT_ESTIMATED_LIVING_COST_RATIO: {
    name: 'Default Estimated Living Cost Ratio',
    value: 0.38, // 38%
    purpose: 'Used when a borrower skips or marks household expenses as unknown.',
    explanation: 'Enforces the rule that unknown expenses are never treated as ₹0. Uses an Indian urban household benchmark of 38% of net income.',
  },

  // 3. Risk Premiums & Interest Rate Bands (Base RBI Repo Rate + Spreads)
  BASE_REPO_BENCHMARK: {
    name: 'RBI Repo-Linked Base Rate',
    value: 8.50, // 8.50%
    purpose: 'Baseline reference rate for prime retail loans in India.',
    explanation: 'Derived from current RBI repo rate plus standard bank operating margin.',
  },
  CIBIL_RISK_SPREADS: {
    EXCELLENT: { min: 0.0, max: 0.75, name: 'CIBIL 775+ Spread' },
    GOOD: { min: 1.0, max: 2.0, name: 'CIBIL 725-774 Spread' },
    AVERAGE: { min: 2.5, max: 4.0, name: 'CIBIL 675-724 Spread' },
    POOR: { min: 5.0, max: 8.0, name: 'CIBIL <675 Spread' },
    UNKNOWN: { min: 2.0, max: 4.5, name: 'Unknown / Unrated CIBIL Spread' },
  },
  COLLATERAL_LAP_RATE_DISCOUNT: {
    name: 'Secured Collateral / LAP Rate Discount',
    value: 2.50, // -2.5% rate discount
    purpose: 'Reduces nominal interest rate when borrower provides property or liquid collateral.',
    explanation: 'Pledging unencumbered real estate (like Ravi\'s shop property) lowers lender credit loss risk, reducing interest pricing significantly.',
  },

  // 4. Upfront Processing Fees & GST
  GST_RATE: {
    name: 'GST Rate on Financial Services',
    value: 0.18, // 18%
    purpose: 'Mandatory Indian Government tax applied to all bank processing fees and documentation charges.',
    explanation: 'Processing fees attract 18% GST which is deducted upfront from the disbursed loan principal.',
  },
  DEFAULT_PROCESSING_FEE_PERCENT: {
    PERSONAL: 1.5,
    HOME: 0.5,
    CAR: 1.0,
    BUSINESS: 1.5,
    LAP: 0.75,
    EDUCATION: 1.0,
  },

  // 5. Product Routing & Collateral LTV Caps
  LAP_MAX_LTV: {
    name: 'Loan Against Property (LAP) Max LTV',
    value: 0.50, // 50% LTV
    purpose: 'Maximum bank sanction principal against unencumbered commercial/residential property valuation.',
    explanation: 'Indian banks sanction up to 50-60% of appraised market value for commercial shop properties.',
  },

  // 6. Stress Testing Shocks
  STRESS_INCOME_SHOCK: {
    name: 'Income Shock Reduction',
    value: 0.20, // -20%
    purpose: 'Simulates a 20% drop in net monthly earnings.',
    explanation: 'Tests whether borrower can survive salary cuts, job transition gaps, or lean business quarters.',
  },
  STRESS_RATE_HIKE: {
    name: 'Interest Rate Spike',
    value: 2.00, // +2.0%
    purpose: 'Simulates a 200 bps tightening cycle by the RBI.',
    explanation: 'Tests floating-rate loan sensitivity to monetary policy rate hikes.',
  },

  // 7. Decision Verdict Thresholds
  PREDATORY_APR_THRESHOLD: {
    name: 'Predatory All-In APR Ceiling',
    value: 24.0, // 24% p.a.
    purpose: 'Triggers DO NOT BORROW if all-in APR exceeds 24%.',
    explanation: 'APRs above 24% indicate high-risk fintech or informal credit that creates long-term debt traps.',
  },
};
