// Authentication utilities and helpers
import { StorageService, type UserRole } from '../services/storage/storageService';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const generateToken = (): string => {
  return Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await StorageService.getToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getUserRole = async (): Promise<UserRole | null> => {
  try {
    return await StorageService.getRole();
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};
