import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../../src/components/layout/Header';
import { StatsCard, SettingSwitch } from '../../src/components/ui';
import { useUserStore } from '../../src/stores/useUserStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useProgressStore } from '../../src/stores/useProgressStore';
import {
  colors,
  borderRadius,
  fontSizes,
  fontWeights,
  iconSizes,
  layout,
  spacing,
} from '../../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentChild } = useUserStore();
  const {
    soundEnabled,
    musicEnabled,
    notificationsEnabled,
    toggleSound,
    toggleMusic,
    toggleNotifications,
  } = useSettingsStore();
  const { totalStars, completedLevels } = useProgressStore();

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  const totalPlayTime = 750;

  const getAgeText = (age: number) => {
    if (age <= 3) return '小班';
    if (age <= 4) return '中班';
    return '大班';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="👤 我的档案"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {currentChild?.avatar ? (
              <Image source={{ uri: currentChild.avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarPlaceholder}>👶</Text>
            )}
          </View>
          <Text style={styles.name}>
            {currentChild?.name || '小朋友'}
          </Text>
          <Text style={styles.age}>
            {currentChild?.age || 5}岁 · {getAgeText(currentChild?.age || 5)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 学习统计</Text>
          <View style={styles.statsContainer}>
            <StatsCard
              icon="⏱️"
              label="总游戏时长"
              value={formatPlayTime(totalPlayTime)}
              color={colors.game.count}
              style={styles.statsCard}
            />
            <StatsCard
              icon="🎯"
              label="完成关卡数"
              value={`${completedLevels}关`}
              color={colors.game.match}
              style={styles.statsCard}
            />
            <StatsCard
              icon="⭐"
              label="获得星星数"
              value={`${totalStars}颗`}
              color={colors.star}
              style={styles.statsCard}
            />
            <StatsCard
              icon="🔥"
              label="连续学习天数"
              value={`${7}天`}
              color={colors.game.sequence}
              style={styles.statsCard}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ 设置</Text>
          <View style={styles.settingsContainer}>
            <SettingSwitch
              icon="🎵"
              label="音效"
              value={soundEnabled}
              onValueChange={toggleSound}
              style={styles.settingItem}
            />
            <SettingSwitch
              icon="🔊"
              label="音乐"
              value={musicEnabled}
              onValueChange={toggleMusic}
              style={styles.settingItem}
            />
            <SettingSwitch
              icon="🔔"
              label="通知"
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              style={styles.settingItem}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    height: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.circle,
  },
  avatarPlaceholder: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  section: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsContainer: {
    gap: spacing.sm,
  },
  statsCard: {
    marginBottom: spacing.sm,
  },
  settingsContainer: {
    gap: spacing.sm,
  },
  settingItem: {
    marginBottom: spacing.sm,
  },
});
