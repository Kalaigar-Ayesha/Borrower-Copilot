import React from 'react';
import { PrivacyBanner } from '../components/PrivacyBanner.jsx';
import { VerdictBanner } from '../components/VerdictBanner.jsx';
import { CapacityComparison } from '../components/CapacityComparison.jsx';
import { AprBreakdown } from '../components/AprBreakdown.jsx';
import { TenureTradeoff } from '../components/TenureTradeoff.jsx';
import { StressScenario } from '../components/StressScenario.jsx';
import { ConfidenceCommunication } from '../components/ConfidenceCommunication.jsx';
import { QuoteCheckCard } from '../components/QuoteCheckCard.jsx';
import { WhatIfSimulator } from '../components/WhatIfSimulator.jsx';
import { InteractiveStressTest } from '../components/InteractiveStressTest.jsx';
import { DecisionTrail } from '../components/DecisionTrail.jsx';
import { NegotiationCard } from '../components/NegotiationCard.jsx';
import { formatINR } from '../utils/formatters.js';

export function ResultsPage({ results, profile, answers, onEditAssessment, onSelectTenure }) {
  const activeProfile = profile || answers || {};

  const {
    lenderSanction,
    borrowerSafe,
    proposedEMI,
    aprResults,
    fairRateRange,
    aprRange,
    sanctionRange,
    safeRange,
    recommendedAmount,
    safeEmiCeiling,
    verdict,
    confidence,
    tenureTradeoffs,
    stressScenario,
    negotiationCard,
    productRouting,
    affordability,
  } = results;

  return (
    <main className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Privacy Trust Banner */}
      <PrivacyBanner />

      {/* 1. Header: "Your borrowing snapshot" */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            FINANCIAL COPILOT SNAPSHOT
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.2rem', color: 'var(--color-primary)' }}>
            Your Borrowing Snapshot
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
            Evaluated for requested loan of <strong>{formatINR(activeProfile.requestedAmount)}</strong> over <strong>{activeProfile.requestedTenureMonths || 36} months</strong> ({productRouting ? productRouting.productName : 'Unsecured Personal Loan'}).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onEditAssessment}>
            Modify Input Values
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            Export PDF / Print
          </button>
        </div>
      </div>

      {/* 2. Primary Decision Recommendation Banner (Decision-First) */}
      <VerdictBanner
        verdict={verdict}
        requestedAmount={activeProfile.requestedAmount}
        safePrincipal={borrowerSafe.safePrincipal}
      />

      {/* 3. Borrower-Safe Capacity (Visually Dominant) vs Lender Sanction */}
      <CapacityComparison
        lenderSanction={lenderSanction}
        borrowerSafe={borrowerSafe}
        requestedAmount={activeProfile.requestedAmount}
        safeRange={safeRange}
        sanctionRange={sanctionRange}
      />

      {/* 4. Interest & All-In APR Range Breakdown */}
      <AprBreakdown
        aprResults={aprResults}
        fairRateRange={fairRateRange || { minFairRate: 11.0, maxFairRate: 12.5 }}
      />

      {/* Quote Check Card */}
      <QuoteCheckCard
        fairRateRange={fairRateRange || { minFairRate: 11.0, maxFairRate: 12.5 }}
        defaultAmount={activeProfile.requestedAmount}
        defaultTenure={activeProfile.requestedTenureMonths}
      />

      {/* What-If Interactive Simulator */}
      <WhatIfSimulator
        safeEmiCeiling={safeEmiCeiling || borrowerSafe.safeEmiCeiling}
        defaultAmount={activeProfile.requestedAmount}
        defaultTenure={activeProfile.requestedTenureMonths}
        defaultRate={fairRateRange ? fairRateRange.midRate : 11.5}
      />

      {/* Interactive Stress Test */}
      <InteractiveStressTest
        netMonthlyIncome={activeProfile.netMonthlyIncome || 85000}
        essentialLivingCosts={affordability ? affordability.borrowerSafeBasis.effectiveLivingCosts : 30000}
        existingEmis={activeProfile.existingMonthlyEmis || 0}
        proposedEmi={proposedEMI}
        principal={activeProfile.requestedAmount || 500000}
        interestRate={fairRateRange ? fairRateRange.midRate : 11.5}
        tenureMonths={activeProfile.requestedTenureMonths || 36}
      />

      {/* Decision Trail Flowchart */}
      <DecisionTrail
        profile={activeProfile}
        affordability={affordability}
        verdict={verdict}
        confidence={confidence}
      />

      {/* 5. Interactive Tenure Trade-off Matrix */}
      <TenureTradeoff
        tenureTradeoffs={tenureTradeoffs}
        requestedAmount={activeProfile.requestedAmount}
        onSelectTenure={onSelectTenure}
      />

      {/* Actionable Bank Negotiation Battlecard */}
      <NegotiationCard
        negotiationCard={negotiationCard}
      />

      {/* Precision & Confidence Communication */}
      <ConfidenceCommunication
        confidence={confidence}
        onEditAssessment={onEditAssessment}
      />
    </main>
  );
}
