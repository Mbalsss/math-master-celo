import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useGameLogic } from './hooks/useGameLogic';
import { useContract } from './hooks/useContract';
import HomeScreen from './components/screens/HomeScreen';
import DifficultyScreen from './components/screens/DifficultyScreen';
import TournamentScreen from './components/screens/TournamentScreen';
import PlayingScreen from './components/screens/PlayingScreen';
import GameOverScreen from './components/screens/GameOverScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [gameMode, setGameMode] = useState('practice');
  const [difficulty, setDifficulty] = useState('easy');
  
  const wallet = useWallet();
  const game = useGameLogic();
  const contract = useContract(wallet.walletAddress);

  const startGame = () => {
    game.startGame(difficulty);
    setScreen('playing');
  };

  const endGame = () => {
    // Submit score to blockchain if in tournament mode
    if (gameMode === 'tournament' && wallet.walletConnected && contract.contract) {
      contract.submitScore(game.score).catch(console.error);
    }
    
    game.endGame();
    setScreen('gameOver');
  };

  // Render different screens based on current screen state
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen 
            wallet={wallet}
            highScore={game.highScore}
            setScreen={setScreen}
            setGameMode={setGameMode}
          />
        );
      
      case 'difficulty':
        return (
          <DifficultyScreen 
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            setScreen={setScreen}
            startGame={startGame}
          />
        );
      
      case 'tournament':
        return (
          <TournamentScreen 
            wallet={wallet}
            contract={contract}
            setScreen={setScreen}
            setDifficulty={setDifficulty}
            startGame={startGame}
          />
        );
      
      case 'playing':
        return (
          <PlayingScreen 
            game={game}
            endGame={endGame}
            setScreen={setScreen}
          />
        );
      
      case 'gameOver':
        return (
          <GameOverScreen 
            game={game}
            gameMode={gameMode}
            setScreen={setScreen}
            startGame={startGame}
            contract={contract}
          />
        );
      
      case 'leaderboard':
        return (
          <LeaderboardScreen 
            wallet={wallet}
            contract={contract}
            setScreen={setScreen}
          />
        );
      
      default:
        return <HomeScreen wallet={wallet} setScreen={setScreen} setGameMode={setGameMode} />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;