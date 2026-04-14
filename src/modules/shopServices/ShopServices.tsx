import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { shopServicesStyles } from './styles/shopServices.styles';
import AddNewServices from './AddNewServices';

export default function Services() {
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Haircut',
      category: 'Hair Services',
      price: 25,
      duration: '30 min',
      status: 'active',
      description: 'Professional haircut with styling',
      icon: 'cut'
    },
    {
      id: '2',
      name: 'Beard Trim',
      category: 'Hair Services',
      price: 15,
      duration: '15 min',
      status: 'active',
      description: 'Beard trimming and shaping',
      icon: 'create-outline'
    },
    {
      id: '3',
      name: 'Hair Coloring',
      category: 'Hair Services',
      price: 60,
      duration: '120 min',
      status: 'active',
      description: 'Full hair coloring service',
      icon: 'color-palette-outline'
    },
    {
      id: '4',
      name: 'Shave',
      category: 'Hair Services',
      price: 20,
      duration: '20 min',
      status: 'active',
      description: 'Traditional hot towel shave',
      icon: 'razor-outline'
    },
    {
      id: '5',
      name: 'Facial',
      category: 'Skin Care',
      price: 40,
      duration: '45 min',
      status: 'active',
      description: 'Deep cleansing facial treatment',
      icon: 'sparkles-outline'
    },
    {
      id: '6',
      name: 'Head Massage',
      category: 'Massage',
      price: 30,
      duration: '30 min',
      status: 'active',
      description: 'Relaxing head massage',
      icon: 'fitness-outline'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Hair Services', 'Skin Care', 'Massage'];

  const handleAddService = () => {
    Haptics.notificationAsync();
    setShowAddModal(true);
  };

  const handleSaveService = (newService: any) => {
    const serviceToAdd = {
      id: Date.now().toString(),
      ...newService
    };

    setServices([...services, serviceToAdd]);
    setShowAddModal(false);
  };

  const toggleServiceStatus = (id: string) => {
    Haptics.impactAsync();
    setServices(services.map(service => 
      service.id === id 
        ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
        : service
    ));
  };

  return (
    <>
      <ScrollView 
        style={shopServicesStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={shopServicesStyles.scrollContent}
      >
      <View style={shopServicesStyles.header}>
        <Text style={shopServicesStyles.title}>Services</Text>
        <TouchableOpacity style={shopServicesStyles.addButton} onPress={handleAddService}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={shopServicesStyles.searchSection}>
        <View style={shopServicesStyles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={shopServicesStyles.searchInput}
            placeholder="Search services..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={shopServicesStyles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                shopServicesStyles.categoryChip,
                selectedCategory === category && shopServicesStyles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                shopServicesStyles.categoryChipText,
                selectedCategory === category && shopServicesStyles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={shopServicesStyles.servicesList}>
        {filteredServices.map(service => (
          <View key={service.id} style={shopServicesStyles.serviceCard}>
            <View style={shopServicesStyles.serviceHeader}>
              <View style={shopServicesStyles.serviceIconContainer}>
                <View style={[shopServicesStyles.serviceIcon, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name={service.icon as any} size={20} color="#FFFFFF" />
                </View>
              </View>
              <View style={shopServicesStyles.serviceInfo}>
                <Text style={shopServicesStyles.serviceName}>{service.name}</Text>
                <Text style={shopServicesStyles.serviceCategory}>{service.category}</Text>
                <Text style={shopServicesStyles.serviceDescription}>{service.description}</Text>
              </View>
              <View style={shopServicesStyles.servicePricing}>
                <Text style={shopServicesStyles.servicePrice}>Rs {service.price}</Text>
                <Text style={shopServicesStyles.serviceDuration}>{service.duration}</Text>
              </View>
            </View>
            
            <View style={shopServicesStyles.serviceFooter}>
              <View style={shopServicesStyles.statusContainer}>
                <View style={[
                  shopServicesStyles.statusIndicator,
                  { backgroundColor: service.status === 'active' ? '#10B981' : '#EF4444' }
                ]} />
                <Text style={shopServicesStyles.statusText}>
                  {service.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
              
              <TouchableOpacity
                style={shopServicesStyles.toggleButton}
                onPress={() => toggleServiceStatus(service.id)}
              >
                <Ionicons 
                  name={service.status === 'active' ? 'eye-off' : 'eye'} 
                  size={16} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>

      <AddNewServices 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveService}
      />
    </>
  );
}
