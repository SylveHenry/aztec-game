'use client';

import React from 'react';

interface GameControlsProps {
  onResetGame: () => void;
  gameCompleted: boolean;
  difficulty: string;
  onDifficultyChange?: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  onResetGame, 
  gameCompleted, 
  difficulty
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Game Controls</h3>
      
      <div className="space-y-3">
        <button
          onClick={onResetGame}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          🔄 Reset Game
        </button>
        
        {gameCompleted && (
          <button
            onClick={onResetGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            🎉 Play Again
          </button>
        )}
        
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Difficulty
          </label>
          <div className="flex items-center justify-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">How to Play</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Click and drag to select words</li>
            <li>• Words can be horizontal, vertical, or diagonal</li>
            <li>• Found words will be highlighted in green</li>
            <li>• Find all words to complete the puzzle</li>
          </ul>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Scoring</h4>
          <p className="text-xs text-gray-600">
            Each letter in a found word = 10 points
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameControls;