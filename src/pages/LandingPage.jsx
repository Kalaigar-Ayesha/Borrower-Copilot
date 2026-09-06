import React from 'react';

export function LandingPage({ onStartAssessment, onLoadPreset }) {
  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Streamlined Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
        <h1 style={{ fontSize: '3rem', lineHeight: '1.15', marginBottom: '1rem', color: 'var(--color-primary)' }}>
          Borrower Copilot
        </h1>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 500, color: 'var(--color-primary)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
          Know what you can afford before you borrow.
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '2rem' }}>
          Estimate a safer loan amount, fair rate and EMI before talking to a lender.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-primary btn-lg" onClick={onStartAssessment}>
            Start assessment &rarr;
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            No login. No bureau pull. No data stored.
          </span>
        </div>
      </div>

      {/* Preset Personas Section */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.75rem', marginBottom: '3.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Explore Borrower Scenarios</h3>
          <p style={{ fontSize: '0.88rem' }}>Select a borrower profile below to see instant Copilot evaluations.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => onLoadPreset('SALARIED_SAFE')}
            style={{
              background: 'var(--color-sage-tint)',
              border: '1px solid var(--color-sage-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Priya Persona
            </span>
            <strong style={{ fontSize: '1rem', color: 'var(--color-primary)', display: 'block' }}>
              Safe Salaried Corporate
            </strong>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Income ₹1.2L/mo • Personal loan ₹3L • CIBIL 780
            </span>
          </div>

          <div
            onClick={() => onLoadPreset('SELF_EMPLOYED_BUSINESS')}
            style={{
              background: 'var(--color-warn-light)',
              border: '1px solid var(--color-warn-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warn)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Ravi Persona
            </span>
            <strong style={{ fontSize: '1rem', color: 'var(--color-warn)', display: 'block' }}>
              Productive Business LAP
            </strong>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Self-employed • ₹45L Property Collateral • Business loan ₹15L
            </span>
          </div>

          <div
            onClick={() => onLoadPreset('INFORMAL_GIG_RISK')}
            style={{
              background: 'var(--color-danger-light)',
              border: '1px solid var(--color-danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Anita Persona
            </span>
            <strong style={{ fontSize: '1rem', color: 'var(--color-danger)', display: 'block' }}>
              High-Risk Informal Debt
            </strong>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Gig worker • BNPL debt • Payment bounce history
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
