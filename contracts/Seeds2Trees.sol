// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Seeds2Trees is ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct TreeLocation {
        string latitude;
        string longitude;
    }

    uint256 private _treeCount;
    string public baseURI;
    string public baseExtension = ".json";

    uint256 public minDonation = 0.1 ether; // Set a minimum donation amount
    uint256 public totalDonations; // Track total donated ETH
    uint256 public totalWithdrawn; // Track total ETH withdrawn

    mapping(uint256 => TreeLocation) public treeLocations; // Public mapping

    event Finalize(uint256 withdrawnAmount, uint256 totalWithdrawn);
    event TotalDonationsUpdated(uint256 totalDonations); // ✅ New event for tracking total donations
    event DebugDonation(address sender, uint256 sentValue, uint256 requiredMin);
    event TreeToPlant(address indexed sender, address indexed recipient, uint256 tokenId, uint256 donationAmount);

    constructor(address initialOwner, string memory baseURI_) ERC721("Seeds2Trees", "S2T") Ownable() {
        initialOwner = payable(msg.sender);
        baseURI = baseURI_;
    }

    function setMinDonation(uint256 _minDonation) public onlyOwner {
        minDonation = _minDonation;
    }

    // Internal function for baseURI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, _tokenId.toString(), baseExtension));
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function setTreeLocation(uint256 tokenId, string calldata latitude, string calldata longitude) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token ID does not exist");

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
        emit TotalDonationsUpdated(totalDonations); // ✅ Emit event after updating totalDonations

        _mint(recipient, newTokenId); // Mint tree NFT to recipient

        emit TreeToPlant(msg.sender, recipient, newTokenId, msg.value); // Emit event for tracking

        return newTokenId;
    }

    function finalize() public onlyOwner {
        uint256 value = address(this).balance;
        require(value > 0, "No funds available to withdraw");

        payable(owner()).transfer(value);

        totalWithdrawn += value; // Track total withdrawn amount

        emit Finalize(value, totalWithdrawn); // ✅ Emit Finalize event
    }
}
