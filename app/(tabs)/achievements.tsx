import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  colors,
  layout,
  borderRadius,
  fontSizes,
  fontWeights,
  iconSizes,
  elementSpacing,
  pageMargin,
  gameItem,
} from '@/theme';
import Header from '@/components/layout/Header';
import { FeedbackStateCard } from '@/components/ui';
import { useUserStore, useProgressStore } from '@/stores';
import { achievementService } from '@/services';
import { markPerfEnd, markPerfStart } from '@/utils';

const ACHIEVEMENT_LEVELS = [
  { id: 'bronze', icon: '🥉', label: '铜牌', threshold: 1 },
  { id: 'silver', icon: '🥈', label: '银牌', threshold: 5 },
  { id: 'gold', icon: '🥇', label: '金牌', threshold: 10 },
  { id: 'diamond', icon: '💎', label: '钻石', threshold: 20 },
  { id: 'crown', icon: '👑', label: '王者', threshold: 30 },
];

const GAME_CATEGORIES = [
  { id: 'counting', title: '数数达人', color: colors.game.count },
  { id: 'matching', title: '配对大师', color: colors.game.match },
  { id: 'sequence', title: '接龙高手', color: colors.game.sequence },
  { id: 'addition', title: '加法小天才', color: colors.game.addition },
];

interface BadgeProps {
  icon: string;
  label: string;
  unlocked: boolean;
  color: string;
  threshold: number;
  completedLevels: number;
}

function Badge({ icon, label, unlocked, color, threshold, completedLevels }: BadgeProps) {
  const remainingLevels = Math.max(0, threshold - completedLevels);

  return (
    <View
      style={[styles.badge, unlocked && styles.badgeUnlocked]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={
        unlocked ? `${label}已解锁` : `${label}未解锁，还差${remainingLevels}关`
      }
    >
      <View style={[styles.badgeIconContainer, { backgroundColor: unlocked ? color : colors.locked }]}>
        <Text style={styles.badgeIcon}>{icon}</Text>
      </View>
      <Text style={styles.badgeLabel}>{label}</Text>
      {!unlocked && <Text style={styles.badgeHint}>还差{remainingLevels}关</Text>}
      {!unlocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </View>
  );
}

interface BadgeSectionProps {
  title: string;
  color: string;
  completedLevels: number;
  compact?: boolean;
}

function BadgeSection({ title, color, completedLevels, compact = false }: BadgeSectionProps) {
  const getUnlockedCount = (threshold: number) => {
    return completedLevels >= threshold;
  };

  return (
    <View style={styles.badgeSection}>
      <Text style={styles.badgeSectionTitle}>{title}</Text>
      <View style={[styles.badgeGrid, compact && styles.badgeGridCompact]}>
        {ACHIEVEMENT_LEVELS.map((level) => (
          <Badge
            key={level.id}
            icon={level.icon}
            label={level.label}
            unlocked={getUnlockedCount(level.threshold)}
            color={color}
            threshold={level.threshold}
            completedLevels={completedLevels}
          />
        ))}
      </View>
    </View>
  );
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompactWidth = width < 390;
  const { currentChild } = useUserStore();
  const { totalStars, levelProgress } = useProgressStore();
  const [achievementCount, setAchievementCount] = useState(0);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [achievementError, setAchievementError] = useState<string | null>(null);

  const loadAchievementCount = async () => {
    const perfStart = markPerfStart('achievement_screen_load_ms');
    if (!currentChild) {
      setAchievementCount(0);
      setIsLoadingAchievements(false);
      setAchievementError(null);
      markPerfEnd('achievement_screen_load_ms', perfStart);
      return;
    }

    setIsLoadingAchievements(true);
    setAchievementError(null);
    try {
      const count = await achievementService.getCountByChildId(currentChild.id);
      setAchievementCount(count);
    } catch (e) {
      console.error('Failed to load achievements:', e);
      setAchievementError('成就数据加载失败，请重试。');
    } finally {
      setIsLoadingAchievements(false);
      markPerfEnd('achievement_screen_load_ms', perfStart);
    }
  };

  useEffect(() => {
    loadAchievementCount();
  }, [currentChild]);

  const getCompletedLevelsByGame = (gameId: string) => {
    const gameLevels = levelProgress.filter(
      (p) => p.levelId.startsWith(gameId) && p.completed
    );
    return gameLevels.length;
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="🏆 成就墙"
        showBack
        onBackPress={handleBackPress}
        style={styles.header}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingAchievements && (
          <FeedbackStateCard
            type="loading"
            title="正在加载成就墙"
            message="马上就好，正在整理你的学习成果。"
            style={styles.feedbackCard}
          />
        )}
        {achievementError && !isLoadingAchievements && (
          <FeedbackStateCard
            type="error"
            title="成就墙加载失败"
            message={achievementError}
            onRetry={loadAchievementCount}
            style={styles.feedbackCard}
          />
        )}
        {!isLoadingAchievements && !achievementError && (
          <>
            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>
                🌟 {currentChild?.name || '小朋友'}的成就墙 🌟
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>已获得</Text>
                  <Text style={styles.statValue}>{achievementCount}/20</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>星星总数</Text>
                  <Text style={styles.statValue}>{totalStars}</Text>
                </View>
              </View>
            </View>

            <View style={styles.badgesContainer}>
              {GAME_CATEGORIES.map((category) => (
                <BadgeSection
                  key={category.id}
                  title={category.title}
                  color={category.color}
                  completedLevels={getCompletedLevelsByGame(category.id)}
                  compact={isCompactWidth}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: pageMargin.mobile,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: pageMargin.mobile,
    paddingBottom: elementSpacing.relaxed,
  },
  feedbackCard: {
    marginTop: elementSpacing.normal,
  },
  statsSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: elementSpacing.normal,
    marginTop: elementSpacing.normal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: fontSizes.button.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: elementSpacing.normal,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: elementSpacing.relaxed,
  },
  statLabel: {
    fontSize: fontSizes.body.large,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: fontSizes.number.small,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.locked,
    marginHorizontal: elementSpacing.normal,
  },
  badgesContainer: {
    marginTop: elementSpacing.normal,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: elementSpacing.normal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeSection: {
    marginBottom: elementSpacing.normal,
  },
  badgeSectionTitle: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: elementSpacing.tight,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: elementSpacing.tight,
  },
  badgeGridCompact: {
    justifyContent: 'space-around',
  },
  badge: {
    width: 64,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  badgeUnlocked: {
    transform: [{ scale: 1 }],
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 6,
  },
  badgeIcon: {
    fontSize: 28,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 16,
  },
  badgeHint: {
    marginTop: 2,
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  lockOverlay: {
    position: 'absolute',
    top: 32,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  lockIcon: {
    fontSize: 16,
  },
});
