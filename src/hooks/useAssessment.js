/**
 * Custom Hook: useAssessment
 * Manages guided conversational assessment state, dynamic adaptive question evaluation,
 * persona switching, and reactive rule engine computation.
 */

import { useState, useMemo } from 'react';
import { QUESTION_BANK } from '../questions/questionBank.js';
import { calculateEMI, calculateLenderSanction, calculateBorrowerSafeCapacity, calculateTenureTradeoffs } from '../rules/financialCalculations.js';
import { calculateAllInApr, calculateFairInterestRateRange } from '../rules/aprEngine.js';
import { calculateVerdict } from '../rules/recommendationEngine.js';
import { calculateConfidence } from '../rules/confidenceEngine.js';
import { runStressScenarios } from '../rules/stressEngine.js';
import { generateNegotiationCard } from '../rules/negotiationEngine.js';

const INITIAL_PROFILE = {
  loanPurpose: 'PERSONAL',
  requestedAmount: 500000,
  loanCategoryKey: 'PERSONAL',
  requestedTenureMonths: 36,
  incomeType: 'SALARIED',
  employmentDuration: '1_TO_3_YRS',
  hasVariableIncome: false,
  variableIncomeAmount: 0,
  businessDuration: '2_TO_5_YRS',
  itrAnnualIncome: 900000,
  hasCollateral: false,
  gigIncomePredictability: 'SEASONAL',
  hasHighCostDebt: false,
  recentPaymentBounce: false,
  isProductiveBorrowing: false,
  expectedIncomeImprovement: 0,
  netMonthlyIncome: 85000,
  existingMonthlyEmis: 0,
  essentialLivingCosts: 30000,
  age: 32,
  cibilTierKey: 'EXCELLENT',
  emergencySavingsMonths: 4,
  customInterestRate: 11.5,
  processingFeePercent: 1.5,
};

