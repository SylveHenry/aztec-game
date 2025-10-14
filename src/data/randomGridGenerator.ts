import { Position } from '@/types/game';
import { blockchainWords } from './wordlist';

export interface GridGenerationResult {
  grid: string[][];
  targetWord: string;
  targetWordPositions: Position[];
}

// All 8 directions for word placement
const DIRECTIONS = [
  { name: 'horizontal', rowDelta: 0, colDelta: 1 },           // Left to right
  { name: 'horizontal-reverse', rowDelta: 0, colDelta: -1 },  // Right to left
  { name: 'vertical', rowDelta: 1, colDelta: 0 },             // Top to bottom
  { name: 'vertical-reverse', rowDelta: -1, colDelta: 0 },    // Bottom to top
  { name: 'diagonal', rowDelta: 1, colDelta: 1 },             // Top-left to bottom-right
  { name: 'diagonal-reverse', rowDelta: -1, colDelta: -1 },   // Bottom-right to top-left
  { name: 'diagonal-left', rowDelta: 1, colDelta: -1 },       // Top-right to bottom-left
  { name: 'diagonal-left-reverse', rowDelta: -1, colDelta: 1 } // Bottom-left to top-right
];

const GRID_SIZE = 15;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Generate random letter
function getRandomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

// Get random word from wordlist
function getRandomTargetWord(): string {
  return blockchainWords[Math.floor(Math.random() * blockchainWords.length)];
}

// Check if word can fit in grid at given position and direction
function canPlaceWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: { rowDelta: number; colDelta: number }
): boolean {
  const { rowDelta, colDelta } = direction;
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * rowDelta;
    const col = startCol + i * colDelta;
    
    // Check bounds
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
      return false;
    }
    
    // Check if cell is empty or contains the same letter
    if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

// Place word in grid at given position and direction
function placeWord(
  grid: string[][],
  word: string,
  startRow: number,
  startCol: number,
  direction: { rowDelta: number; colDelta: number }
): Position[] {
  const { rowDelta, colDelta } = direction;
  const positions: Position[] = [];
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * rowDelta;
    const col = startCol + i * colDelta;
    grid[row][col] = word[i];
    positions.push({ row, col });
  }
  
  return positions;
}

// Generate a random grid with one target word and random filler letters
export function generateRandomGrid(): GridGenerationResult {
  // Initialize empty grid
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  
  // Get random target word
  const targetWord = getRandomTargetWord();
  
  // Try to place the target word in a random position and direction
  let targetWordPositions: Position[] = [];
  let placed = false;
  let attempts = 0;
  const maxAttempts = 1000;
  
  while (!placed && attempts < maxAttempts) {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const startRow = Math.floor(Math.random() * GRID_SIZE);
    const startCol = Math.floor(Math.random() * GRID_SIZE);
    
    if (canPlaceWord(grid, targetWord, startRow, startCol, direction)) {
      targetWordPositions = placeWord(grid, targetWord, startRow, startCol, direction);
      placed = true;
    }
    
    attempts++;
  }
  
  // If we couldn't place the word randomly, place it horizontally in the center
  if (!placed) {
    const startRow = Math.floor(GRID_SIZE / 2);
    const startCol = Math.floor((GRID_SIZE - targetWord.length) / 2);
    const direction = DIRECTIONS[0]; // horizontal
    
    if (canPlaceWord(grid, targetWord, startRow, startCol, direction)) {
      targetWordPositions = placeWord(grid, targetWord, startRow, startCol, direction);
    }
  }
  
  // Fill remaining cells with random letters
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = getRandomLetter();
      }
    }
  }
  
  return {
    grid,
    targetWord,
    targetWordPositions
  };
}

// Generate a new game round
export function generateNewRound(): GridGenerationResult {
  return generateRandomGrid();
}