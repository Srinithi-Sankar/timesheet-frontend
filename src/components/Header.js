import React from "react";
import "./Header.css";

const Header = ({ user }) => {
  return (
    <header className="header">
      <h1>Welcome, {user?.name || "User"} 👋</h1>
      <div className="header-right">
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </header>
  );
};

export default Header;
