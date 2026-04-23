import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/activity.styles';

export default function Activity() {
  const handleActivityPress = (activityType: string, fileName: string) => {
    if (fileName === 'NewAcitivity.tsx') {
      router.push('/(owner-tabs)/activity/new');
    } else if (activityType === 'Activity List') {
      router.push('/(owner-tabs)/activity/list');
    } else {
      Alert.alert(
        'Activity Navigation',
        `Navigate to ${activityType} activity\nFile: ${fileName}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Activity', onPress: () => console.log(`Navigate to ${fileName}`) }
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

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Menu Section */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(owner-tabs)/activity/new')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="add-circle" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>New Activity</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleActivityPress('Activity List', 'ActivityList.tsx')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="list" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Activity List</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(owner-tabs)/payments')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="card" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Payments</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(owner-tabs)/reports')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="bar-chart" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Reports</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