export function useAssessment() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Dynamically compute active questions list based on profile condition predicates
  const activeQuestions = useMemo(() => {
    return QUESTION_BANK.filter((q) => q.condition(profile));
  }, [profile]);

  const currentQuestion = activeQuestions[activeQuestionIndex] || activeQuestions[0];
  const totalActiveQuestions = activeQuestions.length;
  const progressPercentage = Math.round(((activeQuestionIndex + 1) / totalActiveQuestions) * 100);

  // Update profile value
  const updateProfileValue = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Skip or set unknown
  const setUnknownValue = (key, unknownVal) => {
    setProfile((prev) => ({
      ...prev,
      [key]: unknownVal,
    }));
  };

  // Step navigation
  const nextQuestion = () => {
    if (activeQuestionIndex < totalActiveQuestions - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    }
  };

  const resetAssessment = () => {
    setProfile(INITIAL_PROFILE);
    setActiveQuestionIndex(0);
  };

  // Load preset demo test personas
  const loadPresetProfile = (personaKey) => {
    if (personaKey === 'SALARIED_SAFE') {
      setProfile({
        loanPurpose: 'PERSONAL',
        requestedAmount: 300000,
        loanCategoryKey: 'PERSONAL',
        requestedTenureMonths: 36,
        incomeType: 'SALARIED',
        employmentDuration: '3_TO_5_YRS',
        hasVariableIncome: true,
        variableIncomeAmount: 150000,
        netMonthlyIncome: 120000,
        existingMonthlyEmis: 5000,
        essentialLivingCosts: 35000,
        age: 30,
        cibilTierKey: 'EXCELLENT',
        emergencySavingsMonths: 6,
        customInterestRate: 10.75,
        processingFeePercent: 1.0,
      });
    } else if (personaKey === 'SELF_EMPLOYED_BUSINESS') {
      setProfile({
        loanPurpose: 'BUSINESS',
        requestedAmount: 1500000,
        loanCategoryKey: 'BUSINESS',
        requestedTenureMonths: 60,
        incomeType: 'SELF_EMPLOYED',
        businessDuration: 'OVER_5_YRS',
        itrAnnualIncome: 1800000,
        hasCollateral: true,
        isProductiveBorrowing: true,
        expectedIncomeImprovement: 50000,
        netMonthlyIncome: 160000,
        existingMonthlyEmis: 15000,
        essentialLivingCosts: 50000,
        age: 42,
        cibilTierKey: 'EXCELLENT',
        emergencySavingsMonths: 8,
        customInterestRate: 11.0,
        processingFeePercent: 1.0,
      });
    } else if (personaKey === 'INFORMAL_GIG_RISK') {
      setProfile({
        loanPurpose: 'PERSONAL',
        requestedAmount: 400000,
        loanCategoryKey: 'PERSONAL',
        requestedTenureMonths: 24,
        incomeType: 'INFORMAL_GIG',
        gigIncomePredictability: 'UNPREDICTABLE',
        hasHighCostDebt: true,
        recentPaymentBounce: true,
        netMonthlyIncome: 35000,
        existingMonthlyEmis: 12000,
        essentialLivingCosts: 22000,
        age: 27,
        cibilTierKey: 'POOR',
        emergencySavingsMonths: 0,
        customInterestRate: 22.0,
        processingFeePercent: 2.5,
      });
    }
    setActiveQuestionIndex(0);
  };

  // Compute all outputs reactively using pure rule engines
  const computedResults = useMemo(() => {
    const lenderSanction = calculateLenderSanction(profile);
    const borrowerSafe = calculateBorrowerSafeCapacity(profile);
    const interestRateToUse = profile.customInterestRate || lenderSanction.estimatedRate;
    const proposedEMI = calculateEMI(profile.requestedAmount, interestRateToUse, profile.requestedTenureMonths);

    const aprResults = calculateAllInApr({
      principal: profile.requestedAmount,
      nominalRate: interestRateToUse,
      tenureMonths: profile.requestedTenureMonths,
      processingFeePercent: profile.processingFeePercent !== null ? profile.processingFeePercent : 1.5,
      documentationFee: 500,
      insuranceFee: 0,
    });

    const fairRateRange = calculateFairInterestRateRange(profile.loanCategoryKey, profile.cibilTierKey);

    const computedObj = {
      safePrincipal: borrowerSafe.safePrincipal,
      sanctionedPrincipal: lenderSanction.sanctionedPrincipal,
      disposableSurplus: borrowerSafe.disposableSurplus,
      proposedEMI,
      allInApr: aprResults.allInApr,
    };

    const verdict = calculateVerdict(profile, computedObj);
    const confidence = calculateConfidence(profile);
    const tenureTradeoffs = calculateTenureTradeoffs(profile.requestedAmount, interestRateToUse, profile.requestedTenureMonths);
    const stressScenarios = runStressScenarios({
      netMonthlyIncome: profile.netMonthlyIncome,
      essentialLivingCosts: borrowerSafe.effectiveLivingCosts,
      existingMonthlyEmis: profile.existingMonthlyEmis,
      proposedEmi: proposedEMI,
      principal: profile.requestedAmount,
      interestRate: interestRateToUse,
      tenureMonths: profile.requestedTenureMonths,
    });
    const negotiationCard = generateNegotiationCard({
      loanCategoryKey: profile.loanCategoryKey,
      requestedAmount: profile.requestedAmount,
      quotedRate: interestRateToUse,
      quotedFeePercent: profile.processingFeePercent !== null ? profile.processingFeePercent : 1.5,
      cibilTierKey: profile.cibilTierKey,
    });

    return {
      lenderSanction,
      borrowerSafe,
      proposedEMI,
      interestRateToUse,
      aprResults,
      fairRateRange,
      verdict,
      confidence,
      tenureTradeoffs,
      stressScenarios,
      negotiationCard,
    };
  }, [profile]);

  return {
    profile,
    activeQuestionIndex,
    currentQuestion,
    totalActiveQuestions,
    progressPercentage,
    updateProfileValue,
    setUnknownValue,
    nextQuestion,
    prevQuestion,
    resetAssessment,
    loadPresetProfile,
    results: computedResults,
  };
}
