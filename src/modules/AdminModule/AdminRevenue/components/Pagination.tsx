import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  totalItems,
  showPageSizeSelector = false,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
}: PaginationProps) {
  const { colors } = useTheme();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getStartItem = () => (currentPage - 1) * pageSize + 1;
  const getEndItem = () => Math.min(currentPage * pageSize, totalItems || currentPage * pageSize);

  return (
    <View style={styles.container}>
      {totalItems && (
        <Text style={[styles.infoText, { color: colors.text }]}>
          Showing {getStartItem()} to {getEndItem()} of {totalItems} entries
        </Text>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              currentPage === 1 && styles.disabledButton,
            ]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>

          {getPageNumbers().map((page, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pageButton,
                {
                  backgroundColor: page === currentPage ? colors.primary : colors.card,
                  borderColor: page === currentPage ? colors.primary : colors.border,
                },
                page === '...' && styles.disabledButton,
              ]}
              onPress={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
            >
              <Text
                style={[
                  styles.pageText,
                  { color: page === currentPage ? '#FFFFFF' : colors.text },
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.pageButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              currentPage === totalPages && styles.disabledButton,
            ]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showPageSizeSelector && onPageSizeChange && (
        <View style={styles.pageSizeSelector}>
          <Text style={[styles.pageSizeLabel, { color: colors.text }]}>Rows per page:</Text>
          {pageSizeOptions.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.pageSizeButton,
                {
                  backgroundColor: size === pageSize ? colors.primary : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => onPageSizeChange(size)}
            >
              <Text
                style={[
                  styles.pageSizeButtonText,
                  { color: size === pageSize ? '#FFFFFF' : colors.text },
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 12,
    minWidth: 150,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageSizeLabel: {
    fontSize: 12,
  },
  pageSizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  pageSizeButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
