import React, { useState, useEffect } from "react";
import { getTotalTrees, getTokenURI, getTreeLocation } from "../helpers/contract";
import "../styles/NFTGallery.css";

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
                
                {/* ✅ Show GPS coordinates if available */}
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

export default NFTGallery;
