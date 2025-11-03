import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppStyles.css";
import API from "../api"; // ✅ Import your API instance

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();




const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/register", {
      name,
      email,
      password,
    });

    alert(res.data.message || "Registration successful!");
    navigate("/dashboard");
  } catch (error) {
    console.error("Register error:", error);
    alert(error.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Create an Account</h2>
        <form onSubmit={handleRegister} className="login-form">
          <input
            type="text"
            placeholder="Full Name"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
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
            Register
          </button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
