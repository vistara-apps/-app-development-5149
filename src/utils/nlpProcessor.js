import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const processNaturalLanguageUpdate = async (userInput, currentPlan) => {
  try {
    const prompt = `
You are a running coach AI. The user wants to modify their training plan using natural language.

Current Plan:
- Weekly Mileage: ${currentPlan.weeklyMileage} miles
- Workouts per week: ${currentPlan.workoutsPerWeek}
- Long run distance: ${currentPlan.longRunDistance} miles
- Target pace: ${currentPlan.paceTarget}
- Intensity: ${currentPlan.intensity}
- Rest days: ${currentPlan.restDays}

User Request: "${userInput}"

Please analyze this request and return a JSON object with the following structure:
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
  "explanation": "Clear explanation of what will be changed and why",
  "suggestions": ["Additional helpful suggestions"]
}

Only modify fields that the user specifically mentioned. Set others to null.
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