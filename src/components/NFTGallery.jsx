import React, { useState, useEffect } from "react";
import { getTotalTrees, getTokenURI, getTreeLocation } from "../helpers/contract";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap"; // ✅ Bootstrap for styling
import "../styles/NFTGallery.css"; // ✅ Ensure the CSS file is linked

const NFTGallery = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  const ipfsGateway = "https://gateway.pinata.cloud/ipfs/"; // ✅ Use Pinata Gateway

  useEffect(() => {
    async function fetchAllNFTs() {
      setLoading(true);
      try {
        const totalTrees = await getTotalTrees(); // ✅ Get total supply of NFTs
        let fetchedNFTs = [];

        for (let tokenId = 1; tokenId <= totalTrees; tokenId++) { // ✅ Token ID starts at 1
          try {
            let metadataURI = await getTokenURI(tokenId);
            if (!metadataURI) throw new Error("Invalid metadata URI");

            // ✅ Convert `ipfs://` to `https://gateway.pinata.cloud/ipfs/`
            const metadataURL = metadataURI.replace("ipfs://", ipfsGateway);
            console.log(`Fetching metadata for Token ID ${tokenId}: ${metadataURL}`);

            const response = await fetch(metadataURL);
            if (!response.ok) throw new Error(`Failed to fetch metadata for Token ID ${tokenId}`);

            const metadata = await response.json();

            // ✅ Convert IPFS image link to gateway format
            let imageUrl = metadata.image ? metadata.image.replace("ipfs://", ipfsGateway) : "";

            // ✅ Fetch GPS coordinates if they exist
            let latitude = "";
            let longitude = "";
            let hasLocation = false;

            try {
              const location = await getTreeLocation(tokenId);
              if (location) {
                latitude = location.latitude;
                longitude = location.longitude;
                hasLocation = latitude && longitude;
              }
            } catch (err) {
              console.warn(`No location found for Token ID ${tokenId}`);
            }

            fetchedNFTs.push({
              tokenId,
              image: imageUrl, // ✅ Ensure images load correctly
              name: metadata.name || `Seeds2Trees NFT #${tokenId}`,
              description: metadata.description || "A tree planted by donation.",
              latitude,
              longitude,
              hasLocation,
            });
          } catch (err) {
            console.error(`Error fetching metadata for Token ID ${tokenId}:`, err);
          }
        }

        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
      setLoading(false);
    }

    fetchAllNFTs();
  }, []);

  return (
    <Container className="nft-gallery-container">
      <h2 className="nft-gallery-title">🌳 All Minted NFTs 🌳</h2>

      {loading ? (
        <Alert variant="info">Loading NFTs...</Alert>
      ) : (
        <Row className="nft-gallery-row">
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <Col key={index} className="nft-card">  {/* ✅ Changed to className="nft-card" */}
              <Card>
                {nft.image ? (
                  <Card.Img variant="top" src={nft.image} alt={nft.name} className="nft-image" /> 
                ) : (
                  <Card.Body>
                    <Alert variant="warning" className="no-image">
                      ❌ No Image Available
                    </Alert>
                  </Card.Body>
                )}
                <Card.Body>
                  <Card.Title>{nft.name}</Card.Title>
                  <Card.Text>{nft.description}</Card.Text>
                  <p><strong>Token ID:</strong> {nft.tokenId}</p>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Alert variant="danger" className="no-nfts">No NFTs have been minted yet.</Alert>
        )}
      </Row>
      )}
    </Container>
  );
};

export default NFTGallery;




/*import React, { useState, useEffect } from "react";
import { getTotalTrees, getTokenURI, getTreeLocation } from "../helpers/contract";
import "../styles/NFTGallery.css";
import { Card, Container } from "react-bootstrap";

const NFTGallery = () => {
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    async function loadNFTs() {
      const total = await getTotalTrees();
      let allNFTs = [];

      for (let i = 0; i < total; i++) {
        const metadata = await getTokenURI(i);
        if (metadata) allNFTs.push({ tokenId: i, ...metadata });
      }
      setNftList(allNFTs);
    }
    loadNFTs();
  }, []);

  return (
    <Container>
      <h2>All Minted NFTs</h2>
      {nftList.map((nft) => (
        <Card key={nft.tokenId}>
          <Card.Img src={nft.image} />
          <Card.Body>
            <Card.Title>{nft.name}</Card.Title>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default NFTGallery;


const NFTGallery = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllNFTs() {
      setLoading(true);
      try {
        const totalTrees = await getTotalTrees(); // ✅ Get total supply of NFTs
        let fetchedNFTs = [];

        for (let tokenId = 0; tokenId < totalTrees; tokenId++) {
          try {
            const metadataURI = await getTokenURI(tokenId);
            const response = await fetch(metadataURI);
            const metadata = await response.json();
            
            // ✅ Fetch GPS coordinates if they exist
            const { latitude, longitude } = await getTreeLocation(tokenId) || { latitude: "", longitude: "" };
            const hasLocation = latitude && longitude;

            fetchedNFTs.push({
              tokenId,
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
              latitude,
              longitude,
              hasLocation,
            });
          } catch (err) {
            console.error(`Error fetching metadata for Token ID ${tokenId}:`, err);
          }
        }

        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
      setLoading(false);
    }

    fetchAllNFTs();
  }, []);

  return (
    <div className="nft-gallery-container">
         <h2 className="nft-gallery-title">All Minted NFTs</h2> 
    

      {loading ? <p>Loading NFTs...</p> : (
        <div className="nft-grid">
          {nfts.map((nft, index) => (
            <div key={index} className="nft-card">
              <img src={nft.image} alt={nft.name} className="nft-image" />
              <div className="nft-details">
                <h3>{nft.name}</h3>
                <p>{nft.description}</p>
                <p><strong>Token ID:</strong> {nft.tokenId}</p>
                
                {/* ✅ Show GPS coordinates if available */ /*}
                {nft.hasLocation ? (
                  <>
                    <p><strong>Latitude:</strong> {nft.latitude}</p>
                    <p><strong>Longitude:</strong> {nft.longitude}</p>
                    <a
                      href={`https://www.google.com/maps?q=${nft.latitude},${nft.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gps-button"
                    >
                      View on Map
                    </a>
                  </>
                ) : (
                  <p className="not-planted">🌱 Not Planted Yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTGallery; */
