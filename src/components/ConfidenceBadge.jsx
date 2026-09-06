import React, { useState } from 'react';
import { WhyModal, WhyTrigger } from './WhyModal.jsx';

export function ConfidenceBadge({ confidence, onEditAssessment }) {
  const [showWhyConf, setShowWhyConf] = useState(false);

  if (!confidence) return null;

  const { confidenceTier, scorePoints, badgeColor, badgeBg, missingOrEstimatedFields, summaryText } = confidence;

  return (
    <div className="card" style={{ marginBottom: '2rem', background: badgeBg, borderColor: badgeColor }}>
      <div className="card-header" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              background: badgeColor,
              color: '#FFFFFF',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
            }}
          >
            {confidenceTier} CONFIDENCE ({scorePoints}/100)
          </span>
          <h4 style={{ margin: 0, color: badgeColor, fontSize: '1.05rem' }}>
            Uncertainty & Precision Rating
          </h4>
        </div>

        <WhyTrigger onClick={() => setShowWhyConf(true)} label="Why range widen?" />
      </div>

      <p style={{ fontSize: '0.92rem', color: 'var(--color-text)', marginBottom: '1rem' }}>
        {summaryText}
      </p>

      {missingOrEstimatedFields.length > 0 && (
        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Estimated or Skipped Parameters ({missingOrEstimatedFields.length}):
          </span>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.2rem' }}>
            {missingOrEstimatedFields.map((field) => (
              <li key={field.key} style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>
                <strong>{field.label}:</strong> {field.recommendation}
              </li>
            ))}
          </ul>

          {onEditAssessment && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onEditAssessment}
              style={{ marginTop: '0.85rem' }}
            >
              Fill Missing Details to Narrow Ranges
            </button>
          )}
        </div>
      )}

      <WhyModal
        isOpen={showWhyConf}
        onClose={() => setShowWhyConf(false)}
        title="Copilot Rule: Unknown is Never Treated as Zero"
        explanation="Generic loan calculators make dangerous assumptions—if you skip an expense field, they treat it as ₹0, making your capacity look artificially inflated. Borrower Copilot applies standard Indian benchmark estimates for skipped fields and expands calculation ranges to reflect uncertainty."
        formula="Range Spread = Base Value ± (RangeExpansionFactor × 100)% based on Confidence Score"
        impact="Providing exact figures increases score precision and removes range buffers."
      />
    </div>
  );
}
