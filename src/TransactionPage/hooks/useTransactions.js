import { useState, useEffect, useCallback } from 'react';
import { TRANSACTION_STATUS, ERROR_MESSAGES, API_ENDPOINTS } from '../constants/transactionConstants';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Fetch transactions with filters
  const fetchTransactions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: filters.page || pagination.currentPage,
        limit: filters.limit || pagination.itemsPerPage,
        status: filters.status || 'all',
        type: filters.type || 'all',
        dateFrom: filters.dateFrom || '',
        dateTo: filters.dateTo || '',
        search: filters.search || ''
      }).toString();

      const response = await fetch(`${API_ENDPOINTS.GET_TRANSACTIONS}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }

      const data = await response.json();
      
      setTransactions(data.transactions);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        itemsPerPage: data.itemsPerPage
      });
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage]);

  // Additional functions like sendMoney, getTransactionDetails, etc. would remain the same

  // Load initial transactions
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    sendMoney,
    getTransactionDetails,
    cancelTransaction,
    downloadReceipt,
    reportIssue
  };
};

export default useTransactions;
