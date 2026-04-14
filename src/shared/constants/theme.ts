/**
 * SalonKhata App Theme
 * Green and Dark theme for salon management
 */

import { Platform } from 'react-native';

// Theme Colors
export const Colors = {
  // Primary colors
  primary: '#22C55E',      // Green
  primaryLight: '#4ADE80', // Light green
  secondary: '#1E293B',    // Card background
  background: '#0F172A',   // Dark background
  surface: '#1E293B',      // Card/surface background

  // Text colors
  text: '#FFFFFF',         // White text
  textSecondary: '#94A3B8', // Secondary text

  // Status colors
  error: '#EF4444',        // Red for errors
  success: '#22C55E',      // Green for success
  warning: '#F59E0B',      // Orange for warnings

  // Additional colors
  border: '#374151',       // Border color
  placeholder: '#6B7280',  // Placeholder text
  // optional legacy style entries
  icon: '#FFFFFF',
  backgroundLight: '#FFFFFF',
  textLight: '#0F172A',
  surfaceLight: '#F8FAFC',
  backgroundDark: '#0F172A',
  surfaceDark: '#1E293B',
  light: {
    icon: '#0F172A',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
  },
  dark: {
    icon: '#FFFFFF',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
  },
});