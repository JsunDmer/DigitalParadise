import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, gameItem } from '../../theme/spacing';
import { fontWeights } from '../../theme/typography';

interface NumberBallProps {
  number: number;
  isClicked?: boolean;
  isCorrect?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export default function NumberBall({
  number,
  isClicked = false,
  isCorrect = true,
  onPress,
  disabled = false,
  style,
  testID,
}: NumberBallProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isClicked) {
      if (isCorrect) {
        Animated.parallel([
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
          ]),
          Animated.timing(checkmarkAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
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
    } else {
      Animated.timing(checkmarkAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isClicked, isCorrect, scaleAnim, checkmarkAnim, shakeAnim]);

  const handlePress = () => {
    if (!disabled && onPress && !isClicked) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.92,
          duration: 75,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 75,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onPress();
      });
    }
  };

  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-10, 10],
  });

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      disabled={disabled || isClicked}
      activeOpacity={0.8}
      style={style}
      accessibilityRole="button"
      accessibilityLabel={`数字球${number}`}
      accessibilityHint={isClicked ? '该数字已选择' : '按顺序点击这个数字'}
    >
      <Animated.View
        style={[
          styles.container,
          isClicked && isCorrect && styles.clickedContainer,
          isClicked && !isCorrect && styles.errorContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: shakeInterpolate },
            ],
          },
        ]}
      >
        <Text style={styles.number}>{number}</Text>
        {isClicked && isCorrect && (
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                opacity: checkmarkAnim,
                transform: [
                  {
                    scale: checkmarkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: gameItem.ball,
    height: gameItem.ball,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.game.sequence,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clickedContainer: {
    backgroundColor: colors.success,
  },
  errorContainer: {
    backgroundColor: colors.error,
  },
  number: {
    fontSize: 32,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
