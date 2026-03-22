import React from "react";

function Progress({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const percent =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return <h2>📊 Progress: {percent}%</h2>;
}

export default Progress;