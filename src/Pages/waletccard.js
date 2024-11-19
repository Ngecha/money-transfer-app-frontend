import React from 'react';

export default function Walletccard({ wallet, onWalletClick }) {
    return (
        <div
            className="p-4 bg-white rounded shadow cursor-pointer"
            onClick={() => onWalletClick(wallet)}
        >
            <h3 className="text-xl font-semibold">{wallet.wallet_name}</h3>
            <p className="text-gray-600">Balance: {wallet.currency} {wallet.balance.toFixed(2)}</p>
        </div>
    );
}