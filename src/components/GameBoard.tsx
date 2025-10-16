'use client';

import React, { useRef, useEffect } from 'react';
import { GameState } from '@/types/game';

interface GameBoardProps {
  gameState: GameState;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  onCellTouchStart: (row: number, col: number) => void;
  onCellTouchMove: (row: number, col: number) => void;
  onCellTouchEnd: () => void;
  targetWord?: string;
  timeRemaining?: number;
  isTimerRunning?: boolean;
  gameStatus?: string;
  onStartGame?: () => void;
  onStopGame?: () => void;
  onResetGame?: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  onCellTouchStart,
  onCellTouchMove,
  onCellTouchEnd,
  targetWord,
  timeRemaining,
  gameStatus,
  onStartGame,
  onStopGame,
  onResetGame
}) => {
  const { grid, selectedCells, targetWordPositions } = gameState;
  const gameBoardRef = useRef<HTMLDivElement>(null);

  // Focus the game board when the game starts
  useEffect(() => {
    if (gameStatus === 'playing' && gameBoardRef.current) {
      // Smooth scroll to the game board
      gameBoardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      
      // Optional: Focus the game board for keyboard accessibility
      gameBoardRef.current.focus();
    }
  }, [gameStatus]);

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellPartOfTargetWord = (row: number, col: number): boolean => {
    return targetWordPositions.some(pos => pos.row === row && pos.col === col);
  };

  const getCellClassName = (row: number, col: number): string => {
    const baseClasses = "aspect-square border-2 border-amber-300 flex items-center justify-center font-bold cursor-pointer select-none transition-all duration-200 text-xs sm:text-sm md:text-base lg:text-lg";
    
    if (isCellSelected(row, col)) {
      return `${baseClasses} bg-blue-500 text-white border-blue-600 transform scale-105`;
    }
    
    // Highlight target word positions when game is over
    if (gameStatus === 'gameOver' && isCellPartOfTargetWord(row, col)) {
      return `${baseClasses} bg-red-200 text-red-800 border-red-500`;
    }
    
    return `${baseClasses} bg-white hover:bg-blue-50 text-gray-800`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div 
        ref={gameBoardRef}
        tabIndex={-1}
        className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 sm:p-4 md:p-6 rounded-xl shadow-lg w-full max-w-lg xl:max-w-2xl relative outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {/* Game Title with Target Word and Timer */}
        <div className="text-center mb-4 pb-4 border-b-2 border-amber-300">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-bold text-amber-800">
              Find: <span className="text-blue-600 font-mono">{targetWord || '---'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-lg font-bold ${
                timeRemaining && timeRemaining <= 5 ? 'text-red-600' : 
                timeRemaining && timeRemaining <= 10 ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                ⏱️ {timeRemaining || 0}s
              </div>
            </div>
          </div>
          {/* Timer Progress Bar */}
          {timeRemaining !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  timeRemaining <= 5 ? 'bg-red-500' : 
                  timeRemaining <= 10 ? 'bg-orange-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${(timeRemaining / 180) * 100}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Game Grid with Overlay */}
        <div className="relative">
          <div 
            className={`grid gap-0.5 sm:gap-1 w-full aspect-square transition-all duration-300 game-grid ${
              gameStatus === 'waiting' || gameState.feedbackMessage ? 'blur-sm' : ''
            }`}
            style={{ 
              gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
              userSelect: 'none',
              touchAction: 'none'
            }}
            onMouseUp={onCellMouseUp}
            onMouseLeave={onCellMouseUp}
            onTouchEnd={onCellTouchEnd}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${getCellClassName(rowIndex, colIndex)} game-cell`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onCellMouseDown(rowIndex, colIndex);
                  }}
                  onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    if (touch) {
                      onCellTouchStart(rowIndex, colIndex);
                    }
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    if (touch) {
                      const element = document.elementFromPoint(touch.clientX, touch.clientY);
                      const cellElement = element?.closest('[data-row][data-col]') as HTMLElement;
                      if (cellElement) {
                        const touchRow = parseInt(cellElement.dataset.row || '0');
                        const touchCol = parseInt(cellElement.dataset.col || '0');
                        onCellTouchMove(touchRow, touchCol);
                      }
                    }
                  }}
                  data-row={rowIndex}
                  data-col={colIndex}
                  style={{ 
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    touchAction: 'none'
                  }}
                >
                  {cell}
                </div>
              ))
            )}
          </div>

          {/* Overlay with Start Game Button */}
          {gameStatus === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <div className="text-center space-y-4">
                {onStartGame && (
                  <button
                    onClick={onStartGame}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🚀 Start Game
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feedback Message Overlay */}
          {gameState.feedbackMessage && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className={`text-4xl font-bold px-8 py-4 rounded-lg shadow-2xl ${
                  gameState.feedbackMessage === 'Success!' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {gameState.feedbackMessage}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stop Button - Only shown when game is playing */}
      {gameStatus === 'playing' && onStopGame && (
        <button
          onClick={onStopGame}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ⏹️ Stop Game
        </button>
      )}
      
      {/* Play Again Button - Shown in same position as Stop button when game is over */}
      {gameStatus === 'gameOver' && onResetGame && (
        <button
          onClick={onResetGame}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🔄 Play Again
        </button>
      )}
    </div>
  );
};

export default GameBoard;