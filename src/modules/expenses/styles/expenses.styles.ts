import { StyleSheet } from 'react-native';

export const expensesStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
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
  addButton: {
    backgroundColor: '#f7b638',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
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
  categoryFilter: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  categoryChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#f7b638',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  expensesList: {
    backgroundColor: '#ffffff',
  },
  expenseCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 2,
  },
  expenseDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f7b638',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
  },
  toggleButton: {
    padding: 4,
  },
  expenseDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#666666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#f7b638',
    borderColor: '#f7b638',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  paymentButtons: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  paymentButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  paymentButtonActive: {
    backgroundColor: '#f7b638',
    borderColor: '#f7b638',
  },
  paymentButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  paymentButtonTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#f7b638',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
