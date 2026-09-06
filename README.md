# Borrower Copilot

> **Production-Quality Financial Decision-Support Web Product for Indian Retail Borrowers**

---

## What It Does

**Borrower Copilot** is a decision-first financial support web application that helps Indian retail borrowers evaluate whether they should take a loan, how much they can safely afford (vs what banks sanction), true All-In Effective APRs, stress resilience, and exact bank negotiation tactics.

---

## Why It Exists

Commercial banks in India calculate eligibility based on what they can legally sell under 50-55% Fixed Obligation to Income Ratio (FOIR) caps. Lenders ignore personal living costs (rent, groceries, dependants) because they profit from interest.

Borrower Copilot flips this paradigm: It asks **"What can your household budget safely carry without risking cash flow deficit or default?"**

---

## Tech Stack

- **Framework**: React 18+ via Vite
- **Language**: JavaScript (JSX - No TypeScript, No unnecessary build overhead)
- **Styling**: Pure Vanilla CSS with CSS Custom Properties (Design Tokens)
- **Architecture**: 100% Client-Side React State & Decoupled Pure JS Rule Engine

---

## Architecture & Data Flow

```
User Interactive Input (UI)
       │
       ▼
Borrower Profile Object (React State)
       │
       ▼
Pure JS Rule Engine (`src/rules/` + `src/data/assumptions.js`)
       │
       ▼
Structured Assessment Result (Verdict, Ranges, APR, Stress Test)
       │
       ▼
Decision-First Results UI & Bank Negotiation Card
```

---

## Running Locally

```bash
# 1. Clone repository
git clone https://github.com/Kalaigar-Ayesha/Borrower-Copilot.git
cd Borrower-Copilot

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated rule engine unit test suite (16/16 Passed)
node src/rules/tests/runAssessmentTests.js
```

Open your browser at `http://localhost:5173`.

---

## Project Structure

```
Browwer/
├── README.md                   # Complete Setup & Architecture Guide
├── RULES.md                    # Transparent Financial Rules & Assumptions Table
├── index.html                  # Editorial Shell & Google Fonts Preconnect
├── package.json
├── vite.config.js
├── docs/
│   ├── PRIYA.md                # Persona Run-Through 1 (Safe Salaried Profile)
│   ├── RAVI.md                 # Persona Run-Through 2 (Self-Employed LAP Secured Route)
│   ├── ANITA.md                # Persona Run-Through 3 (Informal / Gig High-Risk Debt)
│   └── WALKTHROUGH.md          # Technical Presentation Script
└── src/
    ├── main.jsx                # App Entrypoint
    ├── App.jsx                 # Page Shell & State Wiring
    ├── index.css               # Editorial CSS Design System & Accessibility Focus Rings
    ├── data/
    │   └── assumptions.js      # Centralized Configurable Financial Thresholds & Spreads
    ├── rules/                  # PURE JAVASCRIPT DECISION ENGINE (Decoupled from UI)
    │   ├── affordability.js    # Lender Sanction FOIR vs Borrower Safe Affordability
    │   ├── borrowingDecision.js# Decision Verdict (BORROW | BORROW LESS | DONT BORROW)
    │   ├── loanAmount.js       # Sanction Range, Safe Range & Recommended Amount
    │   ├── interestRate.js     # Fair Rate Ranges (e.g., 11.0% - 12.5%, no false precision)
    │   ├── apr.js              # All-In APR Solver (Nominal Rate + Fees + 18% GST)
    │   ├── emi.js              # Standard Amortization Math & Safe EMI Ceiling
    │   ├── stressTest.js       # 2-Point Economic Shocks (-20% Income, +2% Rate Spike)
    │   ├── confidence.js       # Uncertainty & Range Expansion Engine
    │   ├── productRouting.js   # Product-Aware Routing (LAP / Secured Business for Ravi)
    │   ├── assessment.js       # Central Orchestrator: calculateAssessment(borrower)
    │   └── tests/
    │       └── runAssessmentTests.js  # Automated Unit Test Runner (16/16 Passed)
    ├── questions/
    │   └── questionBank.js     # Adaptive Question Schema & Impact Explanations
    ├── hooks/
    │   └── useAssessment.js    # React Hook connecting rule engine to UI state
    ├── pages/
    │   ├── LandingPage.jsx     # Hero & 3 borrower profile selection
    │   ├── AssessmentPage.jsx  # Single-question guided conversational questionnaire
    │   └── ResultsPage.jsx     # Decision-first evaluation report & interactive tools
    └── components/
        ├── PrivacyBanner.jsx   # Privacy trust statement
        ├── VerdictBanner.jsx   # Decision verdict card
        ├── CapacityComparison.jsx # Borrower-Safe (Dominant) vs Lender Sanction
        ├── QuoteCheckCard.jsx  # Bank offer comparison tool
        ├── WhatIfSimulator.jsx # Fast client-side slider simulator
        ├── InteractiveStressTest.jsx # Interactive shock simulator
        ├── DecisionTrail.jsx   # Visual rule engine flowchart
        ├── NegotiationCard.jsx # RM negotiation battlecard with copy/print controls
        └── ConfidenceCommunication.jsx # Precision rating breakdown
```

