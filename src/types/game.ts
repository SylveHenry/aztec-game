export interface Position {
  row: number;
  col: number;
}

export interface WordToFind {
  word: string;
  found: boolean;
  positions: Position[];
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse';
}

export interface GameState {
  grid: string[][];
  wordsToFind: WordToFind[];
  selectedCells: Position[];
  foundWords: string[];
  gameCompleted: boolean;
  score: number;
}

export interface GameData {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grid: string[][];
  words: string[];
}