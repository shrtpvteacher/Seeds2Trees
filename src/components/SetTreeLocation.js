/* import React, { useState } from "react";
import { getTokenURI, updateTreeLocation } from "../helpers/contract";
import { uploadJSONToIPFS } from "../helpers/ipfs";
import { Container, Form, Button, Alert } from "react-bootstrap";

const SetTreeLocation = ({ account, isOwner }) => {
  const [tokenId, setTokenId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingContract, setIsUpdatingContract] = useState(false);

  // ✅ First Step: Upload updated metadata to IPFS
  async function handleUploadToIPFS(e) {
    e.preventDefault();
    setStatus("");
    setError("");
    setMetadataURI("");
    setIsUploading(true);

    if (!tokenId || !latitude || !longitude) {
      setError("Please fill in all fields.");
      setIsUploading(false);
      return;
    }

    try {
      // ✅ Fetch current token metadata from IPFS
      const tokenURI = await getTokenURI(tokenId);
      const response = await fetch(tokenURI);
      if (!response.ok) throw new Error("Failed to fetch existing metadata");
      const metadata = await response.json();

      // ✅ Ensure Latitude & Longitude exist in attributes
      metadata.attributes = metadata.attributes.map(attr => {
        if (attr.trait_type.toLowerCase() === "latitude") return { trait_type: "latitude", value: latitude };
        if (attr.trait_type.toLowerCase() === "longitude") return { trait_type: "longitude", value: longitude };
        return attr;
      });

      // ✅ If they don’t exist, add them
      if (!metadata.attributes.some(attr => attr.trait_type === "latitude")) {
        metadata.attributes.push({ trait_type: "latitude", value: latitude });
      }
      if (!metadata.attributes.some(attr => attr.trait_type === "longitude")) {
        metadata.attributes.push({ trait_type: "longitude", value: longitude });
      }

      // ✅ Update description with new location
      metadata.description = `Tree located at latitude ${latitude} and longitude ${longitude}.`;

      // ✅ Upload updated metadata to IPFS
      const newMetadataURI = await uploadJSONToIPFS(metadata);
      console.log("✅ New metadata uploaded to IPFS:", newMetadataURI);

      setMetadataURI(newMetadataURI);
      setStatus("✅ Metadata uploaded successfully! Now update the smart contract.");
    } catch (err) {
      console.error("❌ Error uploading metadata to IPFS:", err);
      setError("❌ Failed to upload metadata.");
    }
    setIsUploading(false);
  }

  // ✅ Second Step: Update Metadata URI on Smart Contract
  async function handleUpdateSmartContract() {
    setStatus("");
    setError("");
    setIsUpdatingContract(true);

    if (!metadataURI) {
      setError("Please upload metadata first.");
      setIsUpdatingContract(false);
      return;
    }

    if (!isOwner) {
      setError("Access denied: You are not the contract owner.");
      setIsUpdatingContract(false);
      return;
    }

    try {
      // ✅ Call smart contract function to update metadata URI
      const receipt = await updateTreeLocation(tokenId, metadataURI);
      console.log("✅ Smart contract updated:", receipt);

      setStatus(`✅ Smart contract updated successfully!`);
    } catch (err) {
      console.error("❌ Error updating contract:", err);
      setError("❌ Failed to update smart contract.");
    }
    setIsUpdatingContract(false);
  }

  return (
    <Container className="mt-4">
      <div className="admin-card">
        <h2>Admin: Update Tree Location</h2>

        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleUploadToIPFS}>
          <Form.Group className="mb-3">
            <Form.Label>Token ID</Form.Label>
            <Form.Control type="text" placeholder="Enter token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Latitude</Form.Label>
            <Form.Control type="text" placeholder="Enter latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Longitude</Form.Label>
            <Form.Control type="text" placeholder="Enter longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isUploading}>
            {isUploading ? "Uploading to IPFS..." : "Upload Metadata to IPFS"}
          </Button>
        </Form>

        {metadataURI && (
          <Alert variant="success" className="mt-3">
            ✅ Metadata uploaded! <br />
            <strong>New IPFS URI:</strong> {metadataURI}
          </Alert>
        )}

        
        <Button
          variant="success"
          onClick={handleUpdateSmartContract}
          disabled={!metadataURI || isUpdatingContract}
          className="mt-3"
        >
          {isUpdatingContract ? "Updating Smart Contract..." : "Update Smart Contract"}
        </Button>

        {status && <Alert variant="success" className="mt-3">{status}</Alert>}
      </div>
    </Container>
  );
};

export default SetTreeLocation;  */



import React, { useState } from "react";
import { updateTreeLocation, getTokenURI } from "../helpers/contract";
import { uploadJSONToIPFS } from "../helpers/ipfs";
import { Container, Form, Button, Alert } from "react-bootstrap";

const SetTreeLocation = ({ isOwner }) => {
  const [tokenId, setTokenId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleUpdate(e) {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!isOwner) {
      setError("❌ Access Denied: Only contract owner can update location.");
      return;
    }

    try {
      const tokenURI = await getTokenURI(tokenId);
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      metadata.attributes.push({ trait_type: "latitude", value: latitude });
      metadata.attributes.push({ trait_type: "longitude", value: longitude });

      const newMetadataURI = await uploadJSONToIPFS(metadata);
      await updateTreeLocation(tokenId, newMetadataURI);

      setStatus("✅ Tree location updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      setError("❌ Failed to update tree location.");
    }
  }

  return (
    <Container>
      <h2>Set Tree Location</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Control type="text" placeholder="Token ID" onChange={(e) => setTokenId(e.target.value)} />
        <Form.Control type="text" placeholder="Latitude" onChange={(e) => setLatitude(e.target.value)} />
        <Form.Control type="text" placeholder="Longitude" onChange={(e) => setLongitude(e.target.value)} />
        <Button type="submit">Update Location</Button>
      </Form>
      {status && <Alert variant="success">{status}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </Container>
  );
};

export default SetTreeLocation;

