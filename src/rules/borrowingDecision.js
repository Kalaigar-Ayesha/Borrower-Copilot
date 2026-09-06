/**
 * Borrowing Decision Engine
 * Explicit rules for BORROW | BORROW_LESS | DONT_BORROW
 */

import { ASSUMPTIONS } from '../data/assumptions.js';
import { calculateAffordability } from './affordability.js';
import { calculateLoanAmountRanges } from './loanAmount.js';
import { calculateEmiAndTenureTradeoffs } from './emi.js';
import { calculateAprRange } from './apr.js';

export const VERDICTS = {
  BORROW: {
    decision: 'BORROW',
    title: 'Safe to Borrow',
    subtitle: 'Your requested loan fits comfortably within your safe financial capacity with a healthy cushion.',
    badgeText: 'Verdict: Proceed Safely',
    color: '#1E3A2B',
    bg: '#EAF0EC',
    borderColor: '#A3C4B2',
  },
  BORROW_LESS: {
    decision: 'BORROW_LESS',
    title: 'Borrow Less than Quoted',
    subtitle: 'Lenders are willing to sanction more than what is safe for your monthly budget. Scale down your loan size.',
    badgeText: 'Verdict: Trim Loan Amount',
    color: '#9E6D18',
    bg: '#FAF4E8',
    borderColor: '#E6D3B0',
  },
  DONT_BORROW: {
    decision: 'DONT_BORROW',
    title: 'Do Not Borrow Now',
    subtitle: 'Taking this loan poses a high risk of financial distress or debt trap under your current cash flow.',
    badgeText: 'Verdict: Do Not Borrow',
    color: '#B85C4B',
    bg: '#FDF4F2',
    borderColor: '#F2C6C0',
  },
};

