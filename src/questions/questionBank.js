/**
 * Declarative Question Schema & Adaptive Question Bank
 * Ultra-concise labels, zero emojis, standardized financial terminology.
 */

import { LOAN_CATEGORIES, CIBIL_TIERS } from '../data/indianLendingBenchmarks.js';

export const QUESTION_BANK = [
  // 1. Loan Purpose
  {
    id: 'loanPurpose',
    question: 'What is the loan for?',
    description: 'Select your primary borrowing objective.',
    type: 'card_select',
    options: [
      { value: 'PERSONAL', label: 'Personal & Family', desc: 'Medical, wedding, travel, or family needs' },
      { value: 'HOME', label: 'Home Purchase & Repair', desc: 'Property purchase, renovation, or repair' },
      { value: 'CAR', label: 'Vehicle Purchase', desc: 'Car or commercial vehicle financing' },
      { value: 'BUSINESS', label: 'Business Growth', desc: 'Working capital, inventory, or equipment' },
      { value: 'EDUCATION', label: 'Higher Education', desc: 'Tuition and university living costs' },
      { value: 'MEDICAL', label: 'Medical Emergency', desc: 'Hospitalization or health expenses' },
    ],
    defaultValue: 'PERSONAL',
    condition: () => true,
    impact: 'Loan purpose determines applicable bank baseline rates, FOIR caps, and whether borrowing generates revenue.',
  },

  // 2. Requested Amount
  {
    id: 'requestedAmount',
    question: 'Desired loan amount',
    description: 'Target principal you plan to request.',
    type: 'currency',
    placeholder: 'e.g. 5,00,000',
    defaultValue: 500000,
    min: 10000,
    max: 50000000,
    condition: () => true,
    impact: 'The loan principal directly determines your monthly EMI and lifetime interest cost.',
    validation: (val) => {
      if (!val || val <= 0) return 'Please enter a valid loan amount above ₹10,000.';
      return null;
    },
  },

  // 3. Loan Category
  {
    id: 'loanCategoryKey',
    question: 'Loan product type',
    description: 'Secured loans offer lower interest rates than unsecured credit.',
    type: 'pills',
    options: Object.values(LOAN_CATEGORIES).map((cat) => ({
      value: cat.id,
      label: cat.label,
      desc: cat.description,
    })),
    defaultValue: 'PERSONAL',
    condition: () => true,
    impact: 'Lenders charge higher interest rates on unsecured personal credit compared to secured home or auto loans.',
  },

  // 4. Preferred Tenure
  {
    id: 'requestedTenureMonths',
    question: 'Preferred tenure',
    description: 'Longer tenures lower monthly EMI but increase total interest.',
    type: 'tenure_pills',
    options: [
      { value: 12, label: '1 Year (12 mo)', desc: 'Highest EMI, lowest total interest' },
      { value: 24, label: '2 Years (24 mo)', desc: 'Balanced short term' },
      { value: 36, label: '3 Years (36 mo)', desc: 'Standard retail loan tenure' },
      { value: 60, label: '5 Years (60 mo)', desc: 'Lower EMI, higher total interest' },
      { value: 84, label: '7 Years (84 mo)', desc: 'Long-term financing' },
      { value: 120, label: '10 Years (120 mo)', desc: 'Extended property tenure' },
    ],
    defaultValue: 36,
    condition: () => true,
    impact: 'Tenure is the single largest factor governing lifetime interest cost.',
  },

  // 5. Income Type
  {
    id: 'incomeType',
    question: 'Employment type',
    description: 'Banks classify risk and FOIR sanction limits based on employment type.',
    type: 'card_select',
    options: [
      { value: 'SALARIED', label: 'Salaried Employee', desc: 'Monthly fixed salary credited to bank account' },
      { value: 'SELF_EMPLOYED', label: 'Self-Employed / Business', desc: 'Business profit, professional practice, or trade' },
      { value: 'INFORMAL_GIG', label: 'Informal / Gig Worker', desc: 'Platform gig worker, daily/weekly contract payout' },
    ],
    defaultValue: 'SALARIED',
    condition: () => true,
    impact: 'Salaried borrowers get higher FOIR caps due to predictable monthly salary.',
  },

  // Adaptive Salaried 1: Employment Duration
  {
    id: 'employmentDuration',
    question: 'Current job tenure',
    description: 'Years at current organization.',
    type: 'pills',
    options: [
      { value: 'UNDER_1_YR', label: 'Less than 1 Year', desc: 'Higher bank scrutiny' },
      { value: '1_TO_3_YRS', label: '1 to 3 Years', desc: 'Standard stability rating' },
      { value: '3_TO_5_YRS', label: '3 to 5 Years', desc: 'High stability score' },
      { value: 'OVER_5_YRS', label: 'Over 5 Years', desc: 'Top-tier stability' },
    ],
    defaultValue: '1_TO_3_YRS',
    condition: (profile) => profile.incomeType === 'SALARIED',
    impact: 'Borrowers with under 1 year at current employer face tighter sanction limits.',
  },

  // Adaptive Salaried 2: Variable Pay
  {
    id: 'hasVariableIncome',
    question: 'Variable bonus or commission?',
    description: 'Variable pay is discounted by Indian banks for loan sanctioning.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'SALARIED',
    impact: 'Banks apply a 40-50% haircut to variable annual bonuses.',
  },

  {
    id: 'variableIncomeAmount',
    question: 'Annual variable pay (₹)',
    description: 'Average annual performance bonus.',
    type: 'currency',
    placeholder: 'e.g. 1,50,000',
    defaultValue: 0,
    condition: (profile) => profile.incomeType === 'SALARIED' && profile.hasVariableIncome === true,
    impact: 'Copilot factors 50% of annual bonus into yearly buffer but excludes it from baseline monthly EMI capacity.',
  },

  // Adaptive Self-Employed 1: Business Duration
  {
    id: 'businessDuration',
    question: 'Years in business',
    description: 'Operating history of business or practice.',
    type: 'pills',
    options: [
      { value: 'UNDER_2_YRS', label: 'Less than 2 Years', desc: 'Early stage business' },
      { value: '2_TO_5_YRS', label: '2 to 5 Years', desc: 'Established operational track record' },
      { value: 'OVER_5_YRS', label: 'Over 5 Years', desc: 'Mature business stability' },
    ],
    defaultValue: '2_TO_5_YRS',
    condition: (profile) => profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Businesses under 2 years old carry higher interest spreads due to cash flow uncertainty.',
  },

  // Adaptive Self-Employed 2: ITR Income
  {
    id: 'itrAnnualIncome',
    question: 'Reported annual ITR net profit (₹)',
    description: 'Net annual income declared in latest ITR return.',
    type: 'currency',
    placeholder: 'e.g. 9,00,000',
    defaultValue: 900000,
    allowUnknown: true,
    unknownLabel: 'Don\'t know / Haven\'t filed ITR',
    unknownValue: null,
    condition: (profile) => profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Lenders sanction up to 50% of reported ITR profit.',
  },

  // Adaptive Self-Employed 3: Property Collateral
  {
    id: 'hasCollateral',
    question: 'Pledge property collateral?',
    description: 'Property collateral turns unsecured loan into lower-rate secured facility.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Pledging property collateral reduces interest rates by 2.5% and unlocks higher loan sanction limits.',
  },

  // Adaptive Gig 1: Predictability
  {
    id: 'gigIncomePredictability',
    question: 'Income consistency',
    description: 'Month-to-month earnings stability.',
    type: 'pills',
    options: [
      { value: 'VERY_PREDICTABLE', label: 'Fairly Consistent', desc: 'Varies by less than 15% each month' },
      { value: 'SEASONAL', label: 'Seasonal / Fluctuating', desc: 'High peak months followed by lean periods' },
      { value: 'UNPREDICTABLE', label: 'Highly Unpredictable', desc: 'Varies dramatically month-to-month' },
    ],
    defaultValue: 'SEASONAL',
    condition: (profile) => profile.incomeType === 'INFORMAL_GIG',
    impact: 'Unpredictable income adds a 20% safety buffer to living costs.',
  },

  // Adaptive Gig 2: High-Cost Debt
  {
    id: 'hasHighCostDebt',
    question: 'Active BNPL or money lender debt?',
    description: 'Includes credit card roll-overs, BNPL apps, or local lenders.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'INFORMAL_GIG',
    impact: 'High-cost informal debt triggers a DO NOT BORROW recommendation.',
  },

  // Adaptive Gig 3: Recent Bounce
  {
    id: 'recentPaymentBounce',
    question: 'Recent EMI or cheque bounce?',
    description: 'Any bounce in past 6 months.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'INFORMAL_GIG' || profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Recent bounces trigger credit risk penalties and bank rejection.',
  },

  // Adaptive Productive: Productive Check & Improvement
  {
    id: 'isProductiveBorrowing',
    question: 'Will this loan generate revenue?',
    description: 'Loans for equipment, inventory, or education pay for themselves over time.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.loanPurpose === 'BUSINESS' || profile.loanPurpose === 'EDUCATION',
    impact: 'Revenue-generating borrowing improves long-term debt sustainability.',
  },

  {
    id: 'expectedIncomeImprovement',
    question: 'Expected monthly revenue boost (₹)',
    description: 'Estimated net additional income generated by loan investment.',
    type: 'currency',
    placeholder: 'e.g. 25,000',
    defaultValue: 25000,
    condition: (profile) => profile.isProductiveBorrowing === true,
    impact: 'Copilot factors 50% of expected revenue boost into future debt capacity.',
  },

  // 6. Net Monthly Income
  {
    id: 'netMonthlyIncome',
    question: 'Monthly take-home income (₹)',
    description: 'Actual in-hand salary credited or net monthly cash inflow.',
    type: 'currency',
    placeholder: 'e.g. 85,000',
    defaultValue: 85000,
    condition: () => true,
    impact: 'Net income is the foundation of all affordability calculations.',
    validation: (val) => {
      if (!val || val <= 0) return 'Please enter your net monthly income.';
      return null;
    },
  },

  // 7. Existing EMIs
  {
    id: 'existingMonthlyEmis',
    question: 'Existing monthly EMIs (₹)',
    description: 'Total active monthly debt obligations.',
    type: 'currency',
    placeholder: 'e.g. 12,000',
    defaultValue: 0,
    condition: () => true,
    impact: 'Existing EMIs consume available FOIR caps and lower safe capacity.',
  },

  // 8. Living Expenses
  {
    id: 'essentialLivingCosts',
    question: 'Monthly living expenses (₹)',
    description: 'Rent, groceries, utilities, and tuition.',
    type: 'currency',
    placeholder: 'e.g. 30,000',
    defaultValue: 30000,
    allowUnknown: true,
    unknownLabel: 'Don\'t know? That\'s okay. Your estimate will be wider.',
    unknownValue: null,
    condition: () => true,
    impact: 'Protecting living costs ensures you never face cash shortages after paying proposed EMI.',
  },

  // 9. Age
  {
    id: 'age',
    question: 'Your age',
    description: 'Age dictates maximum allowable bank loan tenure.',
    type: 'number',
    placeholder: 'e.g. 32',
    defaultValue: 32,
    min: 18,
    max: 75,
    allowUnknown: true,
    unknownLabel: 'Don\'t know? That\'s okay. Your estimate will be wider.',
    unknownValue: null,
    condition: () => true,
    impact: 'Indian bank tenures must end before retirement age (60 for salaried, 65 for self-employed).',
  },

  // 10. Credit Score
  {
    id: 'cibilTierKey',
    question: 'Credit score',
    description: 'Select your score band. "Don\'t know" is a completely valid choice.',
    type: 'pills',
    options: Object.values(CIBIL_TIERS).map((tier) => ({
      value: tier.key,
      label: tier.label,
      desc: tier.isUnknown ? 'Estimated using market benchmarks' : `Score ${tier.min}-${tier.max}`,
    })),
    defaultValue: 'EXCELLENT',
    allowUnknown: true,
    unknownLabel: 'Don\'t know? That\'s okay. Your estimate will be wider.',
    unknownValue: 'UNKNOWN',
    condition: () => true,
    impact: 'Scores above 750 command bottom rates. Unknown scores widen rate ranges without rejecting the applicant.',
  },

  // 11. Emergency Savings
  {
    id: 'emergencySavingsMonths',
    question: 'Emergency savings cushion',
    description: 'Months of living expenses saved in liquid bank deposits.',
    type: 'slider',
    min: 0,
    max: 12,
    step: 1,
    unitLabel: 'months',
    defaultValue: 4,
    condition: () => true,
    impact: 'Liquid savings cushion protects against default during sudden emergencies.',
  },

  // 12. Quoted Terms (Optional)
  {
    id: 'customInterestRate',
    question: 'Quoted interest rate (% p.a.)',
    description: 'Nominal rate stated on bank sanction quote.',
    type: 'percent',
    placeholder: 'e.g. 11.5',
    defaultValue: 11.5,
    allowUnknown: true,
    unknownLabel: 'No quote yet (Use market benchmark)',
    unknownValue: null,
    condition: () => true,
    impact: 'Entering quoted rate allows Copilot to compute true All-in APR.',
  },

  {
    id: 'processingFeePercent',
    question: 'Quoted processing fee (%)',
    description: 'Standard processing fee charged upfront.',
    type: 'percent',
    placeholder: 'e.g. 1.5',
    defaultValue: 1.5,
    allowUnknown: true,
    unknownLabel: 'Not sure (Use standard 1.5% benchmark)',
    unknownValue: null,
    condition: () => true,
    impact: 'Processing fees attract 18% GST and reduce net cash disbursed.',
  },
];
