import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png-removebg-preview.png';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin',             label: 'Dashboard',          icon: '' },
  { to: '/admin/users',       label: 'Tài khoản',          icon: '' },
  { to: '/admin/exams',       label: 'Đề thi thử',         icon: '' },
  { to: '/admin/on-tap',      label: 'Tài liệu trắc nghiệm',          icon: '' },
  { to: '/admin/tu-luan',     label: 'Câu hỏi tự luận',    icon: '' },
  { to: '/admin/flashcard',   label: 'Flashcard',           icon: '' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = (user?.name || 'A')
    .split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar__logo">
          <Link to="/" className="admin-logo-link">
            <img src={logo} alt="LingoHub" className="admin-logo-img" />
            <span className="admin-logo-tag">Admin Panel</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          <p className="admin-nav__label">Quản lý</p>
          {NAV_ITEMS.map(item => {
            const isActive = item.to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav__item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav__icon">{item.icon}</span>
                <span className="admin-nav__label-text">{item.label}</span>
                {isActive && <span className="admin-nav__dot" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-nav__item admin-nav__item--sm">
            <span className="admin-nav__icon">🌐</span>
            <span className="admin-nav__label-text">Về trang chủ</span>
          </Link>
          <button className="admin-nav__item admin-nav__item--logout" onClick={handleLogout}>
            <span className="admin-nav__icon">🚪</span>
            <span className="admin-nav__label-text">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button className="admin-topbar__hamburger" onClick={() => setSidebarOpen(v => !v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

          <div className="admin-topbar__breadcrumb">
            {NAV_ITEMS.find(n => n.to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(n.to))?.label || 'Admin'}
          </div>

          <div className="admin-topbar__right">
            <div className="admin-topbar__user">
              <div className="admin-topbar__avatar">{initials}</div>
              <div className="admin-topbar__info">
                <span className="admin-topbar__name">{user?.name}</span>
                <span className="admin-topbar__role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
