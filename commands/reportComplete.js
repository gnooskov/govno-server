import { AppSymbols, MAX_SCORE } from "../config.js";
import { shuffleHands } from "../gameUtils.js";
import { gamesByEngNames, sendToClient} from "../server.js"
import { sendGameState } from "./getGameState.js";

export const reportComplete = (allPlayers, playerClient, gameNameEng) => {
  const game = gamesByEngNames[gameNameEng];

  if (!game) {
    return;
  }

  const { playerIds, players } = game;
  const playerId = playerClient[AppSymbols.ID];
  const player = players[playerId];
  const { hand } = player;

  const firstCard = hand[0];
  const handIsComplete = hand.every(card => card === firstCard);

  if (handIsComplete) {
    game.completeClaimed = true;
    game.players[playerId].completedRound = true;
    const playersFinished = playerIds.reduce((acc, playerId) => {
      const player = players[playerId];
      if (player.completedRound) {
        acc++;
      }
      return acc;
    }, 0);

    // if last player who didn't claim victory remains, he gets anti-score
    if (playersFinished === playerIds.length - 1) {
      const loserPlayerId = playerIds.find(playerId => {
        const player = players[playerId];
        if (!player.completedRound) {
          return true;
        }
      });
      const loserPlayer = players[loserPlayerId];
      loserPlayer.score++;
      let loserClientFound = false;

      const maxScoreAmongPlayers = playerIds.reduce((acc, playerId) => {
        const player = players[playerId];
        if (player.score > acc) {
          acc = player.score;
        }
        return acc;
      }, -1);

      if (maxScoreAmongPlayers < MAX_SCORE) {
        allPlayers.forEach((client) => {
          sendToClient(client, {
            type: 'newRoundStarted',
            payload: {
              gameNameEng: game.nameEng,
            }
          });
          if (loserClientFound) {
            return;
          }
          if (client[AppSymbols.ID] === loserPlayerId) {
            sendToClient(client, {
              type: 'youLostRound',
            })
          }
        });

        shuffleHands(game);
        game.completeClaimed = false;
        playerIds.forEach(playerId => {
          const player = players[playerId];
          player.completedRound = false;
        });
      } else {
        game.ended = true;
        let loserPlayerIndex;
        for (let i = 0; i < playerIds.length; i++) {
          const searchedPlayerId = playerIds[i];
          if (searchedPlayerId === loserPlayerId) {
            loserPlayerIndex = i;
            break;
          }
        }
        sendGameState(allPlayers, playerClient, game);
      }
    }
  } else {
    game.players[playerId].score++;
  }

  sendGameState(allPlayers, playerClient, game);
}