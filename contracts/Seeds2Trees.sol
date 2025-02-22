// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Seeds2Trees is  ERC721Enumerable, Ownable {

    struct TreeLocation {
        string latitude;
        string longitude;
    }

    uint256 private _treeCount; 
   
    uint256 public minDonation= 0.1 ether; // Set a minimum donation amount
     uint256 public totalDonations; // Track total donated ETH
    uint256 public totalWithdrawn; // New state variable to track withdrawals
   
    mapping(uint256 => TreeLocation) public treeLocations;  // Public mapping

    event Finalize(uint256 withdrawnAmount, uint256 totalWithdrawn);
    event Finalize(uint256 totalDonations);
    event DebugDonation(address sender, uint256 sentValue, uint256 requiredMin);
    event TreeToPlant(address indexed donor, address indexed recipient, uint256 tokenId, uint256 donationAmount);

    function setMinDonation(uint256 _minDonation) public onlyOwner {
        minDonation = _minDonation;
    }

    constructor(address initialOwner) ERC721("Seeds2Trees", "S2T") Ownable() {
        initialOwner = payable(msg.sender);  
    }

    function setTreeLocation(uint256 tokenId, string calldata latitude, string calldata longitude) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "tokenId does not exist");
         // TreeLocation storage location = treeLocations[tokenId];

        treeLocations[tokenId] = TreeLocation({
    
            latitude: latitude,
            longitude: longitude
        });
    }

   
    function donateForTreeToPlant(address recipient) public payable returns (uint256) {
        emit DebugDonation(msg.sender, msg.value, minDonation); // Debugging event
        require(msg.value >= minDonation, "Donation does not meet the minimum required amount.");
        
        uint256 newTokenId = _treeCount;
        _treeCount++; // Increment for the next mint

        totalDonations += msg.value; // Track total donations

        _mint(recipient, newTokenId); // Mint tree NFT to recipient

        emit TreeToPlant(msg.sender, recipient, newTokenId, msg.value); // Emit event for tracking

        return newTokenId;
    }
 
   function finalize() public onlyOwner {
        uint256 value = address(this).balance;
        require(value > 0, "No funds available to withdraw");

        payable(owner()).transfer(value);

        totalWithdrawn += value; // Track total withdrawn amount

        emit Finalize(value, totalWithdrawn);
    } 
}
