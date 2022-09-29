import { AppSymbols } from "./config.js";

export const shuffle = (array) => {
  let currentIndex = array.length
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const randomNumber = (max, min = 0) => {
  return min + Math.round(Math.random() * (max - min));
}

export const filterClientsWatchingGamesList = (clients) => {
  const watchers = [];
  clients.forEach((client) => {
    if (client.watchingGamesList) {
      watchers.push(client);
    }
  })
  return watchers;
}

// these details should be used for gameLobby
export const createShortGameDetails = (game, client) => {
  const { id, name, nameEng, playerNicknames, playerIds, hostId, started, ended } = game;
  const iParticipate = playerIds.includes(client[AppSymbols.ID]);
  const myPlayerIndex = playerIds.findIndex(playerId => playerId === client[AppSymbols.ID]);

  return {
    id,
    name,
    nameEng,
    playerNicknames,
    hostId,
    started,
    ended,
    iParticipate,
    myPlayerIndex,
  };
};

export const createNewPlayer = () => ({
  completedRound: false,
  score: 0,
  swap: null,
});

export const pascalize = (word) => `${word[0].toUpperCase()}${word.slice(1)}`;

export const regenerateNicknames = (allClients, game) => {
  const allClientsByIds = {};
  allClients.forEach((client) => {
    allClientsByIds[client[AppSymbols.ID]] = client;
  }, {});
  const { playerIds } = game;
  const newNicknames = playerIds.reduce((acc, playerId) => {
    const client = allClientsByIds[playerId];
    acc.push(client[AppSymbols.NICKNAME]);
    return acc;
  }, []);
  game.playerNicknames = newNicknames;
};
