import { useAdditionGameStore } from '../../stores/useAdditionGameStore';

describe('useAdditionGameStore', () => {
  beforeEach(() => {
    useAdditionGameStore.getState().resetGame();
  });

  describe('initGame', () => {
    it('should initialize game with valid numbers', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();

      const state = useAdditionGameStore.getState();
      expect(state.num1).toBeGreaterThan(0);
      expect(state.num2).toBeGreaterThan(0);
      expect(state.correctAnswer).toBe(state.num1 + state.num2);
      expect(state.options).toHaveLength(6);
      expect(state.options).toContain(state.correctAnswer);
      expect(state.selectedAnswer).toBeNull();
      expect(state.isCorrect).toBeNull();
      expect(state.isCompleted).toBe(false);
    });

    it('should generate options within valid range', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();

      const state = useAdditionGameStore.getState();
      state.options.forEach(option => {
        expect(option).toBeGreaterThan(0);
        expect(option).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('selectAnswer', () => {
    it('should mark correct answer properly', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();

      const state = useAdditionGameStore.getState();
      store.selectAnswer(state.correctAnswer);

      const newState = useAdditionGameStore.getState();
      expect(newState.selectedAnswer).toBe(state.correctAnswer);
      expect(newState.isCorrect).toBe(true);
      expect(newState.isCompleted).toBe(true);
      expect(newState.stars).toBe(5);
    });

    it('should mark wrong answer properly', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();

      const state = useAdditionGameStore.getState();
      const wrongAnswer = state.correctAnswer + 1;
      store.selectAnswer(wrongAnswer);

      const newState = useAdditionGameStore.getState();
      expect(newState.selectedAnswer).toBe(wrongAnswer);
      expect(newState.isCorrect).toBe(false);
      expect(newState.isCompleted).toBe(true);
      expect(newState.stars).toBe(0);
    });

    it('should not allow selection after completion', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();

      const state = useAdditionGameStore.getState();
      store.selectAnswer(state.correctAnswer);

      const stateAfterFirstSelect = useAdditionGameStore.getState();
      store.selectAnswer(state.correctAnswer + 1);

      const finalState = useAdditionGameStore.getState();
      expect(finalState.selectedAnswer).toBe(state.correctAnswer);
      expect(finalState.isCorrect).toBe(true);
    });
  });

  describe('nextLevel', () => {
    it('should increase level and generate new problem', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();

      const initialState = useAdditionGameStore.getState();
      const initialLevel = initialState.level;

      store.nextLevel();

      const newState = useAdditionGameStore.getState();
      expect(newState.level).toBe(initialLevel + 1);
      expect(newState.isCompleted).toBe(false);
      expect(newState.selectedAnswer).toBeNull();
    });
  });

  describe('resetGame', () => {
    it('should reset all state to initial values', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();
      store.selectAnswer(useAdditionGameStore.getState().correctAnswer);
      store.nextLevel();

      store.resetGame();

      const state = useAdditionGameStore.getState();
      expect(state.level).toBe(1);
      expect(state.isCompleted).toBe(false);
      expect(state.selectedAnswer).toBeNull();
      expect(state.isCorrect).toBeNull();
      expect(state.stars).toBe(0);
    });
  });

  describe('calculateStars', () => {
    it('should return 5 stars for correct answer', () => {
      const store = useAdditionGameStore.getState();
      store.initGame();
      store.selectAnswer(useAdditionGameStore.getState().correctAnswer);

      const state = useAdditionGameStore.getState();
      expect(state.stars).toBe(5);
    });
  });
});
