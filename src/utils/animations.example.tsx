import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  useButtonPressAnimation,
  useGameItemClickAnimation,
  useCorrectFeedbackAnimation,
  useShakeAnimation,
  useBounceInAnimation,
  useEmojiBounceAnimation,
  useScaleAnimation,
  useFadeAnimation,
} from './animations';

export const ButtonPressExample: React.FC = () => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonPressAnimation();

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>点击我</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const GameItemClickExample: React.FC = () => {
  const { animatedStyle, handlePress, handleSuccess } = useGameItemClickAnimation();

  return (
    <Animated.View style={[styles.gameItem, animatedStyle]}>
      <TouchableOpacity
        onPress={() => {
          handlePress();
          setTimeout(() => handleSuccess(), 200);
        }}
      >
        <Text style={styles.emoji}>🍎</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CorrectFeedbackExample: React.FC = () => {
  const { animatedStyle, trigger } = useCorrectFeedbackAnimation();

  return (
    <Animated.View style={[styles.feedbackContainer, animatedStyle]}>
      <TouchableOpacity onPress={() => trigger()}>
        <Text style={styles.feedbackText}>✓ 正确!</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ShakeAnimationExample: React.FC = () => {
  const { animatedStyle, trigger } = useShakeAnimation();

  return (
    <Animated.View style={[styles.shakeContainer, animatedStyle]}>
      <TouchableOpacity onPress={() => trigger()}>
        <Text style={styles.shakeText}>错误时抖动</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const BounceInExample: React.FC = () => {
  const { animatedStyle, trigger } = useBounceInAnimation();

  React.useEffect(() => {
    trigger();
  }, []);

  return (
    <Animated.View style={[styles.modalContainer, animatedStyle]}>
      <Text style={styles.modalText}>弹窗内容</Text>
    </Animated.View>
  );
};

export const EmojiBounceExample: React.FC = () => {
  const { animatedStyle, start, bounce } = useEmojiBounceAnimation();

  React.useEffect(() => {
    start();
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={bounce}>
        <Text style={styles.emoji}>🎉</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ScaleAnimationExample: React.FC = () => {
  const { animatedStyle, scaleTo, reset } = useScaleAnimation();

  return (
    <Animated.View style={[styles.scaleContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={() => {
          scaleTo(1.5, 300);
          setTimeout(() => reset(), 500);
        }}
      >
        <Text style={styles.scaleText}>缩放动画</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const FadeAnimationExample: React.FC = () => {
  const { animatedStyle, fadeIn, fadeOut } = useFadeAnimation(0);

  return (
    <Animated.View style={[styles.fadeContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={() => {
          fadeIn(300);
          setTimeout(() => fadeOut(300), 1000);
        }}
      >
        <Text style={styles.fadeText}>淡入淡出</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    minWidth: 120,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  gameItem: {
    width: 100,
    height: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  feedbackContainer: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  shakeContainer: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  shakeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  modalText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  scaleContainer: {
    backgroundColor: '#FFE66D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  scaleText: {
    color: '#2D3436',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fadeContainer: {
    backgroundColor: '#9013FE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  fadeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
