import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  paymentsList: {
    backgroundColor: '#ffffff',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recipientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  recipientType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textTransform: 'capitalize',
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f7b638',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  paymentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  detailSeparator: {
    fontSize: 13,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
    lineHeight: 18,
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  verificationIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  verificationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  verifyButton: {
    padding: 8,
    marginRight: 4,
  },
  cancelButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  commissionInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  commissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commissionText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  commissionAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  netAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  // Activity card styles
  activityCard: {
    backgroundColor: '#FAFAFA',
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
});
