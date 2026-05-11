import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { RevenueChartsProps, PieChartData, LineChartData } from '../types/dashboard.types';
import { CHART_CONFIG, CURRENCY_CONFIG } from '../config/dashboardConfig';
import { styles as dashboardStyles } from '../styles/ownerDashboard.styles';

const AnimatedView = Animated.createAnimatedComponent(View);

function parseAmount(amount: string): number {
  if (!amount) return 0;
  const pattern = new RegExp(`[${CURRENCY_CONFIG.SYMBOLS_TO_STRIP}]`, 'g');
  return parseFloat(amount.replace(pattern, ''));
}

const RevenueCharts: React.FC<RevenueChartsProps> = ({ financialData }) => {
  // Memoize pie chart data
  const pieChartData = useMemo<PieChartData[]>(() => {
    if (!financialData?.financialBreakdown?.length) return [];
    return financialData.financialBreakdown.map((item) => ({
      name: item.category,
      population: parseAmount(item.amount),
      color: item.color,
      legendFontColor: CHART_CONFIG.colors.legendFontColor,
      legendFontSize: 13,
    }));
  }, [financialData?.financialBreakdown]);

  // Memoize monthly trend data
  const monthlyTrendData = useMemo<LineChartData>(() => {
    if (!financialData?.monthlyTrends?.length) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: financialData.monthlyTrends.map((t) => t.month.split(' ')[0]),
      datasets: [
        {
          data: financialData.monthlyTrends.map((t) => parseAmount(t.revenue)),
          color: CHART_CONFIG.colors.monthly.line,
          strokeWidth: 4,
        },
      ],
    };
  }, [financialData?.monthlyTrends]);

  // Memoize yearly trend data
  const yearlyTrendData = useMemo<LineChartData>(() => {
    if (!financialData?.yearlyTrends?.length) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: financialData.yearlyTrends.map((t) => t.year),
      datasets: [
        {
          data: financialData.yearlyTrends.map((t) => parseAmount(t.revenue)),
          color: CHART_CONFIG.colors.yearly.line,
          strokeWidth: 4,
        },
      ],
    };
  }, [financialData?.yearlyTrends]);

  if (!financialData) {
    return null;
  }

  return (
    <>
      {/* Financial Breakdown Pie Chart */}
      {pieChartData.length > 0 && (
        <AnimatedView 
          entering={FadeIn.duration(500).delay(500)} 
          style={dashboardStyles.section}
          accessibilityLabel="Financial breakdown pie chart"
          accessibilityRole="image"
        >
          <Text style={dashboardStyles.sectionTitle}>Financial Breakdown</Text>
          <View style={dashboardStyles.chartWrapper}>
            <PieChart
              data={pieChartData}
              width={CHART_CONFIG.width}
              height={CHART_CONFIG.height}
              chartConfig={{
                backgroundColor: CHART_CONFIG.colors.background,
                backgroundGradientFrom: CHART_CONFIG.colors.background,
                backgroundGradientTo: CHART_CONFIG.colors.background,
                decimalPlaces: CHART_CONFIG.props.decimalPlaces,
                color: CHART_CONFIG.colors.label,
                style: {
                  borderRadius: CHART_CONFIG.props.borderRadius,
                },
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft={CHART_CONFIG.padding}
              absolute
              hasLegend
              style={dashboardStyles.pieChart}
            />
          </View>
        </AnimatedView>
      )}

      {/* Monthly Revenue Trends Line Chart */}
      {monthlyTrendData.labels.length > 0 && (
        <AnimatedView 
          entering={FadeIn.duration(500).delay(600)} 
          style={dashboardStyles.section}
          accessibilityLabel="Monthly revenue trends line chart"
          accessibilityRole="image"
        >
          <Text style={dashboardStyles.sectionTitle}>Monthly Trends</Text>
          <View style={dashboardStyles.chartWrapper}>
            <LineChart
              data={monthlyTrendData}
              width={CHART_CONFIG.width}
              height={CHART_CONFIG.height}
              chartConfig={{
                backgroundColor: CHART_CONFIG.colors.background,
                backgroundGradientFrom: CHART_CONFIG.colors.background,
                backgroundGradientTo: CHART_CONFIG.colors.background,
                decimalPlaces: CHART_CONFIG.props.decimalPlaces,
                color: CHART_CONFIG.colors.monthly.line,
                labelColor: CHART_CONFIG.colors.label,
                style: {
                  borderRadius: CHART_CONFIG.props.borderRadius,
                },
                propsForDots: {
                  r: CHART_CONFIG.props.dotRadius,
                  strokeWidth: CHART_CONFIG.props.dotStrokeWidth,
                  stroke: CHART_CONFIG.colors.monthly.dot,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: CHART_CONFIG.props.backgroundLineStroke,
                },
              }}
              bezier
              style={dashboardStyles.lineChart}
            />
          </View>
        </AnimatedView>
      )}

      {/* Yearly Revenue Trends Line Chart */}
      {yearlyTrendData.labels.length > 0 && (
        <AnimatedView 
          entering={FadeIn.duration(500).delay(700)} 
          style={dashboardStyles.section}
          accessibilityLabel="Yearly revenue trends line chart"
          accessibilityRole="image"
        >
          <Text style={dashboardStyles.sectionTitle}>Yearly Trends</Text>
          <View style={dashboardStyles.chartWrapper}>
            <LineChart
              data={yearlyTrendData}
              width={CHART_CONFIG.width}
              height={CHART_CONFIG.height}
              chartConfig={{
                backgroundColor: CHART_CONFIG.colors.background,
                backgroundGradientFrom: CHART_CONFIG.colors.background,
                backgroundGradientTo: CHART_CONFIG.colors.background,
                decimalPlaces: CHART_CONFIG.props.decimalPlaces,
                color: CHART_CONFIG.colors.yearly.line,
                labelColor: CHART_CONFIG.colors.label,
                style: {
                  borderRadius: CHART_CONFIG.props.borderRadius,
                },
                propsForDots: {
                  r: CHART_CONFIG.props.dotRadius,
                  strokeWidth: CHART_CONFIG.props.dotStrokeWidth,
                  stroke: CHART_CONFIG.colors.yearly.dot,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: CHART_CONFIG.props.backgroundLineStroke,
                },
              }}
              bezier
              style={dashboardStyles.lineChart}
            />
          </View>
        </AnimatedView>
      )}
    </>
  );
};

export default React.memo(RevenueCharts);
