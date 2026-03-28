import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settingsService } from '../services/settingsService';

interface SettingsState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'zh' | 'en';
  theme: 'light' | 'dark' | 'auto';
  parentalControlsEnabled: boolean;
  screenTimeLimit?: number;
  isLoaded: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleNotifications: () => void;
  toggleVibration: () => void;
  setLanguage: (language: 'zh' | 'en') => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleParentalControls: () => void;
  setScreenTimeLimit: (minutes: number | undefined) => void;
  resetSettings: () => void;
  loadSettings: (childId: string) => Promise<void>;
  saveSettings: (childId: string) => Promise<void>;
}

const defaultSettings = {
  soundEnabled: true,
  musicEnabled: true,
  notificationsEnabled: true,
  vibrationEnabled: true,
  language: 'zh' as const,
  theme: 'auto' as const,
  parentalControlsEnabled: false,
  screenTimeLimit: undefined as number | undefined,
  isLoaded: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleMusic: () =>
        set((state) => ({ musicEnabled: !state.musicEnabled })),

      toggleNotifications: () =>
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        })),

      toggleVibration: () =>
        set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => set({ theme }),

      toggleParentalControls: () =>
        set((state) => ({
          parentalControlsEnabled: !state.parentalControlsEnabled,
        })),

      setScreenTimeLimit: (minutes) => set({ screenTimeLimit: minutes }),

      resetSettings: () => set(defaultSettings),

      loadSettings: async (childId: string) => {
        try {
          const settings = await settingsService.getOrCreate(childId);
          set({
            soundEnabled: settings.soundEnabled,
            musicEnabled: settings.musicEnabled,
            notificationsEnabled: settings.notificationsEnabled,
            language: settings.language as 'zh' | 'en',
            theme: settings.theme,
            parentalControlsEnabled: settings.parentalControlsEnabled,
            screenTimeLimit: settings.screenTimeLimit,
            isLoaded: true,
          });
        } catch (error) {
          console.error('Failed to load settings:', error);
          set({ isLoaded: true });
        }
      },

      saveSettings: async (childId: string) => {
        try {
          const state = get();
          await settingsService.updateByChildId(childId, {
            soundEnabled: state.soundEnabled,
            musicEnabled: state.musicEnabled,
            notificationsEnabled: state.notificationsEnabled,
            language: state.language,
            theme: state.theme,
            parentalControlsEnabled: state.parentalControlsEnabled,
            screenTimeLimit: state.screenTimeLimit,
          });
        } catch (error) {
          console.error('Failed to save settings:', error);
        }
      },
    }),
    {
      name: 'digital-paradise-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        notificationsEnabled: state.notificationsEnabled,
        vibrationEnabled: state.vibrationEnabled,
        language: state.language,
        theme: state.theme,
        parentalControlsEnabled: state.parentalControlsEnabled,
        screenTimeLimit: state.screenTimeLimit,
      }),
    }
  )
);
