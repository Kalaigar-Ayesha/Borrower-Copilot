import React, { useState } from 'react';
import { formatINR } from '../utils/formatters.js';
import { calculateEMI } from '../rules/financialCalculations.js';

export function InteractiveStressTest({ netMonthlyIncome, essentialLivingCosts, existingEmis, proposedEmi, principal, interestRate, tenureMonths }) {
  const [incomeShockPercent, setIncomeShockPercent] = useState(20); // 20%
  const [rateHikeBps, setRateHikeBps] = useState(2.0); // +2.0%

  // Stressed Income
  const stressedIncome = netMonthlyIncome * (1 - (incomeShockPercent / 100));

  // Stressed EMI under Rate Spike
  const stressedRate = interestRate + rateHikeBps;
  const stressedEmi = calculateEMI(principal, stressedRate, tenureMonths);

  // Stressed Cash Surplus
  const stressedSurplus = stressedIncome - essentialLivingCosts - existingEmis - stressedEmi;

  const isResilient = stressedSurplus >= 0;

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '1.5px solid var(--color-border)' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            FEATURE 3: Interactive Economic Shock Simulator
          </span>
          <h3 style={{ marginTop: '0.2rem' }}>Interactive Stress Test</h3>
          <p style={{ fontSize: '0.88rem' }}>Simulate real-world financial shocks (salary cuts or RBI rate tightening) to test your cash flow survival buffer.</p>
        </div>

        <span
          style={{
            background: isResilient ? 'var(--color-sage-light)' : 'var(--color-danger-light)',
            color: isResilient ? 'var(--color-primary)' : 'var(--color-danger)',
            border: `1px solid ${isResilient ? 'var(--color-sage)' : 'var(--color-danger-border)'}`,
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
        >
          {isResilient ? '✓ RESILIENT UNDER SHOCK' : '⚠️ CASHFLOW DEFICIT'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Slider 1: Income Reduction */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <span>Income Shock Reduction:</span>
            <strong style={{ color: 'var(--color-warn)' }}>-{incomeShockPercent}%</strong>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            step={5}
            value={incomeShockPercent}
            onChange={(e) => setIncomeShockPercent(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-warn)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Stressed Monthly Salary: {formatINR(stressedIncome)}
          </span>
        </div>

        {/* Slider 2: Interest Rate Spike */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <span>RBI Interest Rate Hike:</span>
            <strong style={{ color: 'var(--color-warn)' }}>+{rateHikeBps.toFixed(1)}% p.a.</strong>
          </div>
          <input
            type="range"
            min={0}
            max={5.0}
            step={0.5}
            value={rateHikeBps}
            onChange={(e) => setRateHikeBps(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-warn)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Stressed Rate: {stressedRate.toFixed(2)}% (Stressed EMI: {formatINR(stressedEmi)}/mo)
          </span>
        </div>
      </div>

      {/* Recalculated Surplus Box */}
      <div style={{ background: isResilient ? 'var(--color-sage-tint)' : 'var(--color-danger-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: `1px solid ${isResilient ? 'var(--color-sage-light)' : 'var(--color-danger-border)'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isResilient ? 'var(--color-primary)' : 'var(--color-danger)', textTransform: 'uppercase' }}>
              STRESSED MONTHLY CASH SURPLUS AFTER SHOCK:
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: isResilient ? 'var(--color-primary)' : 'var(--color-danger)', fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
              {formatINR(stressedSurplus)}/month
            </div>
          </div>

          <div style={{ maxWidth: '420px', fontSize: '0.88rem', color: 'var(--color-text)' }}>
            {isResilient
              ? `✓ Your budget maintains a positive buffer of ${formatINR(stressedSurplus)}/mo even under a -${incomeShockPercent}% income reduction and +${rateHikeBps}% rate hike.`
              : `⚠️ Under a -${incomeShockPercent}% income drop and +${rateHikeBps}% rate spike, your cash flow incurs a deficit of ${formatINR(Math.abs(stressedSurplus))}/mo. Consider trimming your loan size.`}
          </div>
        </div>
      </div>
    </div>
  );
}
