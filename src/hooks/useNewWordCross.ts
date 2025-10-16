'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, Position } from '@/types/game';
import { generateNewRound } from '@/data/randomGridGenerator';
import { useTimer } from './useTimer';
import { useAuth } from './useAuth';

export const useNewWordCross = () => {
  const { updateScore, user } = useAuth();
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialRound = generateNewRound();
    return {
      grid: initialRound.grid,
      targetWord: initialRound.targetWord,
      targetWordPositions: initialRound.targetWordPositions,
      selectedCells: [],
      score: 0,
      timeRemaining: 180,
      gameStatus: 'waiting',
      roundsPlayed: 0,
      feedbackMessage: undefined
    };
  });

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);

  // Timer hook
  const { timeRemaining, isRunning, startTimer, stopTimer, resetTimer, setOnTimeUp } = useTimer(180);

  // Update game state time remaining when timer changes
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      timeRemaining
    }));
  }, [timeRemaining]);

  // Handle time up
  useEffect(() => {
    setOnTimeUp(() => {
      setGameState(prev => {
        // Save final score to database when time runs out (don't count current incomplete round)
        if (prev.score > (user?.highScore || 0)) {
          updateScore(prev.score, prev.roundsPlayed);
        }
        
        return {
          ...prev,
          gameStatus: 'gameOver',
          feedbackMessage: 'Time Up!'
        };
      });
      
      // Clear the feedback message after 2 seconds to show target word highlighting
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          feedbackMessage: undefined
        }));
      }, 2000);
    });
  }, [setOnTimeUp, updateScore, user?.highScore]);

  // Start a new game
  const startGame = useCallback(() => {
    const newRound = generateNewRound();
    setGameState({
      grid: newRound.grid,
      targetWord: newRound.targetWord,
      targetWordPositions: newRound.targetWordPositions,
      selectedCells: [],
      score: 0,
      timeRemaining: 180,
      gameStatus: 'playing',
      roundsPlayed: 1,
      feedbackMessage: undefined
    });
    resetTimer(180);
    startTimer();
  }, [resetTimer, startTimer]);

  // Start a new round (after finding target word)
  const startNewRound = useCallback(() => {
    const newRound = generateNewRound();
    setGameState(prev => ({
      ...prev,
      grid: newRound.grid,
      targetWord: newRound.targetWord,
      targetWordPositions: newRound.targetWordPositions,
      selectedCells: [],
      roundsPlayed: prev.roundsPlayed + 1,
      feedbackMessage: undefined
    }));
    resetTimer(180);
    startTimer();
  }, [resetTimer, startTimer]);

  // Stop the game
  const stopGame = useCallback(() => {
    stopTimer();
    setGameState(prev => {
      // Save final score to database when manually stopped (don't count current incomplete round)
      if (prev.score > (user?.highScore || 0)) {
        updateScore(prev.score, prev.roundsPlayed);
      }
      
      return {
        ...prev,
        gameStatus: 'gameOver'
      };
    });
  }, [stopTimer, updateScore, user?.highScore]);

  // Reset the game
  const resetGame = useCallback(() => {
    const newRound = generateNewRound();
    setGameState({
      grid: newRound.grid,
      targetWord: newRound.targetWord,
      targetWordPositions: newRound.targetWordPositions,
      selectedCells: [],
      score: 0,
      timeRemaining: 180,
      gameStatus: 'waiting',
      roundsPlayed: 0,
      feedbackMessage: undefined
    });
    resetTimer(180);
  }, [resetTimer]);

  // Get selection path between two positions
  const getSelectionPath = useCallback((start: Position, end: Position): Position[] => {
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
  }, []);

  // Check if selected positions match target word
  const checkTargetWordMatch = useCallback((selectedPositions: Position[]): boolean => {
    if (selectedPositions.length !== gameState.targetWordPositions.length) {
      return false;
    }

    // Check if all positions match (in any order, since we support all directions)
    const selectedSet = new Set(selectedPositions.map(pos => `${pos.row},${pos.col}`));
    const targetSet = new Set(gameState.targetWordPositions.map(pos => `${pos.row},${pos.col}`));
    
    return selectedSet.size === targetSet.size && 
           [...selectedSet].every(pos => targetSet.has(pos));
  }, [gameState.targetWordPositions]);

  // Handle cell mouse down
  const handleCellMouseDown = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setGameState(prev => ({
      ...prev,
      selectedCells: [{ row, col }]
    }));
  }, [gameState.gameStatus]);

  // Handle cell mouse enter
  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (!isSelecting || !selectionStart || gameState.gameStatus !== 'playing') return;

    const newSelection = getSelectionPath(selectionStart, { row, col });
    setGameState(prev => ({
      ...prev,
      selectedCells: newSelection
    }));
  }, [isSelecting, selectionStart, gameState.gameStatus, getSelectionPath]);

  // Handle cell mouse up
  const handleCellMouseUp = useCallback(() => {
    if (!isSelecting || gameState.gameStatus !== 'playing') return;

    // Check if selection matches target word
    const isTargetWordFound = checkTargetWordMatch(gameState.selectedCells);

    if (isTargetWordFound) {
      // Award 50 points and show success message
      const newScore = gameState.score + 50;
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        selectedCells: [],
        feedbackMessage: 'Success!'
      }));
      
      // Only update score in database if it's a new high score
      if (newScore > (user?.highScore || 0)) {
        updateScore(newScore, gameState.roundsPlayed + 1);
      }
      
      // Start new round after a brief delay
      setTimeout(() => {
        startNewRound();
      }, 1500);
    } else {
      // Clear selection if not target word
      setGameState(prev => ({
        ...prev,
        selectedCells: []
      }));
    }

    setIsSelecting(false);
    setSelectionStart(null);
  }, [isSelecting, gameState.gameStatus, gameState.selectedCells, gameState.score, gameState.roundsPlayed, checkTargetWordMatch, startNewRound, updateScore, user?.highScore]);

  return {
    gameState,
    timerState: { timeRemaining, isRunning },
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    startGame,
    stopGame,
    resetGame,
    isSelecting
  };
};