// Simple store setup for future Redux implementation
// For now, this will be a placeholder until Redux is properly installed

export interface RootState {
  // Add root state interface here when Redux is implemented
  auth?: {
    token?: string;
    role?: 'owner' | 'staff' | 'admin';
    isAuthenticated?: boolean;
  };
  shop?: {
    currentShop?: any;
    settings?: any;
  };
  booking?: {
    appointments?: any[];
    loading?: boolean;
  };
}

export interface AppDispatch {
  // Add dispatch type here when Redux is implemented
  (action: any): void;
}

// Placeholder store configuration
export const store = {
  getState: (): RootState => ({} as RootState),
  dispatch: (action: any) => {
    console.log('Dispatch action:', action);
  },
  subscribe: (listener: () => void) => {
    console.log('Subscribe to store');
  },
};

// Export authStore
export { authStore } from './authStore';
