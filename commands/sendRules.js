import { CARDS_PER_PLAYER, MAX_PLAYERS, MIN_PLAYERS, MAX_SCORE } from "../config.js";
import { refineSendData } from "../server.js";

export const sendRules = (wsClient) => {
  const rules = {
    minPlayers: MIN_PLAYERS,
    maxPlayers: MAX_PLAYERS,
    maxScore: MAX_SCORE,
    cardsPerPlayer: CARDS_PER_PLAYER,
  };

  wsClient.send(refineSendData({
    type: 'rules',
    payload: rules,
  }))
};
