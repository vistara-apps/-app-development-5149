import React, { useState } from 'react';
import { Crown, Check, X } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const SubscriptionPaywall = ({ onSubscribe }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createSession } = usePaymentContext();

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      await createSession("$9.99");
      localStorage.setItem('runcoach_subscription', 'active');
      onSubscribe();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    { name: 'AI-Powered Plan Updates', included: true },
    { name: 'Natural Language Commands', included: true },
    { name: 'Contextual Recommendations', included: true },
    { name: 'Advanced Plan Customization', included: true },
    { name: 'Progress Tracking & Analytics', included: true },
    { name: 'Calendar & Fitness Tracker Sync', included: true },
    { name: 'Unlimited Plan Modifications', included: true },
    { name: 'Priority Support', included: true }
  ];

  return (
    <div className="container">
      <div className="paywall">
        <Crown size={48} style={{ marginBottom: '1rem' }} />
        <h3>Unlock Your AI Running Coach</h3>
        <p>
          Get personalized training plans that adapt to your schedule, performance, and goals.
          Transform your running with AI-powered coaching.
        </p>
        
        <div className="card" style={{ margin: '2rem auto', maxWidth: '400px', background: 'white', color: '#333' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Pro Subscription</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
              $9.99<span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/month</span>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            {features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                {feature.included ? (
                  <Check size={16} color="#28a745" style={{ marginRight: '0.5rem' }} />
                ) : (
                  <X size={16} color="#dc3545" style={{ marginRight: '0.5rem' }} />
                )}
                <span style={{ fontSize: '0.9rem' }}>{feature.name}</span>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="btn btn-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            {isProcessing ? 'Processing...' : 'Subscribe Now'}
          </button>
        </div>

        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem' }}>
          <p>✓ Cancel anytime</p>
          <p>✓ 7-day money-back guarantee</p>
          <p>✓ Secure payment with blockchain</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaywall;