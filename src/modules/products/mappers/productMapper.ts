import { Product } from '../types';

export function formatCurrency(amount: number): string {
  return `₹${amount}`;
}

export function getStockStatus(stock: number): 'in-stock' | 'low-stock' | 'out-of-stock' {
  if (stock === 0) return 'out-of-stock';
  if (stock < 20) return 'low-stock';
  return 'in-stock';
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case 'in-stock':
      return '#10B981';
    case 'low-stock':
      return '#F59E0B';
    case 'out-of-stock':
      return '#EF4444';
    default:
      return '#64748B';
  }
}

export function getStockStatusText(status: string): string {
  switch (status) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
}

export function filterProducts(products: Product[], searchTerm: string, category?: string): Product[] {
  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  });
}

export function getUniqueCategories(products: Product[]): string[] {
  const categories = products.map(p => p.category);
  return Array.from(new Set(categories));
}
