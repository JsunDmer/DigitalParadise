import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameProgress, GameProgressCreateInput, GameProgressUpdateInput } from '../types';

const PROGRESS_KEY = 'digitalparadise_progress';

function generateId(): string {
  return `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function getAllProgress(): Promise<GameProgress[]> {
  const data = await AsyncStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveAllProgress(progress: GameProgress[]): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export const progressService = {
  async create(input: GameProgressCreateInput): Promise<GameProgress> {
    const now = new Date().toISOString();
    const id = generateId();
    
    const progress: GameProgress = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    
    const allProgress = await getAllProgress();
    allProgress.push(progress);
    await saveAllProgress(allProgress);
    
    return progress;
  },

  async getById(id: string): Promise<GameProgress | null> {
    const allProgress = await getAllProgress();
    return allProgress.find(p => p.id === id) || null;
  },

  async getByChildId(childId: string): Promise<GameProgress[]> {
    const allProgress = await getAllProgress();
    return allProgress
      .filter(p => p.childId === childId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getByChildAndGame(childId: string, gameId: string): Promise<GameProgress | null> {
    const allProgress = await getAllProgress();
    return allProgress.find(p => p.childId === childId && p.gameId === gameId) || null;
  },

  async getByChildGameAndLevel(childId: string, gameId: string, level: number): Promise<GameProgress | null> {
    const allProgress = await getAllProgress();
    return (
      allProgress.find(
        (p) => p.childId === childId && p.gameId === gameId && p.level === level
      ) || null
    );
  },

  async getCompletedByChildId(childId: string): Promise<GameProgress[]> {
    const allProgress = await getAllProgress();
    return allProgress
      .filter(p => p.childId === childId && p.completed)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async update(id: string, input: GameProgressUpdateInput): Promise<GameProgress | null> {
    const allProgress = await getAllProgress();
    const index = allProgress.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    const now = new Date().toISOString();
    allProgress[index] = {
      ...allProgress[index],
      ...input,
      updatedAt: now,
    };
    
    await saveAllProgress(allProgress);
    return allProgress[index];
  },

  async upsert(input: GameProgressCreateInput): Promise<GameProgress> {
    const existing = await this.getByChildGameAndLevel(input.childId, input.gameId, input.level);
    
    if (existing) {
      const updated = await this.update(existing.id, {
        score: Math.max(existing.score, input.score),
        stars: existing.stars + input.stars,
        completed: existing.completed || input.completed,
        data: input.data,
      });
      return updated!;
    }
    
    return this.create(input);
  },

  async delete(id: string): Promise<boolean> {
    const allProgress = await getAllProgress();
    const filtered = allProgress.filter(p => p.id !== id);
    
    if (filtered.length === allProgress.length) return false;
    
    await saveAllProgress(filtered);
    return true;
  },

  async deleteByChildId(childId: string): Promise<number> {
    const allProgress = await getAllProgress();
    const filtered = allProgress.filter(p => p.childId !== childId);
    const count = allProgress.length - filtered.length;
    
    await saveAllProgress(filtered);
    return count;
  },

  async getTotalScoreByChildId(childId: string): Promise<number> {
    const allProgress = await getAllProgress();
    return allProgress
      .filter(p => p.childId === childId)
      .reduce((sum, p) => sum + (p.score || 0), 0);
  },

  async getTotalStarsByChildId(childId: string): Promise<number> {
    const allProgress = await getAllProgress();
    return allProgress
      .filter(p => p.childId === childId)
      .reduce((sum, p) => sum + (p.stars || 0), 0);
  },

  async getCompletedCountByChildId(childId: string): Promise<number> {
    const allProgress = await getAllProgress();
    return allProgress.filter(p => p.childId === childId && p.completed).length;
  },
};
