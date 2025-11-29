import React from 'react';
import { Target, Zap, Users, Trophy } from 'lucide-react';
import WalletConnection from '../ui/WalletConnection';

const HomeScreen = ({ wallet, highScore, setScreen, setGameMode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-green-400 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-green-600 mb-2">
            MathMaster
          </h1>
          <p className="text-gray-600 font-medium">Play • Learn • Earn on Celo</p>
        </div>

        {/* Wallet Connection */}
        <WalletConnection wallet={wallet} />

        {/* High Score */}
        {highScore > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mb-6 flex items-center justify-center">
            <Trophy className="text-white mr-2" size={24} />
            <span className="text-white font-bold text-xl">Best: {highScore}</span>
          </div>
        )}

        {/* Game Modes */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setGameMode('practice');
              setScreen('difficulty');
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:shadow-xl transition-all"
          >
            <Target className="mr-2" size={24} />
            Practice Mode
          </button>

          <button
            onClick={() => {
              setGameMode('tournament');
              setScreen('tournament');
            }}
            disabled={!wallet.walletConnected}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="mr-2" size={24} />
            Tournament Mode
            <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
              Earn CELO
            </span>
          </button>

          <button
            onClick={() => setScreen('leaderboard')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:shadow-xl transition-all"
          >
            <Users className="mr-2" size={24} />
            Leaderboard
          </button>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Built on Celo Blockchain</p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;