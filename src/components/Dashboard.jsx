import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Target, Clock, AlertCircle } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import { useUser } from '../contexts/UserContext';
import { generateContextualRecommendations } from '../utils/nlpProcessor';
import WeeklySchedule from './WeeklySchedule';
import ProgressChart from './ProgressChart';
import SubscriptionPaywall from './SubscriptionPaywall';
import { StatCardSkeleton, RecommendationsSkeleton, LoadingSpinner } from './LoadingStates';
import { ToastContainer, useToast } from './ToastNotification';

const Dashboard = () => {
  const { currentPlan } = usePlan();
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(() => {
    return localStorage.getItem('runcoach_subscription') === 'active';
  });
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    if (isPaid && currentPlan && user) {
      generateRecommendations();
    }

    return () => clearTimeout(timer);
  }, [currentPlan, user, isPaid]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const contextData = {
        weather: 'Partly cloudy, 65°F',
        performance: 'On track',
        energy: 'High'
      };
      const recs = await generateContextualRecommendations(user, currentPlan, contextData);
      setRecommendations(recs);
      showSuccess('Recommendations updated successfully!');
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      showError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isPaid) {
    return <SubscriptionPaywall onSubscribe={() => setIsPaid(true)} />;
  }

  if (!currentPlan) {
    return (
      <div className="container">
        <div className="card">
          <h2>Welcome to RunCoach!</h2>
          <p>It looks like you haven't set up your training plan yet.</p>
          <Link to="/customize" className="btn btn-primary">
            Create Your Plan
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: <Target size={24} />,
      label: 'Weekly Mileage',
      value: currentPlan.weeklyMileage,
      unit: 'miles',
      color: '#667eea',
      trend: '+2.5',
      trendDirection: 'up'
    },
    {
      icon: <Calendar size={24} />,
      label: 'Workouts/Week',
      value: currentPlan.workoutsPerWeek,
      unit: 'sessions',
      color: '#764ba2',
      trend: 'On track',
      trendDirection: 'neutral'
    },
    {
      icon: <Clock size={24} />,
      label: 'Target Pace',
      value: currentPlan.paceTarget,
      unit: 'min/mi',
      color: '#f093fb',
      trend: '-0:15',
      trendDirection: 'up'
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Long Run',
      value: currentPlan.longRunDistance,
      unit: 'miles',
      color: '#f5576c',
      trend: '+1.0',
      trendDirection: 'up'
    }
  ];

  return (
    <div className="container">
      {/* Stats Overview */}
      <div className="grid grid-4">
        {initialLoading ? (
          [...Array(4)].map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="card stat-card enhanced">
              <div className="stat-header">
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className={`stat-trend ${stat.trendDirection}`}>
                  {stat.trend}
                </div>
              </div>
              <div className="stat-main">
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-unit">{stat.unit}</div>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-2">
        {/* Weekly Schedule */}
        <div className="card">
          <h3>This Week's Schedule</h3>
          <WeeklySchedule plan={currentPlan} />
          <div style={{ marginTop: '1rem' }}>
            <Link to="/update" className="btn btn-primary">
              Update Plan with AI
            </Link>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card">
          <h3>AI Recommendations</h3>
          {loading ? (
            <RecommendationsSkeleton />
          ) : recommendations.length > 0 ? (
            <div>
              {recommendations.map((rec, index) => (
                <div key={index} className="message assistant" style={{ margin: '0.5rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={16} color={rec.priority === 'high' ? '#f5576c' : '#667eea'} />
                    <strong>{rec.title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{rec.description}</p>
                </div>
              ))}
              <button 
                onClick={generateRecommendations} 
                className="btn btn-secondary"
                style={{ marginTop: '1rem', width: '100%' }}
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Refresh Recommendations'}
              </button>
            </div>
          ) : (
            <div>
              <p>Get personalized recommendations based on your current plan and performance.</p>
              <button 
                onClick={generateRecommendations} 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Generate Recommendations'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="card">
        <h3>Progress Overview</h3>
        <ProgressChart plan={currentPlan} />
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
