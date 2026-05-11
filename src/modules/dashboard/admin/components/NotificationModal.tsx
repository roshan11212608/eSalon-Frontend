import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/adminDashboard.styles';
import { NotificationModalProps } from '../types/dashboard.types';

export default function NotificationModal({
  visible,
  notifications,
  unreadCount,
  onClose,
  onMarkAllAsRead,
}: NotificationModalProps) {
  const getIconByType = (type: string) => {
    switch (type) {
      case 'salon': return 'storefront';
      case 'subscription': return 'card';
      case 'payment': return 'cash';
      case 'support': return 'help-circle';
      default: return 'notifications';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.notificationPanel}>
          {/* Header */}
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>
              Notifications ({unreadCount} unread)
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={onMarkAllAsRead}>
                  <Text style={{ color: '#f7b638', fontWeight: '600', fontSize: 14 }}>
                    Mark all read
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <View style={styles.emptyNotificationsContainer}>
              <View style={styles.emptyNotificationsIcon}>
                <Ionicons name="notifications-off-outline" size={32} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyNotificationsTitle}>No Notifications</Text>
              <Text style={styles.emptyNotificationsSubtitle}>
                You&apos;re all caught up! New alerts will appear here.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.map((notification) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.notificationUnread,
                  ]}
                >
                  <View style={[styles.notificationIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Ionicons
                      name={getIconByType(notification.type) as any}
                      size={20}
                      color="#2563EB"
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationItemTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.createdAt}</Text>
                  </View>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
