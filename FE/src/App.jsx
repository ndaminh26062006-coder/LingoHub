import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import HomePage       from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ExamsPage      from './pages/ExamsPage';
import ExamPage       from './pages/ExamPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import EssayPage      from './pages/EssayPage';
import FlashcardPage  from './pages/FlashcardPage';
import DashboardPage  from './pages/DashboardPage';
import ProfilePage    from './pages/ProfilePage';

// Standard layout — Navbar + Footer
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}

// Auth layout — no Navbar/Footer (full-page split)
function AuthLayout({ children }) {
  return <>{children}</>;
}

// Full-screen layout for exam (distraction-free)
function ExamLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<Layout><HomePage /></Layout>} />
        <Route path="/on-tap"             element={<Layout><CategoriesPage /></Layout>} />
        <Route path="/on-tap/:categoryId" element={<Layout><CategoriesPage /></Layout>} />
        <Route path="/exams"              element={<Layout><ExamsPage /></Layout>} />
        <Route path="/exam/:examId"       element={<ExamLayout><ExamPage /></ExamLayout>} />
        <Route path="/login"              element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register"           element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="/tu-luan"            element={<Layout><EssayPage /></Layout>} />
        <Route path="/flashcard"          element={<Layout><FlashcardPage /></Layout>} />
        <Route path="/tien-do"            element={<Layout><DashboardPage /></Layout>} />
        <Route path="/profile"            element={<Layout><ProfilePage /></Layout>} />
        <Route path="*"                   element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '100px 24px', gap: 16, textAlign: 'center',
    }}>
      <span style={{ fontSize: 64 }}>🔍</span>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
        Trang không tồn tại
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
        Địa chỉ bạn truy cập không hợp lệ.
      </p>
      <a href="/" className="btn btn-primary" style={{ marginTop: 8 }}>
        Về trang chủ
      </a>
    </div>
  );
}
