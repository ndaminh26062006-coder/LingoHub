import { useState, useEffect } from 'react';
import { paymentApi } from '../services/api';
import '../styles/PaymentHistory.css';

export default function PaymentHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Fetch transactions
  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = { page };
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      const response = await paymentApi.getHistory(params);
      setTransactions(response.data.transactions || []);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotal(response.data.total);
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi tải lịch sử giao dịch');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const handleFilter = () => {
    fetchTransactions(1);
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
    fetchTransactions(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      fetchTransactions(page);
    }
  };

  const getPlanLabel = (plan, planName) => {
    // Use plan_name from API if available
    if (planName) return planName;
    
    // Fallback to local mapping
    const planLabels = {
      '1subject': 'Gói 1 Môn',
      '3subject': 'Gói 3 Môn',
      '5subject': 'Gói 5 Môn',
      'full': 'Gói Full Access',
      '1month': '1 Môn Lẻ',
      '3month': '3 Môn Lẻ',
      '5month': '5 Môn Lẻ',
    };
    return planLabels[plan] || plan;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  return (
    <div className="payment-history-container">
      <div className="payment-history-header">
        <h1>Lịch sử giao dịch</h1>
        <p>Các giao dịch thanh toán thành công của bạn</p>
      </div>

      {/* Filters */}
      <div className="payment-history-filters">
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <button className="btn btn-primary" onClick={handleFilter}>
          🔍 Lọc
        </button>

        <button className="btn btn-outline" onClick={handleReset}>
          ↺ Đặt lại
        </button>
      </div>

      {/* Transactions Table */}
      <div className="payment-history-content">
        {loading && <div className="loading">Đang tải...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && transactions.length === 0 && (
          <div className="empty-state">
            <p>📭 Không có giao dịch nào trong khoảng thời gian này</p>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Ngày giờ</th>
                  <th>Gói dịch vụ</th>
                  <th>Số tiền</th>
                  <th>Mã tham chiếu</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.created_at_full}</td>
                    <td>
                      <span className="plan-badge">
                        {getPlanLabel(txn.plan, txn.plan_name)}
                      </span>
                    </td>
                    <td className="amount">{formatAmount(txn.amount)}</td>
                    <td className="reference-code">{txn.reference_code}</td>
                    <td>
                      <span className="status-badge status-success">
                        Thành công
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>

              <div className="page-info">
                Trang <strong>{currentPage}</strong> / <strong>{lastPage}</strong>
                {total > 0 && <span> ({total} giao dịch)</span>}
              </div>

              <button
                className="btn btn-outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                Sau →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
