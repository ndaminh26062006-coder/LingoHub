import { useState, useEffect, useContext } from 'react';
import { subjectApi, paymentApi, subscriptionApi } from '../services/api';
import { FreemiumContext } from '../contexts/FreemiumContext';
import '../styles/PaymentModal.css';

export default function PaymentModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('plan'); // plan, checkout, waiting, done, selectSubjects
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [referenceCode, setReferenceCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { subscription } = useContext(FreemiumContext);

  const plans = [
    {
      id: '1subject',
      label: '1 Môn Lẻ',
      price: 19,
      unit: 'K VND',
      badge: null,
      popular: false,
      duration: 'Vĩnh viễn',
      features: [
        'Vĩnh viễn',
        '1 môn học',
        'Tài liệu trắc nghiệm không giới hạn',
        'Đề thi thử không giới hạn',
        'Câu hỏi tự luận không giới hạn',
        'Xem Flashcard không giới hạn',
      ],
    },
    {
      id: '3subject',
      label: '3 Môn Lẻ',
      price: 39,
      unit: 'K VND',
      badge: null,
      popular: true,
      duration: 'Vĩnh viễn',
      features: [
        'Vĩnh viễn',
        '3 môn học',
        'Tài liệu trắc nghiệm không giới hạn',
        'Đề thi thử không giới hạn',
        'Câu hỏi tự luận không giới hạn',
        'Xem Flashcard không giới hạn',
      ],
    },
    {
      id: '5subject',
      label: '5 Môn Lẻ',
      price: 49,
      unit: 'K VND',
      badge: null,
      popular: false,
      duration: 'Vĩnh viễn',
      features: [
        'Vĩnh viễn',
        '5 môn học',
        'Tài liệu trắc nghiệm không giới hạn',
        'Đề thi thử không giới hạn',
        'Câu hỏi tự luận không giới hạn',
        'Xem Flashcard không giới hạn',
      ],
    },
    {
      id: 'full',
      label: 'Full Access',
      price: 69,
      unit: 'K VND',
      badge: '⭐ Được yêu thích nhất',
      popular: true,
      duration: 'Vĩnh viễn',
      features: [
        'Vĩnh viễn',
        'Tất cả',
        'Tài liệu trắc nghiệm không giới hạn',
        'Đề thi thử không giới hạn',
        'Câu hỏi tự luận không giới hạn',
        'Xem Flashcard không giới hạn',
      ],
    },
  ];

  const token = localStorage.getItem('lh_token');

  // Khi modal mở, check nếu user subjects rỗng lần đầu (emergency case)
  // Nếu subjects có giá trị (normal case) → hiển thị "Chọn gói" không skip
  useEffect(() => {
    if (isOpen && step === 'plan') {
      if (subscription && subscription.plan) {
        // Check if user has already completed emergency subject selection
        const hasCompletedEmergency = localStorage.getItem('payment_emergency_subjects_done');
        
        // Case 1: Subjects rỗng + chưa làm emergency flow → skip tới chọn môn
        if ((!subscription.subjects || subscription.subjects.length === 0) && !hasCompletedEmergency) {
          setSelectedPlan(subscription.plan);
          setStep('selectSubjects');
          setSelectedSubjects([]);
        }
        // Case 2 & 3: Subjects có giá trị OR đã từng làm emergency → stay at "Chọn gói"
      }
    }
  }, [isOpen, subscription, step]);

  // Load subjects when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    setLoadingSubjects(true);
    subjectApi.list()
      .then(res => {
        const subjects = res.data.data || res.data || [];
        setAllSubjects(Array.isArray(subjects) ? subjects : []);
      })
      .catch(err => {
        // Silently fail - subjects are optional for payment
        setAllSubjects([]);
      })
      .finally(() => setLoadingSubjects(false));
  }, [isOpen]);

  // Move to subject selection step (after plan is selected)
  const handleContinueToSubjects = () => {
    if (!selectedPlan) {
      setError('Vui lòng chọn gói dịch vụ');
      return;
    }

    setError('');
    
    // For full plan, go directly to payment (no subjects needed)
    if (selectedPlan === 'full') {
      handleRequestPayment();
    } else {
      // For other plans, show subject selection first
      setStep('selectSubjects');
      setSelectedSubjects([]);
    }
  };

  // Request payment QR (only called after subjects are selected)
  const handleRequestPayment = async () => {
    // Validate subjects selection (only for non-full plans)
    if (selectedPlan !== 'full' && selectedSubjects.length === 0) {
      setError('Vui lòng chọn ít nhất một môn học');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send subjects WITH payment request
      const response = await paymentApi.create({ 
        plan: selectedPlan,
        subjects: selectedSubjects  // ← SEND SUBJECTS!
      });

      if (response.data.success) {
        setQrUrl(response.data.checkout_url);
        setTransactionId(response.data.transaction_id);
        setReferenceCode(response.data.reference_code);
        
        // Get plan name for display
        const selectedPlanObj = plans.find(p => p.id === selectedPlan);
        const planName = selectedPlanObj ? selectedPlanObj.label : selectedPlan;
        
        setPaymentInfo({
          amount: response.data.amount,
          plan: planName,
          bankAccount: response.data.bank_account,
          accountName: response.data.account_name,
          referenceCode: response.data.reference_code,
          description: response.data.description,
        });
        setStep('checkout');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status
  const pollPaymentStatus = (refCode) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await paymentApi.getStatus(refCode);

        if (response.data.status === 'success') {
          clearInterval(pollInterval);
          setStep('done');
          setTimeout(() => {
            handleClose();
            if (onSuccess) onSuccess();
            window.location.reload();
          }, 1500);
        }
      } catch (err) {
        console.error('Status check error:', err);
      }
    }, 3000); // Check every 3 seconds

    // Stop after 15 minutes
    setTimeout(() => clearInterval(pollInterval), 900000);
  };

  // Handle "I've transferred" button click - start polling
  const handleTransferComplete = () => {
    setStep('waiting');
    if (referenceCode) {
      pollPaymentStatus(referenceCode);
    }
  };

  const handleManualCheck = async () => {
    if (!referenceCode) return;

    setCheckingStatus(true);
    try {
      const response = await paymentApi.getStatus(referenceCode);

      if (response.data.status === 'success') {
        setStep('done');
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError('Lỗi khi kiểm tra trạng thái thanh toán');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubjectToggle = (subjectId) => {
    const planSubjectLimits = {
      '1subject': 1,
      '3subject': 3,
      '5subject': 5,
      'full': 999,
    };
    
    // Check if subject is already in current subscription (should not toggle)
    const currentSubjects = subscription?.subjects || [];
    if (currentSubjects.includes(subjectId)) {
      return; // Disable - already selected in current subscription
    }
    
    const limit = planSubjectLimits[selectedPlan] || 1;

    let newSelected;
    if (selectedSubjects.includes(subjectId)) {
      newSelected = selectedSubjects.filter(s => s !== subjectId);
    } else if (selectedSubjects.length < limit) {
      newSelected = [...selectedSubjects, subjectId];
    } else {
      return;
    }

    setSelectedSubjects(newSelected);
    // Lưu vào localStorage
    localStorage.setItem('payment_selected_subjects', JSON.stringify(newSelected));
  };

  const handleFinishSubjectSelection = async () => {
    if (selectedSubjects.length === 0) {
      setError('Vui lòng chọn ít nhất một môn học');
      return;
    }

    setLoading(true);
    try {
      // Update subscription with selected subjects
      try {
        await subscriptionApi.updateSubjects(selectedSubjects);
      } catch (updateErr) {
        // If 404, route might not exist or cache issue - continue anyway
        if (updateErr.response?.status === 404) {
          console.warn('⚠️ updateSubjects endpoint 404 - skipping subject update');
        } else {
          throw updateErr;
        }
      }

      // Mark emergency flow as completed
      localStorage.setItem('payment_emergency_subjects_done', 'true');

      // After success → reset to plan step
      setStep('plan');
      setSelectedPlan(null);
      setSelectedSubjects([]);
      localStorage.removeItem('payment_selected_subjects');
      
      // Call onSuccess to trigger subscription reload in FreemiumContext
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi lưu lựa chọn môn học');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset all state to initial values
    setStep('plan');
    setSelectedPlan(null);
    setSelectedSubjects([]);
    setQrUrl(null);
    setTransactionId(null);
    setReferenceCode(null);
    setError('');
    setPaymentInfo(null);
    // Xoá localStorage khi đóng modal
    localStorage.removeItem('payment_selected_subjects');
    onClose();
  };

  /**
   * Open modal directly to subject selection step
   * Used for users to re-select subjects after payment
   */
  const openForSubjectSelection = (planId) => {
    setSelectedPlan(planId);
    setStep('selectSubjects');
    // Restore from localStorage if available
    const saved = localStorage.getItem('payment_selected_subjects');
    if (saved) {
      try {
        setSelectedSubjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to restore selected subjects:', e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={handleClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="payment-modal__header">
          <h2 className="payment-modal__title">Nâng cấp tài khoản</h2>
          <button className="payment-modal__close" onClick={handleClose}>✕</button>
        </div>

        {/* Subtitle for plan step */}
        {step === 'plan' && (
          <div className="payment-modal__subtitle">
            Chọn gói dịch vụ phù hợp với bạn
          </div>
        )}

        {/* Body */}
        <div className="payment-modal__body">
          {/* Step 1: Select Plan */}
          {step === 'plan' && (
            <div className="payment-step">
              <div className="payment-plans-grid">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`payment-plan-card ${selectedPlan === plan.id ? 'payment-plan-card--selected' : ''} ${plan.popular ? 'payment-plan-card--popular' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.badge && <div className="payment-plan-badge">{plan.badge}</div>}
                    
                    <div className="payment-plan-label">{plan.label}</div>
                    
                    <div className="payment-plan-price">
                      <span className="payment-plan-price-value">{plan.price}</span>
                      <span className="payment-plan-price-unit">{plan.unit}</span>
                    </div>
                    
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {plan.duration}
                    </div>
                    
                    <div className="payment-plan-features">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="payment-plan-feature">
                          <span className="payment-plan-feature-icon">✓</span>
                          <span className="payment-plan-feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="payment-plan-button">
                      {selectedPlan === plan.id ? 'Đã chọn' : 'Chọn gói'}
                    </button>
                  </div>
                ))}
              </div>

              {error && <div className="payment-error">{error}</div>}
            </div>
          )}

          {/* Step 2: Checkout with QR Code or Link */}
          {step === 'checkout' && paymentInfo && (
            <div className="payment-step">
              <div className="payment-checkout">
                {/* QR Code */}
                <div className="payment-qr-section" style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <h3 className="payment-section-title">Quét mã QR để thanh toán</h3>
                  {qrUrl ? (
                    <>
                      <img 
                        src={qrUrl} 
                        alt="QR Code" 
                        className="payment-qr-code" 
                        style={{
                          maxWidth: '220px',
                          margin: '0 auto',
                          display: 'block',
                          borderRadius: '8px',
                          border: '2px solid var(--orange)',
                          backgroundColor: 'white',
                          padding: '8px'
                        }} 
                      />
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                        Quét mã này bằng app ngân hàng của bạn
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        Tất cả thông tin sẽ tự động điền: số tiền, nội dung, tài khoản nhận
                      </p>
                    </>
                  ) : (
                    <div style={{
                      padding: '40px 20px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      color: '#999'
                    }}>
                      Đang tạo mã QR...
                    </div>
                  )}
                </div>

                {/* Payment Info Display */}
                <div className="payment-info-section">
                  <h3 className="payment-section-title">Thông tin thanh toán</h3>
                  
                  <div className="payment-info-item">
                    <span className="payment-info-label">Ngân hàng:</span>
                    <span className="payment-info-value">MB Bank</span>
                  </div>
                  
                  <div className="payment-info-item">
                    <span className="payment-info-label">Số tài khoản:</span>
                    <span className="payment-info-value font-mono">{paymentInfo.bankAccount}</span>
                  </div>
                  
                  <div className="payment-info-item">
                    <span className="payment-info-label">Chủ tài khoản:</span>
                    <span className="payment-info-value">{paymentInfo.accountName}</span>
                  </div>
                  
                  <div className="payment-info-item">
                    <span className="payment-info-label">Số tiền:</span>
                    <span className="payment-info-value font-bold">
                      {paymentInfo.amount.toLocaleString()} đ
                    </span>
                  </div>
                  
                  <div className="payment-info-item">
                    <span className="payment-info-label">Nội dung chuyển:</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="payment-info-value text-small font-mono" style={{ flex: 1, wordBreak: 'break-all' }}>
                        {paymentInfo.referenceCode}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(paymentInfo.referenceCode);
                          alert('Đã sao chép nội dung chuyển!');
                        }}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          background: 'var(--orange)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="payment-instructions">
                  <p>Quét mã QR bằng app ngân hàng của bạn</p>
                  <p>Tất cả thông tin (số tiền, nội dung) sẽ tự động điền</p>
                  <p>Bấm xác nhận để chuyển khoản</p>
                  <p>Hệ thống sẽ tự cập nhật trong vòng 1-2 phút</p>
                </div>

                {error && <div className="payment-error">{error}</div>}
              </div>
            </div>
          )}

          {/* Step 3: Waiting for Payment */}
          {step === 'waiting' && (
            <div className="payment-step payment-waiting">
              <div className="payment-spinner"></div>
              <h3>Đang chờ xác nhận thanh toán...</h3>
              <p>Hệ thống sẽ tự động cập nhật khi nhận được tiền</p>
              <button 
                className="btn btn-primary" 
                onClick={handleManualCheck}
                disabled={checkingStatus}
              >
                {checkingStatus ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'done' && (
            <div className="payment-step payment-done">
              <div className="payment-success-icon"></div>
              <h3>Thanh toán thành công!</h3>
              <p>Tài khoản của bạn đã được nâng cấp</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                Đang đóng cửa sổ...
              </p>
            </div>
          )}

          {/* Step 2: Select Subjects (before checkout) */}
          {step === 'selectSubjects' && (
            <div className="payment-step">
              <h3 className="payment-section-title" style={{ marginBottom: '8px' }}>Chọn môn học</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Chọn {selectedPlan === '1subject' ? '1 môn' : selectedPlan === '3subject' ? 'tối đa 3 môn' : selectedPlan === '5subject' ? 'tối đa 5 môn' : 'các môn'} để bắt đầu học
              </p>

              {loadingSubjects ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải danh sách môn học...</p>
              ) : allSubjects.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Không có môn học nào</p>
              ) : (
                <div className="payment-subjects-grid">
                  {allSubjects.map(subject => {
                    const currentSubjects = subscription?.subjects || [];
                    const isAlreadySelected = currentSubjects.includes(subject.id);
                    const isNewlySelected = selectedSubjects.includes(subject.id);
                    const planLimits = {
                      '1subject': 1,
                      '3subject': 3,
                      '5subject': 5,
                      'full': 999,
                    };
                    const limit = planLimits[selectedPlan] || 1;
                    const isFull = selectedSubjects.length >= limit;
                    const isDisabled = isAlreadySelected || (isFull && !isNewlySelected);
                    
                    return (
                      <label key={subject.id} className={`payment-subject-item ${isDisabled ? 'payment-subject-item--disabled' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isNewlySelected}
                          onChange={() => handleSubjectToggle(subject.id)}
                          disabled={isDisabled}
                        />
                        <span className="payment-subject-name">
                          {subject.name}
                          {isAlreadySelected && <span className="payment-subject-badge">Đã có</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {error && <div className="payment-error" style={{ marginTop: '12px' }}>{error}</div>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="payment-modal__footer">
          {step === 'plan' && (
            <>
              <button className="btn btn-outline" onClick={handleClose}>Hủy</button>
              <button 
                className="btn btn-primary" 
                onClick={handleContinueToSubjects}
                disabled={loading || !selectedPlan}
              >
                {loading ? 'Đang tải...' : 'Tiếp tục'}
              </button>
            </>
          )}
          
          {step === 'checkout' && (
            <>
              <button className="btn btn-outline" onClick={handleClose}>Đóng</button>
              <button 
                className="btn btn-primary"
                onClick={handleTransferComplete}
              >
                Tôi đã chuyển khoản →
              </button>
            </>
          )}

          {step === 'waiting' && (
            <button className="btn btn-outline" onClick={handleClose}>Đóng cửa sổ</button>
          )}

          {step === 'done' && (
            <button className="btn btn-primary" onClick={handleClose}>Xong</button>
          )}

          {step === 'selectSubjects' && (
            <>
              <button className="btn btn-outline" onClick={() => setStep('plan')}>← Quay lại</button>
              <button 
                className="btn btn-primary" 
                onClick={handleRequestPayment}
                disabled={loading || (selectedPlan !== 'full' && selectedSubjects.length === 0)}
              >
                {loading ? 'Đang tạo...' : 'Thanh toán'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
