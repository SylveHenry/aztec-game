'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, WordToFind, GameData } from '@/types/game';

export const useWordCross = (gameData: GameData) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const wordsToFind: WordToFind[] = gameData.words.map(wordData => ({
      word: wordData.word,
      found: false,
      positions: [],
      direction: 'horizontal' as const
    }));

    return {
      grid: gameData.grid,
      wordsToFind,
      selectedCells: [],
      foundWords: [],
      gameCompleted: false,
      score: 0
    };
  });

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);

  // Find word positions in the grid - supports all 8 directions
  const findWordInGrid = useCallback((word: string, grid: string[][]): WordToFind | null => {
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Define all 8 directions: [rowDelta, colDelta, directionName]
    const directions: [number, number, string][] = [
      [0, 1, 'horizontal'],           // Left to right
      [0, -1, 'horizontal-reverse'],  // Right to left
      [1, 0, 'vertical'],             // Top to bottom
      [-1, 0, 'vertical-reverse'],    // Bottom to top
      [1, 1, 'diagonal'],             // Top-left to bottom-right
      [-1, -1, 'diagonal-reverse'],   // Bottom-right to top-left
      [1, -1, 'diagonal-left'],       // Top-right to bottom-left
      [-1, 1, 'diagonal-left-reverse'] // Bottom-left to top-right
    ];

    // Check each direction
    for (const [rowDelta, colDelta, directionName] of directions) {
      for (let startRow = 0; startRow < rows; startRow++) {
        for (let startCol = 0; startCol < cols; startCol++) {
          let match = true;
          const positions: Position[] = [];
          
          // Check if word fits in this direction from this starting position
          let currentRow = startRow;
          let currentCol = startCol;
          
          for (let i = 0; i < word.length; i++) {
            // Check bounds
            if (currentRow < 0 || currentRow >= rows || currentCol < 0 || currentCol >= cols) {
              match = false;
              break;
            }
            
            // Check character match
            if (grid[currentRow][currentCol] !== word[i]) {
              match = false;
              break;
            }
            
            positions.push({ row: currentRow, col: currentCol });
            
            // Move to next position
            if (i < word.length - 1) {
              currentRow += rowDelta;
              currentCol += colDelta;
            }
          }
          
          if (match) {
            return {
              word,
              found: false,
              positions,
              direction: directionName as 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-left' | 'diagonal-left-reverse'
            };
          }
        }
      }
    }

    return null;
  }, []);

  // Initialize word positions
  useEffect(() => {
    const wordsWithPositions = gameData.words.map(wordData => {
      const wordFound = findWordInGrid(wordData.word, gameData.grid);
      return wordFound || {
        word: wordData.word,
        found: false,
        positions: [],
        direction: 'horizontal' as const
      };
    });

    setGameState(prev => ({
      ...prev,
      wordsToFind: wordsWithPositions
    }));
  }, [gameData, findWordInGrid]);

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setGameState(prev => ({
      ...prev,
      selectedCells: [{ row, col }]
    }));
  }, []);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;

    const newSelection = getSelectionPath(selectionStart, { row, col });
    setGameState(prev => ({
      ...prev,
      selectedCells: newSelection
    }));
  }, [isSelecting, selectionStart]);

  const handleCellMouseUp = useCallback(() => {
    if (!isSelecting) return;

    // Check if selection matches any word (forward or backward)
    const selectedWord = gameState.selectedCells
      .map(pos => gameState.grid[pos.row][pos.col])
      .join('');
    
    const reversedWord = selectedWord.split('').reverse().join('');

    const foundWord = gameState.wordsToFind.find(word => 
      !word.found && (word.word === selectedWord || word.word === reversedWord)
    );

    if (foundWord) {
      setGameState(prev => {
        const updatedWords = prev.wordsToFind.map(word =>
          word.word === foundWord.word ? { ...word, found: true } : word
        );
        
        const newFoundWords = [...prev.foundWords, foundWord.word];
        const newScore = prev.score + foundWord.word.length * 10;
        const gameCompleted = updatedWords.every(word => word.found);

        return {
          ...prev,
          wordsToFind: updatedWords,
          foundWords: newFoundWords,
          score: newScore,
          gameCompleted,
          selectedCells: []
        };
      });
    } else {
      setGameState(prev => ({
        ...prev,
        selectedCells: []
      }));
    }

    setIsSelecting(false);
    setSelectionStart(null);
  }, [isSelecting, gameState.selectedCells, gameState.grid, gameState.wordsToFind]);

  const getSelectionPath = (start: Position, end: Position): Position[] => {
    const path: Position[] = [];
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    // Determine if it's a valid selection (straight line)
    if (rowDiff === 0) {
      // Horizontal
      const step = colDiff > 0 ? 1 : -1;
      for (let col = start.col; col !== end.col + step; col += step) {
        path.push({ row: start.row, col });
      }
    } else if (colDiff === 0) {
      // Vertical
      const step = rowDiff > 0 ? 1 : -1;
      for (let row = start.row; row !== end.row + step; row += step) {
        path.push({ row, col: start.col });
      }
    } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
      // Diagonal
      const rowStep = rowDiff > 0 ? 1 : -1;
      const colStep = colDiff > 0 ? 1 : -1;
      const steps = Math.abs(rowDiff);
      
      for (let i = 0; i <= steps; i++) {
        path.push({
          row: start.row + i * rowStep,
          col: start.col + i * colStep
        });
      }
    } else {
      // Invalid selection, return just the start
      path.push(start);
    }
    
    return path;
  };

  const resetGame = useCallback(() => {
    const wordsToFind: WordToFind[] = gameData.words.map(wordData => {
      const wordFound = findWordInGrid(wordData.word, gameData.grid);
      return wordFound || {
        word: wordData.word,
        found: false,
        positions: [],
        direction: 'horizontal' as const
      };
    });

    setGameState({
      grid: gameData.grid,
      wordsToFind,
      selectedCells: [],
      foundWords: [],
      gameCompleted: false,
      score: 0
    });
    setIsSelecting(false);
    setSelectionStart(null);
  }, [gameData, findWordInGrid]);

  return {
    gameState,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    resetGame,
    isSelecting
  };
};