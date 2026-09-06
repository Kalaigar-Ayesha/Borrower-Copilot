/**
 * Interest Rate Range Engine
 * Calculates fair interest rate ranges without false precision (e.g., 11.0% - 12.5%).
 */

import { ASSUMPTIONS } from '../data/assumptions.js';
import { CIBIL_TIERS, LOAN_CATEGORIES } from '../data/indianLendingBenchmarks.js';
import { determineProductRouting } from './productRouting.js';

export function calculateFairInterestRateRange(borrower = {}) {
  const {
    loanCategoryKey = 'PERSONAL',
    cibilTierKey = 'GOOD',
    recentPaymentBounce = false,
    incomeType = 'SALARIED',
  } = borrower;

  const routing = determineProductRouting(borrower);
  const category = LOAN_CATEGORIES[loanCategoryKey] || LOAN_CATEGORIES.PERSONAL;
  const cibil = CIBIL_TIERS[cibilTierKey] || CIBIL_TIERS.UNKNOWN;

  const baseRate = ASSUMPTIONS.BASE_REPO_BENCHMARK.value;
  const cibilSpread = ASSUMPTIONS.CIBIL_RISK_SPREADS[cibil.key] || ASSUMPTIONS.CIBIL_RISK_SPREADS.UNKNOWN;

  let minRate = baseRate + cibilSpread.min;
  let maxRate = baseRate + cibilSpread.max;

  // Category adjustments
  if (loanCategoryKey === 'HOME') {
    minRate = Math.max(8.25, minRate - 1.5);
    maxRate = Math.max(9.50, maxRate - 1.5);
  } else if (loanCategoryKey === 'CAR') {
    minRate = Math.max(8.75, minRate - 1.0);
    maxRate = Math.max(10.50, maxRate - 1.0);
  }

  // Collateral / LAP Rate Discount (Ravi's scenario)
  if (routing.isSecured) {
    minRate = Math.max(9.0, minRate - routing.rateDiscount);
    maxRate = Math.max(11.5, maxRate - routing.rateDiscount);
  }

  // Payment bounce penalty (+2.5%)
  if (recentPaymentBounce) {
    minRate += 2.5;
    maxRate += 3.5;
  }

  // Round to clean 0.25% or 0.5% steps to prevent false precision
  minRate = Math.round(minRate * 4) / 4;
  maxRate = Math.round(maxRate * 4) / 4;
  if (maxRate <= minRate) {
    maxRate = minRate + 1.25;
  }

  const formattedRange = `${minRate.toFixed(1)}% – ${maxRate.toFixed(1)}% p.a.`;

  return {
    minRate: Number(minRate.toFixed(2)),
    maxRate: Number(maxRate.toFixed(2)),
    midRate: Number(((minRate + maxRate) / 2).toFixed(2)),
    formattedRange,
    isUnknownCibil: cibil.isUnknown || false,
    cibilLabel: cibil.label,
    explanation: cibil.isUnknown
      ? `Credit score unrated. Fair interest rate estimated at ${formattedRange} based on market repo-linked benchmarks. Providing a CIBIL score will narrow this range.`
      : `Based on your ${cibil.label} credit score and ${routing.productName} pricing benchmarks.`,
  };
}
