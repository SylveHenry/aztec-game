'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameBoard from '@/components/GameBoard';
import AuthModal from '@/components/AuthModal';
import { Leaderboard } from '@/components/Leaderboard';
import { User } from '@/types/game';

import { useNewWordCross } from '@/hooks/useNewWordCross';
import { useAuth } from '@/hooks/useAuth';
import { clearAllBrowserStorage } from '@/utils/storageManager';

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const {
    gameState,
    timerState,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    handleCellTouchStart,
    handleCellTouchMove,
    handleCellTouchEnd,
    startGame,
    stopGame,
    resetGame,
    closeFeedback
  } = useNewWordCross();

  const { user, login, logout, requireAuth, updateUserData } = useAuth();

  const handleStartGame = () => {
    if (!requireAuth()) {
      setAuthModalOpen(true);
      return;
    }
    startGame();
  };

  const handleNewGame = () => {
    // Clear all browser storage first
    clearAllBrowserStorage();
    
    // Reset the game state
    resetGame();
    
    // Show the auth modal to require re-authentication
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  const handleAuthenticate = (authenticatedUser: User) => {
    login(authenticatedUser);
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <Navbar onNewGame={handleNewGame} onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ⛓️ Aztec Word Hunt
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the target word within 60 seconds! Each successful find earns you 50 points.
            Words can be in any direction - horizontal, vertical, or diagonal!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-8">
          {/* Game Board - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 flex flex-col items-center w-full space-y-4">
            <GameBoard
              gameState={gameState}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              onCellMouseUp={handleCellMouseUp}
              onCellTouchStart={handleCellTouchStart}
              onCellTouchMove={handleCellTouchMove}
              onCellTouchEnd={handleCellTouchEnd}
              targetWord={gameState.targetWord}
              timeRemaining={gameState.timeRemaining}
              isTimerRunning={timerState.isRunning}
              gameStatus={gameState.gameStatus}
              onStartGame={handleStartGame}
              onStopGame={stopGame}
              onResetGame={handleNewGame}
              onCloseFeedback={closeFeedback}
            />
          </div>
          
          {/* Sidebar with Leaderboard */}
          <div className="lg:col-span-1 w-full">
            <Leaderboard
              currentScore={gameState.score}
              roundsPlayed={gameState.roundsPlayed}
              gameStatus={gameState.gameStatus}
              currentUser={user}
              onUserUpdate={updateUserData}
            />
          </div>
        </div>
      </main>
      
      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthModalClose}
        onAuthenticate={handleAuthenticate}
      />
    </div>
  );
}
