import React, { useState } from 'react';
import { formatINR } from '../utils/formatters.js';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function StressScenario({ stressScenarios }) {
  const [showWhyStress, setShowWhyStress] = useState(false);

  if (!stressScenarios) return null;

  const { resilienceTitle, resilienceColor, resilienceBg, scenarios, passedCount, totalScenarios } = stressScenarios;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Stress Testing
          </span>
          <h3>Economic Shock Resilience Simulation</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              background: resilienceBg,
              color: resilienceColor,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: `1px solid ${resilienceColor}`,
            }}
          >
            {resilienceTitle} ({passedCount}/{totalScenarios} Passed)
          </span>
          <WhyTrigger onClick={() => setShowWhyStress(true)} label="Why stress test?" />
        </div>
      </div>

      <p style={{ marginBottom: '1.25rem', fontSize: '0.92rem' }}>
        We subject your post-loan cash flow to three severe real-world financial shocks to test if you would be forced into default or high-interest credit card debt.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            style={{
              background: sc.passed ? 'var(--color-sage-tint)' : 'var(--color-danger-light)',
              border: `1px solid ${sc.passed ? 'var(--color-sage-light)' : 'var(--color-danger-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: sc.passed ? 'var(--color-primary)' : 'var(--color-danger)', textTransform: 'uppercase' }}>
                {sc.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <h4 style={{ fontSize: '0.98rem', color: sc.passed ? 'var(--color-primary)' : 'var(--color-danger)', marginBottom: '0.35rem' }}>
              {sc.name}
            </h4>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              {sc.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                Post-Shock Surplus:
              </span>
              <strong style={{ fontSize: '1.05rem', color: sc.surplusAfterShock >= 0 ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                {formatINR(sc.surplusAfterShock)}/mo
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text)', marginTop: '0.35rem' }}>
                {sc.impactSummary}
              </p>
            </div>
          </div>
        ))}
      </div>

      <WhyModal
        isOpen={showWhyStress}
        onClose={() => setShowWhyStress(false)}
        title="Why Perform Financial Stress Testing?"
        explanation="Loan commitments in India span 3 to 20 years. Over such durations, personal financial shocks (job transitions, medical emergencies) and macroeconomic shocks (RBI rate hikes) are almost guaranteed. Testing resilience ensures your loan won't break your budget when unexpected life events happen."
        formula="Resilience = Count(Surplus(NetIncome - Shock, EssentialExpenses + Emergency, Debt + StrainedEMI) >= 0)"
        impact="Passing 3/3 stress tests guarantees peace of mind and prevents default."
      />
    </div>
  );
}
