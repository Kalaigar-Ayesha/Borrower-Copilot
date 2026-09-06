# Persona Run-Through 3: Anita (Informal / Gig Worker High-Risk Profile)

This document details the exact questions, answers, and decision engine outputs for **Anita**, evaluated directly by `calculateAssessment(anitaBorrower)`.

---

## 1. Questions Asked & Answers

| Question | Anita's Answer |
| :--- | :--- |
| **Loan Purpose** | Personal & Family Emergency (`PERSONAL`) |
| **Requested Loan Amount** | `₹4,00,000` (₹4 Lakhs) |
| **Loan Product Category** | Unsecured Personal Loan (`PERSONAL`) |
| **Preferred Tenure** | 24 Months (2 Years) |
| **Employment Structure** | Informal / Gig Worker (`INFORMAL_GIG`) |
| **Gig Cashflow Predictability** | Highly Unpredictable (`UNPREDICTABLE`) |
| **Active High-Cost Informal Debt** | Yes — Active BNPL & Credit Card Roll-overs (`hasHighCostDebt: true`) |
| **Recent EMI Payment Bounces** | Yes — Cheque/ECS bounce in last 6 months (`recentPaymentBounce: true`) |
| **Net Monthly Cash Inflow** | `₹35,000`/month |
| **Existing Monthly EMIs** | `₹12,000`/month |
| **Household Living Expenses** | `₹22,000`/month |
| **Borrower Age** | 27 Years |
| **CIBIL Credit Score Band** | Below 675 / Poor (`POOR`) |
| **Emergency Savings Cushion** | 0 Months (No liquid bank savings) |

---

## 2. Adaptive Questions Evaluated
- **Adaptive Gig Questions**: Income predictability (`UNPREDICTABLE`), high-cost debt flag (`true`), and payment bounce flag (`true`) were dynamically triggered.

---

## 3. Decision Engine Outputs

1. **Borrowing Decision (Verdict)**:  
   - **Verdict**: `DONT_BORROW` (Do Not Borrow Now)
   - **Title**: Do Not Borrow Now
   - **Subtitle**: Taking this loan poses a high risk of financial distress or debt trap under your current cash flow.
   - **Primary Reason**: High-cost informal debt detected and recent EMI bounce history.
2. **Lender-Likely Sanction Range**:  
   - `₹0 – ₹45,000` (Banks reject or severely restrict sanction due to payment bounces and poor credit score)
3. **Borrower-Safe Borrowing Range**:  
   - `₹0 – ₹0` (Negative cash flow after accounting for unpredictability buffer)
4. **Recommended Borrowing Amount**:  
   - `₹0` (Do not borrow)
5. **Fair Interest-Rate Range**:  
   - `16.00% – 19.50% p.a.` (High risk pricing band)
6. **Estimated All-In APR Range**:  
   - `17.75% – 21.25% p.a.` (Includes 2.5% processing fee + 18% GST)
7. **Safe EMI Ceiling**:  
   - `₹0`/month (Proposed EMI is `₹19,901`/mo)
8. **Tenure Trade-Off Matrix**:
   - **12 Months**: EMI `₹36,634`/mo | Total Interest `₹39,608`
   - **24 Months (Selected)**: EMI `₹19,901`/mo | Total Interest `₹77,633`
9. **Stress Test Simulation**:  
   - **Failed 2/2 Scenarios**:
     - *Scenario 1 (-20% Income Drop)*: Post-shock deficit `-₹23,301`/mo (FAILED)
     - *Scenario 2 (+2.0% Rate Hike)*: Post-shock deficit `-₹20,312`/mo (FAILED)
10. **Confidence Rating**:  
    - `MEDIUM CONFIDENCE` (`70/100` score points)
11. **Action Plan for Anita**:  
    - Clear all active BNPL and high-interest credit card roll-overs completely before seeking bank credit.
    - Maintain 6 consecutive months of zero payment bounces to restore credit standing.
12. **Why Recommendation Was Reached**:  
    - Anita currently has `₹35,000`/mo income with `₹22,000`/mo living costs and `₹12,000`/mo existing EMIs, leaving only `₹1,000`/mo cash surplus. Adding a `₹19,901`/mo new EMI creates an immediate `₹18,901`/mo deficit, leading directly to loan default.
