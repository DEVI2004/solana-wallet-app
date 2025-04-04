// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import './index.css';
// import { Buffer } from 'buffer';
// window.Buffer = Buffer;


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Import Buffer explicitly from 'buffer'
import { Buffer } from 'buffer';
window.Buffer = Buffer;   // Ensure Buffer is globally available

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
