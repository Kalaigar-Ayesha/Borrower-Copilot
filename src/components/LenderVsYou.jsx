import React, { useState } from 'react';
import { formatINR } from '../utils/formatters.js';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function LenderVsYou({ results, profile }) {
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  if (!results) return null;

  const {
    verdict,
    sanctionRange,
    safeRange,
    recommendedAmount,
    affordability,
    lenderSanction,
    borrowerSafe,
    productRouting,
    reasonsSummary,
  } = results;

  const activeProfile = profile || {};
  const decision = verdict ? verdict.decision : 'BORROW';
  const isBorrow = decision === 'BORROW';
  const isBorrowLess = decision === 'BORROW_LESS';
  const isDontBorrow = decision === 'DONT_BORROW';

  const lenderFormatted = sanctionRange ? sanctionRange.formatted : formatINR(lenderSanction?.sanctionedPrincipal || 0);
  const safeFormatted = safeRange ? safeRange.formatted : formatINR(borrowerSafe?.safePrincipal || 0);
  const recFormatted = recommendedAmount ? recommendedAmount.formatted : formatINR(borrowerSafe?.safePrincipal || 0);

  const lenderEmiFormatted = formatINR(affordability?.lenderBasis?.lenderMaxMonthlyEmi || lenderSanction?.bankCapacityEmi || 0);
  const safeEmiFormatted = formatINR(affordability?.borrowerSafeBasis?.safeMonthlyEmiCeiling || borrowerSafe?.safeEmiCeiling || 0);

  // Dynamic 1-sentence summary
  let summarySentence = '';
  if (isDontBorrow) {
    summarySentence = `A lender may evaluate paper eligibility up to ${lenderFormatted}, but our assessment does not recommend taking on new debt right now due to cash flow risk.`;
  } else if (isBorrowLess) {
    summarySentence = `A lender may consider you eligible for ${lenderFormatted}, but based on your living expenses and existing debts, we recommend staying closer to ${recFormatted}.`;
  } else {
    summarySentence = `Your requested loan fits comfortably within both bank eligibility limits (${lenderFormatted}) and your borrower-safe cash flow capacity (${safeFormatted}).`;
  }

  // Active factors that actually affected calculation
  const lenderFactors = [
    `Evaluated Monthly Income: ₹${(affordability?.lenderBasis?.bankIncomeBasis || 0).toLocaleString('en-IN')}/mo`,
    `Fixed Obligation Ratio (FOIR) Cap: ${affordability?.lenderBasis?.foirCapPercent || 50}% of evaluated income`,
    `Existing Debt Deduction: Subtraction of existing EMIs (₹${(affordability?.borrowerSafeBasis?.existingMonthlyEmis || 0).toLocaleString('en-IN')}/mo)`,
  ];

  if (productRouting?.isSecured) {
    lenderFactors.push(`Collateral LTV Ceiling: ${productRouting.productName} property valuation cap applied`);
  }

  const borrowerFactors = [
    `Net Monthly Income: ₹${(affordability?.borrowerSafeBasis?.netMonthlyIncome || 0).toLocaleString('en-IN')}/mo`,
    `Household Living Expenses: ₹${(affordability?.borrowerSafeBasis?.effectiveLivingCosts || 0).toLocaleString('en-IN')}/mo (${affordability?.borrowerSafeBasis?.isLivingCostsEstimated ? 'estimated at 38% benchmark' : 'user-declared'})`,
    `Existing Debt Obligations: ₹${(affordability?.borrowerSafeBasis?.existingMonthlyEmis || 0).toLocaleString('en-IN')}/mo`,
    `Safe EMI Ceiling: New debt capped at 40% of remaining cash surplus (or 30% net income)`,
  ];

  if (activeProfile.incomeType === 'INFORMAL_GIG' && activeProfile.gigIncomePredictability === 'UNPREDICTABLE') {
    borrowerFactors.push('Income Volatility Buffer: +20% buffer added to living costs for unpredictable gig income');
  }

  if (activeProfile.emergencySavingsMonths < 3) {
    borrowerFactors.push('Emergency Buffer Cushion: Emergency savings below 3 months; buffer reserved before debt repayment');
  }

  if (activeProfile.hasHighCostDebt) {
    borrowerFactors.push('High-Cost Debt Risk: Active credit card / BNPL debt flagged as immediate payoff priority');
  }

  if (activeProfile.recentBounceHistory) {
    borrowerFactors.push('Payment Bounce Risk: Recent EMI bounce history requires zero-debt buffer recovery');
  }

  if (productRouting?.isSecured) {
    borrowerFactors.push(`Product Routing: ${productRouting.productName} provides lower interest rates and longer repayment term`);
  }

  return (
    <section
      className="card"
      style={{
        marginBottom: '2rem',
        border: '1.5px solid var(--color-border)',
        padding: '1.75rem',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-sage)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.35rem',
          }}
        >
          LENDER VS YOU
        </span>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
          Lender Eligibility vs. Borrower Affordability
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', marginBottom: 0 }}>
          A lender may offer more than you should borrow. Banks calculate legal paper eligibility; Copilot calculates what your actual household budget can carry comfortably.
        </p>
      </div>

      {/* 3 Metrics Cards Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
          alignItems: 'stretch',
        }}
      >
        {/* Card 1: Lender May Offer */}
        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            opacity: isDontBorrow ? 0.85 : 0.95,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                {isDontBorrow ? 'Lender May Potentially Offer' : 'Lender May Offer'}
              </span>
              <WhyTrigger onClick={() => setActiveModal('LENDER')} label="Why?" />
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-text-muted)' }}>
              {lenderFormatted}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.3rem' }}>
              Max Bank EMI: {lenderEmiFormatted}/mo
            </span>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem', fontSize: '0.78rem', color: 'var(--color-text-light)' }}>
            Calculated at {affordability?.lenderBasis?.foirCapPercent || 50}% FOIR cap without deducting living expenses.
          </div>
        </div>

        {/* Card 2: Safer For You (PRIMARY DOMINANT CARD) */}
        <div
          style={{
            background: isDontBorrow ? 'var(--color-danger-light)' : 'var(--color-sage-tint)',
            border: `2px solid ${isDontBorrow ? 'var(--color-danger-border)' : 'var(--color-primary)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '1.35rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: isDontBorrow ? 'var(--color-danger)' : 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                SAFER FOR YOU
              </span>
              <WhyTrigger onClick={() => setActiveModal('SAFE')} label="Why?" />
            </div>

            <div style={{ fontSize: '2.1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: isDontBorrow ? 'var(--color-danger)' : 'var(--color-primary)' }}>
              {safeFormatted}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isDontBorrow ? 'var(--color-danger)' : 'var(--color-primary-light)', display: 'block', marginTop: '0.3rem' }}>
              Safe EMI Ceiling: {safeEmiFormatted}/mo
            </span>
          </div>

          <div style={{ marginTop: '1rem', borderTop: `1px solid ${isDontBorrow ? 'var(--color-danger-border)' : 'var(--color-sage-light)'}`, paddingTop: '0.5rem', fontSize: '0.8rem', color: isDontBorrow ? 'var(--color-danger)' : 'var(--color-sage)', fontWeight: 500 }}>
            {isDontBorrow
              ? 'Protecting cash flow from debt overload. No new borrowing recommended.'
              : `Deducts ₹${(affordability?.borrowerSafeBasis?.effectiveLivingCosts || 0).toLocaleString('en-IN')}/mo living expenses & existing debts.`}
          </div>
        </div>

        {/* Card 3: Recommended Amount */}
        <div
          style={{
            background: 'var(--bg-canvas)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                RECOMMENDED
              </span>
              <WhyTrigger onClick={() => setActiveModal('RECOMMENDED')} label="Why?" />
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>
              {isDontBorrow ? '₹0 (Pause Debt)' : recFormatted}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.3rem' }}>
              {isDontBorrow ? 'Avoid taking new debt right now' : `Requested: ₹${(activeProfile.requestedAmount || 0).toLocaleString('en-IN')}`}
            </span>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem', fontSize: '0.78rem', color: 'var(--color-text)' }}>
            {reasonsSummary?.recommendedAmount?.reason || 'Recommended borrowing amount to protect cash flow buffer.'}
          </div>
        </div>
      </div>

      {/* Comparison Table Grid */}
      <div style={{ background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Side-by-Side Comparison Matrix
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textWrap: 'nowrap' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>METRIC</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>LENDER ELIGIBILITY</th>
                <th style={{ padding: '0.6rem 0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>YOUR SAFE BUDGET</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>Loan Amount</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text-muted)' }}>{lenderFormatted}</td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: isDontBorrow ? 'var(--color-danger)' : 'var(--color-primary)' }}>{safeFormatted}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>Monthly EMI Limit</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text-muted)' }}>{lenderEmiFormatted}/mo</td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{safeEmiFormatted}/mo</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>Affordability Metric</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--color-text-muted)' }}>{affordability?.lenderBasis?.foirCapPercent || 50}% Paper FOIR Ceiling</td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>Unencumbered Cashflow Surplus</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '1rem', marginBottom: 0, fontSize: '0.88rem', color: 'var(--color-text)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
          <strong>Summary Rationale:</strong> {summarySentence}
        </p>
      </div>

      {/* Expandable "Why the numbers differ" Accordion */}
      <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem' }}>
        <button
          onClick={() => setIsWhyOpen(!isWhyOpen)}
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-sage)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 0,
          }}
        >
          <span>{isWhyOpen ? '▼' : '►'}</span>
          <span>Why the numbers differ? (Detailed Rule Factor Breakdown)</span>
        </button>

        {isWhyOpen && (
          <div
            style={{
              marginTop: '0.85rem',
              background: 'var(--bg-canvas)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {/* Lender-side Factors */}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
                  Lender-Side Estimate Considers:
                </span>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {lenderFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>

              {/* Borrower-safe Factors */}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
                  Borrower-Safe Estimate Considers:
                </span>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {borrowerFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Why Modals */}
      <WhyModal
        isOpen={activeModal === 'LENDER'}
        onClose={() => setActiveModal(null)}
        title="Lender May Offer Calculation Methodology"
        explanation={affordability?.lenderBasis?.explanation || 'Lenders evaluate eligibility based on Fixed Obligation to Income Ratio (FOIR) caps. Lenders do not deduct household rent, groceries, or dependant expenses from your income.'}
        formula="Lender Max EMI = (Evaluated Monthly Income × FOIR Cap) - Existing EMIs"
        impact="Accepting the maximum bank sanction can strain your monthly household budget because banks ignore daily living costs."
      />

      <WhyModal
        isOpen={activeModal === 'SAFE'}
        onClose={() => setActiveModal(null)}
        title="Borrower-Safe Capacity Methodology"
        explanation={affordability?.borrowerSafeBasis?.explanation || 'Borrower Copilot calculates safe capacity by deducting essential living expenses and existing debt obligations from your net income, then capping your new EMI at 40% of remaining unencumbered cash surplus.'}
        formula="Safe EMI Ceiling = Min(Net Income × 30%, Disposable Cash Surplus × 40%)"
        impact="Following this safe capacity ensures you can pay your loan EMI every month comfortably while preserving liquid savings for emergencies."
      />

      <WhyModal
        isOpen={activeModal === 'RECOMMENDED'}
        onClose={() => setActiveModal(null)}
        title="Recommended Borrowing Amount Methodology"
        explanation={reasonsSummary?.recommendedAmount?.explanation || 'The recommended amount represents the optimal principal that fits within your safe monthly cash flow without creating financial stress.'}
        formula="Recommended Principal = Min(Requested Amount, PrincipalFromEMI(Safe EMI Ceiling))"
        impact="Prevents over-borrowing while fulfilling your loan objective safely."
      />
    </section>
  );
}
