import './AdminLayout.css';

// ── Mock data ────────────────────────────────────────────────────────────────
const STATS = [
  { icon: '👥', label: 'Tổng tài khoản',  value: '1,248', trend: '+24 tuần này',  color: '#1B3A6B', up: true },
  { icon: '📝', label: 'Đề thi thử',       value: '142',   trend: '+3 mới',        color: '#F5A623', up: true },
  { icon: '✍️', label: 'Câu hỏi tự luận', value: '64',    trend: '+8 mới',        color: '#7c3aed', up: true },
  { icon: '🃏', label: 'Bộ flashcard',     value: '89',    trend: '+12 cộng đồng', color: '#16a34a', up: true },
  { icon: '🎯', label: 'Lượt thi tuần',    value: '3,420', trend: '+18%',          color: '#0891b2', up: true },
  { icon: '⭐', label: 'Điểm TB',          value: '7.8',   trend: '-0.2 vs tuần trước', color: '#ef4444', up: false },
  { icon: '🔥', label: 'Streak TB',        value: '5.2 ngày', trend: '+0.8',       color: '#f59e0b', up: true },
  { icon: '📚', label: 'Đề ôn tập',        value: '38',    trend: '+2 mới',        color: '#c0392b', up: true },
];

const RECENT_USERS = [
  { id: 1, name: 'Nguyễn Minh Tuấn',  email: 'tuan.nm@hcmue.edu.vn',  school: 'ĐH Kinh tế TP.HCM',  joined: '2 giờ trước',   role: 'student', active: true },
  { id: 2, name: 'Trần Thị Lan Anh',  email: 'anh.ttl@bku.edu.vn',    school: 'ĐH Bách Khoa HN',    joined: '5 giờ trước',   role: 'student', active: true },
  { id: 3, name: 'Phạm Đức Hùng',     email: 'hung.pd@ftu.edu.vn',    school: 'ĐH Ngoại Thương',    joined: '1 ngày trước',  role: 'student', active: true },
  { id: 4, name: 'Lê Thị Thu Hà',     email: 'ha.ltt@hlu.edu.vn',     school: 'ĐH Luật TP.HCM',     joined: '1 ngày trước',  role: 'student', active: false },
  { id: 5, name: 'Vũ Hoàng Nam',      email: 'nam.vh@uit.edu.vn',     school: 'ĐH CNTT TP.HCM',     joined: '2 ngày trước',  role: 'student', active: true },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'exam',       action: 'Thêm đề thi mới',          target: 'Kinh tế vi mô - Đề HK2 2024',  time: '10 phút trước',  icon: '📝', color: '#F5A623' },
  { id: 2, type: 'user',       action: 'Tài khoản mới đăng ký',    target: 'Nguyễn Minh Tuấn',              time: '2 giờ trước',    icon: '👤', color: '#1B3A6B' },
  { id: 3, type: 'flashcard',  action: 'Flashcard cộng đồng mới',  target: 'Kinh tế vi mô - Ôn thi',       time: '3 giờ trước',    icon: '🃏', color: '#16a34a' },
  { id: 4, type: 'essay',      action: 'Câu hỏi tự luận mới',      target: 'Tư tưởng HCM về đạo đức',      time: '5 giờ trước',    icon: '✍️', color: '#7c3aed' },
  { id: 5, type: 'user',       action: 'Tài khoản bị khóa',        target: 'spam.account@test.com',         time: '1 ngày trước',   icon: '🔒', color: '#ef4444' },
  { id: 6, type: 'exam',       action: 'Cập nhật đề thi',          target: 'Toán cao cấp A1 - HK1',        time: '1 ngày trước',   icon: '📝', color: '#F5A623' },
];

// Simple pure-CSS bar chart
const EXAM_ACTIVITY = [
  { day: 'T2', count: 312 }, { day: 'T3', count: 445 }, { day: 'T4', count: 389 },
  { day: 'T5', count: 521 }, { day: 'T6', count: 478 }, { day: 'T7', count: 634 },
  { day: 'CN', count: 287 },
];
const maxCount = Math.max(...EXAM_ACTIVITY.map(d => d.count));

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Tổng quan hệ thống LingoHub</p>
        </div>
        <span className="admin-refresh-hint">🕐 Cập nhật lúc 09:42 AM</span>
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
            {EXAM_ACTIVITY.map(d => {
              const h = Math.round((d.count / maxCount) * 100);
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
          <div className="admin-activity-feed">
            {RECENT_ACTIVITY.map(a => (
              <div key={a.id} className="admin-activity-item">
                <div className="aai-icon" style={{ background: `${a.color}15`, color: a.color }}>{a.icon}</div>
                <div className="aai-body">
                  <span className="aai-action">{a.action}</span>
                  <span className="aai-target">{a.target}</span>
                </div>
                <span className="aai-time">{a.time}</span>
              </div>
            ))}
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
              {RECENT_USERS.map(u => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
