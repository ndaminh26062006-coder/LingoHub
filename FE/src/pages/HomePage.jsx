import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, featuredExams, examList } from '../data/mockData';
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

// ── Stats Banner ──────────────────────────────────────────────────────────────
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
