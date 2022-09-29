import { AppSymbols } from "../config.js";
import { gamesByEngNames, sendToClient } from "../server.js";
import { createShortGameDetails, regenerateNicknames } from "../utils.js";

export const leave = (gameClients, wsClient, gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];
  if (!game) {
    return;
  }

  const isInGame = game.playerIds.includes(wsClient[AppSymbols.ID]);

  const allGameClients = [wsClient, ...gameClients];

  if (isInGame) {
    game.playerIds = game.playerIds.filter(id => id !== wsClient[AppSymbols.ID]);
    regenerateNicknames(allGameClients, game);
  }

  gameClients.forEach(client => {
    if (client[AppSymbols.ID] === wsClient[AppSymbols.ID]) {
      sendToClient(client, {
        type: 'left',
        payload: gameNameEng,
      });
    } else {
      sendToClient(client, {
        type: 'playerLeft',
        payload: {
          gameNameEng,
          playerId: wsClient[AppSymbols.ID],
        },
      });
    }

    sendToClient(client, {
      type: 'gameDetails',
      payload: createShortGameDetails(game, client),
    });
  });
};
