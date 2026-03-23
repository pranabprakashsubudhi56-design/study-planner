import React from "react";

function Suggestion({ tasks }) {
  let sorted = tasks
    .filter(t => !t.completed && t.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  let text = "";

  if (tasks.length === 0) {
    text = "Add tasks to get started 🚀";
  } else if (sorted.length > 0) {
    text = "Focus on: " + sorted[0].name;
  } else {
    text = "Great work! 🎉";
  }

  return <h3>🧠 {text}</h3>;
}

export default Suggestion;