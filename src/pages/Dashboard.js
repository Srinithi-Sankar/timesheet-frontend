import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [date, setDate] = useState("");
  const [project, setProject] = useState("");
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState([]);
  const [username, setUsername] = useState("");
  const [clockInTime, setClockInTime] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);

  // ✅ Correct backend base URL (no /api)
  const API_BASE = "https://timesheet-backend-ra46.onrender.com";

  // Fetch entries for the logged-in user
  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in again.");
        window.location.href = "/login";
        return;
      }

      // ✅ FIXED: use correct route `/timesheet`
      const res = await axios.get(`${API_BASE}/timesheet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEntries(res.data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
      alert("Failed to fetch entries. Please try again.");
    }
  };

  // Add new entry
 const handleAddEntry = async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    alert("User not found. Please log in again.");
    window.location.href = "/login";
    return;
  }

  try {
    // 🧮 Convert formatted "1 hr 6 min" → numeric total hours
    let numericHours = 0;
    if (hours.includes("hr")) {
      const [hrPart, minPart] = hours.split("hr");
      const h = parseInt(hrPart.trim()) || 0;
      const m = parseInt(minPart) || 0;
      numericHours = h + m / 60;
    } else if (hours.includes("min")) {
      numericHours = parseInt(hours) / 60 || 0;
    } else {
      numericHours = Number(hours) || 0;
    }

    await axios.post(
      `${API_BASE}/timesheet/add`,
      { userId, date, project, task, hours: numericHours, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Entry added successfully!");
    setDate("");
    setProject("");
    setTask("");
    setHours("");
    setDescription("");
    fetchEntries();
  } catch (error) {
    console.error("Error adding entry:", error);
    alert("Failed to add entry. Please try again.");
  }
};


  // Delete an entry
  const handleDeleteEntry = async (entryId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in again.");
        window.location.href = "/login";
        return;
      }

      if (!window.confirm("Are you sure you want to delete this entry?")) return;

      // ✅ correct route stays same
      await axios.delete(`${API_BASE}/timesheet/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Entry deleted successfully!");
      fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  // 🕒 Handle Clock In / Clock Out
  const handleClockIn = () => {
    if (isClockedIn) return;
    const now = new Date();
    setClockInTime(now);
    setIsClockedIn(true);
    localStorage.setItem("clockInTime", now.toISOString());
    localStorage.setItem("isClockedIn", "true");
    alert("Clocked in successfully!");
  };

 const handleClockOut = () => {
  if (!isClockedIn || !clockInTime) return;

  const clockOutTime = new Date();
  const diffMs = clockOutTime - new Date(clockInTime);

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;

  // 🕒 Save display-friendly string like "1 hr 6 min" or "16 min"
  const formattedTime =
    hoursPart > 0
      ? `${hoursPart} hr${hoursPart > 1 ? "s" : ""} ${minutesPart} min`
      : `${minutesPart} min`;

  setHours(formattedTime);
  setIsClockedIn(false);
  setClockInTime(null);

  localStorage.removeItem("clockInTime");
  localStorage.removeItem("isClockedIn");

  alert(`Clocked out! Total time: ${formattedTime}`);
};

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    setUsername(storedName || "User");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please login again");
      window.location.href = "/login";
    } else {
      fetchEntries();
    }

    const savedClockIn = localStorage.getItem("clockInTime");
    const savedIsClockedIn = localStorage.getItem("isClockedIn") === "true";
    if (savedClockIn && savedIsClockedIn) {
      setClockInTime(new Date(savedClockIn));
      setIsClockedIn(true);
    }
  }, []);


  return (
    // ✅ The rest of your UI remains unchanged
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
          <a href="/dashboard" style={{ color: "#FBBF24", fontWeight: "bold", textDecoration: "none" }}>Dashboard</a>
          <a href="/reports" style={{ color: "white", textDecoration: "none" }}>Reports</a>
          <a href="/employees" style={{ color: "white", textDecoration: "none" }}>Employees</a>
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
      {/* Main Dashboard */}
      <div className="dashboard-container" style={{ padding: "20px", flex: 1 }}>
        {/* Welcome Text */}
        <div
          style={{
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Welcome, <span style={{ textTransform: "capitalize" }}>{username}</span> 👋
        </div>

        {/* Timesheet Entry + Your Entries Side by Side */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "30px",
            flexWrap: "nowrap",
          }}
        >
          {/* Add Entry Form */}
          <form
            onSubmit={handleAddEntry}
            style={{
              maxWidth: "600px",
              margin: "0 auto 30px auto",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3>Add Timesheet Entry</h3>

            {/* 🕒 Clock In / Out Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleClockIn}
                disabled={isClockedIn}
                style={{
                  backgroundColor: isClockedIn ? "gray" : "green",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: isClockedIn ? "not-allowed" : "pointer",
                }}
              >
                Clock In
              </button>
              <button
                type="button"
                onClick={handleClockOut}
                disabled={!isClockedIn}
                style={{
                  backgroundColor: !isClockedIn ? "gray" : "#eab308",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: !isClockedIn ? "not-allowed" : "pointer",
                }}
              >
                Clock Out
              </button>
            </div>

            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <input type="text" placeholder="Project" value={project} onChange={(e) => setProject(e.target.value)} required />
            <input type="text" placeholder="Task" value={task} onChange={(e) => setTask(e.target.value)} required />

            {/* Hours auto-filled after Clock Out */}
            <input
            type="text"
            placeholder="Time worked (auto-filled, e.g. 1 hr 6 min)"
            value={hours}
            readOnly
            style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
            />


            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#0a4d94",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add Entry
            </button>
          </form>

          {/* Your Entries */}
          <div
            style={{
              flex: 1,
              minWidth: "50%",
              backgroundColor: "white",
              padding: "5px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxHeight: "400px",
            }}
          >
            <h3>Your Entries</h3>
            {entries.length === 0 ? (
              <p>No entries found.</p>
            ) : (
              <table
                border="1"
                cellPadding="10"
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Task</th>
                    <th>Hours</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry._id}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.project}</td>
                      <td>{entry.task}</td>
                      <td>{entry.hours}</td>
                      <td>{entry.description || "-"}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteEntry(entry._id)}
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
