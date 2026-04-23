import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityService } from '@/src/services/activityService';
import EmployeeService from '@/src/services/employee/EmployeeService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';
import { styles } from './styles/activityList.styles';

interface Activity {
  id: number;
  type: string;
  description: string;
  amount: number;
  notes?: string;
  createdAt: string;
  employeeName?: string;
  employeeId?: number;
}

export default function StaffActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const [dateRangeApplied, setDateRangeApplied] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commissionPercentage, setCommissionPercentage] = useState(0);
  const pageSize = 10;
  const authState = useAuthStore();

  const fetchActivities = useCallback(async (resetPage = false) => {
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
        'Date Wise': 'all' // Use 'all' for date range and filter client-side
      };
      
      const backendFilter = filterMap[selectedFilter] || 'all';
      
      // Don't send date parameters to backend - use client-side filtering instead
      const paginatedResponse = await ActivityService.getMyActivitiesPaginated(
        backendFilter,
        currentPage,
        pageSize,
        undefined,
        undefined
      );
      
      console.log('My activities fetched:', paginatedResponse.content.length);
      
      if (resetPage) {
        setActivities(paginatedResponse.content || []);
        setPage(0);
      } else {
        setActivities(prev => [...prev, ...(paginatedResponse.content || [])]);
      }
      
      // Use backend's last flag to determine if there are more pages
      setHasMore(!paginatedResponse.last);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activities');
      Alert.alert('Error', 'Failed to load activities');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [page, selectedFilter, pageSize]);

  // Fetch employee commission percentage
  useEffect(() => {
    const fetchEmployeeCommission = async () => {
      if (authState.user?.employeeId) {
        try {
          const employee = await EmployeeService.getEmployeeById(authState.user.employeeId.toString());
          setCommissionPercentage(employee.commissionPercentage || 0);
        } catch (error) {
          console.error('Error fetching employee commission:', error);
        }
      }
    };
    fetchEmployeeCommission();
  }, [authState.user?.employeeId]);

  useEffect(() => {
    fetchActivities(true);
  }, [selectedFilter, fetchActivities]);

  const onRefresh = () => {
    Haptics.impactAsync();
    setRefreshing(true);
    fetchActivities(true);
  };

  const loadMore = () => {
    if (!isLoading && hasMore && !error) {
      Haptics.impactAsync();
      setPage(prev => prev + 1);
      fetchActivities(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchActivities(true);
  };

  
  const handleFilterPress = (filter: string) => {
    Haptics.impactAsync();
    if (filter === 'Date Wise') {
      setShowDateRangeModal(true);
    } else {
      setSelectedFilter(filter);
      setDateRangeApplied(false); // Reset date range applied when switching to other filters
    }
  };

  const applyDateRange = () => {
    setSelectedFilter('Date Wise');
    setDateRangeApplied(true);
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

  // Memoized activities to avoid unnecessary recalculations
  const memoizedActivities = useMemo(() => activities, [activities]);

  // Client-side filtering for date range
  const filteredActivities = useMemo(() => {
    if (selectedFilter === 'Date Wise' && dateRangeApplied) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return activities.filter(a => {
        const activityDate = new Date(a.createdAt);
        return activityDate >= start && activityDate <= end;
      });
    }
    return activities;
  }, [activities, selectedFilter, dateRangeApplied, startDate, endDate]);

  // Calculate activity counts, earnings, and commission for different time periods
  const activityStats = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfDay);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const calculateStats = (filteredActivities: any[]) => {
      const totalEarnings = filteredActivities.reduce((sum, a) => sum + (a.amount || 0), 0);
      const totalCommission = (totalEarnings * commissionPercentage) / 100;
      return {
        count: filteredActivities.length,
        earnings: totalEarnings,
        commission: totalCommission
      };
    };

    return {
      today: calculateStats(activities.filter(a => new Date(a.createdAt) >= startOfDay)),
      yesterday: calculateStats(activities.filter(a => {
        const date = new Date(a.createdAt);
        return date >= startOfYesterday && date < startOfDay;
      })),
      thisWeek: calculateStats(activities.filter(a => new Date(a.createdAt) >= startOfWeek)),
      monthly: calculateStats(activities.filter(a => new Date(a.createdAt) >= startOfMonth)),
      total: calculateStats(activities)
    };
  }, [activities, commissionPercentage]);

  const ActivityCard = ({ activity }: { activity: Activity }) => (
    <TouchableOpacity 
      style={styles.activityCard} 
      activeOpacity={0.7}
      onPress={() => Haptics.impactAsync()}
    >
      <View style={styles.activityHeader}>
        <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type), overflow: 'visible' }]}>
          <Ionicons 
            name="checkmark-circle" 
            size={32} 
            color="#FFFFFF" 
          />
        </View>
        <View style={styles.activityInfo}>
          {activity.employeeName && activity.employeeId ? (
            <>
              <Text style={styles.activityType}>{activity.employeeName}</Text>
              <Text style={styles.activityDate}>ID: {activity.employeeId}</Text>
              <Text style={styles.activityDate}>{formatDate(activity.createdAt)}</Text>
            </>
          ) : (
            <>
              <Text style={styles.activityType}>
                {activity.description?.match(/Employee:\s*([^,]+)/)?.[1]
                  ? activity.description.match(/Employee:\s*([^,]+)/)?.[1]?.trim()
                  : activity.type}
              </Text>
              <Text style={styles.activityDate}>{formatDate(activity.createdAt)}</Text>
            </>
          )}
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.activityAmount}>₹{activity.amount.toFixed(2)}</Text>
        </View>
      </View>
      {!(activity.employeeName && activity.employeeId) && (
        <Text style={styles.activityDescription}>{activity.description}</Text>
      )}
      {activity.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="information-circle" size={14} color="#64748B" />
          <Text style={styles.activityNotes}>
            {activity.notes?.split('|').filter((part: string) => !part.trim().startsWith('Employee:')).join(' | ')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading activities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Text style={styles.title}><Text style={styles.titleAccent}>Activity</Text> List</Text>
      </View>

      {/* Activity Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#EEF2FF' }]}>
          <Text style={[styles.summaryCount, { color: '#6366F1' }]}>{activityStats.today.count}</Text>
          <Text style={styles.summaryLabel}>Today</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#ECFDF5' }]}>
          <Text style={[styles.summaryCount, { color: '#10B981' }]}>{activityStats.yesterday.count}</Text>
          <Text style={styles.summaryLabel}>Yesterday</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FFFBEB' }]}>
          <Text style={[styles.summaryCount, { color: '#F59E0B' }]}>{activityStats.thisWeek.count}</Text>
          <Text style={styles.summaryLabel}>This Week</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FDF2F8' }]}>
          <Text style={[styles.summaryCount, { color: '#EC4899' }]}>{activityStats.monthly.count}</Text>
          <Text style={styles.summaryLabel}>Monthly</Text>
        </View>
      </View>

      {/* Earnings and Commission Section */}
      <View style={styles.earningsContainer}>
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <View style={styles.earningsBadge}>
              <Ionicons name="cash" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
          </View>
          <Text style={styles.earningsAmount}>₹{activityStats.total.earnings.toFixed(0)}</Text>
          <View style={styles.earningsProgress}>
            <View style={[styles.earningsProgressBar, { width: '100%', backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.earningsSubtitle}>All activities combined</Text>
        </View>
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <View style={[styles.earningsBadge, { backgroundColor: '#6366F1' }]}>
              <Ionicons name="wallet" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.earningsLabel}>Your Commission</Text>
          </View>
          <Text style={styles.earningsAmount}>₹{activityStats.total.commission.toFixed(0)}</Text>
          <View style={styles.earningsProgress}>
            <View style={[styles.earningsProgressBar, { width: `${commissionPercentage}%`, backgroundColor: '#6366F1' }]} />
          </View>
          <Text style={styles.earningsSubtitle}>{commissionPercentage}% of earnings</Text>
        </View>
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
            colors={['#f7b638']}
            tintColor="#f7b638"
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
              <Text style={styles.emptyTitle}>Error Loading Activities</Text>
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
          ) : memoizedActivities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="document-text-outline" size={72} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitle}>No Activities Yet</Text>
              <Text style={styles.emptyMessage}>
                Your activities will appear here
              </Text>
            </View>
          ) : (
            <>
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
              {hasMore && selectedFilter !== 'Date Wise' && (
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
