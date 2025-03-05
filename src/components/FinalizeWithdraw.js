/*import React, { useState, useEffect } from "react";
import { finalizeWithdraw, getOwner } from "../helpers/contract";
import { Button, Container, Alert, Card } from "react-bootstrap";
import { BrowserProvider, formatEther } from "ethers";
import networkConfig from "../settings/networkConfig.json"; // ✅ Import network config

const FinalizeWithdraw = ({ account, isOwner }) => {
  const [contractBalance, setContractBalance] = useState("0");
  const [updatedBalance, setUpdatedBalance] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  // ✅ Fetch contract balance (Smart Contract's Balance, NOT the Owner's)
  async function fetchContractBalance() {
    try {
        if (!window.ethereum) return;

        const provider = new BrowserProvider(window.ethereum);
        const contract = await getContract.address(); // ✅ Fetch contract instance
        const contractAddress = await contract.getAddress(); // ✅ Fetch contract address
        const balanceWei = await provider.getBalance(contractAddress); // ✅ Fetch the contract's ETH balance
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
      setWithdrawError("❌ Access Denied: Only the contract owner can withdraw funds.");
      return;
    }

    try {
      const receipt = await finalizeWithdraw();
      console.log("Withdrawal transaction receipt:", receipt);

      setWithdrawStatus("✅ Success! Funds have been withdrawn.");
      setRecipientAddress(await getOwner()); // ✅ Show the address where funds were sent

      // ✅ Fetch updated contract balance after withdrawal
      setTimeout(async () => {
        setUpdatedBalance(); // ✅ Correctly update balance after withdrawal
      }, 5000);
    } catch (err) {
      console.error("Withdrawal error:", err);
      setWithdrawError("❌ Failed to withdraw funds: " + err.message);
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
        <Alert variant="danger" className="mt-3">❌ Access Denied: You are not the contract owner.</Alert>
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

export default FinalizeWithdraw;  */

import React, { useState, useEffect } from "react";
import { finalizeWithdraw, getContractBalance } from "../helpers/contract";
import { Button, Container, Alert, Card } from "react-bootstrap";

const FinalizeWithdraw = ({ isOwner }) => {
  const [contractBalance, setContractBalance] = useState("0");
  const [withdrawStatus, setWithdrawStatus] = useState("");
  const [withdrawError, setWithdrawError] = useState("");

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balance = await getContractBalance();
        setContractBalance(balance);
      } catch (error) {
        console.error("Error fetching contract balance:", error);
      }
    }
    fetchBalance();
  }, []);

  async function handleWithdraw() {
    setWithdrawStatus("");
    setWithdrawError("");

    if (!isOwner) {
      setWithdrawError("Access Denied: Only the contract owner can withdraw funds.");
      return;
    }

    try {
      const tx = await finalizeWithdraw();
      setWithdrawStatus("✅ Funds withdrawn successfully!");
      console.log("Withdrawal transaction:", tx);
    } catch (err) {
      console.error("Withdrawal error:", err);
      setWithdrawError("❌ Failed to withdraw funds.");
    }
  }

  return (
    <Container>
      <h2>Finalize Withdraw</h2>
      <Card>
        <Card.Body>
          <Card.Title>Contract Balance: {contractBalance} ETH</Card.Title>
          <Button variant="danger" onClick={handleWithdraw}>Withdraw Funds</Button>
        </Card.Body>
      </Card>
      {withdrawStatus && <Alert variant="success">{withdrawStatus}</Alert>}
      {withdrawError && <Alert variant="danger">{withdrawError}</Alert>}
    </Container>
  );
};

export default FinalizeWithdraw;
