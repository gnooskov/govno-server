import { MAX_PLAYERS } from '../config.js';
import { gamesList, sendToClient } from '../server.js';

export const listGames = (client) => {
  const list = gamesList.reduce((acc, game) => {
    if (game.playerIds >= MAX_PLAYERS) {
      return acc;
    }
    const { id, players, playerIds, hostId, started, ended } = game;
    acc.push({ id, players, playerIds, hostId, started, ended });
    return acc;
  }, []);

  sendToClient(client, {
    type: 'gamesList',
    payload: list,
  });
}
