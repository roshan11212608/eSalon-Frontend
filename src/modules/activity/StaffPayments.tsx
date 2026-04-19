import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityService } from '@/src/services/activityService';
import { styles } from './styles/activityList.styles';

interface Payment {
  id: number;
  type: string;
  description: string;
  amount: number;
  notes?: string;
  createdAt: string;
  employeeId?: number;
}

export default function StaffPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchPayments = useCallback(async (resetPage = false) => {
    try {
      setError(null);
      const currentPage = resetPage ? 0 : page;
      
      // Map frontend filter names to backend filter names
      const filterMap: Record<string, string> = {
        'All': 'all',
        'Today': 'today',
        'Yesterday': 'yesterday',
        'This Week': 'week',
        'Monthly': 'month',
        'Date Wise': 'dateRange'
      };
      
      const backendFilter = filterMap[selectedFilter] || 'all';
      
      let startDateStr, endDateStr;
      if (selectedFilter === 'Date Wise') {
        startDateStr = startDate.toISOString().split('T')[0];
        endDateStr = endDate.toISOString().split('T')[0];
      }
      
      const paginatedResponse = await ActivityService.getMyActivitiesPaginated(
        backendFilter,
        currentPage,
        pageSize,
        startDateStr,
        endDateStr
      );
      
      // Filter for payment-related activities only (SALE, APPOINTMENT)
      const myPayments = (paginatedResponse.content || []).filter(
        (activity: Payment) => 
          activity.type === 'SALE' || activity.type === 'APPOINTMENT'
      );
      
      console.log('My payments fetched:', myPayments.length);
      
      if (resetPage) {
        setPayments(myPayments);
        setPage(0);
      } else {
        setPayments(prev => [...prev, ...myPayments]);
      }
      
      // Use backend's last flag to determine if there are more pages
      setHasMore(!paginatedResponse.last);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load payments');
      Alert.alert('Error', 'Failed to load payments');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [page, selectedFilter, startDate, endDate, pageSize]);

  useEffect(() => {
    fetchPayments(true);
  }, [selectedFilter, fetchPayments]);

  const onRefresh = () => {
    Haptics.impactAsync();
    setRefreshing(true);
    fetchPayments(true);
  };

  const loadMore = () => {
    if (!isLoading && hasMore && !error) {
      Haptics.impactAsync();
      setPage(prev => prev + 1);
      fetchPayments(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchPayments(true);
  };

  const handleBack = () => {
    Haptics.impactAsync();
    router.back();
  };

  const handleFilterPress = (filter: string) => {
    Haptics.impactAsync();
    if (filter === 'Date Wise') {
      setShowDateRangeModal(true);
    } else {
      setSelectedFilter(filter);
    }
  };

  const applyDateRange = () => {
    setSelectedFilter('Date Wise');
    setShowDateRangeModal(false);
  };

  const handleDateSelect = (date: Date) => {
    if (selectingStartDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setShowCalendar(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCalendarDate(newDate);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'SALE':
        return 'cash';
      case 'APPOINTMENT':
        return 'calendar';
      default:
        return 'card';
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'SALE':
        return '#10B981';
      case 'APPOINTMENT':
        return '#6366F1';
      default:
        return '#6B7280';
    }
  };

  const filterCategories = ['All', 'Today', 'Yesterday', 'This Week', 'Monthly', 'Date Wise'];

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'All':
        return 'grid';
      case 'Today':
        return 'today';
      case 'Yesterday':
        return 'time';
      case 'This Week':
        return 'calendar';
      case 'Monthly':
        return 'calendar-number';
      case 'Date Wise':
        return 'filter';
      default:
        return 'grid';
    }
  };

  // Memoized payments to avoid unnecessary recalculations
  const memoizedPayments = useMemo(() => payments, [payments]);

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <TouchableOpacity 
      style={styles.activityCard} 
      activeOpacity={0.7}
      onPress={() => Haptics.impactAsync()}
    >
      <View style={styles.activityHeader}>
        <View style={[styles.activityIcon, { backgroundColor: getPaymentColor(payment.type) }]}>
          <Ionicons 
            name={getPaymentIcon(payment.type)} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityType}>{payment.type}</Text>
          <Text style={styles.activityDate}>{formatDate(payment.createdAt)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.activityAmount}>${payment.amount.toFixed(2)}</Text>
        </View>
      </View>
      <Text style={styles.activityDescription}>{payment.description}</Text>
      {payment.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="information-circle" size={14} color="#64748B" />
          <Text style={styles.activityNotes}>{payment.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const totalEarnings = memoizedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading payments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.title}>My Payments</Text>
        <View style={styles.addButton} />
      </View>

      {/* Total Earnings Card */}
      <View style={{
        backgroundColor: '#6366F1',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View>
          <Text style={{ color: '#E0E7FF', fontSize: 14, fontWeight: '500' }}>
            Total Earnings
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: 4 }}>
            ${totalEarnings.toFixed(2)}
          </Text>
        </View>
        <Ionicons name="wallet" size={32} color="#FFFFFF" />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filterCategories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedFilter === category && styles.filterChipActive
              ]}
              onPress={() => handleFilterPress(category)}
            >
              <Ionicons
                name={getFilterIcon(category) as any}
                size={16}
                color={selectedFilter === category ? '#FFFFFF' : '#6B7280'}
                style={styles.filterChipIcon}
              />
              <Text style={[
                styles.filterChipText,
                selectedFilter === category && styles.filterChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.activitiesList}>
          {error ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="alert-circle-outline" size={72} color="#EF4444" />
              </View>
              <Text style={styles.emptyTitle}>Error Loading Payments</Text>
              <Text style={styles.emptyMessage}>{error}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6366F1',
                  borderRadius: 8,
                  padding: 16,
                  marginTop: 16,
                  alignItems: 'center',
                }}
                onPress={handleRetry}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : memoizedPayments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="card-outline" size={72} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitle}>No Payments Yet</Text>
              <Text style={styles.emptyMessage}>
                Your payments will appear here
              </Text>
            </View>
          ) : (
            <>
              {memoizedPayments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
              {hasMore && (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#6366F1" />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={showDateRangeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateRangeModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937' }}>
                Select Date Range
              </Text>
              <TouchableOpacity onPress={() => setShowDateRangeModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 8 }}>
                Start Date
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 8,
                  padding: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setSelectingStartDate(true);
                  setCalendarDate(startDate);
                  setShowCalendar(true);
                }}
              >
                <Text style={{ fontSize: 16, color: '#1F2937' }}>
                  {startDate.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280', marginBottom: 8 }}>
                End Date
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 8,
                  padding: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setSelectingStartDate(false);
                  setCalendarDate(endDate);
                  setShowCalendar(true);
                }}
              >
                <Text style={{ fontSize: 16, color: '#1F2937' }}>
                  {endDate.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#6366F1',
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
              }}
              onPress={applyDateRange}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                Apply Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
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
            borderRadius: 20,
            padding: 24,
            width: '100%',
            maxWidth: 380,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Ionicons name="chevron-back" size={24} color="#6366F1" />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937' }}>
                {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Ionicons name="chevron-forward" size={24} color="#6366F1" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={{ width: 40, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6B7280' }}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {getDaysInMonth(calendarDate).map((day, index) => {
                if (!day) {
                  return <View key={index} style={{ width: 40, height: 40 }} />;
                }
                const isSelected = day.toDateString() === (selectingStartDate ? startDate : endDate).toDateString();
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                      backgroundColor: isSelected ? '#6366F1' : isToday ? '#E0E7FF' : 'transparent',
                    }}
                    onPress={() => handleDateSelect(day)}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: isSelected ? '600' : '400',
                      color: isSelected ? '#FFFFFF' : isToday ? '#6366F1' : '#1F2937',
                    }}>
                      {day.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
              }}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#6B7280' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
