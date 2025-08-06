import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProgressChart = ({ plan }) => {
  // Generate sample progress data
  const progressData = [
    { week: 'Week 1', mileage: plan.weeklyMileage * 0.8, pace: plan.paceTarget },
    { week: 'Week 2', mileage: plan.weeklyMileage * 0.9, pace: plan.paceTarget },
    { week: 'Week 3', mileage: plan.weeklyMileage, pace: plan.paceTarget },
    { week: 'Week 4', mileage: plan.weeklyMileage * 1.1, pace: plan.paceTarget },
  ];

  const workoutDistribution = plan.weeklyPlan
    .filter(w => w.distance > 0)
    .map(w => ({
      type: w.type,
      distance: w.distance,
    }));

  return (
    <div className="grid grid-2">
      <div>
        <h4>Weekly Mileage Progression</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="mileage" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4>Workout Distribution</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={workoutDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="distance" fill="#764ba2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;