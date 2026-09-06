import React, { useState } from 'react';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function VerdictBanner({ verdict, requestedAmount, safePrincipal }) {
  const [showWhyModal, setShowWhyModal] = useState(false);

  if (!verdict) return null;

  return (
    <div
      style={{
        background: verdict.bg,
        border: `1.5px solid ${verdict.borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <span
            style={{
              display: 'inline-block',
              background: verdict.color,
              color: '#FFFFFF',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            {verdict.badgeText}
          </span>
          <h2 style={{ color: verdict.color, fontSize: '2.1rem', margin: '0.2rem 0' }}>
            {verdict.title}
          </h2>
          <p style={{ color: 'var(--color-text)', fontSize: '1.05rem', fontWeight: 500, maxWidth: '680px' }}>
            {verdict.subtitle}
          </p>
        </div>

        <WhyTrigger onClick={() => setShowWhyModal(true)} label="Why this verdict?" />
      </div>

      <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${verdict.borderColor}` }}>
        <div>
          <h4 style={{ color: verdict.color, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Core Decision Drivers
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.2rem', color: 'var(--color-text)' }}>
            {verdict.reasons.map((r, i) => (
              <li key={i} style={{ fontSize: '0.92rem', lineHeight: '1.5' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: verdict.color, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Action Plan for You
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.2rem', color: 'var(--color-text)' }}>
            {verdict.actionPlan.map((action, i) => (
              <li key={i} style={{ fontSize: '0.92rem', lineHeight: '1.5', fontWeight: 500 }}>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <WhyModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        title="How the Copilot Verdict is Determined"
        explanation="Our recommendation engine evaluates three financial pillars: 1) Cashflow Surplus Resilience after essential living costs, 2) Total Fixed Obligation to Income Ratio (FOIR <= 50%), and 3) All-in APR threshold (<24%). Lenders only care if you can pay the loan today; Copilot protects your budget against default risk tomorrow."
        formula="Verdict = Evaluate(SurplusAfterEMI > 0, FOIR <= 50%, Requested <= SafeCapacity, APR <= 24%)"
        impact="Using this objective framework prevents debt overhang, preserves credit score stability, and keeps emergency savings intact."
      />
    </div>
  );
}
