import React from 'react';
import { Animated, Easing } from 'react-native';
import { ANIMATION } from './constants';

export const useButtonPressAnimation = () => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const animatedStyle = {
    transform: [{ scale: scale }],
  };

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.92,
      duration: ANIMATION.buttonPress,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: ANIMATION.buttonPress,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
};

export const useGameItemClickAnimation = () => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const animatedStyle = {
    transform: [{ scale: scale }],
    opacity: opacity,
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.88,
        duration: ANIMATION.itemClick / 2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIMATION.itemClick / 2,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSuccess = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.05,
        duration: ANIMATION.itemClick / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIMATION.itemClick / 2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return {
    animatedStyle,
    handlePress,
    handleSuccess,
  };
};

export const useCorrectFeedbackAnimation = () => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    transform: [{ scale: scale }],
    opacity: opacity,
  };

  const trigger = (onComplete?: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: ANIMATION.correctFeedback / 2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIMATION.correctFeedback / 2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION.correctFeedback / 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION.correctFeedback / 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION.correctFeedback / 3,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      onComplete?.();
    }, ANIMATION.correctFeedback);
  };

  return {
    animatedStyle,
    trigger,
  };
};

export const useShakeAnimation = () => {
  const translateX = React.useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    transform: [{ translateX: translateX }],
  };

  const trigger = (onComplete?: () => void) => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: -10,
        duration: ANIMATION.shake / 8,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 10,
        duration: ANIMATION.shake / 8,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -10,
        duration: ANIMATION.shake / 8,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 10,
        duration: ANIMATION.shake / 8,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -10,
        duration: ANIMATION.shake / 8,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 10,
        duration: ANIMATION.shake / 8,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION.shake / 8,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      onComplete?.();
    }, ANIMATION.shake);
  };

  return {
    animatedStyle,
    trigger,
  };
};

export const useBounceInAnimation = () => {
  const scale = React.useRef(new Animated.Value(0.3)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    transform: [{ scale: scale }],
    opacity: opacity,
  };

  const trigger = (onComplete?: () => void) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.3,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.05,
          duration: ANIMATION.bounceIn * 0.5,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: ANIMATION.bounceIn * 0.2,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: ANIMATION.bounceIn * 0.3,
          easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION.bounceIn * 0.3,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setTimeout(() => {
      onComplete?.();
    }, ANIMATION.bounceIn);
  };

  const reset = () => {
    scale.setValue(0.3);
    opacity.setValue(0);
  };

  return {
    animatedStyle,
    trigger,
    reset,
  };
};

export const useScaleAnimation = (initialScale = 1) => {
  const scale = React.useRef(new Animated.Value(initialScale)).current;

  const animatedStyle = {
    transform: [{ scale: scale }],
  };

  const scaleTo = (value: number, duration = 200) => {
    Animated.timing(scale, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const scaleWithSpring = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      damping: 10,
      stiffness: 100,
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    Animated.timing(scale, {
      toValue: initialScale,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedStyle,
    scale,
    scaleTo,
    scaleWithSpring,
    reset,
  };
};

export const useFadeAnimation = (initialOpacity = 1) => {
  const opacity = React.useRef(new Animated.Value(initialOpacity)).current;

  const animatedStyle = {
    opacity: opacity,
  };

  const fadeIn = (duration = 300) => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (duration = 300) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeTo = (value: number, duration = 300) => {
    Animated.timing(opacity, {
      toValue: value,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedStyle,
    opacity,
    fadeIn,
    fadeOut,
    fadeTo,
  };
};

export const useSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
  const translateValue = React.useRef(new Animated.Value(100)).current;

  const animatedStyle = {
    transform: [],
  };

  if (direction === 'left') {
    animatedStyle.transform = [{ translateX: translateValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -100],
    }) }];
  } else if (direction === 'right') {
    animatedStyle.transform = [{ translateX: translateValue }];
  } else if (direction === 'up') {
    animatedStyle.transform = [{ translateY: translateValue }];
  } else {
    animatedStyle.transform = [{ translateY: translateValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -100],
    }) }];
  }

  const slideIn = (duration = 300) => {
    Animated.timing(translateValue, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const slideOut = (duration = 300) => {
    Animated.timing(translateValue, {
      toValue: 100,
      duration,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedStyle,
    slideIn,
    slideOut,
  };
};

export const usePulseAnimation = () => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const animatedStyle = {
    transform: [{ scale: scale }],
  };

  const start = (minScale = 0.95, maxScale = 1.05, duration = 1000) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  };

  const stop = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedStyle,
    start,
    stop,
  };
};

export const animationPresets = {
  buttonPress: {
    duration: ANIMATION.buttonPress,
    scale: 0.92,
  },
  itemClick: {
    duration: ANIMATION.itemClick,
    scale: 0.88,
  },
  correctFeedback: {
    duration: ANIMATION.correctFeedback,
    scale: 1.1,
  },
  shake: {
    duration: ANIMATION.shake,
    distance: 10,
  },
  bounceIn: {
    duration: ANIMATION.bounceIn,
    easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  },
  starBurst: {
    duration: ANIMATION.starBurst,
  },
  emojiBounce: {
    duration: ANIMATION.emojiBounce,
    height: 20,
  },
};
