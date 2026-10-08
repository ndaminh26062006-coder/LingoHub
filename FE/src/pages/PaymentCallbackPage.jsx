import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFreemium from '../hooks/useFreemium';
import './PaymentCallbackPage.css';

/**
 * PaymentCallbackPage - Handles Sepay payment redirect
 * 
 * After user completes payment on Sepay, they are redirected back to:
 * /payment/callback?reference_code=LINGOHUB_1_ABC_123&status=success
 * 
 * This page:
 * 1. Verifies payment status with backend
 * 2. Shows success/failed/pending message
 * 3. Auto-redirects to previous page or home
 */
export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadSubscription } = useFreemium();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing your payment...');
  const [details, setDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const referenceCode = searchParams.get('reference_code');
        const urlStatus = searchParams.get('status');

        if (!referenceCode) {
          setStatus('error');
          setMessage('Invalid payment reference');
          return;
        }

        // Verify payment status with backend
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/payments/sepay/status/${referenceCode}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('lh_token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const payment = await response.json();

        if (payment.status === 'success') {
          setStatus('success');
          setMessage('🎉 Payment successful! Your subscription is now active.');
          setDetails({
            plan: payment.plan,
            amount: payment.amount,
            date: new Date(payment.updated_at).toLocaleDateString('vi-VN'),
          });

          // Reload subscription info
          await loadSubscription();
        } else if (payment.status === 'pending') {
          setStatus('pending');
          setMessage('Payment is pending. Please wait...');
          setDetails({ reference_code: referenceCode });
        } else if (payment.status === 'failed') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
          setDetails({ reference_code: referenceCode });
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('An error occurred while verifying your payment');
      }
    };

    verifyPayment();
  }, [searchParams, loadSubscription]);

  // Auto-redirect after countdown
  useEffect(() => {
    if (status === 'error' || status === 'loading') {
      return;
    }

    let countdown_value = 5;
    const interval = setInterval(() => {
      countdown_value--;
      setCountdown(countdown_value);
      
      if (countdown_value <= 0) {
        clearInterval(interval);
        // Redirect based on status
        if (status === 'success') {
          navigate('/on-tap', { replace: true });
        } else if (status === 'failed' || status === 'pending') {
          navigate('/', { replace: true });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, navigate]);

  return (
    <div className="payment-callback-page">
      <div className="container payment-callback-container">
        <div className={`payment-callback-card ${status}`}>
          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="callback-icon success-icon">✓</div>
              <h1 className="callback-title">Thanh toán thành công</h1>
              <p className="callback-message">{message}</p>

              {details && (
                <div className="callback-details">
                  <div className="detail-row">
                    <span className="detail-label">Gói:</span>
                    <span className="detail-value">{details.plan}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Số tiền:</span>
                    <span className="detail-value">{(details.amount / 1000).toLocaleString('vi-VN')}K đ</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ngày thanh toán:</span>
                    <span className="detail-value">{details.date}</span>
                  </div>
                </div>
              )}

              <div className="callback-actions">
                <button className="btn btn-primary" onClick={() => navigate('/on-tap')}>
                  Bắt đầu học ngay
                </button>
              </div>

              <p className="callback-redirect">
                Tự động quay về trang chính trong <strong>{countdown}s</strong>
              </p>
            </>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <>
              <div className="callback-icon failed-icon">✕</div>
              <h1 className="callback-title">Thanh toán thất bại</h1>
              <p className="callback-message">{message}</p>

              {details && (
                <div className="callback-details">
                  <div className="detail-row">
                    <span className="detail-label">Reference:</span>
                    <span className="detail-value">{details.reference_code}</span>
                  </div>
                </div>
              )}

              <div className="callback-actions">
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  Thử lại
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/profile')}>
                  Xem lịch sử thanh toán
                </button>
              </div>

              <p className="callback-redirect">
                Quay về trang chủ trong <strong>{countdown}s</strong>
              </p>
            </>
          )}

          {/* Pending State */}
          {status === 'pending' && (
            <>
              <div className="callback-icon pending-icon"></div>
              <h1 className="callback-title">Thanh toán chờ xử lý</h1>
              <p className="callback-message">{message}</p>

              {details && (
                <div className="callback-details">
                  <div className="detail-row">
                    <span className="detail-label">Reference:</span>
                    <span className="detail-value">{details.reference_code}</span>
                  </div>
                </div>
              )}

              <div className="callback-actions">
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  Kiểm tra lại
                </button>
              </div>

              <p className="callback-redirect">
                Quay về trang chủ trong <strong>{countdown}s</strong>
              </p>
            </>
          )}

          {/* Loading/Error State */}
          {(status === 'loading' || status === 'error') && (
            <>
              <div className="callback-icon loading-icon">
                {status === 'loading' ? '' : ''}
              </div>
              <h1 className="callback-title">
                {status === 'loading' ? 'Đang xử lý...' : 'Lỗi'}
              </h1>
              <p className="callback-message">{message}</p>

              {status === 'error' && (
                <div className="callback-actions">
                  <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Về trang chủ
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Help Info */}
        <div className="callback-help">
          <h4>Cần trợ giúp?</h4>
          <ul>
            <li>Nếu thanh toán không hoàn tất, hãy liên hệ <a href="mailto:support@lingohub.com">support@lingohub.com</a></li>
            <li>Kiểm tra email để nhận xác nhận thanh toán</li>
            <li>Đợi vài giây để hệ thống xử lý, không làm mới trang</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
