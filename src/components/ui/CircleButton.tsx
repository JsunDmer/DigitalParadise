import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { colors } from '../../theme';
import { useDimensions } from '../../hooks/useDimensions';

interface CircleButtonProps {
  icon: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  iconColor?: string;
}

export default function CircleButton({
  icon,
  onPress,
  style,
  disabled = false,
  size = 'medium',
  backgroundColor = colors.surface,
  iconColor = colors.text.primary,
}: CircleButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { isTablet } = useDimensions();

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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

  const getSize = (): number => {
    if (isTablet) {
      switch (size) {
        case 'small':
          return 64;
        case 'large':
          return 80;
        default:
          return 72;
      }
    }
    switch (size) {
      case 'small':
        return 48;
      case 'large':
          return 64;
      default:
        return 56;
    }
  };

  const getIconSize = (): number => {
    if (isTablet) {
      switch (size) {
        case 'small':
          return 28;
        case 'large':
          return 40;
        default:
          return 36;
      }
    }
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 28;
    }
  };

  const buttonSize = getSize();
  const iconSize = getIconSize();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            backgroundColor,
          },
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.icon, { fontSize: iconSize, color: iconColor }]}>
          {icon}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
