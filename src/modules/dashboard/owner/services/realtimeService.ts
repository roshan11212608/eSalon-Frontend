import { io, Socket } from 'socket.io-client';
import { StorageService } from '../../../../services/storage/storageService';
import { BASE_URL } from '../../../../config/api';

/**
 * Real-time Dashboard Service
 * Handles WebSocket connections for live dashboard updates
 */

export interface RealtimeEvent {
  type: 'appointment_created' | 'appointment_cancelled' | 'payment_completed' | 
        'notification_created' | 'revenue_updated' | 'staff_check_in' | 'review_received';
  data: any;
  timestamp: string;
  ownerId: number;
}

export interface RealtimeCallbacks {
  onAppointmentCreated?: (data: any) => void;
  onAppointmentCancelled?: (data: any) => void;
  onPaymentCompleted?: (data: any) => void;
  onNotificationCreated?: (data: any) => void;
  onRevenueUpdated?: (data: any) => void;
  onStaffCheckIn?: (data: any) => void;
  onReviewReceived?: (data: any) => void;
  onConnectionError?: (error: Error) => void;
  onReconnected?: () => void;
}

class RealtimeService {
  private socket: Socket | null = null;
  private callbacks: RealtimeCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private currentOwnerId: number | null = null;

  /**
   * Connect to WebSocket server for real-time updates
   */
  async connect(ownerId: number, callbacks: RealtimeCallbacks = {}): Promise<void> {
    if (this.socket?.connected && this.currentOwnerId === ownerId) {
      console.log('WebSocket already connected for owner:', ownerId);
      return;
    }

    this.callbacks = callbacks;
    this.currentOwnerId = ownerId;

    try {
      // Get auth token
      const token = await StorageService.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create socket connection
      const socketUrl = BASE_URL.replace('/api', '').replace('http', 'ws');
      console.log('Connecting to WebSocket:', socketUrl);

      this.socket = io(socketUrl, {
        auth: {
          token,
          ownerId,
        },
        transports: ['websocket'],
        upgrade: false,
        rememberUpgrade: false,
        timeout: 10000,
        forceNew: true,
      });

      this.setupEventHandlers();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log('WebSocket connected for owner:', ownerId);
          
          // Join owner-specific room
          this.socket!.emit('join_owner_room', { ownerId });
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          clearTimeout(timeout);
          console.error('WebSocket connection error:', error);
          this.handleConnectionError(error);
          reject(error);
        });
      });

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.handleConnectionError(error as Error);
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting WebSocket...');
      
      // Leave owner room
      if (this.currentOwnerId) {
        this.socket.emit('leave_owner_room', { ownerId: this.currentOwnerId });
      }
      
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentOwnerId = null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isSocketConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      this.handleDisconnection(reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Re-join owner room
      if (this.currentOwnerId) {
        this.socket!.emit('join_owner_room', { ownerId: this.currentOwnerId });
      }
      
      this.callbacks.onReconnected?.();
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
      this.handleConnectionError(error);
    });

    // Dashboard-specific events
    this.socket.on('appointment_created', (data) => {
      console.log('New appointment created:', data);
      this.callbacks.onAppointmentCreated?.(data);
    });

    this.socket.on('appointment_cancelled', (data) => {
      console.log('Appointment cancelled:', data);
      this.callbacks.onAppointmentCancelled?.(data);
    });

    this.socket.on('payment_completed', (data) => {
      console.log('Payment completed:', data);
      this.callbacks.onPaymentCompleted?.(data);
    });

    this.socket.on('notification_created', (data) => {
      console.log('New notification:', data);
      this.callbacks.onNotificationCreated?.(data);
    });

    this.socket.on('revenue_updated', (data) => {
      console.log('Revenue updated:', data);
      this.callbacks.onRevenueUpdated?.(data);
    });

    this.socket.on('staff_check_in', (data) => {
      console.log('Staff checked in:', data);
      this.callbacks.onStaffCheckIn?.(data);
    });

    this.socket.on('review_received', (data) => {
      console.log('New review received:', data);
      this.callbacks.onReviewReceived?.(data);
    });

    // Room management events
    this.socket.on('room_joined', (data) => {
      console.log('Joined room:', data);
    });

    this.socket.on('room_left', (data) => {
      console.log('Left room:', data);
    });

    this.socket.on('room_error', (error) => {
      console.error('Room error:', error);
    });
  }

  /**
   * Handle connection errors with exponential backoff
   */
  private handleConnectionError(error: Error): void {
    this.callbacks.onConnectionError?.(error);
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      
      setTimeout(() => {
        if (this.currentOwnerId) {
          this.connect(this.currentOwnerId, this.callbacks).catch(console.error);
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Handle disconnection
   */
  private handleDisconnection(reason: string): void {
    if (reason === 'io server disconnect') {
      // Server initiated disconnect, don't reconnect
      console.log('Server disconnected, not reconnecting');
      this.disconnect();
    } else {
      // Network error or client disconnect, try to reconnect
      console.log('Network disconnect, will attempt reconnection');
    }
  }

  /**
   * Send a custom event to server
   */
  sendEvent(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Cannot send event - WebSocket not connected');
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean;
    ownerId: number | null;
    reconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      ownerId: this.currentOwnerId,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();

export default realtimeService;
