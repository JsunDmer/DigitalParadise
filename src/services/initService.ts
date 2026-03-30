import { childService } from './childService';
import { progressService } from './progressService';
import { settingsService } from './settingsService';
import { achievementService } from './achievementService';
import { useUserStore } from '../stores/useUserStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAchievementStore } from '../stores/useAchievementStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_ACTIVE_CHILD_KEY = 'digital-paradise-last-active-child';

export interface InitResult {
  success: boolean;
  hasChildren: boolean;
  currentChildId: string | null;
  error?: string;
}

export const initService = {
  async initialize(): Promise<InitResult> {
    try {
      const lastActiveChildId = await AsyncStorage.getItem(LAST_ACTIVE_CHILD_KEY);
      
      const children = await childService.getAll();
      
      if (children.length === 0) {
        return {
          success: true,
          hasChildren: false,
          currentChildId: null,
        };
      }

      let currentChild = lastActiveChildId
        ? children.find(c => c.id === lastActiveChildId)
        : children[0];

      if (!currentChild) {
        currentChild = children[0];
      }

      await this.loadChildData(currentChild.id);

      useUserStore.getState().setCurrentChild({
        id: currentChild.id,
        name: currentChild.name,
        avatar: currentChild.avatar,
        age: currentChild.birthDate
          ? Math.floor(
              (Date.now() - new Date(currentChild.birthDate).getTime()) /
                (365.25 * 24 * 60 * 60 * 1000)
            )
          : 0,
        createdAt: currentChild.createdAt,
      });

      await AsyncStorage.setItem(LAST_ACTIVE_CHILD_KEY, currentChild.id);

      return {
        success: true,
        hasChildren: true,
        currentChildId: currentChild.id,
      };
    } catch (error) {
      console.error('Initialization failed:', error);
      return {
        success: false,
        hasChildren: false,
        currentChildId: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async loadChildData(childId: string): Promise<void> {
    await Promise.all([
      useProgressStore.getState().loadProgress(childId),
      useSettingsStore.getState().loadSettings(childId),
      useAchievementStore.getState().loadAchievements(childId),
    ]);
  },

  async switchChild(childId: string): Promise<boolean> {
    try {
      const children = await childService.getAll();
      const child = children.find(c => c.id === childId);

      if (!child) {
        return false;
      }

      useProgressStore.getState().resetProgress();
      useSettingsStore.getState().resetSettings();

      await this.loadChildData(childId);

      useUserStore.getState().setCurrentChild({
        id: child.id,
        name: child.name,
        avatar: child.avatar,
        age: child.birthDate
          ? Math.floor(
              (Date.now() - new Date(child.birthDate).getTime()) /
                (365.25 * 24 * 60 * 60 * 1000)
            )
          : 0,
        createdAt: child.createdAt,
      });

      await AsyncStorage.setItem(LAST_ACTIVE_CHILD_KEY, childId);

      return true;
    } catch (error) {
      console.error('Failed to switch child:', error);
      return false;
    }
  },

  async saveAllData(childId: string): Promise<void> {
    try {
      await useSettingsStore.getState().saveSettings(childId);
    } catch (error) {
      console.error('Failed to save all data:', error);
    }
  },

  async saveGameProgress(
    childId: string,
    gameId: string,
    level: number,
    score: number,
    stars: number,
    completed: boolean
  ): Promise<void> {
    try {
      await progressService.upsert({
        childId,
        gameId,
        level,
        score,
        stars,
        completed,
      });

      if (completed) {
        const totalStars = await progressService.getTotalStarsByChildId(childId);
        const completedCount = await progressService.getCompletedCountByChildId(childId);
        
        await useAchievementStore.getState().checkAndUnlockAchievements(childId, {
          totalStars,
          completedLevels: completedCount,
          learnedNumbers: useProgressStore.getState().learnedNumbers.length,
          perfectScores: stars >= 5 ? 1 : 0,
          fastCompletions: 0,
          firstGamesCompleted: completedCount,
        });

        await useProgressStore.getState().loadProgress(childId);
      }
    } catch (error) {
      console.error('Failed to save game progress:', error);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      const children = await childService.getAll();
      
      for (const child of children) {
        await progressService.deleteByChildId(child.id);
        await achievementService.deleteByChildId(child.id);
        await settingsService.deleteByChildId(child.id);
      }

      await childService.deleteAll();

      useUserStore.getState().setCurrentChild(null);
      useProgressStore.getState().resetProgress();
      useSettingsStore.getState().resetSettings();

      await AsyncStorage.multiRemove([
        LAST_ACTIVE_CHILD_KEY,
        'digital-paradise-settings',
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  },
};
