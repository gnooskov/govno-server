import { AppSymbols } from "../config.js";
import { gamesByEngNames, refineSendData } from "../server.js";

export const sendGameState = (clients, game) => {
  const { players, playerIds, nameEng, started, ended, loserId } = game;

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
        nameEng,
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

export const getGameState = (player, gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];

  if (!game || !game.playerIds.includes(player[AppSymbols.ID])) {
    player.send(refineSendData({
      type: 'gameNotFound',
      payload: gameNameEng,
    }));
    return;
  }

  sendGameState(player, game);
};
