import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Import the actual AdminSalonDetail component
import AdminSalonDetailComponent from '../src/modules/AdminModule/AdminSalon/AdminSalonDetail';

export default function AdminSalonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Check if salon ID exists in URL parameters
  if (!id) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Salon ID not found</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#780115', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Render the actual AdminSalonDetail component (it handles its own data parsing using id parameter)
  return <AdminSalonDetailComponent />;
}
