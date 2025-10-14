'use client';

import React from 'react';
import Modal from './Modal';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play Aztec Word Cross">
      <div className="space-y-6 text-gray-700">
        {/* Objective */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Objective
          </h3>
          <p className="leading-relaxed">
            Find all the hidden words in the ancient Aztec letter grid. Words can be found in any direction: 
            horizontal, vertical, or diagonal (both forwards and backwards).
          </p>
        </section>

        {/* How to Play */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🎮</span>
            How to Play
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-amber-100 text-amber-800 rounded-full text-sm font-bold text-center mr-3 mt-0.5">1</span>
              <p><strong>Click and drag</strong> to select letters in the grid</p>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-amber-100 text-amber-800 rounded-full text-sm font-bold text-center mr-3 mt-0.5">2</span>
              <p><strong>Select in any direction:</strong> horizontal, vertical, or diagonal</p>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-amber-100 text-amber-800 rounded-full text-sm font-bold text-center mr-3 mt-0.5">3</span>
              <p><strong>Words can be spelled forwards or backwards</strong></p>
            </div>
            <div className="flex items-start">
              <span className="inline-block w-6 h-6 bg-amber-100 text-amber-800 rounded-full text-sm font-bold text-center mr-3 mt-0.5">4</span>
              <p><strong>Found words</strong> will be highlighted and marked as complete</p>
            </div>
          </div>
        </section>

        {/* Scoring */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">⭐</span>
            Scoring
          </h3>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="mb-2"><strong>Points per word:</strong> Length of the word × 10</p>
            <p className="text-sm text-gray-600">
              Example: A 5-letter word = 50 points
            </p>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Tips
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>Look for common word patterns and prefixes/suffixes</li>
            <li>Don&apos;t forget to check diagonal directions</li>
            <li>Words can be spelled backwards - check both directions</li>
            <li>Use the word list on the right to track your progress</li>
            <li>Take your time - there&apos;s no time limit!</li>
          </ul>
        </section>

        {/* Controls */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🖱️</span>
            Controls
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><strong>Mouse:</strong> Click and drag to select words</p>
            <p><strong>Keyboard:</strong> Press <kbd className="px-2 py-1 bg-gray-200 rounded text-sm">Escape</kbd> to close this dialog</p>
          </div>
        </section>

        {/* Good Luck */}
        <div className="text-center p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg">
          <p className="text-lg font-semibold text-amber-800">
            🏛️ Good luck exploring the ancient Aztec word mysteries! 🏛️
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default InstructionsModal;