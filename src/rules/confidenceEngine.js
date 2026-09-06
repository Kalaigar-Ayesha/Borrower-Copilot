/**
 * Confidence & Uncertainty Assessment Engine
 * Enforces rule: Unknown parameters are NEVER treated as zero.
 * Missing or estimated inputs widen calculation ranges and lower confidence score.
 */

export function calculateConfidence(answers = {}) {
  const missingOrEstimatedFields = [];
  let scorePoints = 100;

  // Check Net Income
  if (!answers.netMonthlyIncome || answers.netMonthlyIncome <= 0) {
    scorePoints -= 35;
    missingOrEstimatedFields.push({
      key: 'netMonthlyIncome',
      label: 'Net Monthly Income',
      impact: 'High',
      recommendation: 'Specify your exact take-home salary after taxes to narrow down safe borrowing ceiling.',
    });
  }

  // Check Living Expenses
  if (!answers.essentialLivingCosts || answers.isLivingCostsEstimated) {
    scorePoints -= 20;
    missingOrEstimatedFields.push({
      key: 'essentialLivingCosts',
      label: 'Monthly Essential Expenses',
      impact: 'Medium',
      recommendation: 'Provide exact monthly living costs (rent, groceries, utilities) instead of benchmark estimate.',
    });
  }

  // Check CIBIL Tier
  if (!answers.cibilTierKey || answers.cibilTierKey === 'UNKNOWN') {
    scorePoints -= 15;
    missingOrEstimatedFields.push({
      key: 'cibilTierKey',
      label: 'CIBIL Credit Score',
      impact: 'Medium',
      recommendation: 'Check your free CIBIL score to get an exact interest rate band.',
    });
  }

  // Check Quoted Rate
  if (answers.customInterestRate === null || answers.customInterestRate === undefined || answers.customInterestRate === '') {
    scorePoints -= 15;
    missingOrEstimatedFields.push({
      key: 'customInterestRate',
      label: 'Lender Quoted Interest Rate',
      impact: 'Medium',
      recommendation: 'Enter the exact interest rate quoted by your bank (we used market benchmark average).',
    });
  }

  // Check Processing Fee
  if (answers.processingFeePercent === null || answers.processingFeePercent === undefined || answers.processingFeePercent === '') {
    scorePoints -= 10;
    missingOrEstimatedFields.push({
      key: 'processingFeePercent',
      label: 'Lender Processing Fee %',
      impact: 'Low',
      recommendation: 'Enter bank quoted processing fee to lock exact All-in APR.',
    });
  }

  scorePoints = Math.max(20, Math.min(100, scorePoints));

  let confidenceTier = 'HIGH';
  let badgeColor = '#1E3A2B';
  let badgeBg = '#EAF0EC';
  let rangeExpansionFactor = 0.05; // ±5%

  if (scorePoints < 60) {
    confidenceTier = 'LOW';
    badgeColor = '#B85C4B';
    badgeBg = '#FDF4F2';
    rangeExpansionFactor = 0.20; // ±20% wide range
  } else if (scorePoints < 85) {
    confidenceTier = 'MEDIUM';
    badgeColor = '#9E6D18';
    badgeBg = '#FAF4E8';
    rangeExpansionFactor = 0.12; // ±12% moderate range
  }

  return {
    scorePoints,
    confidenceTier,
    badgeColor,
    badgeBg,
    rangeExpansionFactor,
    missingOrEstimatedFields,
    summaryText: confidenceTier === 'HIGH'
      ? 'High Confidence Report based on exact financial figures.'
      : `${confidenceTier} Confidence: ${missingOrEstimatedFields.length} key input(s) estimated. Metric ranges widened to account for uncertainty.`,
  };
}
