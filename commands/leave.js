import { AppSymbols } from "../config.js";
import { gamesByIds, sendToClient } from "../server.js";
import { createShortGameDetails } from "../utils.js";

export const leave = (gameClients, wsClient, gameId) => {
  const game = gamesByIds[gameId];
  if (!game) {
    return;
  }

  const isInGame = game.playerIds.includes(wsClient[AppSymbols.ID]);

  if (isInGame) {
    game.playerIds = game.playerIds.filter(id => id !== wsClient[AppSymbols.ID]);
  }

  gameClients.forEach(client => {
    if (client[AppSymbols.ID] === wsClient[AppSymbols.ID]) {
      sendToClient(client, {
        type: 'left',
        payload: gameId,
      });
    } else {
      sendToClient(client, {
        type: 'playerLeft',
        payload: {
          gameId,
          playerId: wsClient[AppSymbols.ID],
        },
      });
    }

    sendToClient(client, {
      type: 'gameDetails',
      payload: createShortGameDetails(game),
    });
  });
};