---

## Financial Rules & Business Logic

All lending logic lives in `src/rules/` and `src/data/assumptions.js`.  
Key rules include:
1. **Lender FOIR vs Borrower Safe Capacity**: Lenders cap debt at 50-55% FOIR; Copilot caps EMI at 30% of income or 40% of unencumbered disposable surplus after living expenses.
2. **Product-Aware Routing**: Self-employed borrowers with property collateral (like **Ravi**) are routed to **Loan Against Property (LAP)** at 9.5-11.0% rate rather than unsecured loans.
3. **Unknown Values**: Skips/unknowns do not default to ₹0. They trigger market average benchmarks, widen rate ranges, and adjust confidence score.
4. **All-In APR**: Factoring processing fee + mandatory 18% GST.

Full details are documented in [`RULES.md`](./RULES.md).

---

## Important Product Decisions

- **Decision-First UX**: Verdict (`BORROW`, `BORROW_LESS`, `DONT_BORROW`) is presented at the top of results with an immediate 1-sentence reason.
- **Visual Hierarchy**: Borrower-Safe Capacity is styled as the primary action card (`₹7.5 Lakh`), visually dominating the secondary Lender Max Sanction card (`₹12.5 Lakh`).
- **Explainability**: Every key output features an interactive *"Why?"* drawer explaining the exact underlying mathematics.

---

## Product Limitations

1. **No Bureau Pull**: Credit score is self-reported by the borrower.
2. **User-Stated Income**: Income and expenses are user-declared (unverified by bank statements).
3. **Self-Assessment (Not a Lender)**: Does not guarantee actual bank approval.

---

## Scenarios & Borrower Profiles

- **Salaried Corporate (`docs/PRIYA.md`)**: Salaried Corporate, ₹1.2L income, safe personal loan $\rightarrow$ `BORROW`
- **Self-Employed (`docs/RAVI.md`)**: Self-Employed, 0 credit score, ₹45L shop property $\rightarrow$ `BORROW` via Secured LAP Route
- **Gig & Freelance (`docs/ANITA.md`)**: Informal / Gig worker, BNPL debt, payment bounce $\rightarrow$ `DONT_BORROW`

---

## Future Roadmap

1. **Document OCR Upload**: Scan sanction letters or bank statements to auto-fill income and bank quotes.
2. **Multi-Lender Offer Comparison**: Side-by-side comparison matrix of quotes from HDFC, SBI, ICICI, and Axis Bank.
3. **Live RBI Repo Rate Scraper**: Automatically fetch real-time repo rate updates from RBI RSS feeds.
4. **Localization**: Support for Hindi, Tamil, Telugu, and Kannada regional languages.

---

## Design Decisions & Privacy Scope

- **No Backend / Database**: Financial data stays 100% in React state for user privacy.
- **No User Auth / Login**: Frictionless experience; zero barrier to entry.
- **No Credit Bureau API Integration**: Avoids requiring user PAN/Aadhaar or hard bureau credit pulls.
- **Deterministic Rule Engine**: Uses transparent, deterministic financial rule engines that users can inspect and rely on.
