import { Link, useParams, useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import './CategoriesPage.css';

// ── Detail view for one block (e.g. /on-tap/kinh-te) ──────────────────────────
function CategoryDetail({ categoryId }) {
  const navigate = useNavigate();
  const cat = categories.find(c => c.id === categoryId);

  if (!cat) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        Không tìm thấy khối ngành.
      </div>
    );
  }

  return (
    <div className="cat-detail page-enter">
      <PageHeader
        title={cat.name}
        subtitle={cat.description}
        icon={cat.icon}
        accentColor={cat.color}
        stats={[`${cat.count} đề thi`, `${cat.subjects.length} môn học`]}
        breadcrumb={
          <>
            <Link to="/on-tap">Đề ôn tập</Link>
            <span>/</span>
            <span>{cat.name}</span>
          </>
        }
      />

      {/* Subjects list */}
      <div className="container cat-detail__subjects">
        <h2 className="section__title" style={{ marginBottom: 20 }}>Các môn học</h2>
        <div className="subjects-grid">
          {cat.subjects.map(sub => (
            <div key={sub.id} className="subject-card">
              <div
                className="subject-card__icon"
                style={{ background: `${cat.color}15`, color: cat.color }}
              >
                📖
              </div>
              <div className="subject-card__info">
                <h4>{sub.name}</h4>
                <p>{sub.exams} đề • {sub.questions.toLocaleString()} câu hỏi</p>
              </div>
              <button
                className="btn btn-primary"
                style={{ fontSize: 13 }}
                onClick={() => navigate(`/exams?subject=${sub.id}`)}
              >
                Xem đề
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── All blocks listing (/on-tap) ──────────────────────────────────────────────
function AllPractice() {
  return (
    <div className="cats-page page-enter">
      <PageHeader
        title="Đề ôn tập"
        subtitle="Chọn khối ngành để bắt đầu ôn luyện"
      />

      <div className="container cats-page__content">
        {categories.map(cat => (
          <div key={cat.id} className="cats-block">
            <div className="cats-block__header">
              <div
                className="cats-block__icon-wrap"
                style={{ background: `${cat.color}15` }}
              >
                <span>{cat.icon}</span>
              </div>
              <div className="cats-block__meta">
                <h2 className="cats-block__name">{cat.name}</h2>
                <p className="cats-block__desc">{cat.description}</p>
              </div>
              <Link to={`/on-tap/${cat.id}`} className="btn btn-outline">
                Xem tất cả
              </Link>
            </div>

            <div className="cats-block__subjects">
              {cat.subjects.map(sub => (
                <Link
                  key={sub.id}
                  to={`/exams?subject=${sub.id}`}
                  className="cats-subject-chip"
                  style={{ borderColor: `${cat.color}40`, color: cat.color }}
                >
                  <span>📖</span>
                  <div>
                    <span className="cats-subject-name">{sub.name}</span>
                    <span className="cats-subject-meta">{sub.exams} đề</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Route entry point ─────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const { categoryId } = useParams();
  if (categoryId) return <CategoryDetail categoryId={categoryId} />;
  return <AllPractice />;
}
