import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Student Video Room</h1>

        {user ? (
          <>
            <p>
              Hi, <b>{user.displayName}</b> <br />({user.email})
            </p>
            <button
              className="join-btn"
              onClick={() => navigate("/room")}
            >
              Join Room
            </button>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={login}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4e/G_Logo.svg"
              alt="Google"
              style={{ width: "20px", marginRight: "8px" }}
            />
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
