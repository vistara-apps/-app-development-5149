import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PlanCustomization from './components/PlanCustomization';
import NaturalLanguageUpdate from './components/NaturalLanguageUpdate';
import OnboardingFlow from './components/OnboardingFlow';
import { UserProvider } from './contexts/UserContext';
import { PlanProvider } from './contexts/PlanContext';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('runcoach_onboarded') === 'true';
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem('runcoach_onboarded', 'true');
    setIsOnboarded(true);
  };

  if (!isOnboarded) {
    return (
      <UserProvider>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <PlanProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customize" element={<PlanCustomization />} />
              <Route path="/update" element={<NaturalLanguageUpdate />} />
            </Routes>
          </div>
        </Router>
      </PlanProvider>
    </UserProvider>
  );
}

export default App;