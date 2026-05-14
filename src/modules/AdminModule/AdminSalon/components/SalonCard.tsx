import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Salon, SalonStatus } from '../types/salon.types';
import { PlanBadge } from './PlanBadge';
import { StatusBadge } from './StatusBadge';

interface SalonCardProps {
  salon: Salon;
  onPress: (salon: Salon) => void;
  onActionPress: (action: string, salon: Salon) => void;
}

export const SalonCard: React.FC<SalonCardProps> = ({ salon, onPress, onActionPress }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const getStatusBorderColor = (status: SalonStatus): string => {
    const statusColors: { [key in SalonStatus]: string } = {
      active: '#059669',
      trial: '#3B82F6',
      expired: '#DC2626',
      suspended: '#EA580C',
      inactive: '#9CA3AF',
    };
    return statusColors[status] || '#9CA3AF';
  };

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

  const initials = salon.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const statusColor = getStatusBorderColor(salon.subscription.status);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.statusStripe, { backgroundColor: statusColor }]} />

      <TouchableOpacity
        style={styles.mainContent}
        onPress={() => onPress(salon)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.92}
      >
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            {salon.logo ? (
              <Image source={{ uri: salon.logo }} style={styles.logo} />
            ) : (
              <View style={[styles.avatarCircle, { backgroundColor: `${statusColor}18` }]}>
                <Text style={[styles.avatarText, { color: statusColor }]}>{initials}</Text>
              </View>
            )}
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          </View>

          <View style={styles.salonDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.salonName} numberOfLines={1}>{salon.name}</Text>
              {salon.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color="#059669" style={styles.verifiedIcon} />
              )}
            </View>
            <Text style={styles.shopId}>Shop Id: <Text style={styles.shopIdValue}>{salon.shopId}</Text></Text>
            <Text style={styles.ownerName}>{salon.owner.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={11} color="#9CA3AF" />
              <Text style={styles.location}>{salon.business.city}, {salon.business.state}</Text>
            </View>
          </View>

          <View style={styles.badgesCol}>
            <StatusBadge status={salon.subscription.status} size="small" />
            <PlanBadge plan={salon.subscription.plan} size="small" />
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricChip}>
            <Ionicons name="people" size={12} color="#780115" />
            <Text style={styles.metricVal}>{salon.metrics.staffCount}</Text>
            <Text style={styles.metricLbl}>Staff</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricChip}>
            <Ionicons name="cash" size={12} color="#059669" />
            <Text style={[styles.metricVal, { color: '#059669' }]}>{formatCurrency(salon.metrics.monthlyRevenue)}</Text>
            <Text style={styles.metricLbl}>Revenue</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricChip}>
            <Ionicons name="person" size={12} color="#3B82F6" />
            <Text style={[styles.metricVal, { color: '#3B82F6' }]}>{salon.metrics.activeClients}</Text>
            <Text style={styles.metricLbl}>Clients</Text>
          </View>
        </View>

        <View style={styles.datesRow}>
          <View style={styles.dateChip}>
            <Text style={styles.dateLbl}>Joined</Text>
            <Text style={styles.dateVal}>{formatDate(salon.dates.joinedDate)}</Text>
          </View>
          <View style={styles.dateChip}>
            <Text style={styles.dateLbl}>Expires</Text>
            <Text style={styles.dateVal}>{formatDate(salon.subscription.expiryDate)}</Text>
          </View>
          <View style={styles.dateChip}>
            <Text style={styles.dateLbl}>Last Active</Text>
            <Text style={styles.dateVal}>{formatDate(salon.dates.lastActive)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionPill, styles.primaryPill]} onPress={() => onActionPress('view', salon)}>
          <Ionicons name="eye-outline" size={13} color="#FFFFFF" />
          <Text style={styles.pillTextPrimary}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionPill, styles.outlinePill]} onPress={() => onActionPress('edit', salon)}>
          <Ionicons name="create-outline" size={13} color="#780115" />
          <Text style={styles.pillTextOutline}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionPill, styles.outlinePill]} onPress={() => onActionPress('login', salon)}>
          <Ionicons name="log-in-outline" size={13} color="#780115" />
          <Text style={styles.pillTextOutline}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreIconBtn} onPress={() => onActionPress('more', salon)}>
          <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  statusStripe: {
    height: 4,
    width: '100%',
  },
  mainContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  salonDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  salonName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A2E',
    flex: 1,
    letterSpacing: -0.2,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  shopId: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 3,
  },
  shopIdValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#780115',
  },
  ownerName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  badgesCol: {
    alignItems: 'flex-end',
    gap: 5,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6F3',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  metricChip: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.2,
  },
  metricLbl: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateChip: {
    alignItems: 'center',
    flex: 1,
  },
  dateLbl: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dateVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 2,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    flex: 1,
  },
  primaryPill: {
    backgroundColor: '#780115',
    shadowColor: '#780115',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  outlinePill: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  pillTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  pillTextOutline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#780115',
    letterSpacing: 0.2,
  },
  moreIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
