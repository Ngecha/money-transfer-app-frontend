import { CURRENCIES, TRANSACTION_LIMITS, TRANSACTION_STATUS } from '../constants/transactionConstants';

/**
 * Format amount with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (USD, EUR, etc.)
 * @returns {string} Formatted amount with currency symbol
 */
export const formatCurrency = (amount, currencyCode) => {
  if (!amount || !currencyCode) return '0';

  const currency = CURRENCIES[currencyCode];
  if (!currency) return `${amount} ${currencyCode}`;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date to local string
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time in the format
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = true) => {
  if (!date) return '';

  const dateObj = new Date(date);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Validate transaction amount
 * @param {number} amount - Amount to validate
 * @param {string} currencyCode - Currency code
 * @returns {Object} Validation result
 */
export const validateAmount = (amount, currencyCode) => {
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Invalid amount format' };
  }

  if (numAmount < TRANSACTION_LIMITS.MIN_AMOUNT) {
    return { 
      isValid: false, 
      error: `Amount must be at least ${formatCurrency(TRANSACTION_LIMITS.MIN_AMOUNT, currencyCode)}` 
    };
  }

  if (numAmount > TRANSACTION_LIMITS.MAX_AMOUNT) {
    return { 
      isValid: false, 
      error: `Amount cannot exceed ${formatCurrency(TRANSACTION_LIMITS.MAX_AMOUNT, currencyCode)}` 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Calculate transaction fee
 * @param {number} amount - Transaction amount
 * @param {string} currencyCode - Currency code
 * @returns {number} Calculated fee
 */
export const calculateFee = (amount, currencyCode) => {
  const basePercentage = 0.01; // 1% fee
  const minFee = 1;
  const fee = amount * basePercentage;
  return Math.max(fee, minFee);
};

/**
 * Get status color class
 * @param {string} status - Transaction status
 * @returns {string} CSS class name
 */
export const getStatusColorClass = (status) => {
  const statusMap = {
    [TRANSACTION_STATUS.COMPLETED]: 'status-success',
    [TRANSACTION_STATUS.PENDING]: 'status-warning',
    [TRANSACTION_STATUS.FAILED]: 'status-error',
    [TRANSACTION_STATUS.CANCELLED]: 'status-neutral',
    [TRANSACTION_STATUS.PROCESSING]: 'status-info'
  };

  return statusMap[status] || 'status-neutral';
};

/**
 * Generate transaction reference
 * @returns {string} Transaction reference
 */
export const generateTransactionReference = () => {
  const prefix = 'TX';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

/**
 * Format large numbers with abbreviations
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatLargeNumber = (num) => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });
  return formatter.format(num);
};

/**
 * Calculate exchange rate between currencies
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Object} rates - Exchange rates object
 * @returns {number} Converted amount
 */
export const calculateExchangeAmount = (amount, fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency) return amount;
  if (!rates || !rates[fromCurrency] || !rates[toCurrency]) return null;

  const baseAmount = amount / rates[fromCurrency];
  return baseAmount * rates[toCurrency];
};

/**
 * Group transactions by date
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Grouped transactions
 */
export const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

/**
 * Validate recipient details
 * @param {Object} recipient - Recipient details
 * @returns {Object} Validation result
 */
export const validateRecipient = (recipient) => {
  const errors = {};

  if (!recipient.name || recipient.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!recipient.accountNumber || !/^\d{8,20}$/.test(recipient.accountNumber)) {
    errors.accountNumber = 'Invalid account number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format transaction for display
 * @param {Object} transaction - Transaction object
 * @returns {Object} Formatted transaction
 */
export const formatTransactionForDisplay = (transaction) => {
  return {
    ...transaction,
    formattedAmount: formatCurrency(transaction.amount, transaction.currency),
    formattedDate: formatDate(transaction.date),
    formattedFee: formatCurrency(transaction.fee, transaction.currency),
    statusClass: getStatusColorClass(transaction.status)
  };
};

/**
 * Check if transaction is cancellable
 * @param {Object} transaction - Transaction object
 * @returns {boolean} Whether transaction can be cancelled
 */
export const isTransactionCancellable = (transaction) => {
  const cancellableStatuses = [
    TRANSACTION_STATUS.PENDING,
    TRANSACTION_STATUS.PROCESSING
  ];
  
  if (!cancellableStatuses.includes(transaction.status)) {
    return false;
  }

  // Check if transaction is within cancellation window (e.g., 30 minutes)
  const transactionDate = new Date(transaction.date);
  const cancellationWindow = 30 * 60 * 1000; // 30 minutes in milliseconds
  const now = new Date();
  
  return (now - transactionDate) <= cancellationWindow;
};

export default {
  formatCurrency,
  formatDate,
  validateAmount,
  calculateFee,
  getStatusColorClass,
  generateTransactionReference,
  formatLargeNumber,
  calculateExchangeAmount,
  groupTransactionsByDate,
  validateRecipient,
  formatTransactionForDisplay,
  isTransactionCancellable
};
