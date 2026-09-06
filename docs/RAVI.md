# Persona Run-Through 2: Ravi (Self-Employed Business LAP Secured Route)

This document details the exact questions, answers, and decision engine outputs for **Ravi**, evaluated directly by `calculateAssessment(raviBorrower)`.

---

## 1. Questions Asked & Answers

| Question | Ravi's Answer |
| :--- | :--- |
| **Loan Purpose** | Business Growth & Capital (`BUSINESS`) |
| **Requested Loan Amount** | `₹15,00,000` (₹15 Lakhs) |
| **Loan Product Category** | Business Loan (`BUSINESS`) |
| **Preferred Tenure** | 60 Months (5 Years) |
| **Employment Structure** | Self-Employed / Business Owner (`SELF_EMPLOYED`) |
| **Business Operational History** | Over 5 Years (`OVER_5_YRS`) |
| **Reported ITR Net Income** | `₹18,00,000`/year (₹1.5 Lakhs/mo reported ITR) |
| **Net Monthly Cash Inflow** | `₹1,60,000`/month (₹1.6 Lakhs) |
| **Collateral Availability** | Yes — Pledging ₹45 Lakh Unencumbered Shop Property (`hasCollateral: true`) |
| **Productive Loan Purpose** | Yes — Purchasing inventory & equipment (`isProductiveBorrowing: true`) |
| **Expected Income Improvement** | `₹50,000`/month |
| **Existing Monthly EMIs** | `₹15,000`/month |
| **Household Living Expenses** | `₹50,000`/month |
| **Borrower Age** | 42 Years |
| **CIBIL Credit Score Band** | Unknown / Unrated (`UNKNOWN`) |
| **Emergency Savings Cushion** | 8 Months of Expenses |

---

## 2. Adaptive Questions Evaluated
- **Adaptive Self-Employed Questions**: Business tenure (`OVER_5_YRS`), ITR net income (`₹18,00,000`/yr), and Property Collateral (`₹45,00,000`) were dynamically triggered.
- **Adaptive Productive Borrowing Questions**: Expected monthly income improvement (`₹50,000`/mo) was triggered based on business expansion purpose.

---

## 3. Decision Engine Outputs

1. **Product Routing**:  
   - **Route**: `LAP` (**Secured Business Loan / Loan Against Property**)
   - **Product Name**: Loan Against Property (LAP) / Secured Business Loan
   - **Explanation**: Pledging ₹45 Lakh unencumbered shop property routes Ravi to a secured LAP facility, lowering interest rates by -2.5% and increasing bank sanction capacity.
2. **Borrowing Decision (Verdict)**:  
   - **Verdict**: `BORROW` (Proceed Safely)
   - **Title**: Safe to Borrow
   - **Subtitle**: Your requested loan fits comfortably within your safe financial capacity with a healthy cushion.
3. **Lender-Likely Sanction Range**:  
   - `₹22.50 Lakh – ₹22.50 Lakh` (Capped by 50% Property LTV limit of ₹22.50 Lakhs; Max Bank EMI Limit: `₹67,500`/mo at 55% secured FOIR)
4. **Borrower-Safe Borrowing Range**:  
   - `₹19.67 Lakh – ₹20.08 Lakh` (Safe EMI Ceiling: `₹48,000`/mo)
5. **Fair Interest-Rate Range**:  
   - `9.50% – 11.00% p.a.` (Secured LAP rate spread; acknowledges unrated CIBIL without rejecting application)
6. **Estimated All-In APR Range**:  
   - `10.00% – 11.50% p.a.` (Includes 0.75% processing fee + 18% GST)
7. **Safe EMI Ceiling**:  
   - `₹48,000`/month (Proposed EMI is `₹32,042`/mo at 10.25% mid-rate)
8. **Tenure Trade-Off Matrix**:
   - **24 Months**: EMI `₹69,388`/mo | Total Interest `₹1,65,302` (0.11x principal)
   - **36 Months**: EMI `₹48,574`/mo | Total Interest `₹2,48,675` (0.17x principal)
   - **60 Months (Selected)**: EMI `₹32,042`/mo | Total Interest `₹4,22,504` (0.28x principal)
   - **120 Months**: EMI `₹20,019`/mo | Total Interest `₹9,02,331` (0.60x principal)
9. **Stress Test Simulation**:  
   - **Passed 2/2 Scenarios**:
     - *Scenario 1 (-20% Income Drop)*: Post-shock surplus `₹35,958`/mo (PASSED)
     - *Scenario 2 (+2.0% Rate Hike)*: Post-shock surplus `₹66,423`/mo (PASSED)
10. **Confidence Rating**:  
    - `MEDIUM CONFIDENCE` (`75/100` score points - Rate range widened `9.5%-11.0%` due to unrated CIBIL score)
11. **Bank Negotiation Battlecard**:  
    - **Target Rate**: `9.50%` (Saves ~`₹11,250`/yr vs quoted 11.0%)
    - **Target Fee**: `0.5%` or flat `₹5,000` cap (Saves `₹8,850` upfront)
12. **Why Recommendation Was Reached**:  
    - Ravi's ₹45 Lakh property collateral provides 3x coverage over the requested ₹15 Lakh loan. His expected ₹50,000/mo income boost from business equipment further strengthens cash surplus (`₹1,20,000`/mo total effective surplus).
