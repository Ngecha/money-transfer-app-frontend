import React, { useState, useEffect } from "react";
import LeftNav from "../Components/LeftNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";
import Walletccard from "../Pages/waletccard";

function Wallet() {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [amount, setAmount] = useState(0);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingWallets, setLoadingWallets] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const username = Cookies.get("username");
        if (!username) throw new Error("User is not logged in.");

        const response = await fetch("http://127.0.0.1:5000/users");
        if (!response.ok) throw new Error("Failed to fetch users.");

        const { users = [] } = await response.json();
        const loggedInUser = users.find((u) => u.username === username);
        if (!loggedInUser) throw new Error("Logged-in user not found.");

        setUser(loggedInUser);
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch wallets
  useEffect(() => {
    const fetchWallets = async () => {
      if (!user) return;

      setLoadingWallets(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/wallet/${user.user_id}`);
        if (!response.ok) throw new Error("Failed to fetch wallets.");

        const { wallets = [] } = await response.json();
        setWallets(wallets);
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setLoadingWallets(false);
      }
    };

    fetchWallets();
  }, [user]);

  const fetchBeneficiaries = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/beneficiaries");
      if (!response.ok) throw new Error("Failed to fetch beneficiaries.");

      const data = await response.json();
      setBeneficiaries(data.beneficiaries || []);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // Top Up functionality
  const handleTopUp = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/wallet/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          wallet_id: selectedWallet.wallet_id,
          amount: parseFloat(amount),
        })
      });
  
      if (!response.ok) throw new Error("Failed to top up.");
  
      const updatedWallet = await response.json();
      setWallets((prev) =>
        prev.map((wallet) =>
          wallet.wallet_id === updatedWallet.wallet_id ? updatedWallet : wallet
        )
      );
      setShowTopUpForm(false);
      setAmount(0);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };
  

  // Transfer functionality
  const handleTransfer = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_wallet_id: selectedWallet.wallet_id,
          to_wallet_id: selectedBeneficiary,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) throw new Error("Failed to transfer money.");

      setShowTransferForm(false);
      setSelectedBeneficiary(null);
      setAmount(0);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // Withdraw functionality
  const handleWithdraw = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_id: selectedWallet.wallet_id,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) throw new Error("Failed to withdraw money.");

      const updatedWallet = await response.json();
      setWallets((prev) =>
        prev.map((wallet) =>
          wallet.wallet_id === updatedWallet.wallet_id ? updatedWallet : wallet
        )
      );
      setShowWithdrawForm(false);
      setAmount(0);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // Button handlers
  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setShowTopUpForm(false);
    setShowTransferForm(false);
    setShowWithdrawForm(false);
  };

  const handleTopUpClick = () => {
    setShowTopUpForm(true);
    setShowTransferForm(false);
    setShowWithdrawForm(false);
  };

  const handleTransferClick = () => {
    fetchBeneficiaries();
    setShowTransferForm(true);
    setShowTopUpForm(false);
    setShowWithdrawForm(false);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawForm(true);
    setShowTopUpForm(false);
    setShowTransferForm(false);
  };

  const handleBackClick = () => {
    setSelectedWallet(null);
    setShowTopUpForm(false);
    setShowTransferForm(false);
    setShowWithdrawForm(false);
    setAmount(0);
    setSelectedBeneficiary(null);
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <LeftNav />
      <div className="flex-grow-1 p-5">
        <h2 className="mb-4 text-primary">My Wallets</h2>

        {/* Wallet List */}
        {!selectedWallet && !showTopUpForm && !showTransferForm && !showWithdrawForm && (
          <div className="d-flex flex-wrap gap-4">
            {wallets.map((wallet) => (
              <Walletccard
                key={wallet.wallet_id}
                wallet={wallet}
                onWalletClick={handleWalletClick}
              />
            ))}
          </div>
        )}

        {/* Wallet Details */}
        {selectedWallet && (
          <div className="card p-4 mx-auto" style={{ maxWidth: "25rem", backgroundColor: "#f0f8ff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}>
            <h5 className="text-center mb-3 text-primary">{selectedWallet.wallet_name || "Unnamed Wallet"}</h5>

            <div className="d-flex flex-column align-items-center mb-4">
              <h6 className="text-muted mb-2">Balance</h6>
              <p className="fs-4 fw-bold text-dark">
                {selectedWallet.currency} {selectedWallet.balance.toFixed(2)}
              </p>
            </div>

            <div className="d-flex gap-3 justify-content-between mb-4">
              <button type="button" className="btn rounded-pill flex-grow-1" onClick={handleTopUpClick} style={{ backgroundColor: "#0046be", color: "white" }}>Top Up</button>
              <button type="button" className="btn rounded-pill flex-grow-1" onClick={handleTransferClick} style={{ backgroundColor: "#1c1c1c", color: "white" }}>Transfer</button>
              <button type="button" className="btn rounded-pill flex-grow-1" onClick={handleWithdrawClick} style={{ backgroundColor: "#be0000", color: "white" }}>Withdraw</button>
            </div>
            <button type="button" className="btn btn-outline-secondary w-100" onClick={handleBackClick}>Back to Wallets</button>
          </div>
        )}

        {/* Top-Up Form */}
        {showTopUpForm && (
          <div className="card p-4 mx-auto" style={{ maxWidth: "25rem", backgroundColor: "#f0f8ff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}>
            <h5 className="text-center mb-3 text-primary">Top-Up Amount</h5>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Enter amount" />
            <button onClick={handleTopUp} className="btn btn-primary w-100">Submit</button>
            <button onClick={() => setShowTopUpForm(false)} className="btn btn-outline-secondary w-100 mt-3">Cancel</button>
          </div>
        )}

        {/* Transfer Form */}
        {showTransferForm && (
          <div className="card p-4 mx-auto" style={{ maxWidth: "25rem", backgroundColor: "#f0f8ff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}>
            <h5 className="text-center mb-3 text-primary">Transfer</h5>
            <select onChange={(e) => setSelectedBeneficiary(e.target.value)} className="form-select mb-3">
              <option value="">Select beneficiary</option>
              {beneficiaries.map((b) => (
                <option key={b.wallet_id} value={b.wallet_id}>{b.wallet_name}</option>
              ))}
            </select>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Enter amount" />
            <button onClick={handleTransfer} className="btn btn-primary w-100">Transfer</button>
            <button onClick={() => setShowTransferForm(false)} className="btn btn-outline-secondary w-100 mt-3">Cancel</button>
          </div>
        )}

        {/* Withdraw Form */}
        {showWithdrawForm && (
          <div className="card p-4 mx-auto" style={{ maxWidth: "25rem", backgroundColor: "#f0f8ff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}>
            <h5 className="text-center mb-3 text-primary">Withdraw</h5>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Enter amount" />
            <button onClick={handleWithdraw} className="btn btn-primary w-100">Withdraw</button>
            <button onClick={() => setShowWithdrawForm(false)} className="btn btn-outline-secondary w-100 mt-3">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;
