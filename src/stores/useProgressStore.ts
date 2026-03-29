import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { progressService } from '../services/progressService';
import { useUserStore } from './useUserStore';

export interface NumberProgress {
  number: number;
  mastered: boolean;
  stars: number;
  attempts: number;
  lastAttemptAt: string | null;
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  stars: number;
  completedAt: string | null;
}

interface ProgressState {
  totalStars: number;
  completedLevels: number;
  learnedNumbers: NumberProgress[];
  levelProgress: LevelProgress[];
  isLoaded: boolean;
  addStars: (count: number) => void;
  completeLevel: (levelId: string, stars: number) => void;
  updateNumberProgress: (number: number, mastered: boolean, stars: number) => void;
  getNumberProgress: (number: number) => NumberProgress | undefined;
  getLevelProgress: (levelId: string) => LevelProgress | undefined;
  resetProgress: () => void;
  loadProgress: (childId: string) => Promise<void>;
  saveProgress: (childId: string, gameId: string, level: number, score: number, stars: number, completed: boolean) => Promise<void>;
  hydrateFromDatabase: (childId: string) => Promise<void>;
}

const initialProgressState = {
  totalStars: 0,
  completedLevels: 0,
  learnedNumbers: [] as NumberProgress[],
  levelProgress: [] as LevelProgress[],
  isLoaded: false,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgressState,

      addStars: (count) =>
        set((state) => ({
          totalStars: Math.max(0, state.totalStars + count),
        })),

      completeLevel: (levelId, stars) =>
        set((state) => {
          const existingProgress = state.levelProgress.find(
            (p) => p.levelId === levelId
          );
          const isNewCompletion = !existingProgress?.completed;
          const now = new Date().toISOString();

          return {
            levelProgress: existingProgress
              ? state.levelProgress.map((p) =>
                  p.levelId === levelId
                    ? {
                        ...p,
                        completed: true,
                        stars: p.stars + stars,
                        completedAt: now,
                      }
                    : p
                )
              : [
                  ...state.levelProgress,
                  {
                    levelId,
                    completed: true,
                    stars,
                    completedAt: now,
                  },
                ],
            completedLevels: isNewCompletion
              ? state.completedLevels + 1
              : state.completedLevels,
            totalStars: state.totalStars + stars,
          };
        }),

      updateNumberProgress: (number, mastered, stars) =>
        set((state) => {
          const existingProgress = state.learnedNumbers.find(
            (p) => p.number === number
          );
          const now = new Date().toISOString();

          if (existingProgress) {
            return {
              learnedNumbers: state.learnedNumbers.map((p) =>
                p.number === number
                  ? {
                      ...p,
                      mastered: mastered || p.mastered,
                      stars: Math.max(p.stars, stars),
                      attempts: p.attempts + 1,
                      lastAttemptAt: now,
                    }
                  : p
              ),
            };
          }

          return {
            learnedNumbers: [
              ...state.learnedNumbers,
              {
                number,
                mastered,
                stars,
                attempts: 1,
                lastAttemptAt: now,
              },
            ],
          };
        }),

      getNumberProgress: (number) => {
        return get().learnedNumbers.find((p) => p.number === number);
      },

      getLevelProgress: (levelId) => {
        return get().levelProgress.find((p) => p.levelId === levelId);
      },

      resetProgress: () => set(initialProgressState),

      loadProgress: async (childId: string) => {
        try {
          const progressList = await progressService.getByChildId(childId);
          const completedProgress = progressList.filter(p => p.completed);
          
          const levelProgress = completedProgress.map(p => ({
            levelId: p.gameId,
            completed: p.completed,
            stars: p.stars,
            completedAt: p.updatedAt,
          }));

          const totalStars = await progressService.getTotalStarsByChildId(childId);
          const completedLevels = completedProgress.length;

          set({
            totalStars,
            completedLevels,
            levelProgress,
            learnedNumbers: [],
            isLoaded: true,
          });
        } catch (error) {
          console.error('Failed to load progress:', error);
          set({ isLoaded: true });
        }
      },

      saveProgress: async (childId: string, gameId: string, level: number, score: number, stars: number, completed: boolean) => {
        try {
          await progressService.upsert({
            childId,
            gameId,
            level,
            score,
            stars,
            completed,
          });
        } catch (error) {
          console.error('Failed to save progress:', error);
        }
      },

      hydrateFromDatabase: async (childId: string) => {
        await get().loadProgress(childId);
      },
    }),
    {
      name: 'digital-paradise-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
