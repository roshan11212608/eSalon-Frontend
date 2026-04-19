// Auth store for managing authentication state
import type { User } from '../types/user';

interface AuthState {
  token: string | null;
  role: 'owner' | 'staff' | 'admin' | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (token: string, role: 'owner' | 'staff' | 'admin', user: User) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
}

// Simple state management without external dependencies
class AuthStore {
  private state: AuthState = {
    token: null,
    role: null,
    isAuthenticated: false,
    user: null,
    isLoading: false,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  getState(): AuthState {
    return { ...this.state };
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  login(token: string, role: 'owner' | 'staff' | 'admin', user: User): void {
    this.state = {
      ...this.state,
      token,
      role,
      isAuthenticated: true,
      user,
      isLoading: false,
    };
    this.notifyListeners();
  }

  async logout(): Promise<void> {
    this.state = {
      token: null,
      role: null,
      isAuthenticated: false,
      user: null,
      isLoading: false,
    };
    this.notifyListeners();
    return Promise.resolve();
  }

  setLoading(loading: boolean): void {
    this.state = {
      ...this.state,
      isLoading: loading,
    };
    this.notifyListeners();
  }

  setUser(user: User): void {
    this.state = {
      ...this.state,
      user,
    };
    this.notifyListeners();
  }
}

export const authStore = new AuthStore();
