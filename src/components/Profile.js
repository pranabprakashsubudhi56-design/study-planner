import React from "react";
import { auth } from "../firebase";

function Profile() {
  const user = auth.currentUser;

  if (!user) return null;

  return (
    <div className="card">
      <h3>👤 Profile</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User ID:</strong> {user.uid}</p>

      {user.photoURL && (
        <img src={user.photoURL} alt="profile" width="60" />
      )}
    </div>
  );
}

export default Profile;