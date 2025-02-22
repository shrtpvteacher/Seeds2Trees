import React, { useState, useEffect } from "react";
import { getMinDonation, setMinDonation, getOwner } from "../helpers/contract";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { formatEther } from "ethers";
import "../styles/SetMinDonation.css"; // ✅ Import CSS file

const SetMinDonation = ({ account }) => {
  const [currentMin, setCurrentMin] = useState("0");
  const [newMinDonation, setNewMinDonation] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  // ✅ Fetch the current minDonation & check ownership on load
  useEffect(() => {
    async function fetchData() {
      try {
        const [minDonationWei, owner] = await Promise.all([
          getMinDonation(),
          getOwner()
        ]);

        setCurrentMin(formatEther(minDonationWei)); // ✅ Convert from Wei to ETH
        if (account && owner.toLowerCase() === account.toLowerCase()) {
          setIsOwner(true); // ✅ Check if the user is the contract owner
        }
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setError("Failed to fetch contract data.");
      }
    }

    fetchData();
  }, [account]); // ✅ Runs whenever `account` changes

  // ✅ Handle Min Donation Update
  async function handleUpdate(e) {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!isOwner) {
      setError("You are not the contract owner.");
      return;
    }
    if (!newMinDonation || isNaN(parseFloat(newMinDonation)) || parseFloat(newMinDonation) <= 0) {
      setError("Please enter a valid number greater than zero.");
      return;
    }

    try {
      const tx = await setMinDonation(newMinDonation);
      await tx.wait(); // ✅ Wait for transaction confirmation

      setStatus("✅ Minimum donation updated successfully!");
      setCurrentMin(newMinDonation); // ✅ Update displayed value
      setNewMinDonation(""); // ✅ Reset input field
    } catch (error) {
      console.error("Error updating min donation:", error);
      setError("Failed to update minimum donation.");
    }
  }

  return (
    <Container className="set-min-donation-card">
      <h3 className="set-min-title">Set Minimum Donation</h3>

      {/* ✅ Show error message if any */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ✅ Show current minDonation */}
      <p className="set-min-current">Current Minimum Donation: <strong>{currentMin} ETH</strong></p>

      {isOwner ? (
        <>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="set-min-group">
              <Form.Control
                type="number"
                step="0.001"
                min="0"
                placeholder="Enter new min donation (ETH)"
                value={newMinDonation}
                onChange={(e) => setNewMinDonation(e.target.value)}
                className="set-min-input"
              />
            </Form.Group>
            <Button type="submit" className="set-min-button">Update</Button>
          </Form>
        </>
      ) : (
        <Alert variant="danger">Access Denied: You are not the contract owner.</Alert>
      )}

      {/* ✅ Show status message */}
      {status && <Alert className="set-min-status">{status}</Alert>}
    </Container>
  );
};

export default SetMinDonation;
