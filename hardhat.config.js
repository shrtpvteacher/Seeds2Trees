require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
const alchemyApiKey = process.env.ALCHEMY_SEPOLIA_API_KEY;


if (!privateKey) {
    console.error("❌ ERROR: Missing SEPOLIA_PRIVATE_KEY in .env file");
    process.exit(1);
  }
  if (!alchemyApiKey) {
    console.error("❌ ERROR: Missing ALCHEMY_SEPOLIA_API_KEY in .env file");
    process.exit(1);
  }

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
        hardhat: {
            chainId: 31337
        }, 
        sepolia: {
            url:  `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, // Replace with your Alchemy or Infura RPC URL
            accounts: [`0x${privateKey}`], // Your MetaMask wallet's private key
            chainId: 11155111,
          },
    },
}    
