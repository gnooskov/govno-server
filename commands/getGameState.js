import { AppSymbols } from "../config.js";
import { gamesByIds, refineSendData } from "../server.js";

export const sendGameState = (clients, game) => {
  const { id, players, playerIds, started, ended, loserId } = game;

  if (!Array.isArray(clients)) {
    clients = [clients];
  }

  const { swaps, scores } = playerIds.reduce((acc, playerId) => {
    const player = players[playerId];
    const { swap, score } = player;
    acc.swaps[playerId] = swap;
    acc.scores[playerId] = score;
    return acc;
  }, { swaps: {}, scores: {} });

  clients.forEach((client) => {
    const player = game.players[client[AppSymbols.ID]];
    client.send(refineSendData({
      type: 'gameState',
      payload: {
        id: id,
        hand: player.hand,
        scores,
        swaps,
        playerIds,
        started,
        ended,
        loserId,
      }
    }));
  })
}

export const getGameState = (player, gameId) => {
  const game = gamesByIds[gameId];

  if (!game || !game.playerIds.includes(player[AppSymbols.ID])) {
    player.send(refineSendData({
      type: 'gameNotFound',
      payload: gameId,
    }));
    return;
  }

  sendGameState(player, game);
};
