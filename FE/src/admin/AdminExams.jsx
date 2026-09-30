import { useState } from 'react';
import './AdminLayout.css';

const INIT_EXAMS = [
  { id: 1, title: 'Kinh tế vi mô - Đề thi cuối kỳ 2024', subject: 'Kinh tế vi mô', category: 'Kinh tế', questions: 50, duration: 60, difficulty: 'Trung bình', attempts: 3420, status: 'published' },
  { id: 2, title: 'Toán cao cấp A1 - Đề thi HK1 2023-2024', subject: 'Toán cao cấp', category: 'Đại cương', questions: 50, duration: 90, difficulty: 'Khó', attempts: 5120, status: 'published' },
  { id: 3, title: 'Cấu trúc dữ liệu - Đề ôn tập tổng hợp', subject: 'CTDL & GT', category: 'Chuyên ngành', questions: 50, duration: 75, difficulty: 'Khó', attempts: 2890, status: 'published' },
  { id: 4, title: 'Tư tưởng HCM - Bộ đề 200 câu', subject: 'Tư tưởng HCM', category: 'Đại cương', questions: 50, duration: 50, difficulty: 'Dễ', attempts: 8900, status: 'published' },
  { id: 5, title: 'Kinh tế vĩ mô - Đề thi giữa kỳ', subject: 'Kinh tế vĩ mô', category: 'Kinh tế', questions: 40, duration: 45, difficulty: 'Trung bình', attempts: 1240, status: 'draft' },
];

const DIFF_OPTS = ['Dễ', 'Trung bình', 'Khó'];
const CAT_OPTS  = ['Đại cương', 'Kinh tế', 'Chuyên ngành'];

const BLANK = { title:'', subject:'', category:'Đại cương', questions:50, duration:60, difficulty:'Trung bình', status:'draft' };

export default function AdminExams() {
  const [exams, setExams]   = useState(INIT_EXAMS);
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState(null); // null | { mode:'add'|'edit', data }
  const [deleteId, setDeleteId] = useState(null);

  const filtered = exams.filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()));

  const openAdd  = () => setModal({ mode:'add',  data: { ...BLANK } });
  const openEdit = e  => setModal({ mode:'edit', data: { ...e } });

  const handleSave = () => {
    const d = modal.data;
    if (!d.title.trim()) return;
    if (modal.mode === 'add') {
      setExams(es => [...es, { ...d, id: Date.now(), attempts: 0 }]);
    } else {
      setExams(es => es.map(e => e.id === d.id ? d : e));
    }
    setModal(null);
  };

  const handleDelete = id => { setExams(es => es.filter(e => e.id !== id)); setDeleteId(null); };

  const set = f => v => setModal(m => ({ ...m, data: { ...m.data, [f]: v } }));
  const setE = f => e => set(f)(e.target.value);

  const diffBadge = d => ({
    'Dễ':        <span className="admin-badge admin-badge--green">{d}</span>,
    'Trung bình':<span className="admin-badge admin-badge--orange">{d}</span>,
    'Khó':       <span className="admin-badge admin-badge--red">{d}</span>,
  })[d] || d;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đề thi thử</h1>
          <p className="admin-page-sub">{exams.length} đề thi trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm đề thi</button>
      </div>

      <div className="admin-card" style={{ marginBottom:16 }}>
        <div className="admin-filter-bar">
          <div className="admin-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm đề thi..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize:13, color:'var(--text-muted)', marginLeft:'auto' }}>{filtered.length} đề</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Tên đề thi</th><th>Môn học</th><th>Khối ngành</th><th>Câu</th><th>Phút</th><th>Độ khó</th><th>Lượt thi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight:700, color:'var(--text-primary)', maxWidth:260 }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.title}</div>
                  </td>
                  <td style={{ fontSize:12 }}>{e.subject}</td>
                  <td><span className="admin-badge admin-badge--blue">{e.category}</span></td>
                  <td style={{ textAlign:'center', fontWeight:600 }}>{e.questions}</td>
                  <td style={{ textAlign:'center' }}>{e.duration}'</td>
                  <td>{diffBadge(e.difficulty)}</td>
                  <td style={{ fontWeight:700, color:'var(--navy)' }}>{e.attempts.toLocaleString()}</td>
                  <td>
                    <span className={`admin-badge ${e.status === 'published' ? 'admin-badge--green' : 'admin-badge--gray'}`}>
                      {e.status === 'published' ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={() => openEdit(e)}>Sửa</button>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={() => setDeleteId(e.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9}><div className="admin-empty"><span>📝</span><p>Không có đề thi nào</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal admin-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">{modal.mode === 'add' ? '+ Thêm đề thi mới' : '✏️ Sửa đề thi'}</span>
              <button className="admin-modal__close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-grid admin-form-grid--1">
                <div className="admin-form-group">
                  <label className="admin-form-label">Tên đề thi *</label>
                  <input className="admin-form-input" placeholder="VD: Kinh tế vi mô - Đề thi cuối kỳ 2024" value={modal.data.title} onChange={setE('title')} />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Môn học</label>
                  <input className="admin-form-input" placeholder="VD: Kinh tế vi mô" value={modal.data.subject} onChange={setE('subject')} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Khối ngành</label>
                  <select className="admin-form-select" value={modal.data.category} onChange={setE('category')}>
                    {CAT_OPTS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Số câu hỏi</label>
                  <input className="admin-form-input" type="number" min={1} value={modal.data.questions} onChange={setE('questions')} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Thời gian (phút)</label>
                  <input className="admin-form-input" type="number" min={1} value={modal.data.duration} onChange={setE('duration')} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Độ khó</label>
                  <select className="admin-form-select" value={modal.data.difficulty} onChange={setE('difficulty')}>
                    {DIFF_OPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Trạng thái</label>
                  <select className="admin-form-select" value={modal.data.status} onChange={setE('status')}>
                    <option value="draft">Nháp</option>
                    <option value="published">Đăng ngay</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!modal.data.title.trim()}>
                {modal.mode === 'add' ? '+ Thêm đề thi' : '💾 Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth:380 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__head"><span className="admin-modal__title">🗑️ Xóa đề thi</span><button className="admin-modal__close" onClick={() => setDeleteId(null)}>✕</button></div>
            <div className="admin-modal__body"><p style={{ fontSize:14,color:'var(--text-secondary)',lineHeight:1.6 }}>Bạn có chắc muốn xóa đề thi này? Hành động không thể hoàn tác.</p></div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Hủy</button>
              <button className="btn btn-primary" style={{ background:'#ef4444' }} onClick={() => handleDelete(deleteId)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
