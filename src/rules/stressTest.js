/**
 * Stress Scenario Testing Engine
 * Tests 2-Point Economic Shocks:
 * 1. Income Reduction (-20%)
 * 2. Interest Rate Hike (+2.0%)
 */

import { ASSUMPTIONS } from '../data/assumptions.js';
import { calculateEMI } from './emi.js';
import { calculateAffordability } from './affordability.js';
import { calculateFairInterestRateRange } from './interestRate.js';

export function runStressTestScenarios(borrower = {}) {
  const {
    netMonthlyIncome = 0,
    requestedAmount = 500000,
    requestedTenureMonths = 36,
    existingMonthlyEmis = 0,
  } = borrower;

  const baseAffordability = calculateAffordability(borrower);
  const baseRate = calculateFairInterestRateRange(borrower);
  const baseEmi = calculateEMI(requestedAmount, baseRate.midRate, requestedTenureMonths);

  // Scenario 1: Income Shock (-20%)
  const stressedIncome = netMonthlyIncome * (1 - ASSUMPTIONS.STRESS_INCOME_SHOCK.value);
  const stressedProfile1 = { ...borrower, netMonthlyIncome: stressedIncome };
  const affordabilityScenario1 = calculateAffordability(stressedProfile1);

  const surplusScenario1 = affordabilityScenario1.borrowerSafeBasis.disposableCashSurplus - baseEmi;
  const passScenario1 = surplusScenario1 >= 0;

  // Scenario 2: Interest Rate Spike (+2.0%)
  const stressedRate = baseRate.midRate + ASSUMPTIONS.STRESS_RATE_HIKE.value;
  const stressedEmi2 = calculateEMI(requestedAmount, stressedRate, requestedTenureMonths);
  const emiDelta2 = stressedEmi2 - baseEmi;
  const surplusScenario2 = baseAffordability.borrowerSafeBasis.disposableCashSurplus - stressedEmi2;
  const passScenario2 = surplusScenario2 >= 0;

  const passedCount = (passScenario1 ? 1 : 0) + (passScenario2 ? 1 : 0);

  let resilienceLevel = 'HIGHLY_RESILIENT';
  let resilienceTitle = 'Strong Resilience to Shocks';
  let resilienceColor = '#1E3A2B';
  let resilienceBg = '#EAF0EC';

  if (passedCount === 1) {
    resilienceLevel = 'MODERATELY_STRAINED';
    resilienceTitle = 'Moderate Resilience';
    resilienceColor = '#9E6D18';
    resilienceBg = '#FAF4E8';
  } else if (passedCount === 0) {
    resilienceLevel = 'VULNERABLE';
    resilienceTitle = 'Vulnerable to Shocks';
    resilienceColor = '#B85C4B';
    resilienceBg = '#FDF4F2';
  }

  return {
    passedCount,
    totalScenarios: 2,
    resilienceLevel,
    resilienceTitle,
    resilienceColor,
    resilienceBg,
    scenarios: [
      {
        id: 'INCOME_SHOCK',
        name: 'Scenario 1: 20% Income Drop',
        description: 'Simulates a 20% drop in net monthly salary or business earnings.',
        surplusAfterShock: Math.round(surplusScenario1),
        passed: passScenario1,
        explanation: passScenario1
          ? `Leaves a positive monthly surplus of ₹${Math.round(surplusScenario1).toLocaleString('en-IN')}.`
          : `Pushes cash flow negative by ₹${Math.abs(Math.round(surplusScenario1)).toLocaleString('en-IN')}/mo under income reduction.`,
      },
      {
        id: 'RATE_HIKE',
        name: 'Scenario 2: +2.0% Interest Rate Spike',
        description: 'Simulates a 200 bps tightening cycle by the RBI.',
        surplusAfterShock: Math.round(surplusScenario2),
        emiIncrease: Math.round(emiDelta2),
        newEmi: Math.round(stressedEmi2),
        passed: passScenario2,
        explanation: `EMI increases by ₹${Math.round(emiDelta2).toLocaleString('en-IN')}/mo (to ₹${Math.round(stressedEmi2).toLocaleString('en-IN')}). ${
          passScenario2 ? 'Handled safely.' : 'Deficit created.'
        }`,
      },
    ],
    explanation: `Stress test passed ${passedCount} of 2 economic shock scenarios (-20% income and +2.0% rate hike). ${
      passedCount === 2 ? 'Your budget is resilient against unexpected life shocks.' : 'Your budget faces cash flow strain under severe economic shocks.'
    }`,
  };
}
