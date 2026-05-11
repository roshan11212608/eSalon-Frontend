import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productsStyles } from './styles/products.styles';

export default function Products() {
  return (
    <View style={productsStyles.mainContainer}>
      <ScrollView 
        style={productsStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={productsStyles.scrollViewContent}
      >
        {/* Fixed Header */}
        <View style={productsStyles.fixedHeader}>
          <Text style={productsStyles.title}>Produc<Text style={productsStyles.titleAccent}>ts</Text></Text>
        </View>

        {/* Coming Soon Content */}
        <View style={productsStyles.comingSoonContainer}>
          <View style={productsStyles.comingSoonIcon}>
            <Ionicons name="cube-outline" size={80} color="#f7b638" />
          </View>
          <Text style={productsStyles.comingSoonTitle}>Coming Soon</Text>
          <Text style={productsStyles.comingSoonDescription}>
            Manage your salon products inventory, track stock levels, and suppliers all in one place.
          </Text>
          
          <View style={productsStyles.featuresList}>
            <View style={productsStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={productsStyles.featureText}>Product inventory management</Text>
            </View>
            <View style={productsStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={productsStyles.featureText}>Stock level tracking</Text>
            </View>
            <View style={productsStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={productsStyles.featureText}>Supplier management</Text>
            </View>
            <View style={productsStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={productsStyles.featureText}>Low stock alerts</Text>
            </View>
            <View style={productsStyles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={productsStyles.featureText}>Purchase history</Text>
            </View>
          </View>

          <View style={productsStyles.notifyCard}>
            <Ionicons name="notifications-outline" size={24} color="#f7b638" />
            <View style={productsStyles.notifyText}>
              <Text style={productsStyles.notifyTitle}>Stay Updated</Text>
              <Text style={productsStyles.notifyDescription}>
                We&apos;ll notify you when this feature is ready
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
