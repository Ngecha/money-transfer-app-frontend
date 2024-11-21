import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LeftNav from "../Components/LeftNav";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      const username = Cookies.get("username");
      if (!username) {
        setError("User is not logged in.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        const loggedInUser = data.users.find((u) => u.username === username);

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

  // Fetch transactions based on user and filters
  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        try {
          const queryParams = new URLSearchParams({
            search: searchQuery,
            status: statusFilter,
            date_range: dateRange,
          }).toString();

          const response = await fetch(
            `http://127.0.0.1:5000/transactions/${user.user_id}?${queryParams}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch transactions.");
          }

          const data = await response.json();
          setTransactions(data);
        } catch (err) {
          console.error("Error fetching transactions:", err);
          setError("Failed to load transactions.");
        }
      }
    };

    fetchTransactions();
  }, [user, searchQuery, statusFilter, dateRange]);

  return (
    <div className="flex">
      <LeftNav/>      
      <div className="w-full overflow-y-auto bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        {error && <p className="text-red-500">{error}</p>}

        {/* Search and Filter Section */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <input
            type="text"
            className="border rounded px-4 py-2"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Status Filter */}
          <select
            className="border rounded px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Date Range Filter */}
          <select
            className="border rounded px-4 py-2"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Transactions Table */}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => {
                const formattedDate = new Date(
                  transaction.transaction_date
                ).toLocaleString();
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{formattedDate}</td>
                    <td className="px-4 py-2 border">{transaction.amount}</td>
                    <td className="px-4 py-2 border">{transaction.status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
