import React from 'react';

// Skeleton loader for stat cards
export const StatCardSkeleton = () => (
  <div className="card stat-card skeleton">
    <div className="stat-header">
      <div className="skeleton-icon"></div>
      <div className="skeleton-trend"></div>
    </div>
    <div className="stat-main">
      <div className="skeleton-value"></div>
      <div className="skeleton-unit"></div>
    </div>
    <div className="skeleton-label"></div>
  </div>
);

// Skeleton loader for weekly schedule
export const WeeklyScheduleSkeleton = () => (
  <div className="weekly-schedule-skeleton">
    {[...Array(7)].map((_, index) => (
      <div key={index} className="plan-item skeleton">
        <div className="skeleton-workout-info">
          <div className="skeleton-workout-type"></div>
          <div className="skeleton-workout-details"></div>
        </div>
        <div className="skeleton-duration"></div>
      </div>
    ))}
  </div>
);

// Skeleton loader for recommendations
export const RecommendationsSkeleton = () => (
  <div className="recommendations-skeleton">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="message assistant skeleton">
        <div className="skeleton-rec-header">
          <div className="skeleton-icon-small"></div>
          <div className="skeleton-rec-title"></div>
        </div>
        <div className="skeleton-rec-content"></div>
      </div>
    ))}
  </div>
);

// Enhanced loading spinner
export const LoadingSpinner = ({ size = 'medium', color = '#667eea' }) => {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner-medium',
    large: 'loading-spinner-large'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <div 
        className="spinner" 
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );
};

// Loading overlay for full components
export const LoadingOverlay = ({ children, isLoading, message = "Loading..." }) => (
  <div className="loading-overlay-container">
    {children}
    {isLoading && (
      <div className="loading-overlay">
        <div className="loading-content">
          <LoadingSpinner size="large" />
          <p className="loading-message">{message}</p>
        </div>
      </div>
    )}
  </div>
);
