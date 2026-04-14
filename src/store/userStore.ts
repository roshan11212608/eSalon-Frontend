import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff' | 'admin' | null;
  hasShop: boolean;
  shopId?: string;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Simple React-based store (can be replaced with Zustand/Redux later)
let globalUserState: UserStore = {
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  logout: () => {},
};

const userStoreSubscribers: Set<() => void> = new Set();

export function useUserStore(): UserStore {
  const [, forceUpdate] = useState({});

  const setUser = (user: User | null) => {
    globalUserState = { ...globalUserState, user, isAuthenticated: !!user };
    userStoreSubscribers.forEach(callback => callback());
  };

  const logout = () => {
    globalUserState = { ...globalUserState, user: null, isAuthenticated: false };
    userStoreSubscribers.forEach(callback => callback());
  };

  // Initialize store with setters
  if (!globalUserState.setUser) {
    globalUserState = { ...globalUserState, setUser, logout };
  }

  return {
    user: globalUserState.user,
    isAuthenticated: globalUserState.isAuthenticated,
    setUser,
    logout,
  };
}
