# 数字乐园

幼儿数学启蒙游戏应用，适合3-6岁儿童。

## 游戏介绍

| 游戏 | 玩法 |
|-----|------|
| 🔢 数数乐园 | 点击物品，数数有多少 |
| 🎯 数字配对 | 翻牌找相同的数字 |
| ➕ 趣味加法 | 计算加法题 |
| ⚖️ 比大小 | 哪边物品更多 |

## 技术栈

- React Native + Expo
- Zustand（状态管理）
- React Native Reanimated（动画）

## 项目结构

```
app/
├── (tabs)/
│   ├── index.tsx      # 首页游戏入口
│   ├── settings.tsx  # 设置页
│   └── _layout.tsx   # Tab导航
├── games/
│   ├── counting.tsx  # 数数游戏
│   ├── compare.tsx   # 比大小游戏
│   └── addition.tsx  # 加法游戏
└── matching-game.tsx  # 配对游戏

src/
├── components/        # 组件
├── stores/           # 状态管理
├── services/        # 服务
├── hooks/           # 自定义Hook
├── theme/           # 主题样式
└── utils/           # 工具函数
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npx expo start

# 构建Android
npx expo run:android
```

## Git工作流

1. 创建功能分支
2. 开发并提交
3. 推送到GitHub触发自动构建
4. 下载APK测试