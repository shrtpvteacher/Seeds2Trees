 import axios from "axios";

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

// ✅ Upload image to IPFS via Pinata
export async function uploadImageToIPFS(file) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "pinata_api_key": PINATA_API_KEY,
                "pinata_secret_api_key": PINATA_SECRET_KEY,
            },
        });

        console.log("✅ Image uploaded to IPFS:", res.data);
        return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
        console.error("❌ Failed to upload image to IPFS:", error);
        throw new Error("IPFS image upload failed");
    }
}

// ✅ Upload JSON metadata to IPFS via Pinata
export async function uploadJSONToIPFS(jsonData) {
    try {
        const res = await axios.post(`${PINATA_BASE_URL}/pinJSONToIPFS`, jsonData, {
            headers: {
                "Content-Type": "application/json",
                "pinata_api_key": PINATA_API_KEY,
                "pinata_secret_api_key": PINATA_SECRET_KEY,
            },
        });

        console.log("✅ Metadata uploaded to IPFS:", res.data);
        return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
        console.error("❌ Failed to upload metadata to IPFS:", error);
        throw new Error("IPFS metadata upload failed");
    }
}

// ✅ Retrieve metadata from IPFS
export async function fetchMetadataFromIPFS(ipfsURI) {
    try {
        const ipfsURL = ipfsURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
        const res = await axios.get(ipfsURL);
        return res.data;
    } catch (error) {
        console.error("❌ Failed to fetch metadata from IPFS:", error);
        throw new Error("Failed to fetch IPFS metadata");
    }
}
