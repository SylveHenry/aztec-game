'use client';

import React from 'react';
import Modal from './Modal';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play Aztec Word Hunt">
      <div className="space-y-6 text-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Objective</h3>
          <p>Find the specific target blockchain word displayed at the top of the game board within the 5-minute time limit!</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🎮 How to Play</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click <strong>&quot;🚀 Start Game&quot;</strong> to begin a new round</li>
            <li>Look at the <strong>target word</strong> displayed at the top of the game board</li>
            <li>Find this specific word hidden in the 10x10 letter grid</li>
            <li>Click and drag to select the target word in any direction</li>
            <li>Words can be horizontal, vertical, or diagonal (including backwards)</li>
            <li>Successfully finding the word earns you <strong>50 points</strong> and starts a new round</li>
            <li>Continue finding target words until the 5-minute timer runs out</li>
          </ol>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">⏰ Time Limit</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Each game session lasts exactly <strong>60 seconds</strong></li>
            <li>The timer starts when you click &quot;Start Game&quot;</li>
            <li>Timer turns orange when under 10 seconds, red when under 5 seconds</li>
            <li>Game ends automatically when time runs out</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Scoring System</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>50 points</strong> for each target word found</li>
            <li>Your score accumulates across multiple rounds within the same game session</li>
            <li>High scores are automatically saved locally</li>
            <li>Try to find as many words as possible before time runs out!</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Strategy Tips</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Focus only on the <strong>target word</strong> shown at the top - ignore other words</li>
            <li>Check all 8 directions: horizontal, vertical, and both diagonals</li>
            <li>Don&apos;t forget words can be spelled backwards</li>
            <li>Work quickly but accurately - you have limited time</li>
            <li>The game board automatically focuses when you start for better visibility</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">⌨️ Controls</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Mouse:</strong> Click and drag to select the target word</li>
            <li><strong>Touch:</strong> Tap and drag on mobile devices</li>
            <li><strong>Start Game:</strong> Begin a new 2-minute game session</li>
            <li><strong>Stop Game:</strong> End the current game early</li>
            <li><strong>Play Again:</strong> Start a fresh game after completion</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>🏛️ Aztec Theme:</strong> This fast-paced word hunt features blockchain, cryptocurrency, and Web3 terminology. 
            Perfect for crypto enthusiasts who want to test their knowledge under pressure!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default InstructionsModal;