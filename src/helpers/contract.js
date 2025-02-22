import { BrowserProvider, Contract, parseEther } from 'ethers';
import networkConfig from '../config.json';
import CONTRACT_ABI from '../abis/Seeds2Trees.json';

// ✅ Get the current network ID dynamically
async function getNetworkId() {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    return network.chainId.toString(); // Convert BigInt to string
}

// ✅ Fetch the correct contract address based on the network
async function getContractAddress() {
    const networkId = await getNetworkId();
    if (!networkConfig[networkId]) {
        throw new Error(`Unsupported network: ${networkId}. Add it to config.json`);
    }
    return networkConfig[networkId].Seeds2Trees.address;
}

// ✅ Get provider and signer
async function getProviderAndSigner() {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
}

// ✅ Get contract instance with a signer
async function getContract() {
    const contractAddress = await getContractAddress();
    if (!contractAddress) throw new Error("Contract address not found in config.");
    
    const { signer } = await getProviderAndSigner();
    return new Contract(contractAddress, CONTRACT_ABI, signer);
}

/**
 * ✅ Calls the donateForTreeToPlant function on the contract.
 */
export async function donateAndMint(donationAmountEther) {
    try {
        if (!window.ethereum) throw new Error('No Ethereum provider found. Please install MetaMask.');
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const { signer } = await getProviderAndSigner();
        const contract = new Contract(await getContractAddress(), CONTRACT_ABI, signer);
        const donationAmountWei = parseEther(donationAmountEther);
        const recipient = await signer.getAddress(); // ✅ Correctly getting recipient address

        // ✅ No metadataURI needed
        const tx = await contract.donateForTreeToPlant(recipient, { value: donationAmountWei });

        console.log("Transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();
        return receipt;
    } catch (error) {
        console.error("Transaction error:", error);
        throw error;
    }
}

/**
 * ✅ Gets the total trees (next token id).
 */
export async function getTotalTrees() {
    try {
        if (!window.ethereum) throw new Error('No Ethereum provider found.');
        const contract = await getContract();
        return await contract.totalSupply();
    } catch (error) {
        console.error("Error fetching total trees:", error);
        throw error;
    }
}

/**
 * ✅ Gets the total amount of ETH donated.
 */
export async function getTotalDonations() {
    try {
      if (!window.ethereum) throw new Error("No Ethereum provider found.");
      
      const contract = await getContract();
      return await contract.totalDonations();
    } catch (error) {
      console.error("Error fetching total donations:", error);
      throw error;
    }
  }

/**
 * ✅ Gets the current donation minimum (in Wei).
 */
export async function getMinDonation() {
    try {
        if (!window.ethereum) throw new Error('No Ethereum provider found.');
        const contract = await getContract();
        return await contract.minDonation();
    } catch (error) {
        console.error("Error fetching donation minimum:", error);
        throw error;
    }
}

/**
 * ✅ Gets the contract owner.
 */
export async function getOwner() {
    try {
        if (!window.ethereum) {
            console.error("No Ethereum provider found.");
            return null;
        }

        const contract = await getContract();
        const ownerAddress = await contract.owner();
        
        console.log("✅ Contract Owner Address:", ownerAddress); // Debugging log
        return ownerAddress;
    } catch (error) {
        console.error("Error fetching contract owner:", error);
        return null;
    }
}

/**
 * ✅ Gets the token IDs owned by a given address.
 */
export async function getTokensByOwner(ownerAddress) {
    try {
        const contract = await getContract();
        const balance = await contract.balanceOf(ownerAddress);

        let tokens = [];
        for (let i = 0; i < balance; i++) {
            let tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);
            tokens.push(tokenId.toString());
        }
        return tokens;
    } catch (error) {
        console.error("Error fetching tokens by owner:", error);
        throw error;
    }
}

/**
 * ✅ Gets the token URI for a given tokenId.
 */
export async function getTokenURI(tokenId) {
    try {
        const contract = await getContract();
        return await contract.tokenURI(tokenId);
    } catch (error) {
        console.error("Error fetching token URI:", error);
        throw error;
    }
}

/**
 * ✅ Updates the metadata URI (sets new tree location) for a token.
 */
export async function updateTreeLocation(tokenId, latitude, longitude) {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const contract = await getContract();
        const tx = await contract.setTreeLocation(tokenId, latitude, longitude);

        console.log("Update transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();
        return receipt;
    } catch (error) {
        console.error("Update transaction error:", error);
        throw error;
    }
}

/**
 * ✅ Withdraw funds (only owner can call).
 */
export async function finalizeWithdraw() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const contract = await getContract();
        const tx = await contract.finalize();

        console.log("Finalize transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();
        return receipt;
    } catch (error) {
        console.error("Finalize transaction error:", error);
        throw error;
    }
}

export async function setMinDonation(newMinDonationEther) {
    try {
        if (!window.ethereum) throw new Error('No Ethereum provider found. Please install MetaMask.');
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const contract = await getContract();
        const newMinDonationWei = parseEther(newMinDonationEther); // Convert ETH to Wei
        
        const tx = await contract.setMinDonation(newMinDonationWei);
        console.log("Transaction sent. Waiting for confirmation...");
        
        const receipt = await tx.wait();
        return receipt;
    } catch (error) {
        console.error("Error setting minimum donation:", error);
        throw error;
    }
}

/**
 * ✅ Fetches the tree's GPS location (latitude & longitude) for a given tokenId.
 */
export async function getTreeLocation(tokenId) {
    try {
      if (!window.ethereum) throw new Error("No Ethereum provider found.");
      
      const contract = await getContract();
      const location = await contract.treeLocations(tokenId); // ✅ Call the smart contract mapping
  
      return {
        latitude: location.latitude,
        longitude: location.longitude
      };
    } catch (error) {
      console.error("Error fetching tree location:", error);
      return null; // ✅ Return null if location not found
    }
  }
  
