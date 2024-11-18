// WalletCard.js
import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

export default function WalletCard({ userId }) {
  const [wallet, setWallet] = useState({ wallet_name: '', balance: 0 });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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
    const fetchWallet = async () => {
      const response = await fetch(`http://127.0.0.1:5000/wallet/${user.user_id}`);
      const data = await response.json();
      if (data.wallets && data.wallets.length > 0) {
        setWallet(data.wallets[0]); // Assuming one wallet per user
      }
    };
    fetchWallet();
  }, [userId]);

  const handleFund = async () => {
    const amount = prompt("Enter amount to fund:");
    await fetch('http://127.0.0.1:5000/wallet/fund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_id: wallet.wallet_id, amount: parseFloat(amount) }),
    });
    // Refresh wallet balance
    setWallet({ ...wallet, balance: wallet.balance + parseFloat(amount) });
  };

  const handleWithdraw = async () => {
    const amount = prompt("Enter amount to withdraw:");
    await fetch('http://127.0.0.1:5000/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_id: wallet.wallet_id, amount: parseFloat(amount) }),
    });
    // Refresh wallet balance
    setWallet({ ...wallet, balance: wallet.balance - parseFloat(amount) });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-xl font-semibold">{wallet.wallet_name}</h3>
      <p className="text-gray-600">Balance: ${wallet.balance}</p>
      <div className="mt-4 flex justify-between">
        <button onClick={handleFund} className="bg-blue-500 text-white px-4 py-2 rounded">Top Up</button>
        <button onClick={handleWithdraw} className="bg-red-500 text-white px-4 py-2 rounded">Withdraw</button>
      </div>
    </div>
  );
}