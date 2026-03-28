import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, layout, borderRadius, fontSizes, fontWeights, iconSizes } from '../../theme';

interface WelcomeCardProps {
  userName: string;
  stars: number;
  completedLevels: number;
  learnedNumbers: number;
  style?: ViewStyle;
}

export default function WelcomeCard({
  userName,
  stars,
  completedLevels,
  learnedNumbers,
  style,
}: WelcomeCardProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.welcomeText}>欢迎回来，{userName}！</Text>
        <Text style={styles.emoji}>🌟</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{stars}</Text>
          <Text style={styles.statLabel}>颗星星</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statValue}>{completedLevels}</Text>
          <Text style={styles.statLabel}>次通关</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🔢</Text>
          <Text style={styles.statValue}>{learnedNumbers}</Text>
          <Text style={styles.statLabel}>已学数字</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.welcomeCard,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: iconSizes.medium,
    marginHorizontal: 8,
  },
  welcomeText: {
    fontSize: fontSizes.button.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: iconSizes.medium,
    marginBottom: 4,
  },
  statValue: {
    fontSize: fontSizes.number.small,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: fontSizes.body.small,
    color: colors.text.secondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.text.secondary + '30',
  },
});
