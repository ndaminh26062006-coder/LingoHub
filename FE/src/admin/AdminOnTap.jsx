import { useState } from 'react';
import './AdminLayout.css';

const INIT = [
  { id:1, name:'Triết học Mác-Lênin', category:'Đại cương', subjects:6, exams:14, questions:700, status:'active' },
  { id:2, name:'Tư tưởng Hồ Chí Minh', category:'Đại cương', subjects:4, exams:12, questions:600, status:'active' },
  { id:3, name:'Lịch sử Đảng', category:'Đại cương', subjects:3, exams:10, questions:500, status:'active' },
  { id:4, name:'Kinh tế vi mô', category:'Kinh tế', subjects:5, exams:22, questions:1100, status:'active' },
  { id:5, name:'Kinh tế vĩ mô', category:'Kinh tế', subjects:5, exams:20, questions:1000, status:'active' },
  { id:6, name:'Cấu trúc dữ liệu & GT', category:'Chuyên ngành', subjects:4, exams:28, questions:1400, status:'active' },
  { id:7, name:'Mạng máy tính', category:'Chuyên ngành', subjects:3, exams:20, questions:1000, status:'draft' },
];

const CATS = ['Đại cương','Kinh tế','Chuyên ngành'];

export default function AdminOnTap() {
  const [items, setItems] = useState(INIT);
  const [search, setSearch] = useState('');
  const [modal, setModal]  = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const BLANK = { name:'', category:'Đại cương', subjects:0, exams:0, questions:0, status:'draft' };

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    const d = modal.data;
    if (!d.name.trim()) return;
    setItems(prev => modal.mode === 'add'
      ? [...prev, { ...d, id: Date.now() }]
      : prev.map(i => i.id === d.id ? d : i));
    setModal(null);
  };

  const setE = f => e => setModal(m => ({ ...m, data: { ...m.data, [f]: e.target.value } }));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đề ôn tập</h1>
          <p className="admin-page-sub">{items.length} khối môn học</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ mode:'add', data:{ ...BLANK } })}>+ Thêm khối môn</button>
      </div>

      <div className="admin-card" style={{ marginBottom:16 }}>
        <div className="admin-filter-bar">
          <div className="admin-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm môn học..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Tên môn học</th><th>Khối ngành</th><th>Môn con</th><th>Đề thi</th><th>Câu hỏi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td style={{ fontWeight:700, color:'var(--text-primary)' }}>{i.name}</td>
                  <td><span className="admin-badge admin-badge--blue">{i.category}</span></td>
                  <td style={{ textAlign:'center', fontWeight:600 }}>{i.subjects}</td>
                  <td style={{ textAlign:'center', fontWeight:600 }}>{i.exams}</td>
                  <td style={{ textAlign:'center', fontWeight:600 }}>{i.questions.toLocaleString()}</td>
                  <td><span className={`admin-badge ${i.status==='active'?'admin-badge--green':'admin-badge--gray'}`}>{i.status==='active'?'Hiển thị':'Ẩn'}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={() => setModal({ mode:'edit', data:{...i} })}>Sửa</button>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={() => setDeleteId(i.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">{modal.mode==='add'?'+ Thêm khối môn':'✏️ Sửa khối môn'}</span>
              <button className="admin-modal__close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-grid admin-form-grid--1">
                <div className="admin-form-group">
                  <label className="admin-form-label">Tên môn học *</label>
                  <input className="admin-form-input" value={modal.data.name} onChange={setE('name')} placeholder="VD: Triết học Mác-Lênin" />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Khối ngành</label>
                  <select className="admin-form-select" value={modal.data.category} onChange={setE('category')}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Trạng thái</label>
                  <select className="admin-form-select" value={modal.data.status} onChange={setE('status')}>
                    <option value="active">Hiển thị</option>
                    <option value="draft">Ẩn</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={!modal.data.name.trim()}>{modal.mode==='add'?'+ Thêm':'💾 Lưu'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth:380 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__head"><span className="admin-modal__title">🗑️ Xóa khối môn</span><button className="admin-modal__close" onClick={() => setDeleteId(null)}>✕</button></div>
            <div className="admin-modal__body"><p style={{ fontSize:14,lineHeight:1.6,color:'var(--text-secondary)' }}>Bạn có chắc muốn xóa khối môn này?</p></div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Hủy</button>
              <button className="btn btn-primary" style={{ background:'#ef4444' }} onClick={() => { setItems(p=>p.filter(i=>i.id!==deleteId)); setDeleteId(null); }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
