import React, { useState, useEffect } from "react";
import { getOwner } from "../helpers/contract";
import { Button, Container, Alert } from "react-bootstrap";
import SetTreeLocation from "../components/SetTreeLocation";
import FinalizeWithdraw from "../components/FinalizeWithdraw";
import SetMinDonation from "../components/SetMinDonation";
import "../styles/Admin.css"; // ✅ Import the new CSS file

const Admin = () => {
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Function to connect wallet
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection rejected", error);
        setErrorMessage("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  }

  // ✅ Fetch the contract owner and check if the connected account is the owner
  useEffect(() => {
    const checkOwnership = async () => {
      try {
        if (!account) return; // Do nothing if wallet is not connected
        const contractOwner = await getOwner();
        if (!contractOwner) {
          setErrorMessage("Error fetching contract owner.");
          return;
        }
        setIsOwner(contractOwner.toLowerCase() === account.toLowerCase());
      } catch (error) {
        setErrorMessage("Error verifying ownership. Please try again.");
        console.error("Ownership check error:", error);
      }
    };

    checkOwnership();
  }, [account]); // ✅ Runs when account changes

  return (
    <Container className="admin-page">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* ✅ Show Connect Wallet button if not connected */}
      {!account ? (
        <Button className="connect-wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </Button>
      ) : (
        <Alert variant="info" className="connected-wallet-alert">
          Connected: {account.substring(0, 6)}...{account.slice(-4)}
        </Alert>
      )}

      {/* ✅ Show error message if any */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {/* ✅ Show owner-specific features */}
      {account && isOwner ? (
        <Alert variant="success">Welcome, contract owner!</Alert>
      ) : account ? (
        <Alert variant="warning">Access Denied: You are not the contract owner.</Alert>
      ) : (
        <Alert variant="warning">Please connect your wallet to continue.</Alert>
      )}

           {/* ✅ Display SetTreeLocation functions inside a Blue Card */}
           <div className="owner-card">
        <h3 className="owner-card-title">Manage Tree Locations</h3>
        <SetTreeLocation account={account} />
      </div>
       {/* ✅ Set Min Donation Card */}
       <div className="set-min-donation-card">
        <SetMinDonation account={account} />
      </div>

      {/* ✅ Display FinalizeWithdraw inside a Green Card */}
      <div className="withdraw-card">
        <h3 className="withdraw-card-title">Withdraw Donations</h3>
        <FinalizeWithdraw account={account} isOwner={isOwner} />
      </div>
    </Container>
  );
};

export default Admin;

