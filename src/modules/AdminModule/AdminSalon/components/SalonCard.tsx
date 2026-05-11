import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Salon } from '../types/salon.types';
import { StatusBadge } from './StatusBadge';
import { PlanBadge } from './PlanBadge';

interface SalonCardProps {
  salon: Salon;
  onPress: (salon: Salon) => void;
  onActionPress: (action: string, salon: Salon) => void;
}

export const SalonCard: React.FC<SalonCardProps> = ({ salon, onPress, onActionPress }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: string) => {
    return amount;
  };

  const animatedStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
      {
        scale: scaleValue,
      },
    ],
    opacity: animatedValue,
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity 
        style={styles.mainContent}
        onPress={() => onPress(salon)} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.header}>
          <View style={styles.salonInfo}>
            <Image source={{ uri: salon.logo || 'https://via.placeholder.com/48' }} style={styles.logo} />
            <View style={styles.salonDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.salonName}>{salon.name}</Text>
                {salon.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                )}
              </View>
              <Text style={styles.ownerName}>{salon.owner.name}</Text>
              <Text style={styles.location}>{salon.business.city}, {salon.business.state}</Text>
            </View>
          </View>
          <View style={styles.statusSection}>
            <StatusBadge status={salon.subscription.status} size="small" />
            <PlanBadge plan={salon.subscription.plan} size="small" />
          </View>
        </View>

        <View style={styles.metrics}>
          <View style={styles.metricItem}>
            <Ionicons name="people" size={14} color="#6B7280" />
            <Text style={styles.metricText}>{salon.metrics.staffCount} Staff</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="cash" size={14} color="#10B981" />
            <Text style={styles.metricText}>{formatCurrency(salon.metrics.monthlyRevenue)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="person" size={14} color="#6B7280" />
            <Text style={styles.metricText}>{salon.metrics.activeClients} Clients</Text>
          </View>
        </View>

        <View style={styles.dates}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Joined</Text>
            <Text style={styles.dateValue}>{formatDate(salon.dates.joinedDate)}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Expiry</Text>
            <Text style={styles.dateValue}>{formatDate(salon.subscription.expiryDate)}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Last Active</Text>
            <Text style={styles.dateValue}>{formatDate(salon.dates.lastActive)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => onActionPress('view', salon)}
        >
          <Ionicons name="eye" size={14} color="#FFFFFF" />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => onActionPress('edit', salon)}
        >
          <Ionicons name="create" size={14} color="#780115" />
          <Text style={[styles.actionText, { color: '#780115' }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => onActionPress('login', salon)}
        >
          <Ionicons name="log-in" size={14} color="#780115" />
          <Text style={[styles.actionText, { color: '#780115' }]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.moreButton]}
          onPress={() => onActionPress('more', salon)}
        >
          <Ionicons name="ellipsis-vertical" size={14} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 0,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  salonInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 14,
  },
  salonDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  salonName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginRight: 8,
    letterSpacing: -0.2,
  },
  ownerName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  location: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 0.1,
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 3,
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#780115',
    shadowColor: '#780115',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  moreButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 0.5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
