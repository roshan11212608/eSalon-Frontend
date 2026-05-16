import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface RevenueInsight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
}

interface RevenueInsightsProps {
  insights: RevenueInsight[];
}

export default function RevenueInsights({ insights }: RevenueInsightsProps) {
  const { colors } = useTheme();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'positive':
        return 'trending-up';
      case 'negative':
        return 'trending-down';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'positive':
        return '#10B981';
      case 'negative':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      default:
        return '#6366F1';
    }
  };

  const getBackgroundColorForType = (type: string) => {
    switch (type) {
      case 'positive':
        return '#10B98115';
      case 'negative':
        return '#EF444415';
      case 'warning':
        return '#F59E0B15';
      default:
        return '#6366F115';
    }
  };

  if (insights.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No insights available for this period
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {insights.map((insight) => (
        <View
          key={insight.id}
          style={[
            styles.insightCard,
            {
              backgroundColor: getBackgroundColorForType(insight.type),
              borderColor: getColorForType(insight.type),
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={getIconForType(insight.type) as any}
              size={24}
              color={getColorForType(insight.type)}
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{insight.title}</Text>
          <Text style={[styles.description, { color: colors.text }]}>{insight.description}</Text>
          {insight.metric && (
            <View style={styles.metricContainer}>
              <Ionicons
                name={insight.trend === 'up' ? 'arrow-up' : insight.trend === 'down' ? 'arrow-down' : 'remove'}
                size={16}
                color={getColorForType(insight.type)}
              />
              <Text style={[styles.metric, { color: getColorForType(insight.type) }]}>
                {insight.metric}
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

export function generateRevenueInsights(data: {
  revenueData?: any;
  subscriptionData?: any;
  paymentData?: any;
  salonData?: any;
}): RevenueInsight[] {
  const insights: RevenueInsight[] = [];

  // Revenue growth insights
  if (data.revenueData?.comparison?.growthPercentage) {
    const growth = data.revenueData.comparison.growthPercentage;
    if (growth > 15) {
      insights.push({
        id: 'revenue-growth-positive',
        type: 'positive',
        title: 'Strong Revenue Growth',
        description: 'Revenue has grown significantly compared to the previous period',
        metric: `+${growth.toFixed(1)}%`,
        trend: 'up',
      });
    } else if (growth < 0) {
      insights.push({
        id: 'revenue-growth-negative',
        type: 'negative',
        title: 'Revenue Decline',
        description: 'Revenue has decreased compared to the previous period',
        metric: `${growth.toFixed(1)}%`,
        trend: 'down',
      });
    }
  }

  // Subscription insights
  if (data.subscriptionData?.summary) {
    const { newSubscriptions, expiredSubscriptions } = data.subscriptionData.summary;
    if (newSubscriptions > expiredSubscriptions) {
      insights.push({
        id: 'subscription-growth',
        type: 'positive',
        title: 'Subscription Growth',
        description: 'More new subscriptions than expirations this period',
        metric: `+${newSubscriptions - expiredSubscriptions}`,
        trend: 'up',
      });
    }
  }

  // Payment success rate insights
  if (data.paymentData?.summary?.successRate) {
    const successRate = data.paymentData.summary.successRate;
    if (successRate < 90) {
      insights.push({
        id: 'payment-success-warning',
        type: 'warning',
        title: 'Payment Success Rate Declining',
        description: 'Payment success rate is below optimal levels',
        metric: `${successRate.toFixed(1)}%`,
        trend: 'down',
      });
    } else if (successRate > 95) {
      insights.push({
        id: 'payment-success-good',
        type: 'positive',
        title: 'Excellent Payment Success',
        description: 'Payment success rate is at optimal levels',
        metric: `${successRate.toFixed(1)}%`,
        trend: 'up',
      });
    }
  }

  // Salon insights
  if (data.salonData?.summary) {
    const { newSalons } = data.salonData.summary;
    if (newSalons > 5) {
      insights.push({
        id: 'new-salons',
        type: 'positive',
        title: 'New Salon Onboarding',
        description: `${newSalons} new salons joined this period`,
        metric: `+${newSalons}`,
        trend: 'up',
      });
    }
  }

  return insights.slice(0, 6); // Limit to 6 insights
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  insightCard: {
    width: 200,
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metric: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.6,
  },
});
