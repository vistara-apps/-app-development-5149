import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Target, Clock, AlertCircle } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import { useUser } from '../contexts/UserContext';
import { generateContextualRecommendations } from '../utils/nlpProcessor';
import WeeklySchedule from './WeeklySchedule';
import ProgressChart from './ProgressChart';
import SubscriptionPaywall from './SubscriptionPaywall';

const Dashboard = () => {
  const { currentPlan } = usePlan();
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(() => {
    return localStorage.getItem('runcoach_subscription') === 'active';
  });

  useEffect(() => {
    if (isPaid && currentPlan && user) {
      generateRecommendations();
    }
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
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
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
      icon: <Target size={20} />,
      label: 'Weekly Mileage',
      value: `${currentPlan.weeklyMileage} mi`,
      color: '#667eea'
    },
    {
      icon: <Calendar size={20} />,
      label: 'Workouts/Week',
      value: currentPlan.workoutsPerWeek,
      color: '#764ba2'
    },
    {
      icon: <Clock size={20} />,
      label: 'Target Pace',
      value: currentPlan.paceTarget,
      color: '#f093fb'
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Long Run',
      value: `${currentPlan.longRunDistance} mi`,
      color: '#f5576c'
    }
  ];

  return (
    <div className="container">
      {/* Stats Overview */}
      <div className="grid grid-3">
        {stats.map((stat, index) => (
          <div key={index} className="card stat-card">
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.icon}
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
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
            <div className="loading"></div>
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
              >
                Refresh Recommendations
              </button>
            </div>
          ) : (
            <div>
              <p>Get personalized recommendations based on your current plan and performance.</p>
              <button 
                onClick={generateRecommendations} 
                className="btn btn-primary"
              >
                Generate Recommendations
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
    </div>
  );
};

export default Dashboard;