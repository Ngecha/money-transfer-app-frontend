// Install dependencies first: npm install react-chartjs-2 chart.js

import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import LeftNav from "../Components/LeftNav";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionsPage = () => {
  // Sample data for transactions
  const transactions = [
    { id: 1, date: "2024-11-01", description: "Salary", amount: 5000, type: "in" },
    { id: 2, date: "2024-11-03", description: "Groceries", amount: -200, type: "out" },
    { id: 3, date: "2024-11-05", description: "Freelance", amount: 1500, type: "in" },
    { id: 4, date: "2024-11-10", description: "Rent", amount: -1500, type: "out" },
    { id: 5, date: "2024-11-15", description: "Utilities", amount: -300, type: "out" },
  ];

  // Calculate data for graphs
  const moneyIn = transactions.filter((t) => t.type === "in").reduce((acc, t) => acc + t.amount, 0);
  const moneyOut = transactions.filter((t) => t.type === "out").reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const barData = {
    labels: ["Money In", "Money Out"],
    datasets: [
      {
        label: "Amount",
        data: [moneyIn, moneyOut],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const lineData = {
    labels: transactions.map((t) => t.date),
    datasets: [
      {
        label: "Money In",
        data: transactions.map((t) => (t.type === "in" ? t.amount : 0)),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
      },
      {
        label: "Money Out",
        data: transactions.map((t) => (t.type === "out" ? Math.abs(t.amount) : 0)),
        borderColor: "#f44336",
        backgroundColor: "rgba(244, 67, 54, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex">
      <LeftNav/>
      <div className=" container mx-auto py-6">
        
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>

        {/* Transactions Table */}
        <table className="table-auto w-full border-collapse border border-gray-200 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border border-gray-300 px-4 py-2">{transaction.date}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.description}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    transaction.type === "in" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bar Chart */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Money In vs Money Out</h2>
          <Bar data={barData} />
        </div>

        {/* Line Chart */}
        <div>
          <h2 className="text-xl font-bold mb-2">Money Trends Over Time</h2>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
