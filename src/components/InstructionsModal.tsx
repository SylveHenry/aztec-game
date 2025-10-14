'use client';

import React from 'react';
import Modal from './Modal';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play Blockchain Word Cross">
      <div className="space-y-6 text-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Objective</h3>
          <p>Find all the hidden blockchain and cryptocurrency terms in the letter grid!</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🎮 How to Play</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Look at the word list on the right side of the screen</li>
            <li>Find these words hidden in the letter grid</li>
            <li>Click and drag to select a word in any direction</li>
            <li>Words can be found horizontally, vertically, or diagonally</li>
            <li>Words can also be spelled backwards!</li>
            <li>Successfully found words will be highlighted and crossed off the list</li>
          </ol>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Scoring</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Each word found adds to your score</li>
            <li>Longer words give more points</li>
            <li>Find all words to complete the puzzle!</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Tips</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Start with shorter words like &quot;NFT&quot;, &quot;GAS&quot;, or &quot;KEY&quot;</li>
            <li>Look for common blockchain terms like &quot;BITCOIN&quot;, &quot;ETHEREUM&quot;, or &quot;WALLET&quot;</li>
            <li>Don&apos;t forget to check diagonally and backwards</li>
            <li>Use the word list to track your progress</li>
            <li>Take your time - there&apos;s no time limit!</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">⌨️ Controls</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Mouse:</strong> Click and drag to select words</li>
            <li><strong>Touch:</strong> Tap and drag on mobile devices</li>
            <li><strong>New Game:</strong> Click the &quot;New Game&quot; button to restart</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🔗 Theme:</strong> This puzzle features blockchain, cryptocurrency, and Web3 terminology. 
            Perfect for crypto enthusiasts and anyone learning about decentralized technologies!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default InstructionsModal;