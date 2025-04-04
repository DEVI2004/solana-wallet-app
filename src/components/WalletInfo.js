// src/components/WalletInfo.js

import React, { useState, useEffect } from "react";
import { getWalletBalance } from "../utils/solanaUtils"; // Import the function

const WalletInfo = ({ walletAddress }) => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (walletAddress) {
            getWalletBalance(walletAddress).then(setBalance);
        }
    }, [walletAddress]);

    return (
        <div>
            <h2>Connected Wallet: {walletAddress}</h2>
            <h3>Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</h3>
        </div>
    );
};

export default WalletInfo;
