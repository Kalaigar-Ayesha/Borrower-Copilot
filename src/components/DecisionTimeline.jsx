import React, { useState } from 'react';
import { getDecisionFactors } from '../rules/decisionFactors.js';
import { calculateAssessment } from '../rules/assessment.js';
import { formatINR } from '../utils/formatters.js';

export function DecisionTimeline({ results, profile }) {
  const activeProfile = profile || {};
  const { decision, headline, subtitle, factors } = getDecisionFactors(activeProfile, results);

  const [openDetailId, setOpenDetailId] = useState(null);

  // Interactive "What Would Change?" Simulator State
  const initialEmi = activeProfile.existingMonthlyEmis || 0;
  const initialSavings = activeProfile.emergencySavingsMonths || 0;
  const initialRequested = activeProfile.requestedAmount || 500000;

  const [simEmi, setSimEmi] = useState(initialEmi);
  const [simSavings, setSimSavings] = useState(initialSavings);
  const [simRequested, setSimRequested] = useState(initialRequested);

  if (!factors || factors.length === 0) return null;

  // Run lightweight real-time simulation using pure JS rule engine
  const simBorrower = {
    ...activeProfile,
    existingMonthlyEmis: simEmi,
    emergencySavingsMonths: simSavings,
    requestedAmount: simRequested,
    hasHighCostDebt: simEmi < initialEmi ? false : activeProfile.hasHighCostDebt,
  };

  const simResult = calculateAssessment(simBorrower);
  const isSimChanged = simEmi !== initialEmi || simSavings !== initialSavings || simRequested !== initialRequested;

  const isDontBorrow = decision === 'DONT_BORROW';
  const isBorrowLess = decision === 'BORROW_LESS';

  return (
    <section className="card" style={{ marginBottom: '2rem', border: '1.5px solid var(--color-border)', padding: '1.75rem' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1rem' }}>
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
          DECISION TIMELINE & NEXT STEPS
        </span>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
          {headline}
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', marginBottom: 0 }}>
          {subtitle}
        </p>
      </div>

      {/* Vertical Timeline Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {factors.map((item) => {
          const isDetailExpanded = openDetailId === item.id;
          return (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-canvas)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Step Counter Badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.1rem',
                }}
              >
                {item.stepNumber}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary)', margin: 0 }}>
                    {item.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--color-sage)',
                      background: 'var(--color-sage-tint)',
                      border: '1px solid var(--color-sage-light)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-pill)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Step {item.stepNumber}
                  </span>
                </div>

                {/* State -> Improvement -> Impact Flow */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginTop: '0.75rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                      Current Situation:
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: 500 }}>
                      {item.currentState}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                      Potential Improvement:
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {item.potentialImprovement}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                      Potential Impact:
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {item.affectedOutput}
                    </span>
                  </div>
                </div>

                {/* Expandable Details Accordion */}
                <div style={{ marginTop: '0.75rem' }}>
                  <button
                    onClick={() => setOpenDetailId(isDetailExpanded ? null : item.id)}
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-sage)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: 0,
                    }}
                  >
                    <span>{isDetailExpanded ? '▼' : '►'}</span>
                    <span>Why this step matters?</span>
                  </button>

                  {isDetailExpanded && (
                    <div style={{ background: 'var(--color-sage-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage)', marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', margin: 0, lineHeight: '1.45' }}>
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive "What Would Change?" Lightweight Simulator */}
      {(isDontBorrow || isBorrowLess) && (
        <div style={{ background: 'var(--color-sage-tint)', border: '1.5px solid var(--color-sage-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                INTERACTIVE SIMULATOR
              </span>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: '0.1rem 0 0' }}>
                What Would Change My Decision?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Adjust key financial factors below to see how reducing debt or adjusting loan size recalculates your safe capacity.
              </p>
            </div>

            {isSimChanged && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSimEmi(initialEmi);
                  setSimSavings(initialSavings);
                  setSimRequested(initialRequested);
                }}
              >
                Reset Controls
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Slider 1: Existing EMI */}
            {initialEmi > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Existing Monthly EMI:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{formatINR(simEmi)}/mo</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={initialEmi}
                  step={1000}
                  value={simEmi}
                  onChange={(e) => setSimEmi(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
              </div>
            )}

            {/* Slider 2: Emergency Fund Months */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Emergency Fund Cushion:</span>
                <strong style={{ color: 'var(--color-primary)' }}>{simSavings} Months</strong>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={simSavings}
                onChange={(e) => setSimSavings(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Slider 3: Requested Loan Amount */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Simulated Loan Target:</span>
                <strong style={{ color: 'var(--color-primary)' }}>{formatINR(simRequested)}</strong>
              </div>
              <input
                type="range"
                min={50000}
                max={initialRequested * 1.5}
                step={25000}
                value={simRequested}
                onChange={(e) => setSimRequested(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Recalculated Verdict Outcome */}
          <div style={{ background: 'var(--bg-canvas)', padding: '1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                RECALCULATED COPILOT EVALUATION:
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: simResult.verdict.color, marginTop: '0.15rem' }}>
                {simResult.verdict.title}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0' }}>
                {simResult.verdict.primaryReason}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Recalculated Safe Capacity:
              </span>
              <strong style={{ fontSize: '1.35rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
                {simResult.safeRange ? simResult.safeRange.formatted : formatINR(simResult.borrowerSafe.safePrincipal)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
