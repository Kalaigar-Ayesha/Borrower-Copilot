/**
 * All-In Effective APR Range Engine
 * Solves true annualized cost range factoring in nominal interest, processing fee, and 18% GST.
 */

import { ASSUMPTIONS } from '../data/assumptions.js';
import { calculateFairInterestRateRange } from './interestRate.js';
import { determineProductRouting } from './productRouting.js';

function solveSingleApr(principal, nominalRate, tenureMonths, processingFeePercent) {
  if (!principal || principal <= 0 || !tenureMonths || tenureMonths <= 0) return nominalRate;

  const rawFee = principal * (processingFeePercent / 100);
  const gstOnFee = rawFee * ASSUMPTIONS.GST_RATE.value;
  const totalUpfrontDeduction = rawFee + gstOnFee + 500; // 500 doc fee
  const netDisbursed = Math.max(1, principal - totalUpfrontDeduction);

  // EMI calculation on nominal principal
  const monthlyRate = nominalRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);

  // IRR solver
  let rateGuess = nominalRate / 12 / 100;
  for (let iter = 0; iter < 100; iter++) {
    let npv = -netDisbursed;
    let derivative = 0;
    for (let t = 1; t <= tenureMonths; t++) {
      const discount = Math.pow(1 + rateGuess, t);
      npv += emi / discount;
      derivative -= (t * emi) / (discount * (1 + rateGuess));
    }
    if (Math.abs(npv) < 1e-4) break;
    const next = rateGuess - npv / derivative;
    if (isNaN(next) || next <= 0) break;
    rateGuess = next;
  }

  return rateGuess * 12 * 100;
}

export function calculateAprRange(borrower = {}) {
  const {
    requestedAmount = 500000,
    requestedTenureMonths = 36,
    processingFeePercent = null,
    loanCategoryKey = 'PERSONAL',
  } = borrower;

  const rateRange = calculateFairInterestRateRange(borrower);
  const routing = determineProductRouting(borrower);

  // Fee configuration
  const feePercentToUse = processingFeePercent !== null && processingFeePercent !== undefined
    ? parseFloat(processingFeePercent)
    : (ASSUMPTIONS.DEFAULT_PROCESSING_FEE_PERCENT[routing.routeKey] || ASSUMPTIONS.DEFAULT_PROCESSING_FEE_PERCENT[loanCategoryKey] || 1.5);

  const minApr = solveSingleApr(requestedAmount, rateRange.minRate, requestedTenureMonths, feePercentToUse);
  const maxApr = solveSingleApr(requestedAmount, rateRange.maxRate, requestedTenureMonths, feePercentToUse);

  const roundedMinApr = Math.round(minApr * 4) / 4;
  const roundedMaxApr = Math.round(maxApr * 4) / 4;

  const rawFeeAmount = requestedAmount * (feePercentToUse / 100);
  const gstAmount = rawFeeAmount * ASSUMPTIONS.GST_RATE.value;

  const formattedAprRange = `${roundedMinApr.toFixed(1)}% – ${roundedMaxApr.toFixed(1)}% p.a.`;
  const feeDrag = Number((roundedMinApr - rateRange.minRate).toFixed(2));

  return {
    minApr: Number(roundedMinApr.toFixed(2)),
    maxApr: Number(roundedMaxApr.toFixed(2)),
    formattedAprRange,
    processingFeePercent: feePercentToUse,
    rawFeeAmount: Math.round(rawFeeAmount),
    gstAmount: Math.round(gstAmount),
    totalUpfrontDeduction: Math.round(rawFeeAmount + gstAmount + 500),
    feeDrag,
    nominalVsAprDrag: `Upfront processing fee (${feePercentToUse}%) and 18% GST add +${feeDrag.toFixed(1)}% to your true annualized cost.`,
    explanation: `Estimated All-in APR range is ${formattedAprRange}. Unlike quoted nominal rates, All-in APR reflects the true net cash received after bank fees and 18% GST.`,
  };
}
