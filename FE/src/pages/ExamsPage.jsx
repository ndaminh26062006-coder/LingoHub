import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { examList, categories } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import './ExamsPage.css';

const DIFFICULTIES = ['Tất cả', 'Dễ', 'Trung bình', 'Khó'];

export default function ExamsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filterCat, setFilterCat] = useState('all');
  const [filterDiff, setFilterDiff] = useState('Tất cả');

  // Combine all exams from mock (use examList + extend from featuredExams)
  const allExams = useMemo(() => {
    const base = [...examList];
    // pad with more entries for demo
    const padded = [...base];
    categories.forEach(cat => {
      cat.subjects.forEach(sub => {
        padded.push({
          id: `auto-${sub.id}`,
          title: `${sub.name} - Đề luyện tập tổng hợp`,
          subject: sub.name,
          categoryId: cat.id,
          questions: 50,
          duration: 60,
          attempts: Math.floor(Math.random() * 3000 + 500),
          difficulty: ['Dễ', 'Trung bình', 'Khó'][Math.floor(Math.random() * 3)],
          rating: (4.0 + Math.random() * 0.9).toFixed(1),
          description: `Bộ đề ôn tập môn ${sub.name} bao gồm các dạng câu hỏi thường gặp.`,
        });
      });
    });
    return padded;
  }, []);

  const filtered = useMemo(() => {
    return allExams.filter(e => {
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'all' || e.categoryId === filterCat;
      const matchDiff = filterDiff === 'Tất cả' || e.difficulty === filterDiff;
      return matchSearch && matchCat && matchDiff;
    });
  }, [allExams, search, filterCat, filterDiff]);

  const diffColor = { Dễ: 'badge-green', 'Trung bình': 'badge-orange', Khó: 'badge-navy' };

  return (
    <div className="exams-page page-enter">
      <PageHeader
        title="Tất cả đề thi"
        subtitle="Chọn đề thi phù hợp và bắt đầu luyện tập"
      />

      <div className="container exams-page__body">
        {/* Filters sidebar */}
        <aside className="exams-filters">
          <div className="filter-group">
            <label className="filter-label">Tìm kiếm</label>
            <div className="filter-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Tên đề, môn học..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Khối ngành</label>
            <div className="filter-options">
              <button
                className={`filter-option ${filterCat === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCat('all')}
              >
                Tất cả
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-option ${filterCat === cat.id ? 'active' : ''}`}
                  onClick={() => setFilterCat(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Độ khó</label>
            <div className="filter-options">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  className={`filter-option ${filterDiff === d ? 'active' : ''}`}
                  onClick={() => setFilterDiff(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Exams list */}
        <div className="exams-list">
          <div className="exams-list__header">
            <p className="exams-list__count">
              <strong>{filtered.length}</strong> đề thi
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="exams-empty">
              <span>🔍</span>
              <p>Không tìm thấy đề thi nào phù hợp.</p>
            </div>
          ) : (
            <div className="exams-list__grid">
              {filtered.map(exam => (
                <div key={exam.id} className="exam-list-card">
                  <div className="exam-list-card__top">
                    <span className={`badge ${diffColor[exam.difficulty] || 'badge-navy'}`}>{exam.difficulty}</span>
                    <span className="exam-list-card__cat">
                      {categories.find(c => c.id === exam.categoryId)?.icon}{' '}
                      {categories.find(c => c.id === exam.categoryId)?.name}
                    </span>
                  </div>
                  <h3 className="exam-list-card__title">{exam.title}</h3>
                  {exam.description && (
                    <p className="exam-list-card__desc">{exam.description}</p>
                  )}
                  <div className="exam-list-card__meta">
                    <span>📝 {exam.questions} câu</span>
                    <span>⏱️ {exam.duration} phút</span>
                    <span>👥 {Number(exam.attempts).toLocaleString()} lượt</span>
                    <span>⭐ {exam.rating}</span>
                  </div>
                  <div className="exam-list-card__actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/exam/${exam.id}?mode=exam`)}
                    >
                      ⏱️ Thi thật
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => navigate(`/exam/${exam.id}?mode=practice`)}
                    >
                      📖 Luyện tập
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
