'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/types/game';

interface LeaderboardProps {
  currentScore: number;
  roundsPlayed: number;
  gameStatus: 'waiting' | 'playing' | 'paused' | 'gameOver';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentScore,
  roundsPlayed,
  gameStatus
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load leaderboard from localStorage on component mount
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('blockchain-wordcross-leaderboard');
    if (savedLeaderboard) {
      try {
        const parsed = JSON.parse(savedLeaderboard);
        setLeaderboard(parsed);
      } catch (error) {
        console.error('Error parsing leaderboard data:', error);
        setLeaderboard([]);
      }
    }
  }, []);

  // Save score to leaderboard when game ends
  useEffect(() => {
    if (gameStatus === 'gameOver' && currentScore > 0) {
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        playerName: 'Player',
        score: currentScore,
        roundsPlayed,
        timestamp: Date.now()
      };

      const updatedLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep only top 10 scores

      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('blockchain-wordcross-leaderboard', JSON.stringify(updatedLeaderboard));
    }
  }, [gameStatus, currentScore, roundsPlayed, leaderboard]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearLeaderboard = () => {
    setLeaderboard([]);
    localStorage.removeItem('blockchain-wordcross-leaderboard');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          🏆 Leaderboard
        </h2>
        {leaderboard.length > 0 && (
          <button
            onClick={clearLeaderboard}
            className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            title="Clear leaderboard"
          >
            Clear
          </button>
        )}
      </div>

      {/* Current Game Stats */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Game</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Score:</span>
            <span className="ml-2 font-bold text-blue-600">{currentScore}</span>
          </div>
          <div>
            <span className="text-gray-600">Rounds:</span>
            <span className="ml-2 font-bold text-purple-600">{roundsPlayed}</span>
          </div>
        </div>
        {gameStatus === 'gameOver' && currentScore > 0 && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            ✨ Score saved to leaderboard!
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm">No scores yet!</p>
            <p className="text-xs text-gray-400 mt-1">
              Play the game to see your scores here
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Scores</h3>
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? 'bg-yellow-400 text-yellow-900'
                      : index === 1
                      ? 'bg-gray-400 text-gray-900'
                      : index === 2
                      ? 'bg-orange-400 text-orange-900'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {entry.score} pts
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.roundsPlayed} rounds
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(entry.timestamp)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};