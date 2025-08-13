import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setIsLoggingOut(true);
      await logout();
    }
  };

  if (!user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {user.avatar}
            </div>
            <div className="avatar-info">
              <h2>{user.firstName} {user.lastName}</h2>
              <p className="user-role-badge">{user.role}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>First Name</label>
              <div className="detail-value">{user.firstName}</div>
            </div>

            <div className="detail-group">
              <label>Last Name</label>
              <div className="detail-value">{user.lastName}</div>
            </div>

            <div className="detail-group">
              <label>Email Address</label>
              <div className="detail-value">{user.email}</div>
            </div>

            <div className="detail-group">
              <label>Role</label>
              <div className="detail-value">
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="detail-group">
              <label>User ID</label>
              <div className="detail-value">#{user.id}</div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <LoadingSpinner size="small" />
                  Logging out...
                </>
              ) : (
                <>
                  <span>🚪</span>
                  Logout
                </>
              )}
            </button>
          </div>
        </div>

        <div className="profile-stats">
          <h3>Dashboard Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <span className="stat-number">15</span>
                <span className="stat-label">Buildings</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-number">1.5M+</span>
                <span className="stat-label">Data Points</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Monitoring</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔋</div>
              <div className="stat-info">
                <span className="stat-number">Real-time</span>
                <span className="stat-label">Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
