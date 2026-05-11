/**
 * Microinteractions and Haptics Service
 * Provides smooth animations, transitions, and haptic feedback
 */

import { Platform, Alert } from 'react-native';
import { Animated, Easing } from 'react-native';
import Haptics from 'expo-haptics';

export interface MicrointeractionConfig {
  duration: number;
  easing: string;
  delay: number;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'spring';
  from: any;
  to: any;
  config: MicrointeractionConfig;
}

class MicrointeractionsService {
  private static instance: MicrointeractionsService;
  private enabled: boolean = true;
  private hapticsEnabled: boolean = true;

  static getInstance(): MicrointeractionsService {
    if (!MicrointeractionsService.instance) {
      MicrointeractionsService.instance = new MicrointeractionsService();
    }
    return MicrointeractionsService.instance;
  }

  /**
   * Initialize microinteractions service
   */
  initialize(): void {
    console.log('Microinteractions service initialized');
  }

  /**
   * Enable/disable microinteractions
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Enable/disable haptic feedback
   */
  setHapticsEnabled(enabled: boolean): void {
    this.hapticsEnabled = enabled;
  }

  /**
   * Trigger haptic feedback
   */
  async triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'): Promise<void> {
    if (!this.hapticsEnabled || !this.enabled) return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }

  /**
   * Create animated value
   */
  createAnimatedValue(initialValue: number = 0): Animated.Value {
    return new Animated.Value(initialValue);
  }

  /**
   * Create fade animation
   */
  createFadeAnimation(
    animatedValue: Animated.Value,
    toValue: number,
    config: Partial<MicrointeractionConfig> = {}
  ): Animated.CompositeAnimation {
    const defaultConfig: MicrointeractionConfig = {
      duration: 300,
      easing: 'easeInOut',
      delay: 0,
    };

    const finalConfig = { ...defaultConfig, ...config };

    return Animated.timing(animatedValue, {
      toValue,
      duration: finalConfig.duration,
      delay: finalConfig.delay,
      easing: this.getEasingFunction(finalConfig.easing),
      useNativeDriver: true,
    });
  }

  /**
   * Create slide animation
   */
  createSlideAnimation(
    animatedValue: Animated.Value,
    toValue: number,
    config: Partial<MicrointeractionConfig> = {}
  ): Animated.CompositeAnimation {
    const defaultConfig: MicrointeractionConfig = {
      duration: 250,
      easing: 'easeOut',
      delay: 0,
    };

    const finalConfig = { ...defaultConfig, ...config };

    return Animated.timing(animatedValue, {
      toValue,
      duration: finalConfig.duration,
      delay: finalConfig.delay,
      easing: this.getEasingFunction(finalConfig.easing),
      useNativeDriver: true,
    });
  }

  /**
   * Create scale animation
   */
  createScaleAnimation(
    animatedValue: Animated.Value,
    toValue: number,
    config: Partial<MicrointeractionConfig> = {}
  ): Animated.CompositeAnimation {
    const defaultConfig: MicrointeractionConfig = {
      duration: 200,
      easing: 'easeOut',
      delay: 0,
    };

    const finalConfig = { ...defaultConfig, ...config };

    return Animated.timing(animatedValue, {
      toValue,
      duration: finalConfig.duration,
      delay: finalConfig.delay,
      easing: this.getEasingFunction(finalConfig.easing),
      useNativeDriver: true,
    });
  }

  /**
   * Create bounce animation
   */
  createBounceAnimation(
    animatedValue: Animated.Value,
    toValue: number,
    config: Partial<MicrointeractionConfig> = {}
  ): Animated.CompositeAnimation {
    const defaultConfig: MicrointeractionConfig = {
      duration: 600,
      easing: 'easeOut',
      delay: 0,
    };

    const finalConfig = { ...defaultConfig, ...config };

    return Animated.spring(animatedValue, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    });
  }

  /**
   * Create sequential animation
   */
  createSequentialAnimation(
    animations: Animated.CompositeAnimation[]
  ): Animated.CompositeAnimation {
    return Animated.sequence(animations);
  }

  /**
   * Create parallel animation
   */
  createParallelAnimation(
    animations: Animated.CompositeAnimation[]
  ): Animated.CompositeAnimation {
    return Animated.parallel(animations);
  }

  /**
   * Get easing function
   */
  private getEasingFunction(easing: string): Animated.TimingAnimationConfig['easing'] {
    switch (easing) {
      case 'linear':
        return Easing.linear;
      case 'easeIn':
        return Easing.in(Easing.ease);
      case 'easeOut':
        return Easing.out(Easing.ease);
      case 'easeInOut':
        return Easing.inOut(Easing.ease);
      case 'easeInQuad':
        return Easing.in(Easing.quad);
      case 'easeOutQuad':
        return Easing.out(Easing.quad);
      case 'easeInOutQuad':
        return Easing.inOut(Easing.quad);
      case 'easeInCubic':
        return Easing.in(Easing.cubic);
      case 'easeOutCubic':
        return Easing.out(Easing.cubic);
      case 'easeInOutCubic':
        return Easing.inOut(Easing.cubic);
      case 'easeInBack':
        return Easing.in(Easing.back(1.5));
      case 'easeOutBack':
        return Easing.out(Easing.back(1.5));
      case 'easeInOutBack':
        return Easing.inOut(Easing.back(1.5));
      case 'easeInBounce':
        return Easing.in(Easing.bounce);
      case 'easeOutBounce':
        return Easing.out(Easing.bounce);
      case 'easeInOutBounce':
        return Easing.inOut(Easing.bounce);
      default:
        return Easing.inOut(Easing.ease);
    }
  }

  /**
   * Button press animation with haptic feedback
   */
  async animateButtonPress(
    scaleValue: Animated.Value,
    onPress: () => void,
    hapticType: 'light' | 'medium' | 'heavy' = 'light'
  ): Promise<void> {
    if (!this.enabled) {
      onPress();
      return;
    }

    // Trigger haptic feedback
    await this.triggerHaptic(hapticType);

    // Animate button press
    const pressAnimation = Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]);

    pressAnimation.start(() => {
      onPress();
    });
  }

  /**
   * Card hover animation
   */
  animateCardHover(
    scaleValue: Animated.Value,
    isHovered: boolean
  ): void {
    if (!this.enabled) return;

    Animated.timing(scaleValue, {
      toValue: isHovered ? 1.02 : 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  }

  /**
   * Success animation
   */
  animateSuccess(
    scaleValue: Animated.Value,
    onComplete?: () => void
  ): void {
    if (!this.enabled) {
      onComplete?.();
      return;
    }

    // Trigger success haptic
    this.triggerHaptic('success');

    // Create success animation
    const successAnimation = Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.bounce),
      }),
    ]);

    successAnimation.start(onComplete);
  }

  /**
   * Error shake animation
   */
  animateErrorShake(
    translateXValue: Animated.Value,
    onComplete?: () => void
  ): void {
    if (!this.enabled) {
      onComplete?.();
      return;
    }

    // Trigger error haptic
    this.triggerHaptic('error');

    // Create shake animation
    const shakeAnimation = Animated.sequence([
      Animated.timing(translateXValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);

    shakeAnimation.start(onComplete);
  }

  /**
   * Loading pulse animation
   */
  createLoadingPulse(
    opacityValue: Animated.Value
  ): Animated.CompositeAnimation {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
  }

  /**
   * Slide in animation
   */
  animateSlideIn(
    translateXValue: Animated.Value,
    opacityValue: Animated.Value,
    direction: 'left' | 'right' | 'up' | 'down' = 'right',
    onComplete?: () => void
  ): void {
    if (!this.enabled) {
      onComplete?.();
      return;
    }

    const startValue = direction === 'left' || direction === 'right' 
      ? (direction === 'left' ? -100 : 100)
      : (direction === 'up' ? -100 : 100);

    translateXValue.setValue(startValue);
    opacityValue.setValue(0);

    const slideInAnimation = Animated.parallel([
      Animated.timing(translateXValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]);

    slideInAnimation.start(onComplete);
  }

  /**
   * Fade out and remove animation
   */
  animateFadeOut(
    opacityValue: Animated.Value,
    scaleValue: Animated.Value,
    onComplete?: () => void
  ): void {
    if (!this.enabled) {
      onComplete?.();
      return;
    }

    const fadeOutAnimation = Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]);

    fadeOutAnimation.start(onComplete);
  }

  /**
   * Number counting animation
   */
  animateNumberCount(
    animatedValue: Animated.Value,
    fromValue: number,
    toValue: number,
    duration: number = 1000,
    onUpdate?: (value: number) => void
  ): void {
    if (!this.enabled) {
      onUpdate?.(toValue);
      return;
    }

    animatedValue.setValue(fromValue);

    const countAnimation = Animated.timing(animatedValue, {
      toValue,
      duration,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad),
    });

    let lastValue = fromValue;
    
    const listener = animatedValue.addListener(({ value }) => {
      const roundedValue = Math.round(value);
      if (roundedValue !== lastValue) {
        lastValue = roundedValue;
        onUpdate?.(roundedValue);
      }
    });

    countAnimation.start(() => {
      animatedValue.removeListener(listener);
      onUpdate?.(toValue);
    });
  }

  /**
   * Get platform-specific animation settings
   */
  getPlatformSettings(): {
    enableHaptics: boolean;
    reduceMotion: boolean;
    animationScale: number;
  } {
    return {
      enableHaptics: Platform.OS !== 'web',
      reduceMotion: false, // Would come from accessibility settings
      animationScale: Platform.select({
        ios: 1.0,
        android: 0.8,
        web: 1.0,
      }) || 1.0,
    };
  }
}

// Predefined animation configurations
export const ANIMATION_PRESETS = {
  BUTTON_PRESS: {
    duration: 200,
    easing: 'easeOut',
    delay: 0,
    hapticType: 'light' as const,
  },
  CARD_HOVER: {
    duration: 250,
    easing: 'easeOut',
    delay: 0,
  },
  SUCCESS: {
    duration: 300,
    easing: 'easeOut',
    delay: 0,
    hapticType: 'success' as const,
  },
  ERROR: {
    duration: 250,
    easing: 'easeOut',
    delay: 0,
    hapticType: 'error' as const,
  },
  SLIDE_IN: {
    duration: 300,
    easing: 'easeOut',
    delay: 0,
  },
  FADE_IN: {
    duration: 250,
    easing: 'easeIn',
    delay: 0,
  },
  LOADING_PULSE: {
    duration: 1000,
    easing: 'easeInOut',
    delay: 0,
  },
};

export const microinteractionsService = MicrointeractionsService.getInstance();
export default microinteractionsService;
