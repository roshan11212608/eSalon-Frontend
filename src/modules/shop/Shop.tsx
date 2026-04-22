import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/shop.styles';

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
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shop<Text style={styles.titleAccent}> Management</Text></Text>
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Menu Section */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('shopServices')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="cut" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Shop Services</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('employees')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="people" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Employees</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('expenses')}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name="wallet" size={18} color="#f7b638" />
                </View>
                <Text style={styles.menuText}>Expenses</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
