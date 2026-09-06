/**
 * Indian Retail Lending Market Benchmarks (2025-2026)
 * Used to calculate fair interest rate ranges, FOIR limits, and negotiation targets.
 */

export const LOAN_CATEGORIES = {
  PERSONAL: {
    id: 'PERSONAL',
    label: 'Personal Loan (Unsecured)',
    defaultTenureMonths: 36,
    maxTenureMonths: 60,
    minTenureMonths: 12,
    baseInterestRate: 11.5, // Base repo + margin
    riskPremium: {
      EXCELLENT: 0.0, // CIBIL 775+
      GOOD: 1.5,      // CIBIL 725-774
      AVERAGE: 3.5,   // CIBIL 675-724
      POOR: 6.5,      // CIBIL < 675
    },
    maxAllowedFoir: 0.50, // 50% max gross/net FOIR
    typicalProcessingFeePercent: 1.5,
    minProcessingFee: 1000,
    maxProcessingFee: 15000,
    description: 'Unsecured loan for general personal or emergency expenses.',
  },
  HOME: {
    id: 'HOME',
    label: 'Home / Property Loan',
    defaultTenureMonths: 240, // 20 years
    maxTenureMonths: 360, // 30 years
    minTenureMonths: 60,
    baseInterestRate: 8.4,
    riskPremium: {
      EXCELLENT: 0.0,
      GOOD: 0.5,
      AVERAGE: 1.2,
      POOR: 2.5,
    },
    maxAllowedFoir: 0.55, // Up to 55% for collateralized home loans
    typicalProcessingFeePercent: 0.5,
    minProcessingFee: 3000,
    maxProcessingFee: 25000,
    description: 'Secured property mortgage loan with long tenure.',
  },
  CAR: {
    id: 'CAR',
    label: 'Vehicle / Auto Loan',
    defaultTenureMonths: 60, // 5 years
    maxTenureMonths: 84, // 7 years
    minTenureMonths: 12,
    baseInterestRate: 8.75,
    riskPremium: {
      EXCELLENT: 0.0,
      GOOD: 0.75,
      AVERAGE: 2.0,
      POOR: 4.0,
    },
    maxAllowedFoir: 0.50,
    typicalProcessingFeePercent: 1.0,
    minProcessingFee: 1500,
    maxProcessingFee: 10000,
    description: 'Secured auto financing hypothecated against vehicle.',
  },
  BUSINESS: {
    id: 'BUSINESS',
    label: 'Business / MSME Loan',
    defaultTenureMonths: 36,
    maxTenureMonths: 84,
    minTenureMonths: 12,
    baseInterestRate: 13.0,
    riskPremium: {
      EXCELLENT: 0.0,
      GOOD: 2.0,
      AVERAGE: 4.5,
      POOR: 8.0,
    },
    maxAllowedFoir: 0.45, // Conservative for business cash flows
    typicalProcessingFeePercent: 2.0,
    minProcessingFee: 2500,
    maxProcessingFee: 50000,
    description: 'Working capital or business expansion loan.',
  },
  EDUCATION: {
    id: 'EDUCATION',
    label: 'Education Loan',
    defaultTenureMonths: 84, // 7 years
    maxTenureMonths: 180,
    minTenureMonths: 24,
    baseInterestRate: 9.5,
    riskPremium: {
      EXCELLENT: 0.0,
      GOOD: 1.0,
      AVERAGE: 2.5,
      POOR: 4.5,
    },
    maxAllowedFoir: 0.50,
    typicalProcessingFeePercent: 1.0,
    minProcessingFee: 1000,
    maxProcessingFee: 15000,
    description: 'Higher education loan with moratorium options.',
  },
};

export const CIBIL_TIERS = {
  EXCELLENT: { label: '775 - 900 (Excellent)', min: 775, max: 900, key: 'EXCELLENT', color: '#1E3A2B' },
  GOOD: { label: '725 - 774 (Good)', min: 725, max: 774, key: 'GOOD', color: '#4A6B5D' },
  AVERAGE: { label: '675 - 724 (Fair)', min: 675, max: 724, key: 'AVERAGE', color: '#C5A059' },
  POOR: { label: 'Below 675 or New to Credit', min: 300, max: 674, key: 'POOR', color: '#B85C4B' },
  UNKNOWN: { label: 'Not sure / Haven\'t checked', min: 0, max: 0, key: 'UNKNOWN', color: '#7E7A75', isUnknown: true },
};

export const GST_RATE = 0.18; // 18% GST on Indian financial service fees
