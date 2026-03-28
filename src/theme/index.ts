import { colors, ColorTheme } from './colors';
import { typography, Typography, fontSizes, fontWeights } from './typography';
import {
  spacing,
  pageMargin,
  elementSpacing,
  borderRadius,
  layout,
  touchTarget,
  iconSizes,
  gameItem,
  Spacing,
  BorderRadius,
} from './spacing';
import {
  getResponsiveTheme,
  getResponsivePageMargin,
  getResponsiveTouchTarget,
  getResponsiveFontSizes,
  getResponsiveTypography,
  ResponsiveTheme,
} from './responsive';

export const theme = {
  colors,
  typography,
  fontSizes,
  fontWeights,
  spacing,
  pageMargin,
  elementSpacing,
  borderRadius,
  layout,
  touchTarget,
  iconSizes,
  gameItem,
};

export type Theme = typeof theme;

export {
  colors,
  typography,
  fontSizes,
  fontWeights,
  spacing,
  pageMargin,
  elementSpacing,
  borderRadius,
  layout,
  touchTarget,
  iconSizes,
  gameItem,
  getResponsiveTheme,
  getResponsivePageMargin,
  getResponsiveTouchTarget,
  getResponsiveFontSizes,
  getResponsiveTypography,
};

export type { ColorTheme, Typography, Spacing, BorderRadius, ResponsiveTheme };

export default theme;
