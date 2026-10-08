import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi, parseErrors } from '../services/api';
import PageHeader from '../components/PageHeader';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name:    user?.name  || '',
    email:   user?.email || '',
    school:  'Đại học Kinh tế TP.HCM',
    major:   'Quản trị Kinh doanh',
    year:    '3',
    phone:   '',
  });

  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('info'); // 'info' | 'security'

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);

  const set    = f => e => setForm(v => ({ ...v, [f]: e.target.value }));
  const setPw  = f => e => setPwForm(v => ({ ...v, [f]: e.target.value }));

  const handleSaveInfo = async e => {
    e.preventDefault();
    try {
      const res = await authApi.updateProfile({
        name: form.name, email: form.email,
        school: form.school, major: form.major,
        year: form.year, phone: form.phone,
      });
      updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(false);
    }
  };

  const handleSavePw = async e => {
    e.preventDefault();
    try {
      await authApi.changePassword({
        current_password: pwForm.current,
        password: pwForm.next,
        password_confirmation: pwForm.confirm,
      });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      const parsed = parseErrors(err);
      alert(parsed.current_password || parsed._global || 'Có lỗi xảy ra.');
    }
  };

  const initials = (user?.name || 'U')
    .split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

  const stats = [
    { icon: '', label: 'Câu đã luyện', value: '263' },
    { icon: '', label: 'Đề hoàn thành', value: '14' },
    { icon: '', label: 'Streak',        value: '7 ngày' },
    { icon: '', label: 'Điểm TB',       value: '8.2' },
  ];

  return (
    <div className="profile-page page-enter">
      <PageHeader title="Thông tin cá nhân" subtitle="Quản lý hồ sơ và cài đặt tài khoản" icon="👤" />

      <div className="container profile-body">

        {/* ── Left: avatar card ── */}
        <aside className="profile-aside">
          <div className="profile-card">
            <div className="profile-card__avatar">{initials}</div>
            <h3 className="profile-card__name">{user?.name}</h3>
            <p className="profile-card__email">{user?.email}</p>
            <div className="profile-card__badge">🎓 Sinh viên</div>
          </div>

          <div className="profile-stats">
            {stats.map(s => (
              <div key={s.label} className="ps-item">
                <span className="ps-icon">{s.icon}</span>
                <span className="ps-value">{s.value}</span>
                <span className="ps-label">{s.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Right: form tabs ── */}
        <div className="profile-main">
          {/* Tabs */}
          <div className="profile-tabs">
            <button className={`profile-tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
              📋 Thông tin cá nhân
            </button>
            <button className={`profile-tab ${tab === 'security' ? 'active' : ''}`} onClick={() => setTab('security')}>
              🔐 Bảo mật
            </button>
          </div>

          {/* ── Info tab ── */}
          {tab === 'info' && (
            <form className="profile-form" onSubmit={handleSaveInfo}>
              <div className="pf-row">
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <input className="form-input" style={{ paddingLeft: 14 }} value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" style={{ paddingLeft: 14 }} value={form.email} onChange={set('email')} type="email" placeholder="example@email.com" />
                </div>
              </div>

              <div className="pf-row">
                <div className="form-group">
                  <label className="form-label">Trường học</label>
                  <input className="form-input" style={{ paddingLeft: 14 }} value={form.school} onChange={set('school')} placeholder="Tên trường" />
                </div>
                <div className="form-group">
                  <label className="form-label">Chuyên ngành</label>
                  <input className="form-input" style={{ paddingLeft: 14 }} value={form.major} onChange={set('major')} placeholder="Chuyên ngành" />
                </div>
              </div>

              <div className="pf-row">
                <div className="form-group">
                  <label className="form-label">Năm học</label>
                  <select className="form-input" style={{ paddingLeft: 14 }} value={form.year} onChange={set('year')}>
                    {['1','2','3','4','5','6'].map(y => (
                      <option key={y} value={y}>Năm {y}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input className="form-input" style={{ paddingLeft: 14 }} value={form.phone} onChange={set('phone')} placeholder="0901 234 567" />
                </div>
              </div>

              <div className="pf-actions">
                {saved && <span className="pf-saved">✅ Đã lưu thay đổi!</span>}
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          )}

          {/* ── Security tab ── */}
          {tab === 'security' && (
            <form className="profile-form" onSubmit={handleSavePw}>
              <div className="form-group">
                <label className="form-label">Mật khẩu hiện tại</label>
                <input className="form-input" style={{ paddingLeft: 14 }} type="password" value={pwForm.current} onChange={setPw('current')} placeholder="••••••••" />
              </div>
              <div className="pf-row">
                <div className="form-group">
                  <label className="form-label">Mật khẩu mới</label>
                  <input className="form-input" style={{ paddingLeft: 14 }} type="password" value={pwForm.next} onChange={setPw('next')} placeholder="Tối thiểu 6 ký tự" />
                </div>
                <div className="form-group">
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <input className="form-input" style={{ paddingLeft: 14 }} type="password" value={pwForm.confirm} onChange={setPw('confirm')} placeholder="Nhập lại mật khẩu mới" />
                </div>
              </div>

              <div className="security-note">
                <span>🔒</span>
                <p>Mật khẩu tốt nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ số và ký tự đặc biệt.</p>
              </div>

              <div className="pf-actions">
                {pwSaved && <span className="pf-saved">✅ Đã cập nhật mật khẩu!</span>}
                <button type="submit" className="btn btn-primary">Cập nhật mật khẩu</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
