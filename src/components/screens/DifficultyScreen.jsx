import React from 'react';
import { Play } from 'lucide-react';
import { difficulties } from '../../utils/gameLogic';

const DifficultyScreen = ({ difficulty, setDifficulty, setScreen, startGame }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-green-400 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Choose Difficulty
        </h2>

        <div className="space-y-4 mb-6">
          {Object.entries(difficulties).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={`w-full p-6 rounded-xl font-semibold transition-all border-4 ${
                difficulty === key
                  ? 'bg-gradient-to-r from-yellow-400 to-green-500 text-white border-green-600 shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold mb-1">{val.name}</div>
                  <div className="text-sm opacity-80">
                    {val.time}s • x{val.multiplier} points
                  </div>
                </div>
                <div className="text-4xl">
                  {key === 'easy' ? '😊' : key === 'medium' ? '😎' : '🔥'}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScreen('home')}
            className="bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Back
          </button>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center hover:shadow-xl transition-all"
          >
            <Play className="mr-2" size={18} />
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifficultyScreen;