import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [reportData, setReportData] = useState([]);

  const fetchEntries = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        alert("Please log in again.");
        window.location.href = "/login";
        return;
      }

      // ✅ Fetch user’s timesheet data from backend
      const res = await axios.get(`http://localhost:5000/api/timesheet/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const entries = res.data || [];

      // ✅ Group total hours by date
      const dateData = {};
      entries.forEach((entry) => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString("en-GB"); // e.g. 30/10/2025
        dateData[formattedDate] = (dateData[formattedDate] || 0) + Number(entry.hours || 0);
      });

      // ✅ Convert to recharts format
      const chartData = Object.keys(dateData).map((date) => ({
        date,
        hours: dateData[date],
      }));

      // ✅ Sort by date (oldest → newest)
      chartData.sort((a, b) => {
        const [da, ma, ya] = a.date.split("/").map(Number);
        const [db, mb, yb] = b.date.split("/").map(Number);
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
      });

      setReportData(chartData);
    } catch (error) {
      console.error("Error fetching report data:", error);
      alert("Failed to load report data.");
    }
  };

  useEffect(() => {
    fetchEntries();
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
          <a href="/reports" style={{ color: "#FBBF24", fontWeight: "bold",textDecoration: "none" }}>Reports</a>
          <a href="/employees" style={{ color:"white", fontWeight: "bold", textDecoration: "none" }}>Employees</a>
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
    <div style={{ padding: "30px" }}>
      <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>Reports Page</h2>

      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Daily Hours Summary
        </h3>

        {reportData.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No data available. Add entries in the Dashboard.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={reportData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#1E3A8A" name="Hours Worked" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  </div>  
  );
};

export default Reports;
