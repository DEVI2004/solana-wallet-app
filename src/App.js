// // // src/App.js

// // import React, { useState, useEffect } from 'react';
// // import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// // import Navbar from './components/Navbar';
// // import HomePage from './components/HomePage';
// // import LoginPage from './components/LoginPage';
// // import { connectWallet, getWalletBalance, mintTokens } from './utils/solanaUtils';

// // function App() {
// //   const [wallet, setWallet] = useState(null);
// //   const [balance, setBalance] = useState(0);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// //   // useEffect(() => {
// //   //   if (wallet) {
// //   //     fetchBalance(wallet.publicKey);
// //   //     setIsAuthenticated(true);
// //   //   } else {
// //   //     setIsAuthenticated(false);
// //   //   }
// //   // }, [wallet]);
// //   useEffect(() => {
// //     if (checkPhantomAvailability()) {
// //       console.log("Phantom wallet is available.");
// //     } else {
// //       alert("Please install Phantom Wallet.");
// //     }
// //   }, []);

// //   const fetchBalance = async (publicKey) => {
// //     const balance = await getWalletBalance(publicKey);
// //     setBalance(balance);
// //   };

// //   const handleConnectWallet = async () => {
// //     const connectedWallet = await connectWallet();
// //     setWallet(connectedWallet);
// //   };

// //   const handleMintTokens = async () => {
// //     const mintAddress = "Your Token Mint Address"; // Replace with your actual mint address
// //     const amount = 1000; // Example token amount
// //     await mintTokens(wallet, mintAddress, amount);
// //     fetchBalance(wallet.publicKey); // Update balance after minting
// //   };

// //   return (
// //     <Router>
// //       <Navbar isAuthenticated={isAuthenticated} onConnect={handleConnectWallet} />
// //       <div className="container">
// //         <Routes>
// //           <Route path="/" element={<HomePage balance={balance} onMint={handleMintTokens} />} />
// //           <Route path="/login" element={<LoginPage />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import HomePage from './components/HomePage';
// import LoginPage from './components/LoginPage';
// import { connectWallet, getWalletBalance, mintTokens, checkPhantomAvailability } from './utils/solanaUtils';

// function App() {
//   const [wallet, setWallet] = useState(null);
//   const [balance, setBalance] = useState(0);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Add event listener to detect when wallet is disconnected
//   useEffect(() => {
//     if (checkPhantomAvailability()) {
//       window.solana.on('connect', () => {
//         console.log('Phantom wallet connected');
//       });

//       window.solana.on('disconnect', () => {
//         console.log('Phantom wallet disconnected');
//         setWallet(null);
//         setIsAuthenticated(false);
//       });
//     }

//     return () => {
//       if (window.solana) {
//         window.solana.removeListener('connect');
//         window.solana.removeListener('disconnect');
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (wallet) {
//       fetchBalance(wallet.publicKey);
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }
//   }, [wallet]);

//   const fetchBalance = async (publicKey) => {
//     const balance = await getWalletBalance(publicKey);
//     setBalance(balance);
//   };

//   const handleConnectWallet = async () => {
//     const connectedWallet = await connectWallet();
//     setWallet(connectedWallet);
//   };

//   const handleMintTokens = async () => {
//     const mintAddress = "Your Token Mint Address"; // Replace with your actual mint address
//     const amount = 1000; // Example token amount
//     await mintTokens(wallet, mintAddress, amount);
//     fetchBalance(wallet.publicKey); // Update balance after minting
//   };

//   return (
//     <Router>
//       <Navbar isAuthenticated={isAuthenticated} onConnect={handleConnectWallet} />
//       <div className="container">
//         <Routes>
//           <Route path="/" element={<HomePage balance={balance} onMint={handleMintTokens} />} />
//           <Route path="/login" element={<LoginPage />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
