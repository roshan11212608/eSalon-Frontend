import React from 'react';
import { View, ScrollView } from 'react-native';
import ShopServices from '../../../src/modules/shopServices/ShopServices';
import { styles } from '../../../src/modules/shop/styles/shop.styles';

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <ShopServices />
      </ScrollView>
    </View>
  );
}
