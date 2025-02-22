const { expect } = require('chai');
const { ethers } = require('hardhat');


describe("Seeds2Trees", function () {
  it("Should deploy and set the correct donation minimum", async function () {
    const [owner] = await ethers.getSigners();
    const Seeds2Trees = await ethers.getContractFactory("Seeds2Trees");
    const contract = await Seeds2Trees.deploy();
    await contract.deployed();

    const donationMin = await contract.donationMinimum();
    expect(donationMin).to.equal(ethers.utils.parseEther("0.1"));
  });
});