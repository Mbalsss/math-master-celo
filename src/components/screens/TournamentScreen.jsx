import React, { useState } from 'react';
import { Trophy, AlertCircle } from 'lucide-react';

const TournamentScreen = ({ wallet, contract, setScreen, setDifficulty, startGame }) => {
  const [loading, setLoading] = useState(false);

  const handleEnterTournament = async () => {
    if (!wallet.walletConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    setLoading(true);
    try {
      setDifficulty('hard');
      startGame();
    } catch (error) {
      console.error('Error entering tournament:', error);
      alert('Error entering tournament: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getEntryFee = () => {
    return "0.1";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-green-400 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Weekly Tournament
          </h2>
          <p className="text-gray-600">Compete for CELO rewards!</p>
        </div>

        {/* Contract Status */}
        {!contract.contract && (
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-yellow-600 mr-2" size={20} />
              <div>
                <p className="text-yellow-800 font-semibold">Demo Mode</p>
                <p className="text-yellow-700 text-sm">Deploy contract for real prizes</p>
              </div>
            </div>
          </div>
        )}

        {/* Prize Pool Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl p-6 mb-6 border-2 border-green-200">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Prize Pool</p>
            <p className="text-4xl font-bold text-green-600">
              {contract.tournamentInfo ? 
                `${parseFloat(contract.tournamentInfo.prizePool).toFixed(1)} CELO` : 
                '115 CELO'
              }
            </p>
          </div>
          
          {/* Prize Breakdown */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <div className="text-2xl">🥇</div>
              <p className="text-xs text-gray-600 mt-1">1st</p>
              <p className="font-bold text-yellow-700">50 CELO</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-2xl">🥈</div>
              <p className="text-xs text-gray-600 mt-1">2nd</p>
              <p className="font-bold text-gray-700">30 CELO</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <div className="text-2xl">🥉</div>
              <p className="text-xs text-gray-600 mt-1">3rd</p>
              <p className="font-bold text-orange-700">20 CELO</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Tournament Rules */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Tournament Rules:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Entry fee: {getEntryFee()} CELO</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Hard difficulty (20 seconds)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Top 5 players win prizes</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Resets every Sunday 00:00 UTC</span>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScreen('home')}
            className="bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleEnterTournament}
            disabled={loading || !wallet.walletConnected}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              `Enter (${getEntryFee()} CELO)`
            )}
          </button>
        </div>

        {/* Wallet Not Connected Warning */}
        {!wallet.walletConnected && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 text-sm text-center">
              Connect your wallet to enter the tournament
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentScreen;