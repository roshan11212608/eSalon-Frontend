import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { subscriptionsStyles } from './styles/subscriptions.styles';
import { useSubscriptions } from './hooks/useSubscriptions';
import { formatCurrency } from './mappers/subscriptionMapper';

export default function SubscriptionPlan() {
  const { currentSubscription, plans } = useSubscriptions();

  const handlePurchasePlan = (planId: string) => {
    router.push(`/(owner-tabs)/subscriptions/planDetail/${planId}` as any);
  };

  return (
    <View style={subscriptionsStyles.mainContainer}>
      {/* Fixed Header */}
      <View style={subscriptionsStyles.fixedHeader}>
        <Text style={subscriptionsStyles.title}>Subscrip<Text style={subscriptionsStyles.titleAccent}>tions</Text></Text>
      </View>

      <ScrollView 
        style={subscriptionsStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={subscriptionsStyles.scrollViewContent}
      >
        {/* Current Subscription Banner */}
        {currentSubscription && (
          <View style={subscriptionsStyles.currentPlanBanner}>
            <View style={subscriptionsStyles.bannerLeft}>
              <Ionicons name="checkmark-circle" size={24} color="#1a1a1a" />
              <View style={subscriptionsStyles.bannerText}>
                <Text style={subscriptionsStyles.bannerTitle}>Current Plan</Text>
                <Text style={subscriptionsStyles.bannerPlan}>{currentSubscription.planName}</Text>
              </View>
            </View>
            <View style={subscriptionsStyles.bannerRight}>
              <Text style={subscriptionsStyles.bannerAmount}>{formatCurrency(currentSubscription.amount)}</Text>
              <Text style={subscriptionsStyles.bannerDuration}>{currentSubscription.duration}</Text>
            </View>
          </View>
        )}

        {/* Pricing Plans */}
        <View style={subscriptionsStyles.plansContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                subscriptionsStyles.planCard,
                index === 3 && subscriptionsStyles.featuredCard
              ]}
              onPress={() => handlePurchasePlan(plan.id)}
            >
              {index === 3 && (
                <View style={subscriptionsStyles.featuredBadge}>
                  <Text style={subscriptionsStyles.featuredBadgeText}>BEST VALUE</Text>
                </View>
              )}
              
              <View style={subscriptionsStyles.planHeader}>
                <Text style={subscriptionsStyles.planName}>{plan.name}</Text>
                <View style={subscriptionsStyles.planDurationBadge}>
                  <Text style={subscriptionsStyles.planDurationText}>{plan.duration}</Text>
                </View>
              </View>

              <View style={subscriptionsStyles.planPriceSection}>
                <Text style={subscriptionsStyles.planPrice}>{formatCurrency(plan.price)}</Text>
                <Text style={subscriptionsStyles.planDescription}>{plan.description}</Text>
              </View>

              <View style={subscriptionsStyles.planFeatures}>
                <View style={subscriptionsStyles.featureItem}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                  <Text style={subscriptionsStyles.featureText}>Full access to all features</Text>
                </View>
                <View style={subscriptionsStyles.featureItem}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                  <Text style={subscriptionsStyles.featureText}>24/7 customer support</Text>
                </View>
                <View style={subscriptionsStyles.featureItem}>
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                  <Text style={subscriptionsStyles.featureText}>Free updates & upgrades</Text>
                </View>
              </View>

              <TouchableOpacity style={[
                subscriptionsStyles.selectButton,
                index === 3 && subscriptionsStyles.featuredButton
              ]}>
                <Text style={[
                  subscriptionsStyles.selectButtonText,
                  index === 3 && subscriptionsStyles.featuredButtonText
                ]}>
                  {currentSubscription ? 'Upgrade' : 'Select Plan'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Info */}
        <View style={subscriptionsStyles.footer}>
          <Ionicons name="shield-checkmark" size={20} color="#64748B" />
          <Text style={subscriptionsStyles.footerText}>Secure payment powered by Razorpay</Text>
        </View>
      </ScrollView>
    </View>
  );
}
