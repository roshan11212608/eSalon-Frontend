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
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Logo Section */}
        {/* <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="calendar" size={40} color="#f7b638" />
          </View>
          <Text style={styles.logoText}>Activity</Text>
          <Text style={styles.tagline}>Manage Your Activities</Text>
        </View> */}

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
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(owner-tabs)/activity/new')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="add-circle" size={24} color="#780115" />
                </View>
                <Text style={styles.menuText}>New Activity</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleActivityPress('Activity List', 'ActivityList.tsx')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="list" size={24} color="#780115" />
                </View>
                <Text style={styles.menuText}>Activity List</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleActivityPress('Payments', 'Payments.tsx')}>
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
