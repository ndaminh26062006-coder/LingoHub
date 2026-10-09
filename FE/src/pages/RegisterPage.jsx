import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png-removebg-preview.png';
import { useAuth } from '../context/AuthContext';
import { authApi, parseErrors } from '../services/api';
import './AuthPage.css';

const GOOGLE_CLIENT_ID = '1041028901371-iov267e30dfakkmaeek15nofg74jkofm.apps.googleusercontent.com';
const FACEBOOK_APP_ID = '1071791185647850';

export default function RegisterPage() {
  const { setAuth }    = useAuth();
  const navigate       = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                     e.name     = 'Vui lòng nhập họ tên.';
    if (!form.email.trim())                    e.email    = 'Vui lòng nhập email.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = 'Email không hợp lệ.';
    if (!form.password)                        e.password = 'Vui lòng nhập mật khẩu.';
    else if (form.password.length < 7)         e.password = 'Mật khẩu tối thiểu 7 ký tự.';
    if (form.confirm !== form.password)        e.confirm  = 'Mật khẩu xác nhận không khớp.';
    if (!agreed)                               e.agreed   = 'Bạn cần đồng ý với điều khoản.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});

    try {
      const res = await authApi.register({
        name:                  form.name,
        email:                 form.email,
        password:              form.password,
        password_confirmation: form.confirm,
      });
      const { user, token } = res.data;
      setAuth(user, token);
      navigate('/');
    } catch (err) {
      const parsed = parseErrors(err);
      setErrors(parsed);
    } finally {
      setLoading(false);
    }
  };

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  /**
   * Redirect to Google OAuth
   */
  const handleGoogleLogin = () => {
    // const redirectUri = encodeURIComponent('http://localhost:8000/api/auth/google/callback');
    const redirectUri = encodeURIComponent('https://api.lingohub.io.vn/api/auth/google/callback');
    const clientId = GOOGLE_CLIENT_ID;
    const scope = encodeURIComponent('openid email profile');
    const responseType = 'code';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    window.location.href = googleAuthUrl;
  };

  /**
   * Redirect to Facebook OAuth
   */
  const handleFacebookLogin = () => {
    // const redirectUri = encodeURIComponent('http://localhost:8000/api/auth/facebook/callback');
    const redirectUri = encodeURIComponent('https://api.lingohub.io.vn/api/auth/facebook/callback');    
    const appId = FACEBOOK_APP_ID;
    const scope = encodeURIComponent('email,public_profile');
    
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.location.href = facebookAuthUrl;
  };

  // Password strength
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)           s++;
    if (p.length >= 10)          s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return Math.min(s, 4);
  })();
  const strengthLabel = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][strength];

  return (
    <div className="auth-page page-enter">
      {/* Left panel */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__content">
          <img src={logo} alt="LingoHub" className="auth-panel__logo" />
          <h2 className="auth-panel__title">Bắt đầu học ngay!</h2>
          <p className="auth-panel__desc">
            Tạo tài khoản miễn phí và tiếp cận ngay hàng nghìn đề thi trắc nghiệm.
          </p>
          <div className="auth-panel__features">
            {[
              { icon: '', text: 'Hoàn toàn miễn phí' },
              { icon: '', text: 'Học mọi lúc, mọi nơi' },
              { icon: '', text: '3 khối ngành, 500+ đề thi' },
              { icon: '', text: 'Lịch sử & thống kê kết quả' },
            ].map(f => (
              <div key={f.text} className="auth-feature">
                <span className="auth-feature__icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-panel__shapes">
          <div className="ap-shape ap-shape-1" />
          <div className="ap-shape ap-shape-2" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrap">
          {/* Mobile logo */}
          <Link to="/" className="auth-mobile-logo">
            <img src={logo} alt="LingoHub" />
          </Link>

          <div className="auth-form__head">
            <Link to="/" className="auth-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Về trang chủ
            </Link>
            <h1 className="auth-form__title">Đăng ký</h1>
            <p className="auth-form__subtitle">
              Đã có tài khoản?{' '}
              <Link to="/login" className="auth-link">Đăng nhập</Link>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Full name */}
            <div className={`form-group ${errors.name ? 'form-group--error' : ''}`}>
              <label className="form-label">Họ và tên</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={set('name')}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className={`form-group ${errors.email ? 'form-group--error' : ''}`}>
              <label className="form-label">Email</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={`form-group ${errors.password ? 'form-group--error' : ''}`}>
              <label className="form-label">Mật khẩu</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                />
                <button type="button" className="form-input-toggle" onClick={() => setShowPass(v => !v)}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    {[1,2,3,4].map(i => (
                      <div
                        key={i}
                        className="strength-segment"
                        style={{ background: i <= strength ? strengthColor : 'var(--gray-200)' }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className={`form-group ${errors.confirm ? 'form-group--error' : ''}`}>
              <label className="form-label">Xác nhận mật khẩu</label>
              <div className="form-input-wrap">
                <span className="form-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirm}
                  onChange={set('confirm')}
                  autoComplete="new-password"
                />
                <button type="button" className="form-input-toggle" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.confirm && <p className="form-error">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div className={`form-group form-group--checkbox ${errors.agreed ? 'form-group--error' : ''}`}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-box" />
                <span className="checkbox-text">
                  Tôi đồng ý với{' '}
                  <a href="#" className="auth-link">Điều khoản sử dụng</a>
                  {' '}và{' '}
                  <a href="#" className="auth-link">Chính sách bảo mật</a>
                </span>
              </label>
              {errors.agreed && <p className="form-error">{errors.agreed}</p>}
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>

            <div className="auth-divider"><span>hoặc</span></div>

            <div className="auth-socials">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Tiếp tục với Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Tiếp tục với Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
