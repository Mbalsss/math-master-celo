import React from 'react';
import { RotateCcw, Award, ExternalLink } from 'lucide-react';

const GameOverScreen = ({ game, gameMode, setScreen, startGame, contract }) => {
  const { score, highScore, questionsAnswered, currentDifficulty } = game;

  const handlePlayAgain = () => {
    startGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-green-400 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{score > highScore ? '🎉' : '💪'}</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          {score > highScore ? 'New Record!' : 'Game Over'}
        </h2>
        
        <div className="bg-gradient-to-r from-yellow-400 to-green-500 rounded-2xl p-6 mb-6">
          <div className="text-white text-xl mb-2">Final Score</div>
          <div className="text-white text-5xl font-bold mb-3">{score}</div>
          <div className="text-white text-sm">
            {questionsAnswered} questions • {currentDifficulty} mode
          </div>
        </div>

        {gameMode === 'tournament' && (
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 mb-6">
            <Award className="mx-auto text-green-600 mb-2" size={32} />
            <p className="text-green-800 font-bold mb-1">
              {contract.contract ? 'Score Submitted to Blockchain!' : 'Tournament Score Recorded!'}
            </p>
            <p className="text-sm text-green-700">
              {contract.contract ? 'Check leaderboard for your ranking' : 'Deploy contract for real prizes'}
            </p>
            {contract.contract && (
              <button
                onClick={() => setScreen('leaderboard')}
                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center justify-center mx-auto"
              >
                <ExternalLink size={16} className="mr-2" />
                View Leaderboard
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setScreen('home')}
            className="bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Home
          </button>
          <button
            onClick={handlePlayAgain}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center hover:shadow-xl transition-all"
          >
            <RotateCcw className="mr-2" size={18} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;