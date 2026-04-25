import { StyleSheet } from 'react-native';

export const addExpensesStyles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    right: 20,
  },
  dropdownTriggerText: {
    color: '#1a1a1a',
  },
  dropdownTriggerTextPlaceholder: {
    color: '#9CA3AF',
  },
  chevronIcon: {
    position: 'absolute',
    right: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
