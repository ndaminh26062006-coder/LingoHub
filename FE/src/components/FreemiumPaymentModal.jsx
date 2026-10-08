import { useFreemium } from '../hooks/useFreemium';
import PaymentModal from './PaymentModal';

/**
 * FreemiumPaymentModal - Wraps PaymentModal with FreemiumContext
 * Automatically shows when user hits freemium limit
 */
export default function FreemiumPaymentModal() {
  const { pricingModal, setPricingModal } = useFreemium();

  const handleClose = () => {
    setPricingModal(false);
  };

  const handleSuccess = () => {
    setPricingModal(false);
    // Optionally refresh user data or trigger UI update
    window.location.reload();
  };

  return (
    <PaymentModal
      isOpen={pricingModal}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
}
