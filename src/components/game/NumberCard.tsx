import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, gameItem } from '../../theme/spacing';
import { fontWeights } from '../../theme/typography';

interface NumberCardProps {
  number: number;
  isClicked?: boolean;
  isMatched?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export default function NumberCard({
  number,
  isClicked = false,
  isMatched = false,
  onPress,
  disabled = false,
  style,
  testID,
}: NumberCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isClicked) {
      Animated.parallel([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.92,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isClicked, flipAnim, scaleAnim]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }, { scale: scaleAnim }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }, { scale: scaleAnim }],
  };

  const handlePress = () => {
    if (!disabled && onPress && !isClicked) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      disabled={disabled || isClicked}
      activeOpacity={0.8}
      style={style}
    >
      <View style={styles.container}>
        <Animated.View
          style={[styles.card, styles.cardFront, frontAnimatedStyle]}
        >
          <Text style={styles.number}>{number}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            isMatched && styles.cardMatched,
            backAnimatedStyle,
          ]}
        >
          <Text style={styles.number}>{number}</Text>
          {isMatched && (
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: gameItem.card.width,
    height: gameItem.card.height,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFront: {
    backgroundColor: colors.surface,
  },
  cardBack: {
    backgroundColor: colors.game.match,
  },
  cardMatched: {
    backgroundColor: colors.success,
  },
  number: {
    fontSize: 48,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
