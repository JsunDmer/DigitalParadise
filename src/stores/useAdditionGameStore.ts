import { create } from 'zustand';

export interface AdditionGameState {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  isCompleted: boolean;
  level: number;
  stars: number;
  itemIcon1: string;
  itemIcon2: string;
  completedCount: number; // 完成次数，每5次算一关
}

interface AdditionGameActions {
  initGame: () => void;
  selectAnswer: (answer: number) => void;
  resetGame: () => void;
  nextLevel: () => void;
  calculateStars: () => number;
}

interface AdditionGameStore extends AdditionGameState, AdditionGameActions {}

const GAME_ITEMS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🌟', '🎈', '🎁', '🧸', '🌈', '🌸', '🍪'];

const generateOptions = (correctAnswer: number): number[] => {
  const options = new Set<number>();
  options.add(correctAnswer);
  
  while (options.size < 6) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const option = correctAnswer + offset * direction;
    if (option > 0 && option <= 20 && option !== correctAnswer) {
      options.add(option);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};

const generateProblem = (level: number): { num1: number; num2: number } => {
  const maxNum = Math.min(5 + level, 10);
  const num1 = Math.floor(Math.random() * maxNum) + 1;
  const num2 = Math.floor(Math.random() * maxNum) + 1;
  return { num1, num2 };
};

const getRandomIcon = (): string => {
  return GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
};

const initialState: AdditionGameState = {
  num1: 3,
  num2: 2,
  correctAnswer: 5,
  options: [3, 5, 7, 2, 6, 4],
  selectedAnswer: null,
  isCorrect: null,
  isCompleted: false,
  level: 1,
  stars: 0,
  itemIcon1: '🍎',
  itemIcon2: '🍊',
  completedCount: 0,
};

export const useAdditionGameStore = create<AdditionGameStore>((set, get) => ({
  ...initialState,

  initGame: () => {
    const state = get();
    const { num1, num2 } = generateProblem(state.level);
    const correctAnswer = num1 + num2;
    const options = generateOptions(correctAnswer);
    
    set({
      num1,
      num2,
      correctAnswer,
      options,
      selectedAnswer: null,
      isCorrect: null,
      isCompleted: false,
      stars: 0,
      itemIcon1: getRandomIcon(),
      itemIcon2: getRandomIcon(),
    });
  },

  selectAnswer: (answer) => {
    const state = get();

    if (state.isCompleted && state.isCorrect) return;

    const isCorrect = answer === state.correctAnswer;

    set({
      selectedAnswer: answer,
      isCorrect,
      isCompleted: isCorrect, // 只有答对了才算完成
      stars: isCorrect ? 5 : 0,
    });
  },

  resetGame: () => {
    const { num1, num2 } = generateProblem(1);
    const correctAnswer = num1 + num2;
    const options = generateOptions(correctAnswer);

    set({
      num1,
      num2,
      correctAnswer,
      options,
      selectedAnswer: null,
      isCorrect: null,
      isCompleted: false,
      level: 1,
      stars: 0,
      itemIcon1: getRandomIcon(),
      itemIcon2: getRandomIcon(),
      completedCount: 0,
    });
  },

  nextLevel: () => {
    const state = get();
    const newCompletedCount = state.completedCount + 1;
    const { num1, num2 } = generateProblem(Math.floor(newCompletedCount / 5) + 1);
    const correctAnswer = num1 + num2;
    const options = generateOptions(correctAnswer);

    set({
      num1,
      num2,
      correctAnswer,
      options,
      selectedAnswer: null,
      isCorrect: null,
      isCompleted: false,
      level: Math.floor(newCompletedCount / 5) + 1, // 每5次算一关
      stars: 0,
      itemIcon1: getRandomIcon(),
      itemIcon2: getRandomIcon(),
      completedCount: newCompletedCount,
    });
  },

  calculateStars: () => {
    const state = get();
    if (state.isCorrect) {
      return 5;
    }
    return 0;
  },
}));
