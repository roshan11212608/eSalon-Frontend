import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';

import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { shopServicesStyles } from './styles/shopServices.styles';
import shopServicesService from '@/src/services/shopServicesService';
import { useAuthStore } from '../../shared/hooks/useAuthStore';

const CATEGORY_COLORS: Record<
  string,
  { bg: string; accent: string; icon: string }
> = {
  Hair: { bg: '#4ECDC4', accent: '#2D8B84', icon: 'cut' },
  Face: { bg: '#FF6B6B', accent: '#C92A2A', icon: 'happy' },
  Body: { bg: '#9B59B6', accent: '#6C3483', icon: 'body' },
  Nails: { bg: '#F39C12', accent: '#B7791F', icon: 'hand-left' },
  Spa: { bg: '#1ABC9C', accent: '#117A65', icon: 'water' },
  Makeup: { bg: '#E91E63', accent: '#AD1457', icon: 'color-wand' },
  default: { bg: '#FFD166', accent: '#D4A017', icon: 'sparkles' },
};

function getCategoryStyle(category?: string) {
  return CATEGORY_COLORS[category || 'default'] || CATEGORY_COLORS.default;
}

function getCategoryIcon(category?: string): any {
  const map: Record<string, any> = {
    Hair: 'cut-outline',
    Face: 'happy-outline',
    Body: 'fitness-outline',
    Nails: 'hand-left-outline',
    Spa: 'water-outline',
    Makeup: 'color-wand-outline',
    default: 'sparkles-outline',
  };

  return map[category || 'default'] || map.default;
}

