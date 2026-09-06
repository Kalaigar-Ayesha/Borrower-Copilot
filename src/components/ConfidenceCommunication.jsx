import React, { useState } from 'react';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function ConfidenceCommunication({ confidence, onEditAssessment }) {
  const [showWhyConf, setShowWhyConf] = useState(false);

  if (!confidence) return null;

  const { tier, scorePoints, badgeColor, badgeBg, missingOrEstimatedFields, explanation } = confidence;

  return (
    <div className="card" style={{ marginBottom: '2rem', background: badgeBg, borderColor: badgeColor, borderStyle: 'solid', borderWidth: '1.5px' }}>
      <div className="card-header" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              background: badgeColor,
              color: '#FFFFFF',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {tier} CONFIDENCE ({scorePoints}/100)
          </span>
          <h4 style={{ margin: 0, color: badgeColor, fontSize: '1.1rem' }}>
            FEATURE 6: Precision & Uncertainty Rating
          </h4>
        </div>

        <WhyTrigger onClick={() => setShowWhyConf(true)} label="Why range widens?" />
      </div>

      <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: '1rem', fontWeight: 500 }}>
        {explanation}
      </p>

      <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Verified / User-Provided Figures:
            </span>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>• In-hand Net Monthly Income</li>
              <li>• Existing Monthly Debt Obligations</li>
              <li>• Employment & Loan Purpose Category</li>
            </ul>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: badgeColor, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              {missingOrEstimatedFields.length > 0 ? `Estimated / Skipped Parameters (${missingOrEstimatedFields.length}):` : 'All Key Parameters Verified'}
            </span>

            {missingOrEstimatedFields.length > 0 ? (
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {missingOrEstimatedFields.map((item) => (
                  <li key={item.key}>
                    <strong>{item.label}:</strong> {item.recommendation}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                No estimated parameters! Your assessment has high precision.
              </p>
            )}
          </div>
        </div>

        {missingOrEstimatedFields.length > 0 && onEditAssessment && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onEditAssessment}
            style={{ marginTop: '1rem' }}
          >
            Provide Missing Details to Lock Exact Bounds
          </button>
        )}
      </div>

      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '0.85rem', fontStyle: 'italic' }}>
        * Disclaimer: Confidence rating evaluates calculation precision based on input completeness. It does not imply formal credit underwriting or bank approval guarantee.
      </div>

      <WhyModal
        isOpen={showWhyConf}
        onClose={() => setShowWhyConf(false)}
        title="Copilot Rule: Unknown is Never Treated as Zero"
        explanation="Generic loan calculators make dangerous assumptions—if you skip an expense field, they treat it as ₹0, making your borrowing capacity look artificially inflated. Borrower Copilot applies standard Indian benchmark estimates for skipped fields and expands calculation ranges to reflect uncertainty."
        formula="Range Expansion Factor = ±5% (High), ±12% (Medium), ±20% (Low)"
        impact="Providing exact figures increases score precision and narrows output ranges."
      />
    </div>
  );
}
