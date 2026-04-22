import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Employee as EmployeeType } from '@/src/services/employee/EmployeeService';

interface EmployeesListProps {
  employees: EmployeeType[];
  onEmployeePress: (employee: EmployeeType) => void;
  onDeleteEmployee: (id: string) => void;
  onReactivateEmployee: (id: string) => void;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#fff9e6',
    shadowColor: '#f7b638',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#f7b638',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f7b638',
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginRight: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  statusDotInactive: {
    backgroundColor: '#EF4444',
  },
  role: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#fff9e6',
    marginVertical: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterView: {
    alignItems: 'center',
  },
  cardFooterText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#fff9e6',
  },
  deleteIcon: {
    color: '#EF4444',
  },
  reactivateButton: {
    backgroundColor: '#fff9e6',
  },
  reactivateIcon: {
    color: '#10B981',
  },
});

const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function EmployeesList({ employees, onEmployeePress, onDeleteEmployee, onReactivateEmployee }: EmployeesListProps) {
  if (employees.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="people-outline" size={64} color="#E5E7EB" style={{ marginBottom: 20 }} />
        <Text style={styles.emptyStateText}>No employees found</Text>
        <Text style={styles.emptyStateSubtext}>Add your first employee to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {employees.map(employee => (
        <TouchableOpacity
          key={employee.id}
          style={styles.card}
          onPress={() => onEmployeePress(employee)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(employee.name || '')}</Text>
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{employee.name || 'Unknown'}</Text>
                <View style={[
                  styles.statusDot,
                  employee.isActive === false ? styles.statusDotInactive : styles.statusDotActive
                ]} />
              </View>
              <Text style={styles.role}>{employee.role || 'Staff'}</Text>
            </View>
            {employee.isActive === false ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.reactivateButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  onReactivateEmployee(employee.id);
                }}
              >
                <Ionicons name="refresh" size={18} style={styles.reactivateIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  onDeleteEmployee(employee.id);
                }}
              >
                <Ionicons name="trash-outline" size={18} style={styles.deleteIcon} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardFooterView}>
            <Text style={styles.cardFooterText}>Tap to view details</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
