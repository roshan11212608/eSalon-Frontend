import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { authStore } from '@/src/store';
import { StorageService } from '@/src/services/storage/storageService';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('AuthProvider: Initializing auth state...');
      const isAuthenticated = await StorageService.isAuthenticated();
      console.log('AuthProvider: Is authenticated from storage:', isAuthenticated);
      
      if (isAuthenticated) {
        const userData = await StorageService.getUserData();
        const token = await StorageService.getToken();
        const role = await StorageService.getRole();
        
        console.log('AuthProvider: Token:', token ? 'exists' : 'missing');
        console.log('AuthProvider: Role (raw):', role);
        console.log('AuthProvider: Role (type):', typeof role);
        console.log('AuthProvider: User data:', userData);
        
        if (userData && token && role) {
          const normalizedRole = role.toLowerCase() as 'owner' | 'staff' | 'admin';
          console.log('AuthProvider: Normalized role:', normalizedRole);
          
          // Update AsyncStorage with normalized role for future reads
          if (role !== normalizedRole) {
            await StorageService.setRole(normalizedRole);
            console.log('AuthProvider: Updated AsyncStorage with normalized role');
          }
          
          // Update userData with normalized role
          const userDataWithNormalizedRole = {
            ...userData,
            role: normalizedRole
          };
          
          authStore.login(token, normalizedRole, userDataWithNormalizedRole);
          console.log('AuthProvider: Auth state restored from storage with normalized role');
          
          // Redirect based on role
          setTimeout(() => {
            switch (normalizedRole) {
              case 'owner':
                console.log('AuthProvider: Redirecting to owner tabs');
                router.replace('/(owner-tabs)/home');
                break;
              case 'staff':
                console.log('AuthProvider: Redirecting to staff tabs');
                router.replace('/(staff-tabs)/home');
                break;
              case 'admin':
                console.log('AuthProvider: Redirecting to admin tabs');
                router.replace('/(admin-tabs)/dashboard');
                break;
              default:
                console.log('AuthProvider: Unknown role, redirecting to login');
                router.replace('/auth/login');
            }
          }, 100);
        } else {
          console.log('AuthProvider: Missing data for auth restoration');
          console.log('AuthProvider: userData:', userData);
          console.log('AuthProvider: token:', token);
          console.log('AuthProvider: role:', role);
        }
      }
    } catch (error) {
      console.error('AuthProvider: Error initializing auth state:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            {/* Auth screens */}
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            
            {/* Owner tabs */}
            <Stack.Screen name="(owner-tabs)" />
            
            {/* Staff tabs */}
            <Stack.Screen name="(staff-tabs)" />
            
            {/* Admin */}
            <Stack.Screen name="(admin-tabs)" />
          </Stack>
        </>
      </AuthProvider>
    </ThemeProvider>
  );
}
