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

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  roundsPlayed: number;
  timestamp: number;
}

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
}