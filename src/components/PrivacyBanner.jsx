import React from 'react';

export function PrivacyBanner() {
  return (
    <div
      style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-pill)',
        padding: '0.5rem 1.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.82rem',
        color: 'var(--color-text-muted)',
        fontWeight: 500,
        marginBottom: '1.5rem',
      }}
    >
      <span style={{ color: 'var(--color-sage)', fontWeight: 700 }}>🔒 PRIVACY BY DESIGN:</span>
      <span>No login required</span>
      <span style={{ color: 'var(--color-border)' }}>•</span>
      <span>No CIBIL bureau pull</span>
      <span style={{ color: 'var(--color-border)' }}>•</span>
      <span>Zero financial data stored</span>
    </div>
  );
}
