import React, { useState } from 'react';
import { ChevronRight, User, Target, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const OnboardingFlow = ({ onComplete }) => {
  const { updateUser } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fitness_level: '',
    goals: '',
    preferences: {}
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('pref_')) {
      const prefName = name.replace('pref_', '');
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateUser(formData);
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.fitness_level && formData.goals;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ maxWidth: '600px', width: '90%' }}>
        {/* Progress Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step >= num ? '#667eea' : '#e9ecef',
                color: step >= num ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 0.5rem',
                fontWeight: 'bold'
              }}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <User size={32} style={{ marginRight: '0.5rem' }} />
              Welcome to RunCoach!
            </h2>
            
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}

        {/* Step 2: Fitness & Goals */}
        {step === 2 && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Target size={32} style={{ marginRight: '0.5rem' }} />
              Fitness Level & Goals
            </h2>
            
            <div className="input-group">
              <label>Current Fitness Level</label>
              <select
                name="fitness_level"
                value={formData.fitness_level}
                onChange={handleInputChange}
              >
                <option value="">Select your level</option>
                <option value="beginner">Beginner (0-6 months running)</option>
                <option value="intermediate">Intermediate (6 months - 2 years)</option>
                <option value="advanced">Advanced (2+ years)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Primary Running Goal</label>
              <select
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
              >
                <option value="">Select your goal</option>
                <option value="fitness">General Fitness</option>
                <option value="5k">5K Race</option>
                <option value="10k">10K Race</option>
                <option value="half-marathon">Half Marathon</option>
                <option value="marathon">Marathon</option>
                <option value="weight-loss">Weight Loss</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Settings size={32} style={{ marginRight: '0.5rem' }} />
              Training Preferences
            </h2>
            
            <div className="input-group">
              <label>Preferred Training Days per Week</label>
              <select
                name="pref_workoutsPerWeek"
                value={formData.preferences.workoutsPerWeek || ''}
                onChange={handleInputChange}
              >
                <option value="">Let AI decide</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
                <option value="6">6 days</option>
              </select>
            </div>

            <div className="input-group">
              <label>Training Intensity Preference</label>
              <select
                name="pref_intensity"
                value={formData.preferences.intensity || ''}
                onChange={handleInputChange}
              >
                <option value="">Balanced approach</option>
                <option value="easy">Easy & comfortable</option>
                <option value="moderate">Moderate challenge</option>
                <option value="hard">High intensity</option>
              </select>
            </div>

            <div className="input-group">
              <label>Any injuries or concerns? (Optional)</label>
              <textarea
                name="pref_concerns"
                value={formData.preferences.concerns || ''}
                onChange={handleInputChange}
                placeholder="e.g., knee issues, time constraints..."
                rows="3"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={step === 1}
          >
            Previous
          </button>
          
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {step === 3 ? 'Complete Setup' : 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;