import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const WeeklySchedule = ({ plan }) => {
  if (!plan?.weeklyPlan) {
    return <p>No schedule available</p>;
  }

  const getWorkoutIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'rest':
        return '🛌';
      case 'easy run':
        return '🏃';
      case 'long run':
        return '🏃‍♂️';
      case 'interval training':
        return '⚡';
      case 'tempo run':
        return '🔥';
      case 'recovery run':
        return '💚';
      default:
        return '🏃';
    }
  };

  const getWorkoutColor = (type) => {
    switch (type.toLowerCase()) {
      case 'rest':
        return '#6c757d';
      case 'easy run':
        return '#28a745';
      case 'long run':
        return '#dc3545';
      case 'interval training':
        return '#ffc107';
      case 'tempo run':
        return '#fd7e14';
      case 'recovery run':
        return '#20c997';
      default:
        return '#667eea';
    }
  };

  return (
    <div>
      {plan.weeklyPlan.map((workout, index) => (
        <div key={index} className="plan-item" style={{ borderLeft: `4px solid ${getWorkoutColor(workout.type)}` }}>
          <div>
            <div className="workout-type">
              <span style={{ marginRight: '0.5rem' }}>{getWorkoutIcon(workout.type)}</span>
              {workout.day} - {workout.type}
            </div>
            {workout.distance > 0 && (
              <div className="workout-details">
                <MapPin size={14} style={{ marginRight: '0.25rem', display: 'inline' }} />
                {workout.distance} miles
                {workout.pace && (
                  <>
                    <Clock size={14} style={{ margin: '0 0.25rem 0 0.5rem', display: 'inline' }} />
                    {workout.pace} pace
                  </>
                )}
              </div>
            )}
          </div>
          {workout.distance > 0 && (
            <div className="workout-duration">
              ~{Math.round(workout.distance * (workout.pace ? parseInt(workout.pace.split(':')[0]) : 9))} min
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeeklySchedule;