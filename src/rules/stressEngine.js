/**
 * Stress Scenario Testing Engine
 * Tests financial resilience under 3 severe real-world shocks.
 */

import { calculateEMI } from './financialCalculations.js';

export function runStressScenarios({
  netMonthlyIncome = 0,
  essentialLivingCosts = 0,
  existingMonthlyEmis = 0,
  proposedEmi = 0,
  principal = 0,
  interestRate = 12.0,
  tenureMonths = 36,
}) {
  const currentSurplusPostLoan = netMonthlyIncome - essentialLivingCosts - existingMonthlyEmis - proposedEmi;

  // Scenario 1: Income Drop (-20%)
  const stressedIncome1 = netMonthlyIncome * 0.80;
  const surplusScenario1 = stressedIncome1 - essentialLivingCosts - existingMonthlyEmis - proposedEmi;
  const pass1 = surplusScenario1 >= 0;

  // Scenario 2: Emergency Expense (+₹20,000 / month)
  const emergencyCost = 20000;
  const surplusScenario2 = netMonthlyIncome - (essentialLivingCosts + emergencyCost) - existingMonthlyEmis - proposedEmi;
  const pass2 = surplusScenario2 >= 0;

  // Scenario 3: Interest Rate Spike (+2.5% p.a.)
  const stressedRate = interestRate + 2.5;
  const stressedEmi3 = calculateEMI(principal, stressedRate, tenureMonths);
  const emiDelta3 = stressedEmi3 - proposedEmi;
  const surplusScenario3 = netMonthlyIncome - essentialLivingCosts - existingMonthlyEmis - stressedEmi3;
  const pass3 = surplusScenario3 >= 0;

  const passedCount = (pass1 ? 1 : 0) + (pass2 ? 1 : 0) + (pass3 ? 1 : 0);

  let resilienceLevel = 'HIGHLY_RESILIENT';
  let resilienceTitle = 'Strong Financial Cushion';
  let resilienceColor = '#1E3A2B';
  let resilienceBg = '#EAF0EC';

  if (passedCount === 2) {
    resilienceLevel = 'MODERATELY_STRAINED';
    resilienceTitle = 'Moderate Resilience';
    resilienceColor = '#9E6D18';
    resilienceBg = '#FAF4E8';
  } else if (passedCount <= 1) {
    resilienceLevel = 'VULNERABLE';
    resilienceTitle = 'Vulnerable to Shocks';
    resilienceColor = '#B85C4B';
    resilienceBg = '#FDF4F2';
  }

  return {
    passedCount,
    totalScenarios: 3,
    resilienceLevel,
    resilienceTitle,
    resilienceColor,
    resilienceBg,
    currentSurplusPostLoan: Math.round(currentSurplusPostLoan),
    scenarios: [
      {
        id: 'INCOME_SHOCK',
        name: 'Scenario A: 20% Income Reduction',
        description: 'Simulates salary cut, job change gap, or business slowdown.',
        surplusAfterShock: Math.round(surplusScenario1),
        passed: pass1,
        impactSummary: pass1
          ? `Leaves a positive monthly surplus buffer of ₹${Math.round(surplusScenario1).toLocaleString('en-IN')}.`
          : `Pushes cash flow negative by ₹${Math.abs(Math.round(surplusScenario1)).toLocaleString('en-IN')}/month.`,
      },
      {
        id: 'EMERGENCY_EXPENSE',
        name: 'Scenario B: ₹20,000/mo Emergency Outflow',
        description: 'Simulates sudden medical care, family support, or home repair.',
        surplusAfterShock: Math.round(surplusScenario2),
        passed: pass2,
        impactSummary: pass2
          ? `Maintains positive cash flow with ₹${Math.round(surplusScenario2).toLocaleString('en-IN')}/month cushion.`
          : `Deficit of ₹${Math.abs(Math.round(surplusScenario2)).toLocaleString('en-IN')}/month under emergency.`,
      },
      {
        id: 'RATE_HIKE',
        name: 'Scenario C: +2.5% Interest Rate Hike',
        description: 'Simulates RBI rate tightening on floating interest rate loans.',
        surplusAfterShock: Math.round(surplusScenario3),
        passed: pass3,
        emiIncrease: Math.round(emiDelta3),
        newEmi: Math.round(stressedEmi3),
        impactSummary: `Monthly EMI increases by ₹${Math.round(emiDelta3).toLocaleString('en-IN')} (to ₹${Math.round(stressedEmi3).toLocaleString('en-IN')}). ${
          pass3 ? 'Handled safely.' : 'Deficit created.'
        }`,
      },
    ],
  };
}
