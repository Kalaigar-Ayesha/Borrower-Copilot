/**
 * Decision Factors Engine
 * Evaluates active borrower profile & assessment outputs to extract precise,
 * dynamic decision improvement steps.
 * 
 * Exposes getDecisionFactors(borrower, assessment)
 */

import { formatINR } from '../utils/formatters.js';

export function getDecisionFactors(borrower = {}, assessment = {}) {
  const {
    netMonthlyIncome = 0,
    essentialLivingCosts = null,
    existingMonthlyEmis = 0,
    incomeType = 'SALARIED',
    hasHighCostDebt = false,
    recentBounceHistory = false,
    emergencySavingsMonths = 0,
    requestedAmount = 500000,
    cibilTierKey = 'GOOD',
    gigIncomePredictability = 'SEASONAL',
    isProductiveBorrowing = false,
  } = borrower;

  const {
    verdict,
    borrowerSafe,
    sanctionRange,
    safeRange,
    recommendedAmount,
    affordability,
    productRouting,
  } = assessment;

  const decision = verdict ? verdict.decision : 'BORROW';
  const isDontBorrow = decision === 'DONT_BORROW';
  const isBorrowLess = decision === 'BORROW_LESS';
  const factors = [];
  let stepCounter = 1;

  // ==========================================
  // CASE 1: DON'T BORROW (High Risk / Cash Flow Deficit)
  // ==========================================
  if (decision === 'DONT_BORROW') {
    // Factor 1: High-cost credit card / BNPL debt
    if (hasHighCostDebt) {
      factors.push({
        id: 'high_cost_debt',
        stepNumber: stepCounter++,
        title: 'Reduce High-Cost Short-Term Debt',
        currentState: 'Active Credit Card / BNPL debt carrying 36-42% interest drag',
        potentialImprovement: 'Pay off high-cost credit balances before adding structured loan EMIs',
        affectedOutput: 'Eliminates high-cost interest drag and frees up monthly cash flow',
        explanation: 'Short-term high-cost credit card debt drains monthly liquidity and significantly increases default risk during loan tenure.',
      });
    }

    // Factor 2: Payment Bounce History
    if (recentBounceHistory) {
      factors.push({
        id: 'payment_bounce',
        stepNumber: stepCounter++,
        title: 'Stabilize Repayment Track Record',
        currentState: 'Recent EMI bounce recorded in credit history within past 12 months',
        potentialImprovement: 'Maintain 6 consecutive months of clean, automated ECS/NACH payments',
        affectedOutput: 'Improves credit risk classification and removes automatic loan rejection flag',
        explanation: 'Lenders consider recent ECS bounces as an active default signal. Maintaining clean auto-debits restores lender confidence.',
      });
    }

    // Factor 3: High Existing EMI Burden
    if (existingMonthlyEmis > 0 && affordability?.borrowerSafeBasis?.safeMonthlyEmiCeiling === 0) {
      const targetEmi = Math.max(0, existingMonthlyEmis - Math.round(netMonthlyIncome * 0.15));
      factors.push({
        id: 'existing_emi_reduction',
        stepNumber: stepCounter++,
        title: 'Trim Existing Monthly Debt Burden',
        currentState: `Current EMIs: ${formatINR(existingMonthlyEmis)}/month (${Math.round((existingMonthlyEmis / (netMonthlyIncome || 1)) * 100)}% of net income)`,
        potentialImprovement: `Reduce existing EMIs toward ${formatINR(targetEmi)}/month through foreclosure or balance transfer`,
        affectedOutput: `Increases borrower-safe EMI capacity from ${formatINR(0)}/mo toward ${formatINR(Math.round(netMonthlyIncome * 0.15))}/mo`,
        explanation: 'Your current fixed monthly debt obligations leave insufficient disposable surplus for new loan commitments.',
      });
    }

    // Factor 4: Emergency Buffer Building
    if (emergencySavingsMonths < 3) {
      factors.push({
        id: 'emergency_buffer',
        stepNumber: stepCounter++,
        title: 'Build Living Expense Emergency Cushion',
        currentState: `Current Emergency Reserves: ${emergencySavingsMonths} months of living expenses`,
        potentialImprovement: 'Build 3 to 6 months of liquid emergency reserves in fixed deposits or liquid funds',
        affectedOutput: 'Protects post-loan budget from income shocks and improves economic stress resilience',
        explanation: 'Having liquid emergency savings prevents forced credit card borrowing when unexpected medical or job expenses arise.',
      });
    }

    // Factor 5: Unpredictable Gig Income Buffer
    if (incomeType === 'INFORMAL_GIG' && gigIncomePredictability === 'UNPREDICTABLE') {
      factors.push({
        id: 'gig_income_smoothing',
        stepNumber: stepCounter++,
        title: 'Establish Income Smoothing Reserve',
        currentState: 'Variable / Unpredictable monthly gig income with high month-on-month fluctuation',
        potentialImprovement: 'Set up a dedicated income-smoothing bank account to maintain average monthly salary draws',
        affectedOutput: 'Removes the 20% volatility expense buffer in Copilot affordability math',
        explanation: 'Fluctuating monthly gig earnings create risk in lean months. Income smoothing ensures regular monthly EMI coverage.',
      });
    }

    // Final Step for Don't Borrow
    factors.push({
      id: 'reassess_capacity',
      stepNumber: stepCounter++,
      title: 'Reassess Borrowing Capacity',
      currentState: 'Current financial profile carries high debt strain',
      potentialImprovement: 'Re-run Borrower Copilot after implementing debt reduction and buffer building',
      affectedOutput: 'Updated rule engine evaluation may unlock a borrower-safe borrowing recommendation',
      explanation: 'Once your monthly cash flow surplus recovers, re-evaluating your capacity ensures you take debt safely.',
    });
  }

  // ==========================================
  // CASE 2: BORROW LESS (Requested > Safe Capacity)
  // ==========================================
  else if (decision === 'BORROW_LESS') {
    const recValue = recommendedAmount ? recommendedAmount.value : 0;
    const safeMax = safeRange ? safeRange.max : recValue;

    // Step 1: Cap Loan Size
    factors.push({
      id: 'cap_loan_amount',
      stepNumber: stepCounter++,
      title: 'Cap Loan Size to Borrower-Safe Limit',
      currentState: `Requested Loan: ${formatINR(requestedAmount)}`,
      potentialImprovement: `Cap loan principal to ${formatINR(safeMax)} (or recommended ${formatINR(recValue)})`,
      affectedOutput: `Brings monthly EMI down from ${formatINR(assessment.proposedEmi || 0)}/mo to safe ceiling of ${formatINR(affordability?.borrowerSafeBasis?.safeMonthlyEmiCeiling || 0)}/mo`,
      explanation: 'Borrowing within your safe limit preserves disposable cash flow for monthly household expenses.',
    });

    // Step 2: Extend Tenure or Compare Trade-offs
    factors.push({
      id: 'optimize_tenure',
      stepNumber: stepCounter++,
      title: 'Compare Tenure Amortization Options',
      currentState: `Selected Tenure: ${borrower.requestedTenureMonths || 36} months`,
      potentialImprovement: 'Explore a 48 or 60-month tenure to lower monthly EMI obligation',
      affectedOutput: 'Lowers monthly EMI cost, though total lifetime interest drag increases',
      explanation: 'Extending tenure lowers your monthly payment burden if short-term cash flow is tight.',
    });

    // Step 3: Product-aware routing / Secured LAP option (if applicable)
    if (incomeType === 'SELF_EMPLOYED' || productRouting?.isSecured) {
      factors.push({
        id: 'secured_lap_route',
        stepNumber: stepCounter++,
        title: 'Evaluate Secured Property Borrowing (LAP)',
        currentState: 'Evaluating unsecured credit lines with higher nominal interest rates',
        potentialImprovement: 'Pledge commercial or residential property collateral for Loan Against Property (LAP)',
        affectedOutput: 'Reduces interest rate from ~14-16% down to ~9.5-11.0% p.a., expanding safe borrowing capacity',
        explanation: 'Secured business credit offers lower interest pricing and longer 10-15 year tenures compared to personal loans.',
      });
    }

    // Step 4: Interest Rate Negotiation
    factors.push({
      id: 'negotiate_rate',
      stepNumber: stepCounter++,
      title: 'Negotiate Nominal Rate & Fee Waiver',
      currentState: `Estimated Fair Rate: ${assessment.fairRateRange?.formattedRange || '11.0% - 12.5%'}`,
      potentialImprovement: 'Use your CIBIL score and relationship bank history to negotiate rate and 100% fee waiver',
      affectedOutput: 'Reduces Effective All-In APR and saves up to ₹15,000–₹40,000 in upfront charges',
      explanation: 'Bank Relationship Managers often have margin to discount processing fees and nominal interest rates.',
    });

    // Step 5: Final Reassessment
    factors.push({
      id: 'reassess_comfort',
      stepNumber: stepCounter++,
      title: 'Final Budget Reassessment',
      currentState: 'Loan capped to safe range',
      potentialImprovement: 'Re-run Copilot with adjusted loan parameters',
      affectedOutput: 'Locks in safe borrowing parameters with zero debt stress',
      explanation: 'Re-evaluating with modified loan terms ensures complete financial confidence.',
    });
  }

  // ==========================================
  // CASE 3: BORROW (Safe Approved Verdict)
  // ==========================================
  else {
    // Step 1: Verify Sanction Letter APR
    factors.push({
      id: 'verify_sanction_apr',
      stepNumber: stepCounter++,
      title: 'Verify All-In APR on Sanction Letter',
      currentState: `Quoted Nominal Rate: ${assessment.fairRateRange?.midRate || 11.5}% p.a.`,
      potentialImprovement: 'Check sanction letter for hidden documentation fees, insurance bundlings, and 18% GST',
      affectedOutput: 'Ensures true effective cost matches Copilot All-In APR of ' + (assessment.aprRange?.formattedAprRange || '12.0% - 13.5%'),
      explanation: 'Banks frequently bundle insurance premiums and admin fees into disbursals. Demand a clear KFS (Key Fact Statement).',
    });

    // Step 2: Confirm Zero Foreclosure Penalty
    factors.push({
      id: 'verify_foreclosure_clause',
      stepNumber: stepCounter++,
      title: 'Confirm Zero Pre-payment & Foreclosure Penalty',
      currentState: 'Standard Floating / Fixed Bank Sanction Terms',
      potentialImprovement: 'Ensure sanction agreement allows partial pre-payments after 6–12 months with 0% penalty',
      affectedOutput: 'Allows accelerating loan payoff whenever annual bonuses or lump sum cash becomes available',
      explanation: 'RBI guidelines mandate zero foreclosure charges on floating-rate individual loans. Confirm this in writing.',
    });

    // Step 3: Preserve Liquid Emergency Fund
    factors.push({
      id: 'preserve_emergency_fund',
      stepNumber: stepCounter++,
      title: 'Maintain Emergency Reserves Untouched',
      currentState: `Emergency Fund Cushion: ${emergencySavingsMonths || 3} months`,
      potentialImprovement: 'Do not use emergency savings to pay loan down payment or upfront fees',
      affectedOutput: 'Maintains 100% stress-case budget resilience throughout loan tenure',
      explanation: 'Keeping emergency liquid savings intact guarantees you never miss an EMI if an unexpected crisis occurs.',
    });

    if (incomeType === 'SELF_EMPLOYED') {
      factors.push({
        id: 'itr_documentation',
        stepNumber: stepCounter++,
        title: 'Organize 2-Year Documented ITRs',
        currentState: 'Self-employed income profile',
        potentialImprovement: 'Present audited P&L, GST returns, and 2-year filed ITRs to bank credit officers',
        affectedOutput: 'Speeds up sanction approval and unlocks prime interest rate brackets',
        explanation: 'Documented income proof helps lenders verify business cash flows and offer prime interest rates.',
      });
    }
  }

  return {
    decision,
    headline: isDontBorrow
      ? 'WHAT WOULD CHANGE THIS DECISION?'
      : isBorrowLess
      ? "YOU'RE CLOSE TO YOUR COMFORT LIMIT"
      : 'BEFORE YOU SIGN: FINAL COPILOT CHECKLIST',
    subtitle: isDontBorrow
      ? 'Actionable steps to improve your financial safety before re-evaluating a loan.'
      : isBorrowLess
      ? 'Practical adjustments to align your requested loan safely with monthly cash flow.'
      : 'Essential pre-signing verification checks to protect your borrowing terms.',
    factors,
  };
}
