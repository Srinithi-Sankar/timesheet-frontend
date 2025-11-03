import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppStyles.css";
import API from "../api"; // ✅ Import your API instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("username", data.user.name);
    alert("Login successful!");
    navigate("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    alert(error.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Timesheet App Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="register-text">
          Don’t have an account?{" "}
          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
