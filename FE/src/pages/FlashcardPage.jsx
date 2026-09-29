import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import './FlashcardPage.css';

// ── Mock data ─────────────────────────────────────────────────────────────────
const DECKS = [
  {
    id: 'triet-hoc',
    name: 'Triết học Mác-Lênin',
    icon: '⚖️',
    color: '#1B3A6B',
    count: 24,
    cards: [
      { id: 1, front: 'Vật chất là gì? (Định nghĩa Lênin)', back: 'Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan được đem lại cho con người trong cảm giác, được cảm giác của chúng ta chép lại, chụp lại, phản ánh, và tồn tại không lệ thuộc vào cảm giác.', subject: 'Triết học' },
      { id: 2, front: 'Ý thức là gì theo quan điểm của triết học Mác-Lênin?', back: 'Ý thức là sự phản ánh hiện thực khách quan vào bộ óc con người, là hình ảnh chủ quan của thế giới khách quan. Ý thức có bản chất là một hình thức phản ánh đặc biệt — phản ánh có tính năng động, sáng tạo.', subject: 'Triết học' },
      { id: 3, front: 'Quy luật mâu thuẫn là gì?', back: 'Quy luật mâu thuẫn (quy luật thống nhất và đấu tranh của các mặt đối lập) là hạt nhân của phép biện chứng, chỉ ra nguồn gốc, động lực của sự vận động và phát triển.', subject: 'Triết học' },
      { id: 4, front: 'Phép biện chứng duy vật gồm những quy luật cơ bản nào?', back: '3 quy luật cơ bản:\n1. Quy luật mâu thuẫn (quy luật thống nhất và đấu tranh của các mặt đối lập)\n2. Quy luật lượng - chất\n3. Quy luật phủ định của phủ định', subject: 'Triết học' },
      { id: 5, front: 'Phạm trù "Tồn tại xã hội" và "Ý thức xã hội" khác nhau như thế nào?', back: 'Tồn tại xã hội là toàn bộ đời sống vật chất và điều kiện sinh hoạt vật chất của xã hội. Ý thức xã hội là mặt tinh thần của đời sống xã hội, phản ánh tồn tại xã hội. Tồn tại xã hội quyết định ý thức xã hội.', subject: 'Triết học' },
      { id: 6, front: 'Thực tiễn là gì? Vai trò của thực tiễn với nhận thức?', back: 'Thực tiễn là toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử - xã hội của con người nhằm cải tạo tự nhiên và xã hội. Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của nhận thức.', subject: 'Triết học' },
    ],
  },
  {
    id: 'ls-dang',
    name: 'Lịch sử Đảng',
    icon: '🏛️',
    color: '#c0392b',
    count: 20,
    cards: [
      { id: 7, front: 'Đảng Cộng sản Việt Nam thành lập ngày tháng năm nào?', back: '3/2/1930 — Đảng Cộng sản Việt Nam được thành lập tại Hội nghị hợp nhất các tổ chức cộng sản ở Hương Cảng (Trung Quốc) dưới sự chủ trì của lãnh tụ Nguyễn Ái Quốc.', subject: 'Lịch sử Đảng' },
      { id: 8, front: 'Cương lĩnh chính trị đầu tiên của Đảng (1930) xác định nhiệm vụ gì?', back: 'Hai nhiệm vụ chiến lược:\n1. Đánh đổ đế quốc thực dân Pháp và bọn phong kiến tay sai → giành độc lập dân tộc\n2. Thực hiện người cày có ruộng → giải phóng giai cấp nông dân', subject: 'Lịch sử Đảng' },
      { id: 9, front: 'Cách mạng tháng Tám 1945 thành công vào ngày nào?', back: 'Ngày 19/8/1945 — Nhân dân Hà Nội giành chính quyền. Ngày 2/9/1945 — Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa.', subject: 'Lịch sử Đảng' },
      { id: 10, front: 'Đại hội Đảng lần thứ VI (1986) có ý nghĩa gì?', back: 'Đại hội VI (12/1986) là mốc mở đầu công cuộc Đổi mới toàn diện, đề ra đường lối đổi mới kinh tế từ mô hình kế hoạch hóa tập trung sang kinh tế hàng hóa nhiều thành phần theo cơ chế thị trường có sự quản lý của Nhà nước.', subject: 'Lịch sử Đảng' },
      { id: 11, front: 'Chiến thắng Điện Biên Phủ (1954) có ý nghĩa gì?', back: 'Ngày 7/5/1954, chiến dịch Điện Biên Phủ toàn thắng, buộc thực dân Pháp ký Hiệp định Genève (7/1954), chấm dứt chiến tranh xâm lược, lập lại hòa bình ở Đông Dương, miền Bắc hoàn toàn giải phóng.', subject: 'Lịch sử Đảng' },
    ],
  },
  {
    id: 'ktct',
    name: 'Kinh tế Chính trị',
    icon: '📊',
    color: '#F5A623',
    count: 18,
    cards: [
      { id: 12, front: 'Hàng hóa là gì? Hai thuộc tính của hàng hóa?', back: 'Hàng hóa là sản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi, mua bán.\n\n2 thuộc tính:\n1. Giá trị sử dụng: công dụng của hàng hóa\n2. Giá trị: lao động xã hội kết tinh trong hàng hóa', subject: 'Kinh tế CT' },
      { id: 13, front: 'Quy luật giá trị là gì?', back: 'Quy luật giá trị là quy luật kinh tế cơ bản của sản xuất và trao đổi hàng hóa. Theo đó, việc sản xuất và trao đổi hàng hóa phải dựa trên cơ sở hao phí lao động xã hội cần thiết.', subject: 'Kinh tế CT' },
      { id: 14, front: 'Giá trị thặng dư (m) là gì?', back: 'Giá trị thặng dư là phần giá trị mới do lao động của công nhân tạo ra ngoài giá trị sức lao động, bị nhà tư bản chiếm đoạt không hoàn trả. Đây là nguồn gốc của lợi nhuận trong chủ nghĩa tư bản.', subject: 'Kinh tế CT' },
      { id: 15, front: 'Tư bản bất biến (c) và tư bản khả biến (v) khác nhau như thế nào?', back: 'Tư bản bất biến (c): bộ phận tư bản tồn tại dưới hình thức TLSX, giá trị được bảo toàn và chuyển vào sản phẩm, không tạo ra giá trị thặng dư.\n\nTư bản khả biến (v): bộ phận mua sức lao động, tạo ra giá trị thặng dư.', subject: 'Kinh tế CT' },
    ],
  },
];

