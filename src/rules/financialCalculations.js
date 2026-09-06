/**
 * Core Financial Calculation Engine
 * Strictly decoupled from presentation layer.
 * Processes complete borrower profile including adaptive fields.
 */

import { LOAN_CATEGORIES, CIBIL_TIERS } from '../data/indianLendingBenchmarks.js';

export function calculateEMI(principal, annualRate, tenureMonths) {
  if (!principal || principal <= 0 || !tenureMonths || tenureMonths <= 0) return 0;
  if (!annualRate || annualRate <= 0) return principal / tenureMonths;

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return isNaN(emi) ? 0 : Math.round(emi);
}

export function calculateMaxPrincipalFromEMI(maxEMI, annualRate, tenureMonths) {
  if (!maxEMI || maxEMI <= 0 || !tenureMonths || tenureMonths <= 0) return 0;
  if (!annualRate || annualRate <= 0) return maxEMI * tenureMonths;

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const principal = (maxEMI * (factor - 1)) / (monthlyRate * factor);
  return isNaN(principal) ? 0 : Math.round(principal);
}

/**
 * Calculates Lender-Likely Sanction Capacity (What Banks will lend)
 * Considers ITR limits, age ceiling, collateral, and employment structure.
 */
export function calculateLenderSanction(profile = {}) {
  const {
    netMonthlyIncome = 0,
    existingMonthlyEmis = 0,
    loanCategoryKey = 'PERSONAL',
    cibilTierKey = 'GOOD',
    requestedTenureMonths = 36,
    customInterestRate = null,
    incomeType = 'SALARIED',
    itrAnnualIncome = null,
    hasCollateral = false,
    age = 35,
    employmentDuration = '1_TO_3_YRS',
    businessDuration = '2_TO_5_YRS',
    recentPaymentBounce = false,
  } = profile;

  const category = LOAN_CATEGORIES[loanCategoryKey] || LOAN_CATEGORIES.PERSONAL;
  const cibil = CIBIL_TIERS[cibilTierKey] || CIBIL_TIERS.GOOD;

  // Base interest rate calculation
  let interestRate = customInterestRate !== null && customInterestRate > 0
    ? customInterestRate
    : category.baseInterestRate + (category.riskPremium[cibil.key] || 1.5);

  // Collateral discount
  if (hasCollateral) {
    interestRate = Math.max(7.5, interestRate - 2.0);
  }

  // Bounce penalty
  if (recentPaymentBounce) {
    interestRate += 2.5;
  }

  // Age tenure restriction (Retirement age 60 for salaried, 65 for self-employed)
  const retirementAge = incomeType === 'SALARIED' ? 60 : 65;
  const maxAllowableMonths = Math.max(12, Math.min(360, (retirementAge - (age || 35)) * 12));
  const effectiveTenureMonths = Math.min(requestedTenureMonths || 36, maxAllowableMonths);

  // Income basis for bank FOIR: Self-employed banks cap at reported ITR
  let bankIncomeBasis = netMonthlyIncome;
  if (incomeType === 'SELF_EMPLOYED' && itrAnnualIncome !== null && itrAnnualIncome > 0) {
    const monthlyItr = itrAnnualIncome / 12;
    bankIncomeBasis = Math.min(netMonthlyIncome, monthlyItr);
  }

  let maxAllowedFoir = category.maxAllowedFoir;
  if (incomeType === 'INFORMAL_GIG') {
    maxAllowedFoir = 0.40; // Conservative FOIR cap for gig workers
  } else if (hasCollateral) {
    maxAllowedFoir += 0.05; // Collateral boost
  }

  const grossAllowedEmi = bankIncomeBasis * maxAllowedFoir;
  const bankCapacityEmi = Math.max(0, grossAllowedEmi - existingMonthlyEmis);

  const sanctionedPrincipal = calculateMaxPrincipalFromEMI(bankCapacityEmi, interestRate, effectiveTenureMonths);

  return {
    bankCapacityEmi: Math.round(bankCapacityEmi),
    sanctionedPrincipal: Math.round(sanctionedPrincipal),
    applicableFoirPercent: Math.round(maxAllowedFoir * 100),
    estimatedRate: Number(interestRate.toFixed(2)),
    effectiveTenureMonths,
    bankIncomeBasis: Math.round(bankIncomeBasis),
    formulaExplanation: `Based on bank FOIR limit of ${Math.round(maxAllowedFoir * 100)}% on evaluated monthly income (₹${Math.round(bankIncomeBasis).toLocaleString('en-IN')}) minus existing EMIs.`,
  };
}

