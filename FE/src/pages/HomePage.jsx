import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { categoryApi, examApi, subjectApi, toArray } from '../services/api';
import useFreemium from '../hooks/useFreemium';
import AccessDeniedModal from '../components/AccessDeniedModal';
import './HomePage.css';

// ── Search Bar ────────────────────────────────────────────────────────────────
function SearchBar({ query, setQuery, onSearch, categories = [] }) {
  const [focused, setFocused] = useState(false);

  // Quick suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const all = categories.flatMap(cat =>
      (cat.subjects ?? []).map(s => ({ ...s, categoryName: cat.name, categoryId: cat.id || cat.slug }))
    );
    return all
      .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [query, categories]);

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

// ── Subject Card ──────────────────────────────────────────────────────────────
function SubjectCard({ subject }) {
  // Subjects link to exams filtered by subject
  const href     = `/exams?subject=${subject.id}`;
  const color    = subject.color || '#3b82f6';

  return (
    <Link to={href} className="subject-card">
      <div className="subject-card__header" style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)` }}>
        <div className="subject-card__icon" style={{ background: `${color}20`, border: `2px solid ${color}30` }}>
          <span>{subject.icon || ''}</span>
        </div>
      </div>
      <div className="subject-card__body">
        <h3 className="subject-card__name">{subject.name}</h3>
      </div>
      <div className="subject-card__footer">
        <span className="subject-card__cta">
          Xem đề thi
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
  const navigate  = useNavigate();
  const { checkAccess } = useFreemium();
  const [likes, setLikes] = useState(exam.likes_count ?? 0);
  const [userLike, setUserLike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);
  const diffColor = { Dễ: 'badge-green', 'Trung bình': 'badge-orange', Khó: 'badge-navy' };
  
  // Normalise field names — API uses questions_count, mock uses questions
  const questionCount = exam.questions_count ?? exam.questions ?? 0;
  const attempts      = exam.attempts ?? 0;

  // Fetch like stats on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/likes/stats/Exam/${exam.id}`);
        setLikes(response.data.likes);
        setUserLike(response.data.user_like);
      } catch (err) {
        console.error('Failed to fetch likes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, [exam.id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Show login prompt
        alert('Vui lòng đăng nhập để like');
        return;
      }

      if (userLike?.is_liked) {
        // Unlike
        await axios.delete(`http://localhost:8000/api/likes/${userLike.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLikes(likes - 1);
        setUserLike(null);
      } else {
        // Like
        const response = await axios.post(
          `http://localhost:8000/api/likes`,
          {
            likeable_type: 'Exam',
            likeable_id: exam.id,
            is_liked: true
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.voted) {
          setLikes(likes + 1);
          setUserLike({ id: response.data.id, is_liked: true });
        }
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleExamClick = async () => {
    const result = await checkAccess('exam');
    if (result.can_access) {
      // Check if user has access to this subject
      const token = localStorage.getItem('lh_token');
      if (token && exam.subject_model?.id) {
        try {
          const response = await fetch('http://localhost:8000/api/subscriptions/check-subject', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject_id: exam.subject_model.id }),
          });
          
          const data = await response.json();
          if (!data.has_access) {
            setAccessDeniedOpen(true);
            return;
          }
        } catch (err) {
          console.error('Error checking subject access:', err);
        }
      }
      
      navigate(`/exam/${exam.id}?mode=exam`);
    }
  };

  return (
    <>
      <div className="exam-card">
        <span className="exam-card__subject">{exam.subject_model?.name || exam.subject || '—'}</span>
        <h4 className="exam-card__title">{exam.title}</h4>
        <div className="exam-card__meta">
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            {exam.total_questions || questionCount} câu
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
            {Number(attempts).toLocaleString()}
          </span>
          <button 
            className={`meta-item meta-rating like-btn ${userLike?.is_liked ? 'liked' : ''}`}
            onClick={handleLike}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            title="Like đề thi này"
          >
            {userLike?.is_liked ? '👍' : '👍'} {likes}
          </button>
        </div>
        <div className="exam-card__actions">
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleExamClick}
          >
            Thi thật
          </button>
        </div>
      </div>

      {/* Access Denied Modal */}
      <AccessDeniedModal
        isOpen={accessDeniedOpen}
        onClose={() => setAccessDeniedOpen(false)}
        title="Không có quyền truy cập"
      />
    </>
  );
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'streak',   label: 'Học lâu nhất',    icon: '' },
  { id: 'accuracy', label: 'Điểm cao nhất',   icon: '' },
  { id: 'speed',    label: 'Nhanh nhất',       icon: '' },
];

