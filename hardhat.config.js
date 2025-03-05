require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat:{
        chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
      chainId: 11155111, // Sepolia Testnet Chain ID
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL,
      accounts: process.env.ARBITRUM_PRIVATE_KEY ? [process.env.ARBITRUM_PRIVATE_KEY] : [],
      chainId: 42161, // Arbitrum One Mainnet Chain ID
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY, // API key for verifying Sepolia contracts
      arbitrumOne: process.env.ARBISCAN_API_KEY, // API key for verifying Arbitrum One contracts
    }
  }
};
