import React from 'react';
import './TransactionDetails.css';

const TransactionDetails = ({ transaction, onBack }) => {
  if (!transaction) return null;

  const handleDownloadReceipt = () => {
    // Implement receipt download logic
    console.log('Downloading receipt...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReportIssue = () => {
    // Implement issue reporting logic
    console.log('Reporting issue...');
  };

  const handleShare = () => {
    // Implement share logic
    if (navigator.share) {
      navigator.share({
        title: `Transaction ${transaction.id}`,
        text: `Transaction details for ${transaction.amount} ${transaction.currency}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="transaction-details">
      <div className="details-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>Transaction Details</h2>
      </div>

      <div className="details-card">
        <div className="status-badge" data-status={transaction.status.toLowerCase()}>
          {transaction.status}
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Transaction ID</span>
            <span className="value">{transaction.id}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">Date & Time</span>
            <span className="value">
              {new Date(transaction.date).toLocaleString()}
            </span>
          </div>

          <div className="detail-item">
            <span className="label">Amount</span>
            <span className="value amount">
              {transaction.amount} {transaction.currency}
            </span>
          </div>

          <div className="detail-item">
            <span className="label">Recipient</span>
            <span className="value">{transaction.recipient}</span>
          </div>

          <div className="detail-item">
            <span className="label">Fees</span>
            <span className="value">{transaction.fees} {transaction.currency}</span>
          </div>

          <div className="detail-item">
            <span className="label">Exchange Rate</span>
            <span className="value">{transaction.exchangeRate}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleDownloadReceipt} className="action-btn download">
            Download Receipt
          </button>
          <button onClick={handlePrint} className="action-btn print">
            Print
          </button>
          <button onClick={handleShare} className="action-btn share">
            Share
          </button>
          <button onClick={handleReportIssue} className="action-btn report">
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
