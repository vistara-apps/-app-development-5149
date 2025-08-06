import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateInitialPlan, generateWeeklyPlan } from '../utils/planGenerator';
import { useUser } from './UserContext';

const PlanContext = createContext();

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider = ({ children }) => {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState(() => {
    const savedPlan = localStorage.getItem('runcoach_plan');
    return savedPlan ? JSON.parse(savedPlan) : null;
  });

  const [planHistory, setPlanHistory] = useState(() => {
    const savedHistory = localStorage.getItem('runcoach_plan_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    if (user && !currentPlan) {
      const initialPlan = generateInitialPlan(user);
      setCurrentPlan(initialPlan);
    }
  }, [user, currentPlan]);

  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('runcoach_plan', JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  useEffect(() => {
    localStorage.setItem('runcoach_plan_history', JSON.stringify(planHistory));
  }, [planHistory]);

  const updatePlan = (updates) => {
    const updatedPlan = { ...currentPlan, ...updates };
    
    // Add to history
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      changes: updates,
      planSnapshot: updatedPlan
    };
    setPlanHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
    
    setCurrentPlan(updatedPlan);
  };

  const regeneratePlan = (preferences = {}) => {
    if (!user) return;
    
    const newPlan = generateInitialPlan({ ...user, ...preferences });
    setCurrentPlan(newPlan);
    
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      changes: { type: 'regenerate', preferences },
      planSnapshot: newPlan
    };
    setPlanHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
  };

  return (
    <PlanContext.Provider value={{
      currentPlan,
      planHistory,
      updatePlan,
      regeneratePlan
    }}>
      {children}
    </PlanContext.Provider>
  );
};