import { AppSymbols } from '../config.js';
import { gamesList, sendToClient } from '../server.js';
import { regenerateNicknames } from '../utils.js';

export const changeNickname = (client, nickname, allClients) => {
  if (!nickname) {
    return;
  }

  client[AppSymbols.NICKNAME] = nickname;

  gamesList.forEach((game) => {
    if (game.playerIds.includes(client[AppSymbols.ID])) {
      regenerateNicknames(allClients, game);
    }
  });

  sendToClient(client, {
    type: 'nicknameChanged',
    payload: nickname,
  });
}