const MOCK_MISTAKES = [
  { id: 1, subject: 'Kinh tế vi mô', question: 'Co giãn của cầu theo giá (PED) bằng -2 có nghĩa là gì?', yourAnswer: 'Cầu co giãn ít (kém co giãn)', correct: 'Cầu co giãn nhiều (co giãn cao) vì |PED| = 2 > 1', date: '2 ngày trước', times: 3 },
  { id: 2, subject: 'Triết học', question: 'Quy luật nào được coi là hạt nhân của phép biện chứng?', yourAnswer: 'Quy luật lượng - chất', correct: 'Quy luật mâu thuẫn (thống nhất và đấu tranh của các mặt đối lập)', date: '3 ngày trước', times: 2 },
  { id: 3, subject: 'Lịch sử Đảng', question: 'Đại hội Đảng lần thứ mấy mở đầu công cuộc Đổi mới?', yourAnswer: 'Đại hội IV', correct: 'Đại hội VI (tháng 12/1986)', date: '5 ngày trước', times: 4 },
  { id: 4, subject: 'Kinh tế vi mô', question: 'Đường ngân sách dịch chuyển song song ra ngoài khi nào?', yourAnswer: 'Khi giá hàng hóa X giảm', correct: 'Khi thu nhập của người tiêu dùng tăng', date: '1 tuần trước', times: 1 },
  { id: 5, subject: 'Kinh tế CT', question: 'Tư bản khả biến (v) tạo ra điều gì?', yourAnswer: 'Bảo toàn giá trị', correct: 'Tư bản khả biến tạo ra giá trị thặng dư (m)', date: '1 tuần trước', times: 2 },
];

