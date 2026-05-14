import React, { useState, useEffect } from 'react';
import { 
  ActivityIndicator, Image, Modal, RefreshControl, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { OwnerPlan } from './types';
import { useSubscriptions } from './hooks/useSubscriptions';

const TIER_ICON: Record<string, string> = {
  basic: 'flash-outline',
  professional: 'rocket-outline',
  enterprise: 'diamond-outline',
};

function PlanCard({ plan, isCurrent, onSelect, isDisabled }: {
  plan: OwnerPlan;
  isCurrent: boolean;
  onSelect: () => void;
  isDisabled?: boolean;
}) {
  const price = plan.monthlyPrice ?? 0;
  const sym = plan.currency === 'INR' ? '₹' : plan.currency;
  const iconName = (TIER_ICON[plan.tier] ?? 'flash-outline') as any;

  return (
    <View style={[s.card, plan.isPopular && { borderColor: plan.color, borderWidth: 2 }, isDisabled && s.cardDisabled]}>
      {plan.isPopular && (
        <View style={[s.popularBadge, { backgroundColor: plan.color }]}>
          <Text style={s.popularText}>POPULAR</Text>
        </View>
      )}

      {/* Top stripe */}
      <View style={[s.topStripe, { backgroundColor: plan.color }]} />

      <View style={s.cardBody}>
        {/* Header row */}
        <View style={s.cardHeader}>
          <View style={[s.iconBadge, { backgroundColor: `${plan.color}18` }]}>
            <Ionicons name={iconName} size={22} color={plan.color} />
          </View>
          <View style={s.headerText}>
            <Text style={s.planName}>{plan.name}</Text>
            <Text style={s.tier}>{plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)}</Text>
          </View>
          {isCurrent && (
            <View style={[s.currentBadge, { backgroundColor: `${plan.color}18` }]}>
              <Ionicons name="checkmark-circle" size={14} color={plan.color} />
              <Text style={[s.currentText, { color: plan.color }]}>Active</Text>
            </View>
          )}
        </View>

        {/* Price */}
        <View style={s.priceRow}>
          <Text style={[s.price, { color: plan.color }]}>
            {sym}{price.toLocaleString('en-IN')}
          </Text>
          <Text style={s.pricePer}>/{plan.durationInDays ? `${plan.durationInDays} days` : '30 days'}</Text>
        </View>
        {plan.description ? <Text style={s.description}>{plan.description}</Text> : null}

        {/* Limits row */}
        <View style={s.limitsRow}>
          <View style={s.limitItem}>
            <Ionicons name="people-outline" size={14} color="#9CA3AF" />
            <Text style={s.limitText}>
              {plan.employeeLimit ? `Up to ${plan.employeeLimit} staff` : 'Unlimited staff'}
            </Text>
          </View>
          <View style={s.limitItem}>
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text style={s.limitText}>{plan.durationInDays || 30} days</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[s.cta, { backgroundColor: isCurrent ? `${plan.color}18` : isDisabled ? '#E5E7EB' : plan.color }]}
          activeOpacity={0.85}
          onPress={onSelect}
          disabled={isCurrent || isDisabled}
        >
          {isCurrent ? (
            <View style={s.ctaInner}>
              <Ionicons name="checkmark-circle" size={16} color={plan.color} />
              <Text style={[s.ctaText, { color: plan.color }]}>Current Plan</Text>
            </View>
          ) : isDisabled ? (
            <View style={s.ctaInner}>
              <Ionicons name="time-outline" size={16} color="#9CA3AF" />
              <Text style={[s.ctaText, { color: '#9CA3AF' }]}>Payment Pending</Text>
            </View>
          ) : (
            <Text style={s.ctaText}>Select Plan</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Subscriptions() {
  const { subscriptionStatus, plans, loading, isRefetching, error, refreshSubscriptions } = useSubscriptions();

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (subscriptionStatus?.expiryDate && subscriptionStatus.status === 'ACTIVE') {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const expiry = new Date(subscriptionStatus.expiryDate).getTime();
        const distance = expiry - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown({ days, hours, minutes, seconds });
        } else {
          setCountdown(null);
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [subscriptionStatus?.expiryDate, subscriptionStatus?.status]);

  const handleSelectPlan = (plan: OwnerPlan) => {
    router.push({
      pathname: '/(owner-tabs)/subscriptions/payment',
      params: {
        planId: plan.id.toString(),
        amount: (plan.monthlyPrice ?? 0).toString(),
        duration: (plan.durationInDays || 30).toString(),
        selectedPlan: plan.name,
      },
    });
  };

  const isPendingVerification = subscriptionStatus?.status === 'PENDING_VERIFICATION';
  const isRejected = subscriptionStatus?.status === 'REJECTED';
  const isActive = subscriptionStatus?.status === 'ACTIVE';
  const isExpired = subscriptionStatus?.status === 'EXPIRED';
  const noSubscription = subscriptionStatus?.status === 'NO_SUBSCRIPTION';

  const disablePlanSelection = isPendingVerification;

  // Find the actual selected plan from plans array
  const selectedPlan = plans.find(p => p.name === subscriptionStatus?.planName);

  if (loading) {
    return (
      <View style={s.container}>
        <View style={s.fixedHeader}>
          <Text style={s.title}>Subscrip<Text style={s.accent}>tions</Text></Text>
        </View>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#f7b638" />
          <Text style={s.loadingText}>Loading plans...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.container}>
        <View style={s.fixedHeader}>
          <Text style={s.title}>Subscrip<Text style={s.accent}>tions</Text></Text>
        </View>
        <View style={s.center}>
          <Ionicons name="cloud-offline-outline" size={52} color="#D1D5DB" />
          <Text style={s.errorText}>Could not load plans</Text>
          <Text style={s.errorSub}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => refreshSubscriptions()}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.fixedHeader}>
        <Text style={s.title}>Subscrip<Text style={s.accent}>tions</Text></Text>
      </View>

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching ?? false} onRefresh={() => refreshSubscriptions()}
            tintColor="#f7b638" colors={['#f7b638']} />
        }
      >
        {/* Pending payment status banner */}
        {isPendingVerification && (
          <View style={s.trackingBanner}>
            <View style={s.trackingHeader}>
              <View style={s.trackingHeaderLeft}>
                <Ionicons name="receipt" size={24} color="#f7b638" />
                <View>
                  <Text style={s.trackingTitle}>Payment Verification</Text>
                  <Text style={s.trackingSubtitle}>{subscriptionStatus?.planName || 'Selected Plan'}</Text>
                </View>
              </View>
              <View style={s.trackingStatusBadge}>
                <View style={[s.trackingStatusDot, s.trackingStatusDotAnimating]} />
                <Text style={s.trackingStatus}>Processing</Text>
              </View>
            </View>

            {/* Selected Plan Details */}
            <View style={s.selectedPlanCard}>
              <View style={s.selectedPlanHeader}>
                <Ionicons name="pricetag" size={16} color="#f7b638" />
                <Text style={s.selectedPlanLabel}>Selected Plan</Text>
              </View>
              <View style={s.selectedPlanContent}>
                <View style={s.selectedPlanGrid}>
                  <View style={s.selectedPlanGridColumn}>
                    <Text style={s.selectedPlanName}>{subscriptionStatus?.planName || 'Subscription Plan'}</Text>
                    {selectedPlan && selectedPlan.description && (
                      <Text style={s.selectedPlanDescription}>{selectedPlan.description}</Text>
                    )}
                  </View>

                  <View style={s.selectedPlanGridColumn}>
                    {subscriptionStatus?.amount && selectedPlan && (
                      <View style={s.selectedPlanPriceRow}>
                        <Text style={s.selectedPlanPrice}>
                          ₹{subscriptionStatus.amount.toLocaleString('en-IN')}
                        </Text>
                        <Text style={s.selectedPlanPriceDuration}>
                          /{selectedPlan.durationInDays || 30} days
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {selectedPlan && (
                  <View style={s.selectedPlanMetaRow}>
                    <View style={s.selectedPlanMetaItem}>
                      <Ionicons name="people" size={14} color="#6B7280" />
                      <Text style={s.selectedPlanMetaItemText}>
                        {selectedPlan.employeeLimit ? `Up to ${selectedPlan.employeeLimit} staff` : 'Unlimited staff'}
                      </Text>
                    </View>
                  </View>
                )}

                {selectedPlan && selectedPlan.features && selectedPlan.features.length > 0 && (
                  <View style={s.selectedPlanFeatures}>
                    <Text style={s.selectedPlanFeaturesLabel}>Features</Text>
                    {selectedPlan.features.map((feature, index) => (
                      <View key={index} style={s.selectedPlanFeatureItem}>
                        <Ionicons name="checkmark-circle" size={12} color="#f7b638" />
                        <Text style={s.selectedPlanFeatureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={s.selectedPlanStatus}>
                  <Text style={s.selectedPlanStatusText}>
                    {subscriptionStatus?.startDate 
                      ? `Started: ${new Date(subscriptionStatus.startDate).toLocaleDateString()}` 
                      : 'Payment pending approval'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Timeline */}
            <View style={s.timeline}>
              {/* Step 1: Payment Uploaded */}
              <View style={s.timelineStep}>
                <View style={s.timelineStepLeft}>
                  <View style={[s.timelineStepIcon, s.timelineStepCompleted]}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                  <View style={[s.timelineLine, s.timelineLineCompleted]} />
                </View>
                <View style={s.timelineStepRight}>
                  <Text style={s.timelineStepTitle}>Payment Uploaded</Text>
                  <Text style={s.timelineStepDesc}>
                    {subscriptionStatus?.paymentUploadedAt 
                      ? new Date(subscriptionStatus.paymentUploadedAt).toLocaleDateString() 
                      : 'Completed'}
                  </Text>
                  {subscriptionStatus?.paymentProofImage && (
                    <TouchableOpacity 
                      style={s.proofPreviewBtn}
                      onPress={() => setSelectedImage(subscriptionStatus.paymentProofImage)}
                      activeOpacity={0.8}
                    >
                      <View style={s.proofPreviewContainer}>
                        <Image
                          source={{ uri: subscriptionStatus.paymentProofImage }}
                          style={s.proofThumbnail}
                          resizeMode="cover"
                        />
                        <View style={s.proofOverlay}>
                          <Ionicons name="eye" size={14} color="#FFF" />
                          <Text style={s.proofOverlayText}>View Proof</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Step 2: Waiting for Approval */}
              <View style={s.timelineStep}>
                <View style={s.timelineStepLeft}>
                  <View style={[s.timelineStepIcon, s.timelineStepActive]}>
                    <View style={s.timelineStepIconInner} />
                  </View>
                  <View style={[s.timelineLine, s.timelineLinePending]} />
                </View>
                <View style={s.timelineStepRight}>
                  <Text style={s.timelineStepTitle}>Waiting for Approval</Text>
                  <Text style={s.timelineStepDesc}>Admin is reviewing your payment</Text>
                  <Text style={s.timelineStepTime}>Estimated: 1-2 business days</Text>
                </View>
              </View>

              {/* Step 3: Approved */}
              <View style={s.timelineStep}>
                <View style={s.timelineStepLeft}>
                  <View style={[s.timelineStepIcon, s.timelineStepPending]} />
                </View>
                <View style={s.timelineStepRight}>
                  <Text style={[s.timelineStepTitle, s.timelineStepTitlePending]}>Approved</Text>
                  <Text style={s.timelineStepDesc}>Your subscription will be activated</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Admin Note Section (shown for pending verification) */}
        {isPendingVerification && subscriptionStatus?.adminNote && (
          <View style={s.adminNoteSection}>
            <View style={s.adminNoteHeader}>
              <Ionicons name="chatbubble" size={16} color="#f7b638" />
              <Text style={s.adminNoteLabel}>Admin Note</Text>
            </View>
            <Text style={s.adminNoteText}>{subscriptionStatus.adminNote}</Text>
          </View>
        )}

        {/* Rejected payment banner */}
        {isRejected && (
          <View style={s.rejectedBanner}>
            <View style={s.rejectedBannerLeft}>
              <View style={s.rejectedIconContainer}>
                <Ionicons name="close-circle" size={22} color="#EF4444" />
              </View>
              <View style={s.rejectedBannerTextContainer}>
                <Text style={s.rejectedBannerLabel}>Payment Rejected</Text>
                <Text style={s.rejectedBannerPlan}>{subscriptionStatus?.planName || 'Selected Plan'}</Text>
                <Text style={s.rejectedBannerReason}>
                  {subscriptionStatus?.rejectionReason || 'Invalid payment proof'}
                </Text>
                {subscriptionStatus?.adminNote && (
                  <View style={s.rejectedAdminNoteSection}>
                    <View style={s.rejectedAdminNoteHeader}>
                      <Ionicons name="chatbubble" size={14} color="#DC2626" />
                      <Text style={s.rejectedAdminNoteLabel}>Admin Note</Text>
                    </View>
                    <Text style={s.rejectedAdminNoteText}>{subscriptionStatus.adminNote}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* No subscription state */}
        {noSubscription && (
          <View style={s.noSubscriptionBanner}>
            <View style={s.noSubscriptionLeft}>
              <View style={s.noSubscriptionIconContainer}>
                <Ionicons name="information-circle" size={22} color="#6B7280" />
              </View>
              <View style={s.noSubscriptionTextContainer}>
                <Text style={s.noSubscriptionLabel}>No Active Subscription</Text>
                <Text style={s.noSubscriptionText}>
                  Select a plan to get started with your salon
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Current plan banner */}
        {(isActive || isExpired) && subscriptionStatus?.planName && (
          <View style={[s.currentPlanBanner, isExpired && s.currentPlanBannerExpired]}>
            <View style={s.currentPlanHeader}>
              <View style={s.currentPlanHeaderLeft}>
                <View style={s.currentPlanIconContainer}>
                  <Ionicons name={isExpired ? 'alert-circle' : 'trophy'} size={24} color={isExpired ? '#EF4444' : '#f7b638'} />
                </View>
                <View>
                  <Text style={s.currentPlanLabel}>{isExpired ? 'Expired Plan' : 'Current Plan'}</Text>
                  <Text style={s.currentPlanName}>{subscriptionStatus.planName}</Text>
                </View>
              </View>
              <View style={[s.currentPlanStatusBadge, { backgroundColor: isExpired ? '#FEE2E2' : '#D1FAE5' }]}>
                <Text style={[s.currentPlanStatusText, { color: isExpired ? '#DC2626' : '#059669' }]}>
                  {isExpired ? 'Expired' : 'Active'}
                </Text>
              </View>
            </View>

            {isActive && countdown && (
              <View style={s.countdownContainer}>
                <Text style={s.countdownLabel}>Expires in</Text>
                <View style={s.countdownTimer}>
                  <View style={s.countdownItem}>
                    <Text style={s.countdownValue}>{countdown.days.toString().padStart(2, '0')}</Text>
                    <Text style={s.countdownUnit}>Days</Text>
                  </View>
                  <Text style={s.countdownSeparator}>:</Text>
                  <View style={s.countdownItem}>
                    <Text style={s.countdownValue}>{countdown.hours.toString().padStart(2, '0')}</Text>
                    <Text style={s.countdownUnit}>Hrs</Text>
                  </View>
                  <Text style={s.countdownSeparator}>:</Text>
                  <View style={s.countdownItem}>
                    <Text style={s.countdownValue}>{countdown.minutes.toString().padStart(2, '0')}</Text>
                    <Text style={s.countdownUnit}>Min</Text>
                  </View>
                  <Text style={s.countdownSeparator}>:</Text>
                  <View style={s.countdownItem}>
                    <Text style={s.countdownValue}>{countdown.seconds.toString().padStart(2, '0')}</Text>
                    <Text style={s.countdownUnit}>Sec</Text>
                  </View>
                </View>
                <Text style={s.countdownDate}>
                  Expires: {new Date(subscriptionStatus.expiryDate).toLocaleDateString()}
                </Text>
              </View>
            )}

            {isExpired && subscriptionStatus.expiryDate && (
              <View style={s.expiredInfo}>
                <Text style={s.expiredText}>
                  Expired on {new Date(subscriptionStatus.expiryDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Plans */}
        {plans.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="layers-outline" size={56} color="#D1D5DB" />
            <Text style={s.emptyText}>No plans available</Text>
            <Text style={s.emptySub}>Check back soon for subscription options.</Text>
          </View>
        ) : (
          <View style={s.plansList}>
            {plans.map((plan: OwnerPlan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={subscriptionStatus?.planName === plan.name && isActive}
                isDisabled={disablePlanSelection}
                onSelect={() => handleSelectPlan(plan)}
              />
            ))}
          </View>
        )}

        <View style={s.footer}>
          <Ionicons name="shield-checkmark" size={18} color="#9CA3AF" />
          <Text style={s.footerText}>Secure payment powered by Razorpay</Text>
        </View>
      </ScrollView>

      {/* Image preview modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={s.imageModalContainer}>
          <TouchableOpacity
            style={s.imageModalClose}
            onPress={() => setSelectedImage(null)}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle" size={32} color="#FFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={s.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F3' },
  fixedHeader: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#F8F6F3', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', letterSpacing: 1 },
  accent: { color: '#f7b638' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 40 },
  loadingText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  errorText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  errorSub: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  retryBtn: { marginTop: 8, backgroundColor: '#f7b638', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryText: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  banner: {
    backgroundColor: '#f7b638', marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  bannerLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  bannerIconContainer: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerTextContainer: { flex: 1 },
  bannerLabel: { fontSize: 11, fontWeight: '600', color: '#1a1a1a', opacity: 0.8, letterSpacing: 0.3 },
  bannerPlan: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginTop: 1 },
  bannerRight: { alignItems: 'flex-end' },
  bannerStatusBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  bannerStatusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  bannerAmount: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  bannerDuration: { fontSize: 12, fontWeight: '500', color: '#1a1a1a', opacity: 0.75 },
  bannerExpiry: { fontSize: 11, color: '#1a1a1a', opacity: 0.7, marginTop: 2 },
  bannerDays: { fontSize: 11, color: '#1a1a1a', opacity: 0.7, marginTop: 1 },
  pendingBanner: {
    backgroundColor: '#FFFBEB', marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#FCD34D',
  },
  pendingBannerLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  pendingIconContainer: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FEF3C7',
    alignItems: 'center', justifyContent: 'center',
  },
  pendingBannerTextContainer: { flex: 1 },
  pendingBannerLabel: { fontSize: 12, fontWeight: '700', color: '#D97706', letterSpacing: 0.3 },
  pendingBannerPlan: { fontSize: 15, fontWeight: '800', color: '#1a1a1a', marginTop: 2 },
  pendingBannerSub: { fontSize: 13, fontWeight: '500', color: '#6B7280', marginTop: 1 },
  pendingBannerTime: { fontSize: 11, fontWeight: '500', color: '#9CA3AF', marginTop: 3 },
  pendingBannerRight: { alignItems: 'flex-end' },
  pendingStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  pendingStatusDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF',
  },
  pendingStatus: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  trackingBanner: {
    backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB',
  },
  trackingHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  trackingHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trackingTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
  trackingSubtitle: { fontSize: 13, fontWeight: '500', color: '#6B7280', marginTop: 2 },
  trackingStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF7ED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: '#FED7AA',
  },
  trackingStatusDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#f7b638',
  },
  trackingStatusDotAnimating: {
    // Add animation if needed
  },
  trackingStatus: { fontSize: 12, fontWeight: '700', color: '#C2410C' },
  selectedPlanCard: {
    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: '#FCD34D',
  },
  selectedPlanHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12,
  },
  selectedPlanLabel: { fontSize: 11, fontWeight: '700', color: '#D97706', letterSpacing: 0.3 },
  selectedPlanContent: {},
  selectedPlanGrid: {
    flexDirection: 'row', gap: 12, marginBottom: 12,
  },
  selectedPlanGridColumn: { flex: 1 },
  selectedPlanGridLeft: { flex: 1 },
  selectedPlanGridRight: {
    backgroundColor: '#FFF', borderRadius: 8, padding: 12,
  },
  selectedPlanName: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginBottom: 2 },
  selectedPlanTier: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  selectedPlanPriceRow: {
    flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8,
  },
  selectedPlanPrice: { fontSize: 28, fontWeight: '900', color: '#1a1a1a' },
  selectedPlanPriceDuration: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  selectedPlanDescription: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 12 },
  selectedPlanMetaRow: {
    flexDirection: 'row', gap: 16, marginBottom: 12,
  },
  selectedPlanMetaItem: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  selectedPlanMetaItemText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  selectedPlanFeatures: {
    backgroundColor: '#FFF', borderRadius: 8, padding: 10,
    marginBottom: 12,
  },
  selectedPlanFeaturesLabel: {
    fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 0.3,
    marginBottom: 8,
  },
  selectedPlanFeatureItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: 4,
  },
  selectedPlanFeatureText: { fontSize: 12, fontWeight: '500', color: '#374151' },
  selectedPlanStatus: {
    backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: 10,
  },
  selectedPlanStatusText: { fontSize: 12, fontWeight: '500', color: '#6B7280', textAlign: 'center' },
  selectedPlanTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  selectedPlanAmountBadge: {
    backgroundColor: '#f7b638', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12,
  },
  selectedPlanAmountText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  selectedPlanDetails: {
    flexDirection: 'row', gap: 16, marginBottom: 8,
  },
  selectedPlanDetailItem: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  selectedPlanDetailText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  selectedPlanMeta: {},
  selectedPlanMetaText: { fontSize: 12, fontWeight: '500', color: '#6B7280' },
  adminNoteSection: {
    backgroundColor: '#F0F9FF', borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: '#BAE6FD',
  },
  adminNoteHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8,
  },
  adminNoteLabel: { fontSize: 11, fontWeight: '700', color: '#0284C7', letterSpacing: 0.3 },
  adminNoteText: { fontSize: 13, fontWeight: '500', color: '#334155', lineHeight: 18 },
  timeline: { gap: 0 },
  timelineStep: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  timelineStepLeft: { alignItems: 'center' },
  timelineStepIcon: {
    width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  timelineStepCompleted: { backgroundColor: '#f7b638' },
  timelineStepActive: { backgroundColor: '#FFF', borderWidth: 3, borderColor: '#f7b638' },
  timelineStepPending: { backgroundColor: '#F3F4F6' },
  timelineStepIconInner: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#f7b638',
  },
  timelineLine: { width: 2, flex: 1, marginTop: 4 },
  timelineLineCompleted: { backgroundColor: '#f7b638' },
  timelineLinePending: { backgroundColor: '#E5E7EB' },
  timelineStepRight: { flex: 1, paddingTop: 2 },
  timelineStepTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 2 },
  timelineStepTitlePending: { color: '#9CA3AF' },
  timelineStepDesc: { fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 4 },
  timelineStepTime: { fontSize: 11, fontWeight: '500', color: '#9CA3AF' },
  proofPreviewBtn: { marginTop: 8, alignSelf: 'flex-start' },
  proofPreviewContainer: {
    width: 120, height: 80, borderRadius: 12, overflow: 'hidden',
    backgroundColor: '#F3F4F6', position: 'relative',
  },
  proofThumbnail: { width: '100%', height: '100%' },
  proofOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  proofOverlayText: { fontSize: 11, fontWeight: '600', color: '#FFF', marginTop: 2 },
  rejectedBanner: {
    backgroundColor: '#FEF2F2', marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
  rejectedBannerLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  rejectedIconContainer: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center',
  },
  rejectedBannerTextContainer: { flex: 1 },
  rejectedBannerLabel: { fontSize: 12, fontWeight: '700', color: '#DC2626', letterSpacing: 0.3 },
  rejectedBannerPlan: { fontSize: 15, fontWeight: '800', color: '#1a1a1a', marginTop: 2 },
  rejectedBannerReason: { fontSize: 13, fontWeight: '500', color: '#6B7280', marginTop: 1 },
  rejectedAdminNoteSection: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12,
    marginTop: 10, borderWidth: 1, borderColor: '#FECACA',
    borderLeftWidth: 3, borderLeftColor: '#DC2626',
  },
  rejectedAdminNoteHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6,
  },
  rejectedAdminNoteLabel: { fontSize: 12, fontWeight: '700', color: '#DC2626', letterSpacing: 0.2 },
  rejectedAdminNoteText: { fontSize: 13, fontWeight: '500', color: '#374151', lineHeight: 18 },
  rejectedBannerRight: { alignItems: 'flex-end' },
  retryPaymentBtn: {
    backgroundColor: '#EF4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    alignSelf: 'flex-start', marginTop: 8,
  },
  retryPaymentBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  noSubscriptionBanner: {
    backgroundColor: '#F9FAFB', marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  noSubscriptionLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  noSubscriptionIconContainer: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  noSubscriptionTextContainer: { flex: 1 },
  noSubscriptionLabel: { fontSize: 12, fontWeight: '700', color: '#4B5563', letterSpacing: 0.3 },
  noSubscriptionText: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginTop: 1 },
  currentPlanBanner: {
    backgroundColor: '#f7b638', marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 16, padding: 20,
  },
  currentPlanBannerExpired: { backgroundColor: '#FEE2E2' },
  currentPlanHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  currentPlanHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  currentPlanIconContainer: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  currentPlanLabel: { fontSize: 11, fontWeight: '600', color: '#1a1a1a', opacity: 0.8, letterSpacing: 0.3 },
  currentPlanName: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginTop: 2 },
  currentPlanStatusBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  currentPlanStatusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  countdownContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 16,
  },
  countdownLabel: { fontSize: 11, fontWeight: '600', color: '#1a1a1a', opacity: 0.8, marginBottom: 12, textAlign: 'center' },
  countdownTimer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12,
  },
  countdownItem: {
    backgroundColor: '#FFF', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12,
    alignItems: 'center', minWidth: 60,
  },
  countdownValue: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', lineHeight: 28 },
  countdownUnit: { fontSize: 10, fontWeight: '600', color: '#6B7280', marginTop: 2 },
  countdownSeparator: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', opacity: 0.6 },
  countdownDate: { fontSize: 11, fontWeight: '500', color: '#1a1a1a', opacity: 0.7, textAlign: 'center' },
  expiredInfo: { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 16 },
  expiredText: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', textAlign: 'center' },
  toggleWrap: { paddingHorizontal: 16, paddingTop: 16 },
  toggle: {
    flexDirection: 'row', backgroundColor: '#F3F4F6',
    borderRadius: 30, padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 26, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  toggleBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  toggleTextActive: { color: '#1a1a1a' },
  saveBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  saveBadgeText: { fontSize: 9, fontWeight: '700', color: '#059669' },
  plansList: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  card: {
    backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  popularBadge: {
    position: 'absolute', top: -1, right: 20, zIndex: 10,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10,
  },
  popularText: { fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 0.8 },
  topStripe: { height: 4 },
  cardBody: { padding: 18 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconBadge: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  planName: { fontSize: 17, fontWeight: '800', color: '#111827' },
  tier: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 1 },
  currentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  currentText: { fontSize: 11, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 4 },
  price: { fontSize: 34, fontWeight: '900', letterSpacing: -0.5 },
  pricePer: { fontSize: 14, color: '#9CA3AF', fontWeight: '500', marginBottom: 6 },
  description: { fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 19 },
  limitsRow: { flexDirection: 'row', gap: 16, marginBottom: 14 },
  limitItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  limitText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  features: { gap: 7, marginBottom: 18 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  featureDot: { width: 6, height: 6, borderRadius: 3 },
  featureText: { fontSize: 13, color: '#374151', fontWeight: '500', flex: 1 },
  moreFeatures: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
  cta: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  ctaInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ctaText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 60, paddingHorizontal: 40 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  emptySub: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 24 },
  footerText: { fontSize: 13, color: '#9CA3AF' },
  imageModalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  imageModalClose: {
    position: 'absolute', top: 50, right: 20,
    zIndex: 1, padding: 8,
  },
  fullScreenImage: {
    width: '100%', height: '100%',
  },
});
