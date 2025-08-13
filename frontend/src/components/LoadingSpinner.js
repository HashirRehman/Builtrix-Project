import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false 
}) => {
  const spinnerClass = `loading-spinner ${size}`;
  const containerClass = `spinner-container ${overlay ? 'overlay' : ''}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
