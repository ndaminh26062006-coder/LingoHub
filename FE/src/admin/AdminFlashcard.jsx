import { useState, useEffect } from 'react';
import { adminApi, toArray } from '../services/api';
import './AdminLayout.css';

const BLANK = { name:'', subject:'', visibility:'public', owner_type:'admin', status:'published' };

export default function AdminFlashcard() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterOwner, setFilterOwner] = useState('all');
  const [modal, setModal]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const ms = !q || i.name.toLowerCase().includes(q) || i.subject.toLowerCase().includes(q);
    const mo = filterOwner==='all' || (filterOwner==='admin' ? i.owner==='admin' : i.owner!=='admin');
    return ms && mo;
  });

  useEffect(() => {
    adminApi.flashcards()
      .then(res => setItems(toArray(res.data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const d = modal.data;
    if (!d.name.trim()) return;
    try {
      if (modal.mode === 'add') {
        // For admin, create via flashcard API
        const res = await adminApi.flashcards();
        const arr = toArray(res.data);
        setItems(arr);
      } else {
        const res = await adminApi.updateFlashcard(d.id, d);
        setItems(p => p.map(i => i.id === d.id ? { ...i, ...res.data } : i));
      }
      setModal(null);
    } catch {}
  };

  const setE = f => e => setModal(m => ({...m,data:{...m.data,[f]:e.target.value}}));

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Flashcard</h1>
          <p className="admin-page-sub">{items.length} bộ thẻ · {items.filter(i=>i.owner_type==='admin').length} của Admin · {items.filter(i=>i.owner_type!=='admin').length} cộng đồng</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal({mode:'add',data:{...BLANK}})}>+ Thêm bộ thẻ</button>
      </div>

      <div className="admin-card" style={{marginBottom:16}}>
        <div className="admin-filter-bar">
          <div className="admin-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm bộ thẻ..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="admin-form-select" style={{width:160}} value={filterOwner} onChange={e=>setFilterOwner(e.target.value)}>
            <option value="all">Tất cả nguồn</option>
            <option value="admin">Admin</option>
            <option value="community">Cộng đồng</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Tên bộ thẻ</th><th>Môn học</th><th>Số thẻ</th><th>Nguồn</th><th>Chế độ</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td style={{fontWeight:700,color:'var(--text-primary)'}}>{i.name}</td>
                  <td style={{fontSize:12}}>{i.subject}</td>
                  <td style={{textAlign:'center',fontWeight:600}}>{i.cardCount}</td>
                  <td>
                    {i.owner==='admin'
                      ? <span className="admin-badge admin-badge--orange">Admin</span>
                      : <span className="admin-badge admin-badge--blue" style={{fontSize:11,maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',display:'inline-block'}}>{i.owner}</span>
                    }
                  </td>
                  <td>
                    <span className={`admin-badge ${i.visibility==='public'?'admin-badge--green':'admin-badge--gray'}`}>
                      {i.visibility==='public'?'🌐 Công khai':'🔒 Riêng tư'}
                    </span>
                  </td>
                  <td><span className={`admin-badge ${i.status==='published'?'admin-badge--green':'admin-badge--gray'}`}>{i.status==='published'?'Hiển thị':'Ẩn'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={()=>setModal({mode:'edit',data:{...i}})}>Sửa</button>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={()=>setDeleteId(i.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={7}><div className="admin-empty"><span></span><p>Không có bộ thẻ nào</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="admin-modal-overlay" onClick={()=>setModal(null)}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">{modal.mode==='add'?'+ Thêm bộ thẻ Admin':' Sửa bộ thẻ'}</span>
              <button className="admin-modal__close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-grid admin-form-grid--1">
                <div className="admin-form-group">
                  <label className="admin-form-label">Tên bộ thẻ *</label>
                  <input className="admin-form-input" value={modal.data.name} onChange={setE('name')} placeholder="VD: Triết học Mác-Lênin" />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Môn học</label>
                  <input className="admin-form-input" value={modal.data.subject} onChange={setE('subject')} placeholder="VD: Triết học" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Chế độ hiển thị</label>
                  <select className="admin-form-select" value={modal.data.visibility} onChange={setE('visibility')}>
                    <option value="public">🌐 Công khai</option>
                    <option value="private">🔒 Riêng tư</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Trạng thái</label>
                  <select className="admin-form-select" value={modal.data.status} onChange={setE('status')}>
                    <option value="published">Hiển thị</option>
                    <option value="draft">Ẩn</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={()=>setModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={!modal.data.name.trim()}>{modal.mode==='add'?'+ Thêm':'💾 Lưu'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-overlay" onClick={()=>setDeleteId(null)}>
          <div className="admin-modal" style={{maxWidth:380}} onClick={e=>e.stopPropagation()}>
            <div className="admin-modal__head"><span className="admin-modal__title">🗑️ Xóa bộ thẻ</span><button className="admin-modal__close" onClick={()=>setDeleteId(null)}>✕</button></div>
            <div className="admin-modal__body"><p style={{fontSize:14,lineHeight:1.6,color:'var(--text-secondary)'}}>Xóa bộ thẻ này? Không thể hoàn tác.</p></div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={()=>setDeleteId(null)}>Hủy</button>
              <button className="btn btn-primary" style={{background:'#ef4444'}} onClick={async()=>{ try{ await adminApi.deleteFlashcard(deleteId); setItems(p=>p.filter(i=>i.id!==deleteId)); }catch{} setDeleteId(null); }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
