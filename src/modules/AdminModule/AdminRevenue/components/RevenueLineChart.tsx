import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';

interface RevenueLineChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  };
  height?: number;
}

const screenWidth = Dimensions.get('window').width - 48;

export default function RevenueLineChart({ data, height = 220 }: RevenueLineChartProps) {
  const { colors } = useTheme();

  const chartConfig = {
    backgroundColor: colors.card || '#ffffff',
    backgroundGradientFrom: colors.card || '#ffffff',
    backgroundGradientTo: colors.card || '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => (colors.text || '#1a1a1a').replace(')', `, ${opacity})`).replace('rgb', 'rgba'),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#6366F1',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: (colors.text || '#1a1a1a').replace(')', ', 0.1)').replace('rgb', 'rgba'),
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});
