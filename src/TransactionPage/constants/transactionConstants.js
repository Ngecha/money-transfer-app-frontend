// Transaction Status
export const TRANSACTION_STATUS = {
    COMPLETED: 'completed',
    PENDING: 'pending',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    PROCESSING: 'processing'
  };
  
  // Transaction Types
  export const TRANSACTION_TYPES = {
    SENT: 'sent',
    RECEIVED: 'received'
  };
  
  // Date Range Filters
  export const DATE_RANGES = {
    ALL: 'all',
    TODAY: 'today',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    CUSTOM: 'custom'
  };
  
  // Supported Currencies
  export const CURRENCIES = {
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar'
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro'
    },
    GBP: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound'
    },
    JPY: {
      code: 'JPY',
      symbol: '¥',
      name: 'Japanese Yen'
    },
    AUD: {
      code: 'AUD',
      symbol: 'A$',
      name: 'Australian Dollar'
    },
    CAD: {
      code: 'CAD',
      symbol: 'C$',
      name: 'Canadian Dollar'
    }
  };
  
  // Transaction Fee Types
  export const FEE_TYPES = {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed'
  };
  
  // Default Transaction Limits
  export const TRANSACTION_LIMITS = {
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 10000,
    DAILY_LIMIT: 50000,
    MONTHLY_LIMIT: 100000
  };
  
  // Error Messages
  export const ERROR_MESSAGES = {
    INSUFFICIENT_FUNDS: 'Insufficient funds in your account',
    INVALID_AMOUNT: 'Please enter a valid amount',
    EXCEEDED_DAILY_LIMIT: 'Daily transaction limit exceeded',
    EXCEEDED_MONTHLY_LIMIT: 'Monthly transaction limit exceeded',
    INVALID_RECIPIENT: 'Invalid recipient details',
    NETWORK_ERROR: 'Network error. Please try again',
    SERVER_ERROR: 'Server error. Please try again later',
    UNAUTHORIZED: 'Unauthorized. Please login again'
  };
  
  // Success Messages
  export const SUCCESS_MESSAGES = {
    TRANSACTION_COMPLETED: 'Transaction completed successfully',
    TRANSACTION_INITIATED: 'Transaction initiated successfully',
    TRANSACTION_CANCELLED: 'Transaction cancelled successfully'
  };
  
  // API Endpoints
  export const API_ENDPOINTS = {
    SEND_MONEY: '/api/transactions/send',
    GET_TRANSACTIONS: '/api/transactions',
    GET_TRANSACTION_DETAILS: '/api/transactions/:id',
    CANCEL_TRANSACTION: '/api/transactions/:id/cancel'
  };
  
  // Validation Rules
  export const VALIDATION_RULES = {
    RECIPIENT_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z\s'-]+$/
    },
    ACCOUNT_NUMBER: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 20,
      PATTERN: /^\d+$/
    },
    DESCRIPTION: {
      MAX_LENGTH: 100
    }
  };
  
  // Transaction Categories
  export const TRANSACTION_CATEGORIES = {
    TRANSFER: 'transfer',
    PAYMENT: 'payment',
    SUBSCRIPTION: 'subscription',
    REFUND: 'refund',
    OTHER: 'other'
  };
  
  // Time Constants (in milliseconds)
  export const TIME_CONSTANTS = {
    TRANSACTION_TIMEOUT: 30000, // 30 seconds
    SESSION_TIMEOUT: 1800000, // 30 minutes
    REFRESH_INTERVAL: 60000 // 1 minute
  };
  
  // Export all constants as a single object
  export const CONSTANTS = {
    TRANSACTION_STATUS,
    TRANSACTION_TYPES,
    DATE_RANGES,
    CURRENCIES,
    FEE_TYPES,
    TRANSACTION_LIMITS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    API_ENDPOINTS,
    VALIDATION_RULES,
    TRANSACTION_CATEGORIES,
    TIME_CONSTANTS
  };
  
  export default CONSTANTS;