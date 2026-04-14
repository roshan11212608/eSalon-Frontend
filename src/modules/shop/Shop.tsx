import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles/shop.styles';
import ShopServices from '../shopServices/ShopServices';

export default function Shop() {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case 'shopServices':
        router.push('/(owner-tabs)/shopServices' as any);
        break;
      case 'employees':
        router.push('/(owner-tabs)/employees' as any);
        break;
      case 'customers':
        router.push('/(owner-tabs)/customers' as any);
        break;
      case 'expenses':
        router.push('/expenses' as any);
        break;
      default:
        console.log(`${screen} navigation not implemented yet`);
        break;
    }
  };
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Shop Management</Text>
        <Text style={styles.subtitle}>Manage your salon</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shop Information</Text>
          <Text style={styles.cardText}>Jimmy&apos;s Salon</Text>
          <Text style={styles.cardText}>123 Main Street</Text>
          <Text style={styles.cardText}>Downtown, City</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Business Hours</Text>
          <Text style={styles.cardText}>Mon-Fri: 9:00 AM - 8:00 PM</Text>
          <Text style={styles.cardText}>Sat: 9:00 AM - 6:00 PM</Text>
          <Text style={styles.cardText}>Sun: 10:00 AM - 4:00 PM</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigation('shopServices')}>
            <Text style={styles.actionButtonText}>Shop Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigation('employees')}>
            <Text style={styles.actionButtonText}>Employees</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigation('customers')}>
            <Text style={styles.actionButtonText}>Customers</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigation('expenses')}>
            <Text style={styles.actionButtonText}>Expenses </Text>
          </TouchableOpacity>
        </View>
        
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>Services Overview</Text>
          <ShopServices />
        </View> */}
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>References</Text>
          <Text style={styles.cardText}>John Doe - Regular Customer</Text>
          <Text style={styles.cardText}>Jane Smith - VIP Member</Text>
          <Text style={styles.cardText}>Mike Johnson - Weekly Barber</Text>
        </View>
      </View>
    </ScrollView>
  );
}
