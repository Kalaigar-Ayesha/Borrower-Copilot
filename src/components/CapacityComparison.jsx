import React, { useState } from 'react';
import { formatINR } from '../utils/formatters.js';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function CapacityComparison({ lenderSanction, borrowerSafe, requestedAmount, safeRange, sanctionRange }) {
  const [showWhySanction, setShowWhySanction] = useState(false);
  const [showWhySafe, setShowWhySafe] = useState(false);

  const bankAmount = lenderSanction.sanctionedPrincipal;
  const safeAmount = borrowerSafe.safePrincipal;
  const gap = bankAmount - safeAmount;

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '1.5px solid var(--color-border)' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Capacity Comparison
          </span>
          <h3 style={{ marginTop: '0.2rem' }}>Borrower-Safe Capacity vs. Lender Sanction</h3>
          <p style={{ fontSize: '0.88rem' }}>Lenders calculate what they can legally sell you. Copilot calculates what your budget can safely carry.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
        {/* Borrower Safe Capacity Card (VISUALLY DOMINANT PRIMARY CARD) */}
        <div
          style={{
            background: 'var(--color-sage-tint)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-12px',
              left: '1.25rem',
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ★ PRIMARY RECOMMENDATION: SAFE CAPACITY
          </span>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              BORROWER-SAFE RANGE
            </span>
            <WhyTrigger onClick={() => setShowWhySafe(true)} label="Why this safe amount?" />
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', margin: '0.2rem 0' }}>
            {safeRange ? safeRange.formatted : formatINR(safeAmount)}
          </div>

          <div style={{ fontSize: '0.92rem', color: 'var(--color-primary-light)', fontWeight: 600, marginTop: '0.4rem' }}>
            Recommended EMI Ceiling: <strong>{formatINR(borrowerSafe.safeEmiCeiling)}/mo</strong>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--color-sage)', marginTop: '1rem', borderTop: '1px solid var(--color-sage-light)', paddingTop: '0.6rem' }}>
            ✓ Protects ₹{formatINR(borrowerSafe.disposableSurplus)} monthly disposable surplus after living costs (₹{formatINR(borrowerSafe.effectiveLivingCosts)}/mo).
          </div>
        </div>

        {/* Lender Sanction Card (SECONDARY MUTED CARD) */}
        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            opacity: 0.9,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              LENDER-LIKELY SANCTION (BANK MAX)
            </span>
            <WhyTrigger onClick={() => setShowWhySanction(true)} label="Why bank limit?" />
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--color-text-muted)' }}>
            {sanctionRange ? sanctionRange.formatted : formatINR(bankAmount)}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
            Max Bank EMI Cap: <strong>{formatINR(lenderSanction.bankCapacityEmi)}/mo</strong>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.6rem' }}>
            Calculated at {lenderSanction.applicableFoirPercent}% FOIR limit without deducting your household expenses.
          </div>
        </div>
      </div>

      {gap > 50000 && (
        <div style={{ marginTop: '1.25rem', background: 'var(--color-warn-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-warn-border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ fontSize: '1.25rem', color: 'var(--color-warn)' }}>⚠️</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>
            <strong>Bank Over-Sanction Warning:</strong> Banks are willing to lend you up to <strong>{formatINR(gap)}</strong> more than your safe capacity. Do not accept the maximum bank sanction; stick to your borrower-safe range.
          </div>
        </div>
      )}

      {/* Why Modals */}
      <WhyModal
        isOpen={showWhySanction}
        onClose={() => setShowWhySanction(false)}
        title="Lender Sanction Range Methodology"
        explanation="Banks evaluate your eligibility using a Fixed Obligation to Income Ratio (FOIR). Private and PSU banks in India allow existing + new EMIs to consume up to 50-55% of your net monthly income. Lenders do not factor in your household rent, groceries, or family expenses."
        formula="Max Bank EMI = (Evaluated Monthly Income × 50-55% FOIR) - Existing EMIs"
        impact="Banks profit from interest, so their limit is set to the absolute maximum paper limit before default. It does not account for comfortable living."
      />

      <WhyModal
        isOpen={showWhySafe}
        onClose={() => setShowWhySafe(false)}
        title="Why This Borrower-Safe Amount?"
        explanation="Borrower Copilot calculates your safe limit by starting with your Net Income, deducting essential household expenses (rent, utilities, groceries, tuition), and preserving a cashflow buffer. We cap your recommended EMI at 30% of net income or 40% of unencumbered cash surplus."
        formula="Safe EMI Ceiling = Min(Net Income × 30%, Unencumbered Cash Surplus × 40%)"
        impact="Following this safe limit ensures you can pay your loan EMI comfortably every month without resorting to credit cards or borrowing for daily living costs."
      />
    </div>
  );
}
