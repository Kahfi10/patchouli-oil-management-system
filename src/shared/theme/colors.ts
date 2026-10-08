/**
 * Apple Human Interface Guidelines (HIG) Color System
 * Solid, deliberate system colors - Zero AI-slop gradients or fake glows.
 */

export const appleColors = {
  // Apple System Grayscale (Light)
  light: {
    canvas: '#F2F2F7',          // iOS System Grouped Background
    surface: '#FFFFFF',         // iOS Card / Table Background
    surfaceSecondary: '#E5E5EA',// iOS Fill Color
    surfaceTertiary: '#D1D1D6',
    border: '#E5E5EA',          // Hairline separator
    borderStrong: '#C6C6C8',
    textPrimary: '#000000',     // iOS Primary Label
    textSecondary: '#6C6C70',   // iOS Secondary Label
    textTertiary: '#8E8E93',    // iOS Tertiary Label
    accent: '#248A3D',          // Apple Solid Dark Green (Nilam Brand)
    accentTint: '#E8F5E9',
    oilAmber: '#B45309',        // Solid Amber Oil tone
    oilAmberTint: '#FEF3C7',
    danger: '#FF3B30',
    dangerTint: '#FEE2E2',
    cardShadow: 'rgba(0, 0, 0, 0.03)',
  },

  // Apple System Grayscale (Dark)
  dark: {
    canvas: '#000000',          // iOS True Black Background
    surface: '#1C1C1E',         // iOS System Gray 6 (Grouped Surface)
    surfaceSecondary: '#2C2C2E',// iOS System Gray 5 (Fill)
    surfaceTertiary: '#3A3A3C', // iOS System Gray 4
    border: '#2C2C2E',          // iOS Dark Hairline Separator
    borderStrong: '#3A3A3C',
    textPrimary: '#FFFFFF',     // iOS White Label
    textSecondary: '#8E8E93',   // iOS Gray Label
    textTertiary: '#636366',
    accent: '#30D158',          // Apple System Green (Dark mode)
    accentTint: '#132C19',
    oilAmber: '#F59E0B',        // Solid Amber Oil
    oilAmberTint: '#382205',
    danger: '#FF453A',
    dangerTint: '#331210',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export type ThemeMode = 'light' | 'dark';

export const getAppleTheme = (mode: ThemeMode) => {
  const isDark = mode === 'dark';
  const c = isDark ? appleColors.dark : appleColors.light;
  return {
    isDark,
    canvas: c.canvas,
    surface: c.surface,
    surfaceSecondary: c.surfaceSecondary,
    surfaceTertiary: c.surfaceTertiary,
    border: c.border,
    borderStrong: c.borderStrong,
    text: c.textPrimary,
    textSecondary: c.textSecondary,
    textTertiary: c.textTertiary,
    accent: c.accent,
    accentTint: c.accentTint,
    oilAmber: c.oilAmber,
    oilAmberTint: c.oilAmberTint,
    danger: c.danger,
    dangerTint: c.dangerTint,
    cardShadow: c.cardShadow,
  };
};
