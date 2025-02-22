import React, { useState, useEffect } from 'react';
import { formatEther } from 'ethers';
import { Container, Alert } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { donateAndMint, getMinDonation } from '../helpers/contract'; // ✅ Removed getTotalTrees & uploadJSONToIPFS
import '../styles/Donate.css';

const Donate = () => {
  const [account, setAccount] = useState(null);
  const [donationAmount, setDonationAmount] = useState(""); // Empty default
  const [donationMinimum, setDonationMinimum] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");

  // ✅ Connect wallet function
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection rejected", error);
      }
    } else {
      alert("Please install MetaMask");
    }
  }

  // ✅ Fetch the minimum donation on component mount
  useEffect(() => {
    async function fetchDonationMinimum() {
      try {
        const donationMinWei = await getMinDonation();
        const donationMinEther = formatEther(donationMinWei); // ✅ Convert from Wei to ETH
        setDonationMinimum(donationMinEther);
      } catch (error) {
        console.error("Error fetching donation minimum:", error);
      }
    }
    fetchDonationMinimum();
  }, []);

  // ✅ Handle donation submission
  async function handleDonate(e) {
    e.preventDefault();
    setIsLoading(true);
    setTxStatus("");

    // ✅ Ensure wallet is connected
    if (!account) {
      await connectWallet();
      if (!window.ethereum.selectedAddress) {
        setTxStatus("Please connect your wallet to donate.");
        setIsLoading(false);
        return;
      }
    }

    // ✅ Validate donation amount
    if (!donationAmount || parseFloat(donationAmount) < parseFloat(donationMinimum)) {
      setTxStatus(`Donation must be at least ${donationMinimum} ETH.`);
      setIsLoading(false);
      return;
    }

    try {
      // ✅ Call contract function (no metadataURI needed)
      const receipt = await donateAndMint(donationAmount);
      console.log("Transaction receipt:", receipt);
      setTxStatus("Success! Transaction confirmed.");
    } catch (error) {
      console.error("Donation error:", error);
      setTxStatus("Error: " + error.message);
    }

    setIsLoading(false);
  }

  return (
    <Container className="donate-container mt-4">
      <h1>Donate To Plant A Tree In The Redwood Forest</h1>
      <h4>And Receive an NFT to Track Your Trees Growth</h4>
    
      <p>Minimum Donation: <strong>{donationMinimum} ETH</strong></p>
      
      <Form onSubmit={handleDonate} style={{ maxWidth: '800px', margin: '50px auto' }}>
        <Form.Group as={Row} className="mb-3" controlId="donationInput">
          <Col>
            <Form.Control
              type="number"
              placeholder={`Minimum: ${donationMinimum} ETH`}
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="donation-input"
              min={donationMinimum} // ✅ Enforce min value
              step="0.001"
            />
          </Col>
          <Col>
            <Button variant="success" type="submit" style={{ width: '100%' }} className="donate-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Donate and Mint'}
            </Button>
          </Col>
        </Form.Group>
      </Form>

      {txStatus && <Alert variant={txStatus.startsWith("Error") ? "danger" : "success"} className="mt-3">{txStatus}</Alert>}
    </Container>
  );
};

export default Donate;
