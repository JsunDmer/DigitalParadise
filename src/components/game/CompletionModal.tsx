import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme';
import BounceAnimation from '../animations/BounceAnimation';
import StarBurst from '../animations/StarBurst';

interface CompletionModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  stars?: number;
  buttonText?: string;
  onClose: () => void;
  onContinue?: () => void;
}

export default function CompletionModal({
  visible,
  title = '太棒了!',
  description = '你完成了这一轮数数!',
  stars = 5,
  buttonText = '继续挑战',
  onClose,
  onContinue,
}: CompletionModalProps) {
  const [showStarBurst, setShowStarBurst] = useState(false);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const starsOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });

      const timer = setTimeout(() => {
        setShowStarBurst(true);
        starsOpacity.value = withTiming(1, { duration: 500 });
      }, 300);

      return () => clearTimeout(timer);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
      starsOpacity.value = 0;
      setShowStarBurst(false);
    }
  }, [visible, opacity, scale, starsOpacity]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const starsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: starsOpacity.value,
  }));

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      onClose();
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={styles.star}>
        {i < stars ? '⭐' : '☆'}
      </Text>
    ));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {showStarBurst && (
          <StarBurst count={12} duration={1000} starSize={32} />
        )}

        <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
          <BounceAnimation duration={600} bounceHeight={15}>
            <Text style={styles.emoji}>🎉</Text>
          </BounceAnimation>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <Animated.View style={[styles.starsContainer, starsAnimatedStyle]}>
            {renderStars()}
          </Animated.View>

          <Text style={styles.starsText}>获得 {stars} 颗星星</Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: colors.surface,
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  emoji: {
    fontSize: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 28,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 48,
    marginHorizontal: 4,
  },
  starsText: {
    fontSize: 24,
    color: colors.text.secondary,
    marginBottom: 32,
  },
  button: {
    width: '100%',
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
  },
});
