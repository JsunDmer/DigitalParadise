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
import { borderRadius } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

interface OptionCardProps {
  number: number;
  isSelected?: boolean;
  isCorrect?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export default function OptionCard({
  number,
  isSelected = false,
  isCorrect = false,
  onPress,
  disabled = false,
  style,
  testID,
}: OptionCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected && !isCorrect) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSelected, isCorrect, shakeAnim]);

  useEffect(() => {
    if (isSelected && isCorrect) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSelected, isCorrect, scaleAnim]);

  const handlePress = () => {
    if (!disabled && onPress) {
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
      ]).start();
      onPress();
    }
  };

  const getCardStyle = () => {
    if (isSelected && isCorrect) {
      return [styles.card, styles.cardCorrect];
    }
    if (isSelected && !isCorrect) {
      return [styles.card, styles.cardWrong];
    }
    return [styles.card];
  };

  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-10, 0, 10],
  });

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={style}
      accessibilityRole="button"
      accessibilityLabel={`答案选项${number}`}
      accessibilityHint="点击选择这个答案"
    >
      <Animated.View
        style={[
          ...getCardStyle(),
          {
            transform: [
              { scale: scaleAnim },
              { translateX: shakeTranslate },
            ],
          },
        ]}
      >
        <Text style={styles.number}>{number}</Text>
        {isSelected && isCorrect && (
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 100,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCorrect: {
    backgroundColor: colors.success,
  },
  cardWrong: {
    backgroundColor: colors.error,
  },
  number: {
    fontSize: 36,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.success,
    fontSize: 16,
    fontWeight: fontWeights.bold,
  },
});
