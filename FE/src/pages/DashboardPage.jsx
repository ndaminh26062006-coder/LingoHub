import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import './DashboardPage.css';

// ── Mock data ──────────────────────────────────────────────────────────────────
const SCORE_HISTORY = [
  { label: 'T2', score: 5.5, date: '20/5' },
  { label: 'T3', score: 6.0, date: '21/5' },
  { label: 'T4', score: 5.0, date: '22/5' },
  { label: 'T5', score: 7.0, date: '23/5' },
  { label: 'T6', score: 6.5, date: '24/5' },
  { label: 'T7', score: 7.5, date: '25/5' },
  { label: 'CN', score: 8.0, date: '26/5' },
  { label: 'T2', score: 7.0, date: '27/5' },
  { label: 'T3', score: 8.5, date: '28/5' },
  { label: 'T4', score: 7.5, date: '29/5' },
  { label: 'T5', score: 9.0, date: '30/5' },
  { label: 'T6', score: 8.0, date: '31/5' },
  { label: 'T7', score: 8.5, date: '1/6' },
  { label: 'CN', score: 9.5, date: '2/6' },
];

const SUBJECT_STATS = [
  { name: 'Kinh tế vi mô',   done: 42, total: 50, avg: 8.2, color: '#1B3A6B', trend: '+1.5' },
  { name: 'Toán cao cấp',    done: 30, total: 50, avg: 6.8, color: '#F5A623', trend: '+0.8' },
  { name: 'Tư tưởng HCM',    done: 48, total: 50, avg: 9.1, color: '#22c55e', trend: '+2.1' },
  { name: 'Lịch sử Đảng',    done: 25, total: 50, avg: 7.4, color: '#8b5cf6', trend: '+0.5' },
  { name: 'Triết học',        done: 18, total: 50, avg: 6.2, color: '#ef4444', trend: '-0.3' },
];

const RECENT_EXAMS = [
  { id: 1, title: 'Kinh tế vi mô - Đề thi cuối kỳ 2024', score: 9.0, total: 10, date: '2/6/2024',  time: '52 phút', correct: 45, wrong: 5 },
  { id: 2, title: 'Tư tưởng HCM - Bộ đề 200 câu',        score: 9.5, total: 10, date: '31/5/2024', time: '44 phút', correct: 47, wrong: 3 },
  { id: 3, title: 'Toán cao cấp A1 - Đề HK1',             score: 6.5, total: 10, date: '29/5/2024', time: '88 phút', correct: 33, wrong: 17 },
  { id: 4, title: 'Lịch sử Đảng - Đề ôn tổng hợp',       score: 7.5, total: 10, date: '27/5/2024', time: '56 phút', correct: 38, wrong: 12 },
];

const ACHIEVEMENTS = [
  { id: 1, icon: '🔥', title: 'Streak 7 ngày',   desc: 'Học liên tục 7 ngày',          unlocked: true,  color: '#f59e0b' },
  { id: 2, icon: '💯', title: 'Điểm hoàn hảo',   desc: 'Đạt 10/10 lần đầu tiên',       unlocked: true,  color: '#22c55e' },
  { id: 3, icon: '📚', title: '100 câu hỏi',     desc: 'Làm xong 100 câu trắc nghiệm', unlocked: true,  color: '#3b82f6' },
  { id: 4, icon: '⚡', title: 'Tốc độ siêu nhân', desc: 'Hoàn thành bài trong 30 phút', unlocked: true,  color: '#8b5cf6' },
  { id: 5, icon: '🎯', title: '500 câu hỏi',     desc: 'Hoàn thành 500 câu',           unlocked: false, color: '#6b7280' },
  { id: 6, icon: '👑', title: 'Học bá',           desc: 'Điểm TB ≥ 9.0 trong 1 tuần',  unlocked: false, color: '#6b7280' },
  { id: 7, icon: '🌟', title: 'Đa năng',          desc: 'Ôn thi ≥ 5 môn khác nhau',    unlocked: false, color: '#6b7280' },
  { id: 8, icon: '🏆', title: 'Vô địch',          desc: 'Xếp hạng 1 trong tuần',        unlocked: false, color: '#6b7280' },
];

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
  const avg = (SCORE_HISTORY.reduce((a, b) => a + b.score, 0) / SCORE_HISTORY.length).toFixed(1);
  const totalQuestions = 263;
  const streak = 7;
  const readiness = 74;

  const statCards = [
    { icon: '📊', label: 'Điểm TB', value: avg, sub: '+0.8 so với tuần trước', color: '#1B3A6B' },
    { icon: '📝', label: 'Câu đã luyện', value: totalQuestions.toLocaleString(), sub: '87 câu tuần này', color: '#F5A623' },
    { icon: '🔥', label: 'Streak hiện tại', value: `${streak} ngày`, sub: 'Kỷ lục cá nhân: 12 ngày', color: '#ef4444' },
    { icon: '🎯', label: 'Đề đã hoàn thành', value: '14', sub: '3 đề tuần này', color: '#22c55e' },
  ];

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
            <ScoreChart data={SCORE_HISTORY} />
            <div className="chart-summary">
              <div className="cs-item">
                <span className="cs-val">{avg}</span>
                <span className="cs-label">Điểm TB</span>
              </div>
              <div className="cs-item">
                <span className="cs-val" style={{ color: '#22c55e' }}>
                  {SCORE_HISTORY.filter(d => d.score >= 8).length}
                </span>
                <span className="cs-label">Lần ≥8</span>
              </div>
              <div className="cs-item">
                <span className="cs-val" style={{ color: '#ef4444' }}>
                  {SCORE_HISTORY.filter(d => d.score < 6).length}
                </span>
                <span className="cs-label">Lần &lt;6</span>
              </div>
              <div className="cs-item">
                <span className="cs-val">{SCORE_HISTORY.length}</span>
                <span className="cs-label">Bài thi</span>
              </div>
            </div>
          </div>

          {/* Readiness ring */}
          <div className="db-card db-card--readiness">
            <h3 className="db-card__title">🎯 Độ sẵn sàng thi qua môn</h3>
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
            <h3 className="db-card__title">📚 Tiến độ theo môn học</h3>
            <span className="db-card__sub">{SUBJECT_STATS.length} môn đang theo dõi</span>
          </div>
          <div className="subj-list">
            {SUBJECT_STATS.map(s => <SubjectRow key={s.name} s={s} />)}
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
              {RECENT_EXAMS.map(e => {
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
                        <span className="ri-correct">✓ {e.correct}</span>
                        <span className="ri-wrong">✗ {e.wrong}</span>
                      </div>
                    </div>
                    <a href={`/exam/${e.id}?mode=exam`} className="btn btn-outline recent-btn">
                      Làm lại
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="db-card">
            <div className="db-card__head">
              <h3 className="db-card__title">🏅 Thành tích</h3>
              <span className="db-card__sub">
                {ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length} đã mở khóa
              </span>
            </div>
            <div className="achievements-grid">
              {ACHIEVEMENTS.map(a => (
                <div key={a.id} className={`achievement-item ${a.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="ach-icon" style={{ color: a.unlocked ? a.color : '#9ca3af', background: a.unlocked ? `${a.color}15` : 'var(--gray-100)' }}>
                    {a.unlocked ? a.icon : '🔒'}
                  </div>
                  <span className="ach-title">{a.title}</span>
                  <span className="ach-desc">{a.desc}</span>
                </div>
              ))}
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
