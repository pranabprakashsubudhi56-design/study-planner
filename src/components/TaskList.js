import React from "react";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

function TaskList({ tasks }) {

  const toggle = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed
    });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} className="card">
          <h3>{task.name}</h3>
          <p>{task.deadline}</p>
          <p>{task.priority}</p>

          <button onClick={() => toggle(task)}>
            {task.completed ? "Done" : "Complete"}
          </button>

          <button onClick={() => remove(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;