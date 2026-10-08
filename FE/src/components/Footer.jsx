import { Link } from 'react-router-dom';
import logo from '../assets/logo.png-removebg-preview.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src={logo} alt="LingoHub" className="footer__logo-img" />
          </Link>
          <p className="footer__brand-desc">
            Nền tảng ôn thi trực tuyến với hàng nghìn đề thi trắc nghiệm
            được phân loại theo khối ngành.
          </p>
        </div>

        {/* Links */}
        <div className="footer__links-group">
          <h4 className="footer__group-title">Khám phá</h4>
          <ul className="footer__links">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/on-tap">Đề ôn tập</Link></li>
            <li><Link to="/exams">Tất cả đề thi</Link></li>
          </ul>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__group-title">Tính năng</h4>
          <ul className="footer__links">
            <li><Link to="/tu-luan">Kho câu hỏi tự luận</Link></li>
            <li><Link to="/flashcard">Flashcard</Link></li>
            <li><Link to="/tien-do">Tiến độ học tập</Link></li>
          </ul>
        </div>

        <div className="footer__links-group">
          <h4 className="footer__group-title">Tài khoản</h4>
          <ul className="footer__links">
            <li><Link to="/login">Đăng nhập</Link></li>
            <li><Link to="/register">Đăng ký</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© 2026 LingoHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
