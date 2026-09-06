import React, { useState } from 'react';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';
import { formatINR } from '../utils/formatters.js';

export function VerdictBanner({ verdict, requestedAmount, safePrincipal }) {
  const [showWhyModal, setShowWhyModal] = useState(false);

  if (!verdict) return null;

  const formattedRequested = formatINR(requestedAmount, true);
  const formattedSafe = formatINR(safePrincipal, true);

  return (
    <div
      style={{
        background: verdict.bg,
        border: `1.5px solid ${verdict.borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span
            style={{
              display: 'inline-block',
              background: verdict.color,
              color: '#FFFFFF',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}
          >
            {verdict.badgeText}
          </span>

          <h2 style={{ color: verdict.color, fontSize: '2.25rem', margin: '0.1rem 0 0.3rem' }}>
            {verdict.decision === 'BORROW_LESS'
              ? `${formattedSafe} safer for you`
              : verdict.title}
          </h2>

          <p style={{ color: 'var(--color-text)', fontSize: '1rem', fontWeight: 500, margin: 0 }}>
            {verdict.decision === 'BORROW_LESS'
              ? `You asked for ${formattedRequested}. Lenders may offer more, but borrowing ${formattedSafe} protects your cash flow.`
              : verdict.subtitle}
          </p>
        </div>

        <WhyTrigger onClick={() => setShowWhyModal(true)} label="Why?" />
      </div>

      {verdict.reasons && verdict.reasons.length > 0 && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: `1px solid ${verdict.borderColor}`, fontSize: '0.9rem', color: 'var(--color-text)' }}>
          <strong>Primary reason:</strong> {verdict.reasons[0]}
        </div>
      )}

      <WhyModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        title="Why this recommendation?"
        explanation="Copilot evaluates three pillars: 1) Monthly Cashflow Surplus after household expenses, 2) Total Fixed Obligation Ratio (FOIR <= 50-55%), and 3) All-in APR threshold (<24%). Unlike banks that only check paper eligibility, Copilot protects your monthly budget from debt strain."
        formula="Decision = Evaluate(DisposableSurplus > EMI, FOIR <= 50%, APR <= 24%)"
        impact="Following this recommendation prevents lifestyle debt traps and preserves liquid emergency savings."
      />
    </div>
  );
}
