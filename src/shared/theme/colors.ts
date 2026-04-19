// Color palette for eSalon app
export const colors = {
  // Primary colors - Maroon theme
  primary: {
    main: '#780115',      // Maroon
    light: '#f7b638',     // Gold
    dark: '#5a010e',      // Dark maroon
    background: '#780115', // Maroon background
  },
  
  // Secondary colors - Dark maroon
  secondary: {
    main: '#5a010e',      // Dark maroon
    light: '#780115',     // Maroon
    background: '#e8e8e8', // Light gray
  },
  
  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Status colors
  status: {
    success: '#10B981',    // Green
    warning: '#F97316',    // Orange
    error: '#EF4444',      // Red
    info: '#3B82F6',       // Blue
  },
  
  // Background colors
  background: {
    primary: '#780115',    // Maroon primary background
    secondary: '#5a010e',   // Dark maroon secondary background
    tertiary: '#F9FAFB',    // Light gray background
    surface: '#FFFFFF', // White surface
    overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  },
  
  // Text colors
  text: {
    primary: '#1F2937',      // Dark gray primary text
    secondary: '#6B7280',  // Medium gray text
    muted: '#9CA3AF',      // Muted gray text
    inverse: '#FFFFFF',     // White text for dark backgrounds
  },
  
  // Border colors
  border: {
    light: '#E5E7EB', // Light gray border
    medium: '#D1D5DB',  // Medium gray border
    dark: '#9CA3AF',    // Dark gray border
  },
  
  // Shadow colors
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export default colors;
