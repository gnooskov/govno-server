import { v4 as uuid } from 'uuid';
import { AppSymbols } from '../config.js';
import { sendToClient } from '../server.js';
import { generateNickname } from "../gameUtils.js";

export const requestId = (wsClient) => {
  const id = uuid();
  const nickname = generateNickname();

  sendToClient(wsClient, {
    type: 'clientId',
    payload: {
      id,
      nickname,
    },
  });

  wsClient[AppSymbols.ID] = id;
  wsClient[AppSymbols.NICKNAME] = nickname;
}