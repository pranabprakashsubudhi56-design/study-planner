import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function TaskInput({ user }) {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("High");

  const addTask = async () => {
    if (!name.trim()) return alert("Task required!");

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

    setName("");
    setDeadline("");
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default TaskInput;