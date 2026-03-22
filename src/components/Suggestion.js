import React from "react";

function Suggestion({ tasks }) {
  let high = tasks.filter(t => t.priority === "High" && !t.completed);

  let text = "";

  if (tasks.length === 0) {
    text = "Add tasks to get started 🚀";
  } else if (high.length > 0) {
    text = "Focus on: " + high[0].name;
  } else {
    text = "Great progress! Keep going 💪";
  }

  return <h3>🧠 {text}</h3>;
}

export default Suggestion;