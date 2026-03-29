import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
import { useUserStore, useProgressStore } from '@/stores';
import { achievementService } from '@/services';

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
}

function Badge({ icon, label, unlocked, color }: BadgeProps) {
  return (
    <View style={[styles.badge, unlocked && styles.badgeUnlocked]}>
      <View style={[styles.badgeIconContainer, { backgroundColor: unlocked ? color : colors.locked }]}>
        <Text style={styles.badgeIcon}>{icon}</Text>
      </View>
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
}

function BadgeSection({ title, color, completedLevels }: BadgeSectionProps) {
  const getUnlockedCount = (threshold: number) => {
    return completedLevels >= threshold;
  };

  return (
    <View style={styles.badgeSection}>
      <Text style={styles.badgeSectionTitle}>{title}</Text>
      <View style={styles.badgeGrid}>
        {ACHIEVEMENT_LEVELS.map((level) => (
          <Badge
            key={level.id}
            icon={level.icon}
            label={level.label}
            unlocked={getUnlockedCount(level.threshold)}
            color={color}
          />
        ))}
      </View>
    </View>
  );
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { currentChild } = useUserStore();
  const { totalStars, levelProgress } = useProgressStore();
  const [achievementCount, setAchievementCount] = useState(0);

  useEffect(() => {
    const loadAchievementCount = async () => {
      if (currentChild) {
        const count = await achievementService.getCountByChildId(currentChild.id);
        setAchievementCount(count);
      }
    };
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
            />
          ))}
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
    marginBottom: elementSpacing.small,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  badgeIcon: {
    fontSize: 28,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  lockIcon: {
    fontSize: 16,
  },
});
