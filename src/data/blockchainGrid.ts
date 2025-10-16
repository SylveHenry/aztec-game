import { GameData } from '@/types/game';

// Generate a 10x10 grid with blockchain words
export const generateBlockchainGrid = (): GameData => {
  // Create a 10x10 grid filled with random letters
  const grid: string[][] = Array(10).fill(null).map(() => 
    Array(10).fill(null).map(() => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );

  // Word placements with their positions and directions (adjusted for 10x10 grid)
  const wordPlacements = [
    // Horizontal words (left to right)
    { word: "BLOCKCHAIN", row: 0, col: 0, direction: "horizontal" },
    { word: "CRYPTO", row: 1, col: 0, direction: "horizontal" },
    { word: "WALLET", row: 2, col: 0, direction: "horizontal" },
    { word: "MINING", row: 3, col: 0, direction: "horizontal" },
    { word: "STAKING", row: 4, col: 0, direction: "horizontal" },
    { word: "PROTOCOL", row: 5, col: 0, direction: "horizontal" },
    { word: "AZTEC", row: 6, col: 0, direction: "horizontal" },
    { word: "NOIR", row: 7, col: 0, direction: "horizontal" },

    // Vertical words (top to bottom)
    { word: "TOKEN", row: 0, col: 6, direction: "vertical" },
    { word: "LEDGER", row: 0, col: 7, direction: "vertical" },
    { word: "NETWORK", row: 0, col: 8, direction: "vertical" },
    { word: "PRIVACY", row: 0, col: 9, direction: "vertical" },
    { word: "DEFI", row: 6, col: 6, direction: "vertical" },
    { word: "NODE", row: 6, col: 7, direction: "vertical" },
    { word: "HASH", row: 6, col: 8, direction: "vertical" },
    { word: "DATA", row: 6, col: 9, direction: "vertical" },

    // Diagonal words (top-left to bottom-right)
    { word: "SMART", row: 2, col: 2, direction: "diagonal" },
    { word: "LAYER", row: 3, col: 3, direction: "diagonal" },
    { word: "BRIDGE", row: 1, col: 1, direction: "diagonal" },

    // Short words in various directions
    { word: "NFT", row: 8, col: 0, direction: "horizontal" },
    { word: "GAS", row: 9, col: 0, direction: "horizontal" },
    { word: "ICO", row: 8, col: 4, direction: "horizontal" },
    { word: "DAPP", row: 9, col: 4, direction: "horizontal" },

    // More vertical words
    { word: "KEY", row: 2, col: 5, direction: "vertical" },
    { word: "ZERO", row: 3, col: 4, direction: "vertical" },
    { word: "TREE", row: 4, col: 3, direction: "vertical" },
    { word: "NOTE", row: 5, col: 2, direction: "vertical" },
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
        case "diagonal-left":
          targetRow = row + i;
          targetCol = col - i;
          break;
        case "diagonal-left-reverse":
          targetRow = row - i;
          targetCol = col + i;
          break;
      }

      // Check bounds and place letter
      if (targetRow >= 0 && targetRow < 10 && targetCol >= 0 && targetCol < 10) {
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
    title: "Blockchain & Crypto 10x10",
    difficulty: "Hard",
    grid,
    words
  };
};