import React from "react";
import { Link } from "react-router-dom";
import "./../pages/AppStyles.css";

const Navbar = () => (
  <nav className="navbar">
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/reports">Reports</Link>
    <Link to="/settings">Settings</Link>
    <Link to="/profile">Profile</Link>
    <Link to="/login" onClick={() => localStorage.clear()}>Logout</Link>
  </nav>
);

export default Navbar;
