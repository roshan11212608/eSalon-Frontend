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
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
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

  scrollView: {
    flex: 1,
  },

  totalServicesCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  totalServicesIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F59E0B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  totalServicesLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },

  totalServicesValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1a1a1a',
  },

  mostPopularCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  mostPopularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  mostPopularTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 8,
  },

  popularServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  popularServiceRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0554f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },

  popularServiceInfo: {
    flex: 1,
    marginLeft: 12,
  },

  popularServiceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  popularServiceBookings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },

  serviceDotLarge: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  mostPopularServiceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginLeft: 12,
  },

  mostPopularBookings: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
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

  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  serviceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },

  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  serviceStats: {
    alignItems: 'flex-end',
  },

  serviceBookings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
});
