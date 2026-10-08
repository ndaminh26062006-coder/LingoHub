import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useDeviceId, getDeviceIdSync } from '../hooks/useDeviceId';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';

export const FreemiumContext = createContext();

/**
 * FreemiumProvider - Manages freemium access state and subscription info
 * 
 * Provides:
 * - canAccess(feature) - Check if user can access feature
 * - getAccessMessage() - Get human-readable message
 * - pricing - Available pricing tiers
 * - pricingModal - Show/hide pricing modal
 * - currentFeature - Last feature checked
 * - usageStats - Usage stats for all features
 * - subscription - User's active subscription (if any)
 * 
 * Usage:
 * ```jsx
 * <FreemiumProvider>
 *   <App />
 * </FreemiumProvider>
 * 
 * // In component:
 * const { canAccess, setPricingModal } = useContext(FreemiumContext);
 * ```
 */
export function FreemiumProvider({ children }) {
  const { deviceId, loading: deviceLoading } = useDeviceId();
  
  // State
  const [canAccessCurrently, setCanAccessCurrently] = useState(null);
  const [accessMessage, setAccessMessage] = useState('');
  const [pricing, setPricing] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [pricingModal, setPricingModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load pricing on mount
  useEffect(() => {
    loadPricing();
  }, []);

  // Load subscription info on mount (if authenticated)
  useEffect(() => {
    loadSubscription();
  }, []);

  /**
   * Load pricing tiers from backend
   */
  const loadPricing = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/freemium/pricing');
      setPricing(response.data);
    } catch (err) {
      console.error('Failed to load pricing:', err);
      setError('Failed to load pricing information');
    }
  }, []);

  /**
   * Load user's subscription info (if logged in)
   */
  const loadSubscription = useCallback(async () => {
    const token = localStorage.getItem('lh_token');
    if (!token) {
      setSubscription(null);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/subscriptions/me', {
        headers: { 'Authorization': `Bearer ${token}` },
        validateStatus: () => true // Don't throw on any status code
      });
      
      if (response.status === 200 && response.data.has_subscription) {
        setSubscription(response.data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      // Catch any other errors (network issues, etc.)
      setSubscription(null);
    }
  }, []);

  /**
   * Check access for a feature
   * Returns: { can_access, reason, message, remaining_uses, pricing?, subscription? }
   */
  const checkAccess = useCallback(async (feature) => {
    if (deviceLoading || !deviceId) {
      setError('Device ID not ready');
      return { can_access: false, reason: 'device_not_ready' };
    }

    setLoading(true);
    setCurrentFeature(feature);

    try {
      const token = localStorage.getItem('lh_token');
      console.log('🔍 checkAccess:', { feature, hasToken: !!token, subscription });
      
      const response = await axios.post('http://localhost:8000/api/freemium/check-access', {
        feature,
        device_id: deviceId,
      }, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        validateStatus: (status) => status < 500 // Don't treat any status as error unless it's 5xx
      });

      console.log('✅ checkAccess response:', { status: response.status, data: response.data });

      // Handle 403 (paywall) - no error thrown, just check response status
      if (response.status === 403) {
        setCanAccessCurrently(false);
        setAccessMessage(response.data.message || 'Access denied');
        setPricingModal(true);
        
        if (response.data.pricing && Array.isArray(response.data.pricing)) {
          setPricing(response.data.pricing);
        }

        setError(null);
        return {
          can_access: false,
          reason: 'limit_exceeded',
          message: response.data.message || 'You have used all free attempts',
          ...response.data,
        };
      }

      // Success (200)
      console.log('✅ checkAccess success:', {
        can_access: response.data.can_access,
        reason: response.data.reason,
        message: response.data.message,
      });

      setCanAccessCurrently(response.data.can_access);
      setAccessMessage(response.data.message || '');
      loadUsageStats();
      setError(null);
      return response.data;
    } catch (err) {
      console.error('❌ checkAccess unexpected error:', err.message);
      setCanAccessCurrently(false);
      setAccessMessage('An error occurred');
      setError(err.message);
      return {
        can_access: false,
        reason: 'error',
        message: 'An error occurred',
      };
    } finally {
      setLoading(false);
    }
  }, [deviceId, deviceLoading, subscription]);

  /**
   * Load usage stats for current device
   */
  const loadUsageStats = useCallback(async () => {
    if (!deviceId) return;

    try {
      const response = await axios.post('http://localhost:8000/api/freemium/usage-stats', {
        device_id: deviceId,
      });
      setUsageStats(response.data.stats);
    } catch (err) {
      console.error('Failed to load usage stats:', err);
    }
  }, [deviceId]);

  /**
   * Reset usage stats (for testing/admin only)
   */
  const resetUsageStats = useCallback(async () => {
    if (!deviceId) return;

    try {
      const token = localStorage.getItem('lh_token');
      await axios.delete(`http://localhost:8000/api/admin/freemium/reset/${deviceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsageStats(null);
      await loadUsageStats();
      return true;
    } catch (err) {
      console.error('Failed to reset usage:', err);
      return false;
    }
  }, [deviceId]);

  /**
   * Get human-readable access status message
   */
  const getAccessMessage = useCallback(() => {
    if (!canAccessCurrently) {
      return accessMessage || 'Access denied. Please subscribe to continue.';
    }
    return accessMessage || 'Access granted';
  }, [canAccessCurrently, accessMessage]);

  /**
   * Get remaining uses for a feature
   */
  const getRemainingUses = useCallback((feature) => {
    if (!usageStats || !usageStats[feature]) {
      return 2; // Default limit
    }
    return usageStats[feature].remaining;
  }, [usageStats]);

  /**
   * Check if a feature is exceeded
   */
  const isFeatureExceeded = useCallback((feature) => {
    if (!usageStats || !usageStats[feature]) {
      return false;
    }
    return usageStats[feature].is_exceeded;
  }, [usageStats]);

  /**
   * Check if user has active subscription
   */
  const hasActiveSubscription = useCallback(() => {
    return subscription && subscription.can_access_all;
  }, [subscription]);

  /**
   * Check if user can access specific subject
   */
  const canAccessSubject = useCallback(async (subjectId) => {
    try {
      const token = localStorage.getItem('lh_token');
      const response = await axios.post('http://localhost:8000/api/subscriptions/check-subject', {
        subject_id: subjectId,
      }, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      return response.data.has_access;
    } catch (err) {
      console.error('Failed to check subject access:', err);
      return false;
    }
  }, []);

  const value = {
    // State
    deviceId,
    canAccessCurrently,
    accessMessage,
    pricing,
    usageStats,
    subscription,
    pricingModal,
    setPricingModal,
    currentFeature,
    loading,
    error,

    // Methods
    checkAccess,
    loadUsageStats,
    resetUsageStats,
    getAccessMessage,
    getRemainingUses,
    isFeatureExceeded,
    hasActiveSubscription,
    canAccessSubject,
    loadSubscription,
    loadPricing,
  };

  console.log('🔍 FreemiumContext value updated:', { pricingModal, setPricingModal });

  return (
    <FreemiumContext.Provider value={value}>
      <PaymentModal 
        isOpen={pricingModal}
        onClose={() => setPricingModal(false)}
        onSuccess={() => {
          setPricingModal(false);
          // Reload subscription after successful payment
          loadSubscription();
        }}
      />
      {children}
    </FreemiumContext.Provider>
  );
}

export default FreemiumProvider;
