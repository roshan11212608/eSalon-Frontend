import { colors } from './colors';
import { platform } from './platform';
import { typography } from './typography';

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Breakpoints for responsive design
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  large: 1440,
};

// Export individual modules
export { colors, platform, typography };

export default {
  colors,
  platform,
  typography,
  animation,
  breakpoints,
};
