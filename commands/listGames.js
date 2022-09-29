import { MAX_PLAYERS } from '../config.js';
import { gamesList, sendToClient } from '../server.js';
import { createShortGameDetails } from "../utils.js";

export const listGames = (client) => {
  const list = gamesList.reduce((acc, game) => {
    if (game.playerIds >= MAX_PLAYERS) {
      return acc;
    }
    acc.push(createShortGameDetails(game, client));
    return acc;
  }, []);

  sendToClient(client, {
    type: 'gamesList',
    payload: list,
  });
}
