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
  const [description, setDescription] = useState('')


  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const username = Cookies.get("username");
        if (!username) throw new Error("User is not logged in.");

        const response = await fetch("https://money-transfer-app-1.onrender.com/users");
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
      const response = await fetch(`https://money-transfer-app-1.onrender.com/wallet/${user.user_id}`);
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
      const response = await fetch(`https://money-transfer-app-1.onrender.com/beneficiaries/${user.user_id}`);
      if (!response.ok) throw new Error("Failed to fetch beneficiaries.");

      const beneficiaries = await response.json();
      setBeneficiaries(beneficiaries);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // Top Up functionality
  const handleTopUp = async () => {
    try {
      const response = await fetch("https://money-transfer-app-1.onrender.com/wallet/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id : user.user_id,
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
      const response = await fetch("https://money-transfer-app-1.onrender.com/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({
          user_id : user.user_id,
          sender_wallet_id : selectedWallet.wallet_id,
          beneficiary_email : selectedBeneficiary,
          amount: parseFloat(amount),
          description:description,
        })
      });

      if (!response.ok) throw new Error("Failed to transfer money.");

      setShowTransferForm(false);
      setSelectedBeneficiary(null);
      setAmount(0);
    } catch (error) {
      console.error(error.message);
      console.log(selectedBeneficiary)
      console.warn(error);
      
      setError(error.message);
    }
  };

  // Withdraw functionality
  const handleWithdraw = async () => {
    try {
      const response = await fetch("https://money-transfer-app-1.onrender.com/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id : user.user_id,
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
    setSelectedBeneficiary(null);
    window.location.reload()
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
    {/* Back Arrow */}
    <button 
      type="button" 
      className="btn p-0 border-0 mb-3" 
      onClick={handleBackClick} 
      style={{ backgroundColor: "transparent", color: "#0046be", fontSize: "1.5rem", position: "absolute", top: "1rem", left: "1rem" }}
    >
      ←
    </button>

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
                    {beneficiaries.map((beneficiary, index) => (
                      <option key={index}>{beneficiary.beneficiary_email}</option>
                    ))}
                  </select>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control mb-3" placeholder="Enter amount" />
                  <input type="string" value= {description} onChange={(e) => setDescription(e.target.value)} className="form-control mb-3" placeholder="Describe your transaction"/>
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