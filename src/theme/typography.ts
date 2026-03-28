import { TextStyle } from 'react-native';

export const fontSizes = {
  title: {
    large: 48,
    medium: 40,
    small: 36,
  },
  body: {
    large: 24,
    medium: 20,
    small: 18,
  },
  number: {
    huge: 150,
    large: 120,
    medium: 80,
    counter: 64,
    small: 48,
  },
  button: {
    large: 28,
    medium: 24,
    small: 20,
  },
  caption: 16,
};

export const fontWeights = {
  bold: '700' as const,
  medium: '500' as const,
  regular: '400' as const,
};

export const typography = {
  title: {
    large: {
      fontSize: fontSizes.title.large,
      fontWeight: fontWeights.bold,
    } as TextStyle,
    medium: {
      fontSize: fontSizes.title.medium,
      fontWeight: fontWeights.bold,
    } as TextStyle,
    small: {
      fontSize: fontSizes.title.small,
      fontWeight: fontWeights.bold,
    } as TextStyle,
  },
  body: {
    large: {
      fontSize: fontSizes.body.large,
      fontWeight: fontWeights.regular,
    } as TextStyle,
    medium: {
      fontSize: fontSizes.body.medium,
      fontWeight: fontWeights.regular,
    } as TextStyle,
    small: {
      fontSize: fontSizes.body.small,
      fontWeight: fontWeights.regular,
    } as TextStyle,
  },
  number: {
    huge: {
      fontSize: fontSizes.number.huge,
      fontWeight: fontWeights.bold,
    } as TextStyle,
    large: {
      fontSize: fontSizes.number.large,
      fontWeight: fontWeights.bold,
    } as TextStyle,
    medium: {
      fontSize: fontSizes.number.medium,
      fontWeight: fontWeights.bold,
    } as TextStyle,
    small: {
      fontSize: fontSizes.number.small,
      fontWeight: fontWeights.bold,
    } as TextStyle,
  },
  button: {
    large: {
      fontSize: fontSizes.button.large,
      fontWeight: fontWeights.bold,
    } as TextStyle,
    medium: {
      fontSize: fontSizes.button.medium,
      fontWeight: fontWeights.bold,
    } as TextStyle,
    small: {
      fontSize: fontSizes.button.small,
      fontWeight: fontWeights.bold,
    } as TextStyle,
  },
  caption: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
  } as TextStyle,
};

export type Typography = typeof typography;
