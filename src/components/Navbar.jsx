// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onConnect }) {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated ? (
          <>
            <li>Wallet: {window.solana.publicKey.toString()}</li>
            {/* <li>Balance: {window.solana.balance}</li> */}
          </>
        ) : (
          <li><button onClick={onConnect}>Connect Wallet</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
