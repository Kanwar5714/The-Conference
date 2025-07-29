import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Room from "./components/Room";
import About from "./components/about";   // ✅ Fix: Import here
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function Home() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>tHe gAmE</h1>
        {user ? (
          <>
            <p>
              Hi, <b>{user.displayName}</b> <br />({user.email})
            </p>
            <button className="join-btn" onClick={() => navigate("/room")}>
              Join Room
            </button>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={login}>
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google"
              className="google-icon"
            />
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/about" element={<About />} />  {/* ✅ About page */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