// ── Flashcard component ───────────────────────────────────────────────────────
function FlipCard({ card, onKnow, onRepeat }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setFlipped(false); }, [card.id]);

  return (
    <div className="flip-scene" onClick={() => setFlipped(v => !v)}>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div className="flip-face flip-front">
          <div className="flip-hint">Nhấn để xem đáp án</div>
          <p className="flip-question">{card.front}</p>
          <div className="flip-subject">{card.subject}</div>
        </div>
        {/* Back */}
        <div className="flip-face flip-back">
          <div className="flip-hint flip-hint--back">Đáp án</div>
          <p className="flip-answer">{card.back}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FlashcardPage() {
  const [tab, setTab]           = useState('flashcard'); // 'flashcard' | 'mistakes'
  const [activeDeck, setActiveDeck] = useState(DECKS[0]);
  const [cardIdx, setCardIdx]   = useState(0);
  const [known, setKnown]       = useState(new Set());
  const [repeat, setRepeat]     = useState(new Set());
  const [done, setDone]         = useState(false);
  const [mistakeFilter, setMistakeFilter] = useState('all');

  const cards = activeDeck.cards;
  const card  = cards[cardIdx];
  const progress = Math.round(((cardIdx) / cards.length) * 100);

  const handleKnow = () => {
    setKnown(s => new Set([...s, card.id]));
    advance();
  };

  const handleRepeat = () => {
    setRepeat(s => new Set([...s, card.id]));
    advance();
  };

  const advance = () => {
    if (cardIdx + 1 >= cards.length) setDone(true);
    else setCardIdx(i => i + 1);
  };

  const restart = () => {
    setCardIdx(0);
    setKnown(new Set());
    setRepeat(new Set());
    setDone(false);
  };

  const switchDeck = deck => {
    setActiveDeck(deck);
    setCardIdx(0);
    setKnown(new Set());
    setRepeat(new Set());
    setDone(false);
  };

  const filteredMistakes = mistakeFilter === 'all'
    ? MOCK_MISTAKES
    : MOCK_MISTAKES.filter(m => m.subject.toLowerCase().includes(mistakeFilter.toLowerCase()));

  const subjects = [...new Set(MOCK_MISTAKES.map(m => m.subject))];

  return (
    <div className="flashcard-page page-enter">
      <PageHeader
        title="Flashcard & Sổ tay lỗi sai"
        subtitle="Lật thẻ ghi nhớ khái niệm — ôn lại câu làm sai tự động sau mỗi bài thi"
        icon="🃏"
      />

      <div className="container fc-body">
        {/* Main tabs */}
        <div className="fc-tabs">
          <button className={`fc-tab ${tab === 'flashcard' ? 'active' : ''}`} onClick={() => setTab('flashcard')}>
            🃏 Flashcard
          </button>
          <button className={`fc-tab ${tab === 'mistakes' ? 'active' : ''}`} onClick={() => setTab('mistakes')}>
            ❌ Sổ tay lỗi sai
            <span className="fc-tab-badge">{MOCK_MISTAKES.length}</span>
          </button>
        </div>

        {/* ── FLASHCARD TAB ── */}
        {tab === 'flashcard' && (
          <div className="fc-main">
            {/* LEFT: Deck selector */}
            <div className="deck-selector">
              <p className="deck-selector-title">Bộ thẻ</p>
              {DECKS.map(deck => (
                <button
                  key={deck.id}
                  className={`deck-btn ${activeDeck.id === deck.id ? 'active' : ''}`}
                  style={activeDeck.id === deck.id ? { borderColor: deck.color, background: `${deck.color}10` } : {}}
                  onClick={() => switchDeck(deck)}
                >
                  <span className="deck-icon">{deck.icon}</span>
                  <div className="deck-info">
                    <span className="deck-name">{deck.name}</span>
                    <span className="deck-count">{deck.count} thẻ</span>
                  </div>
                  {activeDeck.id === deck.id && <span className="deck-active-dot" style={{ background: deck.color }} />}
                </button>
              ))}
            </div>

            {/* RIGHT: card area */}
            <div className="fc-card-area">
              {/* Progress bar */}
              <div className="fc-progress-wrap">
                <div className="fc-progress-info">
                  <span className="fc-progress-text">
                    Thẻ <strong>{Math.min(cardIdx + 1, cards.length)}</strong> / {cards.length}
                  </span>
                  <div className="fc-progress-stats">
                    <span className="fc-stat know">✓ Thuộc: {known.size}</span>
                    <span className="fc-stat repeat">↺ Cần ôn: {repeat.size}</span>
                  </div>
                </div>
                <div className="fc-progress-bar">
                  <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Card or Done screen */}
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
                    <div className="fc-done-stat" style={{ color: '#22c55e' }}>
                      <span className="fds-num">{known.size}</span>
                      <span className="fds-label">Đã thuộc</span>
                    </div>
                    <div className="fc-done-stat" style={{ color: '#ef4444' }}>
                      <span className="fds-num">{repeat.size}</span>
                      <span className="fds-label">Cần ôn</span>
                    </div>
                    <div className="fc-done-stat" style={{ color: 'var(--navy)' }}>
                      <span className="fds-num">{Math.round((known.size / cards.length) * 100)}%</span>
                      <span className="fds-label">Nắm vững</span>
                    </div>
                  </div>
                  <div className="fc-done-actions">
                    <button className="btn btn-primary" onClick={restart}>🔄 Làm lại từ đầu</button>
                    {repeat.size > 0 && (
                      <button className="btn btn-outline" onClick={() => {
                        const repeatCards = cards.filter(c => repeat.has(c.id));
                        switchDeck({ ...activeDeck, cards: repeatCards });
                      }}>
                        ↺ Ôn lại {repeat.size} thẻ chưa thuộc
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>{/* end fc-card-area */}
          </div>
        )}

        {/* ── MISTAKES TAB ── */}
        {tab === 'mistakes' && (
          <div className="mistakes-main">
            {/* Filter */}
            <div className="mistake-filters">
              <button
                className={`mf-btn ${mistakeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setMistakeFilter('all')}
              >
                Tất cả ({MOCK_MISTAKES.length})
              </button>
              {subjects.map(s => (
                <button
                  key={s}
                  className={`mf-btn ${mistakeFilter === s ? 'active' : ''}`}
                  onClick={() => setMistakeFilter(s)}
                >
                  {s} ({MOCK_MISTAKES.filter(m => m.subject === s).length})
                </button>
              ))}
            </div>

            {/* Mistake cards */}
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
                    <div className="mistake-answer mistake-answer--wrong">
                      <span className="ma-label">❌ Bạn chọn:</span>
                      <span>{m.yourAnswer}</span>
                    </div>
                    <div className="mistake-answer mistake-answer--correct">
                      <span className="ma-label">✅ Đáp án đúng:</span>
                      <span>{m.correct}</span>
                    </div>
                  </div>
                  <div className="mistake-card__actions">
                    <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
                      📖 Xem giải thích
                    </button>
                    <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>
                      🃏 Thêm vào Flashcard
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mistake-summary">
              <div className="ms-item">
                <span className="ms-num" style={{ color: '#ef4444' }}>{MOCK_MISTAKES.length}</span>
                <span className="ms-label">Câu cần ôn</span>
              </div>
              <div className="ms-item">
                <span className="ms-num" style={{ color: 'var(--orange)' }}>
                  {MOCK_MISTAKES.reduce((a, b) => a + b.times, 0)}
                </span>
                <span className="ms-label">Lần sai tổng cộng</span>
              </div>
              <div className="ms-item">
                <span className="ms-num" style={{ color: 'var(--navy)' }}>
                  {subjects.length}
                </span>
                <span className="ms-label">Môn học</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
