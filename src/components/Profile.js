import React from "react";
import { auth } from "../firebase";

function Profile() {
  const user = auth.currentUser;

  if (!user) return null;

  return (
    <div>
      <h3>👤 User Profile</h3>

      <p><strong>Name:</strong> {user.displayName || "Not set"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User ID:</strong> {user.uid}</p>

      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="profile"
          width="70"
          style={{ borderRadius: "50%", marginTop: "10px" }}
        />
      )}
    </div>
  );
}

export default Profile;