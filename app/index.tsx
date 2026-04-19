import { Redirect } from 'expo-router';
import { authStore } from '../src/store/authStore';

export default function IndexScreen() {
  const state = authStore.getState();
  const isAuthenticated = state.isAuthenticated;
  const role = state.role?.toLowerCase() as 'owner' | 'staff' | 'admin' | null;

  console.log('IndexScreen: Current auth state:', state);
  console.log('IndexScreen: isAuthenticated:', isAuthenticated, 'role:', role);

  // If no token, redirect to login
  if (!isAuthenticated || !state.token) {
    console.log('No token found, redirecting to login');
    return <Redirect href="/auth/login" />;
  }

  // If token exists, redirect based on role
  console.log('Authenticated user, redirecting based on role:', role);
  
  switch (role) {
    case 'owner':
      return <Redirect href="/(owner-tabs)/home" />;
    case 'staff':
      return <Redirect href="/(staff-tabs)/home" />;
    case 'admin':
      return <Redirect href="/(admin-tabs)/dashboard" />;
    default:
      // If role is null/undefined, redirect to login to re-authenticate
      console.log('Role is null/undefined, redirecting to login');
      return <Redirect href="/auth/login" />;
  }
}
