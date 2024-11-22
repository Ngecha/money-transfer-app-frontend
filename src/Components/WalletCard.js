import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

export default function WalletCard() {
  const [wallets, setWallets] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
    async function fetchWallets() {
      if (user) {
        setLoading(true);
        try {
          const response = await fetch(`https://money-transfer-app-1.onrender.com/wallet/${user.user_id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch wallets.");
          }

          const data = await response.json();
          setWallets(data.wallets || []);
        } catch (err) {
          console.error("Error fetching wallets:", err);
          setError("Failed to load wallets.");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchWallets();
  }, [user]);

  const handleCreateWallet = async () => {
    const walletName = prompt("Enter a name for the new wallet:");
    if (!walletName) {
      alert("Wallet name is required.");
      return;
    }

    try {
      const response = await fetch('https://money-transfer-app-1.onrender.com/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, wallet_name: walletName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create wallet.");
      }

      const updatedWallets = await fetch(`https://money-transfer-app-1.onrender.com/wallet/${user.user_id}`);
      const updatedData = await updatedWallets.json();
      setWallets(updatedData.wallets || []);
    } catch (err) {
      console.error("Error creating wallet:", err);
      alert("Failed to create wallet. Please try again.");
    }
  };

  if (loading) return <p>Loading wallets...</p>;
  if (error) return <p>Error: {error}</p>;
  if (wallets.length === 0) return <p>No wallets available.</p>;

  return (
    <div className="w-96 h-96 overflow-y-auto space-y-4">
      {wallets.map((wallet) => (
        <div key={wallet.wallet_id} className="p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold">{wallet.wallet_name}</h3>
          <p className="text-gray-600">
            Balance: {wallet.currency} {wallet.balance.toFixed(2)}
          </p>
        </div>
      ))}

      <div className="mt-4 text-center">
        <button
          onClick={handleCreateWallet}
          className="bg-green-500 text-white p-2 rounded-full shadow-md w-10 h-10 flex items-center justify-center mx-auto">
          <span className="text-xl font-bold">+</span>
        </button>
      </div>
    </div>
  );
}
