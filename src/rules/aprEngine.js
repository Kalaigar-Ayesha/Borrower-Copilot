/**
 * All-In APR (Annual Percentage Rate) Calculation Engine
 * Indian lending laws require transparency on true effective APR including processing fees and 18% GST.
 */

import { GST_RATE, LOAN_CATEGORIES, CIBIL_TIERS } from '../data/indianLendingBenchmarks.js';
import { calculateEMI } from './financialCalculations.js';

/**
 * Calculates All-In Effective APR and fee drag breakdown.
 */
export function calculateAllInApr({
  principal = 100000,
  nominalRate = 12.0,
  tenureMonths = 36,
  processingFeePercent = 1.5,
  documentationFee = 500,
  insuranceFee = 0,
}) {
  if (!principal || principal <= 0 || !tenureMonths || tenureMonths <= 0) {
    return {
      nominalRate: 0,
      allInApr: 0,
      feeDrag: 0,
      totalUpfrontDeduction: 0,
      netDisbursedAmount: 0,
      processingFeeAmount: 0,
      gstAmount: 0,
      breakdown: [],
    };
  }

  // Processing fee before GST
  const rawProcessingFee = (principal * (processingFeePercent / 100));
  const gstOnFee = rawProcessingFee * GST_RATE;
  const totalProcessingFeeWithGst = rawProcessingFee + gstOnFee;

  const totalUpfrontDeduction = totalProcessingFeeWithGst + documentationFee + insuranceFee;
  const netDisbursedAmount = Math.max(1, principal - totalUpfrontDeduction);

  const monthlyEmi = calculateEMI(principal, nominalRate, tenureMonths);
  const totalRepayment = monthlyEmi * tenureMonths;

  // Numerical solver for Internal Rate of Return (IRR) on net disbursed cashflows
  // Net cashflow: +NetDisbursed at T=0, -EMI for T=1..tenureMonths
  let rateGuess = nominalRate / 12 / 100;
  for (let iter = 0; iter < 100; iter++) {
    let npv = -netDisbursedAmount;
    let derivative = 0;

    for (let t = 1; t <= tenureMonths; t++) {
      const discountFactor = Math.pow(1 + rateGuess, t);
      npv += monthlyEmi / discountFactor;
      derivative -= (t * monthlyEmi) / (discountFactor * (1 + rateGuess));
    }

    if (Math.abs(npv) < 1e-4) break;
    const nextGuess = rateGuess - npv / derivative;
    if (isNaN(nextGuess) || nextGuess <= 0) break;
    rateGuess = nextGuess;
  }

  const effectiveMonthlyRate = rateGuess;
  const allInApr = effectiveMonthlyRate * 12 * 100;
  const feeDrag = Math.max(0, allInApr - nominalRate);

  return {
    nominalRate: Number(nominalRate.toFixed(2)),
    allInApr: Number(allInApr.toFixed(2)),
    feeDrag: Number(feeDrag.toFixed(2)),
    monthlyEmi: Math.round(monthlyEmi),
    totalRepayment: Math.round(totalRepayment),
    totalUpfrontDeduction: Math.round(totalUpfrontDeduction),
    netDisbursedAmount: Math.round(netDisbursedAmount),
    processingFeeAmount: Math.round(rawProcessingFee),
    gstAmount: Math.round(gstOnFee),
    documentationFee,
    insuranceFee,
    breakdown: [
      { label: 'Raw Processing Fee', value: Math.round(rawProcessingFee), desc: `${processingFeePercent}% of loan amount` },
      { label: 'GST on Processing Fee (18%)', value: Math.round(gstOnFee), desc: 'Mandatory Indian Govt Tax' },
      { label: 'Documentation & Stamp Charges', value: documentationFee, desc: 'Franking and agreement legal cost' },
      { label: 'Insurance / Shield', value: insuranceFee, desc: 'Optional credit protection plan' },
    ],
  };
}

/**
 * Calculates Fair Interest Rate range based on loan category benchmark and credit tier
 */
export function calculateFairInterestRateRange(loanCategoryKey = 'PERSONAL', cibilTierKey = 'GOOD') {
  const category = LOAN_CATEGORIES[loanCategoryKey] || LOAN_CATEGORIES.PERSONAL;
  const cibil = CIBIL_TIERS[cibilTierKey] || CIBIL_TIERS.GOOD;

  const riskAddon = category.riskPremium[cibil.key] || 1.5;
  const minFairRate = category.baseInterestRate + riskAddon;
  const maxFairRate = minFairRate + 1.75;
  const predatoryRateThreshold = minFairRate + 5.0;

  return {
    minFairRate: Number(minFairRate.toFixed(2)),
    maxFairRate: Number(maxFairRate.toFixed(2)),
    predatoryRateThreshold: Number(predatoryRateThreshold.toFixed(2)),
    benchmarkBase: category.baseInterestRate,
    cibilAdjustment: riskAddon,
    cibilTierLabel: cibil.label,
    explanation: `Fair rates for ${category.label} given CIBIL tier (${cibil.label}) range between ${minFairRate.toFixed(2)}% and ${maxFairRate.toFixed(2)}% p.a.`,
  };
}
