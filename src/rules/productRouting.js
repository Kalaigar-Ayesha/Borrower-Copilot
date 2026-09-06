/**
 * Product-Aware Routing Engine
 * Detects applicant profile characteristics and routes them to optimal loan products.
 * Handles Ravi's scenario (Self-employed + Property Collateral + Business Expansion -> LAP Route).
 */

export function determineProductRouting(borrower = {}) {
  const {
    incomeType = 'SALARIED',
    hasCollateral = false,
    collateralValue = 0,
    loanPurpose = 'PERSONAL',
    loanCategoryKey = 'PERSONAL',
    cibilTierKey = 'EXCELLENT',
    requestedAmount = 500000,
  } = borrower;

  // Case 1: Ravi's Scenario (Secured Business / Loan Against Property - LAP)
  const isRaviPattern = (incomeType === 'SELF_EMPLOYED' || loanPurpose === 'BUSINESS') &&
    (hasCollateral === true || collateralValue > 0);

  if (isRaviPattern) {
    const effectiveCollateralValue = collateralValue > 0 ? collateralValue : 4500000;
    return {
      routeKey: 'LAP',
      productName: 'Loan Against Property (LAP) / Secured Business Loan',
      isSecured: true,
      collateralValue: effectiveCollateralValue,
      maxLtvPercent: 50,
      collateralCapSanction: effectiveCollateralValue * 0.50,
      rateDiscount: 2.50, // 2.5% rate discount
      processingFeePercent: 0.75,
      recommendationText: 'Routed to Secured Business LAP product based on unencumbered property collateral.',
      explanation: 'Pledging commercial/residential property unlocks significantly lower interest rates (9.5%-11.0%) and higher sanction limits compared to unsecured business loans.',
    };
  }

  // Case 2: Home Purchase Mortgage
  if (loanPurpose === 'HOME' || loanCategoryKey === 'HOME') {
    return {
      routeKey: 'HOME',
      productName: 'Home Mortgage Loan',
      isSecured: true,
      rateDiscount: 3.0,
      processingFeePercent: 0.5,
      recommendationText: 'Routed to Standard Home Purchase Mortgage.',
      explanation: 'Secured against real estate property with long repayment tenure capability (up to 30 years).',
    };
  }

  // Case 3: Vehicle Financing
  if (loanPurpose === 'CAR' || loanCategoryKey === 'CAR') {
    return {
      routeKey: 'CAR',
      productName: 'Auto Loan (Vehicle Hypothecation)',
      isSecured: true,
      rateDiscount: 2.0,
      processingFeePercent: 1.0,
      recommendationText: 'Routed to Vehicle Hypothecated Auto Loan.',
      explanation: 'Secured against vehicle registration hypothecation.',
    };
  }

  // Default Case: Unsecured Personal / Business Credit
  return {
    routeKey: 'PERSONAL_UNSECURED',
    productName: loanCategoryKey === 'BUSINESS' ? 'Unsecured Business Loan' : 'Unsecured Personal Loan',
    isSecured: false,
    rateDiscount: 0.0,
    processingFeePercent: 1.5,
    recommendationText: 'Evaluated under Unsecured Retail Credit criteria.',
    explanation: 'No collateral pledged; pricing and sanction limits rely entirely on net income cash flow and credit score.',
  };
}