export function determineBorrowingDecision(borrower = {}) {
  const {
    requestedAmount = 500000,
    hasHighCostDebt = false,
    recentPaymentBounce = false,
    netMonthlyIncome = 0,
    existingMonthlyEmis = 0,
    emergencySavingsMonths = 3,
    isProductiveBorrowing = false,
    incomeType = 'SALARIED',
    businessDuration = '2_TO_5_YRS',
  } = borrower;

  const affordability = calculateAffordability(borrower);
  const amounts = calculateLoanAmountRanges(borrower);
  const emiInfo = calculateEmiAndTenureTradeoffs(borrower);
  const aprInfo = calculateAprRange(borrower);

  const reasons = [];
  const warnings = [];
  const actionPlan = [];

  const totalMonthlyDebtPostLoan = existingMonthlyEmis + emiInfo.proposedEmi;
  const foirRatio = netMonthlyIncome > 0 ? (totalMonthlyDebtPostLoan / netMonthlyIncome) : 1;
  const remainingSurplusAfterEmi = affordability.borrowerSafeBasis.disposableCashSurplus - emiInfo.proposedEmi;

  // Rule 1: High-Cost Debt (BNPL / Money Lenders / Credit Cards) -> DONT_BORROW
  if (hasHighCostDebt) {
    reasons.push('You carry active high-cost informal debt (BNPL, credit card roll-overs, or local money lenders) with predatory interest rates.');
    actionPlan.push('Clear all informal debts completely before taking on new bank credit commitments.');
    return {
      ...VERDICTS.DONT_BORROW,
      reasons,
      warnings,
      actionPlan,
      primaryReason: 'High-cost informal debt detected.',
      explanation: 'High-interest informal debts carry 24-48% interest rates. Adding a new loan will severely compromise your cash flow.',
    };
  }

  // Rule 2: Recent Payment Bounces in past 6 months -> DONT_BORROW
  if (recentPaymentBounce) {
    reasons.push('Recent cheque, NACH, or EMI bounces in the last 6 months indicate active repayment distress.');
    actionPlan.push('Maintain 6 consecutive months of zero payment bounces to demonstrate financial stability.');
    return {
      ...VERDICTS.DONT_BORROW,
      reasons,
      warnings,
      actionPlan,
      primaryReason: 'Recent EMI bounce history.',
      explanation: 'Recent bounces indicate cash flow instability. Banks will reject unsecured loans or charge peak interest rates.',
    };
  }

  // Rule 3: Negative Cash Flow After EMI -> DONT_BORROW
  if (netMonthlyIncome > 0 && remainingSurplusAfterEmi < 0) {
    reasons.push(`Proposed EMI of ₹${emiInfo.proposedEmi.toLocaleString('en-IN')}/mo exceeds your unencumbered monthly surplus (₹${affordability.borrowerSafeBasis.disposableCashSurplus.toLocaleString('en-IN')}).`);
    actionPlan.push('Reduce essential living costs or pay off existing debts to free up cash flow.');
    return {
      ...VERDICTS.DONT_BORROW,
      reasons,
      warnings,
      actionPlan,
      primaryReason: 'Negative cash flow after proposed EMI.',
      explanation: 'Your income minus living expenses and existing EMIs does not leave enough surplus to pay the new loan EMI.',
    };
  }

  // Rule 4: Total FOIR Overload (> 55%) -> DONT_BORROW
  if (foirRatio > ASSUMPTIONS.MAX_SALARIED_FOIR.value) {
    reasons.push(`Total debt obligations will consume ${(foirRatio * 100).toFixed(0)}% of net income (exceeding safe 50-55% FOIR limits).`);
    actionPlan.push('Pay off existing EMIs to bring your Fixed Obligation Ratio below 45%.');
    return {
      ...VERDICTS.DONT_BORROW,
      reasons,
      warnings,
      actionPlan,
      primaryReason: 'Total debt ratio exceeds safe FOIR ceiling.',
      explanation: 'Allocating over 55% of income to debt service creates extreme risk of default during minor financial emergencies.',
    };
  }

  // Rule 5: Predatory Interest Rate / All-In APR (> 24%) -> DONT_BORROW
  if (aprInfo.minApr > ASSUMPTIONS.PREDATORY_APR_THRESHOLD.value) {
    reasons.push(`Estimated All-in APR (${aprInfo.formattedAprRange}) exceeds the 24% predatory threshold.`);
    actionPlan.push('Reject this quote and seek regulated bank options or credit union alternatives.');
    return {
      ...VERDICTS.DONT_BORROW,
      reasons,
      warnings,
      actionPlan,
      primaryReason: 'Predatory All-in APR threshold exceeded.',
      explanation: 'Effective rates above 24% create severe interest compounding burdens.',
    };
  }

  // Check Over-Ambitious Loan Request vs Safe Capacity -> BORROW_LESS
  const safeMaxPrincipal = amounts.borrowerSafeRange.max;
  const isOverSafeCapacity = requestedAmount > safeMaxPrincipal * 1.15;
  const isYoungBusinessRisk = incomeType === 'SELF_EMPLOYED' && businessDuration === 'UNDER_2_YRS' && requestedAmount > safeMaxPrincipal * 0.85;

  if (isOverSafeCapacity || isYoungBusinessRisk) {
    reasons.push(`Requested loan amount (₹${requestedAmount.toLocaleString('en-IN')}) exceeds your safe borrowing limit (${amounts.borrowerSafeRange.formatted}).`);
    reasons.push(`Lenders may sanction up to ${amounts.lenderSanctionRange.formatted}, but accepting full sanction will stretch your cash flow.`);

    if (isYoungBusinessRisk) {
      reasons.push('Businesses under 2 years old experience cash flow volatility. Trimming your loan size provides a safety cushion.');
    }

    actionPlan.push(`Cap your loan amount at ${amounts.recommendedAmount.formatted} to preserve financial flexibility.`);
    actionPlan.push('Increase self-funding or down payment to bridge the gap.');

    return {
      ...VERDICTS.BORROW_LESS,
      reasons,
      warnings,
      actionPlan,
      primaryReason: 'Requested loan exceeds borrower-safe capacity.',
      explanation: 'Lenders will sanction more money than is safe for your household budget. Trimming your loan size prevents debt strain.',
    };
  }

  // Safe Request -> BORROW
  reasons.push(`Proposed EMI (₹${emiInfo.proposedEmi.toLocaleString('en-IN')}) consumes only ${((emiInfo.proposedEmi / Math.max(1, affordability.borrowerSafeBasis.disposableCashSurplus)) * 100).toFixed(0)}% of your disposable surplus.`);
  reasons.push(`Post-loan debt ratio is ${(foirRatio * 100).toFixed(0)}% of net income (well within safe guidelines).`);

  if (isProductiveBorrowing) {
    reasons.push('This is a productive loan that generates income/revenue, improving your long-term balance sheet.');
  }

  actionPlan.push('Proceed with loan application using our Negotiation Card to waive processing fees.');
  actionPlan.push('Set up automated monthly ECS / NACH payment to avoid late payment penalties.');

  return {
    ...VERDICTS.BORROW,
    reasons,
    warnings,
    actionPlan,
    primaryReason: 'Fits comfortably within safe financial capacity.',
    explanation: 'Your income, living expenses, and debt obligations leave a healthy monthly buffer after paying the proposed EMI.',
  };
}
