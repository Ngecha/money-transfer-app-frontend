// RecentTransactionsCard.js
import React from 'react';

export default function RecentTransactionsCard() {
  return (
    <div className="bg-white rounded shadow p-4 overflow-y-scroll max-h-60">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <button className="bg-gray-200 px-4 py-1 rounded">Filter</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border-b p-2">Date</th>
            <th className="border-b p-2">Amount</th>
            <th className="border-b p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample Data */}
          <tr>
            <td className="p-2">01/11/2024</td>
            <td className="p-2">$200</td>
            <td className="p-2 text-green-500">Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}