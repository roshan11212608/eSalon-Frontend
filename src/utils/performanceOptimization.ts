/**
 * Performance Optimization Utilities
 * Optimizations for low-end Android devices
 */

import React, { useMemo, useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';

// Performance monitoring
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  jsThreadTime: number;
}

// Device performance detection
export const getDevicePerformanceLevel = (): 'low' | 'medium' | 'high' => {
  // Simple heuristic based on device capabilities
  // In a real app, you'd use react-native-device-info or similar
  return 'medium'; // Default to medium for now
};

// Memoization utilities
export const useStableCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const ref = useRef(callback);
  ref.current = callback;
  return useCallback(((...args) => ref.current(...args)) as T, []);
};

export const useStableMemo = <T>(factory: () => T, deps: React.DependencyList): T => {
  return useMemo(factory, deps);
};

// Interaction manager for deferring expensive operations
export const runAfterInteractions = (callback: () => void): void => {
  InteractionManager.runAfterInteractions(() => {
    callback();
  });
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image caching optimization
export const getImageCacheStrategy = (deviceLevel: string) => {
  switch (deviceLevel) {
    case 'low':
      return {
        cacheLimit: 50, // Number of images
        compressionQuality: 0.7,
        enableFadeIn: false,
        placeholder: 'blur',
      };
    case 'medium':
      return {
        cacheLimit: 100,
        compressionQuality: 0.8,
        enableFadeIn: true,
        placeholder: 'blur',
      };
    case 'high':
      return {
        cacheLimit: 200,
        compressionQuality: 0.9,
        enableFadeIn: true,
        placeholder: 'color',
      };
    default:
      return {
        cacheLimit: 100,
        compressionQuality: 0.8,
        enableFadeIn: true,
        placeholder: 'blur',
      };
  }
};

// Animation performance optimization
export const getAnimationConfig = (deviceLevel: string) => {
  switch (deviceLevel) {
    case 'low':
      return {
        useNativeDriver: true,
        duration: 200, // Shorter animations
        reduceMotion: true,
        disableComplexAnimations: true,
      };
    case 'medium':
      return {
        useNativeDriver: true,
        duration: 300,
        reduceMotion: false,
        disableComplexAnimations: false,
      };
    case 'high':
      return {
        useNativeDriver: true,
        duration: 400, // Longer animations for smoother feel
        reduceMotion: false,
        disableComplexAnimations: false,
      };
    default:
      return {
        useNativeDriver: true,
        duration: 300,
        reduceMotion: false,
        disableComplexAnimations: false,
      };
  }
};

// List optimization for large datasets
export const getListOptimizationConfig = (deviceLevel: string) => {
  switch (deviceLevel) {
    case 'low':
      return {
        initialNumToRender: 5,
        maxToRenderPerBatch: 5,
        windowSize: 10,
        updateCellsBatchingPeriod: 50,
        removeClippedSubviews: true,
        getItemLayout: true, // Use fixed height for better performance
      };
    case 'medium':
      return {
        initialNumToRender: 10,
        maxToRenderPerBatch: 10,
        windowSize: 15,
        updateCellsBatchingPeriod: 30,
        removeClippedSubviews: true,
        getItemLayout: false,
      };
    case 'high':
      return {
        initialNumToRender: 15,
        maxToRenderPerBatch: 15,
        windowSize: 25,
        updateCellsBatchingPeriod: 10,
        removeClippedSubviews: false, // Better for smooth scrolling
        getItemLayout: false,
      };
    default:
      return {
        initialNumToRender: 10,
        maxToRenderPerBatch: 10,
        windowSize: 15,
        updateCellsBatchingPeriod: 30,
        removeClippedSubviews: true,
        getItemLayout: false,
      };
  }
};

// Memory management utilities
export const clearMemoryCache = (): void => {
  // Clear image caches
  if (global.Image && global.Image.clearCache) {
    global.Image.clearCache();
  }
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
};

// Performance monitoring
export const startPerformanceMonitoring = (): void => {
  console.log('Performance monitoring started');
  // In a real app, you'd integrate with performance monitoring tools
};

export const stopPerformanceMonitoring = (): PerformanceMetrics => {
  console.log('Performance monitoring stopped');
  return {
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    jsThreadTime: 0,
  };
};

// Lazy loading utilities
export const createLazyLoader = <T>(
  loader: () => Promise<T>,
  fallback: T
): { load: () => Promise<T>; getValue: () => T } => {
  let cachedValue: T | null = null;
  let loadingPromise: Promise<T> | null = null;

  const load = async (): Promise<T> => {
    if (cachedValue) return cachedValue;
    
    if (loadingPromise) return loadingPromise;
    
    loadingPromise = loader();
    try {
      cachedValue = await loadingPromise;
      return cachedValue;
    } finally {
      loadingPromise = null;
    }
  };

  const getValue = (): T => cachedValue || fallback;

  return { load, getValue };
};

// Component optimization HOC
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    memo?: boolean;
    debounce?: number;
    throttle?: number;
    lazy?: boolean;
  } = {}
): React.ComponentType<P> => {
  const WrappedComponent = Component;
  
  if (options.memo) {
    return React.memo(WrappedComponent);
  }
  
  return WrappedComponent;
};

// Background task scheduler
export class BackgroundTaskScheduler {
  private tasks: Array<() => Promise<void>> = [];
  private isProcessing = false;

  addTask(task: () => Promise<void>): void {
    this.tasks.push(task);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error('Background task failed:', error);
        }
      }
    }
    
    this.isProcessing = false;
  }
}

// Performance hooks
export const usePerformanceOptimization = (deviceLevel: string = 'medium') => {
  const animationConfig = useMemo(() => getAnimationConfig(deviceLevel), [deviceLevel]);
  const listConfig = useMemo(() => getListOptimizationConfig(deviceLevel), [deviceLevel]);
  const imageConfig = useMemo(() => getImageCacheStrategy(deviceLevel), [deviceLevel]);

  return {
    animationConfig,
    listConfig,
    imageConfig,
    runAfterInteractions,
    debounce,
    throttle,
    clearMemoryCache,
  };
};

export default {
  getDevicePerformanceLevel,
  useStableCallback,
  useStableMemo,
  runAfterInteractions,
  debounce,
  throttle,
  getImageCacheStrategy,
  getAnimationConfig,
  getListOptimizationConfig,
  clearMemoryCache,
  startPerformanceMonitoring,
  stopPerformanceMonitoring,
  createLazyLoader,
  withPerformanceOptimization,
  BackgroundTaskScheduler,
  usePerformanceOptimization,
};
