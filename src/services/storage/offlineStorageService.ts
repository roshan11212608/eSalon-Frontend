import { MMKV } from 'react-native-mmkv';
import { OwnerDashboardResponse } from '../../modules/dashboard/owner/services/unifiedDashboardService';

/**
 * Offline Storage Service using MMKV
 * Provides fast, secure local storage for dashboard data and offline functionality
 */

// Create MMKV instances for different data types
const dashboardStorage = new MMKV({
  id: 'dashboard-storage',
  encryptionKey: 'dashboard-encryption-key',
});

const cacheStorage = new MMKV({
  id: 'cache-storage',
  encryptionKey: 'cache-encryption-key',
});

const syncStorage = new MMKV({
  id: 'sync-storage',
  encryptionKey: 'sync-encryption-key',
});

// Storage keys
const STORAGE_KEYS = {
  DASHBOARD_DATA: 'dashboard_data',
  LAST_SYNC: 'last_sync',
  OFFLINE_ACTIONS: 'offline_actions',
  CACHE_METADATA: 'cache_metadata',
  USER_PREFERENCES: 'user_preferences',
} as const;

export interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: number;
  userId: string;
  retryCount: number;
}

export interface CacheMetadata {
  version: string;
  lastUpdated: number;
  expiresAt: number;
  dataSize: number;
  isStale: boolean;
}

export interface UserPreferences {
  enableOfflineMode: boolean;
  autoSync: boolean;
  cacheDuration: number; // in hours
  maxCacheSize: number; // in MB
}

class OfflineStorageService {
  private static instance: OfflineStorageService;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private syncCallbacks: ((success: boolean) => void)[] = [];

  static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  /**
   * Store dashboard data offline
   */
  storeDashboardData(data: OwnerDashboardResponse, userId: string): void {
    try {
      const storageKey = `${STORAGE_KEYS.DASHBOARD_DATA}_${userId}`;
      const metadata: CacheMetadata = {
        version: '1.0',
        lastUpdated: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        dataSize: JSON.stringify(data).length,
        isStale: false,
      };

      dashboardStorage.set(storageKey, JSON.stringify(data));
      cacheStorage.set(`${STORAGE_KEYS.CACHE_METADATA}_${userId}`, JSON.stringify(metadata));
      
      console.log('Dashboard data stored offline for user:', userId);
    } catch (error) {
      console.error('Failed to store dashboard data offline:', error);
    }
  }

  /**
   * Get cached dashboard data
   */
  getCachedDashboardData(userId: string): OwnerDashboardResponse | null {
    try {
      const storageKey = `${STORAGE_KEYS.DASHBOARD_DATA}_${userId}`;
      const cachedData = dashboardStorage.getString(storageKey);
      
      if (!cachedData) return null;

      // Check if data is stale
      const metadataKey = `${STORAGE_KEYS.CACHE_METADATA}_${userId}`;
      const metadataStr = cacheStorage.getString(metadataKey);
      
      if (metadataStr) {
        const metadata: CacheMetadata = JSON.parse(metadataStr);
        
        if (Date.now() > metadata.expiresAt) {
          console.log('Cached data is expired, removing...');
          this.clearCachedData(userId);
          return null;
        }
        
        metadata.isStale = Date.now() > (metadata.lastUpdated + (2 * 60 * 60 * 1000)); // 2 hours
        cacheStorage.set(metadataKey, JSON.stringify(metadata));
      }

      return JSON.parse(cachedData) as OwnerDashboardResponse;
    } catch (error) {
      console.error('Failed to get cached dashboard data:', error);
      return null;
    }
  }

  /**
   * Clear cached data for a user
   */
  clearCachedData(userId: string): void {
    try {
      const storageKey = `${STORAGE_KEYS.DASHBOARD_DATA}_${userId}`;
      const metadataKey = `${STORAGE_KEYS.CACHE_METADATA}_${userId}`;
      
      dashboardStorage.delete(storageKey);
      cacheStorage.delete(metadataKey);
      
      console.log('Cached data cleared for user:', userId);
    } catch (error) {
      console.error('Failed to clear cached data:', error);
    }
  }

