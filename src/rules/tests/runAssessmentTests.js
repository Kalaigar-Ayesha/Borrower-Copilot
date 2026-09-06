/**
 * Automated Test Suite for Borrower Copilot Decision Engine
 * Run via: node src/rules/tests/runAssessmentTests.js
 */

import { calculateAssessment } from '../assessment.js';
import { ASSUMPTIONS } from '../../data/assumptions.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}: ${details}`);
  }
}

console.log('====================================================');
console.log('🧪 BORROWER COPILOT DECISION ENGINE TEST SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST 1: Persona - Priya (Salaried Corporate, Safe Borrower)
// ----------------------------------------------------
const priyaBorrower = {
  incomeType: 'SALARIED',
  netMonthlyIncome: 120000,
  essentialLivingCosts: 35000,
  existingMonthlyEmis: 5000,
  cibilTierKey: 'EXCELLENT',
  requestedAmount: 300000,
  requestedTenureMonths: 36,
  loanCategoryKey: 'PERSONAL',
  loanPurpose: 'PERSONAL',
  emergencySavingsMonths: 6,
};

const priyaResult = calculateAssessment(priyaBorrower);
assert(priyaResult.verdict.decision === 'BORROW', 'Priya Persona: Should return BORROW verdict', `Got ${priyaResult.verdict.decision}`);
assert(priyaResult.productRouting.routeKey === 'PERSONAL_UNSECURED', 'Priya Persona: Should route to Unsecured Personal Loan');
assert(priyaResult.confidence.tier === 'HIGH', 'Priya Persona: Should have HIGH confidence');

// ----------------------------------------------------
// TEST 2: Persona - Ravi (Self-Employed, No Credit Score, LAP Route)
// ----------------------------------------------------
const raviBorrower = {
  incomeType: 'SELF_EMPLOYED',
  netMonthlyIncome: 160000,
  itrAnnualIncome: 1800000,
  essentialLivingCosts: 50000,
  existingMonthlyEmis: 15000,
  cibilTierKey: 'UNKNOWN', // No credit history
  hasCollateral: true,
  collateralValue: 4500000, // ₹45 Lakh shop property
  loanPurpose: 'BUSINESS',
  loanCategoryKey: 'BUSINESS',
  requestedAmount: 1500000,
  requestedTenureMonths: 60,
  isProductiveBorrowing: true,
  expectedIncomeImprovement: 50000,
};

const raviResult = calculateAssessment(raviBorrower);
assert(raviResult.productRouting.routeKey === 'LAP', 'Ravi Persona: Should route to Loan Against Property (LAP)');
assert(raviResult.verdict.decision === 'BORROW', 'Ravi Persona: Should approve secured business expansion loan', `Got ${raviResult.verdict.decision}`);
assert(raviResult.fairRateRange.isUnknownCibil === true, 'Ravi Persona: Should acknowledge unknown credit history without failing');
assert(raviResult.fairRateRange.minRate <= 11.5, 'Ravi Persona: Pledged property collateral should grant rate discount');

// ----------------------------------------------------
// TEST 3: Persona - Anita (Informal / Gig Worker, High Risk)
// ----------------------------------------------------
const anitaBorrower = {
  incomeType: 'INFORMAL_GIG',
  netMonthlyIncome: 35000,
  essentialLivingCosts: 22000,
  existingMonthlyEmis: 12000,
  cibilTierKey: 'POOR',
  hasHighCostDebt: true, // BNPL / Money lender debt
  recentPaymentBounce: true,
  requestedAmount: 400000,
  requestedTenureMonths: 24,
  loanCategoryKey: 'PERSONAL',
  loanPurpose: 'PERSONAL',
  emergencySavingsMonths: 0,
};

const anitaResult = calculateAssessment(anitaBorrower);
assert(anitaResult.verdict.decision === 'DONT_BORROW', 'Anita Persona: Should trigger DONT_BORROW due to high-cost debt and bounces', `Got ${anitaResult.verdict.decision}`);

// ----------------------------------------------------
// TEST 4: Missing Credit Score (Unknown Handling)
// ----------------------------------------------------
const missingCibilBorrower = {
  ...priyaBorrower,
  cibilTierKey: 'UNKNOWN',
};

const missingCibilResult = calculateAssessment(missingCibilBorrower);
assert(missingCibilResult.fairRateRange.formattedRange.includes('–'), 'Missing Credit Score: Should output a rate range rather than single number');
assert(missingCibilResult.confidence.scorePoints < priyaResult.confidence.scorePoints, 'Missing Credit Score: Should lower confidence score');

// ----------------------------------------------------
// TEST 5: Unstable Income / Unpredictable Gig Buffer
// ----------------------------------------------------
const unpredictableGigBorrower = {
  incomeType: 'INFORMAL_GIG',
  gigIncomePredictability: 'UNPREDICTABLE',
  netMonthlyIncome: 50000,
  essentialLivingCosts: 20000,
  existingMonthlyEmis: 0,
  requestedAmount: 200000,
  requestedTenureMonths: 24,
};

const gigResult = calculateAssessment(unpredictableGigBorrower);
assert(gigResult.affordability.borrowerSafeBasis.effectiveLivingCosts > 20000, 'Unpredictable Gig: Should add extra 20% living expense buffer');

// ----------------------------------------------------
// TEST 6: High Existing EMI (FOIR Overload)
// ----------------------------------------------------
const highEmiBorrower = {
  ...priyaBorrower,
  existingMonthlyEmis: 65000, // 65k / 120k = >54% existing FOIR
  requestedAmount: 500000,
};

const highEmiResult = calculateAssessment(highEmiBorrower);
assert(highEmiResult.verdict.decision === 'DONT_BORROW', 'High EMI: Should trigger DONT_BORROW due to FOIR overload');

// ----------------------------------------------------
// TEST 7: Recent EMI Bounce
// ----------------------------------------------------
const bounceBorrower = {
  ...priyaBorrower,
  recentPaymentBounce: true,
};

const bounceResult = calculateAssessment(bounceBorrower);
assert(bounceResult.verdict.decision === 'DONT_BORROW', 'Recent Payment Bounce: Should trigger DONT_BORROW');

// ----------------------------------------------------
// TEST 8: High-Cost Informal Debt
// ----------------------------------------------------
const bnplBorrower = {
  ...priyaBorrower,
  hasHighCostDebt: true,
};

const bnplResult = calculateAssessment(bnplBorrower);
assert(bnplResult.verdict.decision === 'DONT_BORROW', 'High Cost Debt: Should trigger DONT_BORROW');

// ----------------------------------------------------
// TEST 9: Tenure Choice Matrix
// ----------------------------------------------------
assert(priyaResult.tenureTradeoffs.length >= 5, 'Tenure Matrix: Should output multiple tenure options');
assert(priyaResult.tenureTradeoffs[0].emi > priyaResult.tenureTradeoffs[priyaResult.tenureTradeoffs.length - 1].emi, 'Tenure Matrix: Shorter tenure should have higher EMI');

console.log('\n====================================================');
console.log(`📊 TEST RESULTS SUMMARY: ${passedTests} / ${totalTests} PASSED`);
console.log('====================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
