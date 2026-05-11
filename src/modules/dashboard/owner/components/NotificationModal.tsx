import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { NotificationModalProps, Notification, NotificationGroup } from '../types/dashboard.types';
import { NOTIFICATION_CONFIG, DATE_GROUPING_CONFIG } from '../config/dashboardConfig';
import { styles as dashboardStyles } from '../styles/ownerDashboard.styles';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / DATE_GROUPING_CONFIG.RELATIVE_TIME_THRESHOLDS.JUST_NOW_SECONDS);
  const diffHour = Math.floor(diffMin / DATE_GROUPING_CONFIG.RELATIVE_TIME_THRESHOLDS.MINUTE_THRESHOLD);
  const diffDay = Math.floor(diffHour / DATE_GROUPING_CONFIG.RELATIVE_TIME_THRESHOLDS.HOUR_THRESHOLD);

  if (diffSec < DATE_GROUPING_CONFIG.RELATIVE_TIME_THRESHOLDS.JUST_NOW_SECONDS) return 'Just now';
  if (diffMin < DATE_GROUPING_CONFIG.RELATIVE_TIME_THRESHOLDS.MINUTE_THRESHOLD) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < DATE_GROUPING_CONFIG.RELATIVE_TIME_THRESHOLDS.HOUR_THRESHOLD) return `${diffHour} hr${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < DATE_GROUPING_CONFIG.RELATIVE_TIME_THRESHOLDS.DAY_THRESHOLD) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function groupNotificationsByDate(notifications: Notification[]): NotificationGroup[] {
  const groups: { [key: string]: Notification[] } = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  notifications.forEach((notif) => {
    const date = new Date(notif.createdAt);
    let key: string;

    if (date >= today) {
      key = 'today';
    } else if (date >= yesterday && date < today) {
      key = 'yesterday';
    } else {
      key = 'earlier';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notif);
  });

  return [
    { date: 'today', label: DATE_GROUPING_CONFIG.LABELS.TODAY, notifications: groups['today'] || [] },
    { date: 'yesterday', label: DATE_GROUPING_CONFIG.LABELS.YESTERDAY, notifications: groups['yesterday'] || [] },
    { date: 'earlier', label: DATE_GROUPING_CONFIG.LABELS.EARLIER, notifications: groups['earlier'] || [] },
  ].filter((group) => group.notifications.length > 0);
}

const NotificationItem: React.FC<{ notification: Notification; onPress?: () => void }> = React.memo(function NotificationItem({ notification, onPress }) {
  const iconName = useMemo(() => {
    return (NOTIFICATION_CONFIG.ICON_MAPPING[notification.type as keyof typeof NOTIFICATION_CONFIG.ICON_MAPPING] || NOTIFICATION_CONFIG.ICON_MAPPING.default) as any;
  }, [notification.type]);

  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown.duration(300).delay(50)}
      style={[dashboardStyles.notificationItem, !notification.read && dashboardStyles.notificationUnread]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${notification.title}: ${notification.message}`}
      accessibilityRole="button"
      accessibilityState={{ selected: !notification.read }}
    >
      <View style={dashboardStyles.notificationIcon}>
        <Ionicons name={iconName} size={20} color={NOTIFICATION_CONFIG.ICON_COLOR} />
      </View>
      <View style={dashboardStyles.notificationContent}>
        <Text style={dashboardStyles.notificationItemTitle}>{notification.title}</Text>
        <Text style={dashboardStyles.notificationMessage} numberOfLines={2}>{notification.message}</Text>
        <Text style={dashboardStyles.notificationTime}>{formatRelativeTime(notification.createdAt)}</Text>
      </View>
      {!notification.read && <View style={dashboardStyles.unreadDot} />}
    </AnimatedTouchableOpacity>
  );
});

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  notifications,
  unreadCount,
  onClose,
  onNotificationPress,
  onMarkAllAsRead,
}) => {
  const groupedNotifications = useMemo(() => groupNotificationsByDate(notifications), [notifications]);

  const renderNotificationGroup = ({ item: group }: { item: NotificationGroup }) => (
    <View key={group.date}>
      <Text style={styles.dateLabel}>{group.label}</Text>
      {group.notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onPress={() => onNotificationPress?.(notification)}
        />
      ))}
    </View>
  );

  const handleOpen = React.useCallback(() => {
    onMarkAllAsRead?.();
  }, [onMarkAllAsRead]);

  React.useEffect(() => {
    if (visible) {
      handleOpen();
    }
  }, [visible, handleOpen]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <AnimatedView entering={FadeIn.duration(200)} style={styles.modalOverlay}>
        <AnimatedView entering={FadeInDown.duration(300)} style={dashboardStyles.notificationPanel}>
          <View style={dashboardStyles.notificationHeader}>
            <Text style={dashboardStyles.notificationTitle}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close notifications" accessibilityRole="button">
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {notifications.length === 0 ? (
            <View style={dashboardStyles.emptyNotificationsContainer}>
              <View style={dashboardStyles.emptyNotificationsIcon}>
                <Ionicons
                  name={NOTIFICATION_CONFIG.EMPTY_STATE.ICON as any}
                  size={28}
                  color={NOTIFICATION_CONFIG.EMPTY_STATE.ICON_COLOR}
                />
              </View>
              <Text style={dashboardStyles.emptyNotificationsTitle}>{NOTIFICATION_CONFIG.EMPTY_STATE.TITLE}</Text>
              <Text style={dashboardStyles.emptyNotificationsSubtitle}>
                {NOTIFICATION_CONFIG.EMPTY_STATE.SUBTITLE}
              </Text>
            </View>
          ) : (
            <FlatList
              data={groupedNotifications}
              renderItem={renderNotificationGroup}
              keyExtractor={(item) => item.date}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              maxToRenderPerBatch={10}
              windowSize={5}
              initialNumToRender={5}
              removeClippedSubviews
            />
          )}
        </AnimatedView>
      </AnimatedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  listContent: {
    paddingVertical: 16,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
});

export default React.memo(NotificationModal);
