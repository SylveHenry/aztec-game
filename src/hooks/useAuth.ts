'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/game';
import { getUserFromStorage, saveUserToStorage, clearUserFromStorage } from '@/utils/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = getUserFromStorage();
    setAuthState({
      isAuthenticated: !!storedUser,
      user: storedUser,
      isLoading: false
    });
  }, []);

  const login = useCallback((user: User) => {
    saveUserToStorage(user);
    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false
    });
  }, []);

  const logout = useCallback(() => {
    clearUserFromStorage();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  }, []);

  const updateScore = useCallback(async (score: number, roundsPlayed: number) => {
    if (!authState.user) return { success: false, error: 'No authenticated user' };

    try {
      // Save score to database if user is authenticated
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authState.user._id,
          username: authState.user.username,
          score,
          roundsPlayed
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to save score to database:', result.error);
        // Fall back to local storage only
        return updateScoreLocally(score, roundsPlayed);
      }

      // Update local user data with the database response
      const updatedUser = {
        ...authState.user,
        highScore: result.highScoreUpdated ? score : authState.user.highScore,
        totalRoundsPlayed: (authState.user.totalRoundsPlayed || 0) + roundsPlayed,
        lastPlayedAt: new Date()
      };
      
      saveUserToStorage(updatedUser);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
      return { 
        success: true, 
        highScoreUpdated: result.highScoreUpdated,
        savedToDatabase: true 
      };

    } catch (error) {
      console.error('Error saving score to database:', error);
      // Fall back to local storage only
      return updateScoreLocally(score, roundsPlayed);
    }
  }, [authState.user]);

  // Helper function for local-only score updates (fallback)
  const updateScoreLocally = useCallback((score: number, roundsPlayed: number) => {
    if (!authState.user) return { success: false, error: 'No authenticated user' };

    const updatedUser = {
      ...authState.user,
      highScore: score > authState.user.highScore ? score : authState.user.highScore,
      totalRoundsPlayed: (authState.user.totalRoundsPlayed || 0) + roundsPlayed,
      lastPlayedAt: new Date()
    };
    
    saveUserToStorage(updatedUser);
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
    
    return { 
      success: true, 
      highScoreUpdated: score > authState.user.highScore,
      savedToDatabase: false 
    };
  }, [authState.user]);

  const requireAuth = useCallback(() => {
    return authState.isAuthenticated && authState.user;
  }, [authState.isAuthenticated, authState.user]);

  const updateUserData = useCallback((updatedUser: User) => {
    saveUserToStorage(updatedUser);
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    updateScore,
    requireAuth,
    updateUserData
  };
};