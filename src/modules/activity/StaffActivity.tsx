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
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Act<Text style={styles.titleAccent}>ivity</Text></Text>
        </View>

        {/* Activity Card */}
        <View style={styles.mainContent}>
          {/* Menu Section */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleActivityPress('Activity List')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="list" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Activity List</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleActivityPress('Payments')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="card" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Payments</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
