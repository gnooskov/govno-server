import { CardsEnum } from '../../config.js';
import { swapHands } from '../../gameUtils.js';

describe('Swap cards', () => {
  it.each([
    [{
      game: {
        playerIds: ['Alice', 'Bob', 'Cindy'],
        players: {
          'Alice': {
            swap: 0,
            hand: [CardsEnum.TEN, CardsEnum.JOKEY, CardsEnum.QUEEN, CardsEnum.KING],
          },
          'Bob': {
            swap: 1,
            hand: [CardsEnum.JOKEY, CardsEnum.QUEEN, CardsEnum.KING, CardsEnum.TEN],
          },
          'Cindy': {
            swap: 2,
            hand: [CardsEnum.QUEEN, CardsEnum.KING, CardsEnum.TEN, CardsEnum.JOKEY]
          },
        },
      },
      expectedGame: {
        playerIds: ['Alice', 'Bob', 'Cindy'],
        players: {
          'Alice': {
            swap: null,
            hand: [CardsEnum.TEN, CardsEnum.JOKEY, CardsEnum.QUEEN, CardsEnum.KING],
          },
          'Bob': {
            swap: null,
            hand: [CardsEnum.JOKEY, CardsEnum.TEN, CardsEnum.KING, CardsEnum.TEN],
          },
          'Cindy': {
            swap: null,
            hand: [CardsEnum.QUEEN, CardsEnum.KING, CardsEnum.QUEEN, CardsEnum.JOKEY],
          },
        },
      },
    }],
    [{
      game: {
        playerIds: ['Alice', 'Bob', 'Cindy', 'Dan'],
        players: {
          'Alice': {
            swap: 0,
            hand: [CardsEnum.JOKEY, CardsEnum.QUEEN, CardsEnum.KING, CardsEnum.KING],
          },
          'Bob': {
            swap: 1,
            hand: [CardsEnum.QUEEN, CardsEnum.JOKEY, CardsEnum.KING, CardsEnum.TEN],
          },
          'Cindy': {
            swap: 0,
            hand: [CardsEnum.TEN, CardsEnum.JOKEY, CardsEnum.JOKEY, CardsEnum.QUEEN],
          },
          'Dan': {
            swap: 2,
            hand: [CardsEnum.QUEEN, CardsEnum.TEN, CardsEnum.KING, CardsEnum.TEN],
          },
        },
      },
      expectedGame: {
        playerIds: ['Alice', 'Bob', 'Cindy', 'Dan'],
        players: {
          'Alice': {
            swap: null,
            hand: [CardsEnum.KING, CardsEnum.QUEEN, CardsEnum.KING, CardsEnum.KING],
          },
          'Bob': {
            swap: null,
            hand: [CardsEnum.QUEEN, CardsEnum.JOKEY, CardsEnum.KING, CardsEnum.TEN],
          },
          'Cindy': {
            swap: null,
            hand: [CardsEnum.JOKEY, CardsEnum.JOKEY, CardsEnum.JOKEY, CardsEnum.QUEEN],
          },
          'Dan': {
            swap: null,
            hand: [CardsEnum.QUEEN, CardsEnum.TEN, CardsEnum.TEN, CardsEnum.TEN],
          },
        },
      },
    }],
    [{
      game: {
        playerIds: ['Alice', 'Bob', 'Cindy', 'Dan', 'Earl'],
        players: {
          'Alice': {
            swap: 0,
            hand: [CardsEnum.TEN, CardsEnum.TEN, CardsEnum.TEN, CardsEnum.JOKEY],
          },
          'Bob': {
            swap: 0,
            hand: [CardsEnum.JOKEY, CardsEnum.JOKEY, CardsEnum.JOKEY, CardsEnum.QUEEN],
          },
          'Cindy': {
            swap: 0,
            hand: [CardsEnum.QUEEN, CardsEnum.QUEEN, CardsEnum.QUEEN, CardsEnum.KING],
          },
          'Dan': {
            swap: 0,
            hand: [CardsEnum.KING, CardsEnum.KING, CardsEnum.KING, CardsEnum.NINE],
          },
          'Earl': {
            swap: 0,
            hand: [CardsEnum.NINE, CardsEnum.NINE, CardsEnum.NINE, CardsEnum.TEN],
          },
        },
      },
      expectedGame: {
        playerIds: ['Alice', 'Bob', 'Cindy', 'Dan', 'Earl'],
        players: {
          'Alice': {
            swap: null,
            hand: [CardsEnum.NINE, CardsEnum.TEN, CardsEnum.TEN, CardsEnum.JOKEY],
          },
          'Bob': {
            swap: null,
            hand: [CardsEnum.TEN, CardsEnum.JOKEY, CardsEnum.JOKEY, CardsEnum.QUEEN],
          },
          'Cindy': {
            swap: null,
            hand: [CardsEnum.JOKEY, CardsEnum.QUEEN, CardsEnum.QUEEN, CardsEnum.KING],
          },
          'Dan': {
            swap: null,
            hand: [CardsEnum.QUEEN, CardsEnum.KING, CardsEnum.KING, CardsEnum.NINE],
          },
          'Earl': {
            swap: null,
            hand: [CardsEnum.KING, CardsEnum.NINE, CardsEnum.NINE, CardsEnum.TEN],
          },
        },
      },
    }],
  ])('Cards are given to the next player', ({ game, expectedGame }) => {
    swapHands(game);
    expect(game).toStrictEqual(expectedGame);
  })
})