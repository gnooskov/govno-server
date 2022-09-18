import { AppSymbols, CARDS_PER_PLAYER, DECK } from "../config.js";
import { shuffleHands } from "../gameUtils.js";
import { gamesByIds, refineSendData } from "../server.js";
import { shuffle } from "../utils.js";

export const startGame = (allClients, starterClient, gameId) => {
  const game = gamesByIds[gameId];
  if (!game) {
    return;
  }

  const { players, playerIds } = game;

  let starterIsAtTable = false;
  allClients.forEach((client) => {
    if (starterClient[AppSymbols.ID] === client[AppSymbols.ID]) {
      starterIsAtTable = true;
    }
  });

  if (!starterIsAtTable) {
    return;
  }

  /*
  const playersCount = playerIds.length;
  const deckPartCount = playersCount * CARDS_PER_PLAYER;
  const deckCopy = [...DECK];
  const unshuffledDeck = deckCopy.slice(0, deckPartCount);
  const deck = shuffle(unshuffledDeck);

  playerIds.forEach((playerId, index) => {
    const player = players[playerId];
    const indexStart = index * CARDS_PER_PLAYER;
    const deckPart = deck.slice(indexStart, indexStart + CARDS_PER_PLAYER);
    player.hand = deckPart;
  }, {});
  */
  shuffleHands(game);

  game.started = true;

  allClients.forEach((client) => {
    client.send(refineSendData({
      type: 'gameStarted',
      payload: game,
    }))
  });
};
