import AsyncStorage from '@react-native-async-storage/async-storage';

// 使用AsyncStorage替代SQLite，避免兼容性问题
const DB_KEYS = {
  CHILDREN: 'digitalparadise_children',
  GAME_PROGRESS: 'digitalparadise_game_progress',
  ACHIEVEMENTS: 'digitalparadise_achievements',
  SETTINGS: 'digitalparadise_settings',
};

export async function initDatabase() {
  // AsyncStorage不需要初始化，直接返回
  return {
    getAllAsync: async (key: string) => {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    },
    getFirstAsync: async (key: string) => {
      const data = await AsyncStorage.getItem(key);
      const arr = data ? JSON.parse(data) : [];
      return arr[0] || null;
    },
    runAsync: async (key: string, value: any) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return { changes: 1 };
    },
    execAsync: async () => {
      // 不需要执行SQL
    },
    closeAsync: async () => {
      // 不需要关闭
    },
  };
}

export function getDatabase() {
  return {
    getAllAsync: async (key: string) => {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    },
    getFirstAsync: async (key: string) => {
      const data = await AsyncStorage.getItem(key);
      const arr = data ? JSON.parse(data) : [];
      return arr[0] || null;
    },
    runAsync: async (key: string, value: any) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return { changes: 1 };
    },
    execAsync: async () => {},
    closeAsync: async () => {},
  };
}

export async function closeDatabase() {
  // AsyncStorage不需要关闭
}

export { DB_KEYS };
