import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { StorageService, type UserRole } from '../src/services/storage/storageService';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('Checking auth state...');
      const authData = await StorageService.getAuthData();
      
      console.log('Auth data:', authData);
      
      setIsAuthenticated(!!authData.token);
      setRole(authData.role);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  // If no token, redirect to login
  if (!isAuthenticated) {
    console.log('No token found, redirecting to login');
    return <Redirect href="/auth/login" />;
  }

  // If token exists, redirect based on role (no onboarding)
  console.log('Authenticated user, redirecting based on role:', role);
  
  switch (role) {
    case 'owner':
      return <Redirect href="/(owner-tabs)/home" />;
    case 'staff':
      return <Redirect href="/(staff-tabs)/home" />;
    case 'admin':
      return <Redirect href="/(admin-tabs)/dashboard" />;
    default:
      // Default to owner if role is somehow null/undefined
      return <Redirect href="/(owner-tabs)/home" />;
  }
}
