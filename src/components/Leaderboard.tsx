'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/game';
import { fetchLeaderboard } from '@/utils/auth';

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

  const loadLocalLeaderboard = useCallback(() => {
    try {
      const stored = localStorage.getItem('wordCrossLeaderboard');
      if (stored) {
        const entries = JSON.parse(stored);
        setLeaderboard(entries);
      }
    } catch (error) {
      console.error('Failed to load local leaderboard:', error);
      setLeaderboard([]);
    }
  }, []);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = currentUser?._id;
      const response = await fetchLeaderboard(userId);
      
      if (response.error) {
        console.error('Leaderboard error:', response.error);
        loadLocalLeaderboard();
        return;
      }

      if (response.leaderboard) {
        // Convert database users to leaderboard entries
        const entries: LeaderboardEntry[] = response.leaderboard.map((user: { id: string; playerName: string; score: number; roundsPlayed: number; timestamp: string | Date }) => ({
          id: user.id,
          playerName: user.playerName,
          score: user.score,
          roundsPlayed: user.roundsPlayed,
          timestamp: new Date(user.timestamp).getTime()
        }));
        
        setLeaderboard(entries);
        setUserPosition(response.userPosition || null);
        
        // Check if current user's high score needs to be updated
        if (currentUser && onUserUpdate && response.userPosition) {
          const leaderboardHighScore = response.userPosition.score;
          if (leaderboardHighScore !== currentUser.highScore) {
            const updatedUser = {
              ...currentUser,
              highScore: leaderboardHighScore
            };
            onUserUpdate(updatedUser);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      // Fallback to localStorage if API fails
      loadLocalLeaderboard();
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, loadLocalLeaderboard, onUserUpdate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const userId = currentUser?._id;
        const response = await fetchLeaderboard(userId);
        
        if (response.error) {
          console.error('Leaderboard error:', response.error);
          loadLocalLeaderboard();
          return;
        }

        if (response.leaderboard) {
          // Convert database users to leaderboard entries
          const entries: LeaderboardEntry[] = response.leaderboard.map((user: { id: string; playerName: string; score: number; roundsPlayed: number; timestamp: string | Date }) => ({
            id: user.id,
            playerName: user.playerName,
            score: user.score,
            roundsPlayed: user.roundsPlayed,
            timestamp: new Date(user.timestamp).getTime()
          }));
          
          setLeaderboard(entries);
          setUserPosition(response.userPosition || null);
          
          // Check if current user's high score needs to be updated
          if (currentUser && onUserUpdate && response.userPosition) {
            const leaderboardHighScore = response.userPosition.score;
            if (leaderboardHighScore !== currentUser.highScore) {
              const updatedUser = {
                ...currentUser,
                highScore: leaderboardHighScore
              };
              onUserUpdate(updatedUser);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        // Fallback to localStorage if API fails
        loadLocalLeaderboard();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, loadLocalLeaderboard, onUserUpdate]);

  // Refresh leaderboard when game ends and user is authenticated
  useEffect(() => {
    if (gameStatus === 'gameOver' && currentUser) {
      // Small delay to ensure score update has been processed
      setTimeout(() => {
        loadLeaderboard();
      }, 1000);
    }
  }, [gameStatus, currentUser, loadLeaderboard]);

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
        <h2 className="text-2xl font-bold text-gray-800">
          🏆 Top 20 Leaderboard
        </h2>
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
            <div className="flex justify-between">
              <span>High Score:</span>
              <span className="font-medium">{currentUser.highScore || 0}</span>
            </div>
            {userPosition && (
              <div className="flex justify-between">
                <span>Leaderboard Position:</span>
                <span className="font-medium">
                  #{userPosition.rank}
                  {userPosition.isInTop20 && <span className="text-green-600 ml-1">🏆</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {leaderboard.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No scores yet. Be the first to play!
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