import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessInsight } from '../services/unifiedDashboardService';
import { colors } from '../../../../shared/theme/colors';

interface BusinessInsightsProps {
  insights: BusinessInsight[];
  loading?: boolean;
}

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ insights, loading = false }) => {
  // Group insights by category
  const groupedInsights = useMemo(() => {
    if (!insights.length) return {};
    
    return insights.reduce((acc, insight) => {
      if (!acc[insight.category]) {
        acc[insight.category] = [];
      }
      acc[insight.category].push(insight);
      return acc;
    }, {} as Record<string, BusinessInsight[]>);
  }, [insights]);

  // Get category colors
  const getCategoryColor = (category: string) => {
    const colors = {
      OPERATIONS: '#3B82F6',
      REVENUE: '#10B981',
      CUSTOMERS: '#F59E0B',
      PERFORMANCE: '#8B5CF6',
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  // Get trend icon
  const getTrendIcon = (direction: 'UP' | 'DOWN' | 'SAME') => {
    switch (direction) {
      case 'UP':
        return 'trending-up';
      case 'DOWN':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  // Get trend color
  const getTrendColor = (direction: 'UP' | 'DOWN' | 'SAME') => {
    switch (direction) {
      case 'UP':
        return '#10B981';
      case 'DOWN':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Business Insights</Text>
        <View style={styles.loadingContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonValue} />
                <View style={styles.skeletonTrend} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!insights.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Business Insights</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="analytics-outline" size={48} color={colors.neutral[400]} />
          <Text style={styles.emptyTitle}>No Insights Available</Text>
          <Text style={styles.emptySubtitle}>
            Business insights will appear here once enough data is collected
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Business Insights</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={[styles.categoryTitle, { color: getCategoryColor(category) }]}>
              {category}
            </Text>
            {categoryInsights.map((insight, index) => (
              <Animated.View
                key={insight.id}
                style={[
                  styles.insightCard,
                  { borderLeftColor: getCategoryColor(category) }
                ]}
              >
                <View style={styles.insightHeader}>
                  <View style={styles.insightIconContainer}>
                    <Ionicons
                      name={insight.icon as any}
                      size={20}
                      color={getCategoryColor(category)}
                    />
                  </View>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                </View>
                
                <Text style={styles.insightDescription}>{insight.description}</Text>
                
                <View style={styles.insightValueContainer}>
                  <Text style={styles.insightValue}>
                    {insight.value}
                    {insight.unit && <Text style={styles.insightUnit}> {insight.unit}</Text>}
                  </Text>
                  
                  {insight.trend && (
                    <View style={styles.trendContainer}>
                      <Ionicons
                        name={getTrendIcon(insight.trendDirection)}
                        size={16}
                        color={getTrendColor(insight.trendDirection)}
                      />
                      <Text style={[styles.trendText, { color: getTrendColor(insight.trendDirection) }]}>
                        {insight.trend}
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.insightTimestamp}>
                  {new Date(insight.generatedAt).toLocaleDateString()}
                </Text>
              </Animated.View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  scrollContainer: {
    paddingRight: 16,
  },
  categoryContainer: {
    marginRight: 16,
    minWidth: 200,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  insightDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  insightValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  insightUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  insightTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonCard: {
    width: 200,
    height: 140,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  skeletonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    width: '80%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonValue: {
    width: '60%',
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonTrend: {
    width: '40%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default React.memo(BusinessInsights);
