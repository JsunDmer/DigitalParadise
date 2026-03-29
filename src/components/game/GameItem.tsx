import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, iconSizes, gameItem } from '../../theme/spacing';

interface GameItemProps {
  icon: string;
  isClicked?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export default function GameItem({
  icon,
  isClicked = false,
  onPress,
  disabled = false,
  style,
  testID,
}: GameItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isClicked) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.88,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
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
      Animated.timing(checkmarkAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isClicked, scaleAnim, checkmarkAnim]);

  const handlePress = () => {
    if (!disabled && onPress) {
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

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      disabled={disabled || isClicked}
      activeOpacity={0.8}
      style={style}
    >
      <Animated.View
        style={[
          styles.container,
          isClicked && styles.clickedContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
        {isClicked && (
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
    width: 72,
    height: 72,
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
  clickedContainer: {
    backgroundColor: colors.success,
  },
  icon: {
    fontSize: 48,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
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
