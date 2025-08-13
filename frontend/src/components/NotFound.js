import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = ({ 
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist.',
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-icon">
          <span>404</span>
        </div>
        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>
        
        {showBackButton && (
          <div className="error-actions">
            <button 
              onClick={handleGoBack}
              className="back-button"
            >
              <span>←</span>
              Go to Dashboard
            </button>
          </div>
        )}
        
        <div className="error-details">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
