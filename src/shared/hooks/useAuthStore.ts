import { useState, useEffect } from 'react';
import { authStore } from '../../store/authStore';

/**
 * React hook for using the authStore
 * Ensures components re-render when auth state changes
 */
export function useAuthStore() {
  const [state, setState] = useState(() => authStore.getState());

  useEffect(() => {
    // Subscribe to authStore updates
    const unsubscribe = authStore.subscribe((newState) => {
      setState(newState);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return state;
}
