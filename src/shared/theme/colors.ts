// Color palette for eSalon app
export const colors = {
  // Primary colors - Green theme
  primary: {
    main: '#e4e5ef',      // Emerald green
    light: '#f68309e0',     // Light green
    dark: '#047857',      // Dark green
    background: '#e8240a', // Green background
  },
  
  // Secondary colors - Dark green
  secondary: {
    main: '#047857',      // Dark green
    light: '#065F46',     // Darker green
    background: '#eaf2f0', // Very dark green
  },
  
  // Neutral colors
  neutral: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
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
    primary: 'rgb(10, 51, 133)',    // Green primary background
    secondary: '#047857',   // Dark green secondary background
    tertiary: '#064E3B',    // Very dark green background
    surface: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
    overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',      // White primary text
    secondary: '#F3F4F6',  // Light gray text
    muted: '#D1D5DB',      // Muted gray text
    inverse: '#000000',     // Black text for white backgrounds
  },
  
  // Border colors
  border: {
    light: 'rgba(255, 255, 255, 0.2)', // Light white border
    medium: 'rgba(255, 255, 255, 0.3)',  // Medium white border
    dark: 'rgba(255, 255, 255, 0.4)',    // Dark white border
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
