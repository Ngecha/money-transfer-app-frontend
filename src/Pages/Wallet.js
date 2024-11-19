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
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const username = Cookies.get("username");
      if (!username) {
        setError("User is not logged in.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        const users = data.users;
        const loggedInUser = users.find((u) => u.username === username);

        if (!loggedInUser) {
          throw new Error("Logged-in user not found.");
        }

        setUser(loggedInUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchWallet() {
      if (user) {
        fetch(`http://127.0.0.1:5000/wallet/${user.user_id}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.wallets) {
              setWallets(data.wallets);
            } else {
              console.error("No wallets data returned");
            }
          })
          .catch((error) => console.error("Error fetching wallets:", error));
      } else {
        console.log("User ID is not available");
      }
    }
    fetchWallet();
  }, [user]);

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setShowTopUpForm(false);
    setShowTransferForm(false);
  };

  const handleTopUpClick = () => {
    setShowTopUpForm(true);
    setShowTransferForm(false);
  };

  const handleTransferClick = () => {
    setShowTransferForm(true);
    setShowTopUpForm(false);
  };

  const handleBackClick = () => {
    setSelectedWallet(null);
    setShowTopUpForm(false);
    setShowTransferForm(false);
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
        {!selectedWallet && !showTopUpForm && !showTransferForm && (
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
          <div
            className="card p-4 mx-auto"
            style={{
              maxWidth: "25rem",
              backgroundColor: "#f0f8ff",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="text-center mb-3 text-primary">
              {selectedWallet.wallet_name || "Unnamed Wallet"}
            </h5>

            <div className="d-flex flex-column align-items-center mb-4">
              <h6 className="text-muted mb-2">Balance</h6>
              <p className="fs-4 fw-bold text-dark">
                {selectedWallet.currency} {selectedWallet.balance.toFixed(2)}
              </p>
            </div>

            <div className="d-flex gap-3 justify-content-between mb-4">
              <button
                type="button"
                className="btn rounded-pill flex-grow-1"
                onClick={handleTopUpClick}
                style={{
                  backgroundColor: "#0046be",
                  color: "white",
                }}
              >
                Top Up
              </button>
              <button
                type="button"
                className="btn rounded-pill flex-grow-1"
                onClick={handleTransferClick}
                style={{
                  backgroundColor: "#1c1c1c",
                  color: "white",
                }}
              >
                Transfer
              </button>
              <button
                type="button"
                className="btn rounded-pill flex-grow-1"
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                }}
              >
                Withdraw
              </button>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleBackClick}
            >
              Back to Wallets
            </button>
          </div>
        )}

        {/* Top-Up Form */}
        {showTopUpForm && (
          <div
            className="card p-4 mx-auto"
            style={{
              maxWidth: "25rem",
              backgroundColor: "#f0f8ff",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="text-center mb-3 text-primary">Top Up</h5>
            <input
              type="number"
              placeholder="Enter amount"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="form-control mb-3"
            />
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              onClick={handleFundSubmit}
              style={{ borderRadius: "8px" }}
            >
              Confirm Top-Up
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleBackClick}
              style={{ borderRadius: "8px" }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Withdraw Form */}

        <div class="modal-dialog modal-dialog-centered">
  ...       {selectedWallet && !showTopUpForm && !showTransferForm && (
          <div
            className="card p-4 mx-auto"
            style={{
              maxWidth: "25rem",
              backgroundColor: "#f0f8ff",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="text-center mb-3 text-primary">Withdraw</h5>
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="form-control mb-3"
            />
            <button
              type="button"
              className="btn btn-success w-100 mb-2"
              onClick={handleWithdrawSubmit}
              style={{ borderRadius: "8px" }}
            >
              Confirm Withdraw
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleBackClick}
              style={{ borderRadius: "8px" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
        </div>
        
    </div>
  );
}

export default Wallet;
