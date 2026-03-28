import { useMatchingGameStore } from '../../stores/useMatchingGameStore';

describe('useMatchingGameStore', () => {
  beforeEach(() => {
    useMatchingGameStore.getState().resetGame();
  });

  describe('initializeGame', () => {
    it('should initialize game with 16 cards (8 pairs)', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      expect(state.cards).toHaveLength(16);
      expect(state.totalPairs).toBe(8);
      expect(state.matchedPairs).toBe(0);
      expect(state.moves).toBe(0);
      expect(state.isLocked).toBe(false);
      expect(state.isCompleted).toBe(false);
    });

    it('should create pairs of numbers 1-8', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      const numbers = state.cards.map(c => c.number);
      const numberCounts = numbers.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      for (let i = 1; i <= 8; i++) {
        expect(numberCounts[i]).toBe(2);
      }
    });

    it('should initialize all cards as not flipped or matched', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      state.cards.forEach(card => {
        expect(card.isFlipped).toBe(false);
        expect(card.isMatched).toBe(false);
        expect(card.isShaking).toBe(false);
      });
    });
  });

  describe('flipCard', () => {
    it('should flip a card', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const cardId = useMatchingGameStore.getState().cards[0].id;
      store.flipCard(cardId);

      const state = useMatchingGameStore.getState();
      const flippedCard = state.cards.find(c => c.id === cardId);
      expect(flippedCard?.isFlipped).toBe(true);
      expect(state.flippedCards).toHaveLength(1);
    });

    it('should not flip already flipped card', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const cardId = useMatchingGameStore.getState().cards[0].id;
      store.flipCard(cardId);
      store.flipCard(cardId);

      const state = useMatchingGameStore.getState();
      expect(state.flippedCards).toHaveLength(1);
    });

    it('should not flip matched card', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      const card1 = state.cards.find(c => c.number === 1)!;
      const card2 = state.cards.filter(c => c.number === 1)[1];

      store.flipCard(card1.id);
      
      jest.useFakeTimers();
      store.flipCard(card2.id);
      jest.runAllTimers();
      jest.useRealTimers();

      const matchedState = useMatchingGameStore.getState();
      expect(matchedState.cards.find(c => c.id === card1.id)?.isMatched).toBe(true);

      store.flipCard(card1.id);
      const finalState = useMatchingGameStore.getState();
      expect(finalState.flippedCards).toHaveLength(0);
    });

    it('should lock when two cards are flipped', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      const card1 = state.cards[0];
      const card2 = state.cards[1];

      store.flipCard(card1.id);
      store.flipCard(card2.id);

      const newState = useMatchingGameStore.getState();
      expect(newState.isLocked).toBe(true);
    });
  });

  describe('checkMatch', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should match two cards with same number', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      const cards1 = state.cards.filter(c => c.number === 1);
      const card1 = cards1[0];
      const card2 = cards1[1];

      store.flipCard(card1.id);
      store.flipCard(card2.id);
      jest.runAllTimers();

      const newState = useMatchingGameStore.getState();
      expect(newState.cards.find(c => c.id === card1.id)?.isMatched).toBe(true);
      expect(newState.cards.find(c => c.id === card2.id)?.isMatched).toBe(true);
      expect(newState.matchedPairs).toBe(1);
    });

    it('should not match cards with different numbers', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      const card1 = state.cards.find(c => c.number === 1)!;
      const card2 = state.cards.find(c => c.number === 2)!;

      store.flipCard(card1.id);
      store.flipCard(card2.id);
      jest.runAllTimers();

      const newState = useMatchingGameStore.getState();
      expect(newState.cards.find(c => c.id === card1.id)?.isMatched).toBe(false);
      expect(newState.cards.find(c => c.id === card2.id)?.isMatched).toBe(false);
      expect(newState.matchedPairs).toBe(0);
    });

    it('should increment moves on each match check', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      const cards1 = state.cards.filter(c => c.number === 1);
      const card1 = cards1[0];
      const card2 = cards1[1];

      store.flipCard(card1.id);
      store.flipCard(card2.id);
      jest.runAllTimers();

      const newState = useMatchingGameStore.getState();
      expect(newState.moves).toBe(1);
    });

    it('should complete game when all pairs matched', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      for (let num = 1; num <= 8; num++) {
        const state = useMatchingGameStore.getState();
        const cards = state.cards.filter(c => c.number === num);
        store.flipCard(cards[0].id);
        store.flipCard(cards[1].id);
        jest.runAllTimers();
      }

      const finalState = useMatchingGameStore.getState();
      expect(finalState.isCompleted).toBe(true);
    });
  });

  describe('resetGame', () => {
    it('should reset all game state', () => {
      const store = useMatchingGameStore.getState();
      store.initializeGame();

      const state = useMatchingGameStore.getState();
      const card1 = state.cards[0];
      store.flipCard(card1.id);

      store.resetGame();

      const newState = useMatchingGameStore.getState();
      expect(newState.flippedCards).toHaveLength(0);
      expect(newState.matchedPairs).toBe(0);
      expect(newState.moves).toBe(0);
      expect(newState.isCompleted).toBe(false);
    });
  });
});
