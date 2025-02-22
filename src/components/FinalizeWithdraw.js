import React, { useState, useEffect } from "react";
import { finalizeWithdraw, getOwner } from "../helpers/contract";
import { Button, Container, Alert, Card } from "react-bootstrap";
import { BrowserProvider, formatEther } from "ethers";

const FinalizeWithdraw = ({ account, isOwner }) => {
  const [contractBalance, setContractBalance] = useState("0");
  const [updatedBalance, setUpdatedBalance] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  // ✅ Fetch contract balance
  async function fetchContractBalance() {
    try {
      if (!window.ethereum) return;

      const provider = new BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(account); // Get contract balance in Wei
      const balanceEth = formatEther(balanceWei); // Convert to ETH
      setContractBalance(balanceEth);
    } catch (error) {
      console.error("Error fetching contract balance:", error);
    }
  }

  useEffect(() => {
    fetchContractBalance();
  }, [account]);

  // ✅ Handle withdraw function
  async function handleWithdraw() {
    setWithdrawStatus("");
    setWithdrawError("");
    setRecipientAddress("");

    if (!isOwner) {
      setWithdrawError("Access Denied: Only the contract owner can withdraw funds.");
      return;
    }

    try {
      const receipt = await finalizeWithdraw();
      console.log("Withdrawal transaction receipt:", receipt);

      setWithdrawStatus("Success! Funds have been withdrawn.");
      setRecipientAddress(receipt.to); // ✅ Show the address where funds were sent

      // ✅ Fetch updated contract balance after withdrawal
      setTimeout(async () => {
        const provider = new BrowserProvider(window.ethereum);
        const balanceWei = await provider.getBalance(account);
        const balanceEth = formatEther(balanceWei);
        setUpdatedBalance(balanceEth);
      }, 5000);
    } catch (err) {
      console.error("Withdrawal error:", err);
      setWithdrawError("Failed to withdraw funds: " + err.message);
    }
  }

  return (
    <Container className="mt-4">
      <h2>Finalize Withdraw</h2>

      <Card className="balance-card">
        <Card.Body>
          <Card.Title>Contract Balance</Card.Title>
          <Card.Text><strong>Before Withdraw:</strong> {contractBalance} ETH</Card.Text>
          {updatedBalance && <Card.Text><strong>After Withdraw:</strong> {updatedBalance} ETH</Card.Text>}
        </Card.Body>
      </Card>

      {!isOwner ? (
        <Alert variant="danger" className="mt-3">Access Denied: You are not the contract owner.</Alert>
      ) : (
        <>
          <Button variant="danger" onClick={handleWithdraw} className="mt-3">
            Withdraw Funds
          </Button>
        </>
      )}

      {withdrawStatus && <Alert variant="success" className="mt-3">{withdrawStatus}</Alert>}
      {withdrawError && <Alert variant="danger" className="mt-3">{withdrawError}</Alert>}

      {recipientAddress && (
        <Alert variant="info" className="mt-3">
          Funds were sent to: <strong>{recipientAddress}</strong>
        </Alert>
      )}
    </Container>
  );
};

export default FinalizeWithdraw;
