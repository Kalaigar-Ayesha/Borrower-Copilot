import React from 'react';

export function Header({ currentStep, totalSteps, activePage, onNavigate }) {
  return (
    <header className="app-header">
      <div className="container app-header-inner">
        <div
          className="brand-logo"
          onClick={() => onNavigate('landing')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-mark">B</div>
          <div>
            Borrower Copilot
            <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>
              Indian Financial Decision Support
            </div>
          </div>
        </div>

        <div className="nav-actions">
          {activePage === 'assessment' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <div style={{ width: '120px', height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                    height: '100%',
                    background: 'var(--color-primary)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )}

          {activePage === 'results' && (
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('assessment')}>
              Edit Assessment
            </button>
          )}

          {activePage === 'landing' && (
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('assessment')}>
              Start Assessment
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
