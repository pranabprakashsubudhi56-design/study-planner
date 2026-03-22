import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartView({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const data = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#00c9a7", "#ff4d4d"],
      },
    ],
  };

  return <Doughnut data={data} />;
}

export default ChartView;