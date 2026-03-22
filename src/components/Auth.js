import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email Signup
  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Email Login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Google Login
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google login successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔐 Login / Signup</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>

      <br /><br />

      {/* 🔥 GOOGLE BUTTON */}
      <button onClick={googleLogin} style={{ background: "#db4437" }}>
        🔥 Login with Google
      </button>

      <br /><br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Auth;