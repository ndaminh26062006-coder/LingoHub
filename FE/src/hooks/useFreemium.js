import { useContext } from 'react';
import { FreemiumContext } from '../contexts/FreemiumContext';

/**
 * Hook to access freemium context
 * 
 * Must be used inside FreemiumProvider
 * 
 * Usage:
 * ```jsx
 * const { checkAccess, pricingModal, pricing } = useFreemium();
 * 
 * // Check access to a feature
 * const handleEssayClick = async () => {
 *   const result = await checkAccess('essay');
 *   if (result.can_access) {
 *     // Proceed with feature
 *   } else {
 *     // Pricing modal shows automatically
 *   }
 * };
 * ```
 */
export function useFreemium() {
  const context = useContext(FreemiumContext);

  if (!context) {
    throw new Error('useFreemium must be used inside FreemiumProvider');
  }

  // Debug: Log whenever context values change
  if (typeof window !== 'undefined' && window.__freemium_debug) {
    console.log('useFreemium context:', {
      pricingModal: context.pricingModal,
      pricingLength: context.pricing?.length,
      hasPricing: !!context.pricing,
    });
  }

  return context;
}

export default useFreemium;
