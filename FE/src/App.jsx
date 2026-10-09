import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import { FreemiumProvider } from './contexts/FreemiumContext';
import HomePage       from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ExamsPage       from './pages/ExamsPage';
import EssaysPage      from './pages/EssaysPage';
import ExamPage        from './pages/ExamPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import EssayWritePage from './pages/EssayWritePage';
import FlashcardPage  from './pages/FlashcardPage';
import DashboardPage  from './pages/DashboardPage';
import ProfilePage    from './pages/ProfilePage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import OAuthCallbackHandler from './pages/OAuthCallbackHandler';

// Admin
import AdminGuard     from './admin/AdminGuard';
import AdminLayout    from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers     from './admin/AdminUsers';
import AdminExams     from './admin/AdminExams';
import AdminOnTap     from './admin/AdminOnTap';
import AdminEssay     from './admin/AdminEssay';
import AdminFlashcard from './admin/AdminFlashcard';

// Standard layout
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}

function AuthLayout({ children }) { return <>{children}</>; }
function ExamLayout({ children })  { return <>{children}</>; }

// Wrap admin page in guard + layout
function AdminPage({ children }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}

export default function App() {
  return (
    <FreemiumProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"                   element={<Layout><HomePage /></Layout>} />
          <Route path="/on-tap"             element={<Layout><CategoriesPage /></Layout>} />
          <Route path="/on-tap/:categoryId" element={<Layout><CategoriesPage /></Layout>} />
          <Route path="/exams"              element={<Layout><ExamsPage /></Layout>} />
          <Route path="/exam/:examId"       element={<ExamLayout><ExamPage /></ExamLayout>} />
          <Route path="/document/:examId"   element={<ExamLayout><ExamPage /></ExamLayout>} />
          <Route path="/essays/:essayId"    element={<ExamLayout><EssayWritePage /></ExamLayout>} />
          <Route path="/essays"             element={<Layout><EssaysPage /></Layout>} />
          <Route path="/tu-luan"            element={<Layout><EssaysPage /></Layout>} />
          <Route path="/flashcard"          element={<Layout><FlashcardPage /></Layout>} />
          <Route path="/tien-do"            element={<Layout><DashboardPage /></Layout>} />
          <Route path="/profile"            element={<Layout><ProfilePage /></Layout>} />
          <Route path="/payment/history"    element={<Layout><PaymentHistoryPage /></Layout>} />
          <Route path="/payment/callback"   element={<Layout><PaymentCallbackPage /></Layout>} />

          {/* ── Auth ── */}
          <Route path="/login"    element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
          
          {/* ── OAuth Callback ── */}
          <Route path="/auth/callback" element={<AuthLayout><OAuthCallbackHandler /></AuthLayout>} />

          {/* ── Admin (role-guarded) ── */}
          <Route path="/admin"            element={<AdminPage><AdminDashboard /></AdminPage>} />
          <Route path="/admin/users"      element={<AdminPage><AdminUsers /></AdminPage>} />
          <Route path="/admin/exams"      element={<AdminPage><AdminExams /></AdminPage>} />
          <Route path="/admin/on-tap"     element={<AdminPage><AdminOnTap /></AdminPage>} />
          <Route path="/admin/tu-luan"    element={<AdminPage><AdminEssay /></AdminPage>} />
          <Route path="/admin/flashcard"  element={<AdminPage><AdminFlashcard /></AdminPage>} />

          {/* ── 404 ── */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </FreemiumProvider>
  );
}

function NotFound() {
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 24px',gap:16,textAlign:'center' }}>
      <span style={{ fontSize:64 }}>🔍</span>
      <h2 style={{ fontSize:28,fontWeight:800,color:'var(--text-primary)' }}>Trang không tồn tại</h2>
      <p style={{ color:'var(--text-muted)',fontSize:15 }}>Địa chỉ bạn truy cập không hợp lệ.</p>
      <a href="/" className="btn btn-primary" style={{ marginTop:8 }}>Về trang chủ</a>
    </div>
  );
}
