import { useSequenceGameStore } from '../../stores/useSequenceGameStore';

describe('useSequenceGameStore', () => {
  beforeEach(() => {
    useSequenceGameStore.getState().resetGame();
  });

  describe('initGame', () => {
    it('should initialize game with default numbers', () => {
      const store = useSequenceGameStore.getState();
      store.initGame();

      const state = useSequenceGameStore.getState();
      expect(state.numbers).toHaveLength(15);
      expect(state.currentNumber).toBe(1);
      expect(state.totalNumbers).toBe(15);
      expect(state.clickedCount).toBe(0);
      expect(state.isCompleted).toBe(false);
      expect(state.isPlaying).toBe(true);
    });

    it('should initialize game with custom number count', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(10);

      const state = useSequenceGameStore.getState();
      expect(state.numbers).toHaveLength(10);
      expect(state.totalNumbers).toBe(10);
    });

    it('should shuffle numbers randomly', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(10);

      const state = useSequenceGameStore.getState();
      const numbers = state.numbers.map(n => n.number);
      const sortedNumbers = [...numbers].sort((a, b) => a - b);
      
      expect(numbers).not.toEqual(sortedNumbers);
      expect(sortedNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('clickNumber', () => {
    it('should return true for correct number click', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(5);

      const result = store.clickNumber(1);

      expect(result).toBe(true);
      const state = useSequenceGameStore.getState();
      expect(state.currentNumber).toBe(2);
      expect(state.clickedCount).toBe(1);
    });

    it('should return false for incorrect number click', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(5);

      const result = store.clickNumber(3);

      expect(result).toBe(false);
      const state = useSequenceGameStore.getState();
      expect(state.currentNumber).toBe(1);
      expect(state.clickedCount).toBe(1);
    });

    it('should mark clicked number as isClicked', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(5);

      store.clickNumber(1);

      const state = useSequenceGameStore.getState();
      const clickedNumber = state.numbers.find(n => n.number === 1);
      expect(clickedNumber?.isClicked).toBe(true);
    });

    it('should mark correct click as isCorrect', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(5);

      store.clickNumber(1);

      const state = useSequenceGameStore.getState();
      const clickedNumber = state.numbers.find(n => n.number === 1);
      expect(clickedNumber?.isCorrect).toBe(true);
    });

    it('should mark incorrect click as not isCorrect', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(5);

      store.clickNumber(3);

      const state = useSequenceGameStore.getState();
      const clickedNumber = state.numbers.find(n => n.number === 3);
      expect(clickedNumber?.isCorrect).toBe(false);
    });

    it('should not allow clicking same number twice', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(5);

      store.clickNumber(1);
      const result = store.clickNumber(1);

      expect(result).toBe(false);
    });

    it('should complete game when all numbers clicked in order', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(3);

      store.clickNumber(1);
      store.clickNumber(2);
      store.clickNumber(3);

      const state = useSequenceGameStore.getState();
      expect(state.isCompleted).toBe(true);
      expect(state.isPlaying).toBe(false);
    });

    it('should not allow clicks after completion', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(2);

      store.clickNumber(1);
      store.clickNumber(2);

      const result = store.clickNumber(3);

      expect(result).toBe(false);
    });
  });

  describe('getProgress', () => {
    it('should return 0 at start', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(10);

      const progress = store.getProgress();

      expect(progress).toBe(0);
    });

    it('should return correct progress after clicks', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(10);

      store.clickNumber(1);
      store.clickNumber(2);

      const progress = store.getProgress();

      expect(progress).toBe(0.2);
    });

    it('should return 1 when completed', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(3);

      store.clickNumber(1);
      store.clickNumber(2);
      store.clickNumber(3);

      const progress = store.getProgress();

      expect(progress).toBe(1);
    });
  });

  describe('resetGame', () => {
    it('should reset game state', () => {
      const store = useSequenceGameStore.getState();
      store.initGame(5);
      store.clickNumber(1);
      store.clickNumber(2);

      store.resetGame();

      const state = useSequenceGameStore.getState();
      expect(state.currentNumber).toBe(1);
      expect(state.clickedCount).toBe(0);
      expect(state.isCompleted).toBe(false);
      expect(state.isPlaying).toBe(true);
    });
  });
});
