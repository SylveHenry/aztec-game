'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, Position } from '@/types/game';
import { generateNewRound } from '@/data/randomGridGenerator';
import { useTimer } from './useTimer';
import { useAuth } from './useAuth';
import { getRandomDidYouKnowFact } from '@/data/didYouKnow';

export const useNewWordCross = () => {
  const { updateScore } = useAuth();
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialRound = generateNewRound();
    return {
      grid: initialRound.grid,
      targetWord: initialRound.targetWord,
      targetWordPositions: initialRound.targetWordPositions,
      selectedCells: [],
      score: 0,
      timeRemaining: 60,
      gameStatus: 'waiting',
      roundsPlayed: 0,
      feedbackMessage: undefined,
      hintShown: false,
      hintPosition: undefined
    };
  });

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);

  // Flag to prevent duplicate score saves
  const [scoreSaved, setScoreSaved] = useState(false);

  // Timeout reference for auto-starting new round
  const [newRoundTimeoutId, setNewRoundTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Periodic auto-save interval reference
  const [autoSaveIntervalId, setAutoSaveIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [lastSavedScore, setLastSavedScore] = useState(0);
  const MAX_RETRY_ATTEMPTS = 3;

  // Retry save function with exponential backoff
  const retrySave = useCallback(async (score: number, rounds: number, attempt: number = 1): Promise<void> => {
    try {
      const result = await updateScore(score, rounds);
      if (result.success) {
        setLastSavedScore(score);
        console.log(`Score saved successfully on attempt ${attempt}:`, result);
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error(`Save attempt ${attempt} failed:`, error);
      
      if (attempt < MAX_RETRY_ATTEMPTS) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying save in ${delay}ms...`);
        
        setTimeout(() => {
          retrySave(score, rounds, attempt + 1);
        }, delay);
      } else {
        console.error(`Failed to save score after ${MAX_RETRY_ATTEMPTS} attempts`);
      }
    }
  }, [updateScore, MAX_RETRY_ATTEMPTS]);

  // Timer hook
  const { timeRemaining, isRunning, startTimer, stopTimer, resetTimer, setOnTimeUp } = useTimer(60);
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      timeRemaining
    }));
  }, [timeRemaining]);

  // Handle hint when 10 seconds remain
  useEffect(() => {
    if (timeRemaining === 10 && !gameState.hintShown && gameState.gameStatus === 'playing') {
      // Select a random character from the target word to highlight
      const randomIndex = Math.floor(Math.random() * gameState.targetWordPositions.length);
      const hintPosition = gameState.targetWordPositions[randomIndex];
      
      setGameState(prev => ({
        ...prev,
        hintShown: true,
        hintPosition: hintPosition
      }));
    }
  }, [timeRemaining, gameState.hintShown, gameState.gameStatus, gameState.targetWordPositions]);

  // Stop the game (unified function for both manual and automatic stopping)
  const stopGame = useCallback((reason: 'manual' | 'timeUp' = 'manual') => {
    stopTimer();
    
    // Clear auto-save interval when game stops
    if (autoSaveIntervalId) {
      clearInterval(autoSaveIntervalId);
      setAutoSaveIntervalId(null);
    }
    
    setGameState(prev => {
      // Only update score when game stops if score hasn't been saved yet and game is still playing
      // Since we now save scores immediately when words are found, this is mainly for cleanup
      if (prev.score > 0 && prev.gameStatus === 'playing' && !scoreSaved) {
        setScoreSaved(true);
        // Final score save - this ensures any remaining score is saved
        updateScore(prev.score, prev.roundsPlayed).then(result => {
          if (!result.success) {
            console.error(`Failed to save final score on ${reason} stop:`, result.error);
          } else {
            console.log(`Final score successfully saved on ${reason} stop:`, result);
          }
        }).catch(error => {
          console.error(`Failed to save final score on ${reason} stop:`, error);
        });
      }
      
      return {
        ...prev,
        gameStatus: 'gameOver',
        feedbackMessage: reason === 'timeUp' ? `Time Up! ${getRandomDidYouKnowFact()}` : undefined
      };
    });

    // Clear the feedback message after 10 seconds if it was a time up stop
    if (reason === 'timeUp') {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          feedbackMessage: undefined
        }));
      }, 10000);
    }
  }, [stopTimer, updateScore, scoreSaved, autoSaveIntervalId]);

  // Handle time up
  useEffect(() => {
    setOnTimeUp(() => {
      stopGame('timeUp');
    });
  }, [setOnTimeUp, stopGame]);

  // Start a new game
  const startGame = useCallback(() => {
    const newRound = generateNewRound();
    setGameState({
      grid: newRound.grid,
      targetWord: newRound.targetWord,
      targetWordPositions: newRound.targetWordPositions,
      selectedCells: [],
      score: 0,
      timeRemaining: 60,
      gameStatus: 'playing',
      roundsPlayed: 1,
      feedbackMessage: undefined,
      hintShown: false,
      hintPosition: undefined
    });
    setScoreSaved(false); // Reset score saved flag for new game
    setLastSavedScore(0); // Reset last saved score
    resetTimer(60);
    startTimer();

    // Start periodic auto-save (every 30 seconds)
    const intervalId = setInterval(() => {
      setGameState(currentState => {
        if (currentState.gameStatus === 'playing' && currentState.score > lastSavedScore) {
          retrySave(currentState.score, currentState.roundsPlayed);
        }
        return currentState;
      });
    }, 30000); // Auto-save every 30 seconds

    setAutoSaveIntervalId(intervalId);
  }, [resetTimer, startTimer, lastSavedScore, retrySave]);

  // Start a new round (after finding target word)
  const startNewRound = useCallback(() => {
    // Clear any existing timeout when starting a new round
    if (newRoundTimeoutId) {
      clearTimeout(newRoundTimeoutId);
      setNewRoundTimeoutId(null);
    }
    
    const newRound = generateNewRound();
    setGameState(prev => ({
      ...prev,
      grid: newRound.grid,
      targetWord: newRound.targetWord,
      targetWordPositions: newRound.targetWordPositions,
      selectedCells: [],
      roundsPlayed: prev.roundsPlayed + 1,
      feedbackMessage: undefined,
      hintShown: false,
      hintPosition: undefined
    }));
    resetTimer(60);
    startTimer();
  }, [resetTimer, startTimer, newRoundTimeoutId]);

  // Reset the game
  const resetGame = useCallback(() => {
    // Clear auto-save interval when game resets
    if (autoSaveIntervalId) {
      clearInterval(autoSaveIntervalId);
      setAutoSaveIntervalId(null);
    }
    
    const newRound = generateNewRound();
    setGameState({
      grid: newRound.grid,
      targetWord: newRound.targetWord,
      targetWordPositions: newRound.targetWordPositions,
      selectedCells: [],
      score: 0,
      timeRemaining: 60,
      gameStatus: 'waiting',
      roundsPlayed: 0,
      feedbackMessage: undefined,
      hintShown: false,
      hintPosition: undefined
    });
    setScoreSaved(false); // Reset score saved flag for reset game
    setLastSavedScore(0); // Reset last saved score
    resetTimer(60);
  }, [resetTimer, autoSaveIntervalId]);

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
      // Stop the timer immediately when word is found
      stopTimer();
      
      // Award 50 points and show success message
      const newScore = gameState.score + 50;
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        selectedCells: [],
        feedbackMessage: `Success! ${getRandomDidYouKnowFact()}`
      }));

      // Save score immediately to database with retry logic
      retrySave(newScore, gameState.roundsPlayed);
      
      // Start new round after showing success message for 10 seconds
      const timeoutId = setTimeout(() => {
        startNewRound();
      }, 10000);
      
      // Store the timeout ID to allow cancellation
      setNewRoundTimeoutId(timeoutId);
    } else {
      // Clear selection if not target word
      setGameState(prev => ({
        ...prev,
        selectedCells: []
      }));
    }

    setIsSelecting(false);
    setSelectionStart(null);
  }, [isSelecting, gameState.gameStatus, gameState.selectedCells, gameState.score, gameState.roundsPlayed, checkTargetWordMatch, startNewRound, stopTimer, retrySave]);

  // Handle cell touch start
  const handleCellTouchStart = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setGameState(prev => ({
      ...prev,
      selectedCells: [{ row, col }]
    }));
  }, [gameState.gameStatus]);

  // Handle cell touch move
  const handleCellTouchMove = useCallback((row: number, col: number) => {
    if (!isSelecting || !selectionStart || gameState.gameStatus !== 'playing') return;

    const newSelection = getSelectionPath(selectionStart, { row, col });
    setGameState(prev => ({
      ...prev,
      selectedCells: newSelection
    }));
  }, [isSelecting, selectionStart, gameState.gameStatus, getSelectionPath]);

  // Handle cell touch end
  const handleCellTouchEnd = useCallback(() => {
    if (!isSelecting || gameState.gameStatus !== 'playing') return;

    // Check if selection matches target word
    const isTargetWordFound = checkTargetWordMatch(gameState.selectedCells);

    if (isTargetWordFound) {
      // Stop the timer immediately when word is found
      stopTimer();
      
      // Award 50 points and show success message
      const newScore = gameState.score + 50;
      
      setGameState(prev => ({
        ...prev,
        score: newScore,
        selectedCells: [],
        feedbackMessage: `Success! ${getRandomDidYouKnowFact()}`
      }));

      // Save score immediately to database with retry logic
      retrySave(newScore, gameState.roundsPlayed);
      
      // Start new round after showing success message for 10 seconds
      const timeoutId = setTimeout(() => {
        startNewRound();
      }, 10000);
      
      // Store the timeout ID to allow cancellation
      setNewRoundTimeoutId(timeoutId);
    } else {
      // Clear selection if not target word
      setGameState(prev => ({
        ...prev,
        selectedCells: []
      }));
    }

    setIsSelecting(false);
    setSelectionStart(null);
  }, [isSelecting, gameState.gameStatus, gameState.selectedCells, gameState.score, gameState.roundsPlayed, checkTargetWordMatch, startNewRound, stopTimer, retrySave]);

  // Handle manual feedback message dismissal
  const closeFeedback = useCallback(() => {
    // Clear any pending new round timeout
    if (newRoundTimeoutId) {
      clearTimeout(newRoundTimeoutId);
      setNewRoundTimeoutId(null);
    }
    
    setGameState(prev => ({
      ...prev,
      feedbackMessage: undefined
    }));
    
    // If it was a success message, start new round immediately
    if (gameState.feedbackMessage?.startsWith('Success!')) {
      startNewRound();
    }
  }, [gameState.feedbackMessage, startNewRound, newRoundTimeoutId]);

  return {
    gameState,
    timerState: { timeRemaining, isRunning },
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    handleCellTouchStart,
    handleCellTouchMove,
    handleCellTouchEnd,
    startGame,
    stopGame,
    resetGame,
    closeFeedback,
    isSelecting
  };
};