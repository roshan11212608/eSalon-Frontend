import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';

interface RevenueBarChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  height?: number;
}

const screenWidth = Dimensions.get('window').width - 48;

export default function RevenueBarChart({ data, height = 220 }: RevenueBarChartProps) {
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
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: (colors.text || '#1a1a1a').replace(')', ', 0.1)').replace('rgb', 'rgba'),
    },
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={screenWidth}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        showBarTops={false}
        flatColor={true}
        yAxisLabel=""
        yAxisSuffix=""
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
