import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LeftNav from "../Components/LeftNav";
import { Bar } from "react-chartjs-2"; // Chart.js for analytics
import {  Chart as ChartJS,  CategoryScale,  LinearScale,  BarElement,  Title,  Tooltip,  Legend,} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Transactions() {
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    totalFees: 0,
  });

  // Fetch logged-in user from cookies
  useEffect(() => {
    const fetchUser = async () => {
      const username = Cookies.get("username"); // Get username from cookie
      if (!username) {
        setError("User is not logged in.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        const users = data.users;
        const loggedInUser = users.find((u) => u.username === username);

        if (!loggedInUser) {
          throw new Error("Logged-in user not found.");
        }

        setUser(loggedInUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    fetchUser();
  }, []);

  // Fetch transactions and summary for the logged-in user
  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/transactions/${user.user_id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch transactions.");
          }

          const data = await response.json();
          setTransactions(data);

          // Calculate summary
          const totalTransactions = data.length;
          const totalAmount = data.reduce((sum, t) => sum + t.amount, 0);
          const totalFees = data.reduce((sum, t) => sum + (t.transaction_fee || 0), 0);

          setSummary({
            totalTransactions,
            totalAmount,
            totalFees,
          });
        } catch (err) {
          console.error("Error fetching transactions:", err);
          setError("Failed to load transactions.");
        }
      }
    };

    fetchTransactions();
  }, [user]);

  // Data for the analytics graph
  const analyticsData = {
    labels: transactions.map((t) => new Date(t.transaction_date).toLocaleDateString()),
    datasets: [
      {
        label: "Transaction Amount",
        data: transactions.map((t) => t.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex">
      <LeftNav />
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        <h1 className="text-2xl font-bold mb-4">My Transactions</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {!user ? (
          <p>Loading user details...</p>
        ) : (
          <>
            {/* Summary Section */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Total Transactions</h2>
                <p className="text-2xl">{summary.totalTransactions}</p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Total Amount</h2>
                <p className="text-2xl">${summary.totalAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-white shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Total Fees</h2>
                <p className="text-2xl">${summary.totalFees.toFixed(2)}</p>
              </div>
            </div>

            {/* Transaction History Table */}
            <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white mb-6">
              <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
              {transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">
                          Transaction Type
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Recipient</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">
                          Balance After Transaction
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {transaction.sender_wallet_id === user.wallet.wallet_id
                              ? "Money Out"
                              : "Money In"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {transaction.recipient_email || "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            ${transaction.balance_after_transaction?.toFixed(2) || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Analytics Section */}
            <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-lg font-semibold mb-4">Transaction Analytics</h2>
              <Bar data={analyticsData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
