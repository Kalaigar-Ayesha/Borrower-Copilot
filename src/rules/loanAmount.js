/**
 * Loan Amount Range & Recommendation Engine
 * Calculates Lender Sanction Range, Borrower-Safe Borrowing Range, and Recommended Amount.
 */

import { calculateAffordability } from './affordability.js';
import { calculateFairInterestRateRange } from './interestRate.js';
import { calculateMaxPrincipalFromEMI } from './financialCalculations.js';

export function calculateLoanAmountRanges(borrower = {}) {
  const {
    requestedAmount = 500000,
    requestedTenureMonths = 36,
  } = borrower;

  const affordability = calculateAffordability(borrower);
  const rateRange = calculateFairInterestRateRange(borrower);

  // Lender Sanction Range: calculated at maxRate vs minRate
  const lenderMaxEmi = affordability.lenderBasis.lenderMaxMonthlyEmi;
  let lenderSanctionMin = calculateMaxPrincipalFromEMI(lenderMaxEmi, rateRange.maxRate, requestedTenureMonths);
  let lenderSanctionMax = calculateMaxPrincipalFromEMI(lenderMaxEmi, rateRange.minRate, requestedTenureMonths);

  // LAP Collateral Cap override (if secured loan, sanction cannot exceed LTV cap)
  if (affordability.routing.isSecured && affordability.routing.collateralCapSanction > 0) {
    lenderSanctionMax = Math.min(lenderSanctionMax, affordability.routing.collateralCapSanction);
    lenderSanctionMin = Math.min(lenderSanctionMin, affordability.routing.collateralCapSanction * 0.85);
  }

  // Borrower-Safe Range: calculated from safe EMI ceiling
  const safeEmi = affordability.borrowerSafeBasis.safeMonthlyEmiCeiling;
  let safeBorrowingMin = calculateMaxPrincipalFromEMI(safeEmi, rateRange.maxRate, requestedTenureMonths);
  let safeBorrowingMax = calculateMaxPrincipalFromEMI(safeEmi, rateRange.minRate, requestedTenureMonths);

  // Recommended Amount: Lower of Requested Amount or Safe Borrowing Max
  let recommendedAmount = Math.min(requestedAmount, safeBorrowingMax);
  if (safeBorrowingMax <= 0) {
    recommendedAmount = 0;
  }

  const formatLakhs = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return {
    lenderSanctionRange: {
      min: Math.round(lenderSanctionMin),
      max: Math.round(lenderSanctionMax),
      formatted: `${formatLakhs(lenderSanctionMin)} – ${formatLakhs(lenderSanctionMax)}`,
      explanation: `Lenders may sanction between ${formatLakhs(lenderSanctionMin)} and ${formatLakhs(lenderSanctionMax)} based on FOIR risk guidelines.`,
    },
    borrowerSafeRange: {
      min: Math.round(safeBorrowingMin),
      max: Math.round(safeBorrowingMax),
      formatted: `${formatLakhs(safeBorrowingMin)} – ${formatLakhs(safeBorrowingMax)}`,
      explanation: `Your safe borrowing capacity ranges between ${formatLakhs(safeBorrowingMin)} and ${formatLakhs(safeBorrowingMax)} without risking cash flow deficit.`,
    },
    recommendedAmount: {
      value: Math.round(recommendedAmount),
      formatted: formatLakhs(recommendedAmount),
      isCappedBySafety: requestedAmount > safeBorrowingMax,
      explanation: requestedAmount > safeBorrowingMax
        ? `We recommend capping your loan at ${formatLakhs(recommendedAmount)} (below requested ${formatLakhs(requestedAmount)}) to protect your monthly living expenses.`
        : `Your requested loan of ${formatLakhs(requestedAmount)} fits comfortably within your safe borrowing range.`,
    },
  };
}
