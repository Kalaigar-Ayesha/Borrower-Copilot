/**
 * Central Assessment Orchestrator
 * Exposes calculateAssessment(borrower)
 * Returns complete structured financial evaluation object with defensible explanations for every output.
 */

import { calculateAffordability } from './affordability.js';
import { determineBorrowingDecision } from './borrowingDecision.js';
import { calculateLoanAmountRanges } from './loanAmount.js';
import { calculateFairInterestRateRange } from './interestRate.js';
import { calculateAprRange } from './apr.js';
import { calculateEmiAndTenureTradeoffs } from './emi.js';
import { runStressTestScenarios } from './stressTest.js';
import { calculateConfidenceScore } from './confidence.js';
import { determineProductRouting } from './productRouting.js';
import { generateNegotiationCard } from './negotiationEngine.js';

export function calculateAssessment(borrower = {}) {
  // 1. Product Routing
  const productRouting = determineProductRouting(borrower);

  // 2. Affordability (Lender vs Safe)
  const affordability = calculateAffordability(borrower);

  // 3. Fair Rate & APR Ranges
  const fairRateRange = calculateFairInterestRateRange(borrower);
  const aprRange = calculateAprRange(borrower);

  // 4. Loan Amounts (Sanction Range, Safe Range, Recommended)
  const loanAmounts = calculateLoanAmountRanges(borrower);

  // 5. EMI & Tenure Matrix
  const emiInfo = calculateEmiAndTenureTradeoffs(borrower);

  // 6. Verdict Decision
  const verdict = determineBorrowingDecision(borrower);

  // 7. Stress Testing
  const stressScenario = runStressTestScenarios(borrower);

  // 8. Confidence Score
  const confidence = calculateConfidenceScore(borrower);

  // 9. Bank Negotiation Card
  const negotiationCard = generateNegotiationCard({
    loanCategoryKey: borrower.loanCategoryKey || 'PERSONAL',
    requestedAmount: borrower.requestedAmount || 500000,
    quotedRate: fairRateRange.midRate,
    quotedFeePercent: aprRange.processingFeePercent,
    cibilTierKey: borrower.cibilTierKey || 'EXCELLENT',
  });

  // 10. Centralized Reasons & Explanations Summary for Every Major Output
  const reasonsSummary = {
    verdict: {
      value: verdict.decision,
      title: verdict.title,
      confidence: confidence.tier,
      reason: verdict.primaryReason,
      explanation: verdict.explanation,
    },
    sanctionRange: {
      value: loanAmounts.lenderSanctionRange.formatted,
      range: loanAmounts.lenderSanctionRange,
      confidence: confidence.tier,
      reason: `Based on bank ${affordability.lenderBasis.foirCapPercent}% FOIR guidelines on evaluated monthly income.`,
      explanation: affordability.lenderBasis.explanation,
    },
    safeRange: {
      value: loanAmounts.borrowerSafeRange.formatted,
      range: loanAmounts.borrowerSafeRange,
      confidence: confidence.tier,
      reason: `Calculated after deducting household expenses (₹${affordability.borrowerSafeBasis.effectiveLivingCosts.toLocaleString('en-IN')}) and existing debt.`,
      explanation: affordability.borrowerSafeBasis.explanation,
    },
    recommendedAmount: {
      value: loanAmounts.recommendedAmount.formatted,
      numeric: loanAmounts.recommendedAmount.value,
      confidence: confidence.tier,
      reason: loanAmounts.recommendedAmount.explanation,
      explanation: `We recommend borrowing ${loanAmounts.recommendedAmount.formatted} to keep monthly debt obligations within a safe budget buffer.`,
    },
    fairRateRange: {
      value: fairRateRange.formattedRange,
      minRate: fairRateRange.minRate,
      maxRate: fairRateRange.maxRate,
      confidence: confidence.tier,
      reason: fairRateRange.explanation,
      explanation: `Estimated rate pricing band for ${productRouting.productName} based on repo-linked market spreads.`,
    },
    aprRange: {
      value: aprRange.formattedAprRange,
      feeDrag: aprRange.feeDrag,
      confidence: confidence.tier,
      reason: aprRange.nominalVsAprDrag,
      explanation: aprRange.explanation,
    },
    safeEmiCeiling: {
      value: `₹${affordability.borrowerSafeBasis.safeMonthlyEmiCeiling.toLocaleString('en-IN')}/month`,
      numeric: affordability.borrowerSafeBasis.safeMonthlyEmiCeiling,
      confidence: confidence.tier,
      reason: `Your existing EMIs and living costs leave a safe cash surplus ceiling of ₹${affordability.borrowerSafeBasis.safeMonthlyEmiCeiling.toLocaleString('en-IN')}/mo.`,
      explanation: `Calculated by capping new EMI at 40% of unencumbered monthly surplus to prevent debt stress.`,
    },
    productRouting: {
      value: productRouting.productName,
      routeKey: productRouting.routeKey,
      isSecured: productRouting.isSecured,
      confidence: confidence.tier,
      reason: productRouting.recommendationText,
      explanation: productRouting.explanation,
    },
  };

  return {
    verdict,
    sanctionRange: loanAmounts.lenderSanctionRange,
    safeRange: loanAmounts.borrowerSafeRange,
    recommendedAmount: loanAmounts.recommendedAmount,
    fairRateRange,
    aprRange,
    safeEmiCeiling: affordability.borrowerSafeBasis.safeMonthlyEmiCeiling,
    tenureTradeoffs: emiInfo.tenureMatrix,
    proposedEmi: emiInfo.proposedEmi,
    stressScenario,
    confidence,
    productRouting,
    negotiationCard,
    reasonsSummary,
    affordability,
  };
}
