import { useMemo } from 'react';
import { Dimensions, Platform } from 'react-native';
import { useDimensions } from './useDimensions';

export interface DeviceInfo {
  isTablet: boolean;
  isPhone: boolean;
  deviceType: 'phone' | 'tablet';
  platform: 'ios' | 'android' | 'web' | 'windows' | 'macos';
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

export interface TabletAdaptation {
  marginMultiplier: number;
  touchTargetMultiplier: number;
  fontSizeMultiplier: number;
  pageMargin: number;
  touchTarget: {
    minimum: number;
    button: number;
    gameItem: number;
    icon: number;
  };
}

const TABLET_BREAKPOINT = 768;

export function useDeviceType(): DeviceInfo {
  const { width, height, isTablet, isPhone } = useDimensions();

  const deviceInfo = useMemo((): DeviceInfo => {
    return {
      isTablet,
      isPhone,
      deviceType: isTablet ? 'tablet' : 'phone',
      platform: Platform.OS as DeviceInfo['platform'],
      screenWidth: width,
      screenHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
    };
  }, [width, height, isTablet, isPhone]);

  return deviceInfo;
}

export function useTabletAdaptation(): TabletAdaptation {
  const { isTablet } = useDeviceType();

  const adaptation = useMemo((): TabletAdaptation => {
    if (isTablet) {
      return {
        marginMultiplier: 1.0,
        touchTargetMultiplier: 1.0,
        fontSizeMultiplier: 1.2,
        pageMargin: 32,
        touchTarget: {
          minimum: 100,
          button: 144,
          gameItem: 100,
          icon: 58,
        },
      };
    }

    return {
      marginMultiplier: 1.0,
      touchTargetMultiplier: 1.0,
      fontSizeMultiplier: 1.0,
      pageMargin: 16,
      touchTarget: {
        minimum: 80,
        button: 120,
        gameItem: 100,
        icon: 48,
      },
    };
  }, [isTablet]);

  return adaptation;
}

export function getDeviceType(): 'phone' | 'tablet' {
  const { width } = Dimensions.get('window');
  return width >= TABLET_BREAKPOINT ? 'tablet' : 'phone';
}

export function isTabletDevice(): boolean {
  return getDeviceType() === 'tablet';
}
