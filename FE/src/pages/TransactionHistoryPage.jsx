import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/api';
import PageHeader from '../components/PageHeader';
import './TransactionHistoryPage.css';

export default function TransactionHistoryPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getHistory();
      setTransactions(res.data.transactions || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Đang xử lý', class: 'status-pending' },
      success: { label: 'Thành công', class: 'status-success' },
      failed: { label: 'Thất bại', class: 'status-failed' },
      cancelled: { label: 'Đã hủy', class: 'status-cancelled' },
    };
    return statusMap[status] || { label: status, class: 'status-unknown' };
  };

  const getPlanDisplay = (plan) => {
    const planMap = {
      '1subject': '1 Môn học',
      '3subject': '3 Môn học',
      '5subject': '5 Môn học',
      'full': 'Toàn bộ môn học',
    };
    return planMap[plan] || plan;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="transaction-page page-enter">
        <PageHeader
          title="Lịch sử giao dịch"
          subtitle="Theo dõi các giao dịch thanh toán của bạn"
          icon=""
        />
        <div className="transaction-body">
          <div className="container" style={{ textAlign: 'center', padding: '40px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-page page-enter">
      <PageHeader
        title="Lịch sử giao dịch"
        subtitle="Theo dõi các giao dịch thanh toán của bạn"
        icon=""
      />

      <div className="transaction-body">
        <div className="container" style={{ flex: 1 }}>
          {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="transaction-empty">
            <span></span>
            <h3>Chưa có giao dịch nào</h3>
            <p>Bạn chưa có lịch sử giao dịch. Hãy nâng cấp gói dịch vụ để bắt đầu.</p>
            <a href="/pricing" className="btn btn-primary">
              Xem gói dịch vụ
            </a>
          </div>
        ) : (
          <div className="transaction-list">
            <div className="transaction-header">
              <div className="th-cell th-ref">Mã giao dịch</div>
              <div className="th-cell th-plan">Gói dịch vụ</div>
              <div className="th-cell th-amount">Số tiền</div>
              <div className="th-cell th-status">Trạng thái</div>
              <div className="th-cell th-date">Ngày giao dịch</div>
            </div>

            {transactions.map((txn) => {
              const statusBadge = getStatusBadge(txn.status);
              return (
                <div key={txn.id} className="transaction-row">
                  <div className="th-cell th-ref">
                    <span className="reference-code">{txn.reference_code}</span>
                  </div>
                  <div className="th-cell th-plan">
                    <span className="plan-badge">{getPlanDisplay(txn.plan)}</span>
                  </div>
                  <div className="th-cell th-amount">
                    <span className="amount">{formatCurrency(txn.amount)}</span>
                  </div>
                  <div className="th-cell th-status">
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  <div className="th-cell th-date">
                    <span className="date">{txn.created_at}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="transaction-summary">
            <h3>Tổng cộng</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Tổng số giao dịch</span>
                <span className="value">{transactions.length}</span>
              </div>
              <div className="summary-item">
                <span className="label">Giao dịch thành công</span>
                <span className="value">
                  {transactions.filter(t => t.status === 'success').length}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Tổng chi tiêu</span>
                <span className="value">
                  {formatCurrency(
                    transactions
                      .filter(t => t.status === 'success')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
