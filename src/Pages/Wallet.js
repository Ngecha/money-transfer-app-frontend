import React, { useState, useEffect } from "react";
import LeftNav from "../Components/LeftNav";
import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
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
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

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

  // Handle Fund Wallet
  const handleFundSubmit = async () => {
    if (!fundAmount || isNaN(fundAmount)) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/wallet/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_id: selectedWallet.wallet_id, amount: parseFloat(fundAmount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to fund wallet.");
      }

      const updatedWallets = await fetch(`http://127.0.0.1:5000/wallet/${user.user_id}`);
      const updatedData = await updatedWallets.json();
      setWallets(updatedData.wallets || []);
      setShowTopUpForm(false); // Close top-up form after successful fund
    } catch (err) {
      console.error("Error during funding:", err);
      alert("Failed to fund wallet. Please try again.");
    }
  };

  // Handle Withdraw Wallet
  const handleWithdrawSubmit = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount)) {
      alert("Please enter a valid amount.");
      return;
    }

    const wallet = wallets.find((w) => w.wallet_id === selectedWallet.wallet_id);
    if (parseFloat(withdrawAmount) > wallet.balance) {
      alert("Insufficient balance to withdraw the specified amount.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_id: selectedWallet.wallet_id, amount: parseFloat(withdrawAmount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to withdraw from wallet.");
      }

      const updatedWallets = await fetch(`http://127.0.0.1:5000/wallet/${user.user_id}`);
      const updatedData = await updatedWallets.json();
      setWallets(updatedData.wallets || []);
      setShowTopUpForm(false); // Close withdraw form after successful withdraw
    } catch (err) {
      console.error("Error during withdrawal:", err);
      alert("Failed to withdraw from wallet. Please try again.");
    }
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
        {selectedWallet && !showTopUpForm && !showTransferForm && !showWithdrawForm && (
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
          </div>
        )}

        {/* Top Up Form */}
        {showTopUpForm && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Top Up</h5>
                  <button type="button" className="btn-close" onClick={handleBackClick}></button>
                </div>
                <div className="modal-body">
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Enter amount" />
                </div>
                <div className="modal-footer">
                  <button onClick={handleTopUp} className="btn btn-primary">Submit</button>
                  <button onClick={handleBackClick} className="btn btn-secondary">Back to Account</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Form */}
        {showTransferForm && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Transfer</h5>
                  <button type="button" className="btn-close" onClick={handleBackClick}></button>
                </div>
                <div className="modal-body">
                  <select onChange={(e) => setSelectedBeneficiary(e.target.value)} className="form-select mb-3">
                    <option value="">Select beneficiary</option>
                    {beneficiaries.map((b) => (
                      <option key={b.wallet_id} value={b.wallet_id}>{b.wallet_name}</option>
                    ))}
                  </select>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Enter amount" />
                </div>
                <div className="modal-footer">
                  <button onClick={handleTransfer} className="btn btn-primary">Transfer</button>
                  <button onClick={handleBackClick} className="btn btn-secondary">Back to Account</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Form */}
        {showWithdrawForm && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Withdraw</h5>
                  <button type="button" className="btn-close" onClick={handleBackClick}></button>
                </div>
                <div className="modal-body">
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Enter amount" />
                </div>
                <div className="modal-footer">
                  <button onClick={handleWithdraw} className="btn btn-primary">Withdraw</button>
                  <button onClick={handleBackClick} className="btn btn-secondary">Back to Account</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        </div>
  );
}

export default Wallet;
