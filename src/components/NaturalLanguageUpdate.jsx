import React, { useState } from 'react';
import { Send, Brain, MessageSquare } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import { processNaturalLanguageUpdate } from '../utils/nlpProcessor';

const NaturalLanguageUpdate = () => {
  const { currentPlan, updatePlan } = usePlan();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hi! I can help you adjust your running plan using natural language. Try saying things like "Increase my weekly mileage by 5 miles" or "Make my long run shorter this week".'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      const result = await processNaturalLanguageUpdate(userMessage, currentPlan);
      
      let responseContent = result.explanation;
      
      if (result.intent === 'modify_plan' && result.confidence > 0.7) {
        // Apply modifications
        const modifications = Object.fromEntries(
          Object.entries(result.modifications).filter(([key, value]) => value !== null)
        );
        
        if (Object.keys(modifications).length > 0) {
          updatePlan(modifications);
          responseContent += '\n\n✅ Your plan has been updated!';
        }
      }
      
      if (result.suggestions && result.suggestions.length > 0) {
        responseContent += '\n\nSuggestions:\n' + result.suggestions.map(s => `• ${s}`).join('\n');
      }

      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: responseContent 
      }]);

    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again or be more specific.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const examples = [
    "Increase my weekly mileage by 5 miles",
    "Make my long run 2 miles shorter",
    "Change my target pace to 8:30",
    "Add one more workout per week",
    "Switch to easy intensity training"
  ];

  return (
    <div className="container">
      <div className="card">
        <h2>
          <Brain size={24} style={{ marginRight: '0.5rem' }} />
          AI Plan Updates
        </h2>
        
        <p>Use natural language to modify your training plan. I understand commands about pace, distance, frequency, and intensity.</p>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div style={{ whiteSpace: 'pre-line' }}>
                {message.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="message assistant">
              <div className="loading"></div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me how to adjust your plan..."
            disabled={isProcessing}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isProcessing || !input.trim()}
          >
            <Send size={16} />
          </button>
        </form>

        {/* Example Commands */}
        <div style={{ marginTop: '1rem' }}>
          <h4>Example Commands:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {examples.map((example, index) => (
              <button
                key={index}
                className="btn btn-secondary"
                onClick={() => setInput(example)}
                style={{ fontSize: '0.85rem', padding: '0.5rem' }}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Current Plan Summary */}
        {currentPlan && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Current Plan Summary:</h4>
            <div className="grid grid-3">
              <div><strong>Weekly Miles:</strong> {currentPlan.weeklyMileage}</div>
              <div><strong>Workouts/Week:</strong> {currentPlan.workoutsPerWeek}</div>
              <div><strong>Long Run:</strong> {currentPlan.longRunDistance} mi</div>
              <div><strong>Target Pace:</strong> {currentPlan.paceTarget}</div>
              <div><strong>Intensity:</strong> {currentPlan.intensity}</div>
              <div><strong>Rest Days:</strong> {currentPlan.restDays}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaturalLanguageUpdate;