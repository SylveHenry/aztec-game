'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/game';

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  roundsPlayed: number;
  timestamp: number;
}

interface UserPosition {
  rank: number;
  score: number;
  isInTop20: boolean;
}

interface LeaderboardProps {
  currentScore: number;
  roundsPlayed: number;
  gameStatus: 'waiting' | 'playing' | 'paused' | 'gameOver';
  currentUser?: User | null;
  onUserUpdate?: (updatedUser: User) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  currentScore, 
  roundsPlayed, 
  gameStatus,
  currentUser,
  onUserUpdate
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGlobalLeaderboard, setIsGlobalLeaderboard] = useState(false);

  const saveScore = useCallback(async () => {
    if (!currentUser || !currentUser._id || roundsPlayed === 0) {
      console.log('No user or no rounds played, skipping score save.');
      return;
    }

    try {
      console.log('Saving score...');
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          username: currentUser.username,
          score: currentScore,
          roundsPlayed,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Score saved successfully!', result);
        if (onUserUpdate && result.highScoreUpdated) {
          const updatedUser = { ...currentUser, highScore: currentScore };
          onUserUpdate(updatedUser);
        }
      } else {
        console.error('Failed to save score:', result.error);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }, [currentUser, currentScore, roundsPlayed, onUserUpdate]);

  const loadLeaderboard = useCallback(async () => {
    try {
      console.log('🔄 Loading leaderboard data...');
      setIsLoading(true);
      setUserPosition(null); // Reset user position on load

      // Construct the API URL, adding userId only if the user is authenticated
      let apiUrl = '/api/scores?limit=20';
      if (currentUser && currentUser._id) {
        apiUrl += `&userId=${currentUser._id}`;
      }

      try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (response.ok && result.success) {
          console.log('✅ Successfully loaded global leaderboard from database');
          setLeaderboard(result.leaderboard);
          setIsGlobalLeaderboard(true);

          if (result.userPosition) {
            setUserPosition({
              ...result.userPosition,
              isInTop20: result.userPosition.rank <= 20,
            });
          }
        } else {
          console.warn('⚠️ Failed to load from database:', result.error);
          setLeaderboard([]);
          setIsGlobalLeaderboard(false);
        }
      } catch (error) {
        console.warn('⚠️ Database request failed:', error);
        setLeaderboard([]);
        setIsGlobalLeaderboard(false);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 Initial leaderboard load triggered');
        setIsLoading(true);
        // Load from database only, no local storage
        await loadLeaderboard();
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [loadLeaderboard]);

  // Save score and refresh leaderboard when game ends
  useEffect(() => {
    if (gameStatus === 'gameOver' && currentUser) {
      console.log('🎮 Game over detected, saving score...');
      saveScore().then(() => {
        console.log('Score saved, refreshing leaderboard in 1 second...');
        setTimeout(() => {
          console.log('⏰ Timeout completed, loading leaderboard...');
          loadLeaderboard();
        }, 1000);
      });
    }
  }, [gameStatus, currentUser, saveScore, loadLeaderboard]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const isCurrentUser = (entry: LeaderboardEntry) => {
    return currentUser && entry.playerName === currentUser.username;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🏆 Leaderboard
        </h2>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🏆 Top 20 Leaderboard
          </h2>
          <div className="text-sm text-gray-600 mt-1">
            {isGlobalLeaderboard ? (
              <span className="text-green-600 font-medium">🌍 Global Rankings</span>
            ) : (
              <span className="text-gray-500 font-medium">📊 No Data Available</span>
            )}
          </div>
        </div>
        <button
          onClick={loadLeaderboard}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          disabled={isLoading}
        >
          {isLoading ? '⟳' : '↻'} Refresh
        </button>
      </div>
      
      {/* Current Game Stats */}
      {currentUser && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Current Session</h3>
          <div className="text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Player:</span>
              <span className="font-medium">{currentUser.username}</span>
            </div>
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-medium">{currentScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Rounds:</span>
              <span className="font-medium">{roundsPlayed}</span>
            </div>
            {userPosition ? (
              <>
                <div className="flex justify-between">
                  <span>All-Time High Score:</span>
                  <span className="font-medium">{userPosition.score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Global Rank:</span>
                  <span className="font-medium">
                    #{userPosition.rank}
                    {userPosition.isInTop20 && <span className="text-green-600 ml-1">🏆</span>}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-2">Loading ranking...</div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {leaderboard.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            {isGlobalLeaderboard ? 'No scores yet. Be the first!' : 'Could not load leaderboard.'}
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isCurrentUser(entry)
                  ? 'bg-green-50 border-green-200 shadow-sm'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-gray-300 text-gray-700' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className={`font-medium ${isCurrentUser(entry) ? 'text-green-800' : 'text-gray-800'}`}>
                    {entry.playerName}
                    {isCurrentUser(entry) && <span className="ml-2 text-xs text-green-600">(You)</span>}
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.roundsPlayed} rounds • {formatDate(entry.timestamp)}
                  </div>
                </div>
              </div>
              <div className={`text-lg font-bold ${isCurrentUser(entry) ? 'text-green-800' : 'text-gray-800'}`}>
                {entry.score}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadLeaderboard}
        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Refresh Leaderboard'}
      </button>
    </div>
  );
};