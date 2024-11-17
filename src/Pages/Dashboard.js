
import React from 'react';

//import WalletCard from '../components/dashboard/WalletCard';

import AnalyticsCard from '../Components/AnalyticsCard';
import WalletCard from '../Components/WalletCard';
import LeftNav from '../Components/LeftNav';
import BeneficiariesCard from '../Components/BeneficiariesCard';
import RecentTransactions from '../Components/RecentTransactionCard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <LeftNav />
        <div className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <WalletCard/>
            <BeneficiariesCard/>
            <RecentTransactions />
          </div>

          <AnalyticsCard />
        </div>
      </div>
    </div>
  );
}
