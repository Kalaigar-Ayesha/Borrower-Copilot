import React, { useState } from 'react';
import { formatINR, formatPercent } from '../utils/formatters.js';
import { calculateEMI } from '../rules/financialCalculations.js';

export function WhatIfSimulator({ safeEmiCeiling, defaultAmount = 500000, defaultTenure = 36, defaultRate = 11.5 }) {
  const [simAmount, setSimAmount] = useState(defaultAmount);
  const [simTenure, setSimTenure] = useState(defaultTenure);
  const [simRate, setSimRate] = useState(defaultRate);

  const emi = calculateEMI(simAmount, simRate, simTenure);
  const totalRepayment = emi * simTenure;
  const totalInterest = Math.max(0, totalRepayment - simAmount);

  const isSafe = emi <= safeEmiCeiling && safeEmiCeiling > 0;
  const surplusExceeded = Math.max(0, emi - safeEmiCeiling);

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '1.5px solid var(--color-border)' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            INTERACTIVE LOAN SIMULATOR
          </span>
          <h3 style={{ marginTop: '0.2rem' }}>What-If Simulator</h3>
          <p style={{ fontSize: '0.88rem' }}>Adjust loan parameters in real-time to see instant impacts on monthly EMI, total interest, and budget safety.</p>
        </div>

        <span
          style={{
            background: isSafe ? 'var(--color-sage-light)' : 'var(--color-danger-light)',
            color: isSafe ? 'var(--color-primary)' : 'var(--color-danger)',
            border: `1px solid ${isSafe ? 'var(--color-sage)' : 'var(--color-danger-border)'}`,
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        >
          {isSafe ? 'SAFE FOR BUDGET' : 'EXCEEDS SAFE CEILING'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Slider 1: Loan Amount */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <span>Loan Amount:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{formatINR(simAmount)}</strong>
          </div>
          <input
            type="range"
            min={50000}
            max={2500000}
            step={25000}
            value={simAmount}
            onChange={(e) => setSimAmount(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
        </div>

        {/* Slider 2: Tenure */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <span>Tenure:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{(simTenure / 12).toFixed(1)} Years ({simTenure} mo)</strong>
          </div>
          <input
            type="range"
            min={12}
            max={120}
            step={12}
            value={simTenure}
            onChange={(e) => setSimTenure(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
        </div>

        {/* Slider 3: Interest Rate */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <span>Interest Rate:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{formatPercent(simRate)}</strong>
          </div>
          <input
            type="range"
            min={8.0}
            max={22.0}
            step={0.25}
            value={simRate}
            onChange={(e) => setSimRate(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Recalculated Output Metrics */}
      <div style={{ background: 'var(--bg-canvas)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: '1rem', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SIMULATED EMI</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(emi)}/mo
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TOTAL INTEREST</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warn)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(totalInterest)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TOTAL REPAYMENT</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {formatINR(totalRepayment)}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SAFE EMI CEILING</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatINR(safeEmiCeiling)}/mo
          </div>
          <span style={{ fontSize: '0.78rem', color: isSafe ? 'var(--color-sage)' : 'var(--color-danger)', fontWeight: 600 }}>
            {isSafe ? 'Within budget' : `Exceeds ceiling by ${formatINR(surplusExceeded)}/mo`}
          </span>
        </div>
      </div>
    </div>
  );
}
