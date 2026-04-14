import React from 'react';
import { Platform, useColorScheme, useWindowDimensions } from 'react-native';
import { colors, platform, typography } from './index';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  
  // Determine current platform
  const currentPlatform = Platform.OS === 'web' ? 'web' : 
                          Platform.OS === 'ios' && Platform.isPad ? 'tablet' : 'mobile';
  
  // Determine responsive breakpoint
  const breakpoint = width < 768 ? 'mobile' : 
                      width < 1024 ? 'tablet' : 'desktop';
  
  return {
    // Colors
    colors,
    
    // Platform-specific values
    platform: platform[currentPlatform],
    typography: typography[currentPlatform],
    
    // Current breakpoint
    breakpoint,
    
    // Responsive helpers
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet', 
    isDesktop: breakpoint === 'desktop',
    
    // Theme mode
    colorScheme,
    
    // Computed values
    spacing: platform[currentPlatform].spacing,
    borderRadius: platform[currentPlatform].borderRadius,
    buttonHeight: platform[currentPlatform].buttonHeight,
    inputHeight: platform[currentPlatform].inputHeight,
  };
};
