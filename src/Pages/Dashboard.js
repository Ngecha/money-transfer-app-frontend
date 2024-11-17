import React from 'react';
import LeftNav from '../Components/LeftNav';
import WalletCard from '../Components/WalletCard';
import BeneficiariesCard from '../Components/BeneficiariesCard';
import RecentTransactionsCard from '../Components/RecentTransactionCard';
import AnalyticsCard from '../Components/AnalyticsCard';

export default function DashboardPage({ userId }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <LeftNav />
        <div className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <WalletCard userId={userId} />
            <BeneficiariesCard />
            <RecentTransactionsCard />
          </div>

          <AnalyticsCard />
        </div>
      </div>
    </div>
  );
}