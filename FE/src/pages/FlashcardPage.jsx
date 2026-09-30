import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import './FlashcardPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

// Bộ thẻ của Admin
const ADMIN_DECKS = [
  {
    id: 'admin-triet',
    name: 'Triết học Mác-Lênin',
    icon: '⚖️', color: '#1B3A6B',
    subject: 'Triết học',
    cardCount: 24,
    owner: 'admin',
    visibility: 'public',
    cards: [
      { id: 1, front: 'Vật chất là gì? (Định nghĩa Lênin)', back: 'Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan được đem lại cho con người trong cảm giác, được cảm giác của chúng ta chép lại, chụp lại, phản ánh, và tồn tại không lệ thuộc vào cảm giác.', subject: 'Triết học' },
      { id: 2, front: 'Ý thức là gì theo quan điểm triết học Mác-Lênin?', back: 'Ý thức là sự phản ánh hiện thực khách quan vào bộ óc con người, là hình ảnh chủ quan của thế giới khách quan. Ý thức có bản chất là một hình thức phản ánh đặc biệt — phản ánh có tính năng động, sáng tạo.', subject: 'Triết học' },
      { id: 3, front: 'Quy luật mâu thuẫn là gì?', back: 'Quy luật mâu thuẫn (quy luật thống nhất và đấu tranh của các mặt đối lập) là hạt nhân của phép biện chứng, chỉ ra nguồn gốc, động lực của sự vận động và phát triển.', subject: 'Triết học' },
      { id: 4, front: 'Phép biện chứng duy vật gồm những quy luật cơ bản nào?', back: '3 quy luật cơ bản:\n1. Quy luật mâu thuẫn\n2. Quy luật lượng - chất\n3. Quy luật phủ định của phủ định', subject: 'Triết học' },
      { id: 5, front: 'Thực tiễn là gì? Vai trò của thực tiễn với nhận thức?', back: 'Thực tiễn là toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử - xã hội của con người. Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của nhận thức.', subject: 'Triết học' },
    ],
  },
  {
    id: 'admin-ls-dang',
    name: 'Lịch sử Đảng',
    icon: '🏛️', color: '#c0392b',
    subject: 'Lịch sử Đảng',
    cardCount: 20,
    owner: 'admin',
    visibility: 'public',
    cards: [
      { id: 6, front: 'Đảng Cộng sản Việt Nam thành lập ngày tháng năm nào?', back: '3/2/1930 — Đảng Cộng sản Việt Nam được thành lập tại Hội nghị hợp nhất các tổ chức cộng sản ở Hương Cảng (Trung Quốc) dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc.', subject: 'Lịch sử Đảng' },
      { id: 7, front: 'Cương lĩnh chính trị đầu tiên của Đảng (1930) xác định nhiệm vụ gì?', back: 'Hai nhiệm vụ chiến lược:\n1. Đánh đổ đế quốc → giành độc lập dân tộc\n2. Thực hiện người cày có ruộng → giải phóng giai cấp nông dân', subject: 'Lịch sử Đảng' },
      { id: 8, front: 'Cách mạng tháng Tám 1945 thành công vào ngày nào?', back: 'Ngày 19/8/1945 — Nhân dân Hà Nội giành chính quyền. Ngày 2/9/1945 — Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.', subject: 'Lịch sử Đảng' },
      { id: 9, front: 'Đại hội Đảng lần thứ VI (1986) có ý nghĩa gì?', back: 'Đại hội VI (12/1986) là mốc mở đầu công cuộc Đổi mới toàn diện, chuyển từ kế hoạch hóa tập trung sang kinh tế hàng hóa nhiều thành phần theo cơ chế thị trường.', subject: 'Lịch sử Đảng' },
    ],
  },
  {
    id: 'admin-ktct',
    name: 'Kinh tế Chính trị',
    icon: '📊', color: '#F5A623',
    subject: 'Kinh tế CT',
    cardCount: 18,
    owner: 'admin',
    visibility: 'public',
    cards: [
      { id: 10, front: 'Hàng hóa là gì? Hai thuộc tính của hàng hóa?', back: 'Hàng hóa là sản phẩm của lao động có thể thỏa mãn nhu cầu của con người thông qua trao đổi, mua bán.\n\n2 thuộc tính:\n1. Giá trị sử dụng\n2. Giá trị (lao động xã hội kết tinh)', subject: 'Kinh tế CT' },
      { id: 11, front: 'Quy luật giá trị là gì?', back: 'Quy luật giá trị là quy luật kinh tế cơ bản của sản xuất và trao đổi hàng hóa. Sản xuất và trao đổi hàng hóa phải dựa trên cơ sở hao phí lao động xã hội cần thiết.', subject: 'Kinh tế CT' },
      { id: 12, front: 'Giá trị thặng dư (m) là gì?', back: 'Giá trị thặng dư là phần giá trị mới do lao động công nhân tạo ra ngoài giá trị sức lao động, bị nhà tư bản chiếm đoạt không hoàn trả.', subject: 'Kinh tế CT' },
    ],
  },
];

