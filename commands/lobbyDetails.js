import { gamesByIds, refineSendData } from "../server.js";
import { createShortGameDetails } from "../utils.js";

export const lobbyDetails = (clients, gameId) => {
  const game = gamesByIds[gameId];

  if (!Array.isArray(clients)) {
    clients = [clients];
  }

  if (game) {
    clients.forEach((client) => {
      client.send(refineSendData({
        type: 'gameDetails',
        payload: createShortGameDetails(game),
      }));
    });
  } else {
    clients.forEach((client) => {
      client.send(refineSendData({
        type: 'gameNotFound',
        payload: gameId,
      }));
    });
  }
}