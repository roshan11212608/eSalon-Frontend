import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { styles } from './styles/activity.styles';

export default function Activity() {
  const handleActivityPress = (activityType: string, fileName: string) => {
    if (fileName === 'NewAcitivity.tsx') {
      router.push('/(owner-tabs)/activity/new');
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
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>Manage your activities</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.activityButton}
          onPress={() => router.push('/(owner-tabs)/activity/new')}
        >
          <Text style={styles.buttonText}>New Activity</Text>
          <Text style={styles.buttonDescription}>Create a new activity</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.activityButton}
          onPress={() => handleActivityPress('Activity List', 'Activity.tsx')}
        >
          <Text style={styles.buttonText}>Activity List</Text>
          <Text style={styles.buttonDescription}>View all activities</Text>
        </TouchableOpacity>
        
        
        
        
        <TouchableOpacity 
          style={[styles.activityButton, styles.paymentButton]}
          onPress={() => handleActivityPress('Payments', 'Payments.tsx')}
        >
          <Text style={styles.buttonText}>Payments</Text>
          <Text style={styles.buttonDescription}>Payment activities</Text>
        </TouchableOpacity>
        
        
      </View>
    </ScrollView>
  );
}
