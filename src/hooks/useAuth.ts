'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/game';
import { getUserFromStorage, saveUserToStorage, clearUserFromStorage, updateUserScore } from '@/utils/auth';

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
      const result = await updateUserScore(authState.user._id!, score, roundsPlayed);
      
      if (result.success && result.highScoreUpdated) {
        // Update local user data if high score was updated
        const updatedUser = {
          ...authState.user,
          highScore: score,
          totalRoundsPlayed: roundsPlayed,
          lastPlayedAt: new Date()
        };
        
        saveUserToStorage(updatedUser);
        setAuthState(prev => ({
          ...prev,
          user: updatedUser
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Score update error:', error);
      return { success: false, error: 'Failed to update score' };
    }
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