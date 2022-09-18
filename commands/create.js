import { v4 as uuid } from 'uuid';
import { AppSymbols } from '../config.js';
import { gamesList, regenerateGamesByIds, sendToClient } from '../server.js';
import { createNewPlayer, createShortGameDetails } from '../utils.js';

export const createGame = (wsClient, watchers) => {
  const newGameInfo = {
    id: uuid(),
    players: {
      [wsClient[AppSymbols.ID]]: createNewPlayer(),
    },
    playerIds: [wsClient[AppSymbols.ID]],
    hostId: wsClient[AppSymbols.ID],
    started: false,
    completeClaimed: false,
    ended: false,
    loserId: null,
  };
  gamesList.push(newGameInfo);

  regenerateGamesByIds();
  console.log(`trying to create game ${newGameInfo.id}`);

  const shortInfos = gamesList.map(game => createShortGameDetails(game));

  watchers.forEach(watcher => {
    sendToClient(watcher, {      
      type: 'gamesList',
      payload: shortInfos,
    });
  });

  sendToClient(wsClient, {
    type: 'gameCreated',
    payload: createShortGameDetails(newGameInfo),
  });
}
