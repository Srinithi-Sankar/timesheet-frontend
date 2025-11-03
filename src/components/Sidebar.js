import React from "react";
import "../pages/AppStyles.css";

const Sidebar = () => {
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  // Detect current path for active highlight
  const currentPath = window.location.pathname;

  return (
    <nav className="sidebar">
      {/* ----------- Navigation Links ----------- */}
      <div className="nav-links">
        <a
          href="/dashboard"
          className={currentPath === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </a>

        <a
          href="/reports"
          className={currentPath === "/reports" ? "active" : ""}
        >
          Reports
        </a>

        <a
          href="/employees"
          className={currentPath === "/employees" ? "active" : ""}
        >
          Employees
        </a>

        <a
          href="/settings"
          className={currentPath === "/settings" ? "active" : ""}
        >
          Settings
        </a>
      </div>

      {/* ----------- Profile Section ----------- */}
      <div className="profile-section">
        <div className="profile-info">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="profile"
            className="profile-icon"
          />
          <span className="username">{username}</span>
        </div>

        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
