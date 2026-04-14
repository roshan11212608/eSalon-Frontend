import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" redirect={true} />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}