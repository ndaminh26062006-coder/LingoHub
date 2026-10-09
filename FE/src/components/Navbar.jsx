import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png-removebg-preview.png';
import { useAuth } from '../context/AuthContext';
import { subscriptionApi } from '../services/api';
import PaymentModal from './PaymentModal';
import './Navbar.css';

// ─────────────────────────────────────────────────────────────────────────────
// Hover Dropdown — mở khi hover vào label, đóng khi rời khỏi cả label + menu
// ─────────────────────────────────────────────────────────────────────────────
function HoverDropdown({ label, isActive, children }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const show  = () => { clearTimeout(timerRef.current); setOpen(true); };
  // nhỏ delay 120ms để di chuyển chuột sang menu không bị đóng ngay
  const hide  = () => { timerRef.current = setTimeout(() => setOpen(false), 120); };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      className="nav-dropdown"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span className={`navbar__link nav-dropdown__trigger ${isActive ? 'active' : ''}`}>
        {label}
        <svg
          className={`nav-dropdown__chevron ${open ? 'open' : ''}`}
          width="11" height="11" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </span>

      {open && (
        <div className="nav-dropdown__menu" onMouseEnter={show} onMouseLeave={hide}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Profile dropdown (click) ──────────────────────────────────────────────────
function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch active subscription
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('lh_token');
        if (!token) {
          console.log('No lh_token found in localStorage');
          return;
        }

        console.log('Fetching subscription with token:', token.substring(0, 20) + '...');

        const response = await subscriptionApi.me();
        const data = response.data;
        if (data.has_subscription && data.subscription) {
          setSubscription(data.subscription);
          console.log('Subscription loaded:', data.subscription);
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      }
    };

    if (user && open) {
      fetchSubscription();
    }
  }, [user, open]);

  const name        = user.name ?? user.email?.split('@')[0] ?? '?';
  const initials    = name.split(' ').filter(Boolean).map(w => w[0]).slice(-2).join('').toUpperCase() || '?';
  const displayName = name.split(' ').pop() || name;

  return (
    <div className="profile-menu" ref={ref}>
      <button className="profile-trigger" onClick={() => setOpen(v => !v)} aria-label="Menu tài khoản">
        <div className="profile-avatar">{initials}</div>
        <span className="profile-name">{displayName}</span>
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
          <div className="pd-header">
            <div className="pd-avatar">{initials}</div>
            <div className="pd-info">
              <span className="pd-name">{user.name}</span>
              <span className="pd-email">{user.email}</span>
              {subscription && (
                <span className="pd-subscription">{subscription.plan_display}</span>
              )}
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
            Thông tin cá nhân
          </Link>
          <Link to="/payment/history" className="pd-item" onClick={() => setOpen(false)}>
            Lịch sử giao dịch
          </Link>
          <Link to="/tien-do" className="pd-item" onClick={() => setOpen(false)}>
            Tiến độ học tập
          </Link>
          <div className="pd-divider" />
          <button 
            className="pd-item pd-item--upgrade"
            onClick={() => { setPaymentOpen(true); setOpen(false); }}
          >
            Nâng cấp tài khoản
          </button>
          <div className="pd-divider" />
          <button className="pd-item pd-item--logout" onClick={() => { onLogout(); setOpen(false); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Đăng xuất
          </button>
        </div>
      )}

      <PaymentModal 
        isOpen={paymentOpen} 
        onClose={() => setPaymentOpen(false)}
        onSuccess={() => {
          // Refresh subscription after successful payment
          // Instead of full reload, just fetch subscription again
          console.log('Payment successful, fetching subscription...');
          const fetchSubscription = async () => {
            try {
              const token = localStorage.getItem('lh_token');
              if (!token) {
                console.log('No lh_token found');
                return;
              }
              
              const response = await subscriptionApi.me();
              const data = response.data;
              console.log('Subscription data after payment:', data);
              if (data.has_subscription && data.subscription) {
                console.log('Setting subscription:', data.subscription);
                setSubscription(data.subscription);
              }
            } catch (err) {
              console.error('Failed to fetch subscription after payment:', err);
            }
          };
          
          // Small delay to ensure webhook has processed
          setTimeout(fetchSubscription, 1000);
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dropdown content configs
// ─────────────────────────────────────────────────────────────────────────────
const TRAC_NGHIEM_ITEMS = [
  {
    to: '/on-tap?cat=chuyen-nganh',
    icon: '🔬',
    label: 'Môn chuyên ngành',
    desc: 'CNTT, Kỹ thuật, Y dược, Kinh tế...',
  },
  {
    to: '/on-tap?cat=ly-luan',
    icon: '📖',
    label: 'Môn lý luận chính trị',
    desc: 'Triết học, Tư tưởng HCM, Lịch sử Đảng...',
  },
];

const CAU_HOI_ITEMS = [
  {
    to:   '/essays?cat=chuyen-nganh',
    icon: '🔬',
    label: 'Môn chuyên ngành',
    desc:  'Câu hỏi tự luận các môn chuyên ngành',
  },
  {
    to:   '/essays?cat=ly-luan',
    icon: '📖',
    label: 'Môn lý luận chính trị',
    desc:  'Triết học, Tư tưởng HCM, Lịch sử Đảng...',
  },
];

const DE_THI_ITEMS = [
  {
    to:   '/exams?cat=chuyen-nganh',
    icon: '',
    label: 'Môn chuyên ngành',
    desc:  'Đề thi thử các môn chuyên ngành',
  },
  {
    to:   '/exams?cat=ly-luan',
    icon: '',
    label: 'Môn lý luận chính trị',
    desc:  'Triết học, Tư tưởng HCM, Lịch sử Đảng...',
  },
];

const TU_LUAN_ITEMS = [
  {
    to: '/tu-luan',
    icon: '',
    label: 'Làm bài tự luận',
    desc: 'AI chấm bài theo rubric chuẩn đại học',
  },
  {
    to: '/tu-luan',
    icon: '',
    label: 'Xem bài mẫu',
    desc: 'Tham khảo bài làm mẫu điểm 10',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState({}); // { key: bool }
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const userName = (user?.name ?? user?.email?.split('@')[0] ?? '').split(' ').pop() || '?';

  const handleLogout = () => { logout(); navigate('/'); };

  const toggleMobile = key =>
    setMobileOpen(prev => ({ ...prev, [key]: !prev[key] }));

  // Helper: render dropdown item row
  const DropItem = ({ item, onClick }) => (
    <Link to={item.to} className="nav-dropdown__item" onClick={onClick}>
      <span className="nav-dropdown__item-icon">{item.icon}</span>
      <div>
        <span className="nav-dropdown__item-label">{item.label}</span>
        <span className="nav-dropdown__item-desc">{item.desc}</span>
      </div>
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="LingoHub" className="navbar__logo-img" />
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {/* Trang chủ */}
          <li>
            <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>
              Trang chủ
            </Link>
          </li>

          {/* Tài liệu trắc nghiệm — label là link, hover ra dropdown */}
          <li>
            <HoverDropdown
              label={<Link to="/on-tap" style={{ textDecoration:'none', color:'inherit' }}>Tài liệu trắc nghiệm</Link>}
              isActive={location.pathname.startsWith('/on-tap')}
            >
              {TRAC_NGHIEM_ITEMS.map(item => <DropItem key={item.to + item.label} item={item} />)}
            </HoverDropdown>
          </li>

          {/* Câu hỏi tự luận — label là link, hover ra dropdown */}
          <li>
            <HoverDropdown
              label={<Link to="/essays" style={{ textDecoration:'none', color:'inherit' }}>Câu hỏi tự luận</Link>}
              isActive={location.pathname.startsWith('/essays') || location.pathname === '/tu-luan'}
            >
              {CAU_HOI_ITEMS.map(item => <DropItem key={item.to + item.label} item={item} />)}
            </HoverDropdown>
          </li>

          {/* Đề thi — label là link, hover ra dropdown */}
          <li>
            <HoverDropdown
              label={<Link to="/exams" style={{ textDecoration:'none', color:'inherit' }}>Đề thi</Link>}
              isActive={location.pathname.startsWith('/exam')}
            >
              {DE_THI_ITEMS.map(item => <DropItem key={item.to + item.label} item={item} />)}
            </HoverDropdown>
          </li>

          {/* Flashcard */}
          <li>
            <Link to="/flashcard" className={`navbar__link ${location.pathname === '/flashcard' ? 'active' : ''}`}>
              Flashcard
            </Link>
          </li>
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

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="navbar__mobile">
          <Link to="/" className={`navbar__mobile-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Trang chủ
          </Link>

          {/* Mobile expandable groups */}
          {[
            { key: 'tracnghiem', label: 'Tài liệu trắc nghiệm', items: TRAC_NGHIEM_ITEMS, active: location.pathname.startsWith('/on-tap') },
            { key: 'dethi',      label: 'Đề thi',                items: DE_THI_ITEMS,      active: location.pathname.startsWith('/exam') },
            { key: 'tuluan',     label: 'Câu hỏi tự luận',       items: TU_LUAN_ITEMS,     active: location.pathname.startsWith('/tu-luan') },
          ].map(group => (
            <div key={group.key} className="navbar__mobile-group">
              <button
                className={`navbar__mobile-link navbar__mobile-group-trigger ${group.active ? 'active' : ''}`}
                onClick={() => toggleMobile(group.key)}
              >
                {group.label}
                <svg
                  className={`nav-dropdown__chevron ${mobileOpen[group.key] ? 'open' : ''}`}
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {mobileOpen[group.key] && (
                <div className="navbar__mobile-sub">
                  {group.items.map(item => (
                    <Link
                      key={item.to + item.label}
                      to={item.to}
                      className="navbar__mobile-sublink"
                      onClick={() => { setMenuOpen(false); setMobileOpen({}); }}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to="/flashcard" className={`navbar__mobile-link ${location.pathname === '/flashcard' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Flashcard
          </Link>

          <div className="navbar__mobile-auth">
            {user ? (
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Đăng xuất ({userName})
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
