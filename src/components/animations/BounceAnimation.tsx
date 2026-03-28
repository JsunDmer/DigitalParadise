import { ReactNode, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface BounceAnimationProps {
  children: ReactNode;
  duration?: number;
  bounceHeight?: number;
  autoPlay?: boolean;
}

export default function BounceAnimation({
  children,
  duration = 600,
  bounceHeight = 20,
  autoPlay = true,
}: BounceAnimationProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (autoPlay) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-bounceHeight, {
            duration,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          }),
          withTiming(0, {
            duration,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          })
        ),
        -1,
        true
      );
    }
  }, [autoPlay, bounceHeight, duration, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const triggerBounce = () => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View onTouchStart={triggerBounce}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
