import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from '../styles/adminDashboard.styles';
import { SUMMARY_CARDS } from '../config/dashboardConfig';
import { SummaryCardsProps } from '../types/dashboard.types';

export default function SummaryCards({ stats, cardAnimations }: SummaryCardsProps) {
  useEffect(() => {
    // Staggered fade-in animation
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 300 + index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [cardAnimations]);

  const cards = [
    { key: 'salons', value: stats.totalSalons, color: SUMMARY_CARDS.colors.salons },
    { key: 'users', value: stats.totalUsers, color: SUMMARY_CARDS.colors.users },
    { key: 'subscriptions', value: stats.activeSubscriptions, color: SUMMARY_CARDS.colors.subscriptions },
    { key: 'revenue', value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`, color: SUMMARY_CARDS.colors.revenue },
  ];

  return (
    <View style={styles.activitySummarySection}>
      <Text style={styles.activitySummaryTitle}>Overview</Text>
      <View style={styles.summaryContainer}>
        {cards.map((card, index) => (
          <Animated.View
            key={card.key}
            style={[
              styles.summaryCard,
              { backgroundColor: card.color.background, opacity: cardAnimations[index] },
            ]}
          >
            <Text style={[styles.summaryCount, { color: card.color.text }]}>
              {card.value}
            </Text>
            <Text style={styles.summaryLabel}>
              {SUMMARY_CARDS.labels[card.key as keyof typeof SUMMARY_CARDS.labels]}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
