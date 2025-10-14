'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameBoard from '@/components/GameBoard';
import WordList from '@/components/WordList';
import { useWordCross } from '@/hooks/useWordCross';
import { getCurrentGame } from '@/data/gameData';

export default function Home() {
  const gameData = getCurrentGame();
  const {
    gameState,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    resetGame
  } = useWordCross(gameData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🏛️ Aztec Word Cross
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover hidden words in the ancient letter grid. Click and drag to select words 
            in any direction - horizontal, vertical, or diagonal!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {/* Game Board - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 flex justify-center w-full">
            <GameBoard
              gameState={gameState}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              onCellMouseUp={handleCellMouseUp}
            />
          </div>
          
          {/* Sidebar with Word List */}
          <div className="space-y-6 w-full">
            <WordList
              wordsToFind={gameState.wordsToFind}
              foundWords={gameState.foundWords}
              score={gameState.score}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
