/* import { BrowserProvider, Contract, parseEther } from 'ethers';
import CONTRACT_ABI from '../abis/Seeds2Trees.json';
import networkConfig from '../settings/networkConfig.json';


// initializes provider once
const provider = new BrowserProvider(window.ethereum);

// ✅ Get provider and signer
async function getProviderAndSigner() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    return { provider, signer };
}

// 

// ✅ Get the current network ID dynamically
async function getNetworkId() {
    const network = await provider.getNetwork();
    return network.chainId.toString(); // Convert BigInt to string
}

// ✅ Fetch the correct contract address based on the network
async function getContractAddress() {
    const networkId = await getNetworkId(); // ✅ Get numeric chain ID as string
    console.log("🚀 Detected Network ID:", networkId);
    
    return networkId.contractAddress;
}


// ✅ Get contract instance 
async function getContract() {
    const contractAddress = networkConfig.contractAddress;  // No need to fetch network dynamically
    console.log("🔍 Fetching contract address...");
    
    if (!contractAddress)  {
        throw new Error("Contract address not found in networkConfig.js");
    }
    
    const { signer } = await getProviderAndSigner();
    return new Contract(contractAddress, CONTRACT_ABI, signer);
}

//  ✅ Gets the total trees (NFTs minted).
 
export async function getTotalTrees() {
    try {
        const contract = await getContract();
        const totalSupply = await contract.totalSupply();
        console.log("Total NFTs minted:", totalSupply.toString()); // Debugging
        return parseInt(totalSupply.toString(), 10); // ✅ Ensure it's a number
    } catch (error) {
        console.error("Error fetching total trees:", error);
        return 0;
    }
}


//  ✅ Gets the token URI for a given tokenId.
 
export async function getTokenURI(tokenId) {
    try {
        const contract = await getContract();
        const uri =  await contract.tokenURI(tokenId);
        console.log(`Token ${tokenId} URI:` , uri); // Debugging
        return uri;
    } catch (error) {
        console.error(`Error fetching token URI: for ${tokenId}:`, error);
        return null;
    }
}
*/

/**
 * ✅ Calls the donateForTreeToPlant function on the contract.
 */

/* export async function donateAndMint(donationAmountEther) {
    try {
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
} */ 

/* export async function donateAndMint(donationAmountEther) {
    try {
        const { signer } = await getProviderAndSigner();
        const contract = await getContract();
          
        const donationAmountWei = parseEther(donationAmountEther);
        const recipient = await signer.getAddress();
      
        const tx = await contract.donateForTreeToPlant(recipient, { value: donationAmountWei });
      
        console.log("Transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt.transactionHash);
      
        return receipt;
    } catch (error) {
        console.error("Transaction error:", error);
        throw error;
    }
}



 // ✅ Gets the total amount of ETH donated.
 
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


 // ✅ Gets the current donation minimum (in Wei).
 
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


 // ✅ Gets the contract owner.
 
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


 // ✅ Gets the token IDs owned by a given address.
 
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


// ✅ Updates the metadata URI (sets new tree location) for a token.
 
export async function updateTreeLocation(tokenId, latitude, longitude) {
    try {
        if (!window.ethereum) throw new Error("No Ethereum provider found.");
        
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // ✅ Ensure wallet is connected
        const contract = await getContract();

        console.log("🌍 Sending updateTreeLocation transaction...");
        console.log(`📍 TokenID: ${tokenId}, Lat: ${latitude}, Long: ${longitude}`);

        const tx = await contract.updateTreeLocation(tokenId, latitude, longitude);
        console.log("✅ Transaction sent:", tx.hash);

        const receipt = await tx.wait();
        console.log("✅ Transaction confirmed:", receipt);

        return receipt;
    } catch (error) {
        console.error("❌ Failed to update token location:", error);
        throw new Error("Failed to update token location.");
    }
}




//  ✅ Withdraw funds (only owner can call).
 
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
}  */


//  ✅ Fetches the tree's GPS location (latitude & longitude) for a given tokenId.
 
/* export async function getTreeLocation(tokenId) {
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
} */


  
import { BrowserProvider, Contract, parseEther } from 'ethers';
import CONTRACT_ABI from '../abis/Seeds2Trees.json';

// ✅ Dynamically import network config
async function getNetworkConfig() {
    const networkConfig = await import('../settings/networkConfig.json');
    return networkConfig.default;
}

// ✅ Get provider and signer
async function getProviderAndSigner() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
}

