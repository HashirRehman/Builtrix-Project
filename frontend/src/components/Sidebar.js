import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Builtrix</h2>
        <div className="user-info">
          <div className="user-avatar">{user?.avatar || "U"}</div>
          <div className="user-details">
            <p className="user-name">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">👤</span>
          User Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout} title="Logout">
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
