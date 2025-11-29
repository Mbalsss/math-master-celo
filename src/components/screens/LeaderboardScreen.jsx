import React, { useState, useEffect } from 'react';
import { RefreshCw, Award, Clock, Users, AlertCircle } from 'lucide-react';

const LeaderboardScreen = ({ wallet, contract, setScreen }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (contract.contract) {
        // Try to get real data from contract
        const leaderboardData = await contract.getLeaderboard();
        setLeaderboard(leaderboardData);
      } else {
        // Fallback to mock data
        throw new Error('Contract not deployed');
      }
    } catch (err) {
      console.log('Using mock leaderboard data:', err.message);
      // Use mock data as fallback
      const mockPlayers = generateRealisticLeaderboard(wallet.fullAddress);
      setLeaderboard(mockPlayers);
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data function
  const generateRealisticLeaderboard = (currentUserAddress) => {
    const players = [];
    const topScores = [2850, 2670, 2450, 2280, 2120, 1950, 1820, 1670, 1530, 1380];
    
    for (let i = 0; i < 10; i++) {
      const address = i === 2 && currentUserAddress 
        ? `${currentUserAddress.slice(0, 6)}...${currentUserAddress.slice(-4)}`
        : generateRandomAddress();
      
      const score = topScores[i];
      const prize = i < 5 ? `${[50, 30, 20, 10, 5][i]} CELO` : '0 CELO';
      
      players.push({
        rank: i + 1,
        address: address,
        score: score,
        prize: prize,
        isCurrentUser: i === 2 && currentUserAddress !== null,
        isRealData: false
      });
    }

    return players;
  };

  const generateRandomAddress = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeLeft = (endTime) => {
    if (!endTime) return 'Loading...';
    
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return 'Tournament Ended';
    
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    
    return `${days}d ${hours}h`;
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [contract.contract]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-green-400 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800">Tournament Leaderboard</h2>
          <p className="text-gray-600 text-sm mt-1">
            {leaderboard.length > 0 && leaderboard[0].isRealData !== false 
              ? 'Live blockchain rankings' 
              : 'Demo data - Connect to see real rankings'}
          </p>
        </div>

        {/* Tournament Info */}
        {contract.tournamentInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <Clock className="mx-auto text-blue-600 mb-1" size={20} />
                <p className="text-xs text-gray-600">Time Left</p>
                <p className="font-bold text-blue-700">
                  {formatTimeLeft(contract.tournamentInfo.endTime)}
                </p>
              </div>
              <div>
                <Users className="mx-auto text-green-600 mb-1" size={20} />
                <p className="text-xs text-gray-600">Players</p>
                <p className="font-bold text-green-700">
                  {contract.tournamentInfo.totalPlayers}
                </p>
              </div>
            </div>
            <div className="text-center mt-3">
              <Award className="mx-auto text-yellow-600 mb-1" size={20} />
              <p className="text-xs text-gray-600">Prize Pool</p>
              <p className="font-bold text-yellow-700 text-lg">
                {parseFloat(contract.tournamentInfo.prizePool).toFixed(1)} CELO
              </p>
            </div>
          </div>
        )}

        {/* Demo Mode Warning */}
        {!contract.contract && (
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-yellow-600 mr-2" size={20} />
              <div>
                <p className="text-yellow-800 font-semibold">Demo Mode</p>
                <p className="text-yellow-700 text-sm">Deploy contract for real blockchain rankings</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {contract.contract ? 'Loading from blockchain...' : 'Loading leaderboard...'}
            </p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600 mb-2">No tournament data yet</p>
            <p className="text-sm text-gray-500">Be the first to play in tournament mode!</p>
            <button
              onClick={() => setScreen('tournament')}
              className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              Join Tournament
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className={`rounded-xl p-4 flex items-center justify-between ${
                  player.isCurrentUser
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-400 shadow-lg'
                    : player.rank === 1
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400'
                    : player.rank === 2
                    ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400'
                    : player.rank === 3
                    ? 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold w-8">
                    {player.rank === 1 ? '🥇' : 
                     player.rank === 2 ? '🥈' : 
                     player.rank === 3 ? '🥉' : 
                     player.rank}
                  </div>
                  <div>
                    <p className={`font-bold ${player.isCurrentUser ? 'text-blue-600' : 'text-gray-800'}`}>
                      {player.address}
                      {player.isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{player.score} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {player.prize}
                  </p>
                  {player.isRealData && (
                    <p className="text-xs text-gray-500 mt-1">✓ On-chain</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScreen('home')}
            className="bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <RefreshCw className="animate-spin mr-2" size={18} />
            ) : (
              <RefreshCw className="mr-2" size={18} />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Contract Status */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Contract: {contract.contract ? '✅ Connected' : '❌ Not deployed'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;