'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, WordToFind, GameData } from '@/types/game';

export const useWordCross = (gameData: GameData) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const wordsToFind: WordToFind[] = gameData.words.map(word => ({
      word,
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

  // Find word positions in the grid
  const findWordInGrid = useCallback((word: string, grid: string[][]): WordToFind | null => {
    const rows = grid.length;
    const cols = grid[0].length;
    
    // Check horizontal
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= cols - word.length; col++) {
        let match = true;
        const positions: Position[] = [];
        
        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i] !== word[i]) {
            match = false;
            break;
          }
          positions.push({ row, col: col + i });
        }
        
        if (match) {
          return {
            word,
            found: false,
            positions,
            direction: 'horizontal'
          };
        }
      }
    }

    // Check vertical
    for (let row = 0; row <= rows - word.length; row++) {
      for (let col = 0; col < cols; col++) {
        let match = true;
        const positions: Position[] = [];
        
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col] !== word[i]) {
            match = false;
            break;
          }
          positions.push({ row: row + i, col });
        }
        
        if (match) {
          return {
            word,
            found: false,
            positions,
            direction: 'vertical'
          };
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row <= rows - word.length; row++) {
      for (let col = 0; col <= cols - word.length; col++) {
        let match = true;
        const positions: Position[] = [];
        
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col + i] !== word[i]) {
            match = false;
            break;
          }
          positions.push({ row: row + i, col: col + i });
        }
        
        if (match) {
          return {
            word,
            found: false,
            positions,
            direction: 'diagonal'
          };
        }
      }
    }

    // Check diagonal (top-right to bottom-left)
    for (let row = 0; row <= rows - word.length; row++) {
      for (let col = word.length - 1; col < cols; col++) {
        let match = true;
        const positions: Position[] = [];
        
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col - i] !== word[i]) {
            match = false;
            break;
          }
          positions.push({ row: row + i, col: col - i });
        }
        
        if (match) {
          return {
            word,
            found: false,
            positions,
            direction: 'diagonal-reverse'
          };
        }
      }
    }

    return null;
  }, []);

  // Initialize word positions
  useEffect(() => {
    const wordsWithPositions = gameData.words.map(word => {
      const wordData = findWordInGrid(word, gameData.grid);
      return wordData || {
        word,
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

    // Check if selection matches any word
    const selectedWord = gameState.selectedCells
      .map(pos => gameState.grid[pos.row][pos.col])
      .join('');

    const foundWord = gameState.wordsToFind.find(word => 
      !word.found && (word.word === selectedWord || word.word === selectedWord.split('').reverse().join(''))
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
  }, [isSelecting, gameState.selectedCells, gameState.grid, gameState.wordsToFind, gameState.foundWords, gameState.score]);

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
    const wordsToFind: WordToFind[] = gameData.words.map(word => {
      const wordData = findWordInGrid(word, gameData.grid);
      return wordData || {
        word,
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