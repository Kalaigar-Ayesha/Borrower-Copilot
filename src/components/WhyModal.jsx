import React from 'react';

export function WhyModal({ isOpen, onClose, title, explanation, formula, impact }) {
  if (!isOpen) return null;

  return (
    <div className="why-modal-backdrop" onClick={onClose}>
      <div className="why-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-sage)', fontWeight: 600 }}>
              Methodology Explanation
            </span>
            <h3 style={{ marginTop: '0.25rem' }}>{title || 'Why this calculation?'}</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ fontSize: '1.25rem', lineHeight: 1 }}>
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>{explanation}</p>

          {formula && (
            <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                MATHEMATICAL FORMULA
              </span>
              <code style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                {formula}
              </code>
            </div>
          )}

          {impact && (
            <div style={{ background: 'var(--color-sage-light)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.2rem' }}>
                Why it matters to you:
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-primary)' }}>{impact}</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
}

export function WhyTrigger({ onClick, label = 'Why?' }) {
  return (
    <button className="why-trigger" onClick={onClick} type="button">
      <span>?</span>
      <span>{label}</span>
    </button>
  );
}
