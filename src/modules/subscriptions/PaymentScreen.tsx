import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import type { OwnerPlan } from './types';
import { PaymentService } from './services/PaymentService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'pending_verification';

interface PaymentScreenParams {
  planId: string;
  amount: string;
  duration: string;
  selectedPlan?: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<PaymentScreenParams>();
  const authState = useAuthStore();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState<'India' | 'Nepal' | 'Others' | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'ESEWA' | 'KHALTI' | null>(null);
  const [plan, setPlan] = useState<OwnerPlan | null>(null);

  const planId = parseInt(params.planId || '0');
  const amount = parseFloat(params.amount || '0');
  const duration = parseInt(params.duration || '30');

  // Load Razorpay script for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Detect country (simplified - in production, use geolocation API)
  useEffect(() => {
    // Don't auto-select country - let user choose
  }, []);

  const handleCountryChange = (newCountry: 'India' | 'Nepal' | 'Others') => {
    setCountry(newCountry);
  };

  const handleRazorpayPayment = async () => {
    if (loading) return;
    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Mock Razorpay payment for testing - replace with actual integration when you have a valid key
      // Simulate successful payment after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call backend to verify payment (subscription activation temporarily disabled)
      await PaymentService.verifyRazorpayPayment({
        razorpayPaymentId: 'mock_payment_id_' + Date.now(),
        razorpayOrderId: 'mock_order_id_' + Date.now(),
        razorpaySignature: 'mock_signature',
        planId,
        shopId: Number(authState.user?.shopId) || 1,
      });
      
      setPaymentStatus('success');
      setLoading(false);
      
      // Show success alert
      Alert.alert('Payment Successful', 'Payment recorded successfully. Subscription activation will be implemented once backend issue is fixed.', [
        { text: 'OK', onPress: () => router.replace('/(owner-tabs)/subscriptions') }
      ]);
    } catch (error) {
      setPaymentStatus('failed');
      setLoading(false);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const verifyRazorpayPayment = async (paymentData: any) => {
    try {
      await PaymentService.verifyRazorpayPayment({
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpaySignature: paymentData.razorpay_signature,
        planId,
        shopId: Number(authState.user?.shopId) || 1,
      });
      setPaymentStatus('success');
      Alert.alert('Success', 'Payment successful! Subscription activated.');
      setTimeout(() => {
        router.replace('/(owner-tabs)/subscriptions');
      }, 2000);
    } catch (error) {
      setPaymentStatus('failed');
      Alert.alert('Error', 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setUploadedImage(result.assets[0].uri);
    }
  };

  const handleNepalPaymentSubmit = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method (eSewa or Khalti)');
      return;
    }
    if (!uploadedImage) {
      Alert.alert('Error', 'Please upload payment screenshot');
      return;
    }

    setLoading(true);
    try {
      // Convert image URI to base64 for upload
      const formData = new FormData();
      formData.append('file', {
        uri: uploadedImage,
        type: 'image/jpeg',
        name: 'payment_proof.jpg',
      } as any);

      // For now, we'll use base64 encoding
      const base64Image = await fetch(uploadedImage).then(res => res.blob()).then(blob => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      });

      await PaymentService.uploadNepalPaymentProof({
        planId,
        amount,
        paymentMethod: selectedPaymentMethod,
        transactionId: '', // TODO: Get from user input
        paymentProofImage: base64Image as string,
      });

      setPaymentStatus('pending_verification');
      Alert.alert('Success', 'Payment submitted for verification');
      setTimeout(() => {
        router.replace('/(owner-tabs)/subscriptions');
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload payment proof');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <View style={s.container}>
        <View style={s.centerContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          <Text style={s.successTitle}>Payment Successful!</Text>
          <Text style={s.successText}>Your subscription has been activated.</Text>
          <TouchableOpacity style={s.backButton} onPress={() => router.replace('/(owner-tabs)/subscriptions')}>
            <Text style={s.backButtonText}>Back to Subscriptions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <View style={s.container}>
        <View style={s.centerContainer}>
          <Ionicons name="close-circle" size={80} color="#EF4444" />
          <Text style={s.errorTitle}>Payment Failed</Text>
          <Text style={s.errorText}>Something went wrong. Please try again.</Text>
          <TouchableOpacity style={s.retryButton} onPress={() => setPaymentStatus('idle')}>
            <Text style={s.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (paymentStatus === 'pending_verification') {
    return (
      <View style={s.container}>
        <View style={s.centerContainer}>
          <Ionicons name="time" size={80} color="#F59E0B" />
          <Text style={s.pendingTitle}>Payment Submitted</Text>
          <Text style={s.pendingText}>Your payment is being verified. You will be notified once approved.</Text>
          <TouchableOpacity style={s.backButton} onPress={() => router.replace('/(owner-tabs)/subscriptions')}>
            <Text style={s.backButtonText}>Back to Subscriptions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Payment</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Plan Summary */}
        <View style={s.planSummary}>
          <View style={s.planSummaryHeader}>
            <Text style={s.planSummaryTitle}>Plan Summary</Text>
          </View>
          <View style={s.planSummaryContent}>
            <View style={s.planSummaryRow}>
              <Text style={s.planSummaryLabel}>Plan</Text>
              <Text style={s.planSummaryValue}>Growth Plan</Text>
            </View>
            <View style={s.planSummaryRow}>
              <Text style={s.planSummaryLabel}>Duration</Text>
              <Text style={s.planSummaryValue}>{duration} days</Text>
            </View>
            <View style={s.planSummaryRow}>
              <Text style={s.planSummaryLabel}>Amount</Text>
              <Text style={s.planSummaryValue}>₹{amount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Country Selection */}
        <View style={s.countrySection}>
          <Text style={s.sectionTitle}>Select Country</Text>
          <Text style={s.sectionDescription}>Choose your country for payment options</Text>
          <View style={s.countryDropdown}>
            <TouchableOpacity
              style={[s.countryOption, country === 'India' && s.countryOptionSelected]}
              onPress={() => handleCountryChange('India')}
            >
              <Text style={[s.countryOptionText, country === 'India' && s.countryOptionTextSelected]}>India</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.countryOption, country === 'Nepal' && s.countryOptionSelected]}
              onPress={() => handleCountryChange('Nepal')}
            >
              <Text style={[s.countryOptionText, country === 'Nepal' && s.countryOptionTextSelected]}>Nepal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.countryOption, country === 'Others' && s.countryOptionSelected]}
              onPress={() => handleCountryChange('Others')}
            >
              <Text style={[s.countryOptionText, country === 'Others' && s.countryOptionTextSelected]}>Others</Text>
            </TouchableOpacity>
          </View>
        </View>

        {country === null ? (
          /* No country selected - show message */
          <View style={s.paymentSection}>
            <View style={s.emptyState}>
              <Ionicons name="globe-outline" size={48} color="#9CA3AF" />
              <Text style={s.emptyStateTitle}>Select Your Country</Text>
              <Text style={s.emptyStateText}>Choose a country above to see available payment options</Text>
            </View>
          </View>
        ) : country === 'India' ? (
          /* India - Razorpay Payment */
          <View style={s.paymentSection}>
            <Text style={s.sectionTitle}>Pay with Razorpay</Text>
            <Text style={s.sectionDescription}>Secure payment powered by Razorpay</Text>
            
            <TouchableOpacity
              style={[s.payButton, loading && s.payButtonDisabled]}
              onPress={handleRazorpayPayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="card" size={20} color="#FFF" />
                  <Text style={s.payButtonText}>Pay ₹{amount.toLocaleString('en-IN')}</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={s.securityInfo}>
              <Ionicons name="shield-checkmark" size={16} color="#9CA3AF" />
              <Text style={s.securityText}>100% Secure Payment</Text>
            </View>
          </View>
        ) : country === 'Nepal' ? (
          /* Nepal - Manual Payment Options */
          <View style={s.paymentSection}>
            <Text style={s.sectionTitle}>Payment Options</Text>
            <Text style={s.sectionDescription}>Choose your preferred payment method</Text>

            {/* eSewa QR */}
            <TouchableOpacity
              style={[s.paymentOption, selectedPaymentMethod === 'ESEWA' && s.paymentOptionSelected]}
              onPress={() => setSelectedPaymentMethod('ESEWA')}
            >
              <View style={s.paymentOptionHeader}>
                <Text style={s.paymentOptionTitle}>eSewa</Text>
                {selectedPaymentMethod === 'ESEWA' && <Ionicons name="checkmark-circle" size={22} color="#10B981" />}
              </View>
              <View style={s.qrContainer}>
                <Image
                  source={require('../../../assets/images/esewa-qr.jpeg')}
                  style={s.qrImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={s.qrInstructions}>Tap to select · Scan to pay via eSewa</Text>
            </TouchableOpacity>

            {/* Khalti QR */}
            <TouchableOpacity
              style={[s.paymentOption, selectedPaymentMethod === 'KHALTI' && s.paymentOptionSelected]}
              onPress={() => setSelectedPaymentMethod('KHALTI')}
            >
              <View style={s.paymentOptionHeader}>
                <Text style={s.paymentOptionTitle}>Khalti</Text>
                {selectedPaymentMethod === 'KHALTI' && <Ionicons name="checkmark-circle" size={22} color="#10B981" />}
              </View>
              <View style={s.qrContainer}>
                <Image
                  source={require('../../../assets/images/khalti-qr.jpeg')}
                  style={s.qrImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={s.qrInstructions}>Tap to select · Scan to pay via Khalti</Text>
            </TouchableOpacity>

            {/* Upload Screenshot */}
            <View style={s.uploadSection}>
              <Text style={s.uploadTitle}>Upload Payment Screenshot</Text>
              {uploadedImage ? (
                <View style={s.imagePreviewContainer}>
                  <Image source={{ uri: uploadedImage }} style={s.imagePreview} />
                  <TouchableOpacity
                    style={s.removeImageButton}
                    onPress={() => setUploadedImage(null)}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={s.uploadButton} onPress={handleImageUpload}>
                  <Ionicons name="cloud-upload-outline" size={32} color="#f7b638" />
                  <Text style={s.uploadButtonText}>Tap to upload screenshot</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[s.payButton, (loading || !uploadedImage || !selectedPaymentMethod) && s.payButtonDisabled]}
              onPress={handleNepalPaymentSubmit}
              disabled={loading || !uploadedImage || !selectedPaymentMethod}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#FFF" />
                  <Text style={s.payButtonText}>Submit for Verification</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* Others - Contact Support */
          <View style={s.paymentSection}>
            <Text style={s.sectionTitle}>Contact Support</Text>
            <Text style={s.sectionDescription}>We&apos;re working on bringing payments to your region. Please contact our support team for assistance.</Text>
            <TouchableOpacity style={s.payButton}>
              <Ionicons name="mail" size={20} color="#FFF" />
              <Text style={s.payButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F3' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, backgroundColor: '#F8F6F3', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#1a1a1a', textAlign: 'center' },
  headerSpacer: { width: 40 },
  scroll: { flex: 1 },
  countrySection: {
    backgroundColor: '#FFF', margin: 16, marginTop: 0, borderRadius: 16,
    padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  countryDropdown: {
    flexDirection: 'row', gap: 8, marginTop: 12,
  },
  countryOption: {
    flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12,
    borderRadius: 8, alignItems: 'center', borderWidth: 2, borderColor: 'transparent',
  },
  countryOptionSelected: {
    backgroundColor: '#f7b638', borderColor: '#f7b638',
  },
  countryOptionText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  countryOptionTextSelected: { color: '#1a1a1a' },
  emptyState: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 12,
  },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  emptyStateText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  planSummary: {
    backgroundColor: '#FFF', margin: 16, borderRadius: 16,
    padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  planSummaryHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  planSummaryTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  countryBadge: {
    backgroundColor: '#f7b638', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12, fontSize: 12, fontWeight: '600', color: '#1a1a1a',
  },
  planSummaryContent: { gap: 12 },
  planSummaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  planSummaryLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  planSummaryValue: { fontSize: 15, color: '#1a1a1a', fontWeight: '600' },
  paymentSection: { margin: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  sectionDescription: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  payButton: {
    backgroundColor: '#f7b638', borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  payButtonDisabled: { opacity: 0.6 },
  payButtonText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  securityInfo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 16,
  },
  securityText: { fontSize: 13, color: '#9CA3AF' },
  paymentOption: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  paymentOptionSelected: {
    borderWidth: 2, borderColor: '#10B981',
  },
  paymentOptionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', marginBottom: 12,
  },
  paymentOptionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  qrContainer: {
    width: 220, height: 220, backgroundColor: '#FFF', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', padding: 10,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  qrImage: {
    width: 200, height: 200,
  },
  qrInstructions: {
    fontSize: 13, color: '#6B7280', marginTop: 8, textAlign: 'center',
  },
  uploadSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16 },
  uploadTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  uploadButton: {
    borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed',
    borderRadius: 12, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  uploadButtonText: { fontSize: 14, color: '#6B7280' },
  imagePreviewContainer: { position: 'relative', alignItems: 'center' },
  imagePreview: { width: '100%', height: 200, borderRadius: 12 },
  removeImageButton: {
    position: 'absolute', top: -8, right: -8, backgroundColor: '#FFF',
    borderRadius: 12, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  centerContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16,
  },
  successTitle: { fontSize: 24, fontWeight: '700', color: '#10B981' },
  successText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  errorTitle: { fontSize: 24, fontWeight: '700', color: '#EF4444' },
  errorText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  pendingTitle: { fontSize: 24, fontWeight: '700', color: '#F59E0B' },
  pendingText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  retryButton: {
    backgroundColor: '#f7b638', paddingHorizontal: 32, paddingVertical: 12,
    borderRadius: 12, marginTop: 8,
  },
  retryButtonText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  backButtonText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
});
