import { create } from 'zustand';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed' | 'failed';

export interface GameState {
  currentGameId: string | null;
  status: GameStatus;
  score: number;
  level: number;
  progress: number;
  startTime: number | null;
  endTime: number | null;
}

interface GameActions {
  startGame: (gameId: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (completed: boolean) => void;
  updateScore: (points: number) => void;
  updateProgress: (progress: number) => void;
  nextLevel: () => void;
  resetGame: () => void;
}

interface GameStore extends GameState, GameActions {}

const initialGameState: GameState = {
  currentGameId: null,
  status: 'idle',
  score: 0,
  level: 1,
  progress: 0,
  startTime: null,
  endTime: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,

  startGame: (gameId) =>
    set({
      currentGameId: gameId,
      status: 'playing',
      score: 0,
      level: 1,
      progress: 0,
      startTime: Date.now(),
      endTime: null,
    }),

  pauseGame: () => {
    if (get().status === 'playing') {
      set({ status: 'paused' });
    }
  },

  resumeGame: () => {
    if (get().status === 'paused') {
      set({ status: 'playing' });
    }
  },

  endGame: (completed) =>
    set({
      status: completed ? 'completed' : 'failed',
      endTime: Date.now(),
    }),

  updateScore: (points) =>
    set((state) => ({
      score: Math.max(0, state.score + points),
    })),

  updateProgress: (progress) =>
    set({
      progress: Math.min(100, Math.max(0, progress)),
    }),

  nextLevel: () =>
    set((state) => ({
      level: state.level + 1,
      progress: 0,
    })),

  resetGame: () => set(initialGameState),
}));
