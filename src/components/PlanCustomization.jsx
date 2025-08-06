import React, { useState } from 'react';
import { Save, RotateCcw, Target } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import { useUser } from '../contexts/UserContext';

const PlanCustomization = () => {
  const { currentPlan, updatePlan, regeneratePlan } = usePlan();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    weeklyMileage: currentPlan?.weeklyMileage || 20,
    workoutsPerWeek: currentPlan?.workoutsPerWeek || 4,
    longRunDistance: currentPlan?.longRunDistance || 8,
    paceTarget: currentPlan?.paceTarget || '9:00',
    intensity: currentPlan?.intensity || 'moderate',
    restDays: currentPlan?.restDays || 2,
    duration: currentPlan?.duration || 12
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Distance') || name.includes('Mileage') || name.includes('Per') || name.includes('Days') || name.includes('duration')
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSave = () => {
    updatePlan(formData);
    alert('Plan updated successfully!');
  };

  const handleRegenerate = () => {
    if (confirm('This will create a completely new plan. Continue?')) {
      regeneratePlan(formData);
      alert('New plan generated!');
    }
  };

  if (!currentPlan) {
    return (
      <div className="container">
        <div className="card">
          <h2>No plan found</h2>
          <p>Please complete onboarding first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>
          <Target size={24} style={{ marginRight: '0.5rem' }} />
          Customize Your Training Plan
        </h2>
        
        <div className="grid grid-2">
          {/* Basic Settings */}
          <div>
            <h3>Basic Settings</h3>
            
            <div className="input-group">
              <label>Weekly Mileage</label>
              <input
                type="number"
                name="weeklyMileage"
                value={formData.weeklyMileage}
                onChange={handleInputChange}
                min="5"
                max="100"
              />
            </div>

            <div className="input-group">
              <label>Workouts per Week</label>
              <select
                name="workoutsPerWeek"
                value={formData.workoutsPerWeek}
                onChange={handleInputChange}
              >
                <option value={3}>3 workouts</option>
                <option value={4}>4 workouts</option>
                <option value={5}>5 workouts</option>
                <option value={6}>6 workouts</option>
              </select>
            </div>

            <div className="input-group">
              <label>Long Run Distance (miles)</label>
              <input
                type="number"
                name="longRunDistance"
                value={formData.longRunDistance}
                onChange={handleInputChange}
                min="3"
                max="26"
              />
            </div>

            <div className="input-group">
              <label>Target Pace (per mile)</label>
              <input
                type="text"
                name="paceTarget"
                value={formData.paceTarget}
                onChange={handleInputChange}
                placeholder="9:00"
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <h3>
              Advanced Settings
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
              >
                {showAdvanced ? 'Hide' : 'Show'}
              </button>
            </h3>
            
            {showAdvanced && (
              <>
                <div className="input-group">
                  <label>Training Intensity</label>
                  <select
                    name="intensity"
                    value={formData.intensity}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Rest Days per Week</label>
                  <select
                    name="restDays"
                    value={formData.restDays}
                    onChange={handleInputChange}
                  >
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Plan Duration (weeks)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="4"
                    max="52"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </button>
          
          <button className="btn btn-secondary" onClick={handleRegenerate}>
            <RotateCcw size={16} />
            Generate New Plan
          </button>
        </div>

        {/* Preview */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4>Plan Preview</h4>
          <div className="grid grid-3">
            <div>
              <strong>Weekly Mileage:</strong> {formData.weeklyMileage} miles
            </div>
            <div>
              <strong>Frequency:</strong> {formData.workoutsPerWeek} times/week
            </div>
            <div>
              <strong>Long Run:</strong> {formData.longRunDistance} miles
            </div>
            <div>
              <strong>Target Pace:</strong> {formData.paceTarget}
            </div>
            <div>
              <strong>Intensity:</strong> {formData.intensity}
            </div>
            <div>
              <strong>Duration:</strong> {formData.duration} weeks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCustomization;