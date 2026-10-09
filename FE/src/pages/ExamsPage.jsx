import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { examApi, subjectApi, categoryApi, toArray, subscriptionApi } from '../services/api';
import useFreemium from '../hooks/useFreemium';
import PageHeader from '../components/PageHeader';
import QuickLikeWidget from '../components/QuickLikeWidget';
import CommentsModal from '../components/CommentsModal';
import AccessDeniedModal from '../components/AccessDeniedModal';
import './ExamsPage.css';

export default function ExamsPage() {
  const navigate = useNavigate();
  const { checkAccess } = useFreemium();

  // State for Subjects view
  const [subjects,      setSubjects]      = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search,        setSearch]        = useState('');

  // State for Exams view (after selecting subject)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [exams,         setExams]         = useState([]);
  const [examsLoading,  setExamsLoading]  = useState(false);
  const [searchExams,   setSearchExams]   = useState('');
  const [sortTime,      setSortTime]      = useState('newest');

  // State for Comments Modal
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedItemForComments, setSelectedItemForComments] = useState(null);

  // State for Access Denied Modal
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);

  // Load categories and subjects on mount
  useEffect(() => {
    categoryApi.list()
      .then(res => { const arr = toArray(res.data); setCategories(arr); })
      .catch(err => console.error('Failed to load categories:', err));

    subjectApi.list()
      .then(res => { const arr = toArray(res.data); setSubjects(arr); setSubjectsLoading(false); })
      .catch(err => { console.error('Failed to load subjects:', err); setSubjectsLoading(false); });
  }, []);

  // Filter subjects by category and search
  const filteredSubjects = subjects.filter(subject => {
    const matchCategory = filterCategory === 'all' || subject.category?.id == filterCategory;
    const matchSearch = subject.name.toLowerCase().includes(search.toLowerCase()) ||
                       subject.description?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Load exams when subject is selected
  const selectSubject = useCallback((subject) => {
    setSelectedSubjectId(subject.id);
    setSelectedSubject(subject);
    setSearchExams('');
    setSortTime('newest');
    setExamsLoading(true);

    examApi.list({ subject: subject.id })
      .then(res => { const examsData = res.data.data || res.data || []; setExams(examsData); setExamsLoading(false); })
      .catch(err => { console.error('Failed to load exams:', err); setExams([]); setExamsLoading(false); });
  }, []);

  // Filter and sort exams
  const filteredExams = exams
    .filter(exam => exam.title.toLowerCase().includes(searchExams.toLowerCase()) || exam.chapter?.toLowerCase().includes(searchExams.toLowerCase()))
    .sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return sortTime === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Handle exam button clicks with freemium check
  const handleExamClick = useCallback(async (exam, mode) => {
    const result = await checkAccess('exam', {
      exam_id: exam.id,
      subject_id: exam.subject_id,
    });
    if (result.can_access) {
      // checkAccess already verified access (subscription or free attempts)
      navigate(`/exam/${exam.id}?mode=${mode}`);
    }
    // If can't access, checkAccess already shows paywall modal
  }, [navigate, checkAccess]);

  return (
    <div className="exams-page page-enter">
      <PageHeader title="Đề thi thử" subtitle="Chọn môn học để luyện tập" />

      <div className="container exams-page__body">
        {selectedSubjectId === null ? (
          // SUBJECTS VIEW
          <>
            <aside className="exams-filters">
              <div className="filter-group">
                <label className="filter-label">Tìm kiếm</label>
                <div className="filter-search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input type="text" placeholder="Tên môn học..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="filter-group">
                <label className="filter-label">Khối ngành</label>
                <div className="filter-options">
                  <button className={`filter-option ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>Tất cả</button>
                  {categories.map(cat => (
                    <button key={cat.id} className={`filter-option ${filterCategory == cat.id ? 'active' : ''}`} onClick={() => setFilterCategory(cat.id)}>
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="exams-list" style={{ width: '100%' }}>
              {subjectsLoading ? (
                <div className="exams-empty"><span></span><p>Đang tải...</p></div>
              ) : filteredSubjects.length === 0 ? (
                <div className="exams-empty"><span></span><p>Không tìm thấy môn học nào.</p></div>
              ) : (
                <div className="exams-list__grid">
                  {filteredSubjects.map(subject => (
                    <div key={subject.id} className="exam-list-card" onClick={() => selectSubject(subject)} style={{ cursor: 'pointer' }}>
                      <div className="exam-list-card__top">
                        <span className="exam-list-card__cat">{subject.category?.icon} {subject.category?.name || ''}</span>
                      </div>
                      <h3 className="exam-list-card__title">{subject.name}</h3>
                      {subject.description && <p className="exam-list-card__desc">{subject.description.substring(0, 100)}{subject.description.length > 100 ? '...' : ''}</p>}
                      <div className="exam-list-card__actions">
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); selectSubject(subject); }}>→ Xem đề thi</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          // EXAMS VIEW
          <>
            <aside className="exams-filters">
              <div className="filter-group">
                <label className="filter-label">Tìm kiếm</label>
                <div className="filter-search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input type="text" placeholder="Tên đề thi..." value={searchExams} onChange={e => setSearchExams(e.target.value)} />
                </div>
              </div>
              <div className="filter-group">
                <label className="filter-label">Thời gian ra đề</label>
                <div className="filter-options">
                  <button className={`filter-option ${sortTime === 'newest' ? 'active' : ''}`} onClick={() => setSortTime('newest')}>Mới nhất</button>
                  <button className={`filter-option ${sortTime === 'oldest' ? 'active' : ''}`} onClick={() => setSortTime('oldest')}>Cũ nhất</button>
                </div>
              </div>
            </aside>

            <div className="exams-list" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <button className="btn btn-outline" onClick={() => { setSelectedSubjectId(null); setSelectedSubject(null); setExams([]); setSearchExams(''); }}>← Quay lại</button>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Đề thi - {selectedSubject?.name}</h2>
              </div>

              {examsLoading ? (
                <div className="exams-empty"><span></span><p>Đang tải...</p></div>
              ) : filteredExams.length === 0 ? (
                <div className="exams-empty"><span></span><p>Không tìm thấy đề thi nào.</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredExams.map(exam => (
                    <div key={exam.id} className="exam-list-card" style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'stretch' }}>
                      <div style={{ flex: 1 }}>
                        <div className="exam-list-card__top" style={{ marginBottom: '10px' }}>
                          <span className="exam-list-card__cat">{exam.subject_model?.category?.icon} {exam.subject_model?.category?.name || ''}</span>
                        </div>
                        <h3 className="exam-list-card__title" style={{ marginBottom: '10px' }}>{exam.title}</h3>
                        {exam.chapter && <p className="exam-list-card__desc" style={{ fontSize: '12px', color: 'var(--navy)', fontWeight: '600', marginBottom: '8px' }}>📑 {exam.chapter}</p>}
                        <div className="exam-list-card__meta" style={{ marginBottom: '12px' }}>
                          <span>{exam.total_questions ?? exam.questions_count ?? 0} câu</span>
                          <span>⏱{exam.duration ?? 60} phút</span>
                          {exam.attempts > 0 && <span>{Number(exam.attempts).toLocaleString()} lượt</span>}
                        </div>
                        <QuickLikeWidget 
                          likeableType="Exam" 
                          likeableId={exam.id}
                          onViewComments={() => {
                            setSelectedItemForComments({ type: 'Exam', id: exam.id, title: exam.title });
                            setCommentsModalOpen(true);
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button className="btn btn-primary" onClick={() => handleExamClick(exam, 'exam')}>Thi thật</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Comments Modal */}
      {selectedItemForComments && (
        <CommentsModal
          isOpen={commentsModalOpen}
          onClose={() => setCommentsModalOpen(false)}
          commentableType={selectedItemForComments.type}
          commentableId={selectedItemForComments.id}
          title={selectedItemForComments.title}
        />
      )}

      {/* Access Denied Modal */}
      <AccessDeniedModal
        isOpen={accessDeniedOpen}
        onClose={() => setAccessDeniedOpen(false)}
        title="Không có quyền truy cập"
      />
    </div>
  );
}
