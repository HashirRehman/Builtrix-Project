import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = ({ title = "Dashboard" }) => {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
        <div className="breadcrumb">
          <span>Builtrix Energy Dashboard</span>
          <span className="separator">›</span>
          <span className="current">{title}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Active Buildings</span>
            <span className="stat-value">15</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Data Points</span>
            <span className="stat-value">1.5M+</span>
          </div>
        </div>

        <div className="user-menu">
          <div className="user-avatar-small">{user?.avatar || "U"}</div>
          <div className="user-info-header">
            <span className="user-name-header">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="user-role">{user?.role || "User"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
