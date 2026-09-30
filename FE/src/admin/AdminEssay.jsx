import { useState } from 'react';
import './AdminLayout.css';

const INIT = [
  { id:1, title:'Tư tưởng HCM về vấn đề dân tộc', subject:'Tư tưởng HCM', difficulty:'Trung bình', time:45, attempts:320, status:'published' },
  { id:2, title:'Ý nghĩa Cách mạng tháng Tám 1945', subject:'Lịch sử Đảng', difficulty:'Trung bình', time:40, attempts:280, status:'published' },
  { id:3, title:'Quy luật giá trị trong kinh tế hàng hóa', subject:'Kinh tế CT', difficulty:'Khó', time:45, attempts:195, status:'published' },
  { id:4, title:'Sứ mệnh lịch sử của giai cấp công nhân', subject:'CNXHKH', difficulty:'Trung bình', time:40, attempts:142, status:'published' },
  { id:5, title:'Bản chất và chức năng của nhà nước', subject:'Pháp luật', difficulty:'Dễ', time:35, attempts:89, status:'draft' },
  { id:6, title:'Phép biện chứng duy vật - 3 quy luật', subject:'Triết học', difficulty:'Khó', time:50, attempts:211, status:'published' },
];

const DIFFS = ['Dễ','Trung bình','Khó'];
const SUBJECTS = ['Tư tưởng HCM','Lịch sử Đảng','Triết học','Kinh tế CT','CNXHKH','Pháp luật'];
const BLANK = { title:'', subject:'Triết học', difficulty:'Trung bình', time:40, question:'', hint:'', sampleAnswer:'', status:'draft' };

export default function AdminEssay() {
  const [items, setItems] = useState(INIT);
  const [search, setSearch] = useState('');
  const [modal, setModal]  = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = items.filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.subject.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    const d = modal.data;
    if (!d.title.trim()) return;
    setItems(p => modal.mode==='add' ? [...p,{...d,id:Date.now(),attempts:0}] : p.map(i=>i.id===d.id?d:i));
    setModal(null);
  };

  const setE = f => e => setModal(m => ({ ...m, data:{...m.data,[f]:e.target.value} }));

  const diffBadge = d => ({ 'Dễ':<span className="admin-badge admin-badge--green">{d}</span>, 'Trung bình':<span className="admin-badge admin-badge--orange">{d}</span>, 'Khó':<span className="admin-badge admin-badge--red">{d}</span> })[d];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Câu hỏi tự luận</h1>
          <p className="admin-page-sub">{items.length} câu hỏi</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ mode:'add', data:{...BLANK} })}>+ Thêm câu hỏi</button>
      </div>

      <div className="admin-card" style={{ marginBottom:16 }}>
        <div className="admin-filter-bar">
          <div className="admin-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm câu hỏi..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Tiêu đề</th><th>Môn học</th><th>Độ khó</th><th>Thời gian</th><th>Lượt làm</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td style={{ fontWeight:700, color:'var(--text-primary)', maxWidth:280 }}><div style={{ overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{i.title}</div></td>
                  <td style={{ fontSize:12 }}>{i.subject}</td>
                  <td>{diffBadge(i.difficulty)}</td>
                  <td>{i.time} phút</td>
                  <td style={{ fontWeight:700,color:'var(--navy)',textAlign:'center' }}>{i.attempts}</td>
                  <td><span className={`admin-badge ${i.status==='published'?'admin-badge--green':'admin-badge--gray'}`}>{i.status==='published'?'Đã đăng':'Nháp'}</span></td>
                  <td>
                    <div style={{ display:'flex',gap:6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={()=>setModal({mode:'edit',data:{...i}})}>Sửa</button>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={()=>setDeleteId(i.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={7}><div className="admin-empty"><span>✍️</span><p>Không có câu hỏi nào</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={()=>setModal(null)}>
          <div className="admin-modal admin-modal--wide" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">{modal.mode==='add'?'+ Thêm câu hỏi tự luận':'✏️ Sửa câu hỏi'}</span>
              <button className="admin-modal__close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-grid admin-form-grid--1">
                <div className="admin-form-group">
                  <label className="admin-form-label">Tiêu đề *</label>
                  <input className="admin-form-input" value={modal.data.title} onChange={setE('title')} placeholder="VD: Tư tưởng HCM về đạo đức cách mạng" />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Môn học</label>
                  <select className="admin-form-select" value={modal.data.subject} onChange={setE('subject')}>
                    {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Độ khó</label>
                  <select className="admin-form-select" value={modal.data.difficulty} onChange={setE('difficulty')}>
                    {DIFFS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Thời gian (phút)</label>
                  <input className="admin-form-input" type="number" min={10} value={modal.data.time} onChange={setE('time')} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Trạng thái</label>
                  <select className="admin-form-select" value={modal.data.status} onChange={setE('status')}>
                    <option value="draft">Nháp</option>
                    <option value="published">Đăng ngay</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Nội dung câu hỏi</label>
                <textarea className="admin-form-textarea" rows={3} value={modal.data.question||''} onChange={setE('question')} placeholder="Nhập đề bài câu hỏi tự luận..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Gợi ý cho sinh viên</label>
                <textarea className="admin-form-textarea" rows={2} value={modal.data.hint||''} onChange={setE('hint')} placeholder="VD: Trình bày: luận điểm 1, 2, 3..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Bài làm mẫu điểm 10</label>
                <textarea className="admin-form-textarea" rows={4} value={modal.data.sampleAnswer||''} onChange={setE('sampleAnswer')} placeholder="Nhập bài làm mẫu..." />
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={()=>setModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={!modal.data.title.trim()}>{modal.mode==='add'?'+ Thêm':'💾 Lưu'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay" onClick={()=>setDeleteId(null)}>
          <div className="admin-modal" style={{maxWidth:380}} onClick={e=>e.stopPropagation()}>
            <div className="admin-modal__head"><span className="admin-modal__title">🗑️ Xóa câu hỏi</span><button className="admin-modal__close" onClick={()=>setDeleteId(null)}>✕</button></div>
            <div className="admin-modal__body"><p style={{fontSize:14,lineHeight:1.6,color:'var(--text-secondary)'}}>Xóa câu hỏi tự luận này? Không thể hoàn tác.</p></div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={()=>setDeleteId(null)}>Hủy</button>
              <button className="btn btn-primary" style={{background:'#ef4444'}} onClick={()=>{setItems(p=>p.filter(i=>i.id!==deleteId));setDeleteId(null);}}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
