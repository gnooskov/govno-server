import { gamesByEngNames, sendToClient } from "../server.js";
import { createShortGameDetails } from "../utils.js";

export const lobbyDetails = (clients, gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];

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
        payload: gameNameEng,
      });
    });
  }
}