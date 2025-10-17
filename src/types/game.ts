export interface Position {
  row: number;
  col: number;
}

export interface WordToFind {
  word: string;
  found: boolean;
  positions: Position[];
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-left' | 'diagonal-left-reverse';
}

export interface GameState {
  grid: string[][];
  targetWord: string;
  targetWordPositions: Position[];
  selectedCells: Position[];
  score: number;
  timeRemaining: number;
  gameStatus: 'waiting' | 'playing' | 'paused' | 'gameOver';
  roundsPlayed: number;
  feedbackMessage?: string;
  hintShown: boolean;
  hintPosition?: Position;
}

export interface WordData {
  word: string;
  found: boolean;
}

export interface GameData {
  id: number;
  title: string;
  difficulty: string;
  grid: string[][];
  words: WordData[];
}

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
}

// Authentication types
export interface User {
  _id?: string;
  username: string;
  usernameLower?: string;
  pin: string;
  highScore: number;
  totalRoundsPlayed: number;
  createdAt: Date;
  lastPlayedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: User) => void;
  mode: 'login' | 'register';
}