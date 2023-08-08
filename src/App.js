import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import { PRIVATE_KEY, RPC_ENDPOINT } from "./NetworkInfo";
import { getTimestamp, createTimestamp, updateTimestamp } from './api';

function App() {

  const [userAddress, setUserAddress] = useState("");
  const [faucetStatus, setFaucetStatus] = useState("");

  const timeStamp = async () => {
    const currentTime = new Date();
    const currentTimestampInSeconds = Math.floor(currentTime.getTime() / 1000);
    return currentTimestampInSeconds
  }


  const requestFunds = async () => {
    try {
      const wallet = new ethers.Wallet(PRIVATE_KEY);
      const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const timestampData = await getTimestamp(userAddress);
 
      if (timestampData != 0 || (timestampData + 60*60*24) < timeStamp() ) {
        setFaucetStatus("You have already requested funds from the faucet.");
        return faucetStatus;
      }

          // Get the current nonce of the account
      const currentNonce = await provider.getTransactionCount(wallet.address);

      const targetAddress = userAddress; // Replace with the recipient's Ethereum address

      const valueToSend = ethers.utils.parseEther('0.1');


      // Create a transaction object
      const transaction = {
        to: targetAddress,
        value: valueToSend,
        gasLimit: 80000,
        nonce: currentNonce,
        chainId: 103070,
      };

      // Sign the transaction with the wallet
      const signedTransaction = await wallet.signTransaction(transaction);


      // Send the transaction
      const txResponse = await provider.sendTransaction(signedTransaction);

      console.log('Transaction sent:', txResponse);
      await createTimestamp(userAddress);
      setFaucetStatus("Funds sent! Please wait a moment for the transaction to be confirmed.");
      
    } catch (error) {
      console.error("Error requesting funds:", error.message);
      setFaucetStatus("Failed to request funds. Please try again later.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Pixel Token (PIXEL)</h1>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Pixel Faucet</h1>
            <p>Fast and reliable .5 PIXEL/day.</p>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    onChange={(e) => setUserAddress(e.target.value)}
                  />
                </div>
                <div className="column">
                  <button onClick={requestFunds} className="button is-link is-medium">
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p>{faucetStatus}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
