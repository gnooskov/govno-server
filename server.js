import ws, { WebSocketServer } from 'ws';

import { createGame } from './commands/create.js';
import { listGames } from './commands/listGames.js';
import { requestId } from './commands/requestId.js';
import { join } from './commands/join.js';
import { lobbyDetails } from './commands/lobbyDetails.js';
import { leave } from './commands/leave.js';
import { sendRules } from './commands/sendRules.js';
import { startGame } from './commands/start.js';
import { getGameState } from './commands/getGameState.js';
import { swapCard } from './commands/swapCard.js';
import { filterClientsWatchingGamesList } from './utils.js';
import { AppSymbols } from './config.js';
import { reportComplete } from './commands/reportComplete.js';
import {changeNickname} from "./commands/changeNickname.js";

const wsServer = new WebSocketServer({ port: 6969 });

export const gamesList = [];
export const regenerateGamesMaps = () => {
  gamesByEngNames = gamesList.reduce((acc, game) => {
    acc[game.nameEng] = game;
    return acc;
  }, {});
};
export let gamesByEngNames = {};

export const refineSendData = (data) => typeof data !== 'string'
  ? JSON.stringify(data)
  : data;

export const sendToClient = (client, payload) => {
  if (client.readyState === ws.OPEN) {
    client.send(refineSendData(payload));
  }
}

const filterGameClients = (gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];
  if (!game) {
    return false;
  }
  const gameClientsMap = game.playerIds.reduce((acc, playerId) => {
    acc[playerId] = true;
    return acc;
  }, {});
  const filteredClients = [];
  wsServer.clients.forEach((client) => {
    if (gameClientsMap[client[AppSymbols.ID]]) {
      filteredClients.push(client);
    }
  });
  return filteredClients;
}

const parseMessage = (wsClient, message) => {
  const { type, payload } = message;

  switch (type) {
    case 'rules':
      sendRules(wsClient);
      break;

    case 'gamesListWatchingStatus':
      wsClient.watchingGamesList = payload;
      break;

    case 'createGame':
      const watchers = filterClientsWatchingGamesList(wsServer.clients);
      createGame(
        wsClient,
        watchers,
        wsServer.clients
      );
      break;

    case 'gamesList':
      listGames(wsClient);
      break;

    case 'requestId':
      requestId(wsClient);
      break;

    case 'myClientId':
      wsClient[AppSymbols.ID] = payload;
      break;

    case 'myNickname':
      wsClient[AppSymbols.NICKNAME] = payload;
      break;

    case 'join':
      join(
        filterGameClients(payload),
        wsClient,
        payload
      );
      break;

    case 'getLobbyDetails':
      lobbyDetails(wsClient, payload);
      break;

    case 'leave':
      leave(
        filterGameClients(payload),
        wsClient,
        payload
      );
      break;

    case 'start':
      startGame(
        filterGameClients(payload),
        wsClient,
        payload
      );
      break;

    case 'getGameState':
      getGameState(wsClient, payload);
      break;

    case 'swapCard':
      swapCard(
        filterGameClients(payload.gameNameEng),
        wsClient,
        payload.swap,
        payload.gameNameEng
      );
      break;

    case 'reportComplete':
      reportComplete(
        filterGameClients(payload.gameNameEng),
        wsClient,
        payload.gameNameEng
      );
      break;

    case 'newNickname':
      changeNickname(
        wsClient,
        payload,
        wsServer.clients
      );
      break;

    default:
      console.warn(`Unknown command: ${type}`);
  }
}

wsServer.on('connection', (wsClient) => {
  wsClient.on('message', (data, isBinary) => {
    const message = isBinary ? data : data.toString();
    const messageObj = JSON.parse(message);

    parseMessage(wsClient, messageObj);
  });
});

// server.listen(port, () => {
//   console.log(`server is listening on port ${port}`);
// });
