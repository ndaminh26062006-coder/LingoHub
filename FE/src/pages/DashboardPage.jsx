import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import PageHeader from '../components/PageHeader';
import './DashboardPage.css';

// ── Pure-CSS bar chart ────────────────────────────────────────────────────────
function ScoreChart({ data }) {
  const max = 10;
  const [hovered, setHovered] = useState(null);

  return (
    <div className="score-chart">
      <div className="chart-bars">
        {data.map((d, i) => {
          const pct = (d.score / max) * 100;
          const color = d.score >= 8 ? '#22c55e' : d.score >= 6 ? '#F5A623' : '#ef4444';
          return (
            <div
              key={i}
              className="chart-bar-col"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === i && (
                <div className="chart-tooltip">
                  <strong>{d.score}/10</strong>
                  <span>{d.date}</span>
                </div>
              )}
              <div className="chart-bar-wrap">
                <div
                  className="chart-bar-fill"
                  style={{
                    height: `${pct}%`,
                    background: color,
                    opacity: hovered !== null && hovered !== i ? 0.4 : 1,
                  }}
                />
              </div>
              <span className="chart-bar-label">{d.label}</span>
            </div>
          );
        })}
      </div>
      {/* Y-axis guides */}
      <div className="chart-guides">
        {[10, 8, 6, 4, 2].map(v => (
          <div key={v} className="chart-guide">
            <span>{v}</span>
            <div className="chart-guide-line" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Readiness ring ────────────────────────────────────────────────────────────
function ReadinessRing({ value }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  const color = value >= 75 ? '#22c55e' : value >= 50 ? '#F5A623' : '#ef4444';
  const label = value >= 75 ? 'Sẵn sàng thi' : value >= 50 ? 'Cần ôn thêm' : 'Chưa sẵn sàng';

  return (
    <div className="readiness-ring">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--gray-200)" strokeWidth="14" />
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x="90" y="80" textAnchor="middle" dominantBaseline="middle" fontSize="36" fontWeight="800" fill={color}>{value}%</text>
        <text x="90" y="108" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="var(--text-muted)" fontWeight="600">{label}</text>
      </svg>
    </div>
  );
}

// ── Subject progress bar ──────────────────────────────────────────────────────
function SubjectRow({ s }) {
  const pct = Math.round((s.done / s.total) * 100);
  const positive = s.trend.startsWith('+');
  return (
    <div className="subj-row">
      <div className="subj-row__info">
        <span className="subj-name">{s.name}</span>
        <div className="subj-meta">
          <span className="subj-done">{s.done}/{s.total} câu</span>
          <span className={`subj-trend ${positive ? 'trend-up' : 'trend-down'}`}>
            {positive ? '↑' : '↓'} {s.trend}
          </span>
        </div>
      </div>
      <div className="subj-track">
        <div className="subj-fill" style={{ width: `${pct}%`, background: s.color }} />
      </div>
      <div className="subj-row__right">
        <span className="subj-avg" style={{ color: s.color }}>{s.avg}</span>
        <span className="subj-pct">{pct}%</span>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError('Vui lòng đăng nhập để xem tiến độ');
      setLoading(false);
      return;
    }

    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      const res = await dashboardApi.getUserDashboard();
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Không thể tải dữ liệu tiến độ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page page-enter">
        <PageHeader
          title="Thống kê tiến độ"
          subtitle="Theo dõi phong độ học tập, điểm số và độ sẵn sàng cho kỳ thi"
          icon="📈"
        />
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dashboard-page page-enter">
        <PageHeader
          title="Thống kê tiến độ"
          subtitle="Theo dõi phong độ học tập, điểm số và độ sẵn sàng cho kỳ thi"
          icon="📈"
        />
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px', color: '#ef4444' }}>
          ⚠️ {error || 'Không thể tải dữ liệu'}
        </div>
      </div>
    );
  }

  const statCards = data.stat_cards;
  const scoreHistory = data.score_history;
  const subjectStats = data.subject_stats;
  const recentExams = data.recent_exams;
  const achievements = data.achievements;
  const readiness = data.readiness;

  return (
    <div className="dashboard-page page-enter">
      <PageHeader
        title="Thống kê tiến độ"
        subtitle="Theo dõi phong độ học tập, điểm số và độ sẵn sàng cho kỳ thi"
        icon="📈"
      />

      <div className="container db-body">

        {/* ── Stat cards row ── */}
        <div className="db-stat-cards">
          {statCards.map(s => (
            <div key={s.label} className="db-stat-card">
              <div className="db-stat-card__icon" style={{ background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <div className="db-stat-card__info">
                <span className="db-stat-label">{s.label}</span>
                <span className="db-stat-value" style={{ color: s.color }}>{s.value}</span>
                <span className="db-stat-sub">{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid: chart + readiness ── */}
        <div className="db-main-grid">

          {/* Score trend chart */}
          <div className="db-card db-card--chart">
            <div className="db-card__head">
              <h3 className="db-card__title">📈 Biểu đồ phong độ (14 ngày)</h3>
              <div className="chart-legend">
                <span className="legend-dot" style={{ background: '#22c55e' }} /> ≥8
                <span className="legend-dot" style={{ background: '#F5A623' }} /> 6–8
                <span className="legend-dot" style={{ background: '#ef4444' }} /> &lt;6
              </div>
            </div>
            <ScoreChart data={scoreHistory} />
            <div className="chart-summary">
              <div className="cs-item">
                <span className="cs-val">{data.avg_score}</span>
                <span className="cs-label">Điểm TB</span>
              </div>
              <div className="cs-item">
                <span className="cs-val" style={{ color: '#22c55e' }}>
                  {scoreHistory.filter(d => d.score >= 8).length}
                </span>
                <span className="cs-label">Lần ≥8</span>
              </div>
              <div className="cs-item">
                <span className="cs-val" style={{ color: '#ef4444' }}>
                  {scoreHistory.filter(d => d.score < 6).length}
                </span>
                <span className="cs-label">Lần &lt;6</span>
              </div>
              <div className="cs-item">
                <span className="cs-val">{scoreHistory.length}</span>
                <span className="cs-label">Bài thi</span>
              </div>
            </div>
          </div>

          {/* Readiness ring */}
          <div className="db-card db-card--readiness">
            <h3 className="db-card__title">Độ sẵn sàng thi qua môn</h3>
            <ReadinessRing value={readiness} />
            <div className="readiness-breakdown">
              {[
                { label: 'Kiến thức lý thuyết', pct: 82 },
                { label: 'Thực hành đề thi',    pct: 68 },
                { label: 'Tốc độ làm bài',       pct: 71 },
              ].map(item => (
                <div key={item.label} className="rb-item">
                  <div className="rb-item__head">
                    <span className="rb-label">{item.label}</span>
                    <span className="rb-pct">{item.pct}%</span>
                  </div>
                  <div className="rb-track">
                    <div className="rb-fill" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {readiness < 75 && (
              <div className="readiness-cta">
                <span>💡 Bạn cần ôn thêm khoảng <strong>26%</strong> để đạt ngưỡng sẵn sàng.</span>
                <a href="/exams" className="btn btn-orange" style={{ fontSize: 13, padding: '8px 16px' }}>
                  Luyện đề ngay
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Subject progress ── */}
        <div className="db-card">
          <div className="db-card__head">
            <h3 className="db-card__title"> Tiến độ theo môn học</h3>
            <span className="db-card__sub">{(subjectStats && subjectStats.length) || 0} môn đang theo dõi</span>
          </div>
          <div className="subj-list">
            {subjectStats && subjectStats.length > 0 ? (
              subjectStats.map(s => <SubjectRow key={s.name} s={s} />)
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                Chưa có dữ liệu môn học. Hoàn thành một bài thi để bắt đầu!
              </div>
            )}
          </div>
        </div>

        {/* ── Recent exams + Achievements ── */}
        <div className="db-bottom-grid">

          {/* Recent exams */}
          <div className="db-card">
            <div className="db-card__head">
              <h3 className="db-card__title">🕐 Bài thi gần đây</h3>
            </div>
            <div className="recent-list">
              {recentExams && recentExams.length > 0 ? (
                recentExams.map(e => {
                  const pct = (e.score / e.total) * 100;
                  const c   = pct >= 80 ? '#22c55e' : pct >= 60 ? '#F5A623' : '#ef4444';
                  return (
                    <div key={e.id} className="recent-item">
                      <div className="recent-score" style={{ background: `${c}15`, color: c }}>
                        {e.score}
                      </div>
                      <div className="recent-info">
                        <span className="recent-title">{e.title}</span>
                        <div className="recent-meta">
                          <span>📅 {e.date}</span>
                          <span>⏱ {e.time}</span>
                          <span className="ri-correct">{e.correct}</span>
                          <span className="ri-wrong">✗ {e.wrong}</span>
                        </div>
                      </div>
                      <a href={`/exam/${e.id}?mode=exam`} className="btn btn-outline recent-btn">
                        Làm lại
                      </a>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  Chưa có bài thi nào. Hãy bắt đầu ôn thi!
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="db-card">
            <div className="db-card__head">
              <h3 className="db-card__title">🏅 Thành tích</h3>
              <span className="db-card__sub">
                {achievements ? achievements.filter(a => a.unlocked).length : 0}/{achievements ? achievements.length : 0} đã mở khóa
              </span>
            </div>
            <div className="achievements-grid">
              {achievements && achievements.length > 0 ? (
                achievements.map(a => (
                  <div key={a.id} className={`achievement-item ${a.unlocked ? 'unlocked' : 'locked'}`}>
                    <div className="ach-icon" style={{ color: a.unlocked ? a.color : '#9ca3af', background: a.unlocked ? `${a.color}15` : 'var(--gray-100)' }}>
                      {a.unlocked ? a.icon : '🔒'}
                    </div>
                    <span className="ach-title">{a.title}</span>
                    <span className="ach-desc">{a.desc}</span>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999' }}>
                  Chưa có thành tích nào. Hãy bắt đầu học tập!
                </div>
              )}
            </div>

            {/* Upsell — Semester Pass */}
            <div className="upsell-banner">
              <div className="upsell-banner__left">
                <span className="upsell-icon">⭐</span>
                <div>
                  <p className="upsell-title">Combo Semester Pass</p>
                  <p className="upsell-desc">Mở khóa toàn bộ 500+ đề thi, AI chấm tự luận không giới hạn và thống kê nâng cao.</p>
                </div>
              </div>
              <a href="/register" className="btn btn-orange upsell-btn">Xem gói</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
