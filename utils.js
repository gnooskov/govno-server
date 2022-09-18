export const shuffle = (array) => {
  let currentIndex = array.length
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const randomNumber = (max, min) => {
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
export const createShortGameDetails = (game) => {
  const { id, playerIds, hostId, started, ended } = game;
  return {
    id,
    playerIds,
    hostId,
    started,
    ended,
  };
};

// these details should be used for gameLobby
export const createFullGameDetails = (game) => {
  const { id, playerIds, players, hostId, completeClaimed, started, ended } = game;
  const scores = playerIds.reduce((acc, playerId) => {
    const player = players[playerId];
    acc[playerId] = player.score;
    return acc;
  }, {});

  return {
    id,
    playerIds,
    hostId,
    completeClaimed,
    started,
    ended,
    scores,
  };
};

export const createNewPlayer = () => ({
  completedRound: false,
  score: 0,
  swap: null,
})
