import React, { useEffect, useState } from "react";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [username, setUsername] = useState("");
  const API_BASE = "https://timesheet-backend-ra46.onrender.com";

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in again.");
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(`${API_BASE}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching employees:", error);
      alert("Failed to fetch employees. Please try again.");
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    fetchEmployees();
  }, []);


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
          <a href="/employees" style={{ color: "#FBBF24", fontWeight: "bold", textDecoration: "none" }}>Employees</a>
          <a href="/settings" style={{ color: "white", textDecoration: "none" }}>Settings</a>
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

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px" }}>
        <p className="welcome-text">Welcome, {username}</p>
        <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "10px" }}>
          👥 All Employees
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "25px" }}>
          View all registered users below
        </p>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {employees.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280" }}>
              No employees found.
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9" }}>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                    #
                  </th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                    Username
                  </th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px" }}>{index + 1}</td>
                    <td style={{ padding: "12px", textTransform: "capitalize" }}>
                      {emp.username || emp.name || emp.email.split("@")[0]}
                    </td>
                    <td style={{ padding: "12px" }}>{emp.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Employees;
