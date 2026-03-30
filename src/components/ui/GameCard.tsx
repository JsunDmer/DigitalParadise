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
import { useSound } from '../../hooks';

interface GameCardProps {
  icon: string;
  title: string;
  stars?: number;
  showStars?: boolean;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function GameCard({
  icon,
  title,
  stars = 0,
  showStars = true,
  onPress,
  color = colors.game.count,
  style,
  disabled = false,
}: GameCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { playClick } = useSound();

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

  const handlePress = () => {
    playClick();
    onPress();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={[styles.card, disabled && styles.disabled]}
      >
        <View style={[styles.colorBar, { backgroundColor: color }]} />
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        {showStars && <View style={styles.starsContainer}>{renderStars()}</View>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  colorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  star: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
