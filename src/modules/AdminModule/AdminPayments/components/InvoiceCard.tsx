import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Invoice } from '../types/payment.types';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export default function InvoiceCard({ invoice, onView, onDownload, onShare }: InvoiceCardProps) {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Ionicons name="document-text" size={20} color="#f7b638" />
          <Text style={s.invoiceNumber}>{invoice.invoiceNumber}</Text>
        </View>
        <View style={[s.statusBadge, invoice.status === 'Paid' ? s.paid : s.pending]}>
          <Text style={[s.statusText, invoice.status === 'Paid' ? s.paidText : s.pendingText]}>
            {invoice.status}
          </Text>
        </View>
      </View>

      <View style={s.body}>
        <View style={s.row}>
          <Text style={s.label}>Salon:</Text>
          <Text style={s.value}>{invoice.salonName}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Amount:</Text>
          <Text style={s.amount}>{invoice.currency} {invoice.amount.toLocaleString()}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Paid Date:</Text>
          <Text style={s.value}>{new Date(invoice.paidDate).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Total</Text>
        <Text style={s.totalValue}>{invoice.currency} {invoice.total.toLocaleString()}</Text>
      </View>

      <View style={s.actions}>
        <TouchableOpacity style={s.actionBtn} onPress={onView}>
          <Ionicons name="eye" size={16} color="#6B7280" />
          <Text style={s.actionText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={onDownload}>
          <Ionicons name="download" size={16} color="#6B7280" />
          <Text style={s.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={onShare}>
          <Ionicons name="share" size={16} color="#6B7280" />
          <Text style={s.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paid: {
    backgroundColor: '#D1FAE5',
  },
  pending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  paidText: {
    color: '#059669',
  },
  pendingText: {
    color: '#D97706',
  },
  body: {
    gap: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  amount: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
