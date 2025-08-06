import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const processNaturalLanguageUpdate = async (userInput, currentPlan) => {
  try {
    const prompt = `
You are an expert AI Running Coach with deep knowledge of training methodology, exercise physiology, and personalized coaching. You help runners optimize their training plans through natural language conversation.

CURRENT TRAINING PLAN:
📊 Weekly Mileage: ${currentPlan.weeklyMileage} miles
🏃 Workouts/Week: ${currentPlan.workoutsPerWeek}
🎯 Long Run: ${currentPlan.longRunDistance} miles
⏱️ Target Pace: ${currentPlan.paceTarget}
💪 Intensity: ${currentPlan.intensity}
😴 Rest Days: ${currentPlan.restDays}

USER REQUEST: "${userInput}"

As an AI coach, analyze this request with expertise and return a JSON response:

{
  "intent": "modify_plan|question|unclear",
  "confidence": 0.9,
  "modifications": {
    "weeklyMileage": number or null,
    "workoutsPerWeek": number or null,
    "longRunDistance": number or null,
    "paceTarget": "string" or null,
    "intensity": "easy|moderate|hard" or null,
    "restDays": number or null
  },
  "explanation": "Professional coaching explanation with reasoning",
  "suggestions": ["Smart coaching suggestions based on the change"]
}

COACHING GUIDELINES:
- Be encouraging and supportive in your explanations
- Provide scientific reasoning when appropriate
- Consider injury prevention and progressive overload
- Only modify explicitly mentioned parameters
- Give actionable suggestions that complement the change
- Use emojis sparingly but effectively for engagement
`;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('NLP processing error:', error);
    return {
      intent: "unclear",
      confidence: 0,
      modifications: {},
      explanation: "I couldn't understand your request. Please try rephrasing it.",
      suggestions: ["Try being more specific about what you'd like to change"]
    };
  }
};

export const generateContextualRecommendations = async (userProfile, currentPlan, contextData = {}) => {
  try {
    const prompt = `
You are a running coach AI providing contextual recommendations.

User Profile:
- Fitness Level: ${userProfile.fitness_level}
- Goals: ${userProfile.goals}

Current Plan:
- Weekly Mileage: ${currentPlan.weeklyMileage} miles
- Target pace: ${currentPlan.paceTarget}
- Intensity: ${currentPlan.intensity}

Context Data:
- Weather forecast: ${contextData.weather || 'Unknown'}
- Recent performance: ${contextData.performance || 'Unknown'}
- Schedule changes: ${contextData.schedule || 'None'}
- Energy level: ${contextData.energy || 'Normal'}

Provide 3-5 personalized recommendations to optimize their training this week. Return as JSON:
{
  "recommendations": [
    {
      "type": "adjustment|tip|warning",
      "title": "Brief title",
      "description": "Detailed explanation",
      "priority": "high|medium|low"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.recommendations;
  } catch (error) {
    console.error('Recommendation generation error:', error);
    return [
      {
        type: "tip",
        title: "Stay Consistent",
        description: "Focus on completing your scheduled runs this week to build a strong foundation.",
        priority: "medium"
      }
    ];
  }
};
