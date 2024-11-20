import React, { useState } from 'react';
import './SendMoneyForm.css';
import axios from 'axios'; // We'll use axios for the API request

const SendMoneyForm = ({ onSuccess, userId }) => { // userId should be passed as a prop
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    senderWalletId: '', // Add sender wallet ID
    receiverWalletId: '', // Add receiver wallet ID or beneficiary email
    beneficiaryEmail: '', // Add beneficiary email (optional)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Build the data object to send to your backend
      const transactionData = {
        user_id: userId, // user ID should be passed to the form
        sender_wallet_id: formData.senderWalletId, 
        receiver_wallet_id: formData.receiverWalletId || null, // Either receiver wallet or beneficiary email
        beneficiary_email: formData.beneficiaryEmail || null, 
        amount: formData.amount,
        description: formData.description,
      };

      // Send data to your backend API
      const response = await axios.post('http://127.0.0.1:5000/transaction', transactionData);
      
      // Handle the response from the backend (success)
      onSuccess?.(response.data);

    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map(num => (
        <div key={num} className={`step ${step >= num ? 'active' : ''}`}>
          {num}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h3>Sender Wallet Details</h3>
            <div className="form-group">
              <label>Sender Wallet ID</label>
              <input
                type="text"
                name="senderWalletId"
                value={formData.senderWalletId}
                onChange={handleInputChange}
                placeholder="Enter sender's wallet ID"
              />
            </div>
            <button type="button" onClick={handleNext} className="next-button" disabled={loading}>
              {loading ? 'Loading...' : 'Next'}
            </button>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <h3>Receiver Details</h3>
            <div className="form-group">
              <label>Receiver Wallet ID</label>
              <input
                type="text"
                name="receiverWalletId"
                value={formData.receiverWalletId}
                onChange={handleInputChange}
                placeholder="Enter receiver's wallet ID (or leave blank for email)"
              />
            </div>
            <div className="form-group">
              <label>Beneficiary Email (if no wallet ID)</label>
              <input
                type="email"
                name="beneficiaryEmail"
                value={formData.beneficiaryEmail}
                onChange={handleInputChange}
                placeholder="Enter beneficiary's email"
              />
            </div>
            <button type="button" onClick={handleBack} className="back-button">
              Back
            </button>
            <button type="button" onClick={handleNext} className="next-button" disabled={loading}>
              {loading ? 'Loading...' : 'Next'}
            </button>
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <h3>Transaction Details</h3>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount to send"
              />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter transaction description (optional)"
              />
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button type="button" onClick={handleBack} className="back-button">
              Back
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="send-money-form">
      {renderStepIndicator()}
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {renderStepContent()}
      </form>
    </div>
  );
};

export default SendMoneyForm;
