import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png.jpg';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// ── Profile dropdown ──────────────────────────────────────────────────────────
function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Initials avatar
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  return (
    <div className="profile-menu" ref={ref}>
      <button className="profile-trigger" onClick={() => setOpen(v => !v)} aria-label="Menu tài khoản">
        <div className="profile-avatar">{initials}</div>
        <span className="profile-name">{user.name.split(' ').pop()}</span>
        <svg
          className={`profile-chevron ${open ? 'open' : ''}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="profile-dropdown">
          {/* User info */}
          <div className="pd-header">
            <div className="pd-avatar">{initials}</div>
            <div className="pd-info">
              <span className="pd-name">{user.name}</span>
              <span className="pd-email">{user.email}</span>
            </div>
          </div>

          <div className="pd-divider" />

          {user.role === 'admin' && (
            <>
              <Link to="/admin" className="pd-item" onClick={() => setOpen(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Trang quản trị
              </Link>
              <div className="pd-divider" />
            </>
          )}

          <Link to="/profile" className="pd-item" onClick={() => setOpen(false)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Thông tin cá nhân
          </Link>
          <Link to="/tien-do" className="pd-item" onClick={() => setOpen(false)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Tiến độ học tập
          </Link>

          <div className="pd-divider" />

          <button className="pd-item pd-item--logout" onClick={() => { onLogout(); setOpen(false); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/on-tap', label: 'Đề ôn tập' },
    { to: '/exams', label: 'Đề thi' },
    { to: '/tu-luan', label: 'Kho câu hỏi tự luận' },
    { to: '/flashcard', label: 'Flashcard' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="LingoHub" className="navbar__logo-img" />
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar__link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <ProfileDropdown user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline navbar__btn-login">Đăng nhập</Link>
              <Link to="/register" className="btn btn-orange  navbar__btn-register">Đăng ký</Link>
            </>
          )}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__mobile-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar__mobile-auth">
            {user ? (
              <button
                className="btn btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => { handleLogout(); setMenuOpen(false); }}
              >
                Đăng xuất ({user.name.split(' ').pop()})
              </button>
            ) : (
              <>
                <Link to="/login"    className="btn btn-outline" onClick={() => setMenuOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Đăng nhập</Link>
                <Link to="/register" className="btn btn-orange"  onClick={() => setMenuOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
