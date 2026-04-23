import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StaffTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#780115',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            paddingBottom: 4,
            paddingTop: 4,
            height: 25 + insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'notifications' : 'notifications-outline'} 
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
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        {/* Hide activity-list and payments from tabs - they are sub-pages */}
        <Tabs.Screen
          name="activity-list"
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
          name="payments/staffPayments"
          options={{
            href: null
          }}
        />

        <Tabs.Screen
          name="staff-payments"
          options={{
            href: null
          }}
        />

        {/* Hide reports from tabs - accessible from Activity menu */}
        <Tabs.Screen
          name="reports"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="reports/index"
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
    backgroundColor: '#780115',
  },
  header: {
    backgroundColor: '#780115',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: 16,
    shadowColor: '#f7b638',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f7b638',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f7b638',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
