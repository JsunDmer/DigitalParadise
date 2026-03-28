import { create } from 'zustand';
import { achievementService } from '../services/achievementService';
import { Achievement } from '../types';

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'game' | 'learning' | 'social' | 'special';
  requirement: number;
}

export const ACHIEVEMENTS: AchievementData[] = [
  {
    id: 'first_game',
    title: '初次尝试',
    description: '完成第一个游戏',
    icon: '🎮',
    type: 'game',
    requirement: 1,
  },
  {
    id: 'star_collector_10',
    title: '星星收集者',
    description: '收集10颗星星',
    icon: '⭐',
    type: 'game',
    requirement: 10,
  },
  {
    id: 'star_collector_50',
    title: '星星大师',
    description: '收集50颗星星',
    icon: '🌟',
    type: 'game',
    requirement: 50,
  },
  {
    id: 'star_collector_100',
    title: '星星传奇',
    description: '收集100颗星星',
    icon: '💫',
    type: 'game',
    requirement: 100,
  },
  {
    id: 'level_master_5',
    title: '关卡达人',
    description: '完成5个关卡',
    icon: '🏆',
    type: 'game',
    requirement: 5,
  },
  {
    id: 'level_master_20',
    title: '关卡专家',
    description: '完成20个关卡',
    icon: '🎖️',
    type: 'game',
    requirement: 20,
  },
  {
    id: 'number_learner_5',
    title: '数字探索者',
    description: '学习5个数字',
    icon: '🔢',
    type: 'learning',
    requirement: 5,
  },
  {
    id: 'number_learner_10',
    title: '数字达人',
    description: '学习10个数字',
    icon: '📊',
    type: 'learning',
    requirement: 10,
  },
  {
    id: 'perfect_score',
    title: '完美表现',
    description: '获得满分三星',
    icon: '👑',
    type: 'special',
    requirement: 1,
  },
  {
    id: 'speed_demon',
    title: '速度之星',
    description: '在30秒内完成游戏',
    icon: '⚡',
    type: 'special',
    requirement: 1,
  },
];

interface AchievementState {
  unlockedAchievements: Achievement[];
  isLoaded: boolean;
  unlockAchievement: (childId: string, achievementId: string) => Promise<boolean>;
  loadAchievements: (childId: string) => Promise<void>;
  isAchievementUnlocked: (achievementId: string) => boolean;
  getUnlockedCount: () => number;
  getUnlockedByType: (type: Achievement['achievementType']) => Achievement[];
  checkAndUnlockAchievements: (childId: string, stats: {
    totalStars: number;
    completedLevels: number;
    learnedNumbers: number;
    perfectScores: number;
    fastCompletions: number;
  }) => Promise<string[]>;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedAchievements: [],
  isLoaded: false,

  unlockAchievement: async (childId: string, achievementId: string) => {
    const achievementData = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievementData) return false;

    const alreadyUnlocked = get().unlockedAchievements.some(
      a => a.achievementId === achievementId
    );
    if (alreadyUnlocked) return false;

    try {
      const achievement = await achievementService.unlock({
        childId,
        achievementId,
        achievementType: achievementData.type,
        title: achievementData.title,
        description: achievementData.description,
        icon: achievementData.icon,
      });

      set((state) => ({
        unlockedAchievements: [...state.unlockedAchievements, achievement],
      }));

      return true;
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
      return false;
    }
  },

  loadAchievements: async (childId: string) => {
    try {
      const achievements = await achievementService.getByChildId(childId);
      set({
        unlockedAchievements: achievements,
        isLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load achievements:', error);
      set({ isLoaded: true });
    }
  },

  isAchievementUnlocked: (achievementId: string) => {
    return get().unlockedAchievements.some(
      a => a.achievementId === achievementId
    );
  },

  getUnlockedCount: () => {
    return get().unlockedAchievements.length;
  },

  getUnlockedByType: (type: Achievement['achievementType']) => {
    return get().unlockedAchievements.filter(a => a.achievementType === type);
  },

  checkAndUnlockAchievements: async (childId: string, stats) => {
    const newlyUnlocked: string[] = [];
    const state = get();

    const checkAndUnlock = async (achievementId: string, condition: boolean) => {
      if (condition && !state.isAchievementUnlocked(achievementId)) {
        const unlocked = await get().unlockAchievement(childId, achievementId);
        if (unlocked) {
          newlyUnlocked.push(achievementId);
        }
      }
    };

    await checkAndUnlock('star_collector_10', stats.totalStars >= 10);
    await checkAndUnlock('star_collector_50', stats.totalStars >= 50);
    await checkAndUnlock('star_collector_100', stats.totalStars >= 100);
    await checkAndUnlock('level_master_5', stats.completedLevels >= 5);
    await checkAndUnlock('level_master_20', stats.completedLevels >= 20);
    await checkAndUnlock('number_learner_5', stats.learnedNumbers >= 5);
    await checkAndUnlock('number_learner_10', stats.learnedNumbers >= 10);
    await checkAndUnlock('perfect_score', stats.perfectScores >= 1);
    await checkAndUnlock('speed_demon', stats.fastCompletions >= 1);

    return newlyUnlocked;
  },
}));