// ✅ Get the current network ID dynamically
async function getNetworkId() {
    const { provider } = await getProviderAndSigner();
    const network = await provider.getNetwork();
    return network.chainId.toString(); // Convert BigInt to string
}

// ✅ Fetch the correct contract address based on the network
async function getContractAddress() {
    const networkId = await getNetworkId();
    const networkConfig = await getNetworkConfig();

    console.log("🚀 Detected Network ID:", networkId);
    if (!networkConfig[networkId]) {
        throw new Error(`Unsupported network: ${networkId}. Add it to networkConfig.json`);
    }
    return networkConfig[networkId].contractAddress;
}

// ✅ Get contract instance
async function getContract() {
    const contractAddress = await getContractAddress();
    const { signer } = await getProviderAndSigner();
    return new Contract(contractAddress, CONTRACT_ABI, signer);
}

// ✅ Get total trees (NFTs minted)
export async function getTotalTrees() {
    try {
        const contract = await getContract();
        const totalSupply = await contract.totalSupply();
        return parseInt(totalSupply.toString(), 10);
    } catch (error) {
        console.error("Error fetching total trees:", error);
        return 0;
    }
}

// ✅ Get token URI
export async function getTokenURI(tokenId) {
    try {
        const contract = await getContract();
        return await contract.tokenURI(tokenId);
    } catch (error) {
        console.error(`Error fetching token URI for ${tokenId}:`, error);
        return null;
    }
}

export async function donateAndMint(donationAmountEther) {
    try {
        const { signer } = await getProviderAndSigner(); // ✅ Ensure signer is obtained correctly
        if (!signer) throw new Error("Signer is undefined. Ensure wallet is connected.");

        const contract = await getContract();
        const donationAmountWei = parseEther(donationAmountEther);
        const recipient = await signer.getAddress(); // ✅ Properly fetch recipient's address

        const tx = await contract.donateForTreeToPlant(recipient, { value: donationAmountWei });

        console.log("Transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt.transactionHash);

        return receipt;
    } catch (error) {
        console.error("Transaction error:", error);
        throw error;
    }
}
// ✅ Get contract balance
export async function getContractBalance() {
    try {
        const { provider } = await getProviderAndSigner();
        const contractAddress = await getContractAddress();
        const balanceWei = await provider.getBalance(contractAddress);
        return parseEther(balanceWei);
    } catch (error) {
        console.error("Error fetching contract balance:", error);
        return "0";
    }
}

// ✅ Withdraw funds
export async function finalizeWithdraw() {
    try {
        const contract = await getContract();
        const tx = await contract.finalize();
        await tx.wait();
        return tx;
    } catch (error) {
        console.error("Finalize transaction error:", error);
        throw error;
    }
}

// ✅ Set minimum donation
export async function setMinDonation(newMinDonationEther) {
    try {
        const contract = await getContract();
        const newMinDonationWei = parseEther(newMinDonationEther);
        const tx = await contract.setMinDonation(newMinDonationWei);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error("Error setting minimum donation:", error);
        throw error;
    }
}

// ✅ Get contract owner
export async function getOwner() {
    try {
        const contract = await getContract();
        return await contract.owner();
    } catch (error) {
        console.error("Error fetching contract owner:", error);
        return null;
    }
}

// ✅ Get minimum donation
export async function getMinDonation() {
    try {
        const contract = await getContract();
        return await contract.minDonation();
    } catch (error) {
        console.error("Error fetching donation minimum:", error);
        return "0";
    }
}

// ✅ Get tree location
export async function getTreeLocation(tokenId) {
    try {
        const contract = await getContract();
        return await contract.treeLocations(tokenId);
    } catch (error) {
        console.error("Error fetching tree location:", error);
        return null;
    }
}

// ✅ Updates the metadata URI (sets new tree location) for a token.
 
export async function updateTreeLocation(tokenId, ipfsURI) {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const contract = await getContract();
        const tx = await contract.setTreeLocation(tokenId, ipfsURI);

        console.log("Update transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("Update confirmed:", receipt.transactionHash);

        return receipt;
    } catch (error) {
        console.error("Update transaction error:", error);
        throw error;
    }
}

export async function getTotalDonations() {
    try {
        const contract = await getContract();
        const totalDonations = await contract.totalDonations();
        console.log("Total Donations:", totalDonations.toString());
        return totalDonations;
    } catch (error) {
        console.error("Error fetching total donations:", error);
        return 0;
    }
}
// ✅ Expose functions globally for debugging in DevTools
window.getTotalTrees = getTotalTrees;
window.getTokenURI = getTokenURI;