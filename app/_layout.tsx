import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Auth screens */}
          <Stack.Screen name="auth/index" />
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
    </ThemeProvider>
  );
}
