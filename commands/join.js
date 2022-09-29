import { AppSymbols } from '../config.js';
import { gamesByEngNames, sendToClient } from '../server.js';
import { createNewPlayer, createShortGameDetails, regenerateNicknames } from '../utils.js';

export const join = (gameClients, wsClient, gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];

  if (!game) {
    return;
  }

  const alreadyInGame = game.playerIds.includes(wsClient[AppSymbols.ID]);

  const allGameClients = [wsClient, ...gameClients];

  if (!alreadyInGame) {
    game.playerIds.push(wsClient[AppSymbols.ID]);
    game.players[wsClient[AppSymbols.ID]] = createNewPlayer();
    regenerateNicknames(allGameClients, game);
  }

  allGameClients.forEach(client => {
    if (client[AppSymbols.ID] === wsClient[AppSymbols.ID]) {
      sendToClient(client, {
        type: 'joined',
        payload: gameNameEng,
      });
    }

    sendToClient(client, {
      type: 'gameDetails',
      payload: createShortGameDetails(game, client),
    });
  });
}