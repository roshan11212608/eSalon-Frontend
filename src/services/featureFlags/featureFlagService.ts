/**
 * Feature Flag Service
 * Manages feature flags for scalable architecture and A/B testing
 */

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  conditions?: FeatureFlagCondition[];
  metadata?: Record<string, any>;
}

export interface FeatureFlagCondition {
  type: 'user_id' | 'user_role' | 'shop_id' | 'platform' | 'version' | 'custom';
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: string | number;
}

export interface UserContext {
  userId?: string;
  userRole?: string;
  shopId?: string;
  platform?: string;
  appVersion?: string;
  customAttributes?: Record<string, any>;
}

class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Map<string, FeatureFlag> = new Map();
  private userContext: UserContext = {};
  private remoteConfigEnabled = false;

  static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  /**
   * Initialize feature flags with default configuration
   */
  async initialize(userContext?: UserContext): Promise<void> {
    if (userContext) {
      this.userContext = userContext;
    }

    // Load default feature flags
    await this.loadDefaultFlags();
    
    // Load remote flags if enabled
    if (this.remoteConfigEnabled) {
      await this.loadRemoteFlags();
    }

    console.log('Feature flags initialized');
  }

  /**
   * Load default feature flags
   */
  private async loadDefaultFlags(): Promise<void> {
    const defaultFlags: FeatureFlag[] = [
      // Dashboard features
      {
        key: 'dashboard_unified_api',
        enabled: true,
        description: 'Use unified dashboard API endpoint',
        rolloutPercentage: 100,
      },
      {
        key: 'dashboard_realtime_updates',
        enabled: true,
        description: 'Enable real-time dashboard updates',
        rolloutPercentage: 100,
      },
      {
        key: 'dashboard_business_insights',
        enabled: true,
        description: 'Show business insights on dashboard',
        rolloutPercentage: 100,
      },
      {
        key: 'dashboard_advanced_analytics',
        enabled: false,
        description: 'Enable advanced analytics features',
        rolloutPercentage: 50,
        conditions: [
          {
            type: 'user_role',
            operator: 'equals',
            value: 'owner',
          },
        ],
      },

      // Offline features
      {
        key: 'offline_mode_enabled',
        enabled: true,
        description: 'Enable offline-first functionality',
        rolloutPercentage: 100,
      },
      {
        key: 'offline_sync_background',
        enabled: true,
        description: 'Enable background sync for offline data',
        rolloutPercentage: 80,
      },

      // Notification features
      {
        key: 'push_notifications_enabled',
        enabled: true,
        description: 'Enable push notifications',
        rolloutPercentage: 100,
      },
      {
        key: 'notification_groups',
        enabled: true,
        description: 'Group notifications by type',
        rolloutPercentage: 100,
      },

      // Theme features
      {
        key: 'dark_mode_enabled',
        enabled: true,
        description: 'Enable dark mode theme',
        rolloutPercentage: 100,
      },
      {
        key: 'custom_branding',
        enabled: false,
        description: 'Enable custom salon branding',
        rolloutPercentage: 25,
      },

      // Performance features
      {
        key: 'performance_optimization',
        enabled: true,
        description: 'Enable performance optimizations',
        rolloutPercentage: 100,
      },
      {
        key: 'advanced_caching',
        enabled: true,
        description: 'Enable advanced caching strategies',
        rolloutPercentage: 90,
      },

      // AI/ML features (future)
      {
        key: 'ai_insights',
        enabled: false,
        description: 'Enable AI-powered business insights',
        rolloutPercentage: 10,
        conditions: [
          {
            type: 'user_role',
            operator: 'equals',
            value: 'owner',
          },
        ],
      },
      {
        key: 'smart_recommendations',
        enabled: false,
        description: 'Enable smart service recommendations',
        rolloutPercentage: 15,
      },

      // Multi-branch features (future)
      {
        key: 'multi_branch_support',
        enabled: false,
        description: 'Enable multi-branch salon management',
        rolloutPercentage: 5,
        conditions: [
          {
            type: 'user_role',
            operator: 'equals',
            value: 'admin',
          },
        ],
      },

      // Analytics features
      {
        key: 'advanced_analytics',
        enabled: true,
        description: 'Enable advanced analytics tracking',
        rolloutPercentage: 100,
      },
      {
        key: 'crash_reporting',
        enabled: true,
        description: 'Enable crash reporting',
        rolloutPercentage: 100,
      },

      // Security features
      {
        key: 'enhanced_security',
        enabled: true,
        description: 'Enable enhanced security features',
        rolloutPercentage: 100,
      },
      {
        key: 'biometric_auth',
        enabled: false,
        description: 'Enable biometric authentication',
        rolloutPercentage: 75,
      },

      // UI/UX features
      {
        key: 'microinteractions',
        enabled: true,
        description: 'Enable micro-interactions and animations',
        rolloutPercentage: 85,
      },
      {
        key: 'haptic_feedback',
        enabled: true,
        description: 'Enable haptic feedback',
        rolloutPercentage: 90,
      },
    ];

    // Store flags
    defaultFlags.forEach(flag => {
      this.flags.set(flag.key, flag);
    });
  }

  /**
   * Load remote flags from server
   */
  private async loadRemoteFlags(): Promise<void> {
    try {
      // In a real implementation, this would fetch from your remote config service
      // For now, we'll simulate it
      console.log('Loading remote feature flags...');
      
      // Example: const remoteFlags = await remoteConfigService.getFeatureFlags();
      // remoteFlags.forEach(flag => this.flags.set(flag.key, flag));
    } catch (error) {
      console.error('Failed to load remote flags:', error);
    }
  }

  /**
   * Check if a feature flag is enabled
   */
  isEnabled(flagKey: string, context?: UserContext): boolean {
    const flag = this.flags.get(flagKey);
    if (!flag) {
      console.warn(`Feature flag '${flagKey}' not found`);
      return false;
    }

    // Check basic enabled status
    if (!flag.enabled) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage && flag.rolloutPercentage < 100) {
      const hash = this.generateHash(flagKey, context || this.userContext);
      const rolloutValue = hash % 100;
      if (rolloutValue >= flag.rolloutPercentage) {
        return false;
      }
    }

    // Check conditions
    if (flag.conditions && flag.conditions.length > 0) {
      return this.evaluateConditions(flag.conditions, context || this.userContext);
    }

    return true;
  }

  /**
   * Evaluate feature flag conditions
   */
  private evaluateConditions(conditions: FeatureFlagCondition[], context: UserContext): boolean {
    return conditions.every(condition => {
      const contextValue = this.getContextValue(condition.type, context);
      return this.evaluateCondition(condition, contextValue);
    });
  }

  /**
   * Get context value for condition evaluation
   */
  private getContextValue(type: string, context: UserContext): any {
    switch (type) {
      case 'user_id':
        return context.userId;
      case 'user_role':
        return context.userRole;
      case 'shop_id':
        return context.shopId;
      case 'platform':
        return context.platform;
      case 'version':
        return context.appVersion;
      case 'custom':
        return context.customAttributes;
      default:
        return null;
    }
  }

  /**
   * Evaluate individual condition
   */
  private evaluateCondition(condition: FeatureFlagCondition, contextValue: any): boolean {
    if (contextValue === null || contextValue === undefined) {
      return false;
    }

    switch (condition.operator) {
      case 'equals':
        return contextValue === condition.value;
      case 'contains':
        return String(contextValue).includes(String(condition.value));
      case 'starts_with':
        return String(contextValue).startsWith(String(condition.value));
      case 'ends_with':
        return String(contextValue).endsWith(String(condition.value));
      case 'greater_than':
        return Number(contextValue) > Number(condition.value);
      case 'less_than':
        return Number(contextValue) < Number(condition.value);
      default:
        return false;
    }
  }

  /**
   * Generate hash for rollout percentage
   */
  private generateHash(flagKey: string, context: UserContext): number {
    const input = `${flagKey}-${context.userId || 'anonymous'}-${context.shopId || 'default'}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  /**
   * Get feature flag by key
   */
  getFlag(flagKey: string): FeatureFlag | undefined {
    return this.flags.get(flagKey);
  }

  /**
   * Update feature flag (for testing or admin)
   */
  updateFlag(flagKey: string, updates: Partial<FeatureFlag>): void {
    const existingFlag = this.flags.get(flagKey);
    if (existingFlag) {
      const updatedFlag = { ...existingFlag, ...updates };
      this.flags.set(flagKey, updatedFlag);
    }
  }

  /**
   * Set user context
   */
  setUserContext(context: UserContext): void {
    this.userContext = context;
  }

  /**
   * Enable/disable remote config
   */
  setRemoteConfigEnabled(enabled: boolean): void {
    this.remoteConfigEnabled = enabled;
  }

  /**
   * Get feature flag statistics
   */
  getStatistics(): {
    totalFlags: number;
    enabledFlags: number;
    flagsWithRollout: number;
    flagsWithConditions: number;
  } {
    const allFlags = this.getAllFlags();
    return {
      totalFlags: allFlags.length,
      enabledFlags: allFlags.filter(flag => flag.enabled).length,
      flagsWithRollout: allFlags.filter(flag => flag.rolloutPercentage && flag.rolloutPercentage < 100).length,
      flagsWithConditions: allFlags.filter(flag => flag.conditions && flag.conditions.length > 0).length,
    };
  }
}

// Convenience hooks for React components
export const useFeatureFlag = (flagKey: string, context?: UserContext) => {
  const service = FeatureFlagService.getInstance();
  return service.isEnabled(flagKey, context);
};

export const useFeatureFlags = (flagKeys: string[], context?: UserContext) => {
  const service = FeatureFlagService.getInstance();
  return flagKeys.reduce((acc, key) => {
    acc[key] = service.isEnabled(key, context);
    return acc;
  }, {} as Record<string, boolean>);
};

// Predefined feature flag groups
export const DASHBOARD_FEATURES = {
  UNIFIED_API: 'dashboard_unified_api',
  REALTIME_UPDATES: 'dashboard_realtime_updates',
  BUSINESS_INSIGHTS: 'dashboard_business_insights',
  ADVANCED_ANALYTICS: 'dashboard_advanced_analytics',
};

export const OFFLINE_FEATURES = {
  OFFLINE_MODE: 'offline_mode_enabled',
  BACKGROUND_SYNC: 'offline_sync_background',
};

export const NOTIFICATION_FEATURES = {
  PUSH_NOTIFICATIONS: 'push_notifications_enabled',
  NOTIFICATION_GROUPS: 'notification_groups',
};

export const THEME_FEATURES = {
  DARK_MODE: 'dark_mode_enabled',
  CUSTOM_BRANDING: 'custom_branding',
};

export const PERFORMANCE_FEATURES = {
  OPTIMIZATION: 'performance_optimization',
  ADVANCED_CACHING: 'advanced_caching',
};

export const featureFlagService = FeatureFlagService.getInstance();
export default featureFlagService;
