import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './AdminLayout.css';

export default function AdminDashboard() {
  const [apiStats, setApiStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats()
      .then(res => {
        setApiStats(res.data);
      })
      .catch(err => {
        console.error('Failed to load admin stats:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!apiStats) {
    return (
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-sub">Tổng quan hệ thống LingoHub</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
          {loading ? 'Đang tải dữ liệu...' : 'Không thể tải dữ liệu'}
        </div>
      </div>
    );
  }

  // Mock data for trends (static)
  const STATS = [
    { icon: '', label: 'Tổng tài khoản',  value: apiStats.users?.toLocaleString() || '0', trend: '+24 tuần này',  color: '#1B3A6B', up: true },
    { icon: '', label: 'Đề thi thử',       value: String(apiStats.exams || 0),   trend: '+3 mới',        color: '#F5A623', up: true },
    { icon: '', label: 'Câu hỏi tự luận', value: String(apiStats.essays || 0),    trend: '+8 mới',        color: '#7c3aed', up: true },
    { icon: '', label: 'Bộ flashcard',     value: String(apiStats.flashcard_decks || 0),    trend: '+12 cộng đồng', color: '#16a34a', up: true },
    { icon: '', label: 'Lượt thi tuần',    value: Number(apiStats.total_attempts || 0).toLocaleString(), trend: '+18%',          color: '#0891b2', up: true },
    { icon: '', label: 'Điểm TB',          value: '7.8',   trend: '-0.2 vs tuần trước', color: '#ef4444', up: false },
    { icon: '', label: 'Streak TB',        value: '5.2 ngày', trend: '+0.8',       color: '#f59e0b', up: true },
    { icon: '', label: 'Đề ôn tập',        value: String(apiStats.published_exams || 0),    trend: '+2 mới',        color: '#c0392b', up: true },
  ];

  const recentUsers = apiStats.recent_users || [];
  const examActivity = apiStats.exam_activity || [];
  const maxCount = examActivity.length > 0 ? Math.max(...examActivity.map(d => d.count)) : 1;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Tổng quan hệ thống LingoHub</p>
        </div>
        <span className="admin-refresh-hint">🕐 Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })}</span>
      </div>

      {/* ── Stats ── */}
      <div className="admin-cards-grid admin-cards-grid--8">
        {STATS.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="asc-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            <div>
              <div className="asc-value" style={{ color: s.color }}>{s.value}</div>
              <div className="asc-label">{s.label}</div>
              <div className={`asc-trend ${s.up ? 'up' : 'down'}`}>{s.up ? '↑' : '↓'} {s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle row ── */}
      <div className="admin-mid-grid">
        {/* Activity chart */}
        <div className="admin-card">
          <div className="admin-card__head">
            <span className="admin-card__title">📈 Lượt làm bài trong tuần</span>
          </div>
          <div className="admin-mini-chart">
            {examActivity.map(d => {
              const h = maxCount > 0 ? Math.round((d.count / maxCount) * 100) : 0;
              return (
                <div key={d.day} className="admin-chart-col" title={`${d.count} lượt`}>
                  <span className="admin-chart-val">{d.count}</span>
                  <div className="admin-chart-bar-wrap">
                    <div className="admin-chart-bar" style={{ height: `${h}%` }} />
                  </div>
                  <span className="admin-chart-label">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity feed */}
        <div className="admin-card">
          <div className="admin-card__head">
            <span className="admin-card__title">🔔 Hoạt động gần đây</span>
          </div>
          <div className="admin-activity-feed" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            📋 Chức năng này sẽ sớm có sẵn
          </div>
        </div>
      </div>

      {/* ── Recent users ── */}
      <div className="admin-card">
        <div className="admin-card__head">
          <span className="admin-card__title">👥 Tài khoản đăng ký gần đây</span>
          <a href="/admin/users" className="admin-action-btn admin-action-btn--primary">Xem tất cả →</a>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Trường học</th>
                <th>Tham gia</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length > 0 ? (
                recentUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.school}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{u.joined}</td>
                    <td>
                      <span className={`admin-badge ${u.active ? 'admin-badge--green' : 'admin-badge--gray'}`}>
                        {u.active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
