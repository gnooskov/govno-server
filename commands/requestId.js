import { v4 as uuid } from 'uuid';
import { AppSymbols } from '../config.js';
import { sendToClient } from '../server.js';

export const requestId = (wsClient) => {
  const newId = uuid();

  sendToClient(wsClient, {
    type: 'clientId',
    payload: newId,
  });

  wsClient[AppSymbols.ID] = newId;
}