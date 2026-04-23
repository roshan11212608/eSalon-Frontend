import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  highlightText: {
    color: '#FFC107',
  },

  scrollView: {
    flex: 1,
  },

  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  periodButtonActive: {
    backgroundColor: '#0554f0',
    borderColor: '#0554f0',
  },

  periodButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },

  periodButtonTextActive: {
    color: '#ffffff',
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },

  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },

  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },

  payrollCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
  },

  payrollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0554f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },

  staffDetails: {
    flex: 1,
  },

  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },

  staffRole: {
    fontSize: 13,
    color: '#6b7280',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  payrollDetails: {
    padding: 14,
  },

  payrollRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  previousMonthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  previousMonthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },

  previousMonthAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0554f0',
  },

  totalRemainingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  totalRemainingLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },

  totalRemainingAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
  },

  payrollItem: {
    flex: 1,
    alignItems: 'center',
  },

  payrollLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  payrollAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  paidAmount: {
    color: '#10B981',
  },

  currentDueAmount: {
    color: '#F59E0B',
  },

  remainingAmount: {
    color: '#EF4444',
  },

  progressContainer: {
    marginBottom: 12,
  },

  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'right',
  },

  lastPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },

  lastPaymentText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },

  payButton: {
    backgroundColor: '#0554f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#0554f0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  payButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },

  payButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },

  payButtonTextDisabled: {
    color: '#6b7280',
  },
});
