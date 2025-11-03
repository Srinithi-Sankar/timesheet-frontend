import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./AppStyles.css";

const Timesheet = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    project: "",
    task: "",
    hours: "",
    description: "",
  });

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/timesheet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/timesheet/add`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ date: "", project: "", task: "", hours: "", description: "" });
      fetchEntries();
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/timesheet/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntries();
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const handleEdit = (entry) => {
    setForm(entry);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="card timesheet-card">
          <h2 className="section-title">🕒 Add Timesheet Entry</h2>

          <form className="timesheet-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="project"
                placeholder="Project"
                value={form.project}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="task"
                placeholder="Task"
                value={form.task}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="hours"
                placeholder="Hours"
                value={form.hours}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-primary full-width">
              Add Entry
            </button>
          </form>
        </div>

        <div className="card entries-card">
          <h3 className="section-title">📁 Your Entries</h3>
          <table className="entries-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Task</th>
                <th>Hours</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.date}</td>
                    <td>{entry.project}</td>
                    <td>{entry.task}</td>
                    <td>{entry.hours}</td>
                    <td>{entry.description}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(entry)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(entry._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-entries">
                    No entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Timesheet;
