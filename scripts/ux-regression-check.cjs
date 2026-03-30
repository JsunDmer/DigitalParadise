const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), 'utf8');
}

function assertIncludes(filePath, expected, message) {
  const content = read(filePath);
  if (!content.includes(expected)) {
    throw new Error(`${message} -> ${filePath}`);
  }
}

function run() {
  const checks = [
    () =>
      assertIncludes(
        'app/(tabs)/index.tsx',
        'FeedbackStateCard',
        '首页必须接入统一状态反馈组件'
      ),
    () =>
      assertIncludes(
        'app/(tabs)/achievements.tsx',
        'FeedbackStateCard',
        '成就页必须接入统一状态反馈组件'
      ),
    () =>
      assertIncludes(
        'app/_layout.tsx',
        '重试',
        '启动失败场景必须提供重试'
      ),
    () =>
      assertIncludes(
        'app/matching-game.tsx',
        'useWindowDimensions',
        '配对游戏必须使用动态尺寸适配'
      ),
    () =>
      assertIncludes(
        'app/matching-game.tsx',
        'SafeAreaView',
        '配对游戏必须接入安全区'
      ),
    () =>
      assertIncludes(
        'app/(tabs)/_layout.tsx',
        'useSafeAreaInsets',
        'Tab栏必须根据安全区动态适配'
      ),
    () =>
      assertIncludes(
        'app/(tabs)/profile.tsx',
        'KeyboardAvoidingView',
        'Profile编辑弹窗必须支持键盘避让'
      ),
    () =>
      assertIncludes(
        'app/(tabs)/achievements.tsx',
        'flexWrap',
        '成就徽章区必须支持窄屏换行'
      ),
    () =>
      assertIncludes(
        'app/games/addition.tsx',
        'useWindowDimensions',
        '加法页需接入尺寸感知逻辑'
      ),
    () =>
      assertIncludes(
        'src/components/layout/BackButton.tsx',
        'accessibilityLabel',
        '返回按钮必须带无障碍标签'
      ),
    () =>
      assertIncludes(
        'src/components/game/CompletionModal.tsx',
        'accessibilityRole',
        '完成弹窗按钮必须带无障碍属性'
      ),
    () =>
      assertIncludes(
        'src/utils/performance.ts',
        'markPerfStart',
        '必须存在性能埋点工具'
      ),
    () =>
      assertIncludes(
        'scripts/ux-priority-board.json',
        '"p0"',
        '必须维护P0/P1/P2优先级看板'
      ),
    () =>
      assertIncludes(
        'scripts/ui-compat-regression-checklist.md',
        '手机竖屏',
        '必须维护跨设备回归检查清单'
      ),
  ];

  const failures = [];
  for (const check of checks) {
    try {
      check();
    } catch (err) {
      failures.push(err.message);
    }
  }

  if (failures.length > 0) {
    console.error('UX regression check failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log('UX regression check passed.');
}

run();
