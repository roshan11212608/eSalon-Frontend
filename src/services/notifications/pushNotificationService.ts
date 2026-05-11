import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import { Platform, Alert, Linking, PermissionsAndroid } from 'react-native';
import { StorageService } from '../storage/storageService';

/**
 * Firebase Cloud Messaging Service
 * Handles push notifications, permissions, and deep linking
 */

export interface PushNotificationData {
  type: 'new_booking' | 'cancellation' | 'payment_success' | 'low_appointments' | 
        'staff_absence' | 'review_received' | 'revenue_update';
  title: string;
  body: string;
  data?: Record<string, string>;
  deepLink?: string;
}

export interface NotificationPermissionStatus {
  enabled: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'blocked' | 'not_determined';
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private unsubscribeOnMessage: (() => void) | null = null;
  private unsubscribeOnTokenRefresh: (() => void) | null = null;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing push notifications...');
      
      // Request permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Push notification permission denied');
        return false;
      }

      // Get FCM token
      const token = await this.getFCMToken();
      if (token) {
        console.log('FCM Token obtained:', token.substring(0, 20) + '...');
        await this.saveTokenToStorage(token);
        await this.registerTokenWithServer(token);
      }

      // Set up message handlers
      this.setupMessageHandlers();
      this.setupTokenRefreshHandler();

      // Set up background message handler
      messaging().setBackgroundMessageHandler(this.handleBackgroundMessage);

      console.log('Push notifications initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
        console.log('iOS permission status:', authStatus);
        return enabled;
      } else {
        // Android
        if (Platform.Version >= 33) {
          // Android 13+ requires POST_NOTIFICATIONS permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // Android < 13 doesn't require explicit permission
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get current permission status
   */
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      const authStatus = await messaging().hasPermission();
      
      let status: 'granted' | 'denied' | 'blocked' | 'not_determined';
      let canAskAgain = true;
      
      switch (authStatus) {
        case messaging.AuthorizationStatus.AUTHORIZED:
        case messaging.AuthorizationStatus.PROVISIONAL:
          status = 'granted';
          canAskAgain = false;
          break;
        case messaging.AuthorizationStatus.DENIED:
          status = 'denied';
          canAskAgain = true;
          break;
        case messaging.AuthorizationStatus.EPHEMERAL:
          status = 'granted';
          canAskAgain = false;
          break;
        default:
          status = 'not_determined';
          canAskAgain = true;
      }
      
      return {
        enabled: status === 'granted',
        canAskAgain,
        status,
      };
    } catch (error) {
      console.error('Error getting permission status:', error);
      return {
        enabled: false,
        canAskAgain: true,
        status: 'not_determined',
      };
    }
  }

  /**
   * Get FCM token
   */
  async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Save FCM token to local storage
   */
  private async saveTokenToStorage(token: string): Promise<void> {
    try {
      await StorageService.setFCMToken(token);
      console.log('FCM token saved to storage');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }

  /**
   * Register FCM token with server
   */
  private async registerTokenWithServer(token: string): Promise<void> {
    try {
      const user = await StorageService.getUserData();
      if (!user?.id) {
        console.log('No user found for token registration');
        return;
      }

      // Here you would make an API call to register the token
      console.log('Registering FCM token for user:', user.id);
      
      // Example API call (implement this with your actual API)
      // await apiService.post('/notifications/register-token', {
      //   userId: user.id,
      //   token,
      //   platform: Platform.OS,
      // });
    } catch (error) {
      console.error('Error registering token with server:', error);
    }
  }

  /**
   * Set up foreground message handler
   */
  private setupMessageHandlers(): void {
    this.unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('Received foreground message:', remoteMessage);
      
      // Handle the message
      await this.handleMessage(remoteMessage);
      
      // Track analytics
      await analytics().logEvent('push_notification_received', {
        type: remoteMessage.data?.type || 'unknown',
        foreground: true,
      });
    });
  }

  /**
   * Set up token refresh handler
   */
  private setupTokenRefreshHandler(): void {
    this.unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (token) => {
      console.log('FCM token refreshed:', token.substring(0, 20) + '...');
      
      await this.saveTokenToStorage(token);
      await this.registerTokenWithServer(token);
    });
  }

  /**
   * Handle incoming message
   */
  private async handleMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    const { notification, data } = remoteMessage;
    
    if (!notification && !data) {
      console.log('Message has no notification or data');
      return;
    }

    // Show custom in-app notification for foreground messages
    if (notification) {
      this.showInAppNotification({
        type: (data?.type as any) || 'general',
        title: notification.title || 'New Notification',
        body: notification.body || '',
        data,
        deepLink: data?.deepLink,
      });
    }

    // Handle deep link if present
    if (data?.deepLink) {
      this.handleDeepLink(data.deepLink);
    }

    // Update notification badge
    await this.updateNotificationBadge();
  }

  /**
   * Handle background message
   */
  private async handleBackgroundMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    console.log('Received background message:', remoteMessage);
    
    // Track analytics
    await analytics().logEvent('push_notification_received', {
      type: remoteMessage.data?.type || 'unknown',
      foreground: false,
    });
  }

  /**
   * Show in-app notification (for foreground messages)
   */
  private showInAppNotification(notification: PushNotificationData): void {
    // You can implement a custom in-app notification component here
    // For now, we'll use Alert as a simple implementation
    Alert.alert(
      notification.title,
      notification.body,
      [
        {
          text: 'Dismiss',
          style: 'cancel',
        },
        {
          text: 'View',
          onPress: () => {
            if (notification.deepLink) {
              this.handleDeepLink(notification.deepLink);
            }
          },
        },
      ]
    );
  }

  /**
   * Handle deep linking
   */
  private handleDeepLink(deepLink: string): void {
    console.log('Handling deep link:', deepLink);
    
    try {
      // Use Linking to open the deep link
      Linking.openURL(deepLink).catch((error) => {
        console.error('Error opening deep link:', error);
      });
      
      // Track analytics
      analytics().logEvent('deep_link_opened', {
        url: deepLink,
        source: 'push_notification',
      });
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  }

  /**
   * Update notification badge count
   */
  private async updateNotificationBadge(): Promise<void> {
    try {
      // Here you would update the badge count
      // This could involve fetching unread count from server
      console.log('Updating notification badge...');
    } catch (error) {
      console.error('Error updating notification badge:', error);
    }
  }

  /**
   * Send local notification (for testing or immediate notifications)
   */
  async sendLocalNotification(notification: PushNotificationData): Promise<void> {
    try {
      // This would use a local notification library like react-native-push-notification
      console.log('Sending local notification:', notification);
      
      // For now, just show an alert
      Alert.alert(notification.title, notification.body);
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<void> {
    try {
      // Unregister token from server
      const token = await this.getFCMToken();
      if (token) {
        console.log('Unregistering FCM token...');
        // await apiService.post('/notifications/unregister-token', { token });
      }

      // Clean up listeners
      if (this.unsubscribeOnMessage) {
        this.unsubscribeOnMessage();
        this.unsubscribeOnMessage = null;
      }
      
      if (this.unsubscribeOnTokenRefresh) {
        this.unsubscribeOnTokenRefresh();
        this.unsubscribeOnTokenRefresh = null;
      }

      // Delete token
      await messaging().deleteToken();
      
      console.log('Push notifications unsubscribed');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<{
    enabled: boolean;
    types: Record<string, boolean>;
  }> {
    try {
      const permissionStatus = await this.getPermissionStatus();
      
      // Get user preferences from storage
      const preferences = await StorageService.getNotificationPreferences();
      
      return {
        enabled: permissionStatus.enabled,
        types: {
          new_booking: preferences?.newBooking ?? true,
          cancellation: preferences?.cancellation ?? true,
          payment_success: preferences?.paymentSuccess ?? true,
          low_appointments: preferences?.lowAppointments ?? true,
          staff_absence: preferences?.staffAbsence ?? true,
          review_received: preferences?.reviewReceived ?? true,
          revenue_update: preferences?.revenueUpdate ?? false, // Usually disabled by default
        },
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {
        enabled: false,
        types: {},
      };
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: Record<string, boolean>): Promise<void> {
    try {
      await StorageService.setNotificationPreferences(settings);
      console.log('Notification settings updated:', settings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  /**
   * Test notification (for development)
   */
  async sendTestNotification(): Promise<void> {
    try {
      await this.sendLocalNotification({
        type: 'new_booking',
        title: 'Test Notification',
        body: 'This is a test notification from eSalon',
        data: {
          test: 'true',
          timestamp: Date.now().toString(),
        },
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
export default pushNotificationService;