// Bộ thẻ của cộng đồng (sinh viên tạo, public)
const COMMUNITY_DECKS = [
  {
    id: 'sv-kinh-te',
    name: 'Kinh tế vi mô - Ôn thi cuối kỳ',
    icon: '💡', color: '#16a34a',
    subject: 'Kinh tế vi mô',
    cardCount: 32,
    owner: 'Nguyễn Minh Tuấn',
    ownerAvatar: 'MT',
    visibility: 'public',
    likes: 142,
    cards: [
      { id: 20, front: 'Co giãn của cầu theo giá (PED) là gì?', back: 'PED đo lường mức độ phản ứng của lượng cầu khi giá thay đổi.\nPED = %ΔQd / %ΔP\n• |PED| > 1: Cầu co giãn nhiều\n• |PED| < 1: Cầu co giãn ít\n• |PED| = 1: Co giãn đơn vị', subject: 'Kinh tế vi mô' },
      { id: 21, front: 'Đường ngân sách (Budget Line) là gì?', back: 'Đường ngân sách là tập hợp các kết hợp hàng hóa X và Y mà người tiêu dùng có thể mua với thu nhập cho trước và giá cả nhất định.\nPhương trình: I = PxQx + PyQy', subject: 'Kinh tế vi mô' },
      { id: 22, front: 'Chi phí cơ hội là gì?', back: 'Chi phí cơ hội là giá trị của phương án tốt nhất bị từ bỏ khi đưa ra một quyết định lựa chọn. Đây là khái niệm cốt lõi trong kinh tế học về sự khan hiếm nguồn lực.', subject: 'Kinh tế vi mô' },
    ],
  },
  {
    id: 'sv-toan',
    name: 'Toán cao cấp A1 - Công thức cơ bản',
    icon: '🔢', color: '#7c3aed',
    subject: 'Toán cao cấp',
    cardCount: 28,
    owner: 'Trần Thị Lan Anh',
    ownerAvatar: 'LA',
    visibility: 'public',
    likes: 89,
    cards: [
      { id: 23, front: 'Giới hạn của hàm số tại điểm a là gì?', back: 'lim(x→a) f(x) = L nghĩa là khi x tiến dần đến a (nhưng không bằng a), f(x) tiến dần đến L. Không quan tâm đến giá trị f(a).', subject: 'Toán cao cấp' },
      { id: 24, front: 'Đạo hàm của hàm hợp (Chain Rule)?', back: 'Nếu y = f(u) và u = g(x), thì:\ndy/dx = dy/du × du/dx\nHay: [f(g(x))]ʼ = fʼ(g(x)) × gʼ(x)', subject: 'Toán cao cấp' },
    ],
  },
  {
    id: 'sv-anh',
    name: 'Từ vựng Tiếng Anh chuyên ngành CNTT',
    icon: '🌐', color: '#0891b2',
    subject: 'Tiếng Anh',
    cardCount: 45,
    owner: 'Vũ Hoàng Nam',
    ownerAvatar: 'HN',
    visibility: 'public',
    likes: 217,
    cards: [
      { id: 25, front: 'Algorithm (n)', back: 'Thuật toán\n/ˈælɡərɪðəm/\n\nA set of rules or instructions followed by a computer to solve a problem or accomplish a task.\n\nEx: "The sorting algorithm arranges data in ascending order."', subject: 'Tiếng Anh' },
      { id: 26, front: 'Database (n)', back: 'Cơ sở dữ liệu\n/ˈdeɪtəbeɪs/\n\nAn organized collection of structured information or data stored electronically.\n\nEx: "The system uses a relational database to store user information."', subject: 'Tiếng Anh' },
    ],
  },
];

