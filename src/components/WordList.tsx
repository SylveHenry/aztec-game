'use client';

import React from 'react';
import { WordToFind } from '@/types/game';

interface WordListProps {
  wordsToFind: WordToFind[];
  foundWords: string[];
  score: number;
}

const WordList: React.FC<WordListProps> = ({ wordsToFind, foundWords, score }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Words to Find</h2>
        <div className="flex justify-center items-center space-x-4 text-sm">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
            Found: {foundWords.length}/{wordsToFind.length}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            Score: {score}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {wordsToFind.map((wordData, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              wordData.found
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-medium ${wordData.found ? 'line-through' : ''}`}>
                {wordData.word}
              </span>
              <div className="flex items-center space-x-2">
                {wordData.found && (
                  <span className="text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {wordData.word.length} letters
                </span>
              </div>
            </div>
            
            {wordData.found && (
              <div className="mt-2 text-xs text-green-600">
                Direction: {wordData.direction.replace('-', ' ')}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${(foundWords.length / wordsToFind.length) * 100}%` 
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round((foundWords.length / wordsToFind.length) * 100)}% Complete
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordList;