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

const GRID_SIZE = 10;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Generate random letter
function getRandomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

// Get random word from wordlist (max 10 characters for 10x10 grid)
function getRandomTargetWord(): string {
  // Filter words to only include those with 10 characters or less
  const validWords = blockchainWords.filter(word => word.length <= 10);
  return validWords[Math.floor(Math.random() * validWords.length)];
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
  
  // Try to place the target word with truly random direction selection
  let targetWordPositions: Position[] = [];
  let placed = false;
  let attempts = 0;
  const maxAttempts = 1000;
  
  while (!placed && attempts < maxAttempts) {
    // Randomly shuffle all directions for each attempt
    const shuffledDirections = [...DIRECTIONS].sort(() => Math.random() - 0.5);
    
    // Try each direction in random order
    for (const direction of shuffledDirections) {
      if (placed) break;
      
      // Try multiple random positions for this direction
      for (let posAttempt = 0; posAttempt < 50; posAttempt++) {
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);
        
        if (canPlaceWord(grid, targetWord, startRow, startCol, direction)) {
          targetWordPositions = placeWord(grid, targetWord, startRow, startCol, direction);
          placed = true;
          break;
        }
      }
    }
    attempts++;
  }
  
  // If we still couldn't place the word, try a guaranteed diagonal placement
  if (!placed) {
    // Try diagonal placement from top-left corner
    const direction = DIRECTIONS.find(d => d.name === 'diagonal')!;
    const maxStartRow = GRID_SIZE - targetWord.length;
    const maxStartCol = GRID_SIZE - targetWord.length;
    
    if (maxStartRow >= 0 && maxStartCol >= 0) {
      const startRow = Math.floor(maxStartRow / 2);
      const startCol = Math.floor(maxStartCol / 2);
      
      if (canPlaceWord(grid, targetWord, startRow, startCol, direction)) {
        targetWordPositions = placeWord(grid, targetWord, startRow, startCol, direction);
        placed = true;
      }
    }
  }
  
  // Last resort: try horizontal in center (should work for most words in 10x10)
  if (!placed) {
    const startRow = Math.floor(GRID_SIZE / 2);
    const startCol = Math.max(0, Math.floor((GRID_SIZE - targetWord.length) / 2));
    const direction = DIRECTIONS[0]; // horizontal
    
    if (startCol + targetWord.length <= GRID_SIZE) {
      targetWordPositions = placeWord(grid, targetWord, startRow, startCol, direction);
      placed = true;
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