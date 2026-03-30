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
        'src/stores/useAchievementStore.ts',
        "'first_game'",
        '成就检查必须覆盖 first_game'
      ),
    () =>
      assertIncludes(
        'src/services/initService.ts',
        'perfectScores: stars >= 5 ? 1 : 0',
        '完美分数口径必须与五星一致'
      ),
    () =>
      assertIncludes(
        'app/(tabs)/achievements.tsx',
        'ACHIEVEMENTS.length',
        '成就总数展示必须使用定义总数'
      ),
    () =>
      assertIncludes(
        'src/stores/useMatchingGameStore.ts',
        'getPairsByLevel',
        '配对玩法需具备按关卡提升难度'
      ),
    () =>
      assertIncludes(
        'src/stores/useSequenceGameStore.ts',
        'getTotalNumbersByLevel',
        '接龙玩法需具备按关卡提升难度'
      ),
    () =>
      assertIncludes(
        'src/stores/useCountingGameStore.ts',
        'getTargetRangeByLevel',
        '数数玩法需具备按关卡提升难度'
      ),
    () =>
      assertIncludes(
        'scripts/game-design-regression-checklist.md',
        '目标闭环',
        '必须维护游戏设计回归清单'
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
    console.error('Game design regression check failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log('Game design regression check passed.');
}

run();
