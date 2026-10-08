import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentApi, subjectApi, categoryApi, toArray, subscriptionApi } from '../services/api';
import useFreemium from '../hooks/useFreemium';
import PageHeader from '../components/PageHeader';
import QuickLikeWidget from '../components/QuickLikeWidget';
import CommentsModal from '../components/CommentsModal';
import AccessDeniedModal from '../components/AccessDeniedModal';
import './ExamsPage.css';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { checkAccess } = useFreemium();

  // State for Subjects view
  const [subjects,      setSubjects]      = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search,        setSearch]        = useState('');

  // State for Documents view (after selecting subject)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [docs,          setDocs]          = useState([]);
  const [docsLoading,   setDocsLoading]   = useState(false);
  const [searchDocs,    setSearchDocs]    = useState('');
  const [sortTime,      setSortTime]      = useState('newest');

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

  // State for Comments Modal
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedItemForComments, setSelectedItemForComments] = useState(null);

  // State for Access Denied Modal
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);

  // Load documents when subject is selected
  const selectSubject = useCallback((subject) => {
    setSelectedSubjectId(subject.id);
    setSelectedSubject(subject);
    setSearchDocs('');
    setSortTime('newest');
    setDocsLoading(true);

    documentApi.list({ subject: subject.id })
      .then(res => { const docsData = res.data.data || res.data || []; setDocs(docsData); setDocsLoading(false); })
      .catch(err => { console.error('Failed to load documents:', err); setDocs([]); setDocsLoading(false); });
  }, []);

  // Filter and sort documents
  const filteredDocs = docs
    .filter(doc => doc.title.toLowerCase().includes(searchDocs.toLowerCase()) || 
                   doc.chapter?.toLowerCase().includes(searchDocs.toLowerCase()))
    .sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return sortTime === 'newest' ? timeB - timeA : timeA - timeB;
    });

  // Handle practice button click with freemium check
  const handlePracticeClick = useCallback(async (doc) => {
    const result = await checkAccess('document');
    if (result.can_access) {
      // Check if user has access to this subject
      const token = localStorage.getItem('lh_token');
      if (token && selectedSubject?.id) {
        try {
          const response = await subscriptionApi.checkSubject({ subject_id: selectedSubject.id });
          
          const data = response.data;
          if (!data.has_access) {
            setAccessDeniedOpen(true);
            return;
          }
        } catch (err) {
          console.error('Error checking subject access:', err);
        }
      }
      
      navigate(`/document/${doc.id}?mode=practice`);
    }
    // If can't access, checkAccess already shows paywall modal
  }, [navigate, checkAccess, selectedSubject]);

  return (
    <div className="exams-page page-enter">
      <PageHeader title="Tài liệu trắc nghiệm" subtitle="Chọn môn học để luyện tập" />

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
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); selectSubject(subject); }}>→ Xem tài liệu</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          // DOCUMENTS VIEW
          <>
            <aside className="exams-filters">
              <div className="filter-group">
                <label className="filter-label">Tìm kiếm</label>
                <div className="filter-search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input type="text" placeholder="Tên tài liệu..." value={searchDocs} onChange={e => setSearchDocs(e.target.value)} />
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
                <button className="btn btn-outline" onClick={() => { setSelectedSubjectId(null); setSelectedSubject(null); setDocs([]); setSearchDocs(''); }}>← Quay lại</button>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Tài liệu - {selectedSubject?.name}</h2>
              </div>

              {docsLoading ? (
                <div className="exams-empty"><span></span><p>Đang tải...</p></div>
              ) : filteredDocs.length === 0 ? (
                <div className="exams-empty"><span></span><p>Không tìm thấy tài liệu nào.</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredDocs.map(doc => (
                    <div key={doc.id} className="exam-list-card" style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'stretch' }}>
                      <div style={{ flex: 1 }}>
                        <div className="exam-list-card__top" style={{ marginBottom: '10px' }}>
                          <span className="exam-list-card__cat">{doc.subject_model?.category?.icon} {doc.subject_model?.category?.name || ''}</span>
                        </div>
                        <h3 className="exam-list-card__title" style={{ marginBottom: '10px' }}>{doc.title}</h3>
                        {doc.chapter && <p className="exam-list-card__desc" style={{ fontSize: '12px', color: 'var(--navy)', fontWeight: '600', marginBottom: '8px' }}>📑 {doc.chapter}</p>}
                        <div className="exam-list-card__meta" style={{ marginBottom: '12px' }}>
                          <span>📝 {doc.questions_count ?? 0} câu</span>
                          {doc.attempts > 0 && <span>👥 {Number(doc.attempts).toLocaleString()} lượt</span>}
                          <span>🕐 {new Date(doc.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <QuickLikeWidget 
                          likeableType="Document" 
                          likeableId={doc.id}
                          onViewComments={() => {
                            setSelectedItemForComments({ type: 'Document', id: doc.id, title: doc.title });
                            setCommentsModalOpen(true);
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="btn btn-primary" onClick={() => handlePracticeClick(doc)}>📖 Luyện tập</button>
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
