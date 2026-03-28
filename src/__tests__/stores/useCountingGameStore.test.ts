import { useCountingGameStore } from '../../stores/useCountingGameStore';

describe('useCountingGameStore', () => {
  beforeEach(() => {
    useCountingGameStore.getState().resetGame();
  });

  describe('initGame', () => {
    it('should initialize game with correct target number', () => {
      const store = useCountingGameStore.getState();
      store.initGame(5);

      const state = useCountingGameStore.getState();
      expect(state.targetNumber).toBe(5);
      expect(state.items).toHaveLength(5);
      expect(state.currentCount).toBe(0);
      expect(state.isCompleted).toBe(false);
    });

    it('should initialize items with correct properties', () => {
      const store = useCountingGameStore.getState();
      store.initGame(3, '🍎');

      const state = useCountingGameStore.getState();
      state.items.forEach((item, index) => {
        expect(item.id).toBe(index);
        expect(item.icon).toBe('🍎');
        expect(item.isClicked).toBe(false);
        expect(item.clickOrder).toBeNull();
      });
    });
  });

  describe('clickItem', () => {
    it('should increment count when clicking unclicked item', () => {
      const store = useCountingGameStore.getState();
      store.initGame(5);

      store.clickItem(0);

      const state = useCountingGameStore.getState();
      expect(state.currentCount).toBe(1);
      expect(state.items[0].isClicked).toBe(true);
      expect(state.items[0].clickOrder).toBe(1);
    });

    it('should not allow clicking same item twice', () => {
      const store = useCountingGameStore.getState();
      store.initGame(5);

      store.clickItem(0);
      store.clickItem(0);

      const state = useCountingGameStore.getState();
      expect(state.currentCount).toBe(1);
    });

    it('should complete game when all items are clicked', () => {
      const store = useCountingGameStore.getState();
      store.initGame(3);

      store.clickItem(0);
      store.clickItem(1);
      store.clickItem(2);

      const state = useCountingGameStore.getState();
      expect(state.isCompleted).toBe(true);
      expect(state.currentCount).toBe(3);
      expect(state.stars).toBe(5);
    });

    it('should not allow clicking after completion', () => {
      const store = useCountingGameStore.getState();
      store.initGame(2);

      store.clickItem(0);
      store.clickItem(1);

      const stateAfterComplete = useCountingGameStore.getState();
      expect(stateAfterComplete.isCompleted).toBe(true);

      store.clickItem(0);
    });
  });

  describe('nextLevel', () => {
    it('should increase level and generate new target', () => {
      const store = useCountingGameStore.getState();
      store.initGame(5);

      const initialLevel = useCountingGameStore.getState().level;
      store.nextLevel();

      const state = useCountingGameStore.getState();
      expect(state.level).toBe(initialLevel + 1);
      expect(state.isCompleted).toBe(false);
      expect(state.currentCount).toBe(0);
    });
  });

  describe('resetGame', () => {
    it('should reset all state', () => {
      const store = useCountingGameStore.getState();
      store.initGame(5);
      store.clickItem(0);
      store.clickItem(1);
      store.nextLevel();

      store.resetGame();

      const state = useCountingGameStore.getState();
      expect(state.level).toBe(1);
      expect(state.currentCount).toBe(0);
      expect(state.isCompleted).toBe(false);
      expect(state.stars).toBe(0);
    });
  });

  describe('calculateStars', () => {
    it('should return 5 stars when all items clicked', () => {
      const store = useCountingGameStore.getState();
      store.initGame(3);

      store.clickItem(0);
      store.clickItem(1);
      store.clickItem(2);

      const state = useCountingGameStore.getState();
      expect(state.stars).toBe(5);
    });
  });
});
