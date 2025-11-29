import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CONTRACT_CONFIG from '../contracts/contractConfig';

export const useContract = (walletAddress) => {
  const [contract, setContract] = useState(null);
  const [tournamentInfo, setTournamentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          
          // Only set up contract if we have a valid address
          if (CONTRACT_CONFIG.address && CONTRACT_CONFIG.address !== "0x0000000000000000000000000000000000000000") {
            const signer = await web3Provider.getSigner();
            const mathTournament = new ethers.Contract(
              CONTRACT_CONFIG.address,
              CONTRACT_CONFIG.abi,
              signer
            );
            setContract(mathTournament);
            
            // Load tournament info
            await loadTournamentInfo(mathTournament);
          }
        } catch (err) {
          console.error('Error initializing contract:', err);
          setError('Failed to connect to smart contract');
        }
      }
    };

    initContract();
  }, [walletAddress]);

  const loadTournamentInfo = async (contractInstance = contract) => {
    if (!contractInstance) return;
    
    try {
      const [endTime, totalPlayers, prizePool] = await contractInstance.getTournamentInfo();
      setTournamentInfo({
        endTime: Number(endTime),
        totalPlayers: Number(totalPlayers),
        prizePool: ethers.formatEther(prizePool)
      });
    } catch (err) {
      console.error('Error loading tournament info:', err);
    }
  };

  const submitScore = async (score) => {
    if (!contract) {
      console.log('Contract not deployed, score submission skipped');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const entryFee = await contract.entryFee();
      console.log('Submitting score with entry fee:', ethers.formatEther(entryFee));
      
      const tx = await contract.submitScore(score, { value: entryFee });
      console.log('Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('Transaction confirmed');
      
      // Reload tournament info after submission
      await loadTournamentInfo();
      return tx;
    } catch (err) {
      console.error('Error submitting score:', err);
      setError(err.message || 'Failed to submit score');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLeaderboard = async () => {
    if (!contract) {
      throw new Error('Smart contract not deployed');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const [addresses, scores] = await contract.getLeaderboard();
      
      const leaderboardData = addresses.map((address, index) => ({
        address: `${address.slice(0, 6)}...${address.slice(-4)}`,
        fullAddress: address,
        score: Number(scores[index]),
        rank: index + 1,
        isCurrentUser: walletAddress && address.toLowerCase() === walletAddress.toLowerCase(),
        prize: index < 3 ? `${[50, 30, 20][index]} CELO` : '0 CELO',
        isRealData: true
      }));
      
      return leaderboardData;
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to fetch leaderboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const claimPrize = async () => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const tx = await contract.claimPrize();
      await tx.wait();
      return tx;
    } catch (err) {
      console.error('Error claiming prize:', err);
      setError(err.message || 'Failed to claim prize');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    tournamentInfo,
    loading,
    error,
    submitScore,
    getLeaderboard,
    claimPrize,
    loadTournamentInfo,
    provider
  };
};