import { GameData } from '@/types/game';
import { generateBlockchainGrid } from './blockchainGrid';

// Generate the blockchain game data
const blockchainGame = generateBlockchainGrid();

export const gameData: GameData[] = [blockchainGame];

export const getCurrentGame = (): GameData => {
  return gameData[0];
};