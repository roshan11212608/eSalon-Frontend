import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },

  highlightText: {
    color: '#FFC107',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 0,
  },

  periodButtonActive: {
    backgroundColor: '#0554f0',
    shadowColor: '#0554f0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  periodButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
  },

  periodButtonTextActive: {
    color: '#ffffff',
  },

  scrollView: {
    flex: 1,
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },

  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },

  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },

  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 20,
  },

  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  categoryAmount: {
    alignItems: 'flex-end',
  },

  categoryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  categoryPercentage: {
    fontSize: 12,
    color: '#6b7280',
  },

  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  expenseContent: {
    flex: 1,
  },

  expenseCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },

  expenseDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },

  expenseVendor: {
    fontSize: 11,
    color: '#9ca3af',
  },

  expenseAmount: {
    alignItems: 'flex-end',
  },

  expenseValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 2,
  },

  expenseDate: {
    fontSize: 11,
    color: '#6b7280',
  },

  chartContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },

  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  chartBarWrapper: {
    flex: 1,
    marginLeft: 12,
    position: 'relative',
  },

  chartBar: {
    height: 24,
    borderRadius: 6,
  },

  chartDateRange: {
    position: 'absolute',
    left: 8,
    top: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },

  chartBarLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    width: 45,
  },

  chartBarValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 10,
  },
});
