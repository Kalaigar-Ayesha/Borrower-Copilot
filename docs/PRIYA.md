# Persona Run-Through 1: Priya (Safe Salaried Corporate Profile)

This document details the exact questions, answers, and decision engine outputs for **Priya**, evaluated directly by `calculateAssessment(priyaBorrower)`.

---

## 1. Questions Asked & Answers

| Question | Priya's Answer |
| :--- | :--- |
| **Loan Purpose** | Personal & Family Expenses (`PERSONAL`) |
| **Requested Loan Amount** | `₹3,00,000` (₹3 Lakhs) |
| **Loan Product Category** | Unsecured Personal Loan (`PERSONAL`) |
| **Preferred Tenure** | 36 Months (3 Years) |
| **Employment Structure** | Salaried Employee (`SALARIED`) |
| **Employment Duration** | 3 to 5 Years (`3_TO_5_YRS`) |
| **Variable Bonus / Incentive** | Yes (`₹1,50,000`/year) |
| **Net Monthly Income** | `₹1,20,000`/month (₹1.2 Lakhs) |
| **Existing Monthly EMIs** | `₹5,000`/month |
| **Household Living Expenses** | `₹35,000`/month |
| **Borrower Age** | 30 Years |
| **CIBIL Credit Score Band** | 775 - 900 Excellent (`EXCELLENT`) |
| **Emergency Savings Cushion** | 6 Months of Expenses |

---

## 2. Adaptive Questions Evaluated
- **Adaptive Salaried Questions**: Employment duration (`3_TO_5_YRS`) & Variable bonus (`₹1,50,000`/yr) were dynamically triggered based on `incomeType === 'SALARIED'`.

---

## 3. Decision Engine Outputs

1. **Borrowing Decision (Verdict)**:  
   - **Verdict**: `BORROW` (Proceed Safely)
   - **Title**: Safe to Borrow
   - **Subtitle**: Your requested loan fits comfortably within your safe financial capacity with a healthy cushion.
2. **Lender-Likely Sanction Range**:  
   - `₹19.67 Lakh – ₹20.08 Lakh` (Max Bank EMI Limit: `₹61,000`/mo at 55% FOIR)
3. **Borrower-Safe Borrowing Range**:  
   - `₹11.16 Lakh – ₹11.39 Lakh` (Safe EMI Ceiling: `₹34,600`/mo)
4. **Recommended Borrowing Amount**:  
   - `₹3,00,000` (₹3.00 Lakh - Matches requested amount 100%)
5. **Fair Interest-Rate Range**:  
   - `8.5% – 9.25% p.a.` (Prime corporate salaried rate based on CIBIL 775+)
6. **Estimated All-In APR Range**:  
   - `9.25% – 10.0% p.a.` (Includes 1.0% processing fee + 18% GST)
7. **Safe EMI Ceiling**:  
   - `₹34,600`/month (Proposed EMI is `₹9,471`/mo)
8. **Tenure Trade-Off Matrix**:
   - **12 Months**: EMI `₹26,170`/mo | Total Interest `₹14,042` (0.05x principal)
   - **24 Months**: EMI `₹13,636`/mo | Total Interest `₹27,260` (0.09x principal)
   - **36 Months (Selected)**: EMI `₹9,471`/mo | Total Interest `₹40,942` (0.14x principal)
   - **60 Months**: EMI `₹6,163`/mo | Total Interest `₹69,762` (0.23x principal)
9. **Stress Test Simulation**:  
   - **Passed 2/2 Scenarios**:
     - *Scenario 1 (-20% Income Drop)*: Post-shock surplus `₹47,529`/mo (PASSED)
     - *Scenario 2 (+2.0% Rate Hike)*: Post-shock surplus `₹75,255`/mo (PASSED)
10. **Confidence Rating**:  
    - `HIGH CONFIDENCE` (`100/100` score points - All key parameters verified by user)
11. **Bank Negotiation Battlecard**:  
    - **Target Rate**: `8.50%` (Saves ~`₹6,750`/yr vs quoted 10.75%)
    - **Target Fee**: `0.5%` or flat `₹1,000` cap (Saves `₹2,950` upfront)
12. **Why Recommendation Was Reached**:  
    - Proposed EMI of `₹9,471`/mo consumes only 12% of unencumbered cash surplus (`₹80,000`/mo). Total post-loan debt ratio is only 12% of net income (well below safe 30% cap), backed by 6 months of emergency liquid savings.
