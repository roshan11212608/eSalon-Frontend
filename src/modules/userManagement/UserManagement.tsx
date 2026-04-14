import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/userManagement.styles';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'staff' | 'admin';
  shopName?: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin?: string;
}

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagement({ users, onAddUser, onToggleUserStatus, onDeleteUser }: UserManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as const,
    shopName: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.phone.includes(searchText);
    const matchesRole = selectedRole === 'All' || user.role === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const roles = ['All', 'Owner', 'Staff', 'Admin'];

  const handleAddUser = () => {
    Haptics.notificationAsync();
    setShowAddModal(true);
  };

  const handleSaveUser = () => {
    Haptics.notificationAsync();
    if (!newUser.name || !newUser.email || !newUser.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const userToAdd = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      shopName: newUser.shopName,
      joinDate: newUser.joinDate,
      status: 'active' as const,
    };

    onAddUser(userToAdd);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      shopName: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    Alert.alert('Success', 'User added successfully!');
  };

  const handleCancelAdd = () => {
    Haptics.notificationAsync();
    setShowAddModal(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync();
            onDeleteUser(userId);
            Alert.alert('Deleted', 'User has been removed');
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#FF3B30';
      case 'owner': return '#007AFF';
      case 'staff': return '#34C759';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'inactive': return '#6B7280';
      case 'suspended': return '#FF3B30';
      default: return '#6B7280';
    }
  };

  return (
    <>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>User Management</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.filter(u => u.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.filter(u => u.role === 'owner').length}</Text>
            <Text style={styles.statLabel}>Owners</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.roleFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {roles.map(role => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleChip,
                  selectedRole === role && styles.roleChipActive
                ]}
                onPress={() => setSelectedRole(role)}
              >
                <Text style={[
                  styles.roleChipText,
                  selectedRole === role && styles.roleChipTextActive
                ]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.usersList}>
          {filteredUsers.map(user => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={[styles.userAvatar, { backgroundColor: getRoleColor(user.role) }]}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.roleBadge}>
                    <View style={[styles.roleIndicator, { backgroundColor: getRoleColor(user.role) }]} />
                    <Text style={styles.userRole}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(user.id, user.name)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{user.phone}</Text>
                </View>
                {user.shopName && (
                  <View style={styles.detailRow}>
                    <Ionicons name="storefront" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{user.shopName}</Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Joined {user.joinDate}</Text>
                </View>
                {user.lastLogin && (
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>Last login: {user.lastLogin}</Text>
                  </View>
                )}
              </View>

              <View style={styles.userFooter}>
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: getStatusColor(user.status) + '20' }]}
                  onPress={() => onToggleUserStatus(user.id)}
                >
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(user.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelAdd}>
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New User</Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.formLabel}>Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter full name"
              value={newUser.name}
              onChangeText={(text) => setNewUser({...newUser, name: text})}
            />

            <Text style={styles.formLabel}>Email *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter email address"
              value={newUser.email}
              onChangeText={(text) => setNewUser({...newUser, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.formLabel}>Phone *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter phone number"
              value={newUser.phone}
              onChangeText={(text) => setNewUser({...newUser, phone: text})}
              keyboardType="phone-pad"
            />

            <Text style={styles.formLabel}>Role</Text>
            <View style={styles.roleButtons}>
              {['owner', 'staff', 'admin'].map(role => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    newUser.role === role && { backgroundColor: getRoleColor(role), borderColor: getRoleColor(role) }
                  ]}
                  onPress={() => setNewUser({...newUser, role: role as any})}
                >
                  <Text style={[
                    styles.roleButtonText,
                    newUser.role === role && styles.roleButtonTextActive
                  ]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {newUser.role === 'owner' && (
              <>
                <Text style={styles.formLabel}>Shop Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter shop name"
                  value={newUser.shopName}
                  onChangeText={(text) => setNewUser({...newUser, shopName: text})}
                />
              </>
            )}

            <Text style={styles.formLabel}>Join Date</Text>
            <TextInput
              style={styles.formInput}
              value={newUser.joinDate}
              onChangeText={(text) => setNewUser({...newUser, joinDate: text})}
              placeholder="YYYY-MM-DD"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveUser}>
              <Text style={styles.saveButtonText}>Create User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
