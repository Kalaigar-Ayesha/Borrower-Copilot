/**
 * Confidence & Uncertainty Assessment Engine
 * Enforces rule: Unknown parameters widen calculation ranges and lower confidence score without defaulting to 0.
 */

import { CIBIL_TIERS } from '../data/indianLendingBenchmarks.js';

export function calculateConfidenceScore(borrower = {}) {
  const missingOrEstimatedFields = [];
  let scorePoints = 100;

  // Check Net Income
  if (!borrower.netMonthlyIncome || borrower.netMonthlyIncome <= 0) {
    scorePoints -= 35;
    missingOrEstimatedFields.push({
      key: 'netMonthlyIncome',
      label: 'Net Monthly Income',
      impact: 'High',
      recommendation: 'Specify your net take-home salary or net business cash inflow to lock exact capacity.',
    });
  }

  // Check Household Expenses
  if (borrower.essentialLivingCosts === null || borrower.essentialLivingCosts === undefined || borrower.essentialLivingCosts === '') {
    scorePoints -= 15;
    missingOrEstimatedFields.push({
      key: 'essentialLivingCosts',
      label: 'Monthly Household Expenses',
      impact: 'Medium',
      recommendation: 'Enter exact living costs (rent, groceries, utilities) instead of our 38% urban benchmark estimate.',
    });
  }

  // Check Credit Score
  const cibil = CIBIL_TIERS[borrower.cibilTierKey] || CIBIL_TIERS.UNKNOWN;
  if (!borrower.cibilTierKey || cibil.isUnknown) {
    scorePoints -= 15;
    missingOrEstimatedFields.push({
      key: 'cibilTierKey',
      label: 'Credit Score Band',
      impact: 'Medium',
      recommendation: 'Specify your CIBIL score band to narrow your interest rate range.',
    });
  }

  // Check Bank Quoted Rate
  if (borrower.customInterestRate === null || borrower.customInterestRate === undefined || borrower.customInterestRate === '') {
    scorePoints -= 10;
    missingOrEstimatedFields.push({
      key: 'customInterestRate',
      label: 'Bank Quoted Interest Rate',
      impact: 'Low',
      recommendation: 'Enter the exact nominal rate quoted by your bank (we used market benchmark average).',
    });
  }

  // Check Processing Fee
  if (borrower.processingFeePercent === null || borrower.processingFeePercent === undefined || borrower.processingFeePercent === '') {
    scorePoints -= 5;
    missingOrEstimatedFields.push({
      key: 'processingFeePercent',
      label: 'Quoted Processing Fee %',
      impact: 'Low',
      recommendation: 'Enter bank quoted processing fee to lock exact All-In APR.',
    });
  }

  scorePoints = Math.max(20, Math.min(100, scorePoints));

  let tier = 'HIGH';
  let badgeColor = '#1E3A2B';
  let badgeBg = '#EAF0EC';
  let rangeExpansionFactor = 0.05; // ±5%

  if (scorePoints < 60) {
    tier = 'LOW';
    badgeColor = '#B85C4B';
    badgeBg = '#FDF4F2';
    rangeExpansionFactor = 0.20; // ±20% wide range
  } else if (scorePoints < 85) {
    tier = 'MEDIUM';
    badgeColor = '#9E6D18';
    badgeBg = '#FAF4E8';
    rangeExpansionFactor = 0.12; // ±12% moderate range
  }

  return {
    scorePoints,
    tier,
    badgeColor,
    badgeBg,
    rangeExpansionFactor,
    missingOrEstimatedFields,
    explanation: tier === 'HIGH'
      ? 'High Confidence Report based on verified financial figures.'
      : `${tier} Confidence: ${missingOrEstimatedFields.length} key input(s) estimated. Metric ranges widened to account for uncertainty.`,
  };
}
