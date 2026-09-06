import React from 'react';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>Borrower Copilot</h3>
            <p style={{ fontSize: '0.9rem' }}>
              An intelligent, objective borrowing decision-support tool tailored for Indian retail borrowers. Protecting cash flows before signing bank loan agreements.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>Core Principles</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <li>• Independent of Lenders</li>
              <li>• Unknown ≠ Zero</li>
              <li>• All-in APR Transparency</li>
              <li>• FOIR vs Safe Capacity</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>Regulatory Compliance</h4>
            <p style={{ fontSize: '0.85rem' }}>
              Complies with RBI Retail Lending Transparency Guidelines & Digital Lending Directives.
            </p>
          </div>
        </div>

        <div className="footer-disclaimer">
          <strong>Important Financial Disclosure:</strong> Borrower Copilot is an educational decision-support framework designed to evaluate personal borrowing capacity. It does not constitute formal financial advice or a loan guarantee. Always review bank sanction terms carefully.
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Borrower Copilot</span>
          <span>Independent Financial Decision Engine</span>
        </div>
      </div>
    </footer>
  );
}
