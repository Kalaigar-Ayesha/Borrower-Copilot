/**
 * Bank Negotiation Card Generator
 * Produces word-for-word negotiation talking points and fee reduction targets for Indian borrowers.
 */

import { LOAN_CATEGORIES, CIBIL_TIERS } from '../data/indianLendingBenchmarks.js';
import { calculateFairInterestRateRange } from './aprEngine.js';

export function generateNegotiationCard({
  loanCategoryKey = 'PERSONAL',
  requestedAmount = 500000,
  quotedRate = 13.5,
  quotedFeePercent = 1.5,
  cibilTierKey = 'EXCELLENT',
}) {
  const category = LOAN_CATEGORIES[loanCategoryKey] || LOAN_CATEGORIES.PERSONAL;
  const cibil = CIBIL_TIERS[cibilTierKey] || CIBIL_TIERS.GOOD;
  const fairRates = calculateFairInterestRateRange(loanCategoryKey, cibilTierKey);

  const targetRate = fairRates.minFairRate;
  const potentialRateSavingsPercent = Math.max(0, quotedRate - targetRate);

  // Annual interest savings if rate is reduced to targetRate
  const yearlyInterestSavings = (requestedAmount * (potentialRateSavingsPercent / 100));

  // Upfront fee waiver target
  const rawQuotedFee = requestedAmount * (quotedFeePercent / 100);
  const gstQuotedFee = rawQuotedFee * 0.18;
  const totalQuotedFeeWithGst = rawQuotedFee + gstQuotedFee;

  const targetFeePercent = 0.5; // Realistic target after negotiation
  const targetFeeAmountWithGst = (requestedAmount * (targetFeePercent / 100)) * 1.18;
  const potentialFeeSavings = Math.max(0, totalQuotedFeeWithGst - targetFeeAmountWithGst);

  // Negotiation Script customized to credit score
  const scripts = [
    {
      title: '1. Rate Match Request (Interest Rate Counter-Offer)',
      script: `"My CIBIL score is in the ${cibil.label} band. Based on current RBI repo rate benchmarks for ${category.label}, market rates for top-tier profiles are at ${targetRate.toFixed(2)}%. Another lender is quoting near ${targetRate.toFixed(2)}%. If you can match ${targetRate.toFixed(2)}%, I am ready to submit documentation today."`,
      goal: `Target Rate: ${targetRate.toFixed(2)}% (Saves ~₹${Math.round(yearlyInterestSavings).toLocaleString('en-IN')}/yr)`,
    },
    {
      title: '2. Processing Fee Waiver Demand',
      script: `"Your quoted processing fee of ${quotedFeePercent}% plus 18% GST adds ₹${Math.round(totalQuotedFeeWithGst).toLocaleString('en-IN')} upfront. I am requesting a processing fee capping at 0.5% or a complete waiver as part of your festive/special RM approval quota."`,
      goal: `Target Fee: 0.5% or flat ₹1,000 cap (Saves ₹${Math.round(potentialFeeSavings).toLocaleString('en-IN')})`,
    },
    {
      title: '3. Pre-payment & Foreclosure Clause Verification',
      script: `"Please confirm in writing that there are ZERO foreclosure charges or part-prepayment penalties after 6 EMIs, as per RBI guidelines for floating rate loans. I want this explicitly mentioned in the sanction letter."`,
      goal: 'Zero Pre-payment Penalty Clause',
    },
  ];

  return {
    loanLabel: category.label,
    cibilLabel: cibil.label,
    quotedRate,
    targetRate: Number(targetRate.toFixed(2)),
    potentialRateSavingsPercent: Number(potentialRateSavingsPercent.toFixed(2)),
    yearlyInterestSavings: Math.round(yearlyInterestSavings),
    quotedFeeWithGst: Math.round(totalQuotedFeeWithGst),
    targetFeeWithGst: Math.round(targetFeeAmountWithGst),
    potentialFeeSavings: Math.round(potentialFeeSavings),
    totalPotentialSavings: Math.round((yearlyInterestSavings * 3) + potentialFeeSavings),
    scripts,
    leveragePoints: [
      cibil.key === 'EXCELLENT' ? 'CIBIL 775+ gives you strong bargaining power across top private & PSU banks.' : 'Good repayment track record gives leverage.',
      'Lenders have monthly RM disbursal quotas; EOF month negotiations yield maximum fee waivers.',
      'RBI mandates 0 foreclosure penalty on individual floating-rate loans.',
    ],
  };
}