// Bộ thẻ của sinh viên đang đăng nhập (mock)
const MY_DECKS_INIT = [
  {
    id: 'my-note',
    name: 'Ghi chú cá nhân - HK2',
    icon: '📝', color: '#0891b2',
    subject: 'Hỗn hợp',
    cardCount: 8,
    owner: 'me',
    visibility: 'private',
    cards: [
      { id: 30, front: 'Quy luật phủ định của phủ định?', back: 'Sự phát triển không phải là đường thẳng mà là đường xoáy trôn ốc: phủ định → phủ định của phủ định → quay lại điểm xuất phát nhưng ở trình độ cao hơn.', subject: 'Triết học' },
      { id: 31, front: 'Vốn điều lệ là gì?', back: 'Vốn điều lệ là tổng giá trị tài sản do các thành viên góp vào khi thành lập doanh nghiệp, được ghi vào điều lệ công ty.', subject: 'Luật kinh doanh' },
    ],
  },
];

const MOCK_MISTAKES = [
  { id: 1, subject: 'Kinh tế vi mô', question: 'Co giãn của cầu theo giá (PED) bằng -2 có nghĩa là gì?', yourAnswer: 'Cầu co giãn ít (kém co giãn)', correct: 'Cầu co giãn nhiều (co giãn cao) vì |PED| = 2 > 1', date: '2 ngày trước', times: 3 },
  { id: 2, subject: 'Triết học', question: 'Quy luật nào được coi là hạt nhân của phép biện chứng?', yourAnswer: 'Quy luật lượng - chất', correct: 'Quy luật mâu thuẫn (thống nhất và đấu tranh của các mặt đối lập)', date: '3 ngày trước', times: 2 },
  { id: 3, subject: 'Lịch sử Đảng', question: 'Đại hội Đảng lần thứ mấy mở đầu công cuộc Đổi mới?', yourAnswer: 'Đại hội IV', correct: 'Đại hội VI (tháng 12/1986)', date: '5 ngày trước', times: 4 },
  { id: 4, subject: 'Kinh tế vi mô', question: 'Đường ngân sách dịch chuyển song song ra ngoài khi nào?', yourAnswer: 'Khi giá hàng hóa X giảm', correct: 'Khi thu nhập của người tiêu dùng tăng', date: '1 tuần trước', times: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function FlipCard({ card }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setFlipped(false); }, [card.id]);
  return (
    <div className="flip-scene" onClick={() => setFlipped(v => !v)}>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        <div className="flip-face flip-front">
          <div className="flip-hint">Nhấn để xem đáp án</div>
          <p className="flip-question">{card.front}</p>
          <div className="flip-subject">{card.subject}</div>
        </div>
        <div className="flip-face flip-back">
          <div className="flip-hint flip-hint--back">Đáp án</div>
          <p className="flip-answer">{card.back}</p>
        </div>
      </div>
    </div>
  );
}

// Badge hiển thị loại bộ thẻ
function OwnerBadge({ deck }) {
  if (deck.owner === 'admin') return <span className="deck-owner-badge deck-owner-badge--admin">🎓 Admin</span>;
  if (deck.owner === 'me')    return <span className="deck-owner-badge deck-owner-badge--me">👤 Của tôi</span>;
  return (
    <span className="deck-owner-badge deck-owner-badge--sv">
      <span className="deck-mini-avatar">{deck.ownerAvatar}</span>
      {deck.owner}
    </span>
  );
}

