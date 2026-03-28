import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, fontWeights } from '../../theme';
import { getResponsiveTouchTarget, getResponsiveFontSizes } from '../../theme/responsive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary',
  size = 'medium',
}: ButtonProps) {
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

  const getSizeStyles = (): ViewStyle => {
    const responsiveTouchTarget = getResponsiveTouchTarget();
    switch (size) {
      case 'small':
        return { minWidth: 100, height: 60 };
      case 'large':
        return { minWidth: 160, height: 100 };
      default:
        return { minWidth: responsiveTouchTarget.button, height: 80 };
    }
  };

  const getFontSize = (): number => {
    const responsiveFontSizes = getResponsiveFontSizes();
    switch (size) {
      case 'small':
        return responsiveFontSizes.button.small;
      case 'large':
        return Math.round(responsiveFontSizes.button.large * 1.14);
      default:
        return responsiveFontSizes.button.large;
    }
  };

  if (variant === 'primary') {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={0.9}
          style={styles.touchable}
        >
          <LinearGradient
            colors={disabled ? ['#D3D3D3', '#E8E8E8'] : [colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, getSizeStyles()]}
          >
            <Text style={[styles.text, { fontSize: getFontSize() }, textStyle]}>
              {title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'secondary') {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={0.9}
          style={[
            styles.secondaryButton,
            getSizeStyles(),
            disabled && styles.disabled,
          ]}
        >
          <Text style={[styles.text, { fontSize: getFontSize() }, textStyle]}>
            {title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={[
          styles.outlineButton,
          getSizeStyles(),
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.outlineText, { fontSize: getFontSize() }, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: borderRadius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  gradient: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
