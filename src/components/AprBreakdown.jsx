import React, { useState } from 'react';
import { formatINR, formatPercent } from '../utils/formatters.js';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function AprBreakdown({ aprResults, fairRateRange }) {
  const [showWhyApr, setShowWhyApr] = useState(false);

  const { nominalRate, allInApr, feeDrag, netDisbursedAmount, totalUpfrontDeduction, breakdown } = aprResults;

  const isFeeDragHigh = feeDrag >= 0.75;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Interest & APR Transparency
          </span>
          <h3>Fair Rate & All-In Effective APR</h3>
        </div>
        <WhyTrigger onClick={() => setShowWhyApr(true)} label="Why APR differs from rate?" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            NOMINAL RATE
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
            {formatPercent(nominalRate)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.3rem' }}>
            Quoted bank rate
          </div>
        </div>

        <div style={{ background: 'var(--color-gold-light)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gold)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-warn)', fontWeight: 700 }}>
            TRUE ALL-IN APR
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
            {formatPercent(allInApr)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-warn)', fontWeight: 600, marginTop: '0.3rem' }}>
            Includes fees + 18% GST
          </div>
        </div>

        <div style={{ background: 'var(--color-sage-light)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            FAIR MARKET BAND
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
            {formatPercent(fairRateRange.minFairRate)} - {formatPercent(fairRateRange.maxFairRate)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', marginTop: '0.3rem' }}>
            Based on CIBIL band
          </div>
        </div>
      </div>

      {/* Upfront Deduction & Net Disbursed Breakdown */}
      <div style={{ background: 'var(--bg-canvas)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
          Upfront Fee Deductions & Bank Disbursal
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Upfront Deductions:</span>
            <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--color-danger)' }}>
              {formatINR(totalUpfrontDeduction)}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Net Disbursed in Bank Account:</span>
            <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--color-primary)' }}>
              {formatINR(netDisbursedAmount)}
            </strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {breakdown.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{item.label} ({item.desc}):</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatINR(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {isFeeDragHigh && (
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-warn)' }}>
          <strong>Fee Drag Warning:</strong> Upfront fees add <strong>+{feeDrag.toFixed(2)}%</strong> effective cost on top of your nominal interest rate. Negotiation can remove this fee.
        </p>
      )}

      <WhyModal
        isOpen={showWhyApr}
        onClose={() => setShowWhyApr(false)}
        title="Understanding All-In APR vs Nominal Interest Rate"
        explanation="The nominal rate is the advertised annual interest percentage. However, banks charge upfront processing fees, documentation costs, and mandatory 18% GST which are deducted before money reaches your account. The All-in APR calculates the true mathematical cost rate on the net cash received."
        formula="APR = Internal Rate of Return (Net Cash Disbursed, Monthly EMI Payments)"
        impact="Always compare loan offers using All-in APR rather than quoted nominal rates to avoid hidden fee traps."
      />
    </div>
  );
}
