import React from "react";
import "./AppStyles.css";

const Settings = () => {
  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "user@example.com";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        style={{
          width: "250px",
          backgroundColor: "#1E3A8A",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "30px" }}>
          Timesheet App
        </h2>
        <div className="nav-links" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</a>
          <a href="/reports" style={{ color: "white", textDecoration: "none" }}>Reports</a>
          <a href="/employees" style={{ color: "white", textDecoration: "none" }}>Employees</a>
          <a href="/settings" style={{ color: "#FBBF24",  fontWeight: "bold",textDecoration: "none" }}>Settings</a>
        </div>

        <div style={{ position: "absolute", bottom: "20px" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="profile"
            style={{ width: "60px", height: "60px", borderRadius: "50%" }}
          />
          <p>{localStorage.getItem("username") || "User"}</p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              marginTop: "10px",
              backgroundColor: "red",
              border: "none",
              padding: "8px 12px",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <h1 className="page-title">Settings</h1>
        <div className="card settings-card">
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Password:</strong> ********
          </p>
          <p>
            <strong>Role:</strong> Employee
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
