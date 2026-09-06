/**
 * Recommendation Decision Engine
 * Determines primary verdict: BORROW | BORROW_LESS | DONT_BORROW
 * Processes complete borrower profile including adaptive flags.
 */

export const VERDICTS = {
  BORROW: {
    key: 'BORROW',
    title: 'Safe to Borrow',
    subtitle: 'Your requested loan fits comfortably within your safe financial capacity with a healthy cushion.',
    badgeText: 'Verdict: Proceed Safely',
    color: '#1E3A2B', // Forest green
    bg: '#EAF0EC',
    borderColor: '#A3C4B2',
  },
  BORROW_LESS: {
    key: 'BORROW_LESS',
    title: 'Borrow Less than Quoted',
    subtitle: 'The bank is willing to sanction more than what is safe for your monthly budget. Scale down your loan size.',
    badgeText: 'Verdict: Trim Loan Amount',
    color: '#9E6D18', // Ochre / Warm Amber
    bg: '#FAF4E8',
    borderColor: '#E6D3B0',
  },
  DONT_BORROW: {
    key: 'DONT_BORROW',
    title: 'Do Not Borrow Now',
    subtitle: 'Taking this loan poses a high risk of financial distress or debt trap under your current cash flow.',
    badgeText: 'Verdict: Do Not Borrow',
    color: '#B85C4B', // Terracotta
    bg: '#FDF4F2',
    borderColor: '#F2C6C0',
  },
};

