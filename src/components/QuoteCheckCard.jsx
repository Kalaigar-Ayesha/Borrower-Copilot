import React, { useState } from 'react';
import { formatINR, formatPercent } from '../utils/formatters.js';
import { calculateAllInApr } from '../rules/aprEngine.js';

export function QuoteCheckCard({ fairRateRange, defaultAmount, defaultTenure }) {
  const [quotedRate, setQuotedRate] = useState(14.0);
  const [quotedFeePercent, setQuotedFeePercent] = useState(1.75);
  const [quotedAmount, setQuotedAmount] = useState(defaultAmount || 500000);
  const [quotedTenure, setQuotedTenure] = useState(defaultTenure || 36);

  const { minFairRate, maxFairRate } = fairRateRange;

  const isRateAboveFair = quotedRate > maxFairRate;
  const isRateFair = quotedRate >= minFairRate && quotedRate <= maxFairRate;
  const isRateBelowFair = quotedRate < minFairRate;

  // Calculate quoted all-in APR
  const quotedApr = calculateAllInApr({
    principal: quotedAmount,
    nominalRate: quotedRate,
    tenureMonths: quotedTenure,
    processingFeePercent: quotedFeePercent,
  });

  // Calculate target fair all-in APR
  const targetApr = calculateAllInApr({
    principal: quotedAmount,
    nominalRate: minFairRate,
    tenureMonths: quotedTenure,
    processingFeePercent: 0.5,
  });

  const yearlyInterestSavings = (quotedAmount * (Math.max(0, quotedRate - minFairRate) / 100));

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '1.5px solid var(--color-border)' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            BANK OFFER EVALUATION
          </span>
          <h3 style={{ marginTop: '0.2rem' }}>Quote Check: Compare Your Bank's Offer</h3>
          <p style={{ fontSize: '0.88rem' }}>Have a sanction quote from a bank Relationship Manager? Enter the offer terms below to verify if it is fair.</p>
        </div>
      </div>

      {/* Quote Input Form Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-canvas)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
        <div>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>Quoted Nominal Rate (% p.a.)</label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            value={quotedRate}
            onChange={(e) => setQuotedRate(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>Quoted Processing Fee (%)</label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            value={quotedFeePercent}
            onChange={(e) => setQuotedFeePercent(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>Quoted Loan Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            value={quotedAmount}
            onChange={(e) => setQuotedAmount(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.85rem' }}>Tenure (Months)</label>
          <select
            className="form-select"
            value={quotedTenure}
            onChange={(e) => setQuotedTenure(parseInt(e.target.value, 10))}
          >
            <option value={12}>12 Months (1 yr)</option>
            <option value={24}>24 Months (2 yrs)</option>
            <option value={36}>36 Months (3 yrs)</option>
            <option value={60}>60 Months (5 yrs)</option>
            <option value={84}>84 Months (7 yrs)</option>
          </select>
        </div>
      </div>

      {/* Comparison Outcome Banner */}
      <div
        style={{
          background: isRateAboveFair ? 'var(--color-warn-light)' : 'var(--color-sage-tint)',
          border: `1px solid ${isRateAboveFair ? 'var(--color-warn-border)' : 'var(--color-sage-light)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              COPILOT EVALUATION RESULT:
            </span>
            <h4 style={{ fontSize: '1.25rem', color: isRateAboveFair ? 'var(--color-warn)' : 'var(--color-primary)', marginTop: '0.2rem' }}>
              {isRateAboveFair && 'Quoted Rate is Above Your Estimated Fair Range'}
              {isRateFair && 'Quoted Rate is Within Your Estimated Fair Range'}
              {isRateBelowFair && 'Exceptional Deal (Below Fair Market Average)'}
            </h4>
          </div>

          <span
            style={{
              background: isRateAboveFair ? 'var(--color-warn)' : 'var(--color-primary)',
              color: '#FFFFFF',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {isRateAboveFair ? 'Overpriced Quote' : 'Fair Quote'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Estimated Fair Rate Band:</span>
            <strong style={{ fontSize: '1.1rem', display: 'block', color: 'var(--color-primary)' }}>
              {formatPercent(minFairRate)} – {formatPercent(maxFairRate)}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Quoted All-In APR:</span>
            <strong style={{ fontSize: '1.1rem', display: 'block', color: isRateAboveFair ? 'var(--color-warn)' : 'var(--color-primary)' }}>
              {formatPercent(quotedApr.allInApr)}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>(Includes fee + 18% GST)</span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Potential Annual Savings:</span>
            <strong style={{ fontSize: '1.1rem', display: 'block', color: 'var(--color-primary)' }}>
              {formatINR(yearlyInterestSavings)}/yr
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-sage)', fontWeight: 600 }}>If negotiated to {minFairRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
