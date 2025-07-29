import React, { createContext, useContext, useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebase/config";
import { getIdToken } from "firebase/auth";
import API from "../utils/api"; // Axios instance for backend calls

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Google Login with domain restriction & backend verification
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Restrict to ccet.ac.in domain
      if (!email.endsWith("@ccet.ac.in")) {
        alert("You must use your CCET college email (@ccet.ac.in)!");
        await signOut(auth); // Logout immediately if email is invalid
        return;
      }

      // Get Firebase ID token
      const token = await getIdToken(result.user);

      // Send token to Flask for verification
      const res = await API.post("/verify-token", { token });
      console.log("Backend verification:", res.data);

      setUser(result.user);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Try again.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
