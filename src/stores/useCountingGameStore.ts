import { create } from 'zustand';

export interface CountingItem {
  id: number;
  icon: string;
  isClicked: boolean;
  clickOrder: number | null;
}

export interface CountingGameState {
  targetNumber: number;
  items: CountingItem[];
  currentCount: number;
  isCompleted: boolean;
  level: number;
  stars: number;
  completedCount: number; // 完成次数，每5次算一关
}

interface CountingGameActions {
  initGame: (targetNumber: number, itemIcon?: string) => void;
  clickItem: (itemId: number) => void;
  resetGame: () => void;
  nextLevel: () => void;
  calculateStars: () => number;
}

interface CountingGameStore extends CountingGameState, CountingGameActions {}

const generateItems = (count: number, icon: string = '🍎'): CountingItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    icon,
    isClicked: false,
    clickOrder: null,
  }));
};

const getRandomTarget = (min: number = 3, max: number = 10): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initialState: CountingGameState = {
  targetNumber: 5,
  items: generateItems(5),
  currentCount: 0,
  isCompleted: false,
  level: 1,
  stars: 0,
  completedCount: 0,
};

export const useCountingGameStore = create<CountingGameStore>((set, get) => ({
  ...initialState,

  initGame: (targetNumber, itemIcon = '🍎') => {
    set((state) => ({
      targetNumber,
      items: generateItems(targetNumber, itemIcon),
      currentCount: 0,
      isCompleted: false,
      stars: 0,
      // 保留 completedCount 和 level，不要重置
      completedCount: state.completedCount,
      level: state.level,
    }));
  },

  clickItem: (itemId) => {
    const state = get();
    
    if (state.isCompleted) return;
    
    const item = state.items.find((i) => i.id === itemId);
    if (!item || item.isClicked) return;

    const newCount = state.currentCount + 1;
    const newItems = state.items.map((i) =>
      i.id === itemId
        ? { ...i, isClicked: true, clickOrder: newCount }
        : i
    );

    const completed = newCount === state.targetNumber;

    set({
      items: newItems,
      currentCount: newCount,
      isCompleted: completed,
      stars: completed ? 5 : 0,
    });
  },

  resetGame: () => {
    const newTarget = getRandomTarget(3, 10);
    set({
      targetNumber: newTarget,
      items: generateItems(newTarget),
      currentCount: 0,
      isCompleted: false,
      level: 1,
      stars: 0,
      completedCount: 0,
    });
  },

  nextLevel: () => {
    const state = get();
    const newCompletedCount = state.completedCount + 1;
    const newTarget = getRandomTarget(3, 10);
    set({
      targetNumber: newTarget,
      items: generateItems(newTarget),
      currentCount: 0,
      isCompleted: false,
      level: Math.floor(newCompletedCount / 5) + 1, // 每5次算一关
      stars: 0,
      completedCount: newCompletedCount,
    });
  },

  calculateStars: () => {
    const state = get();
    const clickedItems = state.items.filter((i) => i.isClicked);
    if (clickedItems.length !== state.targetNumber) return 0;
    
    return 5;
  },
}));
