import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SendMoney from './pages/SendMoney/SendMoney';
import Transactions from './pages/Transactions/Transactions';
import './App.css';

function TransactionPage() {
  return (
    <div className="app">
      <main className="main-content">
        <div className="home-page">
          <section className="hero">
            <h2>Welcome to VisaPay</h2>
            <p>Fast, secure, and easy way to transfer money</p>
          </section>

          <section className="features">
            <div className="feature-card">
              <h3>Send Money</h3>
              <p>Transfer funds to anyone, anywhere</p>
              <a href="/send" className="button">Send Now</a>
            </div>

            <div className="feature-card">
              <h3>Recent Transactions</h3>
              <p>View your transfer history</p>
              <a href="/transactions" className="button">View History</a>
            </div>
          </section>
        </div>

        <Routes>
          <Route path="/send" element={<SendMoney />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
    </div>
  );
}

export default TransactionPage;