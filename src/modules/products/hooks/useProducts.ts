import { useState } from 'react';
import { Product } from '../types';

export function useProducts() {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Hair Shampoo',
      category: 'Hair Care',
      price: 250,
      stock: 50,
      description: 'Premium quality shampoo for all hair types',
      sku: 'SHM-001',
      supplier: 'BeautyPro',
    },
    {
      id: '2',
      name: 'Hair Conditioner',
      category: 'Hair Care',
      price: 280,
      stock: 45,
      description: 'Nourishing conditioner for smooth hair',
      sku: 'SHM-002',
      supplier: 'BeautyPro',
    },
    {
      id: '3',
      name: 'Hair Gel',
      category: 'Styling',
      price: 180,
      stock: 30,
      description: 'Strong hold hair gel for styling',
      sku: 'STY-001',
      supplier: 'StyleFix',
    },
    {
      id: '4',
      name: 'Hair Spray',
      category: 'Styling',
      price: 220,
      stock: 25,
      description: 'Long-lasting hair spray',
      sku: 'STY-002',
      supplier: 'StyleFix',
    },
    {
      id: '5',
      name: 'Hair Oil',
      category: 'Hair Care',
      price: 150,
      stock: 60,
      description: 'Natural hair oil for nourishment',
      sku: 'SHM-003',
      supplier: 'NaturalCare',
    },
    {
      id: '6',
      name: 'Hair Color',
      category: 'Hair Care',
      price: 350,
      stock: 20,
      description: 'Ammonia-free hair color',
      sku: 'SHM-004',
      supplier: 'ColorMax',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = () => {
    setLoading(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    products,
    loading,
    error,
    refreshProducts,
  };
}
