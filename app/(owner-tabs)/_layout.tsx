import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OwnerTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#780115',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            paddingBottom: 4,
            paddingTop: 4,
            height: 25 + insets.bottom,
            justifyContent: 'space-around',
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
          name="shop"
          options={{
            title: 'Shop',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'storefront' : 'storefront-outline'} 
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
        
        {/* Hide these screens from tab bar */}
        <Tabs.Screen
          name="employees"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="employees/index"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="employees/addEmployees"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="employees/employeesList"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="expenses"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="expenses/index"
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
          name="payments/addPayment"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="payments/paymentsList"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="shopServices"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="shopServices/index"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="shopServices/addNewServices"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="activity/list"
          options={{
            href: null
          }}
        />
        
        <Tabs.Screen
          name="activity/new"
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
