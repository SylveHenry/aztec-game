'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🏛️</span>
              Aztec Word Hunt
            </h3>
            <p className="text-gray-300 text-sm">
              Challenge your mind with our ancient-themed word search puzzles. 
              Find hidden words in the grid and unlock the mysteries of the past.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Game Features</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Multiple difficulty levels</li>
              <li>• Beautiful Aztec-themed design</li>
              <li>• Score tracking system</li>
              <li>• Responsive gameplay</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">How to Play</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Find words in the letter grid</li>
              <li>• Click and drag to select words</li>
              <li>• Words can be horizontal, vertical, or diagonal</li>
              <li>• Complete all words to win!</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Aztec Word Hunt. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;