function VisibilityBadge({ visibility }) {
  return visibility === 'public'
    ? <span className="vis-badge vis-badge--public">🌐 Công khai</span>
    : <span className="vis-badge vis-badge--private">🔒 Riêng tư</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DECK CARD (grid item)
// ─────────────────────────────────────────────────────────────────────────────
function DeckCard({ deck, onStudy, onEdit, isOwn }) {
  return (
    <div className="deck-card">
      <div className="deck-card__top">
        <div className="deck-card__icon" style={{ background: `${deck.color}15`, color: deck.color }}>
          {deck.icon}
        </div>
        <div className="deck-card__badges">
          <VisibilityBadge visibility={deck.visibility} />
          {deck.owner === 'admin' && <span className="vis-badge vis-badge--admin">✅ Chính thức</span>}
        </div>
      </div>
      <h4 className="deck-card__name">{deck.name}</h4>
      <p className="deck-card__subject">{deck.subject}</p>
      <div className="deck-card__meta">
        <span>🃏 {deck.cardCount} thẻ</span>
        {deck.likes && <span>❤️ {deck.likes}</span>}
      </div>
      {deck.owner !== 'admin' && deck.owner !== 'me' && (
        <div className="deck-card__owner">
          <OwnerBadge deck={deck} />
        </div>
      )}
      <div className="deck-card__actions">
        <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => onStudy(deck)}>
          ▶ Học ngay
        </button>
        {isOwn && (
          <button className="btn btn-outline deck-card__edit" onClick={() => onEdit(deck)} title="Chỉnh sửa">
            ✏️
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDY VIEW (flip cards)
// ─────────────────────────────────────────────────────────────────────────────
function StudyView({ deck, onBack }) {
  const [cardIdx, setCardIdx] = useState(0);
  const [known,   setKnown]   = useState(new Set());
  const [repeat,  setRepeat]  = useState(new Set());
  const [done,    setDone]    = useState(false);

  const cards    = deck.cards;
  const card     = cards[cardIdx];
  const progress = Math.round((cardIdx / cards.length) * 100);

  const advance = () => cardIdx + 1 >= cards.length ? setDone(true) : setCardIdx(i => i + 1);
  const handleKnow   = () => { setKnown(s  => new Set([...s, card.id])); advance(); };
  const handleRepeat = () => { setRepeat(s => new Set([...s, card.id])); advance(); };
  const restart = () => { setCardIdx(0); setKnown(new Set()); setRepeat(new Set()); setDone(false); };

  return (
    <div className="fc-study-view page-enter">
      {/* Header */}
      <div className="study-header">
        <button className="btn btn-outline study-back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <div className="study-deck-info">
          <span className="study-deck-icon" style={{ color: deck.color }}>{deck.icon}</span>
          <span className="study-deck-name">{deck.name}</span>
        </div>
        {deck.owner === 'admin' && <span className="vis-badge vis-badge--admin" style={{ fontSize: 11 }}>✅ Admin</span>}
      </div>

      {/* Progress */}
      <div className="fc-progress-wrap">
        <div className="fc-progress-info">
          <span className="fc-progress-text">Thẻ <strong>{Math.min(cardIdx + 1, cards.length)}</strong> / {cards.length}</span>
          <div className="fc-progress-stats">
            <span className="fc-stat know">✓ Thuộc: {known.size}</span>
            <span className="fc-stat repeat">↺ Cần ôn: {repeat.size}</span>
          </div>
        </div>
        <div className="fc-progress-bar">
          <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!done ? (
        <>
          <FlipCard key={card.id} card={card} />
          <div className="fc-actions">
            <button className="fc-action-btn fc-action-btn--repeat" onClick={handleRepeat}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Cần ôn lại
            </button>
            <div className="fc-card-counter">{cardIdx + 1}/{cards.length}</div>
            <button className="fc-action-btn fc-action-btn--know" onClick={handleKnow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
              Đã thuộc
            </button>
          </div>
          <p className="fc-flip-hint">👆 Nhấn vào thẻ để xem đáp án</p>
        </>
      ) : (
        <div className="fc-done">
          <div className="fc-done-icon">🎉</div>
          <h3>Xong bộ thẻ!</h3>
          <div className="fc-done-stats">
            <div className="fc-done-stat" style={{ color: '#22c55e' }}><span className="fds-num">{known.size}</span><span className="fds-label">Đã thuộc</span></div>
            <div className="fc-done-stat" style={{ color: '#ef4444' }}><span className="fds-num">{repeat.size}</span><span className="fds-label">Cần ôn</span></div>
            <div className="fc-done-stat" style={{ color: 'var(--navy)' }}><span className="fds-num">{Math.round((known.size / cards.length) * 100)}%</span><span className="fds-label">Nắm vững</span></div>
          </div>
          <div className="fc-done-actions">
            <button className="btn btn-primary" onClick={restart}>🔄 Làm lại từ đầu</button>
            {repeat.size > 0 && (
              <button className="btn btn-outline" onClick={() => { setCardIdx(0); setKnown(new Set()); setRepeat(new Set()); setDone(false); }}>
                ↺ Ôn {repeat.size} thẻ chưa thuộc
              </button>
            )}
            <button className="btn btn-outline" onClick={onBack}>← Về danh sách</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE DECK MODAL
// ─────────────────────────────────────────────────────────────────────────────
function CreateDeckModal({ onClose, onCreate }) {
  const [name, setName]           = useState('');
  const [subject, setSubject]     = useState('');
  const [icon, setIcon]           = useState('📚');
  const [visibility, setVis]      = useState('private');
  const [cards, setCards]         = useState([{ front: '', back: '' }]);

  const ICONS = ['📚','💡','🔬','📊','⚖️','🌐','🎯','🧠','📝','🏛️','🔢','💼'];

  const addCard    = () => setCards(c => [...c, { front: '', back: '' }]);
  const removeCard = i  => setCards(c => c.filter((_, idx) => idx !== i));
  const setCard    = (i, field, val) => setCards(c => c.map((card, idx) => idx === i ? { ...card, [field]: val } : card));

  const handleCreate = () => {
    if (!name.trim()) return;
    const validCards = cards.filter(c => c.front.trim() && c.back.trim());
    if (validCards.length === 0) return;
    onCreate({
      id: `my-${Date.now()}`,
      name: name.trim(),
      icon,
      color: '#0891b2',
      subject: subject.trim() || 'Hỗn hợp',
      cardCount: validCards.length,
      owner: 'me',
      visibility,
      cards: validCards.map((c, i) => ({ id: Date.now() + i, front: c.front, back: c.back, subject: subject || 'Hỗn hợp' })),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal create-deck-modal" onClick={e => e.stopPropagation()}>
        <div className="cdm-header">
          <h3>✨ Tạo bộ thẻ mới</h3>
          <button className="cdm-close" onClick={onClose}>✕</button>
        </div>

        <div className="cdm-body">
          {/* Basic info */}
          <div className="cdm-section">
            <h4 className="cdm-section-title">Thông tin bộ thẻ</h4>
            <div className="cdm-row">
              {/* Icon picker */}
              <div className="form-group" style={{ flexShrink: 0 }}>
                <label className="form-label">Biểu tượng</label>
                <div className="icon-picker">
                  {ICONS.map(ic => (
                    <button key={ic} className={`icon-opt ${icon === ic ? 'active' : ''}`} onClick={() => setIcon(ic)}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="cdm-row cdm-row--2">
              <div className="form-group">
                <label className="form-label">Tên bộ thẻ *</label>
                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="VD: Triết học - Ôn thi cuối kỳ" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Môn học</label>
                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="VD: Triết học, Tiếng Anh..." value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
            </div>

            {/* Visibility */}
            <div className="form-group">
              <label className="form-label">Quyền truy cập</label>
              <div className="vis-options">
                <label className={`vis-option ${visibility === 'private' ? 'active' : ''}`}>
                  <input type="radio" name="vis" value="private" checked={visibility === 'private'} onChange={() => setVis('private')} />
                  <span className="vis-option__icon">🔒</span>
                  <div>
                    <span className="vis-option__label">Riêng tư</span>
                    <span className="vis-option__desc">Chỉ mình bạn xem được</span>
                  </div>
                </label>
                <label className={`vis-option ${visibility === 'public' ? 'active' : ''}`}>
                  <input type="radio" name="vis" value="public" checked={visibility === 'public'} onChange={() => setVis('public')} />
                  <span className="vis-option__icon">🌐</span>
                  <div>
                    <span className="vis-option__label">Công khai</span>
                    <span className="vis-option__desc">Mọi sinh viên có thể học</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="cdm-section">
            <div className="cdm-cards-header">
              <h4 className="cdm-section-title">Các thẻ ({cards.length})</h4>
              <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }} onClick={addCard}>
                + Thêm thẻ
              </button>
            </div>

            <div className="cdm-cards-list">
              {cards.map((c, i) => (
                <div key={i} className="cdm-card-row">
                  <div className="cdm-card-num">{i + 1}</div>
                  <div className="cdm-card-inputs">
                    <input
                      className="form-input cdm-input"
                      placeholder="Mặt trước (câu hỏi / thuật ngữ)"
                      value={c.front}
                      onChange={e => setCard(i, 'front', e.target.value)}
                    />
                    <input
                      className="form-input cdm-input"
                      placeholder="Mặt sau (đáp án / định nghĩa)"
                      value={c.back}
                      onChange={e => setCard(i, 'back', e.target.value)}
                    />
                  </div>
                  {cards.length > 1 && (
                    <button className="cdm-remove-btn" onClick={() => removeCard(i)} title="Xóa thẻ">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cdm-footer">
          <button className="btn btn-outline" onClick={onClose}>Hủy</button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!name.trim() || cards.every(c => !c.front.trim())}
          >
            ✨ Tạo bộ thẻ
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function FlashcardPage() {
  const { user } = useAuth();

  const [mainTab, setMainTab]     = useState('admin');   // 'admin' | 'community' | 'mine' | 'mistakes'
  const [studyDeck, setStudyDeck] = useState(null);       // deck đang học
  const [myDecks, setMyDecks]     = useState(MY_DECKS_INIT);
  const [showCreate, setShowCreate] = useState(false);
  const [mistakeFilter, setMistakeFilter] = useState('all');
  const [searchCommunity, setSearchCommunity] = useState('');

  // Study mode — full-page
  if (studyDeck) {
    return (
      <div className="flashcard-page page-enter">
        <PageHeader title="Flashcard" subtitle={studyDeck.name} icon="🃏" accentColor={studyDeck.color} />
        <div className="container fc-body">
          <StudyView deck={studyDeck} onBack={() => setStudyDeck(null)} />
        </div>
      </div>
    );
  }

  const filteredCommunity = searchCommunity.trim()
    ? COMMUNITY_DECKS.filter(d =>
        d.name.toLowerCase().includes(searchCommunity.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchCommunity.toLowerCase())
      )
    : COMMUNITY_DECKS;

  const subjects = [...new Set(MOCK_MISTAKES.map(m => m.subject))];
  const filteredMistakes = mistakeFilter === 'all'
    ? MOCK_MISTAKES
    : MOCK_MISTAKES.filter(m => m.subject === mistakeFilter);

  const handleCreate = deck => {
    setMyDecks(d => [deck, ...d]);
    setShowCreate(false);
  };

  const toggleVisibility = id => {
    setMyDecks(d => d.map(deck =>
      deck.id === id ? { ...deck, visibility: deck.visibility === 'public' ? 'private' : 'public' } : deck
    ));
  };

  const deleteDeck = id => {
    if (window.confirm('Xóa bộ thẻ này?')) setMyDecks(d => d.filter(deck => deck.id !== id));
  };

  return (
    <div className="flashcard-page page-enter">
      <PageHeader
        title="Flashcard & Sổ tay lỗi sai"
        subtitle="Lật thẻ ghi nhớ khái niệm — bộ thẻ chính thức từ Admin và cộng đồng sinh viên"
        icon="🃏"
      />

      <div className="container fc-body">
        {/* ── Main tabs ── */}
        <div className="fc-tabs">
          <button className={`fc-tab ${mainTab === 'admin' ? 'active' : ''}`} onClick={() => setMainTab('admin')}>
            🎓 Bộ thẻ chính thức
            <span className="fc-tab-count">{ADMIN_DECKS.length}</span>
          </button>
          <button className={`fc-tab ${mainTab === 'community' ? 'active' : ''}`} onClick={() => setMainTab('community')}>
            🌐 Cộng đồng
            <span className="fc-tab-count">{COMMUNITY_DECKS.length}</span>
          </button>
          <button className={`fc-tab ${mainTab === 'mine' ? 'active' : ''}`} onClick={() => setMainTab('mine')}>
            👤 Của tôi
            <span className="fc-tab-count">{myDecks.length}</span>
          </button>
          <button className={`fc-tab ${mainTab === 'mistakes' ? 'active' : ''}`} onClick={() => setMainTab('mistakes')}>
            ❌ Lỗi sai
            <span className="fc-tab-badge">{MOCK_MISTAKES.length}</span>
          </button>
        </div>

        {/* ── TAB: ADMIN ── */}
        {mainTab === 'admin' && (
          <div className="fc-tab-content page-enter">
            <div className="fc-tab-header">
              <div>
                <h3 className="fc-section-title">Bộ thẻ chính thức từ Admin</h3>
                <p className="fc-section-sub">Được kiểm duyệt và đảm bảo chất lượng</p>
              </div>
              <span className="fc-official-badge">✅ Đã kiểm duyệt</span>
            </div>
            <div className="deck-grid">
              {ADMIN_DECKS.map(deck => (
                <DeckCard key={deck.id} deck={deck} onStudy={setStudyDeck} isOwn={false} />
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: COMMUNITY ── */}
        {mainTab === 'community' && (
          <div className="fc-tab-content page-enter">
            <div className="fc-tab-header">
              <div>
                <h3 className="fc-section-title">Bộ thẻ từ cộng đồng</h3>
                <p className="fc-section-sub">Được chia sẻ bởi sinh viên — chất lượng có thể khác nhau</p>
              </div>
            </div>
            {/* Search */}
            <div className="fc-community-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                placeholder="Tìm bộ thẻ theo tên, môn học..."
                value={searchCommunity}
                onChange={e => setSearchCommunity(e.target.value)}
              />
            </div>
            {filteredCommunity.length === 0
              ? <div className="fc-empty"><span>🔍</span><p>Không tìm thấy bộ thẻ phù hợp</p></div>
              : (
                <div className="deck-grid">
                  {filteredCommunity.map(deck => (
                    <DeckCard key={deck.id} deck={deck} onStudy={setStudyDeck} isOwn={false} />
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ── TAB: MINE ── */}
        {mainTab === 'mine' && (
          <div className="fc-tab-content page-enter">
            <div className="fc-tab-header">
              <div>
                <h3 className="fc-section-title">Bộ thẻ của tôi</h3>
                <p className="fc-section-sub">Tạo và quản lý bộ thẻ cá nhân</p>
              </div>
              {user ? (
                <button className="btn btn-orange" onClick={() => setShowCreate(true)}>
                  + Tạo bộ thẻ mới
                </button>
              ) : (
                <a href="/login" className="btn btn-outline">Đăng nhập để tạo</a>
              )}
            </div>

            {!user ? (
              <div className="fc-login-prompt">
                <span className="fc-lp-icon">🔐</span>
                <h4>Đăng nhập để tạo bộ thẻ</h4>
                <p>Bạn cần đăng nhập để tạo và quản lý bộ thẻ cá nhân.</p>
                <a href="/login" className="btn btn-primary">Đăng nhập ngay</a>
              </div>
            ) : myDecks.length === 0 ? (
              <div className="fc-empty">
                <span>🃏</span>
                <p>Bạn chưa có bộ thẻ nào.</p>
                <button className="btn btn-orange" onClick={() => setShowCreate(true)}>+ Tạo bộ thẻ đầu tiên</button>
              </div>
            ) : (
              <div className="deck-grid">
                {myDecks.map(deck => (
                  <div key={deck.id} className="deck-card deck-card--own">
                    <div className="deck-card__top">
                      <div className="deck-card__icon" style={{ background: `${deck.color}15`, color: deck.color }}>{deck.icon}</div>
                      <div className="deck-card__badges">
                        <VisibilityBadge visibility={deck.visibility} />
                      </div>
                    </div>
                    <h4 className="deck-card__name">{deck.name}</h4>
                    <p className="deck-card__subject">{deck.subject}</p>
                    <div className="deck-card__meta"><span>🃏 {deck.cardCount} thẻ</span></div>
                    <div className="deck-card__actions">
                      <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => setStudyDeck(deck)}>▶ Học ngay</button>
                      <button
                        className="btn btn-outline deck-card__vis-toggle"
                        onClick={() => toggleVisibility(deck.id)}
                        title={deck.visibility === 'public' ? 'Chuyển sang riêng tư' : 'Chuyển sang công khai'}
                      >
                        {deck.visibility === 'public' ? '🌐' : '🔒'}
                      </button>
                      <button className="btn deck-card__delete" onClick={() => deleteDeck(deck.id)} title="Xóa">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: MISTAKES ── */}
        {mainTab === 'mistakes' && (
          <div className="fc-tab-content mistakes-main page-enter">
            <div className="mistake-filters">
              <button className={`mf-btn ${mistakeFilter === 'all' ? 'active' : ''}`} onClick={() => setMistakeFilter('all')}>
                Tất cả ({MOCK_MISTAKES.length})
              </button>
              {subjects.map(s => (
                <button key={s} className={`mf-btn ${mistakeFilter === s ? 'active' : ''}`} onClick={() => setMistakeFilter(s)}>
                  {s} ({MOCK_MISTAKES.filter(m => m.subject === s).length})
                </button>
              ))}
            </div>

            <div className="mistake-list">
              {filteredMistakes.map(m => (
                <div key={m.id} className="mistake-card">
                  <div className="mistake-card__head">
                    <span className="mistake-subject">{m.subject}</span>
                    <div className="mistake-meta">
                      <span className="mistake-date">🕐 {m.date}</span>
                      <span className="mistake-times">Sai {m.times} lần</span>
                    </div>
                  </div>
                  <p className="mistake-question">{m.question}</p>
                  <div className="mistake-answers">
                    <div className="mistake-answer mistake-answer--wrong"><span className="ma-label">❌ Bạn chọn:</span><span>{m.yourAnswer}</span></div>
                    <div className="mistake-answer mistake-answer--correct"><span className="ma-label">✅ Đáp án đúng:</span><span>{m.correct}</span></div>
                  </div>
                  <div className="mistake-card__actions">
                    <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>📖 Xem giải thích</button>
                    <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setMainTab('mine')}>
                      🃏 Thêm vào bộ thẻ của tôi
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mistake-summary">
              <div className="ms-item"><span className="ms-num" style={{ color: '#ef4444' }}>{MOCK_MISTAKES.length}</span><span className="ms-label">Câu cần ôn</span></div>
              <div className="ms-item"><span className="ms-num" style={{ color: 'var(--orange)' }}>{MOCK_MISTAKES.reduce((a, b) => a + b.times, 0)}</span><span className="ms-label">Lần sai</span></div>
              <div className="ms-item"><span className="ms-num" style={{ color: 'var(--navy)' }}>{subjects.length}</span><span className="ms-label">Môn học</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Modal tạo bộ thẻ */}
      {showCreate && <CreateDeckModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}
