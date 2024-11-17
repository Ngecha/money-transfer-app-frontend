// BeneficiariesCard.js

import React from 'react';

export default function BeneficiariesCard() {
  return (
    <div className="bg-white rounded shadow p-4 overflow-y-scroll max-h-60">
      <h3 className="text-xl font-semibold mb-4">Beneficiaries</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Account</th>
            <th className="border-b p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample Data */}
          <tr>
            <td className="p-2">John Doe</td>
            <td className="p-2">123456789</td>
            <td className="p-2 text-green-500">Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}