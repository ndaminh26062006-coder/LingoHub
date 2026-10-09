import { useState, useEffect, useCallback } from 'react';
import { adminApi, authApi } from '../services/api';
import './AdminLayout.css';

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterRole,   setFilterRole]   = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected]   = useState(null);
  const [confirmBlock, setConfirmBlock] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserAdminRole, setCurrentUserAdminRole] = useState(null);

  // Get current user role on mount
  useEffect(() => {
    authApi.me()
      .then(res => {
        console.log('👤 Current user:', { role: res.data.role, admin_role: res.data.admin_role });
        setCurrentUserRole(res.data.role);
        setCurrentUserAdminRole(res.data.admin_role);
      })
      .catch(() => {});
  }, []);

  const loadUsers = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search)             params.q      = search;
    if (filterRole   !== 'all') params.role   = filterRole;
    if (filterStatus !== 'all') params.status = filterStatus;

    adminApi.users(params)
      .then(res => setUsers(res.data.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, filterRole, filterStatus]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const toggleBlock = async id => {
    try {
      const res = await adminApi.toggleBlock(id);
      setUsers(us => us.map(u => u.id === id ? { ...u, status: res.data.status } : u));
      if (selected?.id === id) setSelected(s => ({ ...s, status: res.data.status }));
    } catch {}
    setConfirmBlock(null);
  };

  const updateAdminRole = async (id, role, adminRole) => {
    try {
      const updateData = { role };
      if (role === 'admin') {
        updateData.admin_role = adminRole;
      }
      const res = await adminApi.updateUser(id, updateData);
      setUsers(us => us.map(u => u.id === id ? { ...u, role: res.data.role, admin_role: res.data.admin_role } : u));
      if (selected?.id === id) setSelected(s => ({ ...s, role: res.data.role, admin_role: res.data.admin_role }));
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể cập nhật'));
    }
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
            {users.length} kết quả
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
              {loading ? (
                <tr><td colSpan={7}><div className="admin-empty"><span></span><p>Đang tải...</p></div></td></tr>
              ) : users.map(u => (
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
                  <td style={{ fontWeight:700, textAlign:'center' }}>{u.exams || 0}</td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : u.joined}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={() => setSelected(u)}>Chi tiết</button>
                      {u.role !== 'admin' && (currentUserAdminRole === null || currentUserAdminRole === 'super') && (
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
              {!loading && users.length === 0 && (
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
                  ['Trường học',   selected.school || 'Chưa cập nhật'],
                  ['Ngày tham gia', selected.joined || (selected.created_at ? new Date(selected.created_at).toLocaleDateString('vi-VN') : '-')],
                  ['Đề đã làm',    `${selected.exams || 0} bài`],
                  ['Streak',       `${selected.streak || 0} ngày`],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4 }}>{label}</div>
                    <div style={{ fontSize:14,fontWeight:600,color:'var(--text-primary)' }}>{val}</div>
                  </div>
                ))}
              </div>
              
              {/* Vai trò người dùng */}
              <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--gray-100)' }}>
                <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8 }}>Vai trò</div>
                <select 
                  className="admin-form-select"
                  value={selected.role}
                  onChange={e => updateAdminRole(selected.id, e.target.value, selected.admin_role)}
                  style={{ width: '100%' }}
                  disabled={currentUserAdminRole && currentUserAdminRole !== 'super'}
                >
                  <option value="student">👤 Sinh viên</option>
                  <option value="admin">🔑 Admin</option>
                </select>
                {currentUserAdminRole && currentUserAdminRole !== 'super' && (
                  <p style={{ fontSize:11, color:'#ef4444', marginTop:8 }}>⚠️ Chỉ Super Admin có quyền thay đổi vai trò</p>
                )}
              </div>

              {/* Quyền Admin (chỉ hiển thị nếu là admin) */}
              {selected.role === 'admin' && (
                <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid var(--gray-100)' }}>
                  <div style={{ fontSize:11,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8 }}>Loại Admin</div>
                  <select 
                    className="admin-form-select"
                    value={selected.admin_role || ''}
                    onChange={e => updateAdminRole(selected.id, 'admin', e.target.value || null)}
                    style={{ width: '100%' }}
                    disabled={currentUserAdminRole && currentUserAdminRole !== 'super'}
                  >
                    <option value="">Chưa chọn loại admin</option>
                    <option value="super">⭐ Super Admin (Toàn quyền)</option>
                    <option value="content">📝 Content Admin (Quản lý nội dung)</option>
                  </select>
                  <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:8 }}>
                    • <strong>Super Admin:</strong> Toàn bộ quyền, khóa tài khoản, quản lý user<br/>
                    • <strong>Content Admin:</strong> Chỉ quản lý đề thi, flashcard, câu hỏi
                  </p>
                  {currentUserAdminRole && currentUserAdminRole !== 'super' && (
                    <p style={{ fontSize:11, color:'#ef4444', marginTop:8 }}>⚠️ Chỉ Super Admin có quyền thay đổi loại admin</p>
                  )}
                </div>
              )}
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Đóng</button>
              {selected.role !== 'admin' && (currentUserAdminRole === null || currentUserAdminRole === 'super') && (
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
