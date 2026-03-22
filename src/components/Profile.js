import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Profile() {
  const [user, setUser] = useState(null);

  // 🔥 Real-time user update
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "20px"
    }}>

      {/* 👤 Avatar */}
      <div>
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="profile"
            width="70"
            style={{
              borderRadius: "50%",
              border: "2px solid #22c55e"
            }}
          />
        ) : (
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px"
          }}>
            {user.displayName ? user.displayName[0].toUpperCase() : "U"}
          </div>
        )}
      </div>

      {/* 📄 Info */}
      <div>
        <h3 style={{ marginBottom: "5px" }}>
          {user.displayName || "User"}
        </h3>

        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          {user.email}
        </p>

        <p style={{ fontSize: "12px", color: "#64748b" }}>
          ID: {user.uid.slice(0, 8)}...
        </p>
      </div>

    </div>
  );
}

export default Profile;