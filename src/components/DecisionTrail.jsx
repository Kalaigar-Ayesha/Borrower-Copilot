import React from 'react';

export function DecisionTrail({ profile, affordability, verdict, confidence }) {
  if (!profile || !verdict || !affordability || !affordability.routing) return null;

  const steps = [
    {
      num: 1,
      title: 'Your Inputs',
      desc: `${profile.incomeType} • Net Income ₹${(profile.netMonthlyIncome || 0).toLocaleString('en-IN')}/mo • Requested ₹${(profile.requestedAmount || 0).toLocaleString('en-IN')}`,
    },
    {
      num: 2,
      title: 'Financial Profile',
      desc: `Evaluated ${affordability.routing.productName} • CIBIL Band: ${profile.cibilTierKey}`,
    },
    {
      num: 3,
      title: 'Affordability Evaluation',
      desc: `Lender FOIR Cap: ${affordability.lenderBasis.foirCapPercent}% • Borrower Safe EMI Ceiling: ₹${(affordability.borrowerSafeBasis.safeMonthlyEmiCeiling || 0).toLocaleString('en-IN')}/mo`,
    },
    {
      num: 4,
      title: 'Risk Factors & Shocks',
      desc: `Emergency Cushion: ${profile.emergencySavingsMonths || 0} mo • High-Cost Debt: ${profile.hasHighCostDebt ? 'Yes (Risk)' : 'No'}`,
    },
    {
      num: 5,
      title: 'Final Copilot Recommendation',
      desc: `${verdict.badgeText} (${verdict.title})`,
      highlight: true,
      color: verdict.color,
    },
  ];

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '1.5px solid var(--color-border)' }}>
      <div className="card-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            DECISION BREAKDOWN
          </span>
          <h3 style={{ marginTop: '0.2rem' }}>Decision Trail: How We Calculated Your Result</h3>
          <p style={{ fontSize: '0.88rem' }}>Trace how your raw inputs passed through our financial rules to form your objective borrowing verdict.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', position: 'relative' }}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              background: step.highlight ? 'var(--color-sage-light)' : 'var(--bg-canvas)',
              border: step.highlight ? `2px solid ${step.color}` : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.1rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: step.highlight ? step.color : 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.num}
              </span>
              <strong style={{ fontSize: '0.88rem', color: step.highlight ? step.color : 'var(--color-primary)' }}>
                {step.title}
              </strong>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text)', lineHeight: '1.4', margin: 0 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
