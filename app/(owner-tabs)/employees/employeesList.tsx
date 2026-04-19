import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/src/modules/employees/styles/employees.styles';
import EmployeeService, { Employee as EmployeeType } from '@/src/services/employee/EmployeeService';
import { ActivityService } from '@/src/services/activityService';

interface Activity {
  id: number;
  type: string;
  description: string;
  amount: number;
  notes?: string;
  createdAt: string;
  userId?: number | null;
  employeeId?: number | null;
}

export default function EmployeeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [employee, setEmployee] = React.useState<EmployeeType | null>(null);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const fetchEmployeeDetails = async (employeeId: string) => {
    try {
      const data = await EmployeeService.getEmployeeById(employeeId);
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const fetchEmployeeActivities = useCallback(async (employeeId: string) => {
    try {
      setIsLoadingActivities(true);
      
      // Use optimized backend endpoint with filtering
      const employeeActivities = await ActivityService.getActivitiesByEmployee(Number(employeeId));
      console.log('Fetched employee activities from backend:', employeeActivities);
      
      setActivities(employeeActivities);
    } catch (error) {
      console.error('Error fetching employee activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  React.useEffect(() => {
    if (id) {
      fetchEmployeeDetails(id);
      fetchEmployeeActivities(id);
    }
  }, [id, fetchEmployeeActivities]);

  const handleClose = () => {
    router.back();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    try {
      await EmployeeService.deleteEmployee(id);
      setShowDeleteModal(false);
      router.back();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'SALE':
        return 'cash';
      case 'APPOINTMENT':
        return 'calendar';
      case 'EXPENSE':
        return 'card';
      default:
        return 'document-text';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'SALE':
        return '#10B981';
      case 'APPOINTMENT':
        return '#6366F1';
      case 'EXPENSE':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (!employee) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Loading employee details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Employee Details</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={[styles.addButton, { backgroundColor: '#FEE2E2' }]} onPress={handleDelete}>
                <Ionicons name="trash" size={20} color="#DC2626" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleClose}>
                <Ionicons name="close" size={20} style={styles.addButtonIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailAvatarLarge}>
            <Ionicons name="person" size={40} style={styles.detailAvatarIconLarge} />
          </View>
          <Text style={styles.detailName}>{employee.name || 'Unknown'}</Text>
          <Text style={styles.detailRole}>{employee.role || 'Staff'}</Text>
          <Text style={styles.detailEmail}>{employee.email || 'No email'}</Text>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Contact Information</Text>
            <View style={styles.detailInfoRow}>
              <Ionicons name="call" size={20} color="#6B7280" />
              <Text style={styles.detailInfoText}>{employee.phone || 'No phone'}</Text>
            </View>
            <View style={styles.detailInfoRow}>
              <Ionicons name="mail" size={20} color="#6B7280" />
              <Text style={styles.detailInfoText}>{employee.email || 'No email'}</Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Employment Details</Text>
            <View style={styles.detailInfoRow}>
              <Ionicons name="cash" size={20} color="#6B7280" />
              <Text style={styles.detailInfoText}>{employee.commissionPercentage || 0}% Commission</Text>
            </View>
            <View style={styles.detailInfoRow}>
              <Ionicons name="calendar" size={20} color="#6B7280" />
              <Text style={styles.detailInfoText}>Joined: {employee.joinDate || 'No date'}</Text>
            </View>
          </View>

          {employee.shopId && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Shop Information</Text>
              <View style={styles.detailInfoRow}>
                <Ionicons name="storefront" size={20} color="#6B7280" />
                <Text style={styles.detailInfoText}>Shop ID: {employee.shopId}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Activity Logs</Text>
            {isLoadingActivities ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={{ color: '#6B7280', marginTop: 8, fontSize: 14 }}>Loading activities...</Text>
              </View>
            ) : activities.length === 0 ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
                <Text style={{ color: '#6B7280', marginTop: 12, fontSize: 14 }}>No activity logs found</Text>
              </View>
            ) : (
              activities.map((activity) => (
                <View key={activity.id} style={styles.activityLogCard}>
                  <View style={styles.activityLogHeader}>
                    <View style={[styles.activityLogIcon, { backgroundColor: getActivityColor(activity.type) }]}>
                      <Ionicons 
                        name={getActivityIcon(activity.type)} 
                        size={20} 
                        color="#FFFFFF" 
                      />
                    </View>
                    <View style={styles.activityLogInfo}>
                      <Text style={styles.activityLogType}>{activity.type}</Text>
                      <Text style={styles.activityLogDate}>{formatDate(activity.createdAt)}</Text>
                    </View>
                    {activity.amount !== undefined && (
                      <Text style={styles.activityLogAmount}>${activity.amount.toFixed(2)}</Text>
                    )}
                  </View>
                  <Text style={styles.activityLogDescription}>{activity.description}</Text>
                  {activity.notes && (
                    <View style={styles.activityLogNotes}>
                      <Ionicons name="information-circle" size={14} color="#64748B" />
                      <Text style={styles.activityLogNotesText}>{activity.notes}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 320,
          }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#FEE2E2',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <Ionicons name="trash" size={32} color="#DC2626" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8 }}>
                Delete Employee
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                Are you sure you want to delete this employee? This action cannot be undone.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                }}
                onPress={cancelDelete}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                }}
                onPress={confirmDelete}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
