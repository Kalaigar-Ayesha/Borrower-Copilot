import React, { useState } from 'react';
import { formatINR } from '../utils/formatters.js';

export function AssessmentPage({
  profile,
  activeQuestionIndex,
  currentQuestion,
  totalActiveQuestions,
  progressPercentage,
  updateProfileValue,
  setUnknownValue,
  nextQuestion,
  prevQuestion,
  onComplete,
  results,
  loadPresetProfile,
}) {
  const [showWhyAccordion, setShowWhyAccordion] = useState(false);
  const [validationError, setValidationError] = useState(null);

  if (!currentQuestion) return null;

  const value = profile[currentQuestion.id];
  const isUnknown = value === null || value === undefined;

  const handleContinue = () => {
    // Run validation if present
    if (currentQuestion.validation && !isUnknown) {
      const err = currentQuestion.validation(value);
      if (err) {
        setValidationError(err);
        return;
      }
    }
    setValidationError(null);
    setShowWhyAccordion(false);

    if (activeQuestionIndex === totalActiveQuestions - 1) {
      onComplete();
    } else {
      nextQuestion();
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    setShowWhyAccordion(false);
    prevQuestion();
  };

  const handleSkip = () => {
    setValidationError(null);
    setShowWhyAccordion(false);
    if (currentQuestion.allowUnknown) {
      setUnknownValue(currentQuestion.id, currentQuestion.unknownValue !== undefined ? currentQuestion.unknownValue : null);
    }
    if (activeQuestionIndex === totalActiveQuestions - 1) {
      onComplete();
    } else {
      nextQuestion();
    }
  };

  return (
    <main className="container container-narrow" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Persona Switcher Bar */}
      <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          ⚡ Persona Testing Presets:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => loadPresetProfile('SALARIED_SAFE')}>
            Salaried Corporate
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => loadPresetProfile('SELF_EMPLOYED_BUSINESS')}>
            Self-Employed Business
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => loadPresetProfile('INFORMAL_GIG_RISK')}>
            Informal / Gig Worker
          </button>
        </div>
      </div>

      {/* Progress Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Question {activeQuestionIndex + 1} of {totalActiveQuestions} (Adaptive)
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            {progressPercentage}% Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'var(--color-primary)',
              transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* Single Question Container Card */}
      <div className="card" style={{ padding: '2.5rem 2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
        {/* Question Title & Subtitle */}
        <h2 style={{ fontSize: '2.1rem', color: 'var(--color-primary)', marginBottom: '0.6rem', lineHeight: '1.25' }}>
          {currentQuestion.question}
        </h2>
        {currentQuestion.description && (
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            {currentQuestion.description}
          </p>
        )}

        {/* Interactive Controls */}
        <div style={{ marginBottom: '2rem' }}>
          {/* CONTROL 1: Card Select */}
          {currentQuestion.type === 'card_select' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => updateProfileValue(currentQuestion.id, opt.value)}
                    style={{
                      background: isSelected ? 'var(--color-sage-light)' : 'var(--bg-surface-elevated)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                    }}
                  >
                    {opt.icon && <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{opt.icon}</span>}
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)', display: 'block' }}>
                        {opt.label}
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CONTROL 2: Currency Input */}
          {currentQuestion.type === 'currency' && (
            <div>
              <div className="input-currency-wrapper" style={{ marginBottom: '0.75rem' }}>
                <span className="currency-prefix" style={{ fontSize: '1.4rem', left: '1.25rem' }}>₹</span>
                <input
                  type="number"
                  className="form-input"
                  style={{ fontSize: '1.35rem', paddingLeft: '2.8rem', padding: '1rem 1rem 1rem 2.8rem', fontWeight: 600 }}
                  placeholder={currentQuestion.placeholder}
                  value={isUnknown ? '' : value}
                  disabled={isUnknown}
                  onChange={(e) => updateProfileValue(currentQuestion.id, e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
              </div>

              {!isUnknown && value > 0 && (
                <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-sage-light)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-pill)', display: 'inline-block' }}>
                  Formatted: {formatINR(value)}
                </div>
              )}
            </div>
          )}

          {/* CONTROL 3: Number & Percent */}
          {(currentQuestion.type === 'number' || currentQuestion.type === 'percent') && (
            <div>
              <input
                type="number"
                step={currentQuestion.type === 'percent' ? '0.1' : '1'}
                className="form-input"
                style={{ fontSize: '1.25rem', padding: '0.9rem 1rem', fontWeight: 600 }}
                placeholder={currentQuestion.placeholder}
                value={isUnknown ? '' : value}
                disabled={isUnknown}
                onChange={(e) => updateProfileValue(currentQuestion.id, e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
          )}

          {/* CONTROL 4: Pills / Tenure Pills */}
          {(currentQuestion.type === 'pills' || currentQuestion.type === 'tenure_pills') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => updateProfileValue(currentQuestion.id, opt.value)}
                    style={{
                      background: isSelected ? 'var(--color-sage-light)' : 'var(--bg-surface-elevated)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', display: 'block' }}>
                      {opt.label}
                    </strong>
                    {opt.desc && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                        {opt.desc}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CONTROL 5: Boolean Buttons */}
          {currentQuestion.type === 'boolean' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => updateProfileValue(currentQuestion.id, true)}
                style={{
                  background: value === true ? 'var(--color-sage-light)' : 'var(--bg-surface-elevated)',
                  border: value === true ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                Yes
              </div>
              <div
                onClick={() => updateProfileValue(currentQuestion.id, false)}
                style={{
                  background: value === false ? 'var(--color-sage-light)' : 'var(--bg-surface-elevated)',
                  border: value === false ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                No
              </div>
            </div>
          )}

          {/* CONTROL 6: Range Slider */}
          {currentQuestion.type === 'slider' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                <span>{value || 0} {currentQuestion.unitLabel}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  {currentQuestion.min} to {currentQuestion.max} months
                </span>
              </div>
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                step={currentQuestion.step || 1}
                value={value || 0}
                onChange={(e) => updateProfileValue(currentQuestion.id, parseInt(e.target.value, 10))}
                style={{ width: '100%', height: '8px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>
          )}

          {validationError && (
            <div style={{ color: 'var(--color-danger)', fontSize: '0.88rem', fontWeight: 600, marginTop: '0.75rem' }}>
              ⚠️ {validationError}
            </div>
          )}
        </div>

        {/* Expandable "Why are we asking this?" Accordion */}
        {currentQuestion.impact && (
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
            <button
              onClick={() => setShowWhyAccordion(!showWhyAccordion)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-sage)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: 0,
              }}
            >
              <span>{showWhyAccordion ? '▼' : '►'}</span>
              <span>Why are we asking this question?</span>
            </button>

            {showWhyAccordion && (
              <div style={{ background: 'var(--color-sage-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage)', marginTop: '0.75rem', animation: 'fadeIn 0.2s ease' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-primary)', lineHeight: '1.5', margin: 0 }}>
                  💡 {currentQuestion.impact}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={activeQuestionIndex === 0}
          style={{ opacity: activeQuestionIndex === 0 ? 0.4 : 1 }}
        >
          &larr; Back
        </button>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          {currentQuestion.allowUnknown && (
            <button className="btn btn-ghost" onClick={handleSkip}>
              {currentQuestion.unknownLabel || 'Skip / I don\'t know'}
            </button>
          )}

          <button className="btn btn-primary btn-lg" onClick={handleContinue}>
            {activeQuestionIndex === totalActiveQuestions - 1 ? 'Generate Copilot Report &rarr;' : 'Continue &rarr;'}
          </button>
        </div>
      </div>
    </main>
  );
}
