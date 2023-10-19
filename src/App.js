import React, { useEffect, useState } from "react";
import "./App.css";
import { getTimestamp, createTimestamp, updateTimestamp } from './api';
import { createAndFundWallets } from "./web3";

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
      const timestampData = await getTimestamp(userAddress);
 
      if (timestampData != 0 || (timestampData + 60*60*24) < timeStamp() ) {
        setFaucetStatus("You have already requested funds from the faucet.");
        return faucetStatus;
      }

      const targetAddress = userAddress; // Replace with the recipient's Ethereum address

      const response =await  createAndFundWallets(targetAddress)
      setFaucetStatus("Funds sent! Please wait a moment for the transaction to be confirmed.");
      console.log(response)
      await createTimestamp(userAddress);
      
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
