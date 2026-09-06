import React from 'react';
import { formatINR } from '../utils/formatters.js';

export function LandingPage({ onStartAssessment, onLoadPreset }) {
  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 4rem' }}>
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-sage)',
            background: 'var(--color-sage-light)',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '1.25rem',
          }}
        >
          INDEPENDENT FINANCIAL DECISION SUPPORT FOR INDIA
        </span>

        <h1 style={{ fontSize: '3.25rem', lineHeight: '1.15', marginBottom: '1.25rem' }}>
          Know if you should borrow <br />
          <span style={{ color: 'var(--color-sage)', fontStyle: 'italic' }}>before</span> the bank sanctions your loan.
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '2.25rem' }}>
          Indian banks calculate what they can legally lend you. Borrower Copilot calculates what your monthly budget can safely afford without breaking your emergency cushion.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onStartAssessment}>
            Start Free Assessment &rarr;
          </button>
        </div>
      </div>

      {/* Demo Preset Profiles Section */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', marginBottom: '4rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Interactive Demo
          </span>
          <h3 style={{ marginTop: '0.2rem' }}>Explore Pre-loaded Borrower Scenarios</h3>
          <p style={{ fontSize: '0.9rem' }}>Select a borrower profile below to see how Copilot distinguishes safe capacity from bank sanction limits.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div
            onClick={() => onLoadPreset('SALARIED_SAFE')}
            style={{
              background: 'var(--color-sage-tint)',
              border: '1px solid var(--color-sage-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              ✓ Salaried Persona
            </span>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary)', margin: '0.3rem 0' }}>
              Safe Salaried Corporate
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Income ₹1.2 Lakh/mo • Personal loan ₹3 Lakhs • 6 mo savings.
            </p>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
              Outcome: BORROW SAFELY &rarr;
            </strong>
          </div>

          <div
            onClick={() => onLoadPreset('SELF_EMPLOYED_BUSINESS')}
            style={{
              background: 'var(--color-warn-light)',
              border: '1px solid var(--color-warn-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warn)', textTransform: 'uppercase' }}>
              💼 Self-Employed Persona
            </span>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-warn)', margin: '0.3rem 0' }}>
              Productive Business Loan
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Business income ₹1.6 Lakh/mo • Property collateral • Equipment ROI boost.
            </p>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-warn)' }}>
              Outcome: BORROW PRODUCTIVELY &rarr;
            </strong>
          </div>

          <div
            onClick={() => onLoadPreset('INFORMAL_GIG_RISK')}
            style={{
              background: 'var(--color-danger-light)',
              border: '1px solid var(--color-danger-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase' }}>
              🛑 Gig Worker Persona
            </span>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-danger)', margin: '0.3rem 0' }}>
              High-Cost Informal Debt Risk
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Unpredictable gig income • BNPL debt • Payment bounce history.
            </p>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-danger)' }}>
              Outcome: DO NOT BORROW &rarr;
            </strong>
          </div>
        </div>
      </div>

      {/* Product Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--color-sage-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '1rem' }}>
            1
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Lender vs Borrower Safe</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Banks use 50-55% FOIR rules to maximize loan size. We protect your monthly net cash flow and living expenses first.
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--color-sage-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '1rem' }}>
            2
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>All-In APR Transparency</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Don't get tricked by nominal interest rates. We calculate your true effective APR factoring in processing fees, documentation charges, and 18% GST.
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--color-sage-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '1rem' }}>
            3
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Bank Negotiation Card</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Get a tailored, printable battlecard with word-for-word talking scripts and rate targets to negotiate lower interest and 0 processing fees with bank RMs.
          </p>
        </div>
      </div>
    </main>
  );
}