export function calculateVerdict(profile = {}, computed = {}) {
  const {
    requestedAmount = 0,
    netMonthlyIncome = 0,
    existingMonthlyEmis = 0,
    hasHighCostDebt = false,
    recentPaymentBounce = false,
    incomeType = 'SALARIED',
    businessDuration = '2_TO_5_YRS',
    emergencySavingsMonths = 3,
    isProductiveBorrowing = false,
  } = profile;

  const { safePrincipal = 0, sanctionedPrincipal = 0, disposableSurplus = 0, proposedEMI = 0, allInApr = 0 } = computed;

  const reasons = [];
  const warnings = [];
  const actionPlan = [];

  const totalMonthlyDebtPostLoan = existingMonthlyEmis + proposedEMI;
  const foirRatio = netMonthlyIncome > 0 ? (totalMonthlyDebtPostLoan / netMonthlyIncome) : 1;
  const remainingSurplusAfterEmi = disposableSurplus - proposedEMI;

  let isDontBorrow = false;

  // Rule A: Active High-Cost Informal Debt (BNPL / Money Lenders / Credit Card roll-overs) -> DONT_BORROW
  if (hasHighCostDebt) {
    isDontBorrow = true;
    reasons.push('You have active high-cost informal debt (BNPL / money lenders / credit card roll-overs) with predatory interest rates.');
    actionPlan.push('Pay off all high-cost informal debts completely before taking on new bank credit.');
  }

  // Rule B: Recent Payment Bounces in past 6 months -> DONT_BORROW
  if (recentPaymentBounce) {
    isDontBorrow = true;
    reasons.push('Recent cheque or EMI payment bounces in the last 6 months indicate active cash flow strain.');
    actionPlan.push('Maintain 6 consecutive months of zero payment bounces to restore creditworthiness.');
  }

  // Rule C: Negative Cash Flow After EMI
  if (netMonthlyIncome > 0 && remainingSurplusAfterEmi < 0) {
    isDontBorrow = true;
    reasons.push(`Proposed EMI of ₹${proposedEMI.toLocaleString('en-IN')}/mo exceeds your unencumbered monthly surplus (₹${disposableSurplus.toLocaleString('en-IN')}).`);
    actionPlan.push('Reduce essential living expenses or pay off existing EMIs before borrowing.');
  }

  // Rule D: FOIR Overload (> 55%)
  if (foirRatio > 0.55) {
    isDontBorrow = true;
    reasons.push(`Total debt obligations will consume ${(foirRatio * 100).toFixed(0)}% of net income (exceeding maximum safe 50% FOIR cap).`);
    actionPlan.push('Clear existing EMIs to lower your Fixed Obligation to Income Ratio.');
  }

  // Rule E: Predatory Interest Rate (> 24% All-In APR)
  if (allInApr > 24.0) {
    isDontBorrow = true;
    reasons.push(`All-in APR of ${allInApr.toFixed(1)}% is in the predatory interest zone (>24% p.a.).`);
    actionPlan.push('Reject this quote immediately; seek regulated bank options or credit union alternatives.');
  }

  if (emergencySavingsMonths < 1 && requestedAmount > netMonthlyIncome * 2) {
    warnings.push('You have less than 1 month of liquid emergency savings cushion.');
  }

  if (isDontBorrow) {
    return {
      ...VERDICTS.DONT_BORROW,
      reasons,
      warnings,
      actionPlan,
      metrics: {
        foirRatioPercent: (foirRatio * 100).toFixed(1),
        remainingSurplusAfterEmi: Math.round(remainingSurplusAfterEmi),
        safePrincipalRatio: safePrincipal > 0 ? (requestedAmount / safePrincipal).toFixed(2) : 'Infinity',
      },
    };
  }

  // Rule F: Over-Ambitious Request vs Safe Capacity -> BORROW_LESS
  const isOverSafeCapacity = requestedAmount > safePrincipal * 1.15;
  const isBankPushingTooMuch = sanctionedPrincipal > safePrincipal * 1.3 && requestedAmount > safePrincipal;
  const isYoungBusinessRisk = incomeType === 'SELF_EMPLOYED' && businessDuration === 'UNDER_2_YRS' && requestedAmount > safePrincipal * 0.85;

  if (isOverSafeCapacity || isBankPushingTooMuch || isYoungBusinessRisk) {
    reasons.push(`Requested loan amount (₹${requestedAmount.toLocaleString('en-IN')}) exceeds your safe borrowing limit (₹${safePrincipal.toLocaleString('en-IN')}).`);

    if (sanctionedPrincipal > safePrincipal) {
      reasons.push(`Lenders will sanction up to ₹${sanctionedPrincipal.toLocaleString('en-IN')}, but accepting the full sanction will stretch your cash flow.`);
    }

    if (isYoungBusinessRisk) {
      reasons.push('Businesses under 2 years old face revenue fluctuations. Borrowing less provides cash flow safety.');
    }

    actionPlan.push(`Cap your loan amount at ₹${safePrincipal.toLocaleString('en-IN')} to preserve financial flexibility.`);
    actionPlan.push('Increase your down payment or self-fund the remaining balance.');

    return {
      ...VERDICTS.BORROW_LESS,
      reasons,
      warnings,
      actionPlan,
      metrics: {
        foirRatioPercent: (foirRatio * 100).toFixed(1),
        remainingSurplusAfterEmi: Math.round(remainingSurplusAfterEmi),
        safePrincipalRatio: (requestedAmount / (safePrincipal || 1)).toFixed(2),
      },
    };
  }

  // Rule G: Safe Request -> BORROW
  reasons.push(`Your proposed EMI (₹${proposedEMI.toLocaleString('en-IN')}) consumes only ${((proposedEMI / Math.max(1, disposableSurplus)) * 100).toFixed(0)}% of your monthly disposable surplus.`);
  reasons.push(`Total post-loan debt ratio is ${(foirRatio * 100).toFixed(0)}% of net income (well within safe limits).`);

  if (isProductiveBorrowing) {
    reasons.push('This is a productive loan that generates income/revenue, improving your long-term balance sheet.');
  }

  actionPlan.push('Proceed with loan application, but use our Negotiation Card to waive processing fees.');
  actionPlan.push('Set up automated monthly ECS / NACH payment to avoid late payment penalties.');

  return {
    ...VERDICTS.BORROW,
    reasons,
    warnings,
    actionPlan,
    metrics: {
      foirRatioPercent: (foirRatio * 100).toFixed(1),
      remainingSurplusAfterEmi: Math.round(remainingSurplusAfterEmi),
      safePrincipalRatio: (requestedAmount / (safePrincipal || 1)).toFixed(2),
    },
  };
}