export default function Services() {
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  const authState = useAuthStore();
  const shopId = authState.user?.shopId;

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      console.log('Fetching services with shopId:', shopId);

      const data = await shopServicesService.getServicesByShopId(
        shopId || ''
      );

      console.log('Services fetched:', data);

      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [loading]);

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [fetchServices])
  );

  const categories = React.useMemo(() => {
    const cats = new Set(
      services.map((s) => s.category).filter(Boolean)
    );

    return Array.from(cats);
  }, [services]);

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory
      ? service.category === selectedCategory
      : true;

    return matchesCategory;
  });

  const handleAddService = () => {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    router.push('/(owner-tabs)/shopServices/addNewServices');
  };

  const handleDeleteService = (id: number) => {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    );

    setServiceToDelete(String(id));
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await shopServicesService.deleteService(
        Number(serviceToDelete)
      );

      setServices(
        services.filter(
          (service) => service.id !== Number(serviceToDelete)
        )
      );

      setShowDeleteModal(false);
      setServiceToDelete(null);

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const cancelDeleteService = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  if (loading) {
    return (
      <View style={shopServicesStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD166" />
      </View>
    );
  }

  return (
    <>
      <View style={shopServicesStyles.mainContainer}>
        {/* Header */}
        <Animated.View
          style={[
            shopServicesStyles.heroHeader,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={shopServicesStyles.heroTitle}>
            Shop
            <Text style={shopServicesStyles.heroTitleAccent}>
              Services
            </Text>
          </Text>
        </Animated.View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            shopServicesStyles.scrollContent
          }
        >
          {/* Add Service Button */}
          <TouchableOpacity
            style={shopServicesStyles.createButton}
            onPress={handleAddService}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={shopServicesStyles.createButtonText}>
              Create Service
            </Text>
          </TouchableOpacity>

          {/* Categories */}
          {categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={shopServicesStyles.categoryFilter}
              contentContainerStyle={{
                paddingRight: 24,
              }}
            >
              <TouchableOpacity
                style={[
                  shopServicesStyles.categoryChip,
                  !selectedCategory &&
                    shopServicesStyles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    shopServicesStyles.categoryChipText,
                    !selectedCategory &&
                      shopServicesStyles.categoryChipTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    shopServicesStyles.categoryChip,
                    selectedCategory === cat &&
                      shopServicesStyles.categoryChipActive,
                  ]}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === cat ? null : cat
                    )
                  }
                >
                  <Text
                    style={[
                      shopServicesStyles.categoryChipText,
                      selectedCategory === cat &&
                        shopServicesStyles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Services */}
          <View style={shopServicesStyles.servicesList}>
            <Text style={shopServicesStyles.sectionTitle}>
              {filteredServices.length} Service
              {filteredServices.length !== 1 ? 's' : ''}
            </Text>

            {filteredServices.length === 0 ? (
              <View style={shopServicesStyles.emptyContainer}>
                <View
                  style={
                    shopServicesStyles.emptyIconContainer
                  }
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={40}
                    color="#D1D5DB"
                  />
                </View>

                <Text style={shopServicesStyles.emptyTitle}>
                  No services found
                </Text>

                <Text
                  style={shopServicesStyles.emptySubtitle}
                >
                  {selectedCategory
                    ? 'Try adjusting your filters'
                    : 'Add your first service to get started'}
                </Text>

                {!selectedCategory && (
                  <TouchableOpacity
                    style={shopServicesStyles.emptyCta}
                    onPress={handleAddService}
                  >
                    <Text
                      style={
                        shopServicesStyles.emptyCtaText
                      }
                    >
                      Add Service
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filteredServices.map((service) => {
                const catStyle = getCategoryStyle(
                  service.category
                );

                const iconName = getCategoryIcon(
                  service.category
                );

                return (
                  <Animated.View
                    key={service.id}
                    style={[
                      shopServicesStyles.serviceCard,
                      {
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: slideAnim,
                          },
                        ],
                      },
                    ]}
                  >
                    {/* Left Accent */}
                    <View
                      style={[
                        shopServicesStyles.cardLeftAccent,
                        {
                          backgroundColor: catStyle.bg,
                        },
                      ]}
                    />

                    <View
                      style={
                        shopServicesStyles.cardContent
                      }
                    >
                      {/* Icon */}
                      <View
                        style={[
                          shopServicesStyles.cardIconContainer,
                          {
                            backgroundColor: `${catStyle.bg}20`,
                          },
                        ]}
                      >
                        <Ionicons
                          name={iconName}
                          size={24}
                          color={catStyle.bg}
                        />
                      </View>

                      {/* Info */}
                      <View
                        style={shopServicesStyles.cardInfo}
                      >
                        <Text
                          style={
                            shopServicesStyles.serviceName
                          }
                        >
                          {service.name}
                        </Text>

                        <View
                          style={
                            shopServicesStyles.serviceMeta
                          }
                        >
                          {service.category && (
                            <View
                              style={
                                shopServicesStyles.metaBadge
                              }
                            >
                              <View
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor:
                                    catStyle.bg,
                                }}
                              />

                              <Text
                                style={
                                  shopServicesStyles.metaText
                                }
                              >
                                {service.category}
                              </Text>
                            </View>
                          )}

                          {service.duration && (
                            <View
                              style={
                                shopServicesStyles.metaBadge
                              }
                            >
                              <Ionicons
                                name="time-outline"
                                size={12}
                                color="#9CA3AF"
                              />

                              <Text
                                style={
                                  shopServicesStyles.metaText
                                }
                              >
                                {service.duration} min
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Price */}
                      <View
                        style={
                          shopServicesStyles.cardPriceSection
                        }
                      >
                        <Text
                          style={
                            shopServicesStyles.priceLabel
                          }
                        >
                          Price
                        </Text>

                        <Text
                          style={
                            shopServicesStyles.servicePrice
                          }
                        >
                          Rs {service.price}
                        </Text>
                      </View>

                      {/* Delete */}
                      <TouchableOpacity
                        style={
                          shopServicesStyles.deleteButton
                        }
                        onPress={() =>
                          handleDeleteService(service.id)
                        }
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#DC2626"
                        />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDeleteService}
      >
        <View style={shopServicesStyles.modalOverlay}>
          <View style={shopServicesStyles.modalCard}>
            <View
              style={
                shopServicesStyles.modalIconContainer
              }
            >
              <Ionicons
                name="trash-outline"
                size={32}
                color="#DC2626"
              />
            </View>

            <Text style={shopServicesStyles.modalTitle}>
              Delete Service
            </Text>

            <Text
              style={shopServicesStyles.modalSubtitle}
            >
              Are you sure you want to delete this
              service?{'\n'}
              This action cannot be undone.
            </Text>

            <View
              style={shopServicesStyles.modalButtonRow}
            >
              <TouchableOpacity
                style={shopServicesStyles.cancelButton}
                onPress={cancelDeleteService}
              >
                <Text
                  style={
                    shopServicesStyles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  shopServicesStyles.confirmDeleteButton
                }
                onPress={confirmDeleteService}
              >
                <Text
                  style={
                    shopServicesStyles
                      .confirmDeleteButtonText
                  }
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}