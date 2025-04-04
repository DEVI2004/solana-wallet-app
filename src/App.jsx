// export default App;


import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/Home';
import LoginPage from './components/LoginPage';
import { connectWallet, getWalletBalance, createToken, mintTokens } from './utils/solanaUtils';
import { Buffer } from 'buffer';
import { Connection } from '@solana/web3.js';

window.Buffer = Buffer;

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [wallet, setWallet] = useState(null); // Store the wallet object instead of just publicKey
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(0);
  const [mintAddress, setMintAddress] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if Phantom Wallet is available
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      console.log("Phantom Wallet detected!");
    } else {
      console.log("Phantom Wallet NOT detected. Please install it from https://phantom.app/");
    }
  }, []);

  // Add event listener to detect when wallet is disconnected
  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.on('connect', () => {
        console.log('Phantom wallet connected');
        setWalletConnected(true);
        setIsAuthenticated(true);
      });

      window.solana.on('disconnect', () => {
        console.log('Phantom wallet disconnected');
        setWallet(null);
        setWalletConnected(false);
        setIsAuthenticated(false);
      });
    }

    return () => {
      if (window.solana) {
        window.solana.removeListener('connect');
        window.solana.removeListener('disconnect');
      }
    };
  }, []);

  const handleConnectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      const response = await window.solana.connect();
      console.log("Connected with public key:", response.publicKey.toString());
      setWallet(response); // Store the response object
      setPublicKey(response.publicKey.toString());
      setWalletConnected(true);
      setIsAuthenticated(true);

      const walletBalance = await getWalletBalance(response.publicKey.toString());
      setBalance(walletBalance);
    } else {
      alert("Please install Phantom Wallet.");
    }
  };

  const handleCreateToken = async () => {
    if (!wallet) {
      console.error("Please connect your wallet before creating a token.");
      return;
    }

    try {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      // Call createToken and pass the wallet object
      const result = await createToken(wallet, connection);

      if (result) {
        console.log("Token created successfully:", result);
        setMintAddress(result);
      }
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  const handleMintTokens = async () => {
    if (!wallet || !mintAddress) return;

    const success = await mintTokens(wallet, mintAddress, 10); // Minting 10 tokens
    if (success) alert("Tokens minted successfully!");
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onConnect={handleConnectWallet} />
      <div className="container">
        {!walletConnected ? (
          <button onClick={handleConnectWallet}>Connect Phantom Wallet</button>
        ) : (
          <div>
            <p>Wallet Connected ✅</p>
            <p>Public Key: {publicKey}</p>
            <p>Balance: {balance} SOL</p>

            <button onClick={handleCreateToken}>Create Token</button>
            {mintAddress && (
              <div>
                <p>Mint Address: {mintAddress}</p>
                <button onClick={handleMintTokens}>Mint Tokens</button>
              </div>
            )}
          </div>
        )}
        <Routes>
          <Route path="/" element={<HomePage balance={balance} onMint={handleMintTokens} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
