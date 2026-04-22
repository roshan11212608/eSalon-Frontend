import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 60,
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#f7b638',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#f7b638',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },

  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },

  // Main Content Container
  mainContent: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f7b638',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCloseButton: {
    position: 'absolute',
    right: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  titleAccent: {
    color: '#f7b638',
  },
  addButtonIcon: {
    color: '#ffffff',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1a1a1a',
  },
  roleFilter: {
    marginBottom: 20,
  },
  roleChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  roleChipActive: {
    backgroundColor: '#f7b638',
    borderColor: '#f7b638',
  },
  roleChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  employeesList: {
    backgroundColor: '#ffffff',
  },
  employeeCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  employeeCardPressed: {
    backgroundColor: '#fafafa',
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 2,
  },
  employeeEmail: {
    fontSize: 12,
    color: '#666666',
  },
  employeeShopId: {
    fontSize: 11,
    color: '#f7b638',
    fontWeight: '600',
    marginTop: 2,
  },
  employeeActions: {
    alignItems: 'flex-end',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    color: '#DC2626',
  },
  employeeDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  roleButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  roleButtonActive: {
    backgroundColor: '#f7b638',
    borderColor: '#f7b638',
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#f7b638',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  detailIcon: {
    color: '#6B7280',
  },
  searchIcon: {
    color: '#6B7280',
  },
  avatarIcon: {
    color: '#FFFFFF',
  },
  closeButtonIcon: {
    color: '#f7b638',
  },
  statusIndicatorActive: {
    backgroundColor: '#10B981',
  },
  statusIndicatorInactive: {
    backgroundColor: '#EF4444',
  },
  searchInputPlaceholder: {
    color: '#9CA3AF',
  },
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 16,
  },
  // Success Message
  successMessage: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  successMessageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  successMessageIcon: {
    marginRight: 10,
  },
  // Confirmation Modal Styles
  confirmationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  confirmationModalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  confirmationModalDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  confirmationModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmationModalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  confirmationModalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  confirmationModalButtonDelete: {
    backgroundColor: '#DC2626',
  },
  confirmationModalButtonReactivate: {
    backgroundColor: '#4CAF50',
  },
  confirmationModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationModalButtonTextCancel: {
    color: '#374151',
  },
  confirmationModalButtonTextWhite: {
    color: '#FFFFFF',
  },
  // Detail Modal Styles
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  detailModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#f7b638',
  },
  detailAvatarIconLarge: {
    color: '#f7b638',
  },
  detailName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 6,
  },
  detailRole: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f7b638',
    textAlign: 'center',
    marginBottom: 4,
  },
  detailEmail: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailBadge: {
    backgroundColor: '#fff9e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f7b638',
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f7b638',
  },
  detailSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailInfoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailInfoText: {
    fontSize: 14,
    color: '#666666',
  },
  detailStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  detailStatusBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  detailStatusBadgeInactive: {
    backgroundColor: '#FEE2E2',
  },
  detailStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  detailStatusTextActive: {
    color: '#059669',
  },
  detailStatusTextInactive: {
    color: '#DC2626',
  },
  // Activity Log Styles
  activityLogCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityLogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityLogIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityLogInfo: {
    flex: 1,
  },
  activityLogType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  activityLogDate: {
    fontSize: 11,
    color: '#666666',
  },
  activityLogAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  activityLogDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
  },
  activityLogNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityLogNotesText: {
    fontSize: 11,
    color: '#64748B',
  },
  activityFilterContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  activityFilterButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  activityFilterButtonActive: {
    backgroundColor: '#f7b638',
    borderColor: '#f7b638',
  },
  activityFilterButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  activityFilterButtonTextActive: {
    color: '#1a1a1a',
  },
  datePickerModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  datePickerList: {
    maxHeight: 400,
  },
  datePickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  datePickerItemSelected: {
    backgroundColor: '#fff9e6',
  },
  datePickerItemText: {
    fontSize: 14,
    color: '#666666',
  },
  datePickerItemTextSelected: {
    color: '#f7b638',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTable: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
  },
  activityTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  activityTableHeaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    flex: 1,
  },
  activityTableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    alignItems: 'center',
  },
  activityTableTypeCell: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 6,
    flex: 0.8,
  },
  activityTableTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  activityTableTypeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  activityTableText: {
    fontSize: 11,
    color: '#666666',
    flex: 1,
  },
  activityTableAmount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10b981',
    flex: 0.6,
    textAlign: 'right',
  },
  // Additional Form Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
