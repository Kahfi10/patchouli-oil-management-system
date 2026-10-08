import { Platform } from 'react-native';

/**
 * Apple Human Interface Guidelines Typography Scale
 * Uses clean system sans-serif fonts: -apple-system, SF Pro, Roboto
 */

export const SANS_FONT: string = Platform.select({
  ios: '-apple-system',
  android: 'Roboto',
  default: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
}) || 'System';
