# UI 组件库

基于 UI 设计稿实现的基础 UI 组件，专为 3-6 岁幼儿设计。

## 组件列表

### 1. Button - 主按钮组件

**位置**: [src/components/ui/Button.tsx](./Button.tsx)

**特性**:
- ✅ 最小尺寸 120×80px
- ✅ 圆角 24px
- ✅ 珊瑚红渐变背景 (#FF6B6B → #FF8A8A)
- ✅ 28px 加粗白色字体
- ✅ 点击缩放动画 (scale 0.92)
- ✅ 支持禁用状态
- ✅ 三种变体：primary、secondary、outline
- ✅ 三种尺寸：small、medium、large

**使用示例**:
```tsx
<Button
  title="开始游戏"
  onPress={() => console.log('pressed')}
  variant="primary"
  size="medium"
/>
```

**Props**:
- `title`: 按钮文字
- `onPress`: 点击回调
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: 是否禁用
- `style`: 自定义样式
- `textStyle`: 文字样式

---

### 2. GameCard - 游戏卡片组件

**位置**: [src/components/ui/GameCard.tsx](./GameCard.tsx)

**特性**:
- ✅ 宽度 48%（两列布局）
- ✅ 圆角 28px
- ✅ 72px 大图标
- ✅ 28px 加粗标题
- ✅ 24px 星星显示
- ✅ 点击缩放动画
- ✅ 自定义主题色

**使用示例**:
```tsx
<GameCard
  icon="🔢"
  title="数数乐园"
  stars={3}
  onPress={() => console.log('game selected')}
  color={colors.game.count}
/>
```

**Props**:
- `icon`: emoji 图标
- `title`: 游戏标题
- `stars`: 星星数量 (0-5)
- `onPress`: 点击回调
- `color`: 主题色
- `disabled`: 是否禁用
- `style`: 自定义样式

---

### 3. CircleButton - 圆形按钮组件

**位置**: [src/components/ui/CircleButton.tsx](./CircleButton.tsx)

**特性**:
- ✅ 手机尺寸: 56×56px
- ✅ 平板尺寸: 72×72px
- ✅ 圆形设计 (borderRadius: 50%)
- ✅ 手机图标: 28px
- ✅ 平板图标: 36px
- ✅ 白色背景 + 阴影
- ✅ 点击缩放动画
- ✅ 自适应设备尺寸

**使用示例**:
```tsx
<CircleButton
  icon="←"
  onPress={() => navigation.goBack()}
  size="medium"
/>
```

**Props**:
- `icon`: emoji 或文字图标
- `onPress`: 点击回调
- `size`: 'small' | 'medium' | 'large'
- `backgroundColor`: 背景色
- `iconColor`: 图标颜色
- `disabled`: 是否禁用
- `style`: 自定义样式

---

### 4. StatsCard - 统计卡片组件

**位置**: [src/components/ui/StatsCard.tsx](./StatsCard.tsx)

**特性**:
- ✅ 高度 80px
- ✅ 圆角 24px
- ✅ 48px 图标
- ✅ 24px 标签文字
- ✅ 36px 加粗数值
- ✅ 主题色数值显示

**使用示例**:
```tsx
<StatsCard
  icon="⭐"
  label="获得星星"
  value="328颗"
  color={colors.star}
/>
```

**Props**:
- `icon`: emoji 图标
- `label`: 标签文字
- `value`: 数值
- `color`: 数值颜色
- `style`: 自定义样式

---

## 设计规范

所有组件遵循以下设计原则：

### 尺寸规范
- **最小触摸区域**: 80×80px
- **主按钮**: 120×80px
- **游戏卡片**: 宽度 48%，最小高度 200px
- **圆形按钮**: 56px (手机) / 72px (平板)

### 颜色规范
- **主色**: #FF6B6B (珊瑚红)
- **辅助色**: #4ECDC4 (薄荷绿)
- **强调色**: #FFE66D (阳光黄)
- **游戏主题色**: 蓝、橙、绿、紫

### 字体规范
- **标题**: 36-48px, 加粗
- **按钮**: 28px, 加粗
- **正文**: 24px
- **数字**: 48-150px, 加粗

### 动画规范
- **按钮点击**: scale 0.92, 150ms
- **卡片点击**: scale 0.95, spring 动画
- **圆形按钮**: scale 0.9, spring 动画

---

## 主题系统集成

所有组件都使用项目的主题系统：

```tsx
import { colors, borderRadius, fontSizes, fontWeights } from '../../theme';
```

主题系统包含：
- `colors`: 颜色系统
- `borderRadius`: 圆角规范
- `fontSizes`: 字体大小
- `fontWeights`: 字体粗细
- `spacing`: 间距规范
- `iconSizes`: 图标尺寸
- `touchTarget`: 触摸目标尺寸

---

## 使用建议

1. **导入组件**:
```tsx
import { Button, GameCard, CircleButton, StatsCard } from '@/components/ui';
```

2. **组合使用**:
```tsx
<View style={styles.container}>
  <StatsCard icon="⭐" label="星星" value="32" />
  <GameCard icon="🔢" title="数数乐园" stars={3} onPress={handlePress} />
  <Button title="开始" onPress={handleStart} />
</View>
```

3. **响应式设计**:
组件会自动适配手机和平板设备，无需额外配置。

---

## 文件结构

```
src/components/ui/
├── Button.tsx          # 主按钮组件
├── GameCard.tsx        # 游戏卡片组件
├── CircleButton.tsx    # 圆形按钮组件
├── StatsCard.tsx       # 统计卡片组件
├── Example.tsx         # 使用示例
├── README.md           # 组件文档
└── index.ts            # 导出文件
```

---

## 测试

运行类型检查：
```bash
npm run typecheck
```

运行代码检查：
```bash
npm run lint
```

---

## 更新日志

### v1.0.0 (2026-03-26)
- ✅ 实现 Button 组件
- ✅ 实现 GameCard 组件
- ✅ 实现 CircleButton 组件
- ✅ 实现 StatsCard 组件
- ✅ 集成主题系统
- ✅ 添加动画效果
- ✅ 支持响应式设计
