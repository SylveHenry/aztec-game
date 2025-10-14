import { GameData } from '@/types/game';

export const sampleGames: GameData[] = [
  {
    id: 'aztec-1',
    title: 'Aztec Civilization',
    difficulty: 'easy',
    grid: [
      ['T', 'E', 'M', 'P', 'L', 'E', 'X', 'Q'],
      ['A', 'Z', 'T', 'E', 'C', 'S', 'U', 'W'],
      ['G', 'O', 'L', 'D', 'R', 'A', 'N', 'E'],
      ['S', 'U', 'N', 'K', 'I', 'N', 'G', 'R'],
      ['P', 'Y', 'R', 'A', 'M', 'I', 'D', 'T'],
      ['W', 'A', 'R', 'R', 'I', 'O', 'R', 'Y'],
      ['E', 'A', 'G', 'L', 'E', 'M', 'A', 'U'],
      ['J', 'A', 'G', 'U', 'A', 'R', 'S', 'I']
    ],
    words: ['AZTEC', 'TEMPLE', 'GOLD', 'SUN', 'PYRAMID', 'WARRIOR', 'EAGLE', 'JAGUAR']
  },
  {
    id: 'nature-1',
    title: 'Ancient Nature',
    difficulty: 'medium',
    grid: [
      ['F', 'O', 'R', 'E', 'S', 'T', 'M', 'N', 'B'],
      ['L', 'A', 'K', 'E', 'R', 'I', 'V', 'E', 'R'],
      ['O', 'C', 'E', 'A', 'N', 'G', 'H', 'T', 'I'],
      ['W', 'E', 'R', 'M', 'O', 'U', 'N', 'T', 'A'],
      ['E', 'R', 'T', 'Y', 'U', 'I', 'A', 'A', 'I'],
      ['R', 'D', 'F', 'G', 'H', 'J', 'I', 'I', 'N'],
      ['S', 'K', 'Y', 'L', 'P', 'O', 'N', 'N', 'S'],
      ['C', 'L', 'O', 'U', 'D', 'S', 'M', 'Q', 'W'],
      ['V', 'A', 'L', 'L', 'E', 'Y', 'X', 'Z', 'A']
    ],
    words: ['FOREST', 'LAKE', 'RIVER', 'OCEAN', 'MOUNTAIN', 'FLOWERS', 'SKY', 'CLOUDS', 'VALLEY']
  },
  {
    id: 'mythology-1',
    title: 'Aztec Mythology',
    difficulty: 'hard',
    grid: [
      ['Q', 'U', 'E', 'T', 'Z', 'A', 'L', 'C', 'O', 'A', 'T', 'L'],
      ['T', 'E', 'Z', 'C', 'A', 'T', 'L', 'I', 'P', 'O', 'C', 'A'],
      ['H', 'U', 'I', 'T', 'Z', 'I', 'L', 'O', 'P', 'O', 'C', 'H'],
      ['X', 'O', 'C', 'H', 'I', 'Q', 'U', 'E', 'T', 'Z', 'A', 'L'],
      ['T', 'L', 'A', 'L', 'O', 'C', 'M', 'I', 'C', 'T', 'L', 'A'],
      ['C', 'O', 'A', 'T', 'L', 'I', 'C', 'U', 'E', 'R', 'N', 'N'],
      ['H', 'A', 'L', 'C', 'H', 'I', 'U', 'H', 'T', 'E', 'T', 'E'],
      ['I', 'N', 'A', 'M', 'A', 'C', 'A', 'T', 'L', 'Q', 'U', 'O'],
      ['N', 'A', 'M', 'A', 'K', 'A', 'H', 'U', 'A', 'L', 'L', 'I'],
      ['A', 'M', 'P', 'A', 'N', 'T', 'L', 'I', 'X', 'O', 'C', 'H']
    ],
    words: ['QUETZALCOATL', 'TEZCATLIPOCA', 'HUITZILOPOCHTLI', 'XOCHIQUETZAL', 'TLALOC', 'COATLICUE', 'CHALCHIUHTOTOLIN', 'INAMACAT']
  }
];

export const getCurrentGame = (): GameData => {
  return sampleGames[0]; // Default to first game
};