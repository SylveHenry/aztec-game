'use client';

import React from 'react';

interface GameControlsProps {
  gameStatus: 'waiting' | 'playing' | 'paused' | 'gameOver';
  onStartGame: () => void;
  onStopGame: () => void;
  onResetGame: () => void;
  currentScore: number;
  roundsPlayed: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStatus,
  onStartGame,
  onStopGame,
  onResetGame,
  currentScore,
  roundsPlayed
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🎮 Game Controls
      </h2>

      <div className="space-y-3">
        {/* Start Game Button */}
        {gameStatus === 'waiting' && (
          <button
            onClick={onStartGame}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚀 Start Game
          </button>
        )}

        {/* Stop Game Button */}
        {gameStatus === 'playing' && (
          <button
            onClick={onStopGame}
            className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ⏹️ Stop Game
          </button>
        )}

        {/* Game Over State */}
        {gameStatus === 'gameOver' && (
          <>
            <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border">
              <div className="text-lg font-bold text-gray-800 mb-2">
                🏁 Game Complete!
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Final Score: <span className="font-bold text-blue-600">{currentScore} points</span></div>
                <div>Rounds Played: <span className="font-bold text-purple-600">{roundsPlayed}</span></div>
                {currentScore > 0 && (
                  <div className="text-green-600 font-medium">
                    ✨ Score saved locally!
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={onResetGame}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔄 Play Again
            </button>
          </>
        )}

        {/* Reset Button (always available except during gameplay) */}
        {gameStatus !== 'playing' && (
          <button
            onClick={onResetGame}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            🔄 Reset
          </button>
        )}
      </div>

      {/* Game Status Indicator */}
      <div className="mt-4 text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          gameStatus === 'waiting' 
            ? 'bg-yellow-100 text-yellow-800' 
            : gameStatus === 'playing'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            gameStatus === 'waiting'
              ? 'bg-yellow-400'
              : gameStatus === 'playing'
              ? 'bg-green-400 animate-pulse'
              : 'bg-red-400'
          }`}></div>
          {gameStatus === 'waiting' && 'Ready to Start'}
          {gameStatus === 'playing' && 'Game in Progress'}
          {gameStatus === 'gameOver' && 'Game Ended'}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-xs font-semibold text-blue-800 mb-2">⚡ Quick Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Each round lasts 60 seconds</li>
          <li>• Target word = 50 points</li>
          <li>• Game continues until time runs out</li>
          <li>• Beat your high score!</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;