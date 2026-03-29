import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <LinearGradient
        colors={[colors.primary, '#FF8A8A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, style]}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>欢迎回来～</Text>
        </View>
        <Text style={styles.userName}>{userName}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stars}</Text>
            <Text style={styles.statLabel}>星星</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedLevels}</Text>
            <Text style={styles.statLabel}>通关</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{learnedNumbers}/10</Text>
            <Text style={styles.statLabel}>已学数字</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.welcomeCard,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: fontWeights.medium,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  userName: {
    fontSize: 28,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
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
  statValue: {
    fontSize: 28,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
