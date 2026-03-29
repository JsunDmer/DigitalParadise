import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#9013FE', '#A842FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
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
            <Text style={styles.badgeIcon}>🎖️</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.achievementEntry,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#9013FE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trophyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeIcon: {
    fontSize: 24,
  },
});
