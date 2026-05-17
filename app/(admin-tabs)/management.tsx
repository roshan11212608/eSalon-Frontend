import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ManagementScreen() {
  const router = useRouter();

  const managementItems = [
    {
      id: 'salons',
      title: 'Salons',
      description: 'Manage salon accounts and details',
      icon: 'storefront-outline' as const,
      color: '#3B82F6',
      route: '/salons',
    },
    {
      id: 'plans',
      title: 'Plans',
      description: 'Manage subscription plans and pricing',
      icon: 'card-outline' as const,
      color: '#8B5CF6',
      route: '/plans',
    },
    {
      id: 'revenue',
      title: 'Revenue',
      description: 'View revenue analytics and reports',
      icon: 'cash-outline' as const,
      color: '#10B981',
      route: '/revenue',
    },
    {
      id: 'payments',
      title: 'Payments',
      description: 'Manage payment transactions and verifications',
      icon: 'receipt-outline' as const,
      color: '#F59E0B',
      route: '/payments',
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: 'people-outline' as const,
      color: '#6B7280',
    },
    {
      id: 'roles',
      title: 'Role Management',
      description: 'Configure user roles and access levels',
      icon: 'shield-outline' as const,
      color: '#EC4899',
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: 'settings-outline' as const,
      color: '#6B7280',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification templates and settings',
      icon: 'notifications-outline' as const,
      color: '#F59E0B',
    },
  ];

  const handleItemPress = (item: typeof managementItems[0]) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Manage<Text style={s.titleAccent}>ment</Text></Text>
      </View>

      <ScrollView style={s.content} contentContainerStyle={s.contentContainer}>
        <View style={s.grid}>
          {managementItems.map((item) => (
            <TouchableOpacity key={item.id} style={s.card} onPress={() => handleItemPress(item)} activeOpacity={0.75}>
              <View style={[s.iconContainer, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  titleAccent: {
    color: '#f7b638',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 11,
    color: '#888888',
    lineHeight: 15,
  },
  badge: {
    marginTop: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff9e6',
    borderWidth: 1,
    borderColor: '#f7b638',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
