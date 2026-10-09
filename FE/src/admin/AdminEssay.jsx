import { useState, useEffect } from 'react';
import { categoryApi, subjectApi, adminApi, toArray } from '../services/api';
import Pagination from '../components/Pagination';
import './AdminLayout.css';

const BLANK = {
  title: '', category_id: '', subject_id: '', subject: '',
  chapter: '', time_limit: 40, question: '', hint: '',
  status: 'published',
};

export default function AdminEssay() {
  const [items,      setItems]      = useState([]);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);
  const [categories, setCategories] = useState([]);
  const [subjects,   setSubjects]   = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubjects, setFilterSubjects] = useState([]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({ total: 0, last_page: 1, per_page: 8 });

  // Load câu hỏi với pagination
  useEffect(() => {
    setLoading(true);
    const params = { page: currentPage, per_page: 8 };
    if (search) params.q = search;
    if (filterCategory) params.category = filterCategory;
    if (filterSubjects.length > 0) params.subjects = filterSubjects.join(',');

    adminApi.essays(params)
      .then(res => {
        const apiData = res.data;
        const essayData = Array.isArray(apiData.data) ? apiData.data : [];
        setItems(essayData);
        setPaginationData({
          total: apiData.total || 0,
          last_page: apiData.last_page || 1,
          per_page: apiData.per_page || 8,
          current_page: apiData.current_page || 1
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentPage, search, filterCategory, filterSubjects]);

  // Load categories
  useEffect(() => {
    categoryApi.list()
      .then(res => setCategories(toArray(res.data)))
      .catch(() => {});
  }, []);

  // Load all subjects (independent from category)
  useEffect(() => {
    subjectApi.list()
      .then(res => setSubjects(toArray(res.data)))
      .catch(() => setSubjects([]));
  }, []);

  const handleCategoryChange = (value) => {
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const filtered = items.filter(i =>
    !search || i.title?.toLowerCase().includes(search.toLowerCase())
  );

  const setField = f => v  => setModal(m => ({ ...m, data: { ...m.data, [f]: v } }));
  const setE     = f => e  => setField(f)(e.target.value);

  const openAdd  = () => setModal({ mode: 'add',  data: { ...BLANK } });
  const openEdit = i  => setModal({ mode: 'edit', data: { ...i, category_id: i.category?.id || i.category_id || '' } });

  const save = async () => {
    const d = modal.data;
    if (!d.title.trim()) return;
    try {
      const payload = { ...d, status: 'published' };
      // Format title: "Đề X - [question text]"
      if (d.question && d.question.trim()) {
        const questionPreview = d.question.substring(0, 150).trim();
        payload.title = `${d.title} - ${questionPreview}`;
      }
      if (modal.mode === 'add') {
        const res = await adminApi.createEssay(payload);
        setItems(p => [res.data, ...p]);
      } else {
        const res = await adminApi.updateEssay(d.id, payload);
        setItems(p => p.map(i => i.id === d.id ? res.data : i));
      }
      setModal(null);
    } catch (err) {
      alert('Có lỗi: ' + (err?.response?.data?.message || ''));
    }
  };

  const toggleStatus = async item => {
    try {
      const newStatus = item.status === 'published' ? 'draft' : 'published';
      const res = await adminApi.updateEssay(item.id, { status: newStatus });
      setItems(p => p.map(i => i.id === item.id ? { ...i, status: res.data.status } : i));
    } catch {}
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Câu hỏi tự luận</h1>
          <p className="admin-page-sub">{items.length} câu hỏi</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm câu hỏi</button>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="admin-search" style={{ flex: 1, minWidth: 200 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm câu hỏi..." value={search} onChange={e => handleSearch(e.target.value)} />
          </div>

          <select 
            className="admin-form-select" 
            value={filterCategory} 
            onChange={e => handleCategoryChange(e.target.value)}
            style={{ padding: '6px 10px', fontSize: 12, minWidth: 120, flex: 0.5 }}
          >
            <option value="">Danh mục</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
          </select>

          <button 
            className="btn btn-outline" 
            onClick={() => setShowSubjectModal(true)}
            style={{ padding: '6px 12px', fontSize: 12, minWidth: 120 }}
          >
            📚 Môn ({filterSubjects.length})
          </button>

          <span style={{ fontSize:12, color:'var(--text-muted)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>{items.length} / {paginationData.total} kết quả</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Tiêu đề</th><th>Môn học</th><th>Danh mục</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div className="admin-empty"><span></span><p>Đang tải...</p></div></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6}><div className="admin-empty"><span></span><p>Không có câu hỏi nào</p></div></td></tr>
              ) : items.map(i => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)', maxWidth: 280 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.title}</div>
                  </td>
                  <td style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {i.subject || i.subject_model?.name || '—'}
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--blue">
                      {i.category?.name || i.subject_model?.category?.name || '—'}
                    </span>
                  </td>
                  <td>{i.time_limit ?? i.time ?? 40} phút</td>
                  <td>
                    <span className={`admin-badge ${i.status === 'published' ? 'admin-badge--green' : 'admin-badge--gray'}`}>
                      {i.status === 'published' ? 'Đã đăng' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={() => openEdit(i)}>Sửa</button>
                      <button className="admin-action-btn" onClick={() => toggleStatus(i)}>
                        {i.status === 'published' ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Multi-Select Modal */}
      {showSubjectModal && (
        <div className="admin-modal-overlay" onClick={() => setShowSubjectModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">Chọn môn học</span>
              <button className="admin-modal__close" onClick={() => setShowSubjectModal(false)}>✕</button>
            </div>
            <div className="admin-modal__body" style={{ padding: '20px' }}>
              {subjects.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Không có môn học nào</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {subjects.map(sub => (
                    <label 
                      key={sub.id} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        padding: '16px', 
                        cursor: 'pointer', 
                        border: '2px solid var(--gray-200)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        background: filterSubjects.includes(String(sub.id)) ? 'var(--blue-50)' : 'white',
                        borderColor: filterSubjects.includes(String(sub.id)) ? 'var(--navy)' : 'var(--gray-200)',
                      }}
                      onMouseOver={e => {
                        if (!filterSubjects.includes(String(sub.id))) {
                          e.currentTarget.style.borderColor = 'var(--gray-300)';
                        }
                      }}
                      onMouseOut={e => {
                        if (!filterSubjects.includes(String(sub.id))) {
                          e.currentTarget.style.borderColor = 'var(--gray-200)';
                        }
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{sub.icon}</div>
                      <span style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: 'var(--text-primary)' }}>{sub.name}</span>
                      <input 
                        type="checkbox" 
                        checked={filterSubjects.includes(String(sub.id))}
                        onChange={e => {
                          if (e.target.checked) {
                            setFilterSubjects(p => [...p, String(sub.id)]);
                          } else {
                            setFilterSubjects(p => p.filter(id => id !== String(sub.id)));
                          }
                          setCurrentPage(1);
                        }}
                        style={{ cursor: 'pointer', width: 18, height: 18, minWidth: 18, minHeight: 18, margin: 0, padding: 0 }}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-primary" onClick={() => setShowSubjectModal(false)}>Xong</button>
            </div>
          </div>
        </div>
      )}

      <Pagination 
        currentPage={currentPage} 
        lastPage={paginationData.last_page} 
        onPageChange={setCurrentPage} 
      />

      {/* Modal thêm/sửa */}
      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal admin-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">{modal.mode === 'add' ? '+ Thêm câu hỏi tự luận' : '✏️ Sửa câu hỏi'}</span>
              <button className="admin-modal__close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="admin-modal__body">

              {/* Tiêu đề */}
              <div className="admin-form-group">
                <label className="admin-form-label">Tiêu đề *</label>
                <input className="admin-form-input" value={modal.data.title} onChange={setE('title')} placeholder="VD: Tư tưởng HCM về đạo đức cách mạng" />
              </div>

              {/* Danh mục */}
              <div className="admin-form-group">
                <label className="admin-form-label">Danh mục</label>
                <select className="admin-form-select" value={modal.data.category_id}
                  onChange={e => { setField('category_id')(e.target.value); setField('subject_id')(''); setField('subject')(''); }}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>

              {/* Môn học */}
              <div className="admin-form-group">
                <label className="admin-form-label">Môn học</label>
                <select className="admin-form-select" value={modal.data.subject_id}
                  onChange={e => {
                    setField('subject_id')(e.target.value);
                    const found = subjects.find(s => String(s.id) === e.target.value);
                    if (found) setField('subject')(found.name);
                  }}
                  disabled={!modal.data.category_id}>
                  <option value="">{modal.data.category_id ? '-- Chọn môn học --' : '-- Chọn danh mục trước --'}</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                </select>
              </div>

              {/* Thời gian + Chương */}
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Thời gian (phút)</label>
                  <input className="admin-form-input" type="number" min={10} value={modal.data.time_limit || 40} onChange={setE('time_limit')} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tên chương <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(không bắt buộc)</span></label>
                  <input className="admin-form-input" placeholder="VD: Chương 3 - Phép biện chứng" value={modal.data.chapter || ''} onChange={setE('chapter')} />
                </div>
              </div>

              {/* Nội dung */}
              <div className="admin-form-group">
                <label className="admin-form-label">Nội dung câu hỏi</label>
                <textarea className="admin-form-textarea" rows={3} value={modal.data.question || ''} onChange={setE('question')} placeholder="Nhập đề bài câu hỏi tự luận..." />
              </div>

              {/* Gợi ý */}
              <div className="admin-form-group">
                <label className="admin-form-label">Gợi ý cho sinh viên</label>
                <textarea className="admin-form-textarea" rows={2} value={modal.data.hint || ''} onChange={setE('hint')} placeholder="VD: Trình bày: luận điểm 1, 2, 3..." />
              </div>
            </div>

            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={!modal.data.title.trim()}>
                {modal.mode === 'add' ? '+ Thêm' : '💾 Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
