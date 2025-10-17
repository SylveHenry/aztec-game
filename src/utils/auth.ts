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