import { User } from '@/types/game';

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