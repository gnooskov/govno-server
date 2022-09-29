import { v4 as uuid } from 'uuid';
import { AppSymbols } from '../config.js';
import { gamesList, regenerateGamesMaps, sendToClient } from '../server.js';
import {createNewPlayer, createShortGameDetails, regenerateNicknames} from '../utils.js';
import { generateGameName } from '../gameUtils.js';
import {transliterate} from "transliteration";

export const createGame = (wsClient, watchers, allClients) => {
  const gameName = generateGameName();
  const nameEng = transliterate(gameName);

  const newGameInfo = {
    id: uuid(),
    name: gameName,
    nameEng,
    players: {
      [wsClient[AppSymbols.ID]]: createNewPlayer(),
    },
    playerIds: [wsClient[AppSymbols.ID]],
    playerNicknames: null,
    hostId: wsClient[AppSymbols.ID],
    started: false,
    completeClaimed: false,
    ended: false,
    loserName: null,
  };
  regenerateNicknames(allClients, newGameInfo);
  gamesList.push(newGameInfo);

  regenerateGamesMaps();
  console.log(`trying to create game ${newGameInfo.name}`);

  const shortInfos = gamesList.map(game => createShortGameDetails(game, wsClient));

  watchers.forEach(watcher => {
    sendToClient(watcher, {      
      type: 'gamesList',
      payload: shortInfos,
    });
  });

  sendToClient(wsClient, {
    type: 'gameCreated',
    payload: createShortGameDetails(newGameInfo, wsClient),
  });
}
