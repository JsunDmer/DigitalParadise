import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Animated } from 'react-native';
import { colors, layout, borderRadius, fontSizes, fontWeights, iconSizes } from '../../theme';

interface AchievementEntryProps {
  achievementCount: number;
  onPress: () => void;
  style?: ViewStyle;
}

export default function AchievementEntry({
  achievementCount,
  onPress,
  style,
}: AchievementEntryProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>成就墙</Text>
            <Text style={styles.subtitle}>已获得 {achievementCount} 个成就徽章</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.badgeIcon}>🌟</Text>
          <Text style={styles.badgeIcon}>🎯</Text>
          <Text style={styles.badgeIcon}>🏅</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.achievementEntry,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trophyIcon: {
    fontSize: iconSizes.large,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.button.medium,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.body.small,
    color: colors.text.secondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: iconSizes.medium,
    marginLeft: 4,
  },
});
