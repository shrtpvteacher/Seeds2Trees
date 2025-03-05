const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  // ✅ Load environment variables
  const network = hre.network.name;
  const deployer = (await hre.ethers.getSigners())[0];
  
  // ✅ Ensure IPFS Base URI is set
  if (!process.env.IPFS_BASE_URI) {
    throw new Error("❌ IPFS_BASE_URI is missing in .env file");
  }
  const baseURI = process.env.IPFS_BASE_URI; // IPFS Metadata URI
  
  console.log(`🚀 Deploying Seeds2Trees contract...`);
  console.log(`🌐 Network: ${network}`);
  console.log(`👤 Deployer Address: ${deployer.address}`);
  console.log(`🔗 IPFS Metadata Base URI: ${baseURI}`);

  // ✅ Deploy Contract
  const Seeds2Trees = await hre.ethers.getContractFactory("Seeds2Trees");
  const contract = await Seeds2Trees.deploy(deployer.address, baseURI);
  await contract.waitForDeployment(); 
  console.log(`Waiting for 5 block confirmations...`);
  await contract.deploymentTransaction().wait(5);
  
  const contractAddress = await contract.getAddress();
  console.log(`✅ Contract deployed to: ${contractAddress}`);

  // ✅ Save Contract Address to Frontend Config
  const networkConfigPath = path.join(__dirname, "../src/settings/networkConfig.json");
  // ✅ Ensure the settings directory exists before writing the file
  const networkConfigDir = path.dirname(networkConfigPath);
  if (!fs.existsSync(networkConfigDir)) {
  fs.mkdirSync(networkConfigDir, { recursive: true });
  }

  // ✅ 1. Read the existing config file (if it exists)
  let networkConfig = {};
  if (fs.existsSync(networkConfigPath)) {
    try {
      const existingData = fs.readFileSync(networkConfigPath, "utf8");
      networkConfig = JSON.parse(existingData); // ✅ Parse JSON safely
    } catch (error) {
      console.error("❌ Error reading networkConfig.json:", error);
    }
  }

  // ✅ 2. Update ONLY the current network
  networkConfig[network] = { 
    contractAddress: contractAddress, 
    ipfsBaseURI: baseURI 
  };

  // ✅ 3. Write the updated JSON back to the file
  fs.writeFileSync(networkConfigPath, JSON.stringify(networkConfig, null, 2));
  console.log(`📝 Updated frontend network config at: ${networkConfigPath}`);

  // ✅ Verify contract automatically if on Sepolia or Arbitrum
  if (network === "sepolia" || network === "arbitrum") {
    console.log(`⏳ Verifying contract on ${network} explorer...`);
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [deployer.address, baseURI],
      });
      console.log(`✅ Contract verified on ${network} explorer!`);
    } catch (error) {
      console.error(`❌ Contract verification failed:`, error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });