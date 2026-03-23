import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function TaskInput({ user }) {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("High");
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    // 🔥 FIX 1: Check user
    if (!user || !user.uid) {
      alert("User not loaded yet. Please wait.");
      return;
    }

    // 🔥 FIX 2: Validation
    if (!name.trim()) {
      alert("Task required!");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "tasks"), {
        name,
        deadline,
        priority,
        completed: false,
        userId: user.uid,
        order: Date.now(),
        notified: false,
        createdAt: serverTimestamp()
      });

      // Reset
      setName("");
      setDeadline("");
      setPriority("High");

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter task"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button onClick={addTask} disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>

    </div>
  );
}

export default TaskInput;