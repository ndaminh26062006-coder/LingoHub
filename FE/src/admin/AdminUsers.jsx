import { useState } from 'react';
import './AdminLayout.css';

const INIT_USERS = [
  { id: 1, name: 'Nguyễn Minh Tuấn',    email: 'tuan.nm@hcmue.edu.vn',    school: 'ĐH Kinh tế TP.HCM',  role: 'student', status: 'active',   joined: '01/06/2024', exams: 24, streak: 12 },
  { id: 2, name: 'Trần Thị Lan Anh',    email: 'anh.ttl@bku.edu.vn',      school: 'ĐH Bách Khoa HN',    role: 'student', status: 'active',   joined: '15/05/2024', exams: 31, streak: 8  },
  { id: 3, name: 'Phạm Đức Hùng',       email: 'hung.pd@ftu.edu.vn',      school: 'ĐH Ngoại Thương',    role: 'student', status: 'active',   joined: '20/04/2024', exams: 18, streak: 5  },
  { id: 4, name: 'Lê Thị Thu Hà',       email: 'ha.ltt@hlu.edu.vn',       school: 'ĐH Luật TP.HCM',     role: 'student', status: 'blocked',  joined: '10/04/2024', exams: 6,  streak: 0  },
  { id: 5, name: 'Vũ Hoàng Nam',        email: 'nam.vh@uit.edu.vn',       school: 'ĐH CNTT TP.HCM',     role: 'student', status: 'active',   joined: '05/04/2024', exams: 42, streak: 7  },
  { id: 6, name: 'Đặng Thị Bích Ngọc', email: 'ngoc.dtb@ussh.edu.vn',    school: 'ĐH KHXH&NV',         role: 'student', status: 'active',   joined: '01/04/2024', exams: 15, streak: 3  },
  { id: 7, name: 'Hoàng Văn Khánh',     email: 'khanh.hv@hcmue.edu.vn',   school: 'ĐH Sư phạm TP.HCM',  role: 'student', status: 'active',   joined: '25/03/2024', exams: 29, streak: 9  },
  { id: 8, name: 'Bùi Thị Thanh Mai',   email: 'mai.btt@ump.edu.vn',      school: 'ĐH Y Dược TP.HCM',   role: 'student', status: 'active',   joined: '18/03/2024', exams: 20, streak: 6  },
  { id: 9, name: 'Lê Hoàng Phúc',       email: 'phuc.lh@fpt.edu.vn',      school: 'ĐH FPT',             role: 'student', status: 'active',   joined: '10/03/2024', exams: 56, streak: 15 },
  { id:10, name: 'Admin LingoHub',       email: 'admin@lingohub.vn',       school: 'LingoHub',            role: 'admin',   status: 'active',   joined: '01/01/2024', exams: 0,  streak: 0  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INIT_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole]   = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null); // detail modal
  const [confirmBlock, setConfirmBlock] = useState(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.school.toLowerCase().includes(q);
    const matchRole   = filterRole   === 'all' || u.role   === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleBlock = id => {
    setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
    setConfirmBlock(null);
    if (selected?.id === id) setSelected(s => ({ ...s, status: s.status === 'active' ? 'blocked' : 'active' }));
  };

  const statusBadge = s => s === 'active'
    ? <span className="admin-badge admin-badge--green">Hoạt động</span>
    : <span className="admin-badge admin-badge--red">Đã khóa</span>;

  const roleBadge = r => r === 'admin'
    ? <span className="admin-badge admin-badge--orange">Admin</span>
    : <span className="admin-badge admin-badge--blue">Sinh viên</span>;

  const initials = name => name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý tài khoản</h1>
          <p className="admin-page-sub">{users.length} tài khoản trong hệ thống</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-filter-bar">
          <div className="admin-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm theo tên, email, trường..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="admin-form-select" style={{ width: 140 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="all">Tất cả vai trò</option>
            <option value="student">Sinh viên</option>
            <option value="admin">Admin</option>
          </select>
          <select className="admin-form-select" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="blocked">Đã khóa</option>
          </select>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} kết quả
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tài khoản</th>
                <th>Trường học</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Đề đã làm</th>
                <th>Ngày tham gia</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--navy),var(--navy-light))',color:'#fff',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight:700,color:'var(--text-primary)',fontSize:13 }}>{u.name}</div>
                        <div style={{ fontSize:11,color:'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize:12 }}>{u.school}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>{statusBadge(u.status)}</td>
                  <td style={{ fontWeight:700, textAlign:'center' }}>{u.exams}</td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{u.joined}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={() => setSelected(u)}>Chi tiết</button>
                      {u.role !== 'admin' && (
                        <button
                          className={`admin-action-btn ${u.status === 'active' ? 'admin-action-btn--danger' : ''}`}
                          onClick={() => setConfirmBlock(u)}
                        >
                          {u.status === 'active' ? 'Khóa' : 'Mở khóa'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7}><div className="admin-empty"><span>🔍</span><p>Không tìm thấy tài khoản phù hợp</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">Chi tiết tài khoản</span>
              <button className="admin-modal__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div style={{ display:'flex', alignItems:'center', gap:16, padding:'8px 0 16px', borderBottom:'1px solid var(--gray-100)', marginBottom:8 }}>
                <div style={{ width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,var(--navy),var(--navy-light))',color:'#fff',fontSize:20,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  {initials(selected.name)}
                </div>
                <div>
                  <div style={{ fontSize:18,fontWeight:800,color:'var(--text-primary)' }}>{selected.name}</div>
                  <div style={{ fontSize:13,color:'var(--text-muted)' }}>{selected.email}</div>
                  <div style={{ display:'flex', gap:8, marginTop:6 }}>{roleBadge(selected.role)}{statusBadge(selected.status)}</div>
                </div>
              </div>
              <div className="admin-form-grid">
                {[
                  ['Trường học',   selected.school],
                  ['Ngày tham gia', selected.joined],
                  ['Đề đã làm',    `${selected.exams} bài`],
                  ['Streak',       `${selected.streak} ngày`],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4 }}>{label}</div>
                    <div style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Đóng</button>
              {selected.role !== 'admin' && (
                <button
                  className={`btn ${selected.status === 'active' ? 'btn-primary' : 'btn-orange'}`}
                  style={selected.status === 'active' ? { background:'#ef4444' } : {}}
                  onClick={() => { toggleBlock(selected.id); setSelected(null); }}
                >
                  {selected.status === 'active' ? '🔒 Khóa tài khoản' : '🔓 Mở khóa'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm block modal */}
      {confirmBlock && (
        <div className="admin-modal-overlay" onClick={() => setConfirmBlock(null)}>
          <div className="admin-modal" style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__head">
              <span className="admin-modal__title">{confirmBlock.status === 'active' ? '🔒 Khóa tài khoản' : '🔓 Mở khóa tài khoản'}</span>
              <button className="admin-modal__close" onClick={() => setConfirmBlock(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 }}>
                Bạn có chắc muốn <strong>{confirmBlock.status === 'active' ? 'khóa' : 'mở khóa'}</strong> tài khoản{' '}
                <strong>{confirmBlock.name}</strong>?
                {confirmBlock.status === 'active' && ' Tài khoản sẽ không thể đăng nhập.'}
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setConfirmBlock(null)}>Hủy</button>
              <button
                className="btn btn-primary"
                style={confirmBlock.status === 'active' ? { background:'#ef4444' } : {}}
                onClick={() => toggleBlock(confirmBlock.id)}
              >
                {confirmBlock.status === 'active' ? 'Xác nhận khóa' : 'Xác nhận mở khóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
