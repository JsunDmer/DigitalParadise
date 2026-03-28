import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, SettingsCreateInput, SettingsUpdateInput } from '../types';

const SETTINGS_KEY = 'digitalparadise_settings';

function generateId(): string {
  return `settings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function getAllSettings(): Promise<Settings[]> {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveAllSettings(settings: Settings[]): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const settingsService = {
  async create(input: SettingsCreateInput): Promise<Settings> {
    const now = new Date().toISOString();
    const id = generateId();
    
    const settings: Settings = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    
    const allSettings = await getAllSettings();
    allSettings.push(settings);
    await saveAllSettings(allSettings);
    
    return settings;
  },

  async getById(id: string): Promise<Settings | null> {
    const allSettings = await getAllSettings();
    return allSettings.find(s => s.id === id) || null;
  },

  async getByChildId(childId: string): Promise<Settings | null> {
    const allSettings = await getAllSettings();
    return allSettings.find(s => s.childId === childId) || null;
  },

  async getOrCreate(childId: string): Promise<Settings> {
    const existing = await this.getByChildId(childId);
    if (existing) return existing;
    
    return this.create({
      childId,
      soundEnabled: true,
      musicEnabled: true,
      notificationsEnabled: true,
      language: 'zh',
      theme: 'auto',
      parentalControlsEnabled: false,
    });
  },

  async update(id: string, input: SettingsUpdateInput): Promise<Settings | null> {
    const allSettings = await getAllSettings();
    const index = allSettings.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    const now = new Date().toISOString();
    allSettings[index] = {
      ...allSettings[index],
      ...input,
      updatedAt: now,
    };
    
    await saveAllSettings(allSettings);
    return allSettings[index];
  },

  async updateByChildId(childId: string, input: SettingsUpdateInput): Promise<Settings | null> {
    const existing = await this.getByChildId(childId);
    if (!existing) return null;
    return this.update(existing.id, input);
  },

  async delete(id: string): Promise<boolean> {
    const allSettings = await getAllSettings();
    const filtered = allSettings.filter(s => s.id !== id);
    
    if (filtered.length === allSettings.length) return false;
    
    await saveAllSettings(filtered);
    return true;
  },

  async deleteByChildId(childId: string): Promise<boolean> {
    const allSettings = await getAllSettings();
    const filtered = allSettings.filter(s => s.childId !== childId);
    
    if (filtered.length === allSettings.length) return false;
    
    await saveAllSettings(filtered);
    return true;
  },
};
