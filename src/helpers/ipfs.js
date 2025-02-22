
  
  export async function uploadJSONToIPFS(jsonData) {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
        },
        body: JSON.stringify(jsonData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload JSON to IPFS`);
      }
  
      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading JSON to IPFS:", error);
      throw error;
    }
  }