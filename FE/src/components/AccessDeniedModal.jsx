import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './AccessDeniedModal.css';

export default function AccessDeniedModal({ isOpen, onClose, title = 'Không có quyền truy cập' }) {
  useEffect(() => {
    if (isOpen) {
      // Prevent scroll when modal is open
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = scrollbarWidth + 'px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <div className="access-denied-overlay" onClick={onClose}>
      <div className="access-denied-modal" onClick={(e) => e.stopPropagation()}>
        <div className="access-denied-header">
          <span className="access-denied-icon">🔒</span>
          <h2 className="access-denied-title">{title}</h2>
        </div>

        <div className="access-denied-body">
          <p className="access-denied-message">
            Bạn không có quyền truy cập vào môn học này.
          </p>
          <p className="access-denied-suggestion">
            Vui lòng nâng cấp tài khoản để truy cập tất cả các môn học.
          </p>
        </div>

        <div className="access-denied-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Nâng cấp ngay
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
