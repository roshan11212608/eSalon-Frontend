import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/employees.styles';
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
  const [activityFilter, setActivityFilter] = React.useState<'all' | 'today' | 'yesterday' | 'week' | 'date'>('all');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

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

  const filterActivities = (activities: Activity[], filter: 'all' | 'today' | 'yesterday' | 'week' | 'date', date?: Date | null) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return activities.filter((activity) => {
      const activityDate = new Date(activity.createdAt);
      switch (filter) {
        case 'today':
          return activityDate >= today;
        case 'yesterday':
          return activityDate >= yesterday && activityDate < today;
        case 'week':
          return activityDate >= weekAgo;
        case 'date':
          if (!date) return false;
          const filterDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const activityDay = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());
          return activityDay.getTime() === filterDate.getTime();
        default:
          return true;
      }
    });
  };

  const filteredActivities = filterActivities(activities, activityFilter, selectedDate);

  if (!employee) {
    return (
      <View style={styles.mainContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#666666', fontSize: 16 }}>Loading employee details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Employee<Text style={styles.titleAccent}> Details</Text></Text>
        <TouchableOpacity style={[styles.actionButton, styles.headerCloseButton]} onPress={handleClose}>
          <Ionicons name="close" size={18} color="#f7b638" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.mainContent}>

          <View style={styles.detailAvatarLarge}>
            <Ionicons name="person" size={40} style={styles.detailAvatarIconLarge} />
          </View>
          <Text style={styles.detailName}>{employee.name || 'Unknown'}</Text>
          <Text style={styles.detailRole}>{employee.role || 'Staff'}</Text>
          <View style={styles.detailBadge}>
            <Text style={styles.detailBadgeText}>User ID: {employee.id || 'N/A'}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Employment Details</Text>
            <View style={styles.detailInfoRow}>
              <View style={styles.detailInfoIcon}>
                <Ionicons name="call" size={18} color="#f7b638" />
              </View>
              <Text style={styles.detailInfoText}>{employee.phone || 'No phone'}</Text>
            </View>
            <View style={styles.detailInfoRow}>
              <View style={styles.detailInfoIcon}>
                <Ionicons name="mail" size={18} color="#f7b638" />
              </View>
              <Text style={styles.detailInfoText}>{employee.email || 'No email'}</Text>
            </View>
            <View style={styles.detailInfoRow}>
              <View style={styles.detailInfoIcon}>
                <Ionicons name="cash" size={18} color="#f7b638" />
              </View>
              <Text style={styles.detailInfoText}>{employee.commissionPercentage || 0}% Commission</Text>
            </View>
            <View style={styles.detailInfoRow}>
              <View style={styles.detailInfoIcon}>
                <Ionicons name="calendar" size={18} color="#f7b638" />
              </View>
              <Text style={styles.detailInfoText}>Joined: {employee.joinDate || 'No date'}</Text>
            </View>
          </View>

          {employee.shopId && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Shop Information</Text>
              <View style={styles.detailInfoRow}>
                <View style={styles.detailInfoIcon}>
                  <Ionicons name="storefront" size={18} color="#f7b638" />
                </View>
                <Text style={styles.detailInfoText}>Shop ID: {employee.shopId}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Activity Logs</Text>
            <View style={styles.activityFilterContainer}>
              <TouchableOpacity
                style={[styles.activityFilterButton, activityFilter === 'all' && styles.activityFilterButtonActive]}
                onPress={() => setActivityFilter('all')}
              >
                <Text style={[styles.activityFilterButtonText, activityFilter === 'all' && styles.activityFilterButtonTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.activityFilterButton, activityFilter === 'today' && styles.activityFilterButtonActive]}
                onPress={() => setActivityFilter('today')}
              >
                <Text style={[styles.activityFilterButtonText, activityFilter === 'today' && styles.activityFilterButtonTextActive]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.activityFilterButton, activityFilter === 'yesterday' && styles.activityFilterButtonActive]}
                onPress={() => setActivityFilter('yesterday')}
              >
                <Text style={[styles.activityFilterButtonText, activityFilter === 'yesterday' && styles.activityFilterButtonTextActive]}>Y - Day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.activityFilterButton, activityFilter === 'week' && styles.activityFilterButtonActive]}
                onPress={() => setActivityFilter('week')}
              >
                <Text style={[styles.activityFilterButtonText, activityFilter === 'week' && styles.activityFilterButtonTextActive]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.activityFilterButton, activityFilter === 'date' && styles.activityFilterButtonActive]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.activityFilterButtonText, activityFilter === 'date' && styles.activityFilterButtonTextActive]}>
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date'}
                </Text>
              </TouchableOpacity>
            </View>
            {isLoadingActivities ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#f7b638" />
                <Text style={{ color: '#666666', marginTop: 8, fontSize: 14 }}>Loading activities...</Text>
              </View>
            ) : filteredActivities.length === 0 ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Ionicons name="document-text-outline" size={48} color="#e5e5e5" />
                <Text style={{ color: '#666666', marginTop: 12, fontSize: 14 }}>No activity logs found</Text>
              </View>
            ) : (
              <View style={styles.activityTable}>
                <View style={styles.activityTableHeader}>
                  <Text style={styles.activityTableHeaderText}>S.N</Text>
                  <Text style={styles.activityTableHeaderText}>Date</Text>
                  <Text style={styles.activityTableHeaderText}>Services</Text>
                  {filteredActivities.some(a => a.amount !== undefined) && (
                    <Text style={styles.activityTableHeaderText}>Amount</Text>
                  )}
                </View>
                {filteredActivities.map((activity, index) => (
                  <View key={activity.id} style={styles.activityTableRow}>
                    <Text style={styles.activityTableText}>{index + 1}</Text>
                    <Text style={styles.activityTableText}>{formatDate(activity.createdAt)}</Text>
                    <Text style={styles.activityTableText}>{activity.description.split('-')[0].trim()}</Text>
                    {activity.amount !== undefined && (
                      <Text style={styles.activityTableAmount}>${activity.amount.toFixed(2)}</Text>
                    )}
                  </View>
                ))}
              </View>
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
                style={{ flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center' }}
                onPress={cancelDelete}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#666666' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#DC2626', alignItems: 'center' }}
                onPress={confirmDelete}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#FFFFFF' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDatePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerModalContent}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Ionicons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.datePickerList}>
            {Array.from({ length: 60 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.datePickerItem, isSelected && styles.datePickerItemSelected]}
                  onPress={() => {
                    setSelectedDate(date);
                    setActivityFilter('date');
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={[styles.datePickerItemText, isSelected && styles.datePickerItemTextSelected]}>
                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color="#f7b638" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>
);
}
