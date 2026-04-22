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
  loadingPayments?: Set<string>;
  error?: string | null;
}

export default function PaymentsList({ payments, onPaymentPress, onDeletePayment, onVerifyPayment, onCancelPayment, getStatusColor, userRole, loadingPayments = new Set(), error }: PaymentsListProps) {

  const getPaymentTypeIcon = (paymentType: string, userRole?: string) => {
    const isStaff = userRole?.toUpperCase() === 'STAFF';
    
    switch (paymentType) {
      case 'customer_payment':
        return isStaff ? 'arrow-down' : 'arrow-down'; // Green down arrow for both
      case 'staff_payout':
        return isStaff ? 'arrow-down' : 'arrow-up'; // Green down for staff, red up for owner
      default:
        return 'card';
    }
  };

  const getPaymentTypeColor = (paymentType: string, userRole?: string) => {
    const isStaff = userRole?.toUpperCase() === 'STAFF';
    
    switch (paymentType) {
      case 'customer_payment':
        return '#10B981'; // Green for both
      case 'staff_payout':
        return isStaff ? '#10B981' : '#EF4444'; // Green for staff, red for owner
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

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLoading = (id: string) => loadingPayments.has(id);

  return (
    <View style={styles.paymentsList}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {payments.map((item) => (
        <View key={item.id} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View style={styles.recipientInfo}>
              <View style={[styles.recipientIcon, { backgroundColor: getPaymentTypeColor(item.paymentType, userRole) }]}>
                <Ionicons name={getPaymentTypeIcon(item.paymentType, userRole)} size={20} color="#FFFFFF" />
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
              ) : item.status === 'verified' ? (
                <>
                  <View style={[styles.statusIndicator, { backgroundColor: getVerificationColor(item.status) }]} />
                  <Text style={[styles.statusText, { color: getVerificationColor(item.status) }]}>
                    Verified
                  </Text>
                </>
              ) : item.status === 'pending' ? (
                <>
                  <View style={[styles.statusIndicator, { backgroundColor: getVerificationColor(item.status) }]} />
                  <Text style={[styles.statusText, { color: getVerificationColor(item.status) }]}>
                    Pending
                  </Text>
                </>
              ) : item.status === 'rejected' ? (
                <>
                  <View style={[styles.statusIndicator, { backgroundColor: getVerificationColor(item.status) }]} />
                  <Text style={[styles.statusText, { color: getVerificationColor(item.status) }]}>
                    Rejected
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
            {userRole?.toUpperCase() === 'STAFF' && item.status === 'pending' && (
              <TouchableOpacity
                style={[styles.verifyButton, isLoading(item.id) && styles.disabledButton]}
                onPress={() => !isLoading(item.id) && onVerifyPayment(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
                disabled={isLoading(item.id)}
              >
                <Ionicons 
                  name={isLoading(item.id) ? "hourglass-outline" : "checkmark-circle"} 
                  size={18} 
                  color={isLoading(item.id) ? "#9CA3AF" : "#10B981"} 
                />
              </TouchableOpacity>
            )}
            {userRole?.toUpperCase() === 'STAFF' && item.status !== 'cancelled' && item.status !== 'verified' && (
              <TouchableOpacity
                style={[styles.cancelButton, isLoading(item.id) && styles.disabledButton]}
                onPress={() => !isLoading(item.id) && onCancelPayment(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
                disabled={isLoading(item.id)}
              >
                <Ionicons 
                  name={isLoading(item.id) ? "hourglass-outline" : "close-circle"} 
                  size={18} 
                  color={isLoading(item.id) ? "#9CA3AF" : "#EF4444"} 
                />
              </TouchableOpacity>
            )}
            {userRole?.toUpperCase() === 'OWNER' && item.status !== 'verified' && (
              <TouchableOpacity
                style={[styles.deleteButton, isLoading(item.id) && styles.disabledButton]}
                onPress={() => !isLoading(item.id) && onDeletePayment(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
                disabled={isLoading(item.id)}
              >
                <Ionicons 
                  name={isLoading(item.id) ? "hourglass-outline" : "trash-outline"} 
                  size={18} 
                  color={isLoading(item.id) ? "#9CA3AF" : "#EF4444"} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
