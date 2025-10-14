'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GameBoard from '@/components/GameBoard';
import WordList from '@/components/WordList';
import GameControls from '@/components/GameControls';
import { useWordCross } from '@/hooks/useWordCross';
import { getCurrentGame } from '@/data/gameData';

export default function Home() {
  const gameData = getCurrentGame();
  const {
    gameState,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    resetGame,
    isSelecting
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Game Board - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 flex justify-center">
            <GameBoard
              gameState={gameState}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              onCellMouseUp={handleCellMouseUp}
              isSelecting={isSelecting}
            />
          </div>
          
          {/* Sidebar with Word List and Controls */}
          <div className="space-y-6">
            <WordList
              wordsToFind={gameState.wordsToFind}
              foundWords={gameState.foundWords}
              score={gameState.score}
            />
            
            <GameControls
              onResetGame={resetGame}
              gameCompleted={gameState.gameCompleted}
              difficulty={gameData.difficulty}
            />
          </div>
        </div>

        {/* Game Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              About {gameData.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-800">Difficulty</h3>
                <p className="text-gray-600 capitalize">{gameData.difficulty}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-semibold text-gray-800">Words to Find</h3>
                <p className="text-gray-600">{gameData.words.length} words</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-semibold text-gray-800">Current Score</h3>
                <p className="text-gray-600">{gameState.score} points</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
