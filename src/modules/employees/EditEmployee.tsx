import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/employees.styles';
import { useEditEmployee } from './hooks/useEditEmployee';

const localStyles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666666',
    marginTop: 16,
    fontSize: 16,
  },
});

export default function EditEmployee() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { employee, formData, isLoading, isSaving, updateFormData, saveEmployee, showAlert, alertMessage, alertType } = useEditEmployee(id);

  const handleSave = async () => {
    const success = await saveEmployee();
    if (success) {
      setTimeout(() => router.back(), 1500); // Delay to show alert
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#f7b638" />
          <Text style={localStyles.loadingText}>Loading employee details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit <Text style={styles.titleAccent}>Employee</Text></Text>
        <TouchableOpacity style={[styles.actionButton, styles.headerCloseButton]} onPress={handleCancel}>
          <Ionicons name="close" size={18} color="#f7b638" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.mainContent}>
          <View style={styles.detailAvatarLarge}>
            <Ionicons name="person" size={40} style={styles.detailAvatarIconLarge} />
          </View>
          <Text style={styles.detailName}>{employee?.name || 'Unknown'}</Text>
          <Text style={styles.detailRole}>{employee?.role || 'Staff'}</Text>
          <View style={styles.detailBadge}>
            <Text style={styles.detailBadgeText}>User ID: {employee?.id || 'N/A'}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Edit Employee Information</Text>

            <View style={localStyles.inputContainer}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                placeholder="Enter name"
              />
            </View>

            <View style={localStyles.inputContainer}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                placeholder="Enter email"
                keyboardType="email-address"
              />
            </View>

            <View style={localStyles.inputContainer}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                placeholder="Enter phone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={localStyles.inputContainer}>
              <Text style={styles.formLabel}>Commission Percentage (%)</Text>
              <TextInput
                style={styles.formInput}
                value={formData.commissionPercentage.toString()}
                onChangeText={(text) => updateFormData('commissionPercentage', parseFloat(text) || 0)}
                placeholder="Enter commission percentage"
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={styles.formLabel}>Join Date</Text>
              <TextInput
                style={styles.formInput}
                value={formData.joinDate}
                onChangeText={(text) => updateFormData('joinDate', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alert Modal */}
      {showAlert && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
            marginHorizontal: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: alertType === 'success' ? '#10B981' : '#EF4444',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Ionicons 
                name={alertType === 'success' ? 'checkmark' : 'close'} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1F2937',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              {alertMessage}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#F3F4F6',
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 8,
              }}
              onPress={() => setShowAlert(false)}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#666666' }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
