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
  wordsToFind: WordToFind[];
  selectedCells: Position[];
  foundWords: string[];
  gameCompleted: boolean;
  score: number;
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