'use client';

import React from 'react';
import { Timer } from './Timer';

interface GameHeaderProps {
  targetWord: string;
  currentScore: number;
  roundsPlayed: number;
  timeRemaining: number;
  isTimerRunning: boolean;
  gameStatus: 'waiting' | 'playing' | 'paused' | 'gameOver';
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  targetWord,
  currentScore,
  roundsPlayed,
  timeRemaining,
  isTimerRunning,
  gameStatus
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Game Status Banner */}
      <div className="text-center mb-4">
        {gameStatus === 'waiting' && (
          <div className="text-lg text-gray-600">
            🎯 Ready to play? Click <strong>Start Game</strong> to begin!
          </div>
        )}
        {gameStatus === 'playing' && (
          <div className="text-lg text-green-600 font-semibold">
            🔍 Find the target word before time runs out!
          </div>
        )}
        {gameStatus === 'gameOver' && (
          <div className="text-lg text-red-600 font-semibold">
            ⏰ Game Over! Final Score: {currentScore} points
          </div>
        )}
      </div>

      {/* Game Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Score */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{currentScore}</div>
          <div className="text-sm text-blue-800">Score</div>
        </div>

        {/* Rounds */}
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{roundsPlayed}</div>
          <div className="text-sm text-purple-800">Rounds</div>
        </div>

        {/* Timer */}
        <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{timeRemaining}s</div>
          <div className="text-sm text-orange-800">Time Left</div>
        </div>
      </div>

      {/* Target Word Display */}
      {gameStatus !== 'waiting' && (
        <div className="text-center mb-4">
          <div className="inline-block p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700 mb-1">🎯 Target Word</div>
            <div className="text-2xl font-bold text-green-800 uppercase tracking-wider">
              {targetWord}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Find this word in the grid to earn 50 points!
            </div>
          </div>
        </div>
      )}

      {/* Timer Progress Bar */}
      {gameStatus === 'playing' && (
        <div className="mb-4">
          <Timer 
            timeRemaining={timeRemaining} 
            totalTime={180} 
            isRunning={isTimerRunning} 
          />
        </div>
      )}

      {/* Game Instructions */}
      {gameStatus === 'waiting' && (
        <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="font-semibold mb-2">How to Play:</div>
          <div className="space-y-1">
            <div>• Click and drag to select the target word</div>
            <div>• Words can be horizontal, vertical, or diagonal</div>
            <div>• Find the target word within 3 minutes to earn 50 points</div>
            <div>• Ignore other words - only the target word counts!</div>
          </div>
        </div>
      )}
    </div>
  );
};