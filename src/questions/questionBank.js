/**
 * Declarative Question Schema & Adaptive Question Bank
 * Each question defines its metadata, interactive controls, adaptive condition predicate,
 * and clear contextual impact ("Why are we asking?").
 */

import { LOAN_CATEGORIES, CIBIL_TIERS } from '../data/indianLendingBenchmarks.js';

export const QUESTION_BANK = [
  // ==========================================
  // MUST QUESTION 1: Loan Purpose
  // ==========================================
  {
    id: 'loanPurpose',
    question: 'What is the primary purpose of this loan?',
    description: 'Select the main reason you are planning to borrow funds.',
    type: 'card_select',
    options: [
      { value: 'PERSONAL', label: 'Personal & Family Expenses', desc: 'Medical, wedding, travel, or general personal use', icon: '👤' },
      { value: 'HOME', label: 'Home Purchase or Renovation', desc: 'Property purchase, construction, or major repair', icon: '🏠' },
      { value: 'CAR', label: 'Vehicle Purchase', desc: 'Four-wheeler or commercial vehicle financing', icon: '🚗' },
      { value: 'BUSINESS', label: 'Business Growth & Capital', desc: 'Inventory, equipment, working capital, expansion', icon: '💼' },
      { value: 'EDUCATION', label: 'Higher Education', desc: 'Domestic or international university tuition & living', icon: '🎓' },
      { value: 'MEDICAL', label: 'Medical Emergency', desc: 'Hospitalization or urgent health treatment', icon: '🏥' },
    ],
    defaultValue: 'PERSONAL',
    condition: () => true,
    impact: 'Loan purpose determines applicable bank interest rate benchmarks, maximum allowable FOIR caps, tax deduction benefits, and whether the loan generates productive income.',
  },

  // ==========================================
  // MUST QUESTION 2: Requested Amount
  // ==========================================
  {
    id: 'requestedAmount',
    question: 'How much loan principal do you want to borrow?',
    description: 'Enter the target loan amount you plan to request from lenders.',
    type: 'currency',
    placeholder: 'e.g. 5,00,000',
    defaultValue: 500000,
    min: 10000,
    max: 50000000,
    condition: () => true,
    impact: 'The loan principal directly determines your monthly EMI obligation, lifetime interest cost, and required income-to-debt safety ratio.',
    validation: (val) => {
      if (!val || val <= 0) return 'Please enter a valid loan amount above ₹10,000.';
      return null;
    },
  },

  // ==========================================
  // MUST QUESTION 3: Loan Product Category
  // ==========================================
  {
    id: 'loanCategoryKey',
    question: 'What type of loan product are you applying for?',
    description: 'Secured loans (with collateral) offer lower interest rates than unsecured loans.',
    type: 'pills',
    options: Object.values(LOAN_CATEGORIES).map((cat) => ({
      value: cat.id,
      label: cat.label,
      desc: cat.description,
    })),
    defaultValue: 'PERSONAL',
    condition: () => true,
    impact: 'Lenders charge higher interest rates on unsecured personal loans (11-18%) compared to secured home or car loans (8.5-10.5%).',
  },

  // ==========================================
  // MUST QUESTION 4: Preferred Tenure
  // ==========================================
  {
    id: 'requestedTenureMonths',
    question: 'What is your preferred repayment tenure?',
    description: 'Longer tenures lower your monthly EMI but significantly increase total lifetime interest paid.',
    type: 'tenure_pills',
    options: [
      { value: 12, label: '1 Year (12 mo)', desc: 'Highest EMI, lowest total interest' },
      { value: 24, label: '2 Years (24 mo)', desc: 'Balanced short term' },
      { value: 36, label: '3 Years (36 mo)', desc: 'Standard retail loan tenure' },
      { value: 60, label: '5 Years (60 mo)', desc: 'Lower EMI, higher interest' },
      { value: 84, label: '7 Years (84 mo)', desc: 'Long-term financing' },
      { value: 120, label: '10 Years (120 mo)', desc: 'Extended property/business tenure' },
    ],
    defaultValue: 36,
    condition: () => true,
    impact: 'Tenure is the single biggest factor governing lifetime interest cost. A 5-year loan can cost 40% more in total interest than a 3-year loan for the exact same principal.',
  },

  // ==========================================
  // MUST QUESTION 5: Income Type
  // ==========================================
  {
    id: 'incomeType',
    question: 'What is your primary income or employment structure?',
    description: 'Banks classify risk and FOIR sanction limits differently based on employment stability.',
    type: 'card_select',
    options: [
      { value: 'SALARIED', label: 'Salaried Employee', desc: 'Monthly fixed salary credited to bank account (MNC, Govt, Corporate)', icon: '🏢' },
      { value: 'SELF_EMPLOYED', label: 'Self-Employed / Business Owner', desc: 'Business profit, professional practice (CA, Doctor, Tech Freelancer, Trade)', icon: '🏪' },
      { value: 'INFORMAL_GIG', label: 'Informal / Gig Worker', desc: 'Daily/weekly payout, platform gig worker, contract worker', icon: '🛵' },
    ],
    defaultValue: 'SALARIED',
    condition: () => true,
    impact: 'Salaried borrowers get higher FOIR limits (up to 55%) due to predictable cash flow. Self-employed and gig workers require a larger safety buffer to account for income volatility.',
  },

  // ==========================================
  // ADAPTIVE SALARIED 1: Employment Duration
  // ==========================================
  {
    id: 'employmentDuration',
    question: 'How long have you been working at your current organization?',
    description: 'Lenders evaluate job stability before approving unsecured credit.',
    type: 'pills',
    options: [
      { value: 'UNDER_1_YR', label: 'Less than 1 Year', desc: 'Higher bank scrutiny' },
      { value: '1_TO_3_YRS', label: '1 to 3 Years', desc: 'Standard stability rating' },
      { value: '3_TO_5_YRS', label: '3 to 5 Years', desc: 'High stability score' },
      { value: 'OVER_5_YRS', label: 'Over 5 Years', desc: 'Top-tier stability' },
    ],
    defaultValue: '1_TO_3_YRS',
    condition: (profile) => profile.incomeType === 'SALARIED',
    impact: 'Borrowers with under 1 year at their current employer face tighter sanction caps and higher interest rates due to probation and job change risk.',
  },

  // ==========================================
  // ADAPTIVE SALARIED 2: Income Stability & Bonus
  // ==========================================
  {
    id: 'hasVariableIncome',
    question: 'Does a significant portion of your income depend on variable bonuses or commissions?',
    description: 'Variable pay is discounted by Indian banks when calculating sanction eligibility.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'SALARIED',
    impact: 'Banks typically apply a 40-50% haircut to variable annual bonuses because they cannot be guaranteed for monthly EMI repayment.',
  },

  {
    id: 'variableIncomeAmount',
    question: 'What is your average annual variable bonus or incentive? (₹)',
    description: 'Enter your total annual performance bonus or variable commission.',
    type: 'currency',
    placeholder: 'e.g. 1,50,000',
    defaultValue: 0,
    condition: (profile) => profile.incomeType === 'SALARIED' && profile.hasVariableIncome === true,
    impact: 'Copilot factors 50% of your annual variable bonus into your total yearly buffer, but excludes it from your mandatory monthly baseline EMI capacity.',
  },

  // ==========================================
  // ADAPTIVE SELF-EMPLOYED 1: Business Duration
  // ==========================================
  {
    id: 'businessDuration',
    question: 'How many years has your business or professional practice been operational?',
    description: 'Indian banks mandate at least 2-3 years of audited financial history for business loans.',
    type: 'pills',
    options: [
      { value: 'UNDER_2_YRS', label: 'Less than 2 Years', desc: 'Early stage / New business' },
      { value: '2_TO_5_YRS', label: '2 to 5 Years', desc: 'Established operational track record' },
      { value: 'OVER_5_YRS', label: 'Over 5 Years', desc: 'Mature business stability' },
    ],
    defaultValue: '2_TO_5_YRS',
    condition: (profile) => profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Businesses under 2 years old are flagged for higher risk premium (+2% interest rate) because early-stage cash flows are vulnerable.',
  },

  // ==========================================
  // ADAPTIVE SELF-EMPLOYED 2: ITR Annual Income
  // ==========================================
  {
    id: 'itrAnnualIncome',
    question: 'What is your net annual income declared in your latest ITR? (₹)',
    description: 'Indian banks strictly calculate loan eligibility based on filed Income Tax Returns (ITR).',
    type: 'currency',
    placeholder: 'e.g. 9,00,000',
    defaultValue: 900000,
    allowUnknown: true,
    unknownLabel: 'Haven\'t filed ITR / Don\'t have ITR',
    unknownValue: null,
    condition: (profile) => profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Lenders will only sanction loans up to 50% of your reported ITR net profit. If your actual cash flow is higher than reported ITR, bank sanction will be severely capped.',
  },

  // ==========================================
  // ADAPTIVE SELF-EMPLOYED 3: Collateral Availability
  // ==========================================
  {
    id: 'hasCollateral',
    question: 'Can you pledge property, fixed deposits, or commercial assets as loan collateral?',
    description: 'Collateral turns an unsecured loan into a secured facility with significantly lower interest rates.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Pledging collateral reduces interest rates by 2.5% to 4.0% and unlocks up to 70% higher bank sanction limits.',
  },

  // ==========================================
  // ADAPTIVE INFORMAL/GIG 1: Income Predictability
  // ==========================================
  {
    id: 'gigIncomePredictability',
    question: 'How predictable is your monthly income from gig or contract work?',
    description: 'Fluctuating monthly earnings increase the risk of missing EMI due dates.',
    type: 'pills',
    options: [
      { value: 'VERY_PREDICTABLE', label: 'Fairly Consistent', desc: 'Varies by less than 15% each month' },
      { value: 'SEASONAL', label: 'Seasonal / Fluctuating', desc: 'High peak months followed by lean periods' },
      { value: 'UNPREDICTABLE', label: 'Highly Unpredictable', desc: 'Varies dramatically month-to-month' },
    ],
    defaultValue: 'SEASONAL',
    condition: (profile) => profile.incomeType === 'INFORMAL_GIG',
    impact: 'Highly unpredictable income triggers a conservative 25% extra cash flow buffer in Copilot to ensure lean months do not lead to EMI default.',
  },

  // ==========================================
  // ADAPTIVE INFORMAL/GIG 2: High-Cost Debt Check
  // ==========================================
  {
    id: 'hasHighCostDebt',
    question: 'Do you currently have active loans from BNPL apps, credit card roll-overs, or local money lenders?',
    description: 'High-cost informal debt carries predatory interest rates (24% to 48% p.a.).',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'INFORMAL_GIG',
    impact: 'Carrying high-cost informal debt triggers a "DO NOT BORROW" recommendation until predatory high-interest debts are fully cleared.',
  },

  // ==========================================
  // ADAPTIVE INFORMAL/GIG 3: Recent Payment Bounce
  // ==========================================
  {
    id: 'recentPaymentBounce',
    question: 'Have you had any cheque, NACH, or loan EMI bounces in the last 6 months?',
    description: 'Payment bounces leave a negative mark on your credit history.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.incomeType === 'INFORMAL_GIG' || profile.incomeType === 'SELF_EMPLOYED',
    impact: 'Recent EMI bounces add severe credit risk penalties, causing banks to reject unsecured applications or charge maximum interest rates.',
  },

  // ==========================================
  // ADAPTIVE PRODUCTIVE 1: Expected Income Improvement
  // ==========================================
  {
    id: 'isProductiveBorrowing',
    question: 'Will this loan directly generate income or increase your business revenue?',
    description: 'Productive loans (equipment, inventory, education) pay for themselves over time.',
    type: 'boolean',
    defaultValue: false,
    condition: (profile) => profile.loanPurpose === 'BUSINESS' || profile.loanPurpose === 'EDUCATION',
    impact: 'Productive borrowing that increases monthly earning capacity receives a positive rating in Copilot, as future revenue will offset EMI costs.',
  },

  {
    id: 'expectedIncomeImprovement',
    question: 'What is the estimated monthly income boost generated by this investment? (₹/mo)',
    description: 'Estimate the net additional monthly revenue or salary increase expected.',
    type: 'currency',
    placeholder: 'e.g. 25,000',
    defaultValue: 25000,
    condition: (profile) => profile.isProductiveBorrowing === true,
    impact: 'Copilot factors 50% of your projected future income boost into your long-term debt sustainability analysis.',
  },

  // ==========================================
  // MUST QUESTION 6: Net Monthly Income
  // ==========================================
  {
    id: 'netMonthlyIncome',
    question: 'What is your net monthly take-home income? (₹)',
    description: 'Enter your actual monthly salary credited or net monthly business cash inflow.',
    type: 'currency',
    placeholder: 'e.g. 85,000',
    defaultValue: 85000,
    condition: () => true,
    impact: 'Net income is the foundation of all capacity calculations. Banks cap total debt at 50% of net income.',
    validation: (val) => {
      if (!val || val <= 0) return 'Please enter your net monthly income to calculate safe capacity.';
      return null;
    },
  },

  // ==========================================
  // MUST QUESTION 7: Existing Monthly EMIs
  // ==========================================
  {
    id: 'existingMonthlyEmis',
    question: 'What is the total of your existing monthly EMI obligations? (₹)',
    description: 'Include active home loans, car loans, personal loans, BNPL, or credit card EMIs.',
    type: 'currency',
    placeholder: 'e.g. 12,000',
    defaultValue: 0,
    condition: () => true,
    impact: 'Existing EMIs directly consume your available bank FOIR limit and reduce your monthly safe surplus.',
  },

  // ==========================================
  // MUST QUESTION 8: Monthly Household Expenses
  // ==========================================
  {
    id: 'essentialLivingCosts',
    question: 'How much do you spend monthly on essential household expenses? (₹)',
    description: 'Include rent, groceries, utilities, children tuition, and medical costs.',
    type: 'currency',
    placeholder: 'e.g. 30,000',
    defaultValue: 30000,
    allowUnknown: true,
    unknownLabel: 'Not sure (Estimate automatically at 38% of net income)',
    unknownValue: null,
    condition: () => true,
    impact: 'This is the most critical question where Borrower Copilot differs from banks. Lenders ignore living costs; Copilot protects them so you never face cash shortages.',
  },

  // ==========================================
  // MUST QUESTION 9: Borrower Age
  // ==========================================
  {
    id: 'age',
    question: 'What is your current age? (Years)',
    description: 'Age dictates maximum allowable loan tenure under Indian banking rules.',
    type: 'number',
    placeholder: 'e.g. 32',
    defaultValue: 32,
    min: 18,
    max: 75,
    allowUnknown: true,
    unknownLabel: 'Prefer not to say (Assume standard age 35)',
    unknownValue: null,
    condition: () => true,
    impact: 'Indian banks mandate that loan tenures must end before age 60 (for salaried) or age 65 (for self-employed). Older borrowers face shorter tenure limits.',
  },

  // ==========================================
  // MUST QUESTION 10: Credit Score (CIBIL)
  // ==========================================
  {
    id: 'cibilTierKey',
    question: 'What is your estimated CIBIL credit score band?',
    description: 'Select your score range. "I don\'t know" is a completely valid choice.',
    type: 'pills',
    options: Object.values(CIBIL_TIERS).map((tier) => ({
      value: tier.key,
      label: tier.label,
      desc: tier.isUnknown ? 'We will calculate using average market benchmarks' : `Score band ${tier.min}-${tier.max}`,
    })),
    defaultValue: 'EXCELLENT',
    allowUnknown: true,
    unknownLabel: 'I don\'t know / Haven\'t checked score',
    unknownValue: 'UNKNOWN',
    condition: () => true,
    impact: 'CIBIL scores above 750 command the lowest interest rates and zero processing fees. If unknown, Copilot uses benchmark averages and expands confidence ranges.',
  },

  // ==========================================
  // MUST QUESTION 11: Emergency Savings Cushion
  // ==========================================
  {
    id: 'emergencySavingsMonths',
    question: 'How many months of living expenses do you currently have saved in bank deposits?',
    description: 'Financial cushion available in liquid bank accounts or FDs.',
    type: 'slider',
    min: 0,
    max: 12,
    step: 1,
    unitLabel: 'months of expenses',
    defaultValue: 4,
    condition: () => true,
    impact: 'Having less than 1 month of liquid savings when taking a major loan leaves you vulnerable to sudden job loss or medical emergencies.',
  },

  // ==========================================
  // MUST QUESTION 12: Quoted Bank Terms (Optional)
  // ==========================================
  {
    id: 'customInterestRate',
    question: 'Has a bank already quoted you an interest rate? (% p.a.)',
    description: 'If you have a sanction letter or bank quote, enter the nominal rate.',
    type: 'percent',
    placeholder: 'e.g. 11.5',
    defaultValue: 11.5,
    allowUnknown: true,
    unknownLabel: 'No quote yet (Use market benchmark average)',
    unknownValue: null,
    condition: () => true,
    impact: 'Entering your exact quoted rate allows Copilot to compute your true All-In Effective APR and generate precise bank negotiation scripts.',
  },

  {
    id: 'processingFeePercent',
    question: 'What processing fee percentage did the bank quote?',
    description: 'Standard processing fees range from 0.5% to 2.5% plus 18% GST.',
    type: 'percent',
    placeholder: 'e.g. 1.5',
    defaultValue: 1.5,
    allowUnknown: true,
    unknownLabel: 'Not sure (Use standard 1.5% benchmark)',
    unknownValue: null,
    condition: () => true,
    impact: 'Processing fees are deducted upfront along with 18% GST, reducing the actual cash disbursed into your bank account.',
  },
];
