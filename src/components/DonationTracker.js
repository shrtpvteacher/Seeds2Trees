import React, { useState, useEffect } from "react";
import { getTotalTrees, getTotalDonations } from "../helpers/contract";
import { formatEther } from "ethers"; // ✅ Import to convert Wei to ETH
import '../styles/DonationTracker.css';  // ✅ Import the CSS file


const DonationTracker = () => {
  const [totalDonations, setTotalDonations] = useState("0");
  const [totalTrees, setTotalTrees] = useState("0");

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Get total ETH donated (in Wei) and convert to ETH
        const totalDonationsWei = await getTotalDonations();
        const totalDonationsETH = formatEther(totalDonationsWei); // ✅ Convert from Wei to ETH
        setTotalDonations(totalDonationsETH);

        // ✅ Get total trees planted
        const totalTreesPlanted = await getTotalTrees();
        setTotalTrees(totalTreesPlanted.toString()); // Convert to string for UI
      } catch (error) {
        console.error("Error fetching donation data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="donation-tracker">
      <div className="tracker-item">
        <h2 className="tracker-title">Total ETH Donated</h2>
        <p className="tracker-value">{totalDonations} ETH</p>
      </div>

      <div className="tracker-item">
        <h2 className="tracker-title">Total Trees Planted</h2>
        <p className="tracker-value">{totalTrees}</p>
      </div>
    </div>
  );
};

export default DonationTracker;
