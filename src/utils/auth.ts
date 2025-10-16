import { User } from '@/types/game';

const AUTH_STORAGE_KEY = 'aztec-word-hunt-auth';

// Browser storage utilities
export const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to storage:', error);
  }
};

export const getUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get user from storage:', error);
    return null;
  }
};

export const clearUserFromStorage = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user from storage:', error);
  }
};

// API communication functions
export const authenticateUser = async (
  username: string, 
  pin: string, 
  action: 'login' | 'register'
): Promise<{ user?: User; error?: string }> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, pin, action }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Authentication failed' };
    }

    return { user: data.user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Network error. Please try again.' };
  }
};

export const updateUserScore = async (
  userId: string, 
  score: number, 
  roundsPlayed: number
): Promise<{ success: boolean; error?: string; highScoreUpdated?: boolean }> => {
  try {
    const response = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, score, roundsPlayed }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update score' };
    }

    return { 
      success: true, 
      highScoreUpdated: data.highScoreUpdated 
    };
  } catch (error) {
    console.error('Score update error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const fetchLeaderboard = async (userId?: string): Promise<{ leaderboard?: { id: string; playerName: string; score: number; roundsPlayed: number; timestamp: string | Date }[]; userPosition?: { rank: number; score: number; isInTop20: boolean }; error?: string }> => {
  try {
    // Add cache-busting timestamp to prevent browser caching
    const timestamp = Date.now();
    const baseUrl = userId ? `/api/leaderboard?userId=${userId}` : '/api/leaderboard';
    const separator = userId ? '&' : '?';
    const url = `${baseUrl}${separator}_t=${timestamp}`;
    
    console.log('🌐 Fetching leaderboard from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log('📡 Response status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return { error: data.error || 'Failed to fetch leaderboard' };
    }

    return { 
      leaderboard: data.leaderboard,
      userPosition: data.userPosition 
    };
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return { error: 'Network error. Please try again.' };
  }
};