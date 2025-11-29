import { useState, useEffect } from 'react';
import { generateQuestion, difficulties } from '../utils/gameLogic';

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [gameActive, setGameActive] = useState(false);

  const startGame = (difficulty = 'easy') => {
    setCurrentDifficulty(difficulty);
    setScore(0);
    setLives(3);
    setStreak(0);
    setQuestionsAnswered(0);
    setTimeLeft(difficulties[difficulty].time);
    setUserAnswer('');
    setFeedback(null);
    setGameActive(true);
    setQuestion(generateQuestion(difficulty));
  };

  const checkAnswer = () => {
    if (userAnswer === '' || !question || !gameActive) return;

    const isCorrect = parseInt(userAnswer) === question.answer;

    if (isCorrect) {
      const basePoints = difficulties[currentDifficulty].basePoints;
      const points = Math.floor(basePoints * (streak + 1) * difficulties[currentDifficulty].multiplier);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setQuestionsAnswered(prev => prev + 1);
      setFeedback({ type: 'correct', points });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      setFeedback({ type: 'wrong', correct: question.answer });
    }

    setTimeout(() => {
      if ((lives > 1 || isCorrect) && gameActive) {
        setUserAnswer('');
        setFeedback(null);
        setQuestion(generateQuestion(currentDifficulty));
      }
    }, 1000);
  };

  const endGame = () => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameActive && timeLeft === 0) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (lives === 0 && gameActive) {
      endGame();
    }
  }, [lives, gameActive]);

  return {
    score,
    highScore,
    lives,
    timeLeft,
    question,
    userAnswer,
    streak,
    feedback,
    questionsAnswered,
    currentDifficulty,
    gameActive,
    setUserAnswer,
    checkAnswer,
    startGame,
    endGame
  };
};