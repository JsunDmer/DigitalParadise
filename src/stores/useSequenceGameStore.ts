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

  initGame: (totalNumbers = DEFAULT_TOTAL_NUMBERS) => {
    set({
      numbers: generateNumbers(totalNumbers),
      currentNumber: 1,
      totalNumbers,
      clickedCount: 0,
      isCompleted: false,
      isPlaying: true,
    });
  },

  clickNumber: (number: number) => {
    const state = get();
    if (!state.isPlaying || state.isCompleted) {
      return false;
    }

    const numberIndex = state.numbers.findIndex((n) => n.number === number);
    if (numberIndex === -1 || state.numbers[numberIndex].isClicked) {
      return false;
    }

    const isCorrect = number === state.currentNumber;

    set((state) => {
      const newNumbers = [...state.numbers];
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
    set({
      numbers: generateNumbers(state.totalNumbers),
      currentNumber: 1,
      clickedCount: 0,
      isCompleted: false,
      isPlaying: true,
    });
  },

  getProgress: () => {
    const state = get();
    return (state.currentNumber - 1) / state.totalNumbers;
  },
}));
