import React, { useState, useEffect } from "react";
import { getTokenURI, updateTreeLocation, getOwner } from "../helpers/contract";
import { uploadJSONToIPFS } from "../helpers/ipfs";
import { Container, Form, Button, Alert } from "react-bootstrap";

const OwnerUpdate = ({ account }) => {
  const [owner, setOwner] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOwner() {
      try {
        const contractOwner = await getOwner();
        setOwner(contractOwner.toLowerCase());
      } catch (err) {
        console.error("Error fetching owner:", err);
        setError("Unable to fetch contract owner.");
      }
    }
    fetchOwner();
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!account) {
        setError("Please connect your wallet first.");
        return;
    }
  
    if (account.toLowerCase() !== owner) {
        setError("Access denied: You are not the contract owner.");
        return;
    }

    if (!tokenId || !latitude || !longitude) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const tokenURI = await getTokenURI(tokenId);
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      metadata.attributes = metadata.attributes.map(attr => {
        if (attr.trait_type.toLowerCase() === "latitude") return { trait_type: "latitude", value: latitude };
        if (attr.trait_type.toLowerCase() === "longitude") return { trait_type: "longitude", value: longitude };
        return attr;
      });

      metadata.description = `Tree located at latitude ${latitude} and longitude ${longitude}.`;

      const newMetadataURI = await uploadJSONToIPFS(metadata);
      console.log("New metadata uploaded to IPFS:", newMetadataURI);

      const receipt = await updateTreeLocation(tokenId, newMetadataURI);
      console.log("Update transaction receipt:", receipt);
      setStatus("Update successful! Token metadata updated.");
    } catch (err) {
      console.error("Error updating token location:", err);
      setError("Failed to update token location. " + err.message);
    }
  }

  return (
    <Container className="mt-4">
      <div className="admin-card">
        <h2>Admin: Update Tree Location</h2>
        
        {!account ? (
          <Alert variant="warning">Please connect your wallet first.</Alert>
        ) : account.toLowerCase() !== owner ? (
          <Alert variant="danger">Access Denied: You are not the contract owner.</Alert>
        ) : (
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="formTokenId">
              <Form.Label>Token ID</Form.Label>
              <Form.Control type="text" placeholder="Enter token id" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLatitude">
              <Form.Label>Latitude</Form.Label>
              <Form.Control type="text" placeholder="Enter latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLongitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control type="text" placeholder="Enter longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">Update Location</Button>
          </Form>
        )}

        {status && <Alert variant="success" className="mt-3">{status}</Alert>}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </div>
    </Container>
  );
};

export default OwnerUpdate;
