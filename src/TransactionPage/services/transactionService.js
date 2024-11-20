class TransactionService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
  }

  async sendMoney(transactionData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to send money');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Transaction failed');
    }
  }

  async getTransactions() {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to load transactions');
    }
  }
}

const transactionService = new TransactionService();
export default transactionService;
