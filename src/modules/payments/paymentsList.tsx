import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/paymentsList.styles';
import { Payment } from './Payments';

interface PaymentsListProps {
  payments: Payment[];
  onPaymentPress: (item: Payment) => void;
  onDeletePayment: (id: string) => void;
  onVerifyPayment: (id: string) => void;
  onCancelPayment: (id: string) => void;
  getStatusColor: (status: string) => string;
  userRole?: string;
}

export default function PaymentsList({ payments, onPaymentPress, onDeletePayment, onVerifyPayment, onCancelPayment, getStatusColor, userRole }: PaymentsListProps) {

  const getPaymentTypeIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'customer_payment':
        return 'arrow-down';
      case 'staff_payout':
        return 'arrow-up';
      default:
        return 'card';
    }
  };

  const getPaymentTypeColor = (paymentType: string) => {
    switch (paymentType) {
      case 'customer_payment':
        return '#10B981';
      case 'staff_payout':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return 'cash';
      case 'online':
        return 'globe';
      default:
        return 'card';
    }
  };

  const getVerificationColor = (status?: string) => {
    switch (status) {
      case 'VERIFIED':
        return '#10B981';
      case 'PENDING':
        return '#F59E0B';
      case 'REJECTED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.paymentsList}>
      {payments.map((item) => (
        <View key={item.id} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View style={styles.recipientInfo}>
              <View style={[styles.recipientIcon, { backgroundColor: getPaymentTypeColor(item.paymentType) }]}>
                <Ionicons name={getPaymentTypeIcon(item.paymentType)} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.recipientDetails}>
                <Text style={styles.recipientName}>{item.recipientName}</Text>
                <Text style={styles.recipientType}>
                  {item.paymentType === 'customer_payment' ? 'Customer Payment' : 'Staff Payout'}
                </Text>
              </View>
            </View>
            <View style={styles.paymentAmount}>
              <Text style={styles.amountText}>₹{item.amount.toFixed(2)}</Text>
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
          </View>

          <View style={styles.paymentDetails}>
            <View style={styles.detailRow}>
              <Ionicons name={getPaymentMethodIcon(item.paymentMethod)} size={14} color="#6B7280" />
              <Text style={styles.detailText}>{item.paymentMethod.replace('_', ' ')}</Text>
              <Text style={styles.detailSeparator}>•</Text>
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
            <Text style={styles.descriptionText}>{item.description}</Text>
            
            {item.paymentType === 'staff_payout' && item.commissionRate !== undefined && (
              <View style={styles.commissionInfo}>
                <View style={styles.commissionRow}>
                  <Ionicons name="pricetag" size={12} color="#6B7280" />
                  <Text style={styles.commissionText}>Commission: {item.commissionRate}%</Text>
                  <Text style={styles.commissionAmount}>₹{item.commissionAmount?.toFixed(2)}</Text>
                </View>
                {item.netAmount !== undefined && (
                  <View style={styles.commissionRow}>
                    <Ionicons name="wallet" size={12} color="#6B7280" />
                    <Text style={styles.commissionText}>Net Payout:</Text>
                    <Text style={styles.netAmount}>₹{item.netAmount.toFixed(2)}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.paymentFooter}>
            <View style={styles.statusContainer}>
              {item.status === 'cancelled' ? (
                <>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    Cancelled
                  </Text>
                </>
              ) : item.verificationStatus === 'PENDING' ? (
                <>
                  <View style={[styles.statusIndicator, { backgroundColor: getVerificationColor(item.verificationStatus) }]} />
                  <Text style={[styles.statusText, { color: getVerificationColor(item.verificationStatus) }]}>
                    Verification Pending
                  </Text>
                </>
              ) : item.verificationStatus === 'VERIFIED' ? (
                <>
                  <View style={[styles.statusIndicator, { backgroundColor: getVerificationColor(item.verificationStatus) }]} />
                  <Text style={[styles.statusText, { color: getVerificationColor(item.verificationStatus) }]}>
                    Verified
                  </Text>
                </>
              ) : (
                <>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </>
              )}
            </View>
                        {userRole?.toUpperCase() === 'STAFF' && item.verificationStatus === 'PENDING' && item.status !== 'cancelled' && (
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => onVerifyPayment(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </TouchableOpacity>
            )}
            {userRole?.toUpperCase() === 'STAFF' && item.status !== 'cancelled' && item.verificationStatus !== 'VERIFIED' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => onCancelPayment(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </TouchableOpacity>
            )}
            {userRole?.toUpperCase() === 'OWNER' && item.verificationStatus !== 'VERIFIED' && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeletePayment(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
