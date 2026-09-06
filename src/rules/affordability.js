/**
 * Affordability Engine
 * Evaluates Lender-Style Sanction Capacity vs Borrower-Safe Affordability.
 */

import { ASSUMPTIONS } from '../data/assumptions.js';
import { determineProductRouting } from './productRouting.js';

export function calculateAffordability(borrower = {}) {
  const {
    netMonthlyIncome = 0,
    essentialLivingCosts = null,
    existingMonthlyEmis = 0,
    incomeType = 'SALARIED',
    itrAnnualIncome = null,
    age = 32,
    hasVariableIncome = false,
    variableIncomeAmount = 0,
    isProductiveBorrowing = false,
    expectedIncomeImprovement = 0,
    gigIncomePredictability = 'SEASONAL',
  } = borrower;

  const routing = determineProductRouting(borrower);

  // ==========================================
  // 1. LENDER-STYLE AFFORDABILITY (Bank Sanction Limit)
  // ==========================================

  // Determine FOIR Cap based on income type
  let foirCap = ASSUMPTIONS.MAX_SALARIED_FOIR.value;
  if (incomeType === 'SELF_EMPLOYED') {
    foirCap = ASSUMPTIONS.MAX_SELF_EMPLOYED_FOIR.value;
  } else if (incomeType === 'INFORMAL_GIG') {
    foirCap = ASSUMPTIONS.MAX_INFORMAL_GIG_FOIR.value;
  }

  if (routing.isSecured) {
    foirCap = Math.min(0.60, foirCap + 0.05); // Collateral grants slight FOIR boost
  }

  // Evaluated Monthly Income for Bank Sanction:
  // Salaried: Net Monthly Salary
  // Self-Employed: Capped by reported ITR net profit / 12
  let bankIncomeBasis = netMonthlyIncome;
  if (incomeType === 'SELF_EMPLOYED' && itrAnnualIncome !== null && itrAnnualIncome > 0) {
    const monthlyItr = itrAnnualIncome / 12;
    bankIncomeBasis = Math.min(netMonthlyIncome, monthlyItr);
  }

  const lenderGrossEmiCap = bankIncomeBasis * foirCap;
  const lenderMaxMonthlyEmi = Math.max(0, lenderGrossEmiCap - existingMonthlyEmis);

  // ==========================================
  // 2. BORROWER-SAFE AFFORDABILITY (Safe Limit)
  // ==========================================

  // Living Expenses: if unknown, estimate at default 38% of net income
  const isLivingCostsEstimated = essentialLivingCosts === null || essentialLivingCosts === undefined || essentialLivingCosts === '';
  let effectiveLivingCosts = !isLivingCostsEstimated && parseFloat(essentialLivingCosts) >= 0
    ? parseFloat(essentialLivingCosts)
    : netMonthlyIncome * ASSUMPTIONS.DEFAULT_ESTIMATED_LIVING_COST_RATIO.value;

  // Gig income volatility extra buffer
  if (incomeType === 'INFORMAL_GIG' && gigIncomePredictability === 'UNPREDICTABLE') {
    effectiveLivingCosts *= 1.20;
  }

  // Productive borrowing income boost (factor 50%)
  const monthlyProductiveBoost = (isProductiveBorrowing && expectedIncomeImprovement > 0)
    ? expectedIncomeImprovement * 0.50
    : 0;

  // Variable bonus factor (40% of monthly equivalent)
  const monthlyVariableBonus = (hasVariableIncome && variableIncomeAmount > 0)
    ? (variableIncomeAmount / 12) * 0.40
    : 0;

  const totalEffectiveIncome = netMonthlyIncome + monthlyProductiveBoost + monthlyVariableBonus;
  const disposableCashSurplus = totalEffectiveIncome - effectiveLivingCosts - existingMonthlyEmis;

  // Safe EMI Ceiling: Lower of 30% Net Income OR 40% Disposable Surplus
  const safeCapByIncome = netMonthlyIncome * ASSUMPTIONS.SAFE_INCOME_EMI_CAP.value;
  const safeCapBySurplus = Math.max(0, disposableCashSurplus * ASSUMPTIONS.SAFE_SURPLUS_EMI_CAP.value);

  let safeMonthlyEmiCeiling = Math.min(safeCapByIncome, safeCapBySurplus);
  if (disposableCashSurplus <= 0) {
    safeMonthlyEmiCeiling = 0;
  }

  return {
    lenderBasis: {
      bankIncomeBasis: Math.round(bankIncomeBasis),
      foirCapPercent: Math.round(foirCap * 100),
      lenderMaxMonthlyEmi: Math.round(lenderMaxMonthlyEmi),
      explanation: `Lenders calculate eligibility on evaluated income (₹${Math.round(bankIncomeBasis).toLocaleString('en-IN')}/mo) using a ${Math.round(foirCap * 100)}% FOIR ceiling minus existing EMIs.`,
    },
    borrowerSafeBasis: {
      netMonthlyIncome: Math.round(netMonthlyIncome),
      effectiveLivingCosts: Math.round(effectiveLivingCosts),
      isLivingCostsEstimated,
      existingMonthlyEmis: Math.round(existingMonthlyEmis),
      monthlyProductiveBoost: Math.round(monthlyProductiveBoost),
      disposableCashSurplus: Math.round(disposableCashSurplus),
      safeMonthlyEmiCeiling: Math.round(safeMonthlyEmiCeiling),
      explanation: `Calculated after protecting household expenses (₹${Math.round(effectiveLivingCosts).toLocaleString('en-IN')}) and existing debts. Caps new EMI at 40% of remaining surplus.`,
    },
    routing,
  };
}
