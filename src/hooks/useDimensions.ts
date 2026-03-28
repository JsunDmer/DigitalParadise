import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export function useDimensions() {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription.remove();
  }, []);

  const isTablet = dimensions.width >= 768;
  const isPhone = !isTablet;

  return {
    ...dimensions,
    isTablet,
    isPhone,
  };
}

export function useOrientation() {
  const { width, height } = useDimensions();
  return width > height ? 'landscape' : 'portrait';
}
