import React, { useState } from 'react';
import { formatINR } from '../utils/formatters.js';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function TenureTradeoff({ tenureTradeoffs, requestedAmount, onSelectTenure }) {
  const [showWhyTenure, setShowWhyTenure] = useState(false);

  if (!tenureTradeoffs || tenureTradeoffs.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Tenure Trade-offs
          </span>
          <h3>Monthly EMI vs. Lifetime Interest Cost</h3>
        </div>
        <WhyTrigger onClick={() => setShowWhyTenure(true)} label="Why tenure matters?" />
      </div>

      <p style={{ marginBottom: '1.25rem', fontSize: '0.92rem' }}>
        Shorter tenures require higher monthly EMIs but save massive amounts of interest. Longer tenures lower monthly EMI but multiply total interest paid to the bank.
      </p>

      {/* Grid Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {tenureTradeoffs.map((item) => (
          <div
            key={item.tenureMonths}
            onClick={() => onSelectTenure && onSelectTenure(item.tenureMonths)}
            style={{
              background: item.isSelected ? 'var(--color-sage-light)' : 'var(--bg-surface-elevated)',
              border: item.isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {item.isSelected && (
              <span
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '12px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase',
                }}
              >
                Selected
              </span>
            )}

            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {item.tenureYears} Years ({item.tenureMonths} mo)
            </div>

            <div style={{ margin: '0.75rem 0' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                Monthly EMI:
              </span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
                {formatINR(item.emi)}
              </strong>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                Total Interest Drag:
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: item.interestMultiplier > 0.5 ? 'var(--color-warn)' : 'var(--color-sage)' }}>
                {formatINR(item.totalInterest)} ({item.interestMultiplier}x principal)
              </span>
            </div>
          </div>
        ))}
      </div>

      <WhyModal
        isOpen={showWhyTenure}
        onClose={() => setShowWhyTenure(false)}
        title="Tenure Trade-off Mathematics"
        explanation="Loan interest compounds monthly on remaining principal balance. Extending loan tenure spreads principal repayment over more months (lowering EMI), but causes interest to accrue over a vastly longer timeframe."
        formula="Total Interest Paid = (Monthly EMI × Tenure Months) - Original Principal"
        impact="Choosing a 3-year tenure over a 5-year tenure can save up to 40% in total interest costs on personal loans."
      />
    </div>
  );
}
