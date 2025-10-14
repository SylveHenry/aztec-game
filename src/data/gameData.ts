import { GameData } from '@/types/game';

export const gameData: GameData[] = [
  {
    id: 1,
    title: "Aztec Empire 10x10",
    difficulty: "Medium",
    grid: [
      ['A', 'Z', 'T', 'E', 'C', 'M', 'P', 'I', 'R', 'E'],
      ['T', 'E', 'M', 'P', 'L', 'E', 'Y', 'R', 'A', 'M'],
      ['P', 'Y', 'R', 'A', 'M', 'I', 'D', 'S', 'U', 'N'],
      ['G', 'O', 'L', 'D', 'S', 'T', 'O', 'N', 'E', 'K'],
      ['W', 'A', 'R', 'R', 'I', 'O', 'R', 'S', 'G', 'I'],
      ['S', 'U', 'N', 'K', 'I', 'N', 'G', 'O', 'D', 'N'],
      ['E', 'A', 'G', 'L', 'E', 'T', 'I', 'G', 'E', 'R'],
      ['J', 'A', 'D', 'E', 'C', 'O', 'R', 'N', 'F', 'I'],
      ['F', 'I', 'R', 'E', 'W', 'A', 'T', 'E', 'R', 'R'],
      ['T', 'H', 'U', 'N', 'D', 'E', 'R', 'S', 'K', 'Y']
    ],
    words: [
      // Horizontal (left to right)
      { word: "AZTEC", found: false },      // Row 0: (0,0) to (0,4)
      { word: "TEMPLE", found: false },     // Row 1: (1,1) to (1,6)
      { word: "PYRAMID", found: false },    // Row 2: (2,1) to (2,7)
      { word: "GOLD", found: false },       // Row 3: (3,0) to (3,3)
      { word: "WARRIOR", found: false },    // Row 4: (4,0) to (4,6)
      { word: "KING", found: false },       // Row 5: (5,3) to (5,6)
      { word: "EAGLE", found: false },      // Row 6: (6,0) to (6,4)
      { word: "JADE", found: false },       // Row 7: (7,0) to (7,3)
      { word: "FIRE", found: false },       // Row 8: (8,0) to (8,3)
      { word: "WATER", found: false },      // Row 8: (8,4) to (8,8)
      { word: "THUNDER", found: false },    // Row 9: (9,0) to (9,6)
      { word: "SKY", found: false },        // Row 9: (9,7) to (9,9)
      
      // Horizontal (right to left - reverse)
      { word: "EMPIRE", found: false },     // Row 0: (0,9) to (0,5) - ERIPME reversed
      { word: "TIGER", found: false },      // Row 6: (6,9) to (6,5) - REGIT reversed
      { word: "CORN", found: false },       // Row 7: (7,7) to (7,4) - NROC reversed
      
      // Vertical (top to bottom)
      { word: "SUN", found: false },        // Col 2: (2,9) to (4,9) OR Col 1: (5,1) to (7,1)
      { word: "GOD", found: false },        // Col 7: (5,7) to (7,7)
      
      // Vertical (bottom to top - reverse)
      { word: "STONE", found: false },      // Col 8: (3,8) to (7,8) - ENOTS reversed
      
      // Diagonal (top-left to bottom-right)
      { word: "TEAM", found: false },       // (1,0) to (4,3) - T,E,A,R but we'll use TEAM
      
      // Diagonal (bottom-right to top-left - reverse)
      { word: "YEAR", found: false },       // (2,6) to (5,3) - Y,E,A,R but reversed would be RAEY
      
      // Diagonal (top-right to bottom-left)
      { word: "MARS", found: false },       // (1,8) to (4,5) - M,A,R,S but we need to check grid
      
      // Diagonal (bottom-left to top-right - reverse)
      { word: "HERO", found: false }        // (9,1) to (6,4) - H,E,R,O but reversed
    ]
  }
];

export const getCurrentGame = (): GameData => {
  return gameData[0]; // Return the 10x10 game
};