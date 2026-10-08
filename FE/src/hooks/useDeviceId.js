import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const DEVICE_ID_STORAGE_KEY = 'lingohub_device_id';
const DEVICE_ID_EXPIRY_KEY = 'lingohub_device_id_expiry';
const DEVICE_ID_EXPIRY_DAYS = 365; // Persist for 1 year

/**
 * Hook to get or generate device ID for freemium tracking
 * 
 * Device ID is generated once per browser using FingerprintJS
 * and stored in localStorage for consistent tracking across sessions
 * 
 * Usage:
 * ```jsx
 * const { deviceId, loading, error } = useDeviceId();
 * 
 * if (loading) return <p>Initializing...</p>;
 * if (error) return <p>Error: {error}</p>;
 * 
 * return <p>Your device ID: {deviceId}</p>;
 * ```
 * 
 * @returns {Object} { deviceId: string | null, loading: boolean, error: string | null }
 */
export function useDeviceId() {
  const [deviceId, setDeviceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDeviceId = async () => {
      try {
        // Check if device ID exists in localStorage
        const storedDeviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
        const storageExpiry = localStorage.getItem(DEVICE_ID_EXPIRY_KEY);
        
        // If device ID exists and hasn't expired, use it
        if (storedDeviceId && storageExpiry && new Date(storageExpiry) > new Date()) {
          setDeviceId(storedDeviceId);
          setLoading(false);
          return;
        }

        // Generate new device ID using FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const generatedId = result.visitorId;

        // Store device ID and expiry in localStorage
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + DEVICE_ID_EXPIRY_DAYS);
        
        localStorage.setItem(DEVICE_ID_STORAGE_KEY, generatedId);
        localStorage.setItem(DEVICE_ID_EXPIRY_KEY, expiryDate.toISOString());

        setDeviceId(generatedId);
        setLoading(false);
      } catch (err) {
        console.error('Failed to generate device ID:', err);
        
        // Fallback: generate a simple ID if FingerprintJS fails
        const fallbackId = generateFallbackId();
        localStorage.setItem(DEVICE_ID_STORAGE_KEY, fallbackId);
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + DEVICE_ID_EXPIRY_DAYS);
        localStorage.setItem(DEVICE_ID_EXPIRY_KEY, expiryDate.toISOString());
        
        setDeviceId(fallbackId);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeDeviceId();
  }, []);

  return { deviceId, loading, error };
}

/**
 * Get device ID synchronously (must be called after initialization)
 * 
 * Usage:
 * ```jsx
 * const { deviceId } = useDeviceId();
 * const storedId = getDeviceIdSync(); // Will be same as deviceId
 * ```
 */
export function getDeviceIdSync() {
  return localStorage.getItem(DEVICE_ID_STORAGE_KEY);
}

/**
 * Generate fallback device ID if FingerprintJS fails
 * Uses browser info + timestamp to create a pseudo-unique ID
 */
function generateFallbackId() {
  const navigator_ = typeof navigator !== 'undefined' ? navigator : {};
  const userAgent = navigator_.userAgent || 'unknown';
  const language = navigator_.language || 'unknown';
  const platform = navigator_.platform || 'unknown';
  const screenResolution = `${typeof window !== 'undefined' ? window.innerWidth : 0}x${typeof window !== 'undefined' ? window.innerHeight : 0}`;
  
  // Create a simple hash from browser info
  const browserInfo = `${userAgent}|${language}|${platform}|${screenResolution}`;
  const hash = simpleHash(browserInfo);
  
  // Combine with timestamp for uniqueness
  const timestamp = Date.now().toString(36);
  
  return `fallback_${hash}_${timestamp}`;
}

/**
 * Simple hash function for fallback ID generation
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export default useDeviceId;
