import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ searchQuery, filters, onTransactionSelect }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        const mockTransactions = [
          {
            id: 'TX001',
            date: '2024-02-20T10:30:00',
            amount: 1000,
            currency: 'USD',
            recipient: 'John Doe',
            type: 'sent',
            status: 'completed',
            description: 'Monthly rent payment'
          },
          {
            id: 'TX002',
            date: '2024-02-19T15:45:00',
            amount: 500,
            currency: 'EUR',
            recipient: 'Jane Smith',
            type: 'sent',
            status: 'pending',
            description: 'Freelance work'
          },
          // Add more mock transactions as needed
        ];
        
        setTransactions(mockTransactions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters]);

  const filterTransactions = (transactions) => {
    return transactions.filter(transaction => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        transaction.recipient.toLowerCase().includes(searchLower) ||
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.description.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = 
        filters.status === 'all' || 
        transaction.status === filters.status;

      // Type filter
      const matchesType = 
        filters.type === 'all' || 
        transaction.type === filters.type;

      // Date range filter
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      let matchesDate = true;

      switch(filters.dateRange) {
        case 'today':
          matchesDate = transactionDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          matchesDate = 
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDate = transactionDate.getFullYear() === today.getFullYear();
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading-state">Loading transactions...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  const filteredTransactions = filterTransactions(transactions);

  return (
    <div className="transaction-history">
      {filteredTransactions.length === 0 ? (
        <div className="no-results">
          No transactions found matching your criteria
        </div>
      ) : (
        <div className="transactions-table">
          <div className="table-header">
            <div className="header-date">Date</div>
            <div className="header-description">Description</div>
            <div className="header-amount">Amount</div>
            <div className="header-status">Status</div>
          </div>
          
          {filteredTransactions.map(transaction => (
            <div 
              key={transaction.id}
              className="transaction-row"
              onClick={() => onTransactionSelect(transaction)}
            >
              <div className="transaction-date">
                {formatDate(transaction.date)}
              </div>
              <div className="transaction-description">
                <div className="recipient">{transaction.recipient}</div>
                <div className="transaction-id">ID: {transaction.id}</div>
              </div>
              <div className="transaction-amount">
                <span className={transaction.type === 'sent' ? 'amount-sent' : 'amount-received'}>
                  {transaction.type === 'sent' ? '-' : '+'}{transaction.amount} {transaction.currency}
                </span>
              </div>
              <div className={`transaction-status ${getStatusClass(transaction.status)}`}>
                {transaction.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
