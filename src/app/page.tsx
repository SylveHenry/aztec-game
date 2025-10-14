'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameBoard from '@/components/GameBoard';
import { Leaderboard } from '@/components/Leaderboard';

import { useNewWordCross } from '@/hooks/useNewWordCross';

export default function Home() {
  const {
    gameState,
    timerState,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    startGame,
    stopGame,
    resetGame
  } = useNewWordCross();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ⛓️ Aztec Word Hunt
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the target blockchain word within 5 minutes! Each successful find earns you 50 points.
            Words can be in any direction - horizontal, vertical, or diagonal!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {/* Game Board - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 flex flex-col items-center w-full space-y-4">
            <GameBoard
              gameState={gameState}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              onCellMouseUp={handleCellMouseUp}
              targetWord={gameState.targetWord}
              timeRemaining={gameState.timeRemaining}
              isTimerRunning={timerState.isRunning}
              gameStatus={gameState.gameStatus}
              onStartGame={startGame}
              onStopGame={stopGame}
              onResetGame={resetGame}
            />
          </div>
          
          {/* Sidebar with Leaderboard */}
          <div className="lg:col-span-1 w-full">
            <Leaderboard
              currentScore={gameState.score}
              roundsPlayed={gameState.roundsPlayed}
              gameStatus={gameState.gameStatus}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
