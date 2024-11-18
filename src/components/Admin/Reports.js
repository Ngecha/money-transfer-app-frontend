import React from 'react';

const Reports = () => {
  return (
    <div className="admin-main">
      <div className="admin-header">
        <h1>Reports</h1>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Reports</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Last Month</h3>
          <p>0</p>
        </div>
      </div>

      <div className="reports-container">
        <div className="report-card">
          <h3>User Growth Report</h3>
          <p>No data available</p>
        </div>
        <div className="report-card">
          <h3>Transaction Report</h3>
          <p>No data available</p>
        </div>
        <div className="report-card">
          <h3>Revenue Report</h3>
          <p>No data available</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;