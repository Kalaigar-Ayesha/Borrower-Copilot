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
  loadPresetProfile,
}) {
  const [showWhyAccordion, setShowWhyAccordion] = useState(false);
  const [validationError, setValidationError] = useState(null);

  if (!currentQuestion) return null;

  const value = profile[currentQuestion.id];
  const isUnknown = value === null || value === undefined;

  const handleContinue = () => {
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
      {/* Progress Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Question {activeQuestionIndex + 1} of {totalActiveQuestions}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            {progressPercentage}% Completed
          </span>
        </div>

        <div style={{ width: '100%', height: '5px', background: 'var(--color-border)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
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

      {/* Question Card */}
      <div className="card" style={{ padding: '2.25rem 2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem', lineHeight: '1.25' }}>
          {currentQuestion.question}
        </h2>
        {currentQuestion.description && (
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
            {currentQuestion.description}
          </p>
        )}

        <div style={{ marginBottom: '1.75rem' }}>
          {/* CONTROL 1: Card Select */}
          {currentQuestion.type === 'card_select' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
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
                      padding: '1.15rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <strong style={{ fontSize: '1rem', color: 'var(--color-primary)', display: 'block' }}>
                      {opt.label}
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                      {opt.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* CONTROL 2: Currency Input */}
          {currentQuestion.type === 'currency' && (
            <div>
              <div className="input-currency-wrapper" style={{ marginBottom: '0.75rem' }}>
                <span className="currency-prefix" style={{ fontSize: '1.3rem', left: '1.25rem' }}>₹</span>
                <input
                  type="number"
                  className="form-input"
                  style={{ fontSize: '1.25rem', paddingLeft: '2.8rem', padding: '0.9rem 1rem 0.9rem 2.8rem', fontWeight: 600 }}
                  placeholder={currentQuestion.placeholder}
                  value={isUnknown ? '' : value}
                  disabled={isUnknown}
                  onChange={(e) => updateProfileValue(currentQuestion.id, e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
              </div>

              {!isUnknown && value > 0 && (
                <div style={{ fontSize: '0.88rem', color: 'var(--color-primary)', fontWeight: 600, background: 'var(--color-sage-light)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-pill)', display: 'inline-block' }}>
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
                style={{ fontSize: '1.2rem', padding: '0.85rem 1rem', fontWeight: 600 }}
                placeholder={currentQuestion.placeholder}
                value={isUnknown ? '' : value}
                disabled={isUnknown}
                onChange={(e) => updateProfileValue(currentQuestion.id, e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
          )}

          {/* CONTROL 4: Pills / Tenure Pills */}
          {(currentQuestion.type === 'pills' || currentQuestion.type === 'tenure_pills') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
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
                      padding: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary)', display: 'block' }}>
                      {opt.label}
                    </strong>
                    {opt.desc && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
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
                  padding: '1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
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
                  padding: '1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                <span>{value || 0} {currentQuestion.unitLabel}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
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
                style={{ width: '100%', height: '6px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>
          )}

          {validationError && (
            <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.6rem' }}>
              {validationError}
            </div>
          )}
        </div>

        {/* Expandable "Why?" Accordion */}
        {currentQuestion.impact && (
          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem' }}>
            <button
              onClick={() => setShowWhyAccordion(!showWhyAccordion)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-sage)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: 0,
              }}
            >
              <span>{showWhyAccordion ? '▼' : '►'}</span>
              <span>Why this question?</span>
            </button>

            {showWhyAccordion && (
              <div style={{ background: 'var(--color-sage-light)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage)', marginTop: '0.6rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', lineHeight: '1.45', margin: 0 }}>
                  {currentQuestion.impact}
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
          Back
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {currentQuestion.allowUnknown && (
            <button className="btn btn-ghost" onClick={handleSkip}>
              {currentQuestion.unknownLabel || 'Don\'t know? Skip'}
            </button>
          )}

          <button className="btn btn-primary btn-lg" onClick={handleContinue}>
            {activeQuestionIndex === totalActiveQuestions - 1 ? 'View Copilot Report' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  );
}
