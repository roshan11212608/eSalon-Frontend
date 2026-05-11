/**
 * Color System
 * Semantic color tokens with dark mode support
 */

export interface ColorTokens {
  // Primary colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Main primary color
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Secondary colors
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Main secondary color
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Neutral colors
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  // Surface colors
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };

  // Border colors
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  // Status colors
  status: {
    online: string;
    offline: string;
    pending: string;
  };
}

// Light theme colors
export const lightColors: ColorTokens = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main secondary
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: {
    primary: '#E5E7EB',
    secondary: '#F3F4F6',
    tertiary: '#F9FAFB',
  },
  status: {
    online: '#10B981',
    offline: '#6B7280',
    pending: '#F59E0B',
  },
};

// Dark theme colors
export const darkColors: ColorTokens = {
  primary: {
    50: '#1E3A8A',
    100: '#1E40AF',
    200: '#1D4ED8',
    300: '#2563EB',
    400: '#3B82F6',
    500: '#60A5FA', // Main primary (lighter in dark mode)
    600: '#93C5FD',
    700: '#BFDBFE',
    800: '#DBEAFE',
    900: '#EFF6FF',
  },
  secondary: {
    50: '#14532D',
    100: '#166534',
    200: '#15803D',
    300: '#16A34A',
    400: '#22C55E',
    500: '#4ADE80', // Main secondary (lighter in dark mode)
    600: '#86EFAC',
    700: '#BBF7D0',
    800: '#DCFCE7',
    900: '#F0FDF4',
  },
  neutral: {
    50: '#171717',
    100: '#262626',
    200: '#404040',
    300: '#525252',
    400: '#737373',
    500: '#A3A3A3',
    600: '#D4D4D4',
    700: '#E5E5E5',
    800: '#F5F5F5',
    900: '#FAFAFA',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  background: {
    primary: '#0F0F0F',
    secondary: '#1A1A1A',
    tertiary: '#262626',
  },
  surface: {
    primary: '#1A1A1A',
    secondary: '#262626',
    tertiary: '#404040',
  },
  text: {
    primary: '#FAFAFA',
    secondary: '#D4D4D4',
    tertiary: '#A3A3A3',
    inverse: '#111827',
  },
  border: {
    primary: '#404040',
    secondary: '#525252',
    tertiary: '#737373',
  },
  status: {
    online: '#10B981',
    offline: '#6B7280',
    pending: '#F59E0B',
  },
};

// Brand colors for eSalon
export const brandColors = {
  // eSalon brand colors
  salon: {
    primary: '#8B5CF6', // Purple
    secondary: '#EC4899', // Pink
    accent: '#F59E0B', // Amber
  },
  // Service type colors
  services: {
    haircut: '#3B82F6',
    styling: '#8B5CF6',
    coloring: '#EC4899',
    treatment: '#10B981',
    grooming: '#F59E0B',
  },
  // Status colors
  appointment: {
    confirmed: '#10B981',
    pending: '#F59E0B',
    cancelled: '#EF4444',
    completed: '#6B7280',
  },
  // Revenue colors
  revenue: {
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#6B7280',
  },
};

// Get color by theme
export const getColors = (isDark: boolean = false): ColorTokens => {
  return isDark ? darkColors : lightColors;
};

// Color utilities
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export default {
  lightColors,
  darkColors,
  brandColors,
  getColors,
  getColorWithOpacity,
  getContrastColor,
};
