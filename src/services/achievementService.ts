import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, AchievementCreateInput } from '../types';

const ACHIEVEMENTS_KEY = 'digitalparadise_achievements';

function generateId(): string {
  return `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function getAllAchievements(): Promise<Achievement[]> {
  const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveAllAchievements(achievements: Achievement[]): Promise<void> {
  await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

export const achievementService = {
  async unlock(input: AchievementCreateInput): Promise<Achievement> {
    const existing = await this.getByChildAndAchievementId(input.childId, input.achievementId);
    if (existing) return existing;

    const now = new Date().toISOString();
    const id = generateId();
    
    const achievement: Achievement = {
      id,
      ...input,
      unlockedAt: now,
    };
    
    const achievements = await getAllAchievements();
    achievements.push(achievement);
    await saveAllAchievements(achievements);
    
    return achievement;
  },

  async getById(id: string): Promise<Achievement | null> {
    const achievements = await getAllAchievements();
    return achievements.find(a => a.id === id) || null;
  },

  async getByChildId(childId: string): Promise<Achievement[]> {
    const achievements = await getAllAchievements();
    return achievements
      .filter(a => a.childId === childId)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  },

  async getByChildAndAchievementId(childId: string, achievementId: string): Promise<Achievement | null> {
    const achievements = await getAllAchievements();
    return achievements.find(a => a.childId === childId && a.achievementId === achievementId) || null;
  },

  async getByType(childId: string, type: Achievement['achievementType']): Promise<Achievement[]> {
    const achievements = await getAllAchievements();
    return achievements
      .filter(a => a.childId === childId && a.achievementType === type)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  },

  async isUnlocked(childId: string, achievementId: string): Promise<boolean> {
    const achievement = await this.getByChildAndAchievementId(childId, achievementId);
    return !!achievement;
  },

  async delete(id: string): Promise<boolean> {
    const achievements = await getAllAchievements();
    const filtered = achievements.filter(a => a.id !== id);
    
    if (filtered.length === achievements.length) return false;
    
    await saveAllAchievements(filtered);
    return true;
  },

  async deleteByChildId(childId: string): Promise<number> {
    const achievements = await getAllAchievements();
    const filtered = achievements.filter(a => a.childId !== childId);
    const count = achievements.length - filtered.length;
    
    await saveAllAchievements(filtered);
    return count;
  },

  async getCountByChildId(childId: string): Promise<number> {
    const achievements = await getAllAchievements();
    return achievements.filter(a => a.childId === childId).length;
  },

  async getCountByType(childId: string, type: Achievement['achievementType']): Promise<number> {
    const achievements = await getAllAchievements();
    return achievements.filter(a => a.childId === childId && a.achievementType === type).length;
  },

  async getRecentByChildId(childId: string, limit: number = 10): Promise<Achievement[]> {
    const achievements = await getAllAchievements();
    return achievements
      .filter(a => a.childId === childId)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, limit);
  },
};
