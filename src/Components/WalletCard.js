// WalletCard.js
import React, { useState, useEffect } from 'react';

export default function WalletCard({ userId }) {
  const [wallet, setWallet] = useState({ wallet_name: '', balance: 0 });

  useEffect(() => {
    const fetchWallet = async () => {
      const response = await fetch(`/wallet/${userId}`);
      const data = await response.json();
      if (data.wallets && data.wallets.length > 0) {
        setWallet(data.wallets[0]); // Assuming one wallet per user
      }
    };
    fetchWallet();
  }, [userId]);

  const handleFund = async () => {
    const amount = prompt("Enter amount to fund:");
    await fetch('/wallet/fund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_id: wallet.wallet_id, amount: parseFloat(amount) }),
    });
    // Refresh wallet balance
    setWallet({ ...wallet, balance: wallet.balance + parseFloat(amount) });
  };

  const handleWithdraw = async () => {
    const amount = prompt("Enter amount to withdraw:");
    await fetch('/wallet/withdraw', {
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