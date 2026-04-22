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

  // Main Content Container
  mainContent: {
    backgroundColor: '#ffffff',
  },

  // Profile Card
  profileCard: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  avatarContainer: {
    marginBottom: 12,
    position: 'relative',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f7b638',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#f7b638',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#ffffff',
  },

  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },

  profileDetails: {
    alignItems: 'center',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },

  email: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 12,
  },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },

  shopIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f7b638',
  },

  shopIdText: {
    fontSize: 11,
    color: '#1a1a1a',
    fontWeight: '600',
    marginLeft: 4,
  },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7b638',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  roleText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 4,
  },

  userIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366f1',
  },

  userIdText: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '600',
    marginLeft: 4,
  },

  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fce7f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ec4899',
  },

  shopBadgeText: {
    fontSize: 11,
    color: '#ec4899',
    fontWeight: '600',
    marginLeft: 4,
  },

  shopAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  shopAddressText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },

  bioContainer: {
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },

  bio: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
    textAlign: 'center',
  },

  // Menu Section
  menuSection: {
    backgroundColor: '#ffffff',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },

  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  menuText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },

  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
  },

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
    fontWeight: '400',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32,
  },

  errorText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
    marginTop: 16,
  },

  errorSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
});
