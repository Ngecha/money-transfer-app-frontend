import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsCard() {
  // Sample data for transactions
  const sampleData = {
    sent_count: 40,
    received_count: 35,
    pending_count: 15,
    failed_count: 10,
  };

  // Chart data configuration
  const transactionSummary = {
    labels: ["Sent", "Received", "Pending", "Failed"],
    datasets: [
      {
        label: "Transactions",
        data: [
          sampleData.sent_count,
          sampleData.received_count,
          sampleData.pending_count,
          sampleData.failed_count,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-semibold mb-4">User Analytics </h3>
      <div className="space-y-6 grid flex grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="h-48">
          <h4 className="text-lg font-medium mb-2">Transaction Summary</h4>
          <Bar data={transactionSummary} options={options} />
        </div>

        {/* Pie Chart */}
        <div className="h-48 ">
          <h4 className="text-lg font-medium mb-2">Transaction Breakdown</h4>
          <Pie data={transactionSummary} />
        </div>
      </div>
    </div>
  );
}
