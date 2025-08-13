import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Builtrix</h2>
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
    </div>
  );
};

export default Sidebar;
