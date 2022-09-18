import { CARDS_PER_PLAYER, DECK } from "./config.js";
import { shuffle } from "./utils.js";

export const swapHands = (game) => {
  const { playerIds, players } = game;
  const playersCount = playerIds.length;

  const nextPlayers = playerIds.reduce((acc, playerId, index) => {
    const nextIndex = (index + 1 === playersCount)
      ? 0
      : index + 1;
    const nextPlayerId = playerIds[nextIndex];
    const nextPlayer = players[nextPlayerId];
    acc[playerId] = {
      id: nextPlayerId,
      swap: nextPlayer.swap,
    };
    return acc;
  }, {});

  const initialHands = playerIds.reduce((acc, playerId) => {
    const player = players[playerId];
    acc[playerId] = [...player.hand]
    return acc;
  }, {});

  const newPlayers = playerIds.reduce((acc, playerId) => {
    const player = players[playerId];
    const { hand, swap } = player;
    const swappedCard = hand[swap];
    const shortNextPlayer = nextPlayers[playerId];
    const { id: nextPlayerId } = shortNextPlayer;
    const fullNextPlayer = players[nextPlayerId];
    const nextNewHand = initialHands[nextPlayerId];
    nextNewHand.splice(
      shortNextPlayer.swap,
      1,
      swappedCard
    );

    acc[nextPlayerId] = {
      ...fullNextPlayer,
      hand: nextNewHand,
      swap: null,
    };
    return acc;
  }, {});

  game.players = newPlayers;
}

export const shuffleHands = (game) => {
  const { playerIds, players } = game;
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
}
