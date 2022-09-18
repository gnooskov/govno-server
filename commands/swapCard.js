import { AppSymbols } from "../config.js";
import { swapHands } from "../gameUtils.js";
import { gamesByIds } from "../server.js";
import { sendGameState } from "./getGameState.js";

export const swapCard = (allClients, movingClient, swap, gameId) => {
  const game = gamesByIds[gameId];

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

  sendGameState(allClients, game);
}
