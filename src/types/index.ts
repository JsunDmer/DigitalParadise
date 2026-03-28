export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'audio' | 'image' | 'text';
  url: string;
  thumbnail?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Child {
  id: string;
  name: string;
  avatar?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameProgress {
  id: string;
  childId: string;
  gameId: string;
  level: number;
  score: number;
  stars: number;
  completed: boolean;
  data?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  childId: string;
  achievementId: string;
  achievementType: 'game' | 'learning' | 'social' | 'special';
  title: string;
  description?: string;
  icon?: string;
  unlockedAt: string;
}

export interface Settings {
  id: string;
  childId: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  parentalControlsEnabled: boolean;
  screenTimeLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export type ChildCreateInput = Omit<Child, 'id' | 'createdAt' | 'updatedAt'>;
export type ChildUpdateInput = Partial<Omit<Child, 'id' | 'createdAt' | 'updatedAt'>>;

export type GameProgressCreateInput = Omit<GameProgress, 'id' | 'createdAt' | 'updatedAt'>;
export type GameProgressUpdateInput = Partial<Omit<GameProgress, 'id' | 'childId' | 'gameId' | 'createdAt' | 'updatedAt'>>;

export type AchievementCreateInput = Omit<Achievement, 'id' | 'unlockedAt'>;

export type SettingsCreateInput = Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>;
export type SettingsUpdateInput = Partial<Omit<Settings, 'id' | 'childId' | 'createdAt' | 'updatedAt'>>;
