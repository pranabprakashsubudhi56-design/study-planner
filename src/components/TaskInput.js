import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

function TaskInput({ user, tasks }) {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("High");

  const addTask = async () => {
    if (!name) return;

    await addDoc(collection(db, "tasks"), {
      name,
      deadline,
      priority,
      completed: false,
      userId: user.uid,
      order: tasks.length // 🔥 IMPORTANT for drag order
    });

    setName("");
    setDeadline("");
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

      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default TaskInput;