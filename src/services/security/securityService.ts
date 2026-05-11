/**
 * Security Service
 * Handles token refresh, rate limiting, and security improvements
 */

import { StorageService } from '../storage/storageService';

export interface SecurityConfig {
  tokenRefreshThreshold: number; // Minutes before expiry
  maxRetries: number;
  retryDelay: number; // Milliseconds
  rateLimitWindow: number; // Minutes
  rateLimitMaxRequests: number;
  encryptionEnabled: boolean;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

export interface TokenInfo {
  token: string;
  refreshToken: string;
  expiresAt: number;
  issuedAt: number;
}

class SecurityService {
  private static instance: SecurityService;
  private config: SecurityConfig;
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();
  private tokenRefreshPromise: Promise<string> | null = null;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  constructor() {
    this.config = {
      tokenRefreshThreshold: 5, // 5 minutes before expiry
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      rateLimitWindow: 15, // 15 minutes
      rateLimitMaxRequests: 100, // 100 requests per 15 minutes
      encryptionEnabled: true,
    };
  }

  /**
   * Initialize security service
   */
  async initialize(): Promise<void> {
    try {
      // Load stored tokens
      await this.loadStoredTokens();
      
      // Clean up expired rate limits
      this.cleanupExpiredRateLimits();
      
      console.log('Security service initialized');
    } catch (error) {
      console.error('Failed to initialize security service:', error);
    }
  }

  /**
   * Check if token needs refresh
   */
  shouldRefreshToken(tokenInfo: TokenInfo): boolean {
    const now = Date.now();
    const thresholdMs = this.config.tokenRefreshThreshold * 60 * 1000;
    return (tokenInfo.expiresAt - now) <= thresholdMs;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    // If refresh is already in progress, return the existing promise
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.tokenRefreshPromise;
      return newToken;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  /**
   * Perform actual token refresh
   */
  private async performTokenRefresh(): Promise<string> {
    try {
      const tokenInfo = await this.getStoredTokenInfo();
      
      if (!tokenInfo || !tokenInfo.refreshToken) {
        throw new Error('No refresh token available');
      }

      // Make API call to refresh token
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: tokenInfo.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Store new tokens
      const newTokenInfo: TokenInfo = {
        token: data.accessToken,
        refreshToken: data.refreshToken || tokenInfo.refreshToken,
        expiresAt: Date.now() + (data.expiresIn * 1000),
        issuedAt: Date.now(),
      };

      await this.storeTokenInfo(newTokenInfo);
      
      console.log('Token refreshed successfully');
      return newTokenInfo.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear stored tokens on refresh failure
      await this.clearStoredTokens();
      
      throw error;
    }
  }

  /**
   * Check rate limit for a given endpoint
   */
  checkRateLimit(endpoint: string): RateLimitInfo {
    const key = endpoint;
    const now = Date.now();
    const windowMs = this.config.rateLimitWindow * 60 * 1000;
    
    let rateLimit = this.rateLimitMap.get(key);
    
    if (!rateLimit || now > rateLimit.resetTime) {
      // Create new rate limit window
      rateLimit = {
        count: 0,
        resetTime: now + windowMs,
      };
      this.rateLimitMap.set(key, rateLimit);
    }

    rateLimit.count++;
    
    const remaining = Math.max(0, this.config.rateLimitMaxRequests - rateLimit.count);
    const isLimited = remaining === 0;

    return {
      remaining,
      resetTime: rateLimit.resetTime,
      isLimited,
    };
  }

  /**
   * Wait for rate limit reset
   */
  async waitForRateLimitReset(endpoint: string): Promise<void> {
    const rateLimit = this.rateLimitMap.get(endpoint);
    
    if (rateLimit && rateLimit.resetTime > Date.now()) {
      const waitTime = rateLimit.resetTime - Date.now();
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Clean up expired rate limits
   */
  private cleanupExpiredRateLimits(): void {
    const now = Date.now();
    
    for (const [key, rateLimit] of this.rateLimitMap.entries()) {
      if (now > rateLimit.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data: string): string {
    if (!this.config.encryptionEnabled) {
      return data;
    }

    try {
      // Simple encryption for demonstration
      // In production, use proper encryption libraries
      const encoded = btoa(data);
      return encoded;
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    if (!this.config.encryptionEnabled) {
      return encryptedData;
    }

    try {
      // Simple decryption for demonstration
      // In production, use proper decryption libraries
      const decoded = atob(encryptedData);
      return decoded;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain special characters');
    }

    return {
      isValid: score >= 4,
      score,
      feedback,
    };
  }

  /**
   * Store token information securely
   */
  private async storeTokenInfo(tokenInfo: TokenInfo): Promise<void> {
    try {
      const encryptedToken = this.encrypt(tokenInfo.token);
      const encryptedRefreshToken = this.encrypt(tokenInfo.refreshToken);
      
      await StorageService.setToken(encryptedToken);
      // You might want to store refresh token separately with more security
      await StorageService.setUserData({
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: tokenInfo.expiresAt,
        tokenIssuedAt: tokenInfo.issuedAt,
      } as any);
    } catch (error) {
      console.error('Failed to store token info:', error);
    }
  }

  /**
   * Get stored token information
   */
  private async getStoredTokenInfo(): Promise<TokenInfo | null> {
    try {
      const encryptedToken = await StorageService.getToken();
      const userData = await StorageService.getUserData();
      
      if (!encryptedToken || !userData?.refreshToken) {
        return null;
      }

      const token = this.decrypt(encryptedToken);
      const refreshToken = this.decrypt(userData.refreshToken);
      
      return {
        token,
        refreshToken,
        expiresAt: userData.tokenExpiresAt || 0,
        issuedAt: userData.tokenIssuedAt || 0,
      };
    } catch (error) {
      console.error('Failed to get stored token info:', error);
      return null;
    }
  }

  /**
   * Load stored tokens on initialization
   */
  private async loadStoredTokens(): Promise<void> {
    try {
      const tokenInfo = await this.getStoredTokenInfo();
      
      if (tokenInfo && this.shouldRefreshToken(tokenInfo)) {
        // Token needs refresh, do it in background
        this.refreshToken().catch(console.error);
      }
    } catch (error) {
      console.error('Failed to load stored tokens:', error);
    }
  }

  /**
   * Clear stored tokens
   */
  private async clearStoredTokens(): Promise<void> {
    try {
      await StorageService.clearAuthData();
    } catch (error) {
      console.error('Failed to clear stored tokens:', error);
    }
  }

  /**
   * Validate JWT token
   */
  validateJWTToken(token: string): boolean {
    try {
      // Simple JWT validation (check structure)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Decode payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('JWT validation failed:', error);
      return false;
    }
  }

  /**
   * Get current token
   */
  async getCurrentToken(): Promise<string | null> {
    try {
      const tokenInfo = await this.getStoredTokenInfo();
      
      if (!tokenInfo) {
        return null;
      }

      // Check if token needs refresh
      if (this.shouldRefreshToken(tokenInfo)) {
        return this.refreshToken();
      }

      return tokenInfo.token;
    } catch (error) {
      console.error('Failed to get current token:', error);
      return null;
    }
  }

  /**
   * Logout and clear security data
   */
  async logout(): Promise<void> {
    try {
      await this.clearStoredTokens();
      this.rateLimitMap.clear();
      console.log('Security data cleared on logout');
    } catch (error) {
      console.error('Failed to clear security data:', error);
    }
  }

  /**
   * Get security configuration
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * Update security configuration
   */
  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

export const securityService = SecurityService.getInstance();
export default securityService;
