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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      const username = Cookies.get("username");
      if (!username) {
        setError("User is not logged in.");
        return;
      }

      try {
        const response = await fetch(`https://money-transfer-app-1.onrender.com/users`);
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
            `https://money-transfer-app-1.onrender.com/transactions/${user.user_id}?${queryParams}`
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

  // Handle pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex">
      <LeftNav />
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
              <th className="px-4 py-2 border">Transaction Type</th>
              <th className="px-4 py-2 border">Wallet</th>
              <th className="px-4 py-2 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction) => {
                const formattedDate = new Date(
                  transaction.transaction_date
                ).toLocaleString();
                const walletName = transaction.sender_wallet_name
                  ? `From: ${transaction.sender_wallet_name}`
                  : transaction.receiver_wallet_name
                  ? `To: ${transaction.receiver_wallet_name}`
                  : "N/A";

                // Determine the color class for the amount based on transaction type
                const amountClass =
                transaction.transaction_type === "deposit"
                  ? "text-green-500"
                  : transaction.transaction_type === "withdrawal"
                  ? "text-red-500"
                  : "text-black";

                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{formattedDate}</td>
                    <td className={`px-4 py-2 border ${amountClass}`}>{transaction.amount}</td>
                    <td className="px-4 py-2 border">{transaction.status}</td>
                    <td className="px-4 py-2 border">
                      {transaction.transaction_type}
                    </td>
                    <td className="px-4 py-2 border">{walletName}</td>
                    <td className="px-4 py-2 border">{transaction.description}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center items-center space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
