import React, { useState } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { AssessmentPage } from './pages/AssessmentPage.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';
import { useAssessment } from './hooks/useAssessment.js';

export function App() {
  const [activePage, setActivePage] = useState('landing');
  const assessment = useAssessment();

  const handleStartAssessment = () => {
    setActivePage('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadPreset = (profileType) => {
    assessment.loadPresetProfile(profileType);
    setActivePage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteAssessment = () => {
    setActivePage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTenure = (months) => {
    assessment.updateProfileValue('requestedTenureMonths', months);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        currentStep={assessment.activeQuestionIndex}
        totalSteps={assessment.totalActiveQuestions}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <div style={{ flex: 1 }}>
        {activePage === 'landing' && (
          <LandingPage
            onStartAssessment={handleStartAssessment}
            onLoadPreset={handleLoadPreset}
          />
        )}

        {activePage === 'assessment' && (
          <AssessmentPage
            profile={assessment.profile}
            activeQuestionIndex={assessment.activeQuestionIndex}
            currentQuestion={assessment.currentQuestion}
            totalActiveQuestions={assessment.totalActiveQuestions}
            progressPercentage={assessment.progressPercentage}
            updateProfileValue={assessment.updateProfileValue}
            setUnknownValue={assessment.setUnknownValue}
            nextQuestion={assessment.nextQuestion}
            prevQuestion={assessment.prevQuestion}
            onComplete={handleCompleteAssessment}
            results={assessment}
            loadPresetProfile={assessment.loadPresetProfile}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage
            results={assessment.results}
            profile={assessment.profile}
            onEditAssessment={() => handleNavigate('assessment')}
            onSelectTenure={handleSelectTenure}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
