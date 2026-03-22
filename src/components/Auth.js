import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import "./Auth.css";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // 🔥 SIGNUP
  const handleSignup = async () => {
    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCred.user, {
        displayName: name
      });

      await sendEmailVerification(userCred.user);

      alert("Check your email for verification!");
      setIsSignup(false);

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);

      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        alert("Verify your email first!");
        return;
      }

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  // 🔑 RESET PASSWORD
  const handleResetPassword = async () => {
    if (!email) return alert("Enter email first!");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        {isSignup && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={isSignup ? handleSignup : handleLogin}>
          {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
        </button>

        {!isSignup && (
          <p className="link" onClick={handleResetPassword}>
            Forgot Password?
          </p>
        )}

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          🔵 Continue with Google
        </button>

        <p className="toggle" onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "New here? Create account"}
        </p>
      </div>

    </div>
  );
}

export default Auth;