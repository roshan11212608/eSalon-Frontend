import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import UserManagement from '@/src/modules/userManagement/UserManagement';
import { User } from '@/src/modules/userManagement/types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@esalon.com',
    phone: '+91 98765 43210',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2 hours ago',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@stylestudio.com',
    phone: '+91 98765 12345',
    role: 'owner',
    shopName: 'Style Studio',
    status: 'active',
    joinDate: '2024-02-20',
    lastLogin: '5 minutes ago',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mike.c@hairhaven.com',
    phone: '+91 87654 32109',
    role: 'owner',
    shopName: 'Hair Haven',
    status: 'inactive',
    joinDate: '2024-03-10',
    lastLogin: '3 days ago',
  },
  {
    id: '4',
    name: 'Priya Patel',
    email: 'priya.p@glamsquad.com',
    phone: '+91 76543 21098',
    role: 'staff',
    status: 'active',
    joinDate: '2024-04-05',
    lastLogin: '1 hour ago',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'dave.w@cutcorner.com',
    phone: '+91 65432 10987',
    role: 'staff',
    status: 'suspended',
    joinDate: '2024-05-12',
    lastLogin: '1 week ago',
  },
];

export default function UserManagementScreen() {
  const [users, setUsers] = useState<User[]>(mockUsers);

  useFocusEffect(
    useCallback(() => {
      console.log('User Management screen focused');
    }, [])
  );

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Math.random().toString(36).substr(2, 9),
    };
    setUsers(prev => [user, ...prev]);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const statuses: ('active' | 'inactive' | 'suspended')[] = ['active', 'inactive', 'suspended'];
        const currentIndex = statuses.indexOf(user.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...user, status: nextStatus };
      }
      return user;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <View style={styles.container}>
      <UserManagement
        users={users}
        onAddUser={handleAddUser}
        onToggleUserStatus={handleToggleUserStatus}
        onDeleteUser={handleDeleteUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
