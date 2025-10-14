import { GameData } from '@/types/game';

// Generate a 15x15 grid with blockchain words
export const generateBlockchainGrid = (): GameData => {
  // Create a 15x15 grid filled with random letters
  const grid: string[][] = Array(15).fill(null).map(() => 
    Array(15).fill(null).map(() => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );

  // Word placements with their positions and directions
  const wordPlacements = [
    // Horizontal words (left to right)
    { word: "BLOCKCHAIN", row: 0, col: 0, direction: "horizontal" },
    { word: "CRYPTOCURRENCY", row: 1, col: 0, direction: "horizontal" },
    { word: "DECENTRALIZED", row: 2, col: 0, direction: "horizontal" },
    { word: "WALLET", row: 3, col: 0, direction: "horizontal" },
    { word: "MINING", row: 4, col: 0, direction: "horizontal" },
    { word: "STAKING", row: 5, col: 0, direction: "horizontal" },
    { word: "PROTOCOL", row: 6, col: 0, direction: "horizontal" },
    { word: "VALIDATOR", row: 7, col: 0, direction: "horizontal" },
    { word: "CONSENSUS", row: 8, col: 0, direction: "horizontal" },
    { word: "CONTRACT", row: 9, col: 0, direction: "horizontal" },
    { word: "EXCHANGE", row: 10, col: 0, direction: "horizontal" },
    { word: "LIQUIDITY", row: 11, col: 0, direction: "horizontal" },
    { word: "WHITEPAPER", row: 12, col: 0, direction: "horizontal" },
    { word: "AZTEC", row: 13, col: 0, direction: "horizontal" },
    { word: "NOIR", row: 14, col: 0, direction: "horizontal" },

    // Vertical words (top to bottom)
    { word: "TOKEN", row: 0, col: 11, direction: "vertical" },
    { word: "LEDGER", row: 0, col: 12, direction: "vertical" },
    { word: "NETWORK", row: 0, col: 13, direction: "vertical" },
    { word: "PRIVACY", row: 0, col: 14, direction: "vertical" },
    { word: "DEFI", row: 8, col: 11, direction: "vertical" },
    { word: "NODE", row: 8, col: 12, direction: "vertical" },
    { word: "HASH", row: 8, col: 13, direction: "vertical" },
    { word: "DATA", row: 8, col: 14, direction: "vertical" },

    // Diagonal words (top-left to bottom-right)
    { word: "SMART", row: 3, col: 7, direction: "diagonal" },
    { word: "LAYER", row: 4, col: 8, direction: "diagonal" },
    { word: "BRIDGE", row: 5, col: 9, direction: "diagonal" },

    // Horizontal words (right to left - reverse)
    { word: "FARMING", row: 1, col: 14, direction: "horizontal-reverse" },
    { word: "STORAGE", row: 2, col: 14, direction: "horizontal-reverse" },
    { word: "AIRDROP", row: 3, col: 14, direction: "horizontal-reverse" },

    // Additional scattered words
    { word: "NFT", row: 6, col: 11, direction: "horizontal" },
    { word: "GAS", row: 7, col: 11, direction: "horizontal" },
    { word: "ICO", row: 9, col: 11, direction: "horizontal" },
    { word: "FOMO", row: 10, col: 11, direction: "horizontal" },
    { word: "DAPP", row: 11, col: 11, direction: "horizontal" },
    { word: "UTXO", row: 12, col: 11, direction: "horizontal" },

    // More vertical words
    { word: "KEY", row: 5, col: 6, direction: "vertical" },
    { word: "ZERO", row: 6, col: 7, direction: "vertical" },
    { word: "TREE", row: 7, col: 8, direction: "vertical" },
    { word: "NOTE", row: 8, col: 9, direction: "vertical" },

    // Short words in various directions
    { word: "FUD", row: 13, col: 6, direction: "horizontal" },
    { word: "RUG", row: 14, col: 6, direction: "horizontal" },
    { word: "PULL", row: 14, col: 10, direction: "horizontal" },
  ];

  // Place words in the grid
  wordPlacements.forEach(({ word, row, col, direction }) => {
    for (let i = 0; i < word.length; i++) {
      let targetRow = row;
      let targetCol = col;

      switch (direction) {
        case "horizontal":
          targetCol = col + i;
          break;
        case "horizontal-reverse":
          targetCol = col - i;
          break;
        case "vertical":
          targetRow = row + i;
          break;
        case "vertical-reverse":
          targetRow = row - i;
          break;
        case "diagonal":
          targetRow = row + i;
          targetCol = col + i;
          break;
        case "diagonal-reverse":
          targetRow = row - i;
          targetCol = col - i;
          break;
      }

      // Check bounds and place letter
      if (targetRow >= 0 && targetRow < 15 && targetCol >= 0 && targetCol < 15) {
        grid[targetRow][targetCol] = word[i];
      }
    }
  });

  // Create word list with found status
  const words = wordPlacements.map(({ word }) => ({
    word,
    found: false
  }));

  return {
    id: 1,
    title: "Blockchain & Crypto 15x15",
    difficulty: "Hard",
    grid,
    words
  };
};