import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Download, Upload, CheckCircle } from 'lucide-react';

const DeployContract = () => {
  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const [error, setError] = useState('');

  const contractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MathTournament {
    address public owner;
    uint256 public entryFee = 0.1 ether;
    uint256 public tournamentEndTime;
    
    mapping(address => uint256) public playerScores;
    address[] public players;
    
    event ScoreSubmitted(address indexed player, uint256 score);
    event TournamentReset(uint256 newEndTime);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier tournamentActive() {
        require(block.timestamp < tournamentEndTime, "Tournament ended");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        tournamentEndTime = block.timestamp + 7 days;
    }
    
    function submitScore(uint256 _score) external payable tournamentActive {
        require(msg.value >= entryFee, "Insufficient entry fee");
        
        if (playerScores[msg.sender] == 0) {
            players.push(msg.sender);
        }
        
        if (_score > playerScores[msg.sender]) {
            playerScores[msg.sender] = _score;
        }
        
        emit ScoreSubmitted(msg.sender, _score);
    }
    
    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        address[] memory playerAddresses = new address[](players.length);
        uint256[] memory scores = new uint256[](players.length);
        
        for (uint256 i = 0; i < players.length; i++) {
            playerAddresses[i] = players[i];
            scores[i] = playerScores[players[i]];
        }
        return (playerAddresses, scores);
    }
    
    function getTournamentInfo() external view returns (uint256 endTime, uint256 totalPlayers, uint256 prizePool) {
        return (tournamentEndTime, players.length, address(this).balance);
    }
    
    function resetTournament() external onlyOwner {
        for (uint256 i = 0; i < players.length; i++) {
            delete playerScores[players[i]];
        }
        delete players;
        tournamentEndTime = block.timestamp + 7 days;
        emit TournamentReset(tournamentEndTime);
    }
    
    receive() external payable {}
}
`;

  const deployContract = async () => {
    try {
      setDeploying(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      // Connect to MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      console.log('Deploying from:', await signer.getAddress());

      // The contract factory - we'll compile on the fly
      const contractFactory = new ethers.ContractFactory(
        [
          "function submitScore(uint256 _score) external payable",
          "function getLeaderboard() external view returns (address[] memory, uint256[] memory)",
          "function getTournamentInfo() external view returns (uint256, uint256, uint256)",
          "function entryFee() external view returns (uint256)",
          "function tournamentEndTime() external view returns (uint256)",
          "function owner() external view returns (address)"
        ],
        contractCode,
        signer
      );

      // Deploy the contract
      console.log('Starting deployment...');
      const contract = await contractFactory.deploy();
      
      console.log('Waiting for deployment...');
      await contract.waitForDeployment();

      const address = await contract.getAddress();
      console.log('✅ Contract deployed to:', address);
      
      setDeployedAddress(address);

      // Save to localStorage for the app to use
      localStorage.setItem('deployedContractAddress', address);
      
      // Update the global contract config
      window.contractAddress = address;

    } catch (err) {
      console.error('Deployment error:', err);
      setError(err.message || 'Deployment failed');
    } finally {
      setDeploying(false);
    }
  };

  const downloadContract = () => {
    const element = document.createElement('a');
    const file = new Blob([contractCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'MathTournament.sol';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Deploy Math Tournament
          </h1>
          <p className="text-gray-600">Deploy your smart contract directly from the browser</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {deployedAddress ? (
          <div className="bg-green-100 border border-green-400 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600 mr-2" size={32} />
              <span className="text-green-800 font-bold text-xl">Contract Deployed!</span>
            </div>
            <p className="text-green-700 text-center mb-2">Contract Address:</p>
            <p className="text-green-800 font-mono text-sm bg-green-50 p-3 rounded-lg break-all">
              {deployedAddress}
            </p>
            <p className="text-green-700 text-center mt-4">
              The contract address has been saved and your app will now use it automatically!
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Contract Details:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Entry Fee: 0.1 CELO</li>
              <li>• Tournament Duration: 7 days</li>
              <li>• Automatic leaderboard sorting</li>
              <li>• Prize pool from entry fees</li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={downloadContract}
            disabled={deploying}
            className="bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center disabled:opacity-50"
          >
            <Download className="mr-2" size={20} />
            Download .sol File
          </button>

          <button
            onClick={deployContract}
            disabled={deploying}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50"
          >
            {deploying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Deploying...
              </>
            ) : (
              <>
                <Upload className="mr-2" size={20} />
                Deploy Contract
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Make sure you have CELO in your wallet for deployment gas fees</p>
          <p>Estimated cost: ~0.02-0.05 CELO</p>
        </div>

        {/* Contract Code Preview */}
        <details className="mt-6">
          <summary className="cursor-pointer font-semibold text-gray-700">View Contract Code</summary>
          <pre className="mt-2 bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-60 overflow-y-auto">
            {contractCode}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default DeployContract;