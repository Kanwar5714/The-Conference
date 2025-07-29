import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>tHE gAmE bY kAnWaR </h1>
      </div>
      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="/about">About</a>
      </div>
    </nav>
  );
}

export default Navbar;
