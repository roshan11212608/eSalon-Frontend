import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/employees.styles';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface EmployeesProps {
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onToggleEmployeeStatus: (id: string) => void;
}

export default function Employees({ employees, onAddEmployee, onToggleEmployeeStatus }: EmployeesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    salary: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = selectedRole === 'All' || employee.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roles = ['All', 'Manager', 'Staff', 'Senior Stylist', 'Junior Stylist'];

  const handleAddEmployee = () => {
    Haptics.notificationAsync();
    setShowAddModal(true);
  };

  const handleSaveEmployee = () => {
    Haptics.notificationAsync();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone || !newEmployee.salary) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const employeeToAdd = {
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role,
      salary: parseFloat(newEmployee.salary),
      joinDate: newEmployee.joinDate,
      status: 'active' as const,
    };

    onAddEmployee(employeeToAdd);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: 'Staff',
      salary: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Employee added successfully!');
  };

  const handleCancelAdd = () => {
    Haptics.notificationAsync();
    setShowAddModal(false);
  };

  return (
    <>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Employees</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employees..."
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

        <View style={styles.employeesList}>
          {filteredEmployees.map(employee => (
            <View key={employee.id} style={styles.employeeCard}>
              <View style={styles.employeeHeader}>
                <View style={styles.employeeAvatar}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeRole}>{employee.role}</Text>
                  <Text style={styles.employeeEmail}>{employee.email}</Text>
                </View>
                <View style={styles.employeeActions}>
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => onToggleEmployeeStatus(employee.id)}
                  >
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: employee.status === 'active' ? '#10B981' : '#EF4444' }
                    ]} />
                    <Text style={styles.statusText}>
                      {employee.status === 'active' ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.employeeDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{employee.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Rs {employee.salary}/month</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Joined {employee.joinDate}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Employee Modal */}
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
            <Text style={styles.modalTitle}>Add New Employee</Text>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.formLabel}>Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter employee name"
              value={newEmployee.name}
              onChangeText={(text) => setNewEmployee({...newEmployee, name: text})}
            />

            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter email"
              value={newEmployee.email}
              onChangeText={(text) => setNewEmployee({...newEmployee, email: text})}
              keyboardType="email-address"
            />

            <Text style={styles.formLabel}>Phone</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter phone number"
              value={newEmployee.phone}
              onChangeText={(text) => setNewEmployee({...newEmployee, phone: text})}
              keyboardType="phone-pad"
            />

            <Text style={styles.formLabel}>Role</Text>
            <View style={styles.roleButtons}>
              {['Manager', 'Staff', 'Senior Stylist', 'Junior Stylist'].map(role => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    newEmployee.role === role && styles.roleButtonActive
                  ]}
                  onPress={() => setNewEmployee({...newEmployee, role})}
                >
                  <Text style={[
                    styles.roleButtonText,
                    newEmployee.role === role && styles.roleButtonTextActive
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Salary (Rs)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter monthly salary"
              value={newEmployee.salary}
              onChangeText={(text) => setNewEmployee({...newEmployee, salary: text})}
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Join Date</Text>
            <TextInput
              style={styles.formInput}
              value={newEmployee.joinDate}
              onChangeText={(text) => setNewEmployee({...newEmployee, joinDate: text})}
              placeholder="YYYY-MM-DD"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEmployee}>
              <Text style={styles.saveButtonText}>Save Employee</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
