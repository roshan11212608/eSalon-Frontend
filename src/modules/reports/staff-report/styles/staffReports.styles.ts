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
    backgroundColor: '#FFC107',
    shadowColor: '#FFC107',
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

  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  breakdownInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  breakdownDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 14,
  },

  breakdownCategory: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  breakdownAmount: {
    alignItems: 'flex-end',
  },

  breakdownValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },

  breakdownPercentage: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
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
