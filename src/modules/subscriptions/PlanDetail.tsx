import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { subscriptionsStyles } from './styles/subscriptions.styles';
import { useSubscriptions } from './hooks/useSubscriptions';
import { formatCurrency } from './mappers/subscriptionMapper';

export default function PlanDetail() {
  const { id } = useLocalSearchParams();
  const { plans, currentSubscription } = useSubscriptions();
  const [selectedGateway, setSelectedGateway] = useState<'paytm' | 'esewa' | null>(null);

  const plan = plans.find(p => p.id === id);

  if (!plan) {
    return (
      <View style={subscriptionsStyles.mainContainer}>
        <View style={subscriptionsStyles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={subscriptionsStyles.errorText}>Plan not found</Text>
          <TouchableOpacity 
            style={subscriptionsStyles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={subscriptionsStyles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handlePurchase = () => {
    if (!selectedGateway) {
      console.log('Please select a payment gateway');
      return;
    }
    console.log('Purchase plan:', plan.id, 'via', selectedGateway);
    // TODO: Implement payment flow with selected gateway
  };

  return (
    <View style={subscriptionsStyles.mainContainer}>
      {/* Fixed Header */}
      <View style={subscriptionsStyles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={subscriptionsStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={subscriptionsStyles.title}>Plan Details</Text>
        <View style={subscriptionsStyles.backButton} />
      </View>

      <ScrollView 
        style={subscriptionsStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={subscriptionsStyles.scrollViewContent}
      >
        {/* Plan Header */}
        <View style={subscriptionsStyles.detailHeader}>
          <View style={subscriptionsStyles.detailIcon}>
            <Ionicons name="ribbon" size={48} color="#f7b638" />
          </View>
          <Text style={subscriptionsStyles.detailPlanName}>{plan.name}</Text>
          <View style={subscriptionsStyles.detailDurationBadge}>
            <Text style={subscriptionsStyles.detailDurationText}>{plan.duration}</Text>
          </View>
        </View>

        {/* Price Section */}
        <View style={subscriptionsStyles.detailPriceCard}>
          <Text style={subscriptionsStyles.detailPriceLabel}>Total Price</Text>
          <Text style={subscriptionsStyles.detailPrice}>{formatCurrency(plan.price)}</Text>
          <Text style={subscriptionsStyles.detailDescription}>{plan.description}</Text>
        </View>

        {/* Features */}
        <View style={subscriptionsStyles.detailSection}>
          <Text style={subscriptionsStyles.detailSectionTitle}>What&apos;s Included</Text>
          <View style={subscriptionsStyles.detailFeatures}>
            <View style={subscriptionsStyles.detailFeatureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={subscriptionsStyles.detailFeatureText}>Full access to all features</Text>
            </View>
            <View style={subscriptionsStyles.detailFeatureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={subscriptionsStyles.detailFeatureText}>24/7 customer support</Text>
            </View>
            <View style={subscriptionsStyles.detailFeatureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={subscriptionsStyles.detailFeatureText}>Free updates & upgrades</Text>
            </View>
            <View style={subscriptionsStyles.detailFeatureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={subscriptionsStyles.detailFeatureText}>Multi-device access</Text>
            </View>
            <View style={subscriptionsStyles.detailFeatureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={subscriptionsStyles.detailFeatureText}>Data backup & security</Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={subscriptionsStyles.detailSection}>
          <Text style={subscriptionsStyles.detailSectionTitle}>Payment Information</Text>
          <View style={subscriptionsStyles.detailInfoItem}>
            <Ionicons name="card-outline" size={20} color="#64748B" />
            <Text style={subscriptionsStyles.detailInfoText}>One-time payment for {plan.duration}</Text>
          </View>
          <View style={subscriptionsStyles.detailInfoItem}>
            <Ionicons name="refresh-outline" size={20} color="#64748B" />
            <Text style={subscriptionsStyles.detailInfoText}>Auto-renewal can be disabled anytime</Text>
          </View>
        </View>

        {/* Payment Gateway Selection */}
        <View style={subscriptionsStyles.detailSection}>
          <Text style={subscriptionsStyles.detailSectionTitle}>Select Payment Method</Text>
          <TouchableOpacity
            style={[
              subscriptionsStyles.gatewayOption,
              selectedGateway === 'paytm' && subscriptionsStyles.gatewayOptionSelected
            ]}
            onPress={() => setSelectedGateway('paytm')}
          >
            <View style={subscriptionsStyles.gatewayLeft}>
              <View style={subscriptionsStyles.gatewayIcon}>
                <Text style={subscriptionsStyles.gatewayIconText}>P</Text>
              </View>
              <View style={subscriptionsStyles.gatewayInfo}>
                <Text style={subscriptionsStyles.gatewayName}>Paytm</Text>
                <Text style={subscriptionsStyles.gatewayDescription}>Pay using Paytm wallet or UPI</Text>
              </View>
            </View>
            <View style={[
              subscriptionsStyles.gatewayRadio,
              selectedGateway === 'paytm' && subscriptionsStyles.gatewayRadioSelected
            ]}>
              {selectedGateway === 'paytm' && <View style={subscriptionsStyles.gatewayRadioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              subscriptionsStyles.gatewayOption,
              selectedGateway === 'esewa' && subscriptionsStyles.gatewayOptionSelected
            ]}
            onPress={() => setSelectedGateway('esewa')}
          >
            <View style={subscriptionsStyles.gatewayLeft}>
              <View style={[subscriptionsStyles.gatewayIcon, subscriptionsStyles.gatewayIconEsewa]}>
                <Text style={subscriptionsStyles.gatewayIconText}>e</Text>
              </View>
              <View style={subscriptionsStyles.gatewayInfo}>
                <Text style={subscriptionsStyles.gatewayName}>eSewa</Text>
                <Text style={subscriptionsStyles.gatewayDescription}>Pay using eSewa wallet</Text>
              </View>
            </View>
            <View style={[
              subscriptionsStyles.gatewayRadio,
              selectedGateway === 'esewa' && subscriptionsStyles.gatewayRadioSelected
            ]}>
              {selectedGateway === 'esewa' && <View style={subscriptionsStyles.gatewayRadioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Purchase Button */}
        <TouchableOpacity 
          style={[
            subscriptionsStyles.purchaseButton,
            !selectedGateway && subscriptionsStyles.purchaseButtonDisabled
          ]} 
          onPress={handlePurchase}
          disabled={!selectedGateway}
        >
          <Text style={subscriptionsStyles.purchaseButtonText}>
            {currentSubscription ? 'Upgrade to ' + plan.name : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
