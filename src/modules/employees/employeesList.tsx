import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/employees.styles';
import { Employee as EmployeeType } from '@/src/services/employee/EmployeeService';

interface EmployeesListProps {
  employees: EmployeeType[];
  onEmployeePress: (employee: EmployeeType) => void;
  onDeleteEmployee: (id: string) => void;
  onReactivateEmployee: (id: string) => void;
}

export default function EmployeesList({ employees, onEmployeePress, onDeleteEmployee, onReactivateEmployee }: EmployeesListProps) {
  if (employees.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
        <Text style={{ color: '#6B7280', fontSize: 16 }}>No employees found</Text>
      </View>
    );
  }

  return (
    <View style={styles.employeesList}>
      {employees.map(employee => (
        <TouchableOpacity
          key={employee.id}
          style={styles.employeeCard}
          onPress={() => onEmployeePress(employee)}
          activeOpacity={0.7}
        >
          <View style={styles.employeeHeader}>
            <View style={styles.employeeAvatar}>
              <Ionicons name="person" size={24} style={styles.avatarIcon} />
            </View>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{employee.name || 'Unknown'}</Text>
              <Text style={styles.employeeRole}>{employee.role || 'Staff'}</Text>
              <Text style={styles.employeeEmail}>{employee.email || 'No email'}</Text>
              {employee.shopId && <Text style={styles.employeeShopId}>Shop ID: {employee.shopId}</Text>}
            </View>
            <View style={styles.employeeActions}>
              {employee.isActive === false ? (
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: '#4CAF50' }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    onReactivateEmployee(employee.id);
                  }}
                >
                  <Ionicons name="refresh" size={20} style={{ color: '#FFFFFF' }} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onDeleteEmployee(employee.id);
                  }}
                >
                  <Ionicons name="trash" size={20} style={styles.deleteIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <View style={styles.employeeDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="call" size={16} style={styles.detailIcon} />
              <Text style={styles.detailText}>{employee.phone || 'No phone'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={16} style={styles.detailIcon} />
              <Text style={styles.detailText}>{employee.commissionPercentage || 0}% commission</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} style={styles.detailIcon} />
              <Text style={styles.detailText}>Joined {employee.joinDate || 'No date'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
