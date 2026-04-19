import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Logo Section */}
        {/* <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="storefront" size={40} color="#f7b638" />
          </View>
          <Text style={styles.logoText}>Shop</Text>
          <Text style={styles.tagline}>Manage Your Salon</Text>
        </View> */}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shop Management</Text>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* Shop Card */}
        <View style={styles.card}>
          {/* Menu Section */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('shopServices')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="cut" size={24} color="#780115" />
                </View>
                <Text style={styles.menuText}>Shop Services</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('employees')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="people" size={24} color="#780115" />
                </View>
                <Text style={styles.menuText}>Employees</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('expenses')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="wallet" size={24} color="#780115" />
                </View>
                <Text style={styles.menuText}>Expenses</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
