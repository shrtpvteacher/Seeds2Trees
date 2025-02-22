/*const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Read Pinata credentials from .env
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Endpoint to pin JSON metadata to IPFS via Pinata
app.post('/api/upload', async (req, res) => {
  try {
    const jsonData = req.body;
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    const response = await axios.post(url, jsonData, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        "Content-Type": "application/json"
      }
    });
    const ipfsHash = response.data.IpfsHash;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    res.status(200).json({ url: gatewayUrl });
  } catch (err) {
    console.error("Error uploading to Pinata:", err.response ? err.response.data : err);
    res.status(500).json({ error: "Pinata upload error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));*/