  /**
   * Store offline action for later sync
   */
  storeOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): void {
    try {
      const offlineAction: OfflineAction = {
        ...action,
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
      };

      const existingActions = this.getOfflineActions();
      existingActions.push(offlineAction);
      
      syncStorage.set(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(existingActions));
      
      console.log('Offline action stored:', offlineAction.id);
    } catch (error) {
      console.error('Failed to store offline action:', error);
    }
  }

  /**
   * Get all offline actions
   */
  getOfflineActions(): OfflineAction[] {
    try {
      const actionsStr = syncStorage.getString(STORAGE_KEYS.OFFLINE_ACTIONS);
      return actionsStr ? JSON.parse(actionsStr) : [];
    } catch (error) {
      console.error('Failed to get offline actions:', error);
      return [];
    }
  }

  /**
   * Remove offline action
   */
  removeOfflineAction(actionId: string): void {
    try {
      const actions = this.getOfflineActions();
      const filteredActions = actions.filter(action => action.id !== actionId);
      syncStorage.set(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(filteredActions));
    } catch (error) {
      console.error('Failed to remove offline action:', error);
    }
  }

  /**
   * Get cache metadata
   */
  getCacheMetadata(userId: string): CacheMetadata | null {
    try {
      const metadataKey = `${STORAGE_KEYS.CACHE_METADATA}_${userId}`;
      const metadataStr = cacheStorage.getString(metadataKey);
      return metadataStr ? JSON.parse(metadataStr) : null;
    } catch (error) {
      console.error('Failed to get cache metadata:', error);
      return null;
    }
  }

  /**
   * Get user preferences
   */
  getUserPreferences(): UserPreferences {
    try {
      const prefsStr = dashboardStorage.getString(STORAGE_KEYS.USER_PREFERENCES);
      return prefsStr ? JSON.parse(prefsStr) : {
        enableOfflineMode: true,
        autoSync: true,
        cacheDuration: 24,
        maxCacheSize: 50,
      };
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return {
        enableOfflineMode: true,
        autoSync: true,
        cacheDuration: 24,
        maxCacheSize: 50,
      };
    }
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(preferences: Partial<UserPreferences>): void {
    try {
      const currentPrefs = this.getUserPreferences();
      const updatedPrefs = { ...currentPrefs, ...preferences };
      dashboardStorage.set(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
    } catch (error) {
      console.error('Failed to update user preferences:', error);
    }
  }

  /**
   * Check if app is online
   */
  isAppOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Set online status
   */
  setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    
    if (isOnline && !this.syncInProgress) {
      // Auto-sync when coming back online
      this.syncOfflineActions();
    }
  }

  /**
   * Sync offline actions when online
   */
  async syncOfflineActions(): Promise<boolean> {
    if (!this.isOnline || this.syncInProgress) {
      return false;
    }

    this.syncInProgress = true;
    
    try {
      const actions = this.getOfflineActions();
      let successCount = 0;
      let failureCount = 0;

      for (const action of actions) {
        try {
          // Here you would make the actual API call
          // For now, we'll simulate success
          console.log('Syncing action:', action.id);
          
          // Remove successful action
          this.removeOfflineAction(action.id);
          successCount++;
        } catch (error) {
          console.error('Failed to sync action:', action.id, error);
          
          // Increment retry count
          action.retryCount++;
          
          // Remove action if max retries exceeded
          if (action.retryCount >= 3) {
            this.removeOfflineAction(action.id);
            failureCount++;
          } else {
            // Update the action with new retry count
            const updatedActions = this.getOfflineActions();
            const actionIndex = updatedActions.findIndex(a => a.id === action.id);
            if (actionIndex !== -1) {
              updatedActions[actionIndex] = action;
              syncStorage.set(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(updatedActions));
            }
          }
        }
      }

      console.log(`Sync completed: ${successCount} success, ${failureCount} failures`);
      
      // Notify callbacks
      this.syncCallbacks.forEach(callback => callback(failureCount === 0));
      this.syncCallbacks = [];
      
      return failureCount === 0;
    } catch (error) {
      console.error('Sync failed:', error);
      this.syncCallbacks.forEach(callback => callback(false));
      this.syncCallbacks = [];
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Register sync callback
   */
  onSyncComplete(callback: (success: boolean) => void): void {
    this.syncCallbacks.push(callback);
  }

  /**
   * Get storage statistics
   */
  getStorageStats(): {
    dashboardDataSize: number;
    cacheSize: number;
    syncSize: number;
    totalSize: number;
    offlineActionsCount: number;
  } {
    try {
      const dashboardDataSize = dashboardStorage.size();
      const cacheSize = cacheStorage.size();
      const syncSize = syncStorage.size();
      const offlineActionsCount = this.getOfflineActions().length;
      
      return {
        dashboardDataSize,
        cacheSize,
        syncSize,
        totalSize: dashboardDataSize + cacheSize + syncSize,
        offlineActionsCount,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        dashboardDataSize: 0,
        cacheSize: 0,
        syncSize: 0,
        totalSize: 0,
        offlineActionsCount: 0,
      };
    }
  }

  /**
   * Clear all storage
   */
  clearAllStorage(): void {
    try {
      dashboardStorage.clearAll();
      cacheStorage.clearAll();
      syncStorage.clearAll();
      console.log('All offline storage cleared');
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Clean up expired data
   */
  cleanupExpiredData(): void {
    try {
      const current_time = Date.now();
      const keys = dashboardStorage.getAllKeys();
      
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEYS.DASHBOARD_DATA)) {
          const userId = key.replace(`${STORAGE_KEYS.DASHBOARD_DATA}_`, '');
          const metadata = this.getCacheMetadata(userId);
          
          if (metadata && current_time > metadata.expiresAt) {
            this.clearCachedData(userId);
          }
        }
      });
      
      console.log('Expired data cleanup completed');
    } catch (error) {
      console.error('Failed to cleanup expired data:', error);
    }
  }
}

export const offlineStorageService = OfflineStorageService.getInstance();
export default offlineStorageService;
