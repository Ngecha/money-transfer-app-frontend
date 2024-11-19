import React, { useState } from 'react';
import SendMoneyForm from '../send-money/SendMoneyForm';
import TransactionHistory from '../history/TransactionHistory';
import TransactionDetails from '../details/TransactionDetails';
import './TransactionDashboard.css';

const TransactionDashboard = () => {
  const [currentView, setCurrentView] = useState('history');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    type: 'all'
  });

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
    setCurrentView('details');
  };

  const renderContent = () => {
    switch(currentView) {
      case 'send':
        return (
          <SendMoneyForm 
            onSuccess={() => setCurrentView('history')}
          />
        );
      case 'details':
        return (
          <TransactionDetails 
            transaction={selectedTransaction}
            onBack={() => {
              setCurrentView('history');
              setSelectedTransaction(null);
            }}
          />
        );
      case 'history':
      default:
        return (
          <div className="history-container">
            <div className="filters-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="filters">
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="sent">Sent</option>
                  <option value="received">Received</option>
                </select>
              </div>
            </div>

            <TransactionHistory
              searchQuery={searchQuery}
              filters={filters}
              onTransactionSelect={handleTransactionSelect}
            />
          </div>
        );
    }
  };

  return (
    <div className="transaction-dashboard">
      <header className="dashboard-header">
        <h1>Money Transfer</h1>
        <div className="quick-actions">
          <button 
            className={`action-button ${currentView === 'send' ? 'active' : ''}`}
            onClick={() => setCurrentView('send')}
          >
            Send Money
          </button>
          <button 
            className={`action-button ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('history');
              setSelectedTransaction(null);
            }}
          >
            Transaction History
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default TransactionDashboard;
