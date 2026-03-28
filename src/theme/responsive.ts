import { Dimensions } from 'react-native';
import { colors } from './colors';
import { fontSizes, fontWeights, Typography } from './typography';
import {
  spacing,
  elementSpacing,
  borderRadius,
  layout,
  iconSizes,
  gameItem,
} from './spacing';

const TABLET_BREAKPOINT = 768;
const TABLET_FONT_MULTIPLIER = 1.2;
const TABLET_PAGE_MARGIN = 32;
const PHONE_PAGE_MARGIN = 16;

function isTablet(): boolean {
  const { width } = Dimensions.get('window');
  return width >= TABLET_BREAKPOINT;
}

export function getResponsivePageMargin(): number {
  return isTablet() ? TABLET_PAGE_MARGIN : PHONE_PAGE_MARGIN;
}

export function getResponsiveTouchTarget() {
  if (isTablet()) {
    return {
      minimum: 100,
      button: 144,
      gameItem: 100,
      icon: 58,
    };
  }
  return {
    minimum: 80,
    button: 120,
    gameItem: 100,
    icon: 48,
  };
}

function scaleFontSize(size: number): number {
  return isTablet() ? Math.round(size * TABLET_FONT_MULTIPLIER) : size;
}

export function getResponsiveFontSizes() {
  return {
    title: {
      large: scaleFontSize(fontSizes.title.large),
      medium: scaleFontSize(fontSizes.title.medium),
      small: scaleFontSize(fontSizes.title.small),
    },
    body: {
      large: scaleFontSize(fontSizes.body.large),
      medium: scaleFontSize(fontSizes.body.medium),
      small: scaleFontSize(fontSizes.body.small),
    },
    number: {
      huge: scaleFontSize(fontSizes.number.huge),
      large: scaleFontSize(fontSizes.number.large),
      medium: scaleFontSize(fontSizes.number.medium),
      counter: scaleFontSize(fontSizes.number.counter),
      small: scaleFontSize(fontSizes.number.small),
    },
    button: {
      large: scaleFontSize(fontSizes.button.large),
      medium: scaleFontSize(fontSizes.button.medium),
      small: scaleFontSize(fontSizes.button.small),
    },
    caption: scaleFontSize(fontSizes.caption),
  };
}

export function getResponsiveTypography(): Typography {
  const responsiveFontSizes = getResponsiveFontSizes();
  
  return {
    title: {
      large: {
        fontSize: responsiveFontSizes.title.large,
        fontWeight: fontWeights.bold,
      },
      medium: {
        fontSize: responsiveFontSizes.title.medium,
        fontWeight: fontWeights.bold,
      },
      small: {
        fontSize: responsiveFontSizes.title.small,
        fontWeight: fontWeights.bold,
      },
    },
    body: {
      large: {
        fontSize: responsiveFontSizes.body.large,
        fontWeight: fontWeights.regular,
      },
      medium: {
        fontSize: responsiveFontSizes.body.medium,
        fontWeight: fontWeights.regular,
      },
      small: {
        fontSize: responsiveFontSizes.body.small,
        fontWeight: fontWeights.regular,
      },
    },
    number: {
      huge: {
        fontSize: responsiveFontSizes.number.huge,
        fontWeight: fontWeights.bold,
      },
      large: {
        fontSize: responsiveFontSizes.number.large,
        fontWeight: fontWeights.bold,
      },
      medium: {
        fontSize: responsiveFontSizes.number.medium,
        fontWeight: fontWeights.bold,
      },
      small: {
        fontSize: responsiveFontSizes.number.small,
        fontWeight: fontWeights.bold,
      },
    },
    button: {
      large: {
        fontSize: responsiveFontSizes.button.large,
        fontWeight: fontWeights.bold,
      },
      medium: {
        fontSize: responsiveFontSizes.button.medium,
        fontWeight: fontWeights.bold,
      },
      small: {
        fontSize: responsiveFontSizes.button.small,
        fontWeight: fontWeights.bold,
      },
    },
    caption: {
      fontSize: responsiveFontSizes.caption,
      fontWeight: fontWeights.regular,
    },
  };
}

export function getResponsiveTheme() {
  return {
    colors,
    typography: getResponsiveTypography(),
    fontSizes: getResponsiveFontSizes(),
    fontWeights,
    spacing,
    pageMargin: getResponsivePageMargin(),
    elementSpacing,
    borderRadius,
    layout,
    touchTarget: getResponsiveTouchTarget(),
    iconSizes,
    gameItem,
    isTablet: isTablet(),
  };
}

export type ResponsiveTheme = ReturnType<typeof getResponsiveTheme>;
