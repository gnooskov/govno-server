import { AppSymbols } from "../config.js";
import { shuffleHands } from "../gameUtils.js";
import { gamesByEngNames, refineSendData } from "../server.js";

export const startGame = (allClients, starterClient, gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];
  if (!game) {
    return;
  }

  let starterIsAtTable = false;
  allClients.forEach((client) => {
    if (starterClient[AppSymbols.ID] === client[AppSymbols.ID]) {
      starterIsAtTable = true;
    }
  });

  if (!starterIsAtTable) {
    return;
  }

  shuffleHands(game);

  game.started = true;

  allClients.forEach((client) => {
    client.send(refineSendData({
      type: 'gameStarted',
      payload: game,
    }))
  });
};
