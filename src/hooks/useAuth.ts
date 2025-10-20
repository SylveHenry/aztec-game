'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/game';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false // No need to load from storage, so no loading state needed
  });

  // No storage loading on mount - user must re-authenticate every session
  useEffect(() => {
    // Authentication state starts fresh every time
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  }, []);

  const login = useCallback((user: User) => {
    // Only store in memory, no browser storage
    setAuthState({
      isAuthenticated: true,
      user,
      isLoading: false
    });
  }, []);

  const logout = useCallback(() => {
    // Clear memory state only
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  }, []);

  // Remove local score update fallback - scores go directly to database only
  const updateScore = useCallback(async (score: number, roundsPlayed: number) => {
    if (!authState.user) return { success: false, error: 'No authenticated user' };

    try {
      // Save score directly to database - no local fallback
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
        return { success: false, error: result.error || 'Failed to save score' };
      }

      // Update memory state with the database response (no storage)
      const updatedUser = {
        ...authState.user,
        highScore: result.highScoreUpdated ? score : authState.user.highScore,
        totalRoundsPlayed: (authState.user.totalRoundsPlayed || 0) + roundsPlayed,
        lastPlayedAt: new Date()
      };
      
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
      return { success: false, error: 'Network error while saving score' };
    }
  }, [authState.user]);

  const requireAuth = useCallback(() => {
    return authState.isAuthenticated && authState.user;
  }, [authState.isAuthenticated, authState.user]);

  const updateUserData = useCallback((updatedUser: User) => {
    // Only update memory state, no storage
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