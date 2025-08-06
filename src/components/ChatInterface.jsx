import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Sparkles, Zap, Target, TrendingUp, MessageCircle, Loader2 } from 'lucide-react';

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  isProcessing, 
  suggestions = [],
  currentPlan 
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isProcessing) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'user':
        return <MessageCircle size={16} />;
      case 'assistant':
        return <Brain size={16} />;
      case 'system':
        return <Sparkles size={16} />;
      default:
        return <MessageCircle size={16} />;
    }
  };

  const getMessageTypeClass = (type) => {
    switch (type) {
      case 'user':
        return 'message-user';
      case 'assistant':
        return 'message-assistant';
      case 'system':
        return 'message-system';
      default:
        return 'message-user';
    }
  };

  return (
    <div className="chat-interface">
      {/* AI Coach Header */}
      <div className="chat-header">
        <div className="coach-avatar">
          <Brain size={24} />
          <div className="coach-status online"></div>
        </div>
        <div className="coach-info">
          <h3>AI Running Coach</h3>
          <p className="coach-status-text">
            {isProcessing ? 'Analyzing your request...' : 'Ready to help optimize your training'}
          </p>
        </div>
        <div className="coach-indicators">
          <div className="indicator">
            <Zap size={16} />
            <span>Smart</span>
          </div>
          <div className="indicator">
            <Target size={16} />
            <span>Personalized</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="chat-messages-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${getMessageTypeClass(message.type)}`}>
              <div className="message-avatar">
                {getMessageIcon(message.type)}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {message.content}
                </div>
                <div className="message-timestamp">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {(isProcessing || isTyping) && (
            <div className="chat-message message-assistant">
              <div className="message-avatar">
                <Brain size={16} />
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">AI Coach is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions */}
      {suggestions.length > 0 && !isProcessing && (
        <div className="chat-suggestions">
          <div className="suggestions-header">
            <Sparkles size={16} />
            <span>Quick Commands</span>
          </div>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <TrendingUp size={14} />
                <span>"{suggestion}"</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="chat-input-container">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me how to adjust your training plan..."
              disabled={isProcessing}
              className="chat-input-field"
            />
            <div className="input-indicators">
              {input.length > 0 && (
                <div className="char-count">
                  {input.length}
                </div>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            className={`chat-send-button ${input.trim() ? 'active' : ''}`}
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing ? (
              <Loader2 size={20} className="spinning" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        
        {/* Input Help Text */}
        <div className="input-help">
          <div className="help-item">
            <span className="help-icon">💡</span>
            <span>Try: "Increase weekly mileage by 5 miles" or "Make tomorrow's run easier"</span>
          </div>
        </div>
      </form>

      {/* Current Plan Quick View */}
      {currentPlan && (
        <div className="plan-quick-view">
          <div className="plan-header">
            <Target size={16} />
            <span>Current Plan</span>
          </div>
          <div className="plan-stats">
            <div className="plan-stat">
              <span className="stat-value">{currentPlan.weeklyMileage}</span>
              <span className="stat-label">miles/week</span>
            </div>
            <div className="plan-stat">
              <span className="stat-value">{currentPlan.workoutsPerWeek}</span>
              <span className="stat-label">workouts</span>
            </div>
            <div className="plan-stat">
              <span className="stat-value">{currentPlan.paceTarget}</span>
              <span className="stat-label">target pace</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
