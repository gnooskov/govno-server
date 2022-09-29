import {gamesByEngNames, gamesByIds, sendToClient} from "../server.js";
import { createShortGameDetails } from "../utils.js";

export const lobbyDetails = (clients, gameIdOrUrl) => {
  const game = gamesByIds[gameIdOrUrl] || gamesByEngNames[gameIdOrUrl];

  if (!Array.isArray(clients)) {
    clients = [clients];
  }

  if (game) {
    clients.forEach((client) => {
      sendToClient(client,{
        type: 'gameDetails',
        payload: createShortGameDetails(game, client),
      });
    });
  } else {
    clients.forEach((client) => {
      sendToClient(client,{
        type: 'gameNotFound',
        payload: gameIdOrUrl,
      });
    });
  }
}