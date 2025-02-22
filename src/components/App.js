import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserProvider, formatEther } from 'ethers';


import Navigation from './Navigation';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Admin from '../pages/Admin';
import TotalDonations from '../pages/TotalDonations';
import '../styles/App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBlockchainData = async () => {
        if (window.ethereum) {
          const provider = new BrowserProvider(window.ethereum); // ✅ Ethers v6 fix
          //const signer = await provider.getSigner();
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

        // Fetch balance
        const balance = await provider.getBalance(accounts[0]);
        setBalance(formatEther(balance)); // ✅ Use formatEther() directly
      }
    };

    loadBlockchainData();
  }, []);

  return (
    <Router>
      <div className="App">
        {/* ✅ Pass wallet data as props */}
        <Navigation account={account} balance={balance} />
        
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/totalDonations" element={<TotalDonations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