/**
 * Calculates Borrower-Safe Capacity (What you can ACTUALLY afford safely)
 * Protects cash flow, factors in living costs, gig volatility, and productive loan ROI.
 */
export function calculateBorrowerSafeCapacity(profile = {}) {
  const {
    netMonthlyIncome = 0,
    essentialLivingCosts = null,
    existingMonthlyEmis = 0,
    loanCategoryKey = 'PERSONAL',
    cibilTierKey = 'GOOD',
    requestedTenureMonths = 36,
    customInterestRate = null,
    incomeType = 'SALARIED',
    gigIncomePredictability = 'SEASONAL',
    isProductiveBorrowing = false,
    expectedIncomeImprovement = 0,
    hasCollateral = false,
    hasVariableIncome = false,
    variableIncomeAmount = 0,
    age = 35,
  } = profile;

  const category = LOAN_CATEGORIES[loanCategoryKey] || LOAN_CATEGORIES.PERSONAL;
  const cibil = CIBIL_TIERS[cibilTierKey] || CIBIL_TIERS.GOOD;

  let interestRate = customInterestRate !== null && customInterestRate > 0
    ? customInterestRate
    : category.baseInterestRate + (category.riskPremium[cibil.key] || 1.5);

  if (hasCollateral) {
    interestRate = Math.max(7.5, interestRate - 2.0);
  }

  // Living costs calculation: if unknown, estimate at 38% of net income
  const isLivingCostsEstimated = essentialLivingCosts === null || essentialLivingCosts === undefined || essentialLivingCosts === '';
  let effectiveLivingCosts = !isLivingCostsEstimated && parseFloat(essentialLivingCosts) >= 0
    ? parseFloat(essentialLivingCosts)
    : netMonthlyIncome * 0.38;

  // Gig income volatility extra buffer
  if (incomeType === 'INFORMAL_GIG' && gigIncomePredictability === 'UNPREDICTABLE') {
    effectiveLivingCosts *= 1.20; // 20% extra living cost buffer for volatility
  }

  // Productive loan future income boost (factor 50%)
  const monthlyProductiveBoost = (isProductiveBorrowing && expectedIncomeImprovement > 0)
    ? expectedIncomeImprovement * 0.50
    : 0;

  // Variable bonus (factor 40% of monthly equivalent)
  const monthlyVariableBonus = (hasVariableIncome && variableIncomeAmount > 0)
    ? (variableIncomeAmount / 12) * 0.40
    : 0;

  const totalEffectiveIncome = netMonthlyIncome + monthlyProductiveBoost + monthlyVariableBonus;
  const disposableSurplus = totalEffectiveIncome - effectiveLivingCosts - existingMonthlyEmis;

  // Financial Safety Rule: EMI cap <= 30% of income OR 40% of unencumbered surplus
  const emiCapByIncome = netMonthlyIncome * 0.30;
  const emiCapBySurplus = Math.max(0, disposableSurplus * 0.40);

  let safeEmiCeiling = Math.min(emiCapByIncome, emiCapBySurplus);
  if (disposableSurplus <= 0) {
    safeEmiCeiling = 0;
  }

  const safePrincipal = calculateMaxPrincipalFromEMI(safeEmiCeiling, interestRate, requestedTenureMonths || 36);

  return {
    disposableSurplus: Math.round(disposableSurplus),
    effectiveLivingCosts: Math.round(effectiveLivingCosts),
    isLivingCostsEstimated,
    safeEmiCeiling: Math.round(safeEmiCeiling),
    safePrincipal: Math.round(safePrincipal),
    estimatedRate: Number(interestRate.toFixed(2)),
    monthlyProductiveBoost: Math.round(monthlyProductiveBoost),
    formulaExplanation: `Calculated by deducting essential living expenses (₹${Math.round(effectiveLivingCosts).toLocaleString('en-IN')}) and debt obligations from total effective income. Leaves a safe monthly surplus buffer.`,
  };
}

export function calculateTenureTradeoffs(principal, annualRate, currentTenureMonths = 36) {
  if (!principal || principal <= 0) return [];

  const tenureOptions = [12, 24, 36, 60, 84, 120, 180, 240].filter((m) => m <= 360);

  return tenureOptions.map((months) => {
    const emi = calculateEMI(principal, annualRate, months);
    const totalPayment = emi * months;
    const totalInterest = Math.max(0, totalPayment - principal);
    const interestMultiplier = principal > 0 ? (totalInterest / principal) : 0;

    return {
      tenureMonths: months,
      tenureYears: (months / 12).toFixed(1),
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestMultiplier: Number(interestMultiplier.toFixed(2)),
      isSelected: months === currentTenureMonths,
    };
  });
}
