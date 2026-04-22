import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { styles } from './styles/newActivity.styles';
import EmployeeService from '@/src/services/employee/EmployeeService';
import ShopServicesService from '@/src/services/shopServicesService';
import { ActivityService } from '@/src/services/activityService';
import { useAuthStore } from '@/src/shared/hooks/useAuthStore';

export default function NewAcitivity() {
  const router = useRouter();
  const authState = useAuthStore();

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

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof typeof formData, boolean>>>({});

  const [dropdownStates, setDropdownStates] = useState({
    employee: false,
    service: false,
    paymentMethod: false,
  });

  const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  const [services, setServices] = useState<{ label: string; value: string; price: number }[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateField = (field: keyof typeof formData, value: any) => {
    let error = '';

    switch (field) {
      case 'employee':
        if (!value) error = 'Employee is required';
        break;
      case 'selectedServices':
        if (!value || value.length === 0) error = 'At least one service is required';
        break;
      case 'paidAmount':
        if (!value || value.trim() === '') error = 'Paid amount is required';
        else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) error = 'Invalid amount';
        break;
      case 'paymentMethod':
        if (!value) error = 'Payment method is required';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: keyof typeof formData, value: any) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

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


  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoadingEmployees(true);
      
      // Get shopId from logged-in user to filter employees by shop
      const shopId = authState.user?.shopId;
      
      console.log('Fetching employees for shopId:', shopId);
      console.log('Auth state user:', authState.user);
      
      if (!shopId) {
        console.error('No shopId found in auth state');
        Alert.alert('Error', 'Shop ID not found. Please log in again.');
        setEmployees([]);
        return;
      }
      
      console.log('Calling EmployeeService.getEmployeesByShop with shopId:', Number(shopId));
      const data = await EmployeeService.getEmployeesByShop(Number(shopId));
      console.log('Employees data received:', data);
      
      if (!data || data.length === 0) {
        console.warn('No employees returned from API');
        Alert.alert('Info', 'No employees found for your shop. Please add employees first.');
        setEmployees([]);
        return;
      }
      
      // Transform employee data to dropdown format
      const employeeOptions = data
        .filter(emp => emp.status === 'active' || emp.status !== 'inactive') // Show active employees
        .map(emp => ({
          label: emp.name,
          value: emp.id
        }));
      
      console.log('Transformed employee options:', employeeOptions);
      setEmployees(employeeOptions);
    } catch (error) {
      console.error('Error fetching employees:', error);
      Alert.alert('Error', `Failed to load employees: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setEmployees([]);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [authState.user?.shopId, authState.user]);

  // Fetch employees and services on component mount
  useEffect(() => {
    fetchEmployees();
    fetchServices();
  }, [authState]);

  const fetchServices = useCallback(async () => {
    try {
      setIsLoadingServices(true);
      
      // Get shopId from logged-in user to filter services by shop
      const shopId = authState.user?.shopId;
      
      console.log('Fetching services for shopId:', shopId);
      
      if (!shopId) {
        console.error('No shopId found in auth state');
        setServices([]);
        return;
      }
      
      console.log('Calling ShopServicesService.getServicesByShopId with shopId:', shopId);
      const data = await ShopServicesService.getServicesByShopId(shopId);
      console.log('Services data received:', data);
      
      if (!data || data.length === 0) {
        console.warn('No services returned from API');
        Alert.alert('Info', 'No services found for your shop. Please add services first.');
        setServices([]);
        return;
      }
      
      // Transform service data to dropdown format
      const serviceOptions = data
        .filter(service => service.isActive !== false) // Show active services
        .map(service => ({
          label: `${service.name} - ₹${service.price}`,
          value: service.id?.toString() || '',
          price: service.price
        }));
      
      console.log('Transformed service options:', serviceOptions);
      setServices(serviceOptions);
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', `Failed to load services: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  }, [authState.user?.shopId, authState.user]);

  // Fetch employees and services on component mount
  useEffect(() => {
    fetchEmployees();
    fetchServices();
  }, [authState]);

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
    const newSelectedServices = formData.selectedServices.includes(serviceValue)
      ? formData.selectedServices.filter(s => s !== serviceValue)
      : [...formData.selectedServices, serviceValue];
    handleFieldChange('selectedServices', newSelectedServices);
  };

  const getSelectedServicePrice = () => {
    return formData.selectedServices.reduce((total, serviceValue) => {
      const service = services.find(s => s.value === serviceValue);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const selectDropdownOption = (field: string, value: string, dropdownKey: string) => {
    handleFieldChange(field as keyof typeof formData, value);
    setDropdownStates(prev => ({ ...prev, [dropdownKey]: false }));
  };

  const handleSubmit = async () => {
    Haptics.notificationAsync();

    // Validate all fields
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let hasError = false;

    const employeeError = validateField('employee', formData.employee);
    if (employeeError) {
      newErrors.employee = employeeError;
      hasError = true;
    }

    const servicesError = validateField('selectedServices', formData.selectedServices);
    if (servicesError) {
      newErrors.selectedServices = servicesError;
      hasError = true;
    }

    const amountError = validateField('paidAmount', formData.paidAmount);
    if (amountError) {
      newErrors.paidAmount = amountError;
      hasError = true;
    }

    const paymentMethodError = validateField('paymentMethod', formData.paymentMethod);
    if (paymentMethodError) {
      newErrors.paymentMethod = paymentMethodError;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setTouched({ employee: true, selectedServices: true, paidAmount: true, paymentMethod: true });
      return;
    }

    // Get shopId from auth state
    const shopId = authState.user?.shopId;
    
    if (!shopId) {
      Alert.alert('Error', 'Shop ID not found. Please log in again.');
      return;
    }

  // Get employee name for display
  const selectedEmployee = employees.find(emp => emp.value === formData.employee);
  const employeeName = selectedEmployee ? selectedEmployee.label : 'Unknown';

  // Get selected services names for display
  const selectedServiceNames = formData.selectedServices.map(serviceValue => {
    const service = services.find(s => s.value === serviceValue);
    return service ? service.label : 'Unknown Service';
  }).join(', ');

  const newActivity = {
    type: 'SALE',
    description: `Service sale: ${selectedServiceNames}`,
    amount: getSelectedServicePrice(),
    employeeId: Number(formData.employee),
    employeeName: employeeName,
    customerInfo: formData.customerInfo,
    services: formData.selectedServices,
    serviceNames: selectedServiceNames,
    paidAmount: parseFloat(formData.paidAmount),
    paymentMethod: formData.paymentMethod,
    servicePrice: getSelectedServicePrice(),
    // shopId and userId removed - backend will derive from authenticated user for security
    timestamp: new Date().toISOString(),
  };

  console.log('Creating activity with data:', newActivity);

  try {
    setIsCreating(true);
    
    // Call backend API to create activity
    const response = await ActivityService.addActivity(newActivity);
    console.log('Activity created successfully:', response);

    // Show success UI
    setShowSuccess(true);
    
    // Auto-navigate to activity list after 2 seconds
    setTimeout(() => {
      router.replace('/(owner-tabs)/activity/list');
    }, 2000);
    
  } catch (error) {
    console.error('Error creating activity:', error);
    Alert.alert(
      'Error',
      `Failed to create activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
      [
        { text: 'OK' }
      ]
    );
  } finally {
    setIsCreating(false);
  }
};

const handleCancel = () => {
  Haptics.notificationAsync();
  router.back();
};

return (
  <View style={styles.container}>
    {/* Fixed Header */}
    <View style={styles.fixedHeader}>
      <Text style={styles.title}>New <Text style={styles.titleAccent}>Activity</Text></Text>
    </View>

    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>

      <View style={styles.form}>
        {/* Employee Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Employee *</Text>
          {isLoadingEmployees ? (
            <View style={styles.dropdownTrigger}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.dropdownTrigger, touched.employee && errors.employee && styles.inputWrapperError]}
              onPress={() => {
                toggleDropdown('employee');
                handleFieldBlur('employee', formData.employee);
              }}
            >
              <Text style={styles.dropdownTriggerText}>
                {employees.length === 0 ? 'No employees available' : getSelectedLabel(employees, formData.employee)}
              </Text>
              <Text style={styles.dropdownArrow}>{'\u25bc'}</Text>
            </TouchableOpacity>
          )}
          {touched.employee && errors.employee && (
            <Text style={styles.errorText}>{errors.employee}</Text>
          )}
          {dropdownStates.employee && !isLoadingEmployees && employees.length > 0 && (
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
          {isLoadingServices ? (
            <View style={styles.dropdownTrigger}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.dropdownTrigger, touched.selectedServices && errors.selectedServices && styles.inputWrapperError]}
              onPress={() => {
                toggleDropdown('service');
                handleFieldBlur('selectedServices', formData.selectedServices);
              }}
            >
              <Text style={styles.dropdownTriggerText}>
                {services.length === 0 ? 'No services available' : getSelectedServicesLabel()}
              </Text>
              <Text style={styles.dropdownArrow}>{'\u25bc'}</Text>
            </TouchableOpacity>
          )}
          {touched.selectedServices && errors.selectedServices && (
            <Text style={styles.errorText}>{errors.selectedServices}</Text>
          )}
          {dropdownStates.service && !isLoadingServices && services.length > 0 && (
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
          {/* ... */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Price:</Text>
            <Text style={styles.summaryValue}>₹{getSelectedServicePrice()}</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Paid Amount *</Text>
            <TextInput
              style={[styles.input, touched.paidAmount && errors.paidAmount && styles.inputWrapperError]}
              value={formData.paidAmount}
              onChangeText={(value) => handleFieldChange('paidAmount', value)}
              onBlur={() => handleFieldBlur('paidAmount', formData.paidAmount)}
              placeholder="Enter paid amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
            {touched.paidAmount && errors.paidAmount && (
              <Text style={styles.errorText}>{errors.paidAmount}</Text>
            )}
          </View>
          
          {/* Payment Method */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Payment Method *</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, touched.paymentMethod && errors.paymentMethod && styles.inputWrapperError]}
              onPress={() => {
                toggleDropdown('paymentMethod');
                handleFieldBlur('paymentMethod', formData.paymentMethod);
              }}
            >
              <Text style={styles.dropdownTriggerText}>
                {getSelectedLabel(paymentMethods, formData.paymentMethod)}
              </Text>
              <Text style={styles.dropdownArrow}>{'\u25bc'}</Text>
            </TouchableOpacity>
            {touched.paymentMethod && errors.paymentMethod && (
              <Text style={styles.errorText}>{errors.paymentMethod}</Text>
            )}
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
            disabled={isCreating}
            activeOpacity={0.7}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Create Activity</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </ScrollView>

    {/* Success Overlay */}
    {showSuccess && (
      <View style={styles.successOverlay}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Activity Created!</Text>
          <Text style={styles.successMessage}>Service activity has been recorded successfully</Text>
        </View>
      </View>
    )}
  </View>
);
}
