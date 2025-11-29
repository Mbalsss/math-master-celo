import React from 'react';
import { Clock, Target, Star } from 'lucide-react';

const PlayingScreen = ({ game, endGame, setScreen }) => {
  const {
    score,
    lives,
    timeLeft,
    question,
    userAnswer,
    streak,
    feedback,
    questionsAnswered,
    setUserAnswer,
    checkAnswer
  } = game;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  // Check if time is up
  React.useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, endGame]);

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-green-400 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Top Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  i < lives ? 'bg-red-500 scale-110' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center text-2xl font-bold text-orange-600">
            <Clock className="mr-1" size={20} />
            {timeLeft}s
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-yellow-400 to-green-500 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="text-white text-lg mb-2">Score: {score}</div>
            <div className="flex items-center justify-center gap-4 text-white text-sm">
              <div className="flex items-center">
                <Target size={14} className="mr-1" />
                {questionsAnswered} solved
              </div>
              {streak > 0 && (
                <div className="flex items-center bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold">
                  <Star size={14} className="mr-1" />
                  {streak}x Streak
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-6">
          <div className="text-center text-6xl font-bold text-gray-800 mb-8">
            {question.num1} {question.op} {question.num2} = ?
          </div>

          {feedback && (
            <div className={`text-center text-xl font-bold mb-4 animate-pulse ${
              feedback.type === 'correct' ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback.type === 'correct' 
                ? `✓ Correct! +${feedback.points}` 
                : `✗ Wrong! Answer: ${feedback.correct}`}
            </div>
          )}

          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your answer"
            className="w-full text-center text-4xl font-bold border-4 border-green-300 rounded-xl py-4 focus:outline-none focus:border-green-600 transition-all"
            autoFocus
            disabled={feedback !== null}
          />
        </div>

        <button
          onClick={checkAnswer}
          disabled={userAnswer === '' || feedback !== null}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default PlayingScreen;