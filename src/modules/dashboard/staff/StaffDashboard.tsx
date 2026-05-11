import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles/staffDashboard.styles';
import { ActivityService } from '../../../services/activityService';
import { reportsService, StaffReportResponse } from '../../../services/reports/reportsService';
import { StorageService, UserData } from '../../../services/storage/storageService';
import { ProfileService } from '../../../services/profileService';
import { NotificationService } from '../../../services/notificationService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';
import { colors } from '../../../shared/theme/colors';
import { PieChart, LineChart } from 'react-native-chart-kit';

interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hr${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

export default function StaffDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activityStats, setActivityStats] = useState({
    todayCount: 0,
    yesterdayCount: 0,
    weekCount: 0,
    monthCount: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState<StaffReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authState = useAuthStore();
  const staffId = authState.user?.employeeId ? parseInt(authState.user.employeeId) : 1;

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;
  const summaryOpacity = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const performanceOpacity = useRef(new Animated.Value(0)).current;
  const performanceTranslateY = useRef(new Animated.Value(20)).current;
  const timelineOpacity = useRef(new Animated.Value(0)).current;

  // Animated count values
  const [displayCounts, setDisplayCounts] = useState({
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0
  });

  // Number animation helper
  const animateNumber = (target: number, key: 'today' | 'yesterday' | 'week' | 'month', duration = 800) => {
    const startValue = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);

      setDisplayCounts(prev => ({ ...prev, [key]: currentValue }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Run animations when data loads
  useEffect(() => {
    if (!loading && activityStats) {
      // Header animation
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Summary section animation
      Animated.timing(summaryOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }).start();

      // Staggered card animations
      cardAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: 300 + index * 100,
          useNativeDriver: true,
        }).start();
      });

      // Performance card animation
      Animated.parallel([
        Animated.timing(performanceOpacity, {
          toValue: 1,
          duration: 500,
          delay: 600,
          useNativeDriver: true,
        }),
        Animated.timing(performanceTranslateY, {
          toValue: 0,
          duration: 500,
          delay: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Timeline animation
      Animated.timing(timelineOpacity, {
        toValue: 1,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }).start();

      // Animate numbers
      animateNumber(activityStats.todayCount, 'today');
      animateNumber(activityStats.yesterdayCount, 'yesterday');
      animateNumber(activityStats.weekCount, 'week');
      animateNumber(activityStats.monthCount, 'month');
    }
  }, [loading, activityStats]);

  // Fetch user data and activity stats on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refetch staff report when period changes
  useEffect(() => {
    const fetchStaffReport = async () => {
      try {
        const report = await reportsService.getStaffReport(staffId, selectedPeriod);
        setReportData(report);
      } catch (reportError: any) {
        console.error('Error fetching staff report:', reportError);
      }
    };
    fetchStaffReport();
  }, [selectedPeriod, staffId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user data from storage first
      const user = await StorageService.getUserData();
      setUserData(user);

      // Fetch fresh profile data from backend
      if (user?.id) {
        try {
          const profileData = await ProfileService.getProfileData(parseInt(user.id));
          // Update user data with fresh profile data
          const updatedUserData = { ...user, ...profileData };
          setUserData(updatedUserData);
          // Update local storage with fresh data
          await StorageService.setUserData(updatedUserData);
        } catch (profileError) {
          console.error('Error fetching profile data:', profileError);
          // Continue with stored data if profile fetch fails
        }
      }

      // Fetch activities using ActivityService (same as Activity List)
      const activitiesResponse = await ActivityService.getMyActivitiesPaginated('all', 0, 100);
      const activities = activitiesResponse.content || [];

      // Calculate stats from activities (same logic as Activity List)
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfYesterday = new Date(startOfDay);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayCount = activities.filter((a: any) => new Date(a.createdAt) >= startOfDay).length;
      const yesterdayCount = activities.filter((a: any) => {
        const date = new Date(a.createdAt);
        return date >= startOfYesterday && date < startOfDay;
      }).length;
      const weekCount = activities.filter((a: any) => new Date(a.createdAt) >= startOfWeek).length;
      const monthCount = activities.filter((a: any) => new Date(a.createdAt) >= startOfMonth).length;

      setActivityStats({
        todayCount,
        yesterdayCount,
        weekCount,
        monthCount
      });

      // Fetch staff report data
      try {
        const report = await reportsService.getStaffReport(staffId, selectedPeriod);
        setReportData(report);
      } catch (reportError: any) {
        console.error('Error fetching staff report:', reportError);
        // Don't fail entire dashboard if staff report fails
      }

      // Fetch notifications
      try {
        const notifs = await NotificationService.getMyNotifications();
        setNotifications(notifs || []);
        const count = await NotificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (notifError) {
        console.error('Error fetching notifications:', notifError);
        // Don't fail entire dashboard if notifications fail
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async () => {
    setShowNotifications(true);
    try {
      await NotificationService.markAllAsRead();
      setUnreadCount(0);
      // Update local notification read status
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      setUnreadCount(0);
    }
  };

  // Get display name from user data
  const displayName = userData?.name || 'Staff Member';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <View style={styles.mainContainer}>
      {/* Header Card */}
      <Animated.View style={[
        styles.headerCard,
        { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
      ]}>
        <LinearGradient
          colors={[colors.primary.main, colors.primary.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.onlinePulse}>
                <View style={styles.onlineIndicator} />
              </View>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.profileName}>{displayName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8} onPress={handleNotificationPress}>
            <Ionicons name="notifications" size={22} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
      {/* Notification Modal */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationPanel}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            {notifications.length === 0 ? (
              <View style={styles.emptyNotificationsContainer}>
                <View style={styles.emptyNotificationsIcon}>
                  <Ionicons name="notifications-off-outline" size={28} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyNotificationsTitle}>No Notifications</Text>
                <Text style={styles.emptyNotificationsSubtitle}>
                  You&apos;re all caught up!{'\n'}New activity and payment alerts will appear here.
                </Text>
              </View>
            ) : (
              notifications.map((notif) => (
                <TouchableOpacity key={notif.id} style={[styles.notificationItem, !notif.read && styles.notificationUnread]}>
                  <View style={styles.notificationIcon}>
                    <Ionicons
                      name={notif.type === 'appointment' ? 'calendar' : notif.type === 'payment' ? 'cash' : 'information-circle'}
                      size={20}
                      color="#2563EB"
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationItemTitle}>{notif.title}</Text>
                    <Text style={styles.notificationMessage}>{notif.message}</Text>
                    <Text style={styles.notificationTime}>{formatRelativeTime(notif.createdAt)}</Text>
                  </View>
                  {!notif.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </Modal>

     
      {/* Activity Summary */}
      <Animated.View style={[
        styles.activitySummarySection,
        { opacity: summaryOpacity }
      ]}>
        <Text style={styles.activitySummaryTitle}>Activity Summary</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary.main} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchDashboardData} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.summaryContainer}>
            <Animated.View style={[
              styles.summaryCard,
              { backgroundColor: '#EEF2FF' },
              {
                opacity: cardAnimations[0],
                transform: [{
                  translateY: cardAnimations[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}>
              <Text style={[styles.summaryCount, { color: '#6366F1' }]}>
                {displayCounts.today}
              </Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </Animated.View>
            <Animated.View style={[
              styles.summaryCard,
              { backgroundColor: '#ECFDF5' },
              {
                opacity: cardAnimations[1],
                transform: [{
                  translateY: cardAnimations[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}>
              <Text style={[styles.summaryCount, { color: '#10B981' }]}>
                {displayCounts.yesterday}
              </Text>
              <Text style={styles.summaryLabel}>Yesterday</Text>
            </Animated.View>
            <Animated.View style={[
              styles.summaryCard,
              { backgroundColor: '#FFFBEB' },
              {
                opacity: cardAnimations[2],
                transform: [{
                  translateY: cardAnimations[2].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}>
              <Text style={[styles.summaryCount, { color: '#F59E0B' }]}>
                {displayCounts.week}
              </Text>
              <Text style={styles.summaryLabel}>This Week</Text>
            </Animated.View>
            <Animated.View style={[
              styles.summaryCard,
              { backgroundColor: '#FDF2F8' },
              {
                opacity: cardAnimations[3],
                transform: [{
                  translateY: cardAnimations[3].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}>
              <Text style={[styles.summaryCount, { color: '#EC4899' }]}>
                {displayCounts.month}
              </Text>
              <Text style={styles.summaryLabel}>Monthly</Text>
            </Animated.View>
          </View>
        )}
      </Animated.View>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        {['today', 'week', 'month'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Statistics Cards */}
      {reportData && reportData.staffStats && reportData.staffStats.length > 0 && (
        <View style={styles.statsContainer}>
          {reportData.staffStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Earnings Breakdown */}
      {reportData && reportData.earningsBreakdown && reportData.earningsBreakdown.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={styles.chartWrapper}>
            <PieChart
              data={reportData.earningsBreakdown.map((item, index) => ({
                name: item.category,
                population: parseFloat(item.amount.replace('₹', '').replace(',', '')),
                color: item.color,
                legendFontColor: '#000000',
                legendFontSize: 13,
              }))}
              width={Dimensions.get('window').width - 64}
              height={240}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 20,
                },
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="20"
              absolute
              hasLegend={true}
              style={styles.pieChart}
            />
          </View>
        </View>
      )}

      {/* Payments Summary */}
      {reportData && reportData.paymentsSummary && reportData.paymentsSummary.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments Summary</Text>
          <View style={styles.statsContainer}>
            {reportData.paymentsSummary.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Earnings Trends */}
      {reportData && reportData.monthlyTrends && reportData.monthlyTrends.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Trends</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: reportData.monthlyTrends.map(t => t.month.split(' ')[0]),
                datasets: [{
                  data: reportData.monthlyTrends.map(t => parseFloat(t.earnings.replace('₹', '').replace(',', ''))),
                  color: (opacity = 1) => `rgba(247, 182, 56, ${opacity})`,
                  strokeWidth: 4,
                }],
              }}
              width={Dimensions.get('window').width - 64}
              height={240}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(247, 182, 56, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 20,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '3',
                  stroke: colors.primary.main,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: 'rgba(0, 0, 0, 0.05)',
                },
              }}
              bezier
              style={styles.lineChart}
            />
          </View>
        </View>
      )}

      {/* Yearly Trends */}
      {reportData && reportData.yearlyTrends && reportData.yearlyTrends.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yearly Trends</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: reportData.yearlyTrends.map(t => t.year),
                datasets: [{
                  data: reportData.yearlyTrends.map(t => parseFloat(t.earnings.replace('₹', '').replace(',', ''))),
                  color: (opacity = 1) => `rgba(229, 169, 46, ${opacity})`,
                  strokeWidth: 4,
                }],
              }}
              width={Dimensions.get('window').width - 64}
              height={240}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(229, 169, 46, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 20,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '3',
                  stroke: colors.primary.dark,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: 'rgba(0, 0, 0, 0.05)',
                },
              }}
              bezier
              style={styles.lineChart}
            />
          </View>
        </View>
      )}
      </ScrollView>
    </View>
  );
}
