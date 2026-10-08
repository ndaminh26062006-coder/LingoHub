import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { essayApi, subjectApi, categoryApi, toArray } from '../services/api';
import useFreemium from '../hooks/useFreemium';
import PageHeader from '../components/PageHeader';
import QuickLikeWidget from '../components/QuickLikeWidget';
import CommentsModal from '../components/CommentsModal';
import AccessDeniedModal from '../components/AccessDeniedModal';
import './ExamsPage.css';

export default function EssaysPage() {
  const navigate = useNavigate();
  const { checkAccess } = useFreemium();

  // State for Subjects view
  const [subjects,      setSubjects]      = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search,        setSearch]        = useState('');

  // State for Essays view (after selecting subject)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [essays,        setEssays]        = useState([]);
  const [essaysLoading, setEssaysLoading] = useState(false);
  const [searchEssays,  setSearchEssays]  = useState('');
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

  // Load essays when subject is selected
  const selectSubject = useCallback((subject) => {
    setSelectedSubjectId(subject.id);
    setSelectedSubject(subject);
    setSearchEssays('');
    setSortTime('newest');
    setEssaysLoading(true);

    essayApi.list({ subject: subject.id })
      .then(res => { const essaysData = res.data.data || res.data || []; setEssays(essaysData); setEssaysLoading(false); })
      .catch(err => { console.error('Failed to load essays:', err); setEssays([]); setEssaysLoading(false); });
  }, []);

  // Filter and sort essays
  const filteredEssays = essays
    .filter(essay => essay.title.toLowerCase().includes(searchEssays.toLowerCase()) || 
                    essay.question?.toLowerCase().includes(searchEssays.toLowerCase()) || 
                    essay.chapter?.toLowerCase().includes(searchEssays.toLowerCase()))
    .sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return sortTime === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Handle essay button click with freemium check
  const handleEssayClick = useCallback(async (essay) => {
    const result = await checkAccess('essay');
    if (result.can_access) {
      // Check if user has access to this subject
      const token = localStorage.getItem('lh_token');
      if (token && selectedSubject?.id) {
        try {
          const response = await fetch('http://localhost:8000/api/subscriptions/check-subject', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject_id: selectedSubject.id }),
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
      
      navigate(`/essays/${essay.id}`);
    }
    // If can't access, checkAccess already shows paywall modal
  }, [navigate, checkAccess, selectedSubject]);

  return (
    <div className="exams-page page-enter">
      <PageHeader title="Câu hỏi tự luận" subtitle="Chọn môn học để luyện tập" />

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
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); selectSubject(subject); }}>→ Xem câu hỏi</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          // ESSAYS VIEW
          <>
            <aside className="exams-filters">
              <div className="filter-group">
                <label className="filter-label">Tìm kiếm</label>
                <div className="filter-search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input type="text" placeholder="Tên câu hỏi..." value={searchEssays} onChange={e => setSearchEssays(e.target.value)} />
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
                <button className="btn btn-outline" onClick={() => { setSelectedSubjectId(null); setSelectedSubject(null); setEssays([]); setSearchEssays(''); }}>← Quay lại</button>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Câu hỏi tự luận - {selectedSubject?.name}</h2>
              </div>

              {essaysLoading ? (
                <div className="exams-empty"><span></span><p>Đang tải...</p></div>
              ) : filteredEssays.length === 0 ? (
                <div className="exams-empty"><span></span><p>Không tìm thấy câu hỏi nào.</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredEssays.map(essay => (
                    <div key={essay.id} className="exam-list-card" style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'stretch' }}>
                      <div style={{ flex: 1 }}>
                        <div className="exam-list-card__top" style={{ marginBottom: '10px' }}>
                          <span className="exam-list-card__cat">{essay.subject_model?.category?.icon} {essay.subject_model?.category?.name || ''}</span>
                        </div>
                        <h3 className="exam-list-card__title" style={{ marginBottom: '10px' }}>
                          {essay.title.split(' - ')[0]} - {essay.question?.substring(0, 80)}{essay.question && essay.question.length > 80 ? '...' : ''}
                        </h3>
                        {essay.chapter && <p className="exam-list-card__desc" style={{ fontSize: '12px', color: 'var(--navy)', fontWeight: '600', marginBottom: '8px' }}>📑 {essay.chapter}</p>}
                        {essay.question && <p className="exam-list-card__desc" style={{ fontSize: '12px', lineHeight: 1.4, marginBottom: '8px' }}>{essay.question.substring(0, 80)}{essay.question.length > 80 ? '...' : ''}</p>}
                        <div className="exam-list-card__meta" style={{ marginBottom: '12px' }}>
                          <span>Tự luận</span>
                          <span>{essay.time_limit ?? 40} phút</span>
                        </div>
                        <QuickLikeWidget 
                          likeableType="EssayQuestion" 
                          likeableId={essay.id}
                          onViewComments={() => {
                            setSelectedItemForComments({ type: 'EssayQuestion', id: essay.id, title: essay.title });
                            setCommentsModalOpen(true);
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="btn btn-primary" onClick={() => handleEssayClick(essay)}>✍️ Làm bài</button>
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
