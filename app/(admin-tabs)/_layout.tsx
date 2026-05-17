import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#780115',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            paddingBottom: 20,
            paddingTop: 16,
            height: 60 + insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="management"
          options={{
            title: 'Management',
            tabBarLabel: 'Management',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />

        {/* Hide other screens from tabs - they are sub-pages */}
        <Tabs.Screen
          name="plans"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="plans/index"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="plans/[id]"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="salons"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="salons/index"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="salons/[id]"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="revenue"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="revenue/index"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="payments"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="payments/index"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="pending-nepal-payments"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="pending-nepal-payments/index"
          options={{
            href: null
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});