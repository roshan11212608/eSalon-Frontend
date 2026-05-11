import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import AnimatedView, { FadeIn } from 'react-native-reanimated';
import { SummaryCardsProps } from '../types/dashboard.types';
import { SUMMARY_CARDS, ANIMATION_CONFIG } from '../config/dashboardConfig';
import { styles as dashboardStyles } from '../styles/ownerDashboard.styles';

const AnimatedRNView = AnimatedView.createAnimatedComponent(View);

const SummaryCards: React.FC<SummaryCardsProps> = ({ displayCounts, cardAnimations }) => {
  useEffect(() => {
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: ANIMATION_CONFIG.ACTIVE_OPACITY,
        duration: ANIMATION_CONFIG.CARDS.duration,
        delay: ANIMATION_CONFIG.CARDS.delayStart + index * ANIMATION_CONFIG.CARDS.delayIncrement,
        useNativeDriver: true,
      }).start();
    });
  }, [cardAnimations]);

  const cards = [
    { key: 'today', count: displayCounts.today, label: SUMMARY_CARDS.labels.today },
    { key: 'yesterday', count: displayCounts.yesterday, label: SUMMARY_CARDS.labels.yesterday },
    { key: 'week', count: displayCounts.week, label: SUMMARY_CARDS.labels.week },
    { key: 'month', count: displayCounts.month, label: SUMMARY_CARDS.labels.month },
  ];

  const cardColors = [
    SUMMARY_CARDS.colors.today,
    SUMMARY_CARDS.colors.yesterday,
    SUMMARY_CARDS.colors.week,
    SUMMARY_CARDS.colors.month,
  ];

  return (
    <AnimatedRNView entering={FadeIn.duration(500).delay(200)} style={dashboardStyles.activitySummarySection}>
      <Text style={dashboardStyles.activitySummaryTitle}>Activity Summary</Text>
      <View style={dashboardStyles.summaryContainer}>
        {cards.map((card, index) => (
          <Animated.View
            key={card.key}
            style={[
              dashboardStyles.summaryCard,
              {
                backgroundColor: cardColors[index].background,
                opacity: cardAnimations[index],
                transform: [
                  {
                    translateY: cardAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [ANIMATION_CONFIG.CARDS.initialTranslateY, 0],
                    }),
                  },
                ],
              },
            ]}
            accessibilityLabel={`${card.label}: ${card.count}`}
            accessibilityRole="text"
          >
            <Text style={[dashboardStyles.summaryCount, { color: cardColors[index].text }]}>
              {card.count}
            </Text>
            <Text style={dashboardStyles.summaryLabel}>{card.label}</Text>
          </Animated.View>
        ))}
      </View>
    </AnimatedRNView>
  );
};

export default React.memo(SummaryCards);