const RANK_COLORS = {
  1: { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', text: '#7a4a00', ring: '#FFD700' },
  2: { bg: 'linear-gradient(135deg,#C0C0C0,#A8A8A8)', text: '#444',   ring: '#C0C0C0' },
  3: { bg: 'linear-gradient(135deg,#CD7F32,#A0522D)', text: '#fff',   ring: '#CD7F32' },
};

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('streak');
  const [leaderboardData, setLeaderboardData] = useState({
    streak: [],
    accuracy: [],
    speed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const rankingTypes = ['streak', 'accuracy', 'speed'];
        const data = {};

        for (const type of rankingTypes) {
          const response = await axios.get(
            `http://localhost:8000/api/leaderboard?ranking_type=${type}&period=week&limit=7`
          );
          data[type] = response.data.data || [];
        }

        setLeaderboardData(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        // Keep empty data on error
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const rows = leaderboardData[activeTab] || [];

  // Show real data only - no fallback to mock
  const displayRows = rows;

  return (
    <section className="section section--gray">
      <div className="container">
        <div className="section__header">
          <div>
            <h2 className="section__title">Bảng xếp hạng</h2>
            <p className="section__subtitle">Top sinh viên nổi bật trong tuần này</p>
          </div>
          <span className="lb-refresh-hint">Cập nhật hàng tuần</span>
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
          {displayRows[1] && (
            <div className="podium-item podium-item--2">
              <div className="podium-avatar" style={{ background: RANK_COLORS[2].bg, boxShadow: `0 0 0 3px ${RANK_COLORS[2].ring}` }}>
                {displayRows[1].avatar_initials}
              </div>
              <div className="podium-name">{displayRows[1].name?.split(' ').pop()}</div>
              <div className="podium-value">{displayRows[1].value}</div>
              <div className="podium-stand podium-stand--2">
                <span className="podium-rank">🥈</span>
              </div>
            </div>
          )}
          {/* 1st */}
          {displayRows[0] && (
            <div className="podium-item podium-item--1">
              <div className="podium-crown">👑</div>
              <div className="podium-avatar podium-avatar--1" style={{ background: RANK_COLORS[1].bg, boxShadow: `0 0 0 4px ${RANK_COLORS[1].ring}` }}>
                {displayRows[0].avatar_initials}
              </div>
              <div className="podium-name podium-name--1">{displayRows[0].name?.split(' ').pop()}</div>
              <div className="podium-value podium-value--1">{displayRows[0].value}</div>
              <div className="podium-stand podium-stand--1">
                <span className="podium-rank">🥇</span>
              </div>
            </div>
          )}
          {/* 3rd */}
          {displayRows[2] && (
            <div className="podium-item podium-item--3">
              <div className="podium-avatar" style={{ background: RANK_COLORS[3].bg, boxShadow: `0 0 0 3px ${RANK_COLORS[3].ring}` }}>
                {displayRows[2].avatar_initials}
              </div>
              <div className="podium-name">{displayRows[2].name?.split(' ').pop()}</div>
              <div className="podium-value">{displayRows[2].value}</div>
              <div className="podium-stand podium-stand--3">
                <span className="podium-rank">🥉</span>
              </div>
            </div>
          )}
        </div>

        {/* Rows 4–7 */}
        <div className="lb-list">
          {displayRows.slice(3).map((row, idx) => (
            <div key={idx} className="lb-row">
              <span className="lb-row__rank">{row.rank || idx + 4}</span>
              <div className="lb-row__avatar">{row.avatar_initials}</div>
              <div className="lb-row__info">
                <span className="lb-row__name">{row.name}</span>
                <span className="lb-row__school">{row.school}</span>
              </div>
              {row.sub_metric && <span className="lb-row__sub">{row.sub_metric}</span>}
              <span className="lb-row__value">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function StatsBanner() {
  const [stats, setStats] = useState([
    { value: '10,000+', label: 'Câu hỏi', icon: '' },
    { value: '500+',    label: 'Đề thi',  icon: '' },
    { value: '50,000+', label: 'Lượt thi', icon: '' },
    { value: '3',       label: 'Môn học', icon: '' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stats/dashboard');
        
        setStats([
          { value: response.data.questions, label: 'Câu hỏi', icon: '' },
          { value: response.data.exams, label: 'Đề thi', icon: '' },
          { value: response.data.attempts, label: 'Lượt thi', icon: '' },
          { value: response.data.subjects, label: 'Môn học', icon: '' },
        ]);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        // Keep default stats on error
      }
    };

    fetchStats();
  }, []);

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

  // Fetch from API, fallback to mock data
  const [subjects, setSubjects]       = useState([]);
  const [featuredExams, setFeaturedExams] = useState([]);

  useEffect(() => {
    subjectApi.list()
      .then(res => {
        const arr = toArray(res.data);
        if (arr.length) setSubjects(arr);
      })
      .catch(() => {}); // keep mock data on error

    examApi.list({ per_page: 20 })
      .then(res => {
        const arr = toArray(res.data).slice(0, 8); // Limit to 8 (2 rows of 4)
        if (arr.length) setFeaturedExams(arr);
      })
      .catch(() => {});
  }, []);

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
          <h1 className="hero__title">
            Ôn thi hiệu quả với <br />
            <span className="hero__title-highlight">LingoHub</span>
          </h1>
          <p className="hero__subtitle">
            Hàng nghìn đề thi, câu hỏi trắc nghiệm được phân loại theo khối ngành.
            Luyện tập với giải thích chi tiết hoặc thi thử đúng áp lực thật.
          </p>

          <div className="hero__search">
            <SearchBar query={searchQuery} setQuery={setSearchQuery} onSearch={handleSearch} categories={[]} />
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

      {/* ── Subjects (Môn học) ── */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Môn học</h2>
              <p className="section__subtitle">Chọn môn học phù hợp để bắt đầu ôn luyện</p>
            </div>
          </div>
          <div className="subjects-grid">
            {subjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
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
            <Link to="/on-tap" className="btn btn-orange" style={{ fontSize: '15px', padding: '12px 28px', background: 'rgb(255, 255, 255)', color: 'rgb(27, 58, 107)', fontWeight: '600' }}>
              Luyện tập ngay
            </Link>
            <Link to="/exams" className="btn" style={{ background: 'rgb(255, 255, 255)', color: 'rgb(27, 58, 107)', fontSize: '15px', padding: '12px 28px', fontWeight: '600', border: '2px solid rgb(27, 58, 107)' }}>
              Thi thử
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
