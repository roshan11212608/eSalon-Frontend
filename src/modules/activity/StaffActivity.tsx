import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/activity.styles';

export default function StaffActivity() {
  const handleActivityPress = (activityType: string) => {
    if (activityType === 'Activity List') {
      router.push('/(staff-tabs)/activity-list' as any);
    } else if (activityType === 'Payments') {
      router.push('/(staff-tabs)/payments' as any);
    } else {
      Alert.alert(
        'Activity Navigation',
        `Navigate to ${activityType}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Activity', onPress: () => console.log(`Navigate to ${activityType}`) }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Activity</Text>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* Activity Card */}
        <View style={styles.card}>
          {/* Menu Section */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleActivityPress('Activity List')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="list" size={24} color="#780115" />
                </View>
                <Text style={styles.menuText}>Activity List</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleActivityPress('Payments')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="card" size={24} color="#780115" />
                </View>
                <Text style={styles.menuText}>Payments</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
