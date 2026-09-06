import React, { useState } from 'react';
import { formatINR, formatPercent } from '../utils/formatters.js';

export function NegotiationCard({ negotiationCard }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!negotiationCard) return null;

  const {
    requestedAmount,
    targetRate,
    quotedRate,
    quotedFeeWithGst,
    targetFeeWithGst,
    potentialFeeSavings,
    yearlyInterestSavings,
    scripts,
  } = negotiationCard;

  const copyScript = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--color-primary)' }}>
      <div className="card-header" style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', background: 'var(--color-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BORROWER CARD
          </span>
          <h3 style={{ marginTop: '0.3rem', fontSize: '1.35rem' }}>Bank Negotiation Card</h3>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          Print / Share Card
        </button>
      </div>

      {/* Grid Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', background: 'var(--bg-canvas)', padding: '1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Requested</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(requestedAmount, true)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>Safer amount</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(negotiationCard.borrowerSafeAmount || requestedAmount, true)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Fair rate</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {targetRate ? `${targetRate.toFixed(1)}%` : '11–12.5%'}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Lender quote</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warn)', fontFamily: 'var(--font-serif)' }}>
            {quotedRate ? `${quotedRate.toFixed(1)}%` : '14%'}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Estimated APR</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {targetRate ? `${(targetRate + 0.8).toFixed(1)}%` : '12.8%'}
          </div>
        </div>
      </div>

      {/* Rationale & Ask Lender */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div style={{ background: 'var(--color-sage-tint)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage-light)' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
            Why this target?
          </strong>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', margin: 0, lineHeight: 1.4 }}>
            Solid income and repayment profile support rate negotiation. Target fee waiver saves ~{formatINR(potentialFeeSavings || 4500)} upfront.
          </p>
        </div>

        <div style={{ background: 'var(--color-gold-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gold)' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--color-warn)', display: 'block', marginBottom: '0.35rem' }}>
            ASK THE LENDER
          </strong>
          <ul style={{ paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '0.2rem', margin: 0 }}>
            <li>• Can you offer a rate within my fair range ({targetRate || 11.5}%)?</li>
            <li>• What is the true all-in APR including processing fee + 18% GST?</li>
            <li>• What processing fee waiver can you apply today?</li>
            <li>• Are there foreclosure or part-prepayment charges after 6 EMIs?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
