import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  colors,
  layout,
  fontSizes,
  fontWeights,
  iconSizes,
  elementSpacing,
  pageMargin,
} from '@/theme';
import { GameCard, WelcomeCard, AchievementEntry } from '@/components/ui';
import { useUserStore, useProgressStore } from '@/stores';
import { achievementService } from '@/services';

const GAMES = [
  {
    id: 'counting',
    icon: '🔢',
    title: '数数乐园',
    color: colors.game.count,
    route: '/games/counting' as const,
  },
  {
    id: 'matching',
    icon: '🎯',
    title: '数字配对',
    color: colors.game.match,
    route: '/matching-game' as const,
  },
  {
    id: 'sequence',
    icon: '🔗',
    title: '数字接龙',
    color: colors.game.sequence,
    route: '/games/sequence' as const,
  },
  {
    id: 'addition',
    icon: '➕',
    title: '趣味加法',
    color: colors.game.addition,
    route: '/games/addition' as const,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const currentChild = useUserStore((state) => state.currentChild);
  const totalStars = useProgressStore((state) => state.totalStars);
  const completedLevels = useProgressStore((state) => state.completedLevels);
  const learnedNumbers = useProgressStore((state) => state.learnedNumbers);
  const [achievementCount, setAchievementCount] = useState(0);

  useEffect(() => {
    const loadAchievementCount = async () => {
      if (currentChild) {
        try {
          const count = await achievementService.getCountByChildId(currentChild.id);
          setAchievementCount(count);
        } catch (e) {
          console.error('Failed to load achievements:', e);
        }
      }
    };
    loadAchievementCount();
  }, [currentChild]);

  const handleGamePress = (route: string) => {
    router.push(route as any);
  };

  const handleAchievementPress = () => {
    router.push('/achievements' as any);
  };

  const handleAvatarPress = () => {
    router.push('/profile' as any);
  };

  const learnedNumbersCount = learnedNumbers.filter((n) => n.mastered).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🔢</Text>
          <Text style={styles.logoText}>数字乐园</Text>
        </View>
        <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
          <Text style={styles.avatar}>👶</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeCard
          userName={currentChild?.name || '小朋友'}
          stars={totalStars}
          completedLevels={completedLevels}
          learnedNumbers={learnedNumbersCount}
          style={styles.welcomeCard}
        />

        <View style={styles.gamesSection}>
          <Text style={styles.sectionTitle}>🎮 选择游戏</Text>
          <View style={styles.gamesGrid}>
            {GAMES.map((game) => (
              <GameCard
                key={game.id}
                icon={game.icon}
                title={game.title}
                showStars={false}
                color={game.color}
                onPress={() => handleGamePress(game.route)}
                style={styles.gameCard}
              />
            ))}
          </View>
        </View>

        <AchievementEntry
          achievementCount={achievementCount}
          onPress={handleAchievementPress}
          style={styles.achievementEntry}
        />
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
    height: layout.header,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pageMargin.mobile,
    backgroundColor: colors.background,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: iconSizes.large,
    marginRight: 8,
  },
  logoText: {
    fontSize: fontSizes.title.small,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    fontSize: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: pageMargin.mobile,
    paddingBottom: elementSpacing.normal,
  },
  welcomeCard: {
    marginTop: elementSpacing.normal,
  },
  gamesSection: {
    marginTop: elementSpacing.relaxed,
  },
  sectionTitle: {
    fontSize: fontSizes.button.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: elementSpacing.normal,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: elementSpacing.normal,
  },
  gameCard: {
    width: '48%',
  },
  achievementEntry: {
    marginTop: elementSpacing.relaxed,
    marginBottom: elementSpacing.normal,
  },
});
