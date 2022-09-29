import { AppSymbols } from '../config.js';
import { swapHands } from '../gameUtils.js';
import { sendGameState } from './getGameState.js';
import { gamesByEngNames } from '../server.js';

export const swapCard = (allClients, movingClient, swap, gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];

  if (!game) {
    return;
  }

  const playerId = movingClient[AppSymbols.ID];

  const { playerIds, players } = game;

  const swapAvailable = players[playerId].swap === null;

  if (!swapAvailable) {
    return;
  }

  const playersCount = playerIds.length;

  game.players[playerId].swap = swap;

  const swapsCount = Object.values(players).reduce((acc, player) => {
    acc += player.swap === null ? 0 : 1;
    return acc;
  }, 0);

  if (swapsCount === playersCount) {
    swapHands(game);
  }

  sendGameState(allClients, movingClient, game);
}
