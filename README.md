# Borrower Copilot 🏦

> **Production-Quality Financial Decision-Support Web Product for Indian Retail Borrowers**  
> Built for the Lokta Software Engineering Intern Take-Home Challenge.

---

## ⚡ Quick Start (Under 2 Minutes)

```bash
# 1. Clone or navigate to repository root directory
cd Browwer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` (or the URL printed in terminal).

---

## 🎯 Product Overview & Vision

**Borrower Copilot** is a consumer-facing financial decision-support tool designed specifically for the Indian retail lending landscape.

Unlike generic loan calculators or bank loan portals that focus on *"How much can we lend you?"*, Borrower Copilot answers the critical consumer question:  
👉 **"Should I borrow this money, how much is actually safe for my budget, and how do I negotiate the best deal with the bank?"**

---

## 🧠 Core Product Principles

1. **Borrow / Borrow Less / Don't Borrow Verdict**: "Don't borrow" is a first-class real outcome driven by debt-trap indicators (FOIR > 55%, negative cash flow, APR > 24%).
2. **Lender Sanction vs. Borrower Safe Capacity**:
   - **Lender Capacity**: Based on bank FOIR (Fixed Obligation to Income Ratio, max 50-55% of gross/net income). Lenders ignore your personal living costs.
   - **Borrower-Safe Capacity**: Deducts essential living expenses (rent, groceries, dependants) and reserves a buffer before allocating to loan EMIs (capping EMI at 30% of income or 40% of disposable surplus).
3. **Unknown is Never Treated as Zero**: Skipping an expense or fee parameter does not default to ₹0. Copilot uses conservative Indian market benchmarks and expands uncertainty ranges (±10% to ±20%) while lowering the Confidence Score.
4. **All-In Effective APR Transparency**: Factoring nominal interest rates, upfront processing fees, documentation charges, and **mandatory 18% GST** to calculate true IRR cost.
5. **3-Point Economic Stress Scenarios**: Tests cash flow resilience against a 20% income reduction, a ₹20,000/mo emergency expense, and a 2.5% RBI interest rate hike.
6. **Bank Negotiation Battlecard**: Generates word-for-word scripts, counter-offers, fee waiver demands, and pre-payment penalty clauses for bank Relationship Managers.
7. **Strict Decoupling of Rules**: Business/financial rules live entirely in pure JavaScript engines (`src/rules/`), completely independent of React UI components.

---

## 🏗️ Architecture & Folder Structure

```
Browwer/
├── index.html                  # SEO & Typography Shell (Playfair Display + Plus Jakarta Sans)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                # Application Entrypoint
    ├── App.jsx                 # Main Shell & Routing State
    ├── index.css               # Editorial CSS Design System & Variables
    ├── data/
    │   └── indianLendingBenchmarks.js  # RBI Repo rates, CIBIL bands, GST rates, FOIR caps
    ├── rules/                   # PURE FINANCIAL LOGIC ENGINES (Decoupled from UI)
    │   ├── financialCalculations.js  # EMI, Max Principal, Lender Sanction & Borrower Safe Capacity
    │   ├── aprEngine.js              # IRR Solver, All-In APR, Processing Fee + 18% GST Drag
    │   ├── recommendationEngine.js   # Decision Verdict (BORROW | BORROW_LESS | DONT_BORROW)
    │   ├── confidenceEngine.js       # Confidence scoring & range expansion engine
    │   ├── stressEngine.js           # Economic shock simulation (Income drop, Emergency, Rate hike)
    │   └── negotiationEngine.js      # Bank RM talking points & savings calculation
    ├── questions/
    │   └── assessmentSteps.js    # Adaptive step configurations & conditional branching
    ├── hooks/
    │   └── useAssessment.js      # Custom React Hook connecting rules to UI state
    ├── components/              # REUSABLE PRESENTATION COMPONENTS
    │   ├── Header.jsx            # Brand navigation & step progress tracker
    │   ├── Footer.jsx            # Disclaimer & methodology summary
    │   ├── WhyModal.jsx          # Interactive "Why?" drawer explaining mathematical rationale
    │   ├── VerdictBanner.jsx     # High-impact decision card with action plans
    │   ├── CapacityComparison.jsx # Side-by-side Bank Sanction vs Borrower Safe comparison
    │   ├── AprBreakdown.jsx      # Nominal rate vs True All-In APR card
    │   ├── TenureTradeoff.jsx    # Interactive tenure comparison matrix (1 to 20 yrs)
    │   ├── StressScenario.jsx    # 3-Point stress test pass/fail cards
    │   ├── ConfidenceBadge.jsx   # Confidence rating & missing parameter guidance
    │   └── NegotiationCard.jsx   # Printable bank negotiation battlecard
    ├── pages/
    │   ├── LandingPage.jsx       # Editorial hero & fast demo preset profile switcher
    │   ├── AssessmentPage.jsx    # Adaptive questionnaire with live calculation feedback
    │   └── ResultsPage.jsx       # Comprehensive Copilot evaluation report
    └── utils/
        └── formatters.js         # Indian Rupee (₹, Lakhs), percentage, & tenure formatters
```

---

## 🎨 Visual Design Direction

- **Palette**: Warm off-white (`#FAF8F5`), soft cream (`#F6F2EC`), muted sand (`#D4C4A8`), soft sage green (`#5B7B6B`), deep forest green (`#1E3A2B`), dark charcoal (`#1A1D1A`).
- **Typography**: Dual font pairing — *Playfair Display* for authoritative editorial headings + *Plus Jakarta Sans* for crisp financial UI elements.
- **Aesthetic**: Calm, trustworthy, human, and minimal. Avoids cheap fintech gradients, dashboard clutter, or admin panel visual noise.

---

## 🛡️ Interview Defense Points (For Code Walkthrough)

When defending this implementation in an interview:

1. **Why separate `src/rules/` from React UI components?**
   - Pure JS functions in `src/rules/` have 0 DOM dependencies. They can be unit-tested effortlessly, run on Node.js/Edge workers, or plugged into any UI framework without refactoring financial rules.
2. **How does the All-in APR calculator work?**
   - It computes the Internal Rate of Return (IRR) by solving the net cashflow equation: Net Disbursed Principal (`Gross Principal - Processing Fee - 18% GST - Fees`) against monthly EMI outflow over tenure $n$.
3. **How does Copilot handle missing/unknown inputs?**
   - Rather than defaulting unknown fields to 0 (which inflates capacity unsafely), `confidenceEngine.js` substitutes market average benchmarks, lowers the Confidence Score (`High` -> `Medium` -> `Low`), and widens the capacity output bounds by $\pm 10\text{--}20\%$.
4. **How are bank negotiation targets calculated?**
   - `negotiationEngine.js` compares the quoted interest rate against benchmark repo-linked rates for the borrower's CIBIL tier (e.g. 775+ CIBIL), calculates exact annual rupee savings, and targets a 0.5% capped processing fee.

---

## 🧪 Verification & Build Status

- **Build**: Tested with Vite production build (`npm run build`).
- **Dev Server**: Runs cleanly via `npm run dev`.
- **Console**: 0 warnings, 0 runtime errors.
