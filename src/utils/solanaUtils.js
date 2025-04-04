import { Buffer } from 'buffer';
if (!window.Buffer) window.Buffer = Buffer;

import { 
    Transaction,
    Connection, 
    PublicKey,
    Keypair,
    SystemProgram, 
    LAMPORTS_PER_SOL, 
    clusterApiUrl, 
    sendAndConfirmTransaction 
} from "@solana/web3.js";

import { 
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getOrCreateAssociatedTokenAccount,
    getAssociatedTokenAddress,
    mintTo,
    getMint,
    MINT_SIZE 
} from "@solana/spl-token";

// Initialize connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Connect Phantom Wallet
// export const connectWallet = async () => {
//     if (window.solana && window.solana.isPhantom) {
//         try {
//             const response = await window.solana.connect();
//             console.log('Connected to wallet with publicKey:', response.publicKey.toString());
//             return response;  // Returns wallet object
//         } catch (err) {
//             console.error('Failed to connect to wallet:', err);
//             return null;
//         }
//     } else {
//         console.error("Phantom Wallet not found. Please install it.");
//         alert("Phantom wallet is not installed. Please install it.");
//         return null;
//     }
// };

export const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        console.log('Phantom wallet is available, attempting to connect...');
        const response = await window.solana.connect();
        console.log("Connected to Phantom wallet:", response.publicKey.toString());
        return response;
      } catch (err) {
        console.error("Failed to connect to wallet:", err);
        alert("Failed to connect to wallet.");
        return null;
      }
    } else {
      console.error("Phantom Wallet not found. Please install it.");
      alert("Phantom wallet is not installed. Please install it.");
      return null;
    }
  };
  

// Fetch wallet balance
export const getWalletBalance = async (publicKey) => {
    try {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        return null;
    }
};

// Create a new token
export const createToken = async (wallet) => {
    try {
        if (!wallet || !wallet.publicKey) {
            console.error("Wallet is not connected properly.");
            return null;
        }

        const mintAuthority = wallet.publicKey;
        const freezeAuthority = null;

        // Generate a new mint account
        const mint = Keypair.generate();
        const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mint.publicKey,
                lamports: lamports,
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mint.publicKey,
                0, // Decimals
                mintAuthority,
                freezeAuthority,
                TOKEN_PROGRAM_ID
            )
        );

        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Sign the transaction using wallet
        transaction.partialSign(mint); // Mint keypair must sign the transaction

        const signedTransaction = await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(signature, "confirmed");

        console.log("Token created successfully. Transaction signature:", signature);
        return mint.publicKey.toString();
    } catch (error) {
        console.error("Error creating token:", error);
        return null;
    }
};


export const checkTokenAccount = async (wallet, mintAddress) => {
    try {
        const associatedTokenAddress = await getAssociatedTokenAddress(
            new PublicKey(mintAddress),
            wallet.publicKey
        );
        console.log("Associated Token Address:", associatedTokenAddress.toString());
        
        // Check if the associated token account exists
        const account = await connection.getAccountInfo(associatedTokenAddress);
        if (account === null) {
            console.log("No associated token account found, creating one...");
            await createTokenAccount(wallet, mintAddress); // Call to create the token account if it doesn't exist
        } else {
            console.log("Associated token account already exists.");
        }
    } catch (error) {
        console.error("Error checking token account:", error);
    }
};


export const createTokenAccount = async (wallet, mintAddress) => {
    try {
        const associatedTokenAddress = await getAssociatedTokenAddress(
            new PublicKey(mintAddress),
            wallet.publicKey
        );

        const transaction = new Transaction().add(
            createAssociatedTokenAccount(
                wallet.publicKey, // Wallet public key
                wallet.publicKey, // Fee payer
                associatedTokenAddress, // New token account address
                new PublicKey(mintAddress) // Token mint address
            )
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = wallet.publicKey;

        const { signature } = await window.solana.signAndSendTransaction(transaction);
        console.log("Associated token account created successfully! Signature:", signature);
    } catch (error) {
        console.error("Failed to create token account:", error);
    }
};


export const mintTokens = async (wallet, mintAddress, amount) => {
    if (!wallet || !wallet.publicKey) {
        console.error("Wallet is not properly connected or initialized.");
        return null;
    }

    try {
        const mint = new PublicKey(mintAddress);
        console.log("Mint Address:", mint.toString());

        // Check if the associated token account exists
        const tokenAccountAddress = await getAssociatedTokenAddress(mint, wallet.publicKey);
        console.log("Associated Token Account Address:", tokenAccountAddress.toString());

        let tokenAccount;
        // Try to get the token account info from the blockchain
        const accountInfo = await connection.getAccountInfo(tokenAccountAddress);

        if (accountInfo === null) {
            console.log("No associated token account found. Creating a new one...");

            // If it doesn't exist, create it
            tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet,
                mint,
                wallet.publicKey
            );
        } else {
            console.log("Associated token account already exists.");
            tokenAccount = { address: tokenAccountAddress };
        }

        // Now mint the tokens
        const transaction = new Transaction().add(
            mintTo(
                TOKEN_PROGRAM_ID,
                mint,
                tokenAccount.address,
                wallet.publicKey,
                [],  // Empty signers array for single signer (wallet public key)
                amount // Amount to mint
            )
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = wallet.publicKey;

        // Sign and send the transaction
        const { signature } = await window.solana.signAndSendTransaction(transaction);
        console.log(`${amount} tokens minted successfully! Signature: ${signature}`);

        return true;
    } catch (error) {
        console.error("Failed to mint tokens:", error);
        return false;
    }
};

// Check if Phantom wallet is available
export const checkPhantomAvailability = () => {
    if (window.solana && window.solana.isPhantom) {
      console.log("Phantom wallet is available!");
      return true;
    } else {
      console.error("Phantom wallet is not installed or accessible.");
      return false;
    }
  };
  