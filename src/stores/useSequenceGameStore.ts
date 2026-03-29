import { create } from 'zustand';

export interface NumberBallState {
  number: number;
  isClicked: boolean;
  isCorrect: boolean;
}

interface SequenceGameState {
  numbers: NumberBallState[];
  currentNumber: number;
  totalNumbers: number;
  clickedCount: number;
  isCompleted: boolean;
  isPlaying: boolean;
  completedCount: number; // 完成次数，每5次算一关
  level: number;
}

interface SequenceGameActions {
  initGame: (totalNumbers?: number) => void;
  clickNumber: (number: number) => boolean;
  resetGame: () => void;
  getProgress: () => number;
}

interface SequenceGameStore extends SequenceGameState, SequenceGameActions {}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateNumbers = (count: number): NumberBallState[] => {
  const numbers = Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    isClicked: false,
    isCorrect: false,
  }));
  return shuffleArray(numbers);
};

const DEFAULT_TOTAL_NUMBERS = 15;

export const useSequenceGameStore = create<SequenceGameStore>((set, get) => ({
  numbers: [],
  currentNumber: 1,
  totalNumbers: DEFAULT_TOTAL_NUMBERS,
  clickedCount: 0,
  isCompleted: false,
  isPlaying: false,
  completedCount: 0,
  level: 1,

  initGame: (totalNumbers = DEFAULT_TOTAL_NUMBERS) => {
    set({
      numbers: generateNumbers(totalNumbers),
      currentNumber: 1,
      totalNumbers,
      clickedCount: 0,
      isCompleted: false,
      isPlaying: true,
      completedCount: 0,
      level: 1,
    });
  },

  clickNumber: (number: number) => {
    const state = get();
    if (!state.isPlaying || state.isCompleted) {
      return false;
    }

    const numberIndex = state.numbers.findIndex((n) => n.number === number);
    if (numberIndex === -1) {
      return false;
    }

    // 如果已经点击过且是正确的，不允许重复点击
    if (state.numbers[numberIndex].isClicked && state.numbers[numberIndex].isCorrect) {
      return false;
    }

    const isCorrect = number === state.currentNumber;

    set((state) => {
      const newNumbers = [...state.numbers];
      
      // 清除之前错误的标记（除了已经正确点击的）
      newNumbers.forEach((n, idx) => {
        if (n.isClicked && !n.isCorrect) {
          newNumbers[idx] = { ...n, isClicked: false, isCorrect: false };
        }
      });
      
      // 设置当前点击的数字
      newNumbers[numberIndex] = {
        ...newNumbers[numberIndex],
        isClicked: true,
        isCorrect,
      };

      const newClickedCount = state.clickedCount + 1;
      const newCurrentNumber = isCorrect ? state.currentNumber + 1 : state.currentNumber;
      const newIsCompleted = isCorrect && newCurrentNumber > state.totalNumbers;

      return {
        numbers: newNumbers,
        currentNumber: newCurrentNumber,
        clickedCount: newClickedCount,
        isCompleted: newIsCompleted,
        isPlaying: !newIsCompleted,
      };
    });

    return isCorrect;
  },

  resetGame: () => {
    const state = get();
    const newCompletedCount = state.completedCount + 1;
    set({
      numbers: generateNumbers(state.totalNumbers),
      currentNumber: 1,
      clickedCount: 0,
      isCompleted: false,
      isPlaying: true,
      completedCount: newCompletedCount,
      level: Math.floor(newCompletedCount / 5) + 1,
    });
  },

  getProgress: () => {
    const state = get();
    return (state.currentNumber - 1) / state.totalNumbers;
  },
}));
