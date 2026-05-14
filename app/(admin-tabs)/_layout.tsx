import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const allowedRoutes = ['dashboard', 'management', 'profile'];
  const lastPressRef = useRef<{ [key: string]: number }>({});
  const DOUBLE_TAP_DELAY = 300; // ms

  return (
    <View style={[styles.customTabBar, { paddingBottom: insets.bottom }]}>
      {state.routes
        .filter(route => allowedRoutes.includes(route.name))
        .map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.indexOf(route);

          const onPress = () => {
            const now = Date.now();
            const lastPress = lastPressRef.current[route.key] || 0;
            const timeSinceLastPress = now - lastPress;

            if (isFocused && timeSinceLastPress < DOUBLE_TAP_DELAY) {
              navigation.goBack();
              lastPressRef.current[route.key] = 0;
              return;
            }

            lastPressRef.current[route.key] = now;

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName;
          if (route.name === 'dashboard') iconName = isFocused ? 'grid' : 'grid-outline';
          else if (route.name === 'management') iconName = isFocused ? 'settings' : 'settings-outline';
          else if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? '#ea6e08' : '#999999'}
              />
              <Text style={[styles.tabLabel, { color: isFocused ? '#780115' : '#999999' }]}>
                {options.tabBarLabel || route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

export default function AdminLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
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
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#780115',
  },
  customTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textTransform: 'capitalize',
  },
});