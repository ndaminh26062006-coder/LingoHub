import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, featuredExams } from '../data/mockData';
import './HomePage.css';

// ── Search Bar ────────────────────────────────────────────────────────────────
function SearchBar({ query, setQuery, onSearch }) {
  const [focused, setFocused] = useState(false);

  // Quick suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const all = categories.flatMap(cat =>
      cat.subjects.map(s => ({ ...s, categoryName: cat.name, categoryId: cat.id }))
    );
    return all
      .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [query]);

  const handleKey = e => {
    if (e.key === 'Enter') onSearch(query);
  };

  return (
    <div className={`search-bar ${focused ? 'focused' : ''}`}>
      <div className="search-bar__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Tìm kiếm môn học, đề thi... (vd: Kinh tế vi mô, Toán cao cấp)"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        onKeyDown={handleKey}
      />
      {query && (
        <button className="search-bar__clear" onClick={() => setQuery('')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
      <button className="search-bar__btn" onClick={() => onSearch(query)}>
        Tìm kiếm
      </button>

      {/* Dropdown suggestions */}
      {focused && suggestions.length > 0 && (
        <div className="search-suggestions">
          <p className="search-suggestions__label">Gợi ý</p>
          {suggestions.map(s => (
            <Link
              key={s.id}
              to={`/on-tap/${s.categoryId}`}
              className="search-suggestion-item"
            >
              <span className="suggestion-icon">📖</span>
              <div>
                <span className="suggestion-name">{s.name}</span>
                <span className="suggestion-cat">{s.categoryName}</span>
              </div>
              <span className="suggestion-count">{s.exams} đề</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Category Card ─────────────────────────────────────────────────────────────
function CategoryCard({ category }) {
  return (
    <Link to={`/on-tap/${category.id}`} className="category-card">
      <div className="category-card__header" style={{ background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}08 100%)` }}>
        <div className="category-card__icon" style={{ background: `${category.color}20`, border: `2px solid ${category.color}30` }}>
          <span>{category.icon}</span>
        </div>
        <div className="category-card__count badge" style={{ background: `${category.color}15`, color: category.color }}>
          {category.count} đề thi
        </div>
      </div>
      <div className="category-card__body">
        <h3 className="category-card__name">{category.name}</h3>
        <p className="category-card__desc">{category.description}</p>
        <div className="category-card__subjects">
          {category.subjects.slice(0, 3).map(sub => (
            <span key={sub.id} className="subject-chip">{sub.name}</span>
          ))}
          {category.subjects.length > 3 && (
            <span className="subject-chip subject-chip--more">+{category.subjects.length - 3}</span>
          )}
        </div>
      </div>
      <div className="category-card__footer">
        <span className="category-card__cta">
          Xem tất cả
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}

// ── Exam Card ─────────────────────────────────────────────────────────────────
function ExamCard({ exam }) {
  const navigate = useNavigate();
  const diffColor = { Dễ: 'badge-green', 'Trung bình': 'badge-orange', Khó: 'badge-navy' };

  return (
    <div className="exam-card">
      <div className="exam-card__top">
        <span className={`badge ${diffColor[exam.difficulty] || 'badge-navy'}`}>{exam.difficulty}</span>
        <span className="exam-card__subject">{exam.subject}</span>
      </div>
      <h4 className="exam-card__title">{exam.title}</h4>
      <div className="exam-card__meta">
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          {exam.questions} câu
        </span>
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          {exam.duration} phút
        </span>
        <span className="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {exam.attempts.toLocaleString()}
        </span>
        <span className="meta-item meta-rating">
          ⭐ {exam.rating}
        </span>
      </div>
      <div className="exam-card__actions">
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => navigate(`/exam/${exam.id}?mode=exam`)}
        >
          Thi thật
        </button>
        <button
          className="btn btn-outline"
          style={{ flex: 1 }}
          onClick={() => navigate(`/exam/${exam.id}?mode=practice`)}
        >
          Luyện tập
        </button>
      </div>
    </div>
  );
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
const LEADERBOARD_DATA = {
  streak: [
    { rank: 1, name: 'Nguyễn Minh Tuấn',  school: 'ĐH Kinh tế TP.HCM',   value: '142 giờ',  avatar: 'MT', badge: '👑' },
    { rank: 2, name: 'Trần Thị Lan Anh',  school: 'ĐH Bách Khoa HN',     value: '128 giờ',  avatar: 'LA', badge: '🥈' },
    { rank: 3, name: 'Phạm Đức Hùng',     school: 'ĐH Ngoại Thương',     value: '115 giờ',  avatar: 'ĐH', badge: '🥉' },
    { rank: 4, name: 'Lê Thị Thu Hà',     school: 'ĐH Luật TP.HCM',      value: '98 giờ',   avatar: 'TH', badge: null },
    { rank: 5, name: 'Vũ Hoàng Nam',      school: 'ĐH CNTT TP.HCM',      value: '87 giờ',   avatar: 'HN', badge: null },
    { rank: 6, name: 'Đặng Thị Bích Ngọc', school: 'ĐH Khoa học XH&NV',  value: '76 giờ',   avatar: 'BN', badge: null },
    { rank: 7, name: 'Hoàng Văn Khánh',   school: 'ĐH Sư phạm TP.HCM',   value: '64 giờ',   avatar: 'VK', badge: null },
  ],
  accuracy: [
    { rank: 1, name: 'Trần Thị Lan Anh',  school: 'ĐH Bách Khoa HN',     value: '97.4%',    avatar: 'LA', badge: '👑', sub: '214 câu đúng' },
    { rank: 2, name: 'Nguyễn Minh Tuấn',  school: 'ĐH Kinh tế TP.HCM',   value: '95.8%',    avatar: 'MT', badge: '🥈', sub: '198 câu đúng' },
    { rank: 3, name: 'Bùi Thị Thanh Mai', school: 'ĐH Y Dược TP.HCM',    value: '94.1%',    avatar: 'TM', badge: '🥉', sub: '176 câu đúng' },
    { rank: 4, name: 'Lê Hoàng Phúc',     school: 'ĐH FPT',              value: '92.7%',    avatar: 'HP', badge: null, sub: '165 câu đúng' },
    { rank: 5, name: 'Phạm Đức Hùng',     school: 'ĐH Ngoại Thương',     value: '91.3%',    avatar: 'ĐH', badge: null, sub: '158 câu đúng' },
    { rank: 6, name: 'Ngô Thị Kim Dung',  school: 'ĐH Văn Lang',         value: '90.5%',    avatar: 'KD', badge: null, sub: '142 câu đúng' },
    { rank: 7, name: 'Trịnh Văn Đạt',     school: 'ĐH Tôn Đức Thắng',   value: '89.8%',    avatar: 'VĐ', badge: null, sub: '137 câu đúng' },
  ],
  speed: [
    { rank: 1, name: 'Lê Hoàng Phúc',     school: 'ĐH FPT',              value: '38 giây/câu', avatar: 'HP', badge: '👑', sub: 'Điểm TB: 9.2' },
    { rank: 2, name: 'Vũ Hoàng Nam',      school: 'ĐH CNTT TP.HCM',      value: '42 giây/câu', avatar: 'HN', badge: '🥈', sub: 'Điểm TB: 8.8' },
    { rank: 3, name: 'Nguyễn Minh Tuấn',  school: 'ĐH Kinh tế TP.HCM',   value: '45 giây/câu', avatar: 'MT', badge: '🥉', sub: 'Điểm TB: 9.0' },
    { rank: 4, name: 'Trần Thị Lan Anh',  school: 'ĐH Bách Khoa HN',     value: '48 giây/câu', avatar: 'LA', badge: null, sub: 'Điểm TB: 9.5' },
    { rank: 5, name: 'Hoàng Văn Khánh',   school: 'ĐH Sư phạm TP.HCM',   value: '51 giây/câu', avatar: 'VK', badge: null, sub: 'Điểm TB: 8.4' },
    { rank: 6, name: 'Phạm Đức Hùng',     school: 'ĐH Ngoại Thương',     value: '54 giây/câu', avatar: 'ĐH', badge: null, sub: 'Điểm TB: 8.1' },
    { rank: 7, name: 'Bùi Thị Thanh Mai', school: 'ĐH Y Dược TP.HCM',    value: '56 giây/câu', avatar: 'TM', badge: null, sub: 'Điểm TB: 8.7' },
  ],
};

const TABS = [
  { id: 'streak',   label: 'Học lâu nhất',    icon: '🔥' },
  { id: 'accuracy', label: 'Điểm cao nhất',   icon: '🎯' },
  { id: 'speed',    label: 'Nhanh nhất',       icon: '⚡' },
];

const RANK_COLORS = {
  1: { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', text: '#7a4a00', ring: '#FFD700' },
  2: { bg: 'linear-gradient(135deg,#C0C0C0,#A8A8A8)', text: '#444',   ring: '#C0C0C0' },
  3: { bg: 'linear-gradient(135deg,#CD7F32,#A0522D)', text: '#fff',   ring: '#CD7F32' },
};

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('streak');
  const rows = LEADERBOARD_DATA[activeTab];

  return (
    <section className="section section--gray">
      <div className="container">
        <div className="section__header">
          <div>
            <h2 className="section__title">🏆 Bảng xếp hạng</h2>
            <p className="section__subtitle">Top sinh viên nổi bật trong tuần này</p>
          </div>
          <span className="lb-refresh-hint">🔄 Cập nhật hàng tuần</span>
        </div>

        {/* Tabs */}
        <div className="lb-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`lb-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="lb-podium">
          {/* 2nd */}
          <div className="podium-item podium-item--2">
            <div className="podium-avatar" style={{ background: RANK_COLORS[2].bg, boxShadow: `0 0 0 3px ${RANK_COLORS[2].ring}` }}>
              {rows[1].avatar}
            </div>
            <div className="podium-name">{rows[1].name.split(' ').pop()}</div>
            <div className="podium-value">{rows[1].value}</div>
            <div className="podium-stand podium-stand--2">
              <span className="podium-rank">🥈</span>
            </div>
          </div>
          {/* 1st */}
          <div className="podium-item podium-item--1">
            <div className="podium-crown">👑</div>
            <div className="podium-avatar podium-avatar--1" style={{ background: RANK_COLORS[1].bg, boxShadow: `0 0 0 4px ${RANK_COLORS[1].ring}` }}>
              {rows[0].avatar}
            </div>
            <div className="podium-name podium-name--1">{rows[0].name.split(' ').pop()}</div>
            <div className="podium-value podium-value--1">{rows[0].value}</div>
            <div className="podium-stand podium-stand--1">
              <span className="podium-rank">🥇</span>
            </div>
          </div>
          {/* 3rd */}
          <div className="podium-item podium-item--3">
            <div className="podium-avatar" style={{ background: RANK_COLORS[3].bg, boxShadow: `0 0 0 3px ${RANK_COLORS[3].ring}` }}>
              {rows[2].avatar}
            </div>
            <div className="podium-name">{rows[2].name.split(' ').pop()}</div>
            <div className="podium-value">{rows[2].value}</div>
            <div className="podium-stand podium-stand--3">
              <span className="podium-rank">🥉</span>
            </div>
          </div>
        </div>

        {/* Rows 4–7 */}
        <div className="lb-list">
          {rows.slice(3).map(row => (
            <div key={row.rank} className="lb-row">
              <span className="lb-row__rank">{row.rank}</span>
              <div className="lb-row__avatar">{row.avatar}</div>
              <div className="lb-row__info">
                <span className="lb-row__name">{row.name}</span>
                <span className="lb-row__school">{row.school}</span>
              </div>
              {row.sub && <span className="lb-row__sub">{row.sub}</span>}
              <span className="lb-row__value">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function StatsBanner() {
  const stats = [
    { value: '10,000+', label: 'Câu hỏi', icon: '❓' },
    { value: '500+',    label: 'Đề thi',  icon: '📄' },
    { value: '50,000+', label: 'Lượt thi', icon: '🏆' },
    { value: '3',       label: 'Khối ngành', icon: '🎓' },
  ];
  return (
    <div className="stats-banner">
      {stats.map(s => (
        <div key={s.label} className="stat-item">
          <span className="stat-icon">{s.icon}</span>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = query => {
    if (query.trim()) navigate(`/exams?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="home-page page-enter">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container hero__content">
          <div className="hero__badge">
            <span>🚀</span> Nền tảng ôn thi trực tuyến hàng đầu
          </div>
          <h1 className="hero__title">
            Ôn thi hiệu quả với <br />
            <span className="hero__title-highlight">LingoHub</span>
          </h1>
          <p className="hero__subtitle">
            Hàng nghìn đề thi, câu hỏi trắc nghiệm được phân loại theo khối ngành.
            Luyện tập với giải thích chi tiết hoặc thi thử đúng áp lực thật.
          </p>

          <div className="hero__search">
            <SearchBar query={searchQuery} setQuery={setSearchQuery} onSearch={handleSearch} />
          </div>

          <div className="hero__quick-links">
            <span className="quick-links-label">Tìm kiếm nhanh:</span>
            {['Kinh tế vi mô', 'Toán cao cấp', 'Tư tưởng HCM', 'Cấu trúc dữ liệu'].map(kw => (
              <button
                key={kw}
                className="quick-chip"
                onClick={() => { setSearchQuery(kw); handleSearch(kw); }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="container">
        <StatsBanner />
      </section>

      {/* ── Categories ── */}
      <section className="section container">
        <div className="section__header">
          <div>
            <h2 className="section__title">Khối ngành</h2>
            <p className="section__subtitle">Chọn khối ngành phù hợp để bắt đầu ôn luyện</p>
          </div>
          <Link to="/on-tap" className="btn btn-outline">Xem tất cả</Link>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* ── Featured Exams ── */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Đề thi nổi bật</h2>
              <p className="section__subtitle">Được nhiều sinh viên luyện tập nhất</p>
            </div>
            <Link to="/exams" className="btn btn-outline">Xem tất cả đề</Link>
          </div>
          <div className="exams-grid">
            {featuredExams.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Leaderboard ── */}
      <Leaderboard />

      {/* ── CTA Banner ── */}
      <section className="container">
        <div className="cta-banner">
          <div className="cta-banner__text">
            <h2>Sẵn sàng chinh phục kỳ thi?</h2>
            <p>Bắt đầu luyện tập ngay hôm nay với hơn 10,000 câu hỏi được giải thích chi tiết.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/exams?mode=practice" className="btn btn-orange" style={{ fontSize: '15px', padding: '12px 28px' }}>
              🎯 Luyện tập ngay
            </Link>
            <Link to="/exams?mode=exam" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', padding: '12px 28px' }}>
              ⏱️ Thi thử
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
