import React, { useState } from 'react';
import { Brain, Sparkles, Zap, Target } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import { processNaturalLanguageUpdate } from '../utils/nlpProcessor';
import ChatInterface from './ChatInterface';
import { useToast } from './ToastNotification';

const NaturalLanguageUpdate = () => {
  const { currentPlan, updatePlan } = usePlan();
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: '🏃‍♂️ Welcome to your AI Running Coach! I\'m here to help you optimize your training plan using natural language. Just tell me what you\'d like to adjust and I\'ll make it happen.'
    },
    {
      type: 'assistant',
      content: 'I can help you modify your training plan in real-time. Try commands like "Increase my weekly mileage by 5 miles" or "Make tomorrow\'s run easier". I understand pace, distance, frequency, and intensity adjustments.'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSendMessage = async (userInput) => {
    const userMessage = { type: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const result = await processNaturalLanguageUpdate(userInput, currentPlan);
      
      if (result.intent === 'modify_plan' && result.confidence > 0.7) {
        // Apply modifications
        const updatedPlan = { ...currentPlan };
        let changesApplied = false;
        
        Object.keys(result.modifications).forEach(key => {
          if (result.modifications[key] !== null) {
            updatedPlan[key] = result.modifications[key];
            changesApplied = true;
          }
        });
        
        if (changesApplied) {
          updatePlan(updatedPlan);
          showSuccess('Training plan updated successfully!');
        }
        
        const assistantMessage = {
          type: 'assistant',
          content: `✅ ${result.explanation}\n\n${result.suggestions?.length > 0 ? '💡 Additional suggestions:\n' + result.suggestions.map(s => `• ${s}`).join('\n') : ''}`
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage = {
          type: 'assistant',
          content: `🤔 ${result.explanation}${result.suggestions?.length > 0 ? '\n\n💡 Try these instead:\n' + result.suggestions.map(s => `• ${s}`).join('\n') : ''}`
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (result.intent === 'unclear') {
          showError('I couldn\'t understand your request. Please try being more specific.');
        }
      }
    } catch (error) {
      console.error('Error processing request:', error);
      const errorMessage = {
        type: 'assistant',
        content: '⚠️ I encountered an error processing your request. Please check your internet connection and try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
      showError('Failed to process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestions = [
    "Increase my weekly mileage by 5 miles",
    "Make my long run 2 miles shorter", 
    "Change my target pace to 8:30",
    "Add one more workout per week",
    "Switch to easy intensity training",
    "Make tomorrow's run easier"
  ];

  return (
    <div className="container">
      <div className="modern-chat-container">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          suggestions={suggestions}
          currentPlan={currentPlan}
        />
      </div>
    </div>
  );
};

export default NaturalLanguageUpdate;
