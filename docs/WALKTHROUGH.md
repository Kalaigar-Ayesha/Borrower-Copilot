# Borrower Copilot - 5-Minute Presentation Script (`docs/WALKTHROUGH.md`)

This script is designed for a 5-minute technical presentation and demo walkthrough with hiring managers and senior engineers.

---

### ⏱️ Timeline & Presentation Script

#### 0:00 – 0:30 | The Problem
> *"Good morning/afternoon! Today I’m presenting **Borrower Copilot**, a decision-support product for Indian retail borrowers.*  
> *When consumers apply for loans in India, banks only ask: 'How much can we legally sanction under our 50% FOIR risk cap?' Lenders ignore household rent, groceries, or family expenses because they profit from interest.*  
> *Borrower Copilot flips this script: It asks 'How much can your budget safely afford without breaking your emergency cushion?'"*

#### 0:30 – 1:15 | Question Design & Adaptive Flow
> *"Instead of bombarding users with a boring 25-field bank form, we built an editorial 1-question-per-screen guided conversation.*  
> *The flow is adaptive: Salaried borrowers get questions about employment duration and variable bonuses; self-employed applicants get questions about reported ITR income and property collateral; gig workers get asked about income predictability and high-cost informal debt.*  
> *Every screen features an expandable 'Why are we asking this?' drawer so the user understands the exact financial rationale behind every question."*

#### 1:15 – 2:15 | Decision Engine Architecture
> *"The core engine is built in pure JavaScript inside `src/rules/`—completely decoupled from React UI components.*  
> *All financial thresholds live in `src/data/assumptions.js` with zero magic numbers scattered in code.*  
> *The engine evaluates two distinct affordability models: Lender Sanction Capacity vs Borrower-Safe Affordability.*  
> *It also features Product-Aware Routing: For instance, when evaluating **Ravi**—a self-employed owner with ₹45 Lakh shop property collateral—the engine automatically routes him to a **Secured Business / Loan Against Property (LAP)** route rather than an expensive unsecured loan, dropping his interest rate to 9.5%-11.0%."*

#### 2:15 – 3:15 | Results & Explainability
> *"The Results dashboard starts with 'Your borrowing snapshot' followed immediately by the primary decision verdict: **BORROW**, **BORROW LESS**, or **DON'T BORROW YET**.*  
> *Notice our visual hierarchy rule: The Borrower-Safe Capacity card (`₹7.5 Lakh`) is visually dominant over the secondary Lender Max Sanction card (`₹12.5 Lakh`).*  
> *Interest rates and All-in APRs are presented as honest ranges (e.g. `11.0% – 12.5%`) to avoid false precision, explicitly factoring in processing fees and mandatory 18% GST.*  
> *Crucially, 'Unknown is never treated as zero'. If a user skips living expenses or has an unrated credit score, the engine widens output ranges and lowers confidence without failing."*

#### 3:15 – 4:15 | Negotiation Card + Quote Check
> *"We built two unique post-assessment tools:*  
> *First, **Quote Check**: If a bank Relationship Manager gives you a quote—say 14% rate and 1.75% fee—you can enter it to instantly verify if it's fair compared to Copilot market benchmarks.*  
> *Second, the **Bank Negotiation Battlecard**: A printable one-screen artifact with target fair rates, fee waiver goals, and verbatim talking scripts to take directly to the bank."*

#### 4:15 – 5:00 | Architecture, Limitations & Next Steps
> *"Architecturally, the app is 100% client-side (React, Vite, Vanilla CSS). Data stays strictly in React state for maximum privacy—no login, no bureau pull, no data stored.*  
> *Our automated test suite runs 16 unit tests verifying personas like Priya, Ravi, and Anita in under 1 second.*  
> *If I had more time, I would build: 1) OCR upload for bank sanction letters, 2) Multi-lender side-by-side comparison, and 3) RBI repo-rate web-scraper integration.*  
> *Thank you, and I look forward to your questions!"*
