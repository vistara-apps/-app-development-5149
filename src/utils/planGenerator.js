export const generateInitialPlan = (user) => {
  const { fitness_level, goals, preferences = {} } = user;
  
  const basePlans = {
    beginner: {
      weeklyMileage: 15,
      workoutsPerWeek: 3,
      longRunDistance: 5,
      paceTarget: '10:00'
    },
    intermediate: {
      weeklyMileage: 25,
      workoutsPerWeek: 4,
      longRunDistance: 8,
      paceTarget: '8:30'
    },
    advanced: {
      weeklyMileage: 40,
      workoutsPerWeek: 5,
      longRunDistance: 12,
      paceTarget: '7:00'
    }
  };

  const basePlan = basePlans[fitness_level] || basePlans.beginner;
  
  return {
    id: Date.now(),
    name: `${fitness_level} ${goals} Plan`,
    duration: preferences.duration || 12, // weeks
    weeklyMileage: preferences.weeklyMileage || basePlan.weeklyMileage,
    workoutsPerWeek: preferences.workoutsPerWeek || basePlan.workoutsPerWeek,
    longRunDistance: preferences.longRunDistance || basePlan.longRunDistance,
    paceTarget: preferences.paceTarget || basePlan.paceTarget,
    restDays: preferences.restDays || 2,
    intensity: preferences.intensity || 'moderate',
    weeklyPlan: generateWeeklyPlan(basePlan),
    created: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
};

export const generateWeeklyPlan = (planParams) => {
  const { weeklyMileage, workoutsPerWeek, longRunDistance, paceTarget } = planParams;
  
  const workouts = [];
  const remainingMileage = weeklyMileage - longRunDistance;
  const easyRunDistance = Math.max(3, Math.floor(remainingMileage / (workoutsPerWeek - 1)));
  
  // Generate weekly schedule
  const schedule = [
    { day: 'Monday', type: 'Easy Run', distance: easyRunDistance, pace: adjustPace(paceTarget, 1.2) },
    { day: 'Tuesday', type: 'Interval Training', distance: 5, pace: adjustPace(paceTarget, 0.8) },
    { day: 'Wednesday', type: 'Rest', distance: 0, pace: null },
    { day: 'Thursday', type: 'Tempo Run', distance: easyRunDistance, pace: adjustPace(paceTarget, 0.9) },
    { day: 'Friday', type: 'Rest', distance: 0, pace: null },
    { day: 'Saturday', type: 'Long Run', distance: longRunDistance, pace: adjustPace(paceTarget, 1.1) },
    { day: 'Sunday', type: 'Recovery Run', distance: Math.max(2, easyRunDistance - 1), pace: adjustPace(paceTarget, 1.3) }
  ];

  return schedule.filter((workout, index) => {
    if (workout.type === 'Rest') return true;
    return index < workoutsPerWeek + 2; // Include rest days
  });
};

const adjustPace = (basePace, multiplier) => {
  const [minutes, seconds] = basePace.split(':').map(Number);
  const totalSeconds = (minutes * 60 + seconds) * multiplier;
  const newMinutes = Math.floor(totalSeconds / 60);
  const newSeconds = Math.round(totalSeconds % 60);
  return `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
};