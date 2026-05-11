import { useState, useEffect } from 'react';
import EmployeeService, { Employee as EmployeeType } from '@/src/services/employee/EmployeeService';

export const useEditEmployee = (employeeId: string) => {
  const [employee, setEmployee] = useState<EmployeeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commissionPercentage: 0,
    joinDate: '',
  });

  useEffect(() => {
    fetchEmployeeDetails();
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      const data = await EmployeeService.getEmployeeById(employeeId);
      setEmployee(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        commissionPercentage: data.commissionPercentage || 0,
        joinDate: data.joinDate || '',
      });
    } catch (error) {
      console.error('Error fetching employee details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveEmployee = async () => {
    try {
      setIsSaving(true);
      const updatedEmployee = await EmployeeService.updateEmployee(employeeId, {
        ...employee,
        ...formData,
      });
      setEmployee(updatedEmployee);
      // Show success alert
      setAlertMessage('Employee updated successfully!');
      setAlertType('success');
      setShowAlert(true);
      return true;
    } catch (error) {
      console.error('Error updating employee:', error);
      setAlertMessage('Failed to update employee. Please try again.');
      setAlertType('error');
      setShowAlert(true);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    employee,
    formData,
    isLoading,
    isSaving,
    updateFormData,
    saveEmployee,
    showAlert,
    alertMessage,
    alertType,
  };
};
