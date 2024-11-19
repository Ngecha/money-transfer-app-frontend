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
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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
              className="form-control mb-3"
            />
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
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

        {/* Transfer Form */}
        {showTransferForm && (
          <div
            className="card p-4 mx-auto"
            style={{
              maxWidth: "25rem",
              backgroundColor: "#f0f8ff",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="text-center mb-3 text-primary">Send Money</h5>
            <select className="form-select mb-3">
              <option>Choose beneficiary</option>
              {/* Add dynamic options */}
            </select>
            <input
              type="number"
              placeholder="Enter amount"
              className="form-control mb-3"
            />
            <button
              type="button"
              className="btn btn-primary w-100 mb-2"
              style={{ borderRadius: "8px" }}
            >
              Send
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
  );
}

export default Wallet;
