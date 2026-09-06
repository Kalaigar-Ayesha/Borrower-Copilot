/**
 * EMI & Amortization Engine
 * Standard amortization mathematics, tenure trade-off matrix, and safe EMI ceiling.
 */

import { calculateAffordability } from './affordability.js';
import { calculateFairInterestRateRange } from './interestRate.js';

export function calculateEMI(principal, annualRate, tenureMonths) {
  if (!principal || principal <= 0 || !tenureMonths || tenureMonths <= 0) return 0;
  if (!annualRate || annualRate <= 0) return principal / tenureMonths;

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return isNaN(emi) ? 0 : Math.round(emi);
}

export function calculateEmiAndTenureTradeoffs(borrower = {}) {
  const {
    requestedAmount = 500000,
    requestedTenureMonths = 36,
  } = borrower;

  const rateRange = calculateFairInterestRateRange(borrower);
  const affordability = calculateAffordability(borrower);

  const nominalRateToUse = rateRange.midRate;
  const proposedEmi = calculateEMI(requestedAmount, nominalRateToUse, requestedTenureMonths);
  const totalRepayment = proposedEmi * requestedTenureMonths;
  const totalInterest = Math.max(0, totalRepayment - requestedAmount);

  const safeEmiCeiling = affordability.borrowerSafeBasis.safeMonthlyEmiCeiling;
  const isEmiWithinSafeCeiling = proposedEmi <= safeEmiCeiling && safeEmiCeiling > 0;

  // Tenure matrix (12 to 240 months)
  const tenureOptions = [12, 24, 36, 60, 84, 120, 180, 240].filter((m) => m <= 360);

  const matrix = tenureOptions.map((months) => {
    const emiVal = calculateEMI(requestedAmount, nominalRateToUse, months);
    const totalPay = emiVal * months;
    const totalInt = Math.max(0, totalPay - requestedAmount);
    const multiplier = requestedAmount > 0 ? (totalInt / requestedAmount) : 0;

    return {
      tenureMonths: months,
      tenureYears: (months / 12).toFixed(1),
      emi: Math.round(emiVal),
      totalInterest: Math.round(totalInt),
      totalRepayment: Math.round(totalPay),
      interestMultiplier: Number(multiplier.toFixed(2)),
      isSelected: months === requestedTenureMonths,
      isWithinSafeCeiling: emiVal <= safeEmiCeiling,
    };
  });

  return {
    proposedEmi: Math.round(proposedEmi),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
    nominalRateUsed: nominalRateToUse,
    safeEmiCeiling: Math.round(safeEmiCeiling),
    isEmiWithinSafeCeiling,
    tenureMatrix: matrix,
    explanation: `Your proposed EMI is ₹${Math.round(proposedEmi).toLocaleString('en-IN')}/mo at an estimated mid-rate of ${nominalRateToUse.toFixed(1)}%. Your recommended safe EMI ceiling is ₹${Math.round(safeEmiCeiling).toLocaleString('en-IN')}/mo.`,
  };
}
