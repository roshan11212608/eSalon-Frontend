import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import Employees, { Employee } from '../../../src/modules/employees/Employees';
import { styles } from '../../../src/modules/shop/styles/shop.styles';

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      role: 'Manager',
      salary: 50000,
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      role: 'Senior Stylist',
      salary: 35000,
      status: 'active',
      joinDate: '2024-02-20'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892',
      role: 'Staff',
      salary: 25000,
      status: 'active',
      joinDate: '2024-03-10'
    }
  ]);

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString()
    };
    setEmployees([...employees, newEmployee]);
  };

  const handleToggleEmployeeStatus = (id: string) => {
    setEmployees(employees.map(employee => 
      employee.id === id 
        ? { ...employee, status: employee.status === 'active' ? 'inactive' : 'active' }
        : employee
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Employees 
          employees={employees}
          onAddEmployee={handleAddEmployee}
          onToggleEmployeeStatus={handleToggleEmployeeStatus}
        />
      </ScrollView>
    </View>
  );
}
