'use client';

import React from 'react';
import { GameState } from '@/types/game';

interface GameBoardProps {
  gameState: GameState;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp
}) => {
  const { grid, selectedCells, wordsToFind } = gameState;

  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellPartOfFoundWord = (row: number, col: number): boolean => {
    return wordsToFind.some(word => 
      word.found && word.positions.some(pos => pos.row === row && pos.col === col)
    );
  };

  const getCellClassName = (row: number, col: number): string => {
    const baseClasses = "w-10 h-10 sm:w-12 sm:h-12 border-2 border-amber-300 flex items-center justify-center font-bold text-lg cursor-pointer select-none transition-all duration-200";
    
    if (isCellPartOfFoundWord(row, col)) {
      return `${baseClasses} bg-green-200 text-green-800 border-green-400`;
    }
    
    if (isCellSelected(row, col)) {
      return `${baseClasses} bg-amber-200 text-amber-800 border-amber-500 transform scale-105`;
    }
    
    return `${baseClasses} bg-white hover:bg-amber-50 text-gray-800`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-xl shadow-lg">
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`,
            userSelect: 'none'
          }}
          onMouseUp={onCellMouseUp}
          onMouseLeave={onCellMouseUp}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClassName(rowIndex, colIndex)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onCellMouseDown(rowIndex, colIndex);
                }}
                onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
                style={{ 
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>
      
      {gameState.gameCompleted && (
        <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 text-center">
          <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Congratulations!</h3>
          <p className="text-green-700">
            You found all words! Final Score: <span className="font-bold">{gameState.score}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;