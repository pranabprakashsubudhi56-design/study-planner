import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 SIGNUP
  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ FIXED: using name
      await updateProfile(userCred.user, {
        displayName: name
      });

      await sendEmailVerification(userCred.user);

      alert("Signup successful! Check your email for verification.");
      setIsSignup(false);

    } catch (err) {
      alert(err.message);
    }
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        alert("Please verify your email first!");
        return;
      }

      alert("Login successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{isSignup ? "📝 Sign Up" : "🔐 Login"}</h2>

      {isSignup && (
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

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

      {isSignup ? (
        <button onClick={handleSignup}>Sign Up</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      <br /><br />

      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup
          ? "Already have an account? Login"
          : "New user? Sign up"}
      </p>
    </div>
  );
}

export default Auth;