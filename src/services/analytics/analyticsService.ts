/**
 * Analytics and Monitoring Service
 * Integrates Sentry for error tracking and Firebase Analytics for user analytics
 */

import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';

// Analytics event types
export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

// Error tracking types
export interface ErrorContext {
  userId?: string;
  screen?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

// Performance metrics
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'milliseconds' | 'bytes' | 'count';
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize analytics services
   */
  async initialize(): Promise<void> {
    try {
      // Initialize Sentry
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with actual DSN
        environment: __DEV__ ? 'development' : 'production',
        enableAutoSessionTracking: true,
        enableAutoWatchdogTerminationTracking: true,
        enablePerformanceMonitoring: true,
        beforeSend: (event) => {
          // Filter out sensitive data
          if (event.exception) {
            // Add custom context if needed
            event.contexts = {
              ...event.contexts,
              app: {
                ...event.contexts?.app,
                version: '1.0.0', // Get from app version
              },
            };
          }
          return event;
        },
      });

      // Set up user context
      await this.setUserContext();

      this.isInitialized = true;
      console.log('Analytics service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics service:', error);
    }
  }

  /**
   * Set user context for analytics
   */
  async setUserContext(): Promise<void> {
    try {
      // Get user data from storage
      const userData = await this.getUserData();
      
      if (userData?.id) {
        // Set Sentry user
        Sentry.setUser({
          id: userData.id,
          email: userData.email,
          username: userData.name,
        });

        // Set Firebase user ID
        await analytics().setUserId(userData.id);
        
        // Set user properties
        await analytics().setUserProperty('user_role', userData.role);
        await analytics().setUserProperty('shop_name', userData.shopName || '');
      }
    } catch (error) {
      console.error('Failed to set user context:', error);
    }
  }

  /**
   * Track custom analytics event
   */
  async trackEvent(eventName: string, parameters?: Record<string, any>): Promise<void> {
    try {
      if (!this.isInitialized) return;

      // Track with Firebase Analytics
      await analytics().logEvent(eventName, parameters);

      // Track with Sentry for debugging (in development)
      if (__DEV__) {
        Sentry.addBreadcrumb({
          message: `Analytics Event: ${eventName}`,
          category: 'analytics',
          level: 'info',
          data: parameters,
        });
      }

      console.log('Analytics event tracked:', eventName, parameters);
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  /**
   * Track screen view
   */
  async trackScreen(screenName: string, screenClass?: string): Promise<void> {
    try {
      if (!this.isInitialized) return;

      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });

      // Add breadcrumb for Sentry
      Sentry.addBreadcrumb({
        message: `Screen View: ${screenName}`,
        category: 'navigation',
        level: 'info',
      });

      console.log('Screen view tracked:', screenName);
    } catch (error) {
      console.error('Failed to track screen view:', error);
    }
  }

  /**
   * Track user engagement
   */
  async trackUserEngagement(): Promise<void> {
    try {
      if (!this.isInitialized) return;

      await analytics().logAppOpen();
      console.log('User engagement tracked');
    } catch (error) {
      console.error('Failed to track user engagement:', error);
    }
  }

  /**
   * Track error with Sentry
   */
  trackError(error: Error, context?: ErrorContext): void {
    try {
      if (!this.isInitialized) return;

      // Add context
      if (context) {
        Sentry.setContext('error_context', {
          screen: context.screen,
          action: context.action,
          ...context.additionalData,
        });
      }

      // Capture the error
      Sentry.captureException(error);

      // Also track as analytics event for monitoring
      this.trackEvent('error_occurred', {
        error_message: error.message,
        error_name: error.name,
        screen: context?.screen,
        action: context?.action,
      });

      console.log('Error tracked:', error.message);
    } catch (e) {
      console.error('Failed to track error:', e);
    }
  }

  /**
   * Track performance metric
   */
  async trackPerformanceMetric(metric: PerformanceMetric): Promise<void> {
    try {
      if (!this.isInitialized) return;

      // Track with Firebase Analytics
      await this.trackEvent('performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
      });

      // Track with Sentry
      Sentry.addBreadcrumb({
        message: `Performance Metric: ${metric.name}`,
        category: 'performance',
        level: 'info',
        data: {
          value: metric.value,
          unit: metric.unit,
        },
      });

      console.log('Performance metric tracked:', metric);
    } catch (error) {
      console.error('Failed to track performance metric:', error);
    }
  }

  /**
   * Track API call
   */
  async trackApiCall(
    endpoint: string,
    method: string,
    duration: number,
    success: boolean,
    statusCode?: number
  ): Promise<void> {
    try {
      if (!this.isInitialized) return;

      await this.trackEvent('api_call', {
        endpoint,
        method,
        duration,
        success,
        status_code: statusCode,
      });

      // Add breadcrumb for Sentry
      Sentry.addBreadcrumb({
        message: `API Call: ${method} ${endpoint}`,
        category: 'http',
        level: success ? 'info' : 'error',
        data: {
          endpoint,
          method,
          duration,
          success,
          status_code: statusCode,
        },
      });

      console.log('API call tracked:', endpoint, success);
    } catch (error) {
      console.error('Failed to track API call:', error);
    }
  }

  /**
   * Track user interaction
   */
  async trackUserInteraction(
    element: string,
    action: string,
    screen?: string
  ): Promise<void> {
    try {
      if (!this.isInitialized) return;

      await this.trackEvent('user_interaction', {
        element,
        action,
        screen,
      });

      console.log('User interaction tracked:', element, action);
    } catch (error) {
      console.error('Failed to track user interaction:', error);
    }
  }

  /**
   * Track dashboard specific events
   */
  async trackDashboardEvent(
    event: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      if (!this.isInitialized) return;

      await this.trackEvent(`dashboard_${event}`, {
        ...data,
        timestamp: Date.now(),
      });

      console.log('Dashboard event tracked:', event);
    } catch (error) {
      console.error('Failed to track dashboard event:', error);
    }
  }

  /**
   * Track business metrics
   */
  async trackBusinessMetric(
    metric: string,
    value: number,
    currency?: string
  ): Promise<void> {
    try {
      if (!this.isInitialized) return;

      await this.trackEvent('business_metric', {
        metric_name: metric,
        metric_value: value,
        currency: currency || 'INR',
      });

      console.log('Business metric tracked:', metric, value);
    } catch (error) {
      console.error('Failed to track business metric:', error);
    }
  }

  /**
   * Get user data from storage
   */
  private async getUserData(): Promise<any> {
    try {
      // This would use your actual storage service
      // For now, return null
      return null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  /**
   * Clear user context (for logout)
   */
  async clearUserContext(): Promise<void> {
    try {
      // Clear Sentry user
      Sentry.setUser(null);

      // Clear Firebase user ID
      await analytics().setUserId(null);

      console.log('User context cleared');
    } catch (error) {
      console.error('Failed to clear user context:', error);
    }
  }

  /**
   * Get crash reporting status
   */
  getCrashReportingStatus(): boolean {
    return this.isInitialized;
  }

  /**
   * Enable/disable crash reporting
   */
  setCrashReportingEnabled(enabled: boolean): void {
    // This would be used for user preferences
    Sentry.getCurrentScope().setUser(enabled ? { id: 'enabled' } : null);
  }
}

// Predefined analytics events for dashboard
export const DashboardAnalytics = {
  // Dashboard events
  DASHBOARD_LOADED: 'dashboard_loaded',
  DASHBOARD_REFRESH: 'dashboard_refresh',
  DASHBOARD_ERROR: 'dashboard_error',
  
  // Financial events
  REVENUE_VIEWED: 'revenue_viewed',
  FINANCIAL_FILTER_CHANGED: 'financial_filter_changed',
  
  // Appointment events
  APPOINTMENT_VIEWED: 'appointment_viewed',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  
  // Notification events
  NOTIFICATION_VIEWED: 'notification_viewed',
  NOTIFICATION_READ: 'notification_read',
  NOTIFICATION_CLEARED: 'notification_cleared',
  
  // Settings events
  SETTINGS_OPENED: 'settings_opened',
  THEME_CHANGED: 'theme_changed',
  OFFLINE_MODE_TOGGLED: 'offline_mode_toggled',
};

export const analyticsService = AnalyticsService.getInstance();
export default analyticsService;
