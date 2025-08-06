import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  isVisible = true 
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose && onClose(), 300); // Wait for animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`toast-notification toast-${type} ${show ? 'toast-show' : 'toast-hide'}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        <div className="toast-message">
          {message}
        </div>
        <button className="toast-close" onClick={handleClose}>
          <X size={16} />
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>
    </div>
  );
};

// Toast container component
export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map((toast) => (
      <ToastNotification
        key={toast.id}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onClose={() => removeToast(toast.id)}
        isVisible={true}
      />
    ))}
  </div>
);

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast(message, 'success', duration);
  const showError = (message, duration) => addToast(message, 'error', duration);
  const showWarning = (message, duration) => addToast(message, 'warning', duration);
  const showInfo = (message, duration) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default ToastNotification;
