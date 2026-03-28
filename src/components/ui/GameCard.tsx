import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  View,
} from 'react-native';
import { colors, borderRadius, fontSizes, fontWeights, iconSizes } from '../../theme';

interface GameCardProps {
  icon: string;
  title: string;
  stars: number;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function GameCard({
  icon,
  title,
  stars,
  onPress,
  color = colors.game.count,
  style,
  disabled = false,
}: GameCardProps) {
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

  const renderStars = () => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      starElements.push(
        <Text key={i} style={styles.star}>
          {i <= stars ? '⭐' : '☆'}
        </Text>
      );
    }
    return starElements;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={[styles.card, disabled && styles.disabled]}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.starsContainer}>{renderStars()}</View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: iconSizes.large + 20,
    height: iconSizes.large + 20,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: iconSizes.large,
  },
  title: {
    fontSize: fontSizes.button.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 24,
    marginHorizontal: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
