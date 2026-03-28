import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/theme';

interface StarProps {
  angle: number;
  distance: number;
  starSize: number;
  color: string;
  progress: Animated.SharedValue<number>;
}

function Star({ angle, distance, starSize, color, progress }: StarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const currentDistance = interpolate(
      progress.value,
      [0, 1],
      [0, distance]
    );

    const radians = (angle * Math.PI) / 180;
    const translateX = Math.cos(radians) * currentDistance;
    const translateY = Math.sin(radians) * currentDistance;

    const scale = interpolate(progress.value, [0, 0.5, 1], [0, 1.2, 0.8]);
    const opacity = interpolate(progress.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${angle}deg` },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: starSize,
          height: starSize,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.starInner, { backgroundColor: color }]} />
    </Animated.View>
  );
}

interface StarConfig {
  id: number;
  angle: number;
  distance: number;
}

interface StarBurstProps {
  count?: number;
  duration?: number;
  starSize?: number;
  color?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
}

export default function StarBurst({
  count = 8,
  duration = 1000,
  starSize = 48,
  color = colors.star,
  autoPlay = true,
  onComplete,
}: StarBurstProps) {
  const progress = useSharedValue(0);

  const stars: StarConfig[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i,
    distance: 150 + Math.random() * 100,
  }));

  useEffect(() => {
    if (autoPlay) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      });

      const timeout = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [autoPlay, duration, onComplete, progress]);

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((star) => (
        <Star
          key={star.id}
          angle={star.angle}
          distance={star.distance}
          starSize={starSize}
          color={color}
          progress={progress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starInner: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
});
