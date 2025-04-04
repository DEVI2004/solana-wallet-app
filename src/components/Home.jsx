// src/components/HomePage.js

import React from 'react';

function HomePage({ balance, onMint }) {
  return (
    <div>
      <h1>Welcome to the Token Dashboard</h1>
      <p>Your wallet balance: {balance} SOL</p>
      <button onClick={onMint}>Mint Tokens</button>
    </div>
  );
}

export default HomePage;
