export const TOUCH_TARGET_MIN = 80;
export const BUTTON_MIN_WIDTH = 120;
export const BUTTON_MIN_HEIGHT = 80;
export const GAME_ITEM_MIN = 100;
export const ICON_MIN = 48;

export const ANIMATION = {
  buttonPress: 150,
  itemClick: 200,
  correctFeedback: 300,
  shake: 400,
  bounceIn: 600,
  starBurst: 1000,
  emojiBounce: 1200,
};

export const EASING = {
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'ease-in-out',
  linear: 'linear',
};

export const GAME_CONFIG = {
  count: {
    name: '数数乐园',
    icon: '🔢',
    maxNumber: 10,
    items: ['🍎', '🍊', '🍋', '🍇', '🍓'],
  },
  match: {
    name: '数字配对',
    icon: '🎯',
    gridSize: 4,
    maxPairs: 8,
  },
  sequence: {
    name: '数字接龙',
    icon: '🔗',
    maxNumber: 15,
  },
  addition: {
    name: '趣味加法',
    icon: '➕',
    maxSum: 10,
    optionCount: 6,
  },
};

export const ACHIEVEMENT_TIERS = ['🥉', '🥈', '🥇', '💎', '👑'] as const;

export const STORAGE_KEYS = {
  USER_PROFILE: '@digital_paradise_user_profile',
  GAME_PROGRESS: '@digital_paradise_game_progress',
  ACHIEVEMENTS: '@digital_paradise_achievements',
  SETTINGS: '@digital_paradise_settings',
};

export const BREAKPOINTS = {
  mobile: 430,
  tablet: 768,
};

export const SCREEN_WIDTH = {
  mobile: {
    min: 375,
    max: 430,
  },
  tablet: {
    min: 768,
  },
};
