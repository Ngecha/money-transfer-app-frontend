import React, { useState, useEffect } from 'react';
import LeftNav from '../Components/LeftNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie';
import Walletccard from './Walletccard';

function Wallet() {
    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [showTopUpForm, setShowTopUpForm] = useState(false);
    const [showTransferForm, setShowTransferForm] = useState(false);

    useEffect(() => {
        const userId = Cookies.get('userId');
        if (userId) {
            fetch(`http://127.0.0.1:5000/wallet/${userId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.wallets) {
                        setWallets(data.wallets);
                    } else {
                        console.error('No wallets data returned');
                    }
                })
                .catch(error => console.error('Error fetching wallets:', error));
        } else {
            console.log('User ID is not available');
        }
    }, []);

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
                <h2 className="mb-4">Wallet</h2>

                {!selectedWallet && !showTopUpForm && !showTransferForm && (
                    <div className="d-flex flex-wrap gap-3">
                        {wallets.map((wallet) => (
                            <Walletccard
                                key={wallet.wallet_id}
                                wallet={wallet}
                                onWalletClick={handleWalletClick}
                            />
                        ))}
                    </div>
                )}

                {selectedWallet && (
                    <div className="card p-4 mx-auto" style={{ maxWidth: '22rem', backgroundColor: '#f7f9fc', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <h5 className="text-center mb-3" style={{ fontWeight: '600' }}>{selectedWallet.wallet_name || "Unnamed Wallet"}</h5>
                        <p className="text-center fs-5 mb-4">Balance: <strong>{selectedWallet.currency} {selectedWallet.balance}</strong></p>

                        <div className="d-flex gap-3 justify-content-between mb-4">
                            <div className="card text-center p-3" style={{ flex: '1', borderRadius: '8px', backgroundColor: '#e7ebf0' }}>
                                <h6 className="mb-2">
                                    <i className="fas fa-arrow-down text-danger me-2"></i>Account Balance
                                </h6>
                                <p className="fs-5 mb-0">{selectedWallet.currency} {selectedWallet.balance.toFixed(2)}</p>
                            </div>
                            <div className="card text-center p-3" style={{ flex: '1', borderRadius: '8px', backgroundColor: '#e7ebf0' }}>
                                <h6 className="mb-2">Total Monthly Spending</h6>
                                <p className="fs-5 mb-1">{selectedWallet.currency} 4,565.23</p>
                                <p className="text-muted small">68% of your limit</p>
                                <div className="progress" style={{ height: '6px', borderRadius: '3px' }}>
                                    <div
                                        className="progress-bar bg-primary"
                                        role="progressbar"
                                        style={{ width: '68%' }}
                                        aria-valuenow="68"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mb-4">
                            <button
                                type="button"
                                className="btn rounded-pill px-4"
                                onClick={handleTopUpClick}
                                style={{ backgroundColor: '#0046be', color: 'white' }}
                            >
                                Top up
                            </button>
                            <button
                                type="button"
                                className="btn rounded-pill px-4"
                                onClick={handleTransferClick}
                                style={{ backgroundColor: '#1c1c1c', color: 'white' }}
                            >
                                Transfer
                            </button>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={handleBackClick}
                        >
                            Back to Wallets
                        </button>
                    </div>
                )}

                {showTopUpForm && (
                    <div className="card p-4 mx-auto" style={{ maxWidth: '22rem', backgroundColor: '#f7f9fc', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <h5 className="text-center mb-3">Top Up</h5>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="form-control mb-3"
                        />
                        <button
                            type="button"
                            className="btn w-100 mb-2"
                            style={{ backgroundColor: '#0046be', color: 'white' }}
                        >
                            Top up
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={handleBackClick}
                        >
                            Back to Wallets
                        </button>
                    </div>
                )}

                {showTransferForm && (
                    <div className="card p-4 mx-auto" style={{ maxWidth: '22rem', backgroundColor: '#f7f9fc', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <h5 className="text-center mb-3">Send Money</h5>
                        <select className="form-select mb-3">
                            <option>Choose beneficiary</option>
                            {/* Add options */}
                        </select>
                        <label>Enter Amount</label>
                        <input
                            type="number"
                            placeholder=""
                            className="form-control mb-3"
                        />
                        <button
                            type="button"
                            className="btn w-100 mb-2"
                            style={{ backgroundColor: '#0046be', color: 'white' }}
                        >
                            Send
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={handleBackClick}
                        >
                            Back to Wallets
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wallet;
