import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { styles } from './styles/newActivity.styles';

export default function NewAcitivity() {
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    return `Walk-In-Customer ${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const [formData, setFormData] = useState({
    employee: '',
    customerInfo: getCurrentDateTime(),
    selectedServices: [] as string[],
    paidAmount: '',
    paymentMethod: 'cash',
  });

  const [dropdownStates, setDropdownStates] = useState({
    employee: false,
    service: false,
    paymentMethod: false,
  });

  // Update customer info time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setFormData(prev => ({
        ...prev,
        customerInfo: getCurrentDateTime()
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const employees = [
    { label: 'John Smith', value: 'john-smith' },
    { label: 'Sarah Johnson', value: 'sarah-johnson' },
    { label: 'Mike Chen', value: 'mike-chen' },
    { label: 'Emily Davis', value: 'emily-davis' },
  ];

  const services = [
    { label: 'Haircut - $25', value: 'haircut', price: 25 },
    { label: 'Hair Coloring - $85', value: 'hair-coloring', price: 85 },
    { label: 'Beard Trim - $15', value: 'beard-trim', price: 15 },
    { label: 'Hair Styling - $45', value: 'hair-styling', price: 45 },
    { label: 'Hair Treatment - $65', value: 'hair-treatment', price: 65 },
  ];

  const paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Online', value: 'online' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (dropdownName: string) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName as keyof typeof prev]
    }));
  };

  const selectDropdownOption = (field: string, value: string, dropdownName: string) => {
    handleInputChange(field, value);
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: false
    }));
  };

  const getSelectedServicePrice = () => {
    return formData.selectedServices.reduce((total, serviceValue) => {
      const service = services.find(s => s.value === serviceValue);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const getSelectedLabel = (options: any[], value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : 'Select...';
  };

  const getSelectedServicesLabel = () => {
    if (formData.selectedServices.length === 0) return 'Select services...';
    if (formData.selectedServices.length === 1) {
      const service = services.find(s => s.value === formData.selectedServices[0]);
      return service ? service.label : 'Select services...';
    }
    return `${formData.selectedServices.length} services selected`;
  };

  const toggleServiceSelection = (serviceValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceValue)
        ? prev.selectedServices.filter(s => s !== serviceValue)
        : [...prev.selectedServices, serviceValue]
    }));
  };

  const handleSubmit = () => {
    console.log('handleSubmit called');
    Alert.alert('Debug', 'Button was pressed!');
    console.log('Form data:', formData);
    
    if (!formData.employee || formData.selectedServices.length === 0 || !formData.paidAmount || !formData.customerInfo) {
      console.log('Validation failed');
      console.log('Employee:', formData.employee);
      console.log('Services:', formData.selectedServices);
      console.log('Paid Amount:', formData.paidAmount);
      console.log('Customer Info:', formData.customerInfo);
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    console.log('Validation passed');

    const newActivity = {
      id: Date.now().toString(),
      employee: formData.employee,
      customerInfo: formData.customerInfo,
      services: formData.selectedServices,
      paidAmount: parseFloat(formData.paidAmount),
      paymentMethod: formData.paymentMethod,
      servicePrice: getSelectedServicePrice(),
    };

    // Get employee name for display
    const selectedEmployee = employees.find(emp => emp.value === formData.employee);
    const employeeName = selectedEmployee ? selectedEmployee.label : 'Unknown';

    // Get selected services names for display
    const selectedServiceNames = formData.selectedServices.map(serviceValue => {
      const service = services.find(s => s.value === serviceValue);
      return service ? service.label : 'Unknown Service';
    }).join(', ');

    Alert.alert(
      'Activity Created Successfully! ',
      `Employee: ${employeeName}\nCustomer: ${formData.customerInfo}\nServices: ${selectedServiceNames}\nTotal: $${getSelectedServicePrice()}\nPaid: $${formData.paidAmount}\nPayment: ${formData.paymentMethod}`,
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );

    console.log('New Activity Created:', newActivity);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => router.back() }
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>New Activity</Text>
        <Text style={styles.subtitle}>Create a new activity record</Text>
      </View>

      <View style={styles.form}>
        {/* Employee Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Employee *</Text>
          <TouchableOpacity 
            style={styles.dropdownTrigger}
            onPress={() => toggleDropdown('employee')}
          >
            <Text style={styles.dropdownTriggerText}>
              {getSelectedLabel(employees, formData.employee)}
            </Text>
            <Text style={styles.dropdownArrow}>{'\u25bc'}</Text>
          </TouchableOpacity>
          {dropdownStates.employee && (
            <View style={styles.dropdownContainer}>
              {employees.map((employee) => (
                <TouchableOpacity
                  key={employee.value}
                  style={[
                    styles.dropdownItem,
                    formData.employee === employee.value && styles.dropdownItemSelected
                  ]}
                  onPress={() => selectDropdownOption('employee', employee.value, 'employee')}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    formData.employee === employee.value && styles.dropdownItemTextSelected
                  ]}>
                    {employee.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Customer Info */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Customer Info</Text>
          <TextInput
            style={styles.input}
            value={formData.customerInfo}
            editable={false}
            placeholder="Walk-In-Customer DD/MM/YYYY HH:MM AM"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Services Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Services *</Text>
          <TouchableOpacity 
            style={styles.dropdownTrigger}
            onPress={() => toggleDropdown('service')}
          >
            <Text style={styles.dropdownTriggerText}>
              {getSelectedServicesLabel()}
            </Text>
            <Text style={styles.dropdownArrow}>{'\u25bc'}</Text>
          </TouchableOpacity>
          {dropdownStates.service && (
            <View style={styles.dropdownContainer}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.value}
                  style={[
                    styles.dropdownItem,
                    formData.selectedServices.includes(service.value) && styles.dropdownItemSelected
                  ]}
                  onPress={() => toggleServiceSelection(service.value)}
                >
                  <View style={styles.multiSelectItem}>
                    <View style={[
                      styles.checkbox,
                      formData.selectedServices.includes(service.value) && styles.checkboxChecked
                    ]}>
                      {formData.selectedServices.includes(service.value) && (
                        <Text style={styles.checkmark}>{'\u2713'}</Text>
                      )}
                    </View>
                    <Text style={[
                      styles.dropdownItemText,
                      formData.selectedServices.includes(service.value) && styles.dropdownItemTextSelected
                    ]}>
                      {service.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Payment Summary */}
        <View style={styles.paymentSummary}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Price:</Text>
            <Text style={styles.summaryValue}>${getSelectedServicePrice()}</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Paid Amount *</Text>
            <TextInput
              style={styles.input}
              value={formData.paidAmount}
              onChangeText={(value) => handleInputChange('paidAmount', value)}
              placeholder="Enter paid amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
          
          {/* Payment Method */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger}
              onPress={() => toggleDropdown('paymentMethod')}
            >
              <Text style={styles.dropdownTriggerText}>
                {getSelectedLabel(paymentMethods, formData.paymentMethod)}
              </Text>
              <Text style={styles.dropdownArrow}>{'\u25bc'}</Text>
            </TouchableOpacity>
            {dropdownStates.paymentMethod && (
              <View style={styles.dropdownContainer}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.value}
                    style={[
                      styles.dropdownItem,
                      formData.paymentMethod === method.value && styles.dropdownItemSelected
                    ]}
                    onPress={() => selectDropdownOption('paymentMethod', method.value, 'paymentMethod')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      formData.paymentMethod === method.value && styles.dropdownItemTextSelected
                    ]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>Create Activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}