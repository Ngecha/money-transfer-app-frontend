import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
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

  useEffect(() => {
    async function fetchTransactions() {
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
        } catch (err) {
          console.error("Error fetching transactions:", err);
          setError("Failed to load transactions.");
        }
      }
    }

    fetchTransactions();
  }, [user]);


  return (
    <div className="w-96 h-96 overflow-y-auto bg-white shadow-md rounded-lg p-4 overflow-y-auto max-h-96">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const formattedDate = new Date(transaction.transaction_date).toLocaleString();
            return (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{formattedDate}</td>
                <td className="px-4 py-2 border">{transaction.amount}</td>
                <td className="px-4 py-2 border">{transaction.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
