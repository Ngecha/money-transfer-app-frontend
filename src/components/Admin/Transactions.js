import React from 'react';

const Transactions = () => {
  return (
    <div className="admin-main">
      <div className="admin-header">
        <h1>Transactions</h1>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Successful</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Failed</h3>
          <p>0</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="loading">No transactions found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;