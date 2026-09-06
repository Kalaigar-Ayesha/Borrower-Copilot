import React, { useState } from 'react';
import { formatINR } from '../utils/formatters.js';

export function NegotiationCard({ negotiationCard }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!negotiationCard) return null;

  const {
    loanLabel,
    cibilLabel,
    quotedRate,
    targetRate,
    quotedFeeWithGst,
    targetFeeWithGst,
    potentialRateSavingsPercent,
    yearlyInterestSavings,
    potentialFeeSavings,
    totalPotentialSavings,
    scripts,
    leveragePoints,
  } = negotiationCard;

  const copyScript = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--color-primary)' }}>
      <div className="card-header" style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', background: 'var(--color-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Actionable Bank Artifact
          </span>
          <h3 style={{ marginTop: '0.4rem', fontSize: '1.45rem' }}>Bank Negotiation Battlecard</h3>
          <p style={{ fontSize: '0.88rem' }}>Take these verbatim scripts and target benchmarks to your bank Relationship Manager (RM).</p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          🖨️ Print / Save Card
        </button>
      </div>

      {/* Target Savings Banner */}
      <div style={{ background: 'var(--color-gold-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gold)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-warn)', fontWeight: 600 }}>TARGET INTEREST RATE</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {targetRate.toFixed(2)}% <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(vs {quotedRate.toFixed(2)}% quoted)</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-sage)', fontWeight: 600 }}>
            Saves ~{formatINR(yearlyInterestSavings)}/year
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-warn)', fontWeight: 600 }}>TARGET PROCESSING FEE</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(targetFeeWithGst)} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(incl. 18% GST)</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-sage)', fontWeight: 600 }}>
            Upfront Fee Savings: {formatINR(potentialFeeSavings)}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>ESTIMATED TOTAL SAVINGS</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(totalPotentialSavings)}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Over typical 3-yr tenure</span>
        </div>
      </div>

      {/* Verbatim Scripts */}
      <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Verbatim Negotiation Scripts for Relationship Manager
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {scripts.map((item, idx) => (
          <div key={idx} style={{ background: 'var(--bg-canvas)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>{item.title}</strong>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-sage)' }}>{item.goal}</span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-border)', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: '1.5', margin: '0.5rem 0' }}>
              {item.script}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => copyScript(item.script, idx)}
                style={{ fontSize: '0.8rem' }}
              >
                {copiedIndex === idx ? '✓ Copied Script' : '📋 Copy Script Text'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Leverage Points */}
      <div style={{ background: 'var(--color-sage-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage)' }}>
        <h4 style={{ fontSize: '0.88rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
          Your Key Leverage Points in India
        </h4>
        <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {leveragePoints.map((pt, i) => (
            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)' }}>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
