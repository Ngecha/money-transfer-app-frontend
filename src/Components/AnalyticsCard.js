import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

export default function AnalyticsCard({ transactionData }) {
  // Fallback for transactionData to prevent runtime errors
  const defaultData = {
    sentCount: 0,
    receivedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    monthlyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    monthlyCounts: [0, 0, 0, 0, 0, 0],
  };

  const data = transactionData ?? defaultData; // Use fallback data if transactionData is null or undefined

  // Safeguard: Ensure all required properties exist in the data object
  const {
    sentCount = 0,
    receivedCount = 0,
    pendingCount = 0,
    failedCount = 0,
    monthlyLabels = defaultData.monthlyLabels,
    monthlyCounts = defaultData.monthlyCounts,
  } = data;

  const transactionSummary = {
    labels: ["Sent", "Received", "Pending", "Failed"],
    datasets: [
      {
        label: "Transactions",
        data: [sentCount, receivedCount, pendingCount, failedCount],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
      },
    ],
  };

  const monthlySummary = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Transactions",
        data: monthlyCounts,
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.5)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white rounded shadow p-6 flex">
      <h3 className="text-xl font-semibold mb-4">Transaction </h3>
      <div className="space-y-6 flex grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="h-48">
          <h4 className="text-lg font-medium mb-2">Analytics</h4>
          <Bar data={transactionSummary} options={{ responsive: true }} />
        </div>

        {/* Line Chart */}
        <div className="h-48">
          <h4 className="text-lg font-medium mb-2">Monthly Trends</h4>
          <Line data={monthlySummary} options={{ responsive: true }} />
        </div>

        {/* Pie Chart */}
        <div className="h-48">
          <h4 className="text-lg font-medium mb-2">Transaction Breakdown</h4>
          <Pie data={transactionSummary} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
