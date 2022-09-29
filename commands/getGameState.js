import { AppSymbols } from "../config.js";
import { gamesByEngNames, refineSendData } from "../server.js";

export const sendGameState = (clients, client, game) => {
  const {
    players,
    playerIds,
    playerNicknames,
    nameEng,
    started,
    ended,
  } = game;

  if (!Array.isArray(clients)) {
    clients = [clients];
  }

  const { swaps, scores } = playerIds.reduce((acc, playerId, index) => {
    const player = players[playerId];
    const { swap, score } = player;
    acc.swaps[index] = swap;
    acc.scores[index] = score;
    return acc;
  }, { swaps: {}, scores: {} });

  clients.forEach((client) => {
    const player = game.players[client[AppSymbols.ID]];
    const myPlayerIndex = playerIds.findIndex(playerId => playerId === client[AppSymbols.ID]);
    client.send(refineSendData({
      type: 'gameState',
      payload: {
        nameEng,
        hand: player.hand,
        scores,
        swaps,
        playerNicknames,
        myPlayerIndex,
        started,
        ended,
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

  sendGameState(player, player, game);
};
