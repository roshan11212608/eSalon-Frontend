import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';

interface PaymentPieChartProps {
  data: {
    name: string;
    population: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }[];
  size?: number;
}

const screenWidth = Dimensions.get('window').width - 48;

export default function PaymentPieChart({ data, size = 220 }: PaymentPieChartProps) {
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
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        width={screenWidth}
        height={size}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
