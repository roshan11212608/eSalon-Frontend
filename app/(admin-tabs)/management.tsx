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
        <Text style={s.title}>Management</Text>
        <Text style={s.subtitle}>System administration and settings</Text>
      </View>

      <ScrollView style={s.content} contentContainerStyle={s.contentContainer}>
        {managementItems.map((item) => (
          <TouchableOpacity key={item.id} style={s.card} onPress={() => handleItemPress(item)}>
            <View style={[s.iconContainer, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <View style={s.cardContent}>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardDescription}>{item.description}</Text>
            </View>
            {item.route && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F3',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F6F3',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
});
