import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 20 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: isTablet ? 24 : 20,
  },
  salonInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: isTablet ? 24 : 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  salonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  salonNameContainer: {
    flex: 1,
  },
  salonName: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: isTablet ? 20 : 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  detailContent: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '500',
    color: '#111827',
    flex: 2,
    textAlign: 'right',
  },
  actionSection: {
    marginBottom: 20,
  },
  primaryActionButton: {
    backgroundColor: '#780115',
    borderRadius: 12,
    padding: isTablet ? 16 : 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    shadowColor: '#780115',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: isTablet ? 14 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryActionText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
