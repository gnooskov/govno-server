export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;
export const MAX_SCORE = 1;
export const CARDS_PER_PLAYER = 4;
export const RANDOM_WORDS_IN_NICKNAME = 2;
export const RANDOM_WORDS_IN_GAME_NAME = 3;
export const CardsEnum = {
  KING: 13,
  QUEEN: 12,
  JOKEY: 11,
  TEN: 10,
  NINE: 9,
  EIGHT: 8,
  SEVEN: 7,
  SIX: 6,
}
export const DECK = Object.values(CardsEnum).reduce((acc, card) => {
  for (let i = 0; i < CARDS_PER_PLAYER; i++) {
    acc.push(card);
  }
  return acc;
}, []);

export const AppSymbols = {
  ID: Symbol('id'),
  NICKNAME: Symbol('nickname'),
};
