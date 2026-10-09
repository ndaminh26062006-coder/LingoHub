import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { flashcardApi, toArray } from '../services/api';
import CommentsSection from '../components/CommentsSection';
import QuickLikeWidget from '../components/QuickLikeWidget';
import CommentsModal from '../components/CommentsModal';
import './FlashcardPage.css';

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

function VisibilityBadge({ visibility }) {
  return visibility === 'public'
    ? <span className="vis-badge vis-badge--public">Công khai</span>
    : <span className="vis-badge vis-badge--private">Riêng tư</span>;
}

// Deck Card (grid item)
function DeckCard({ deck, onStudy, onEdit, isOwn, onViewComments }) {
  return (
    <div className="deck-card">
      <div className="deck-card__top">
        <div className="deck-card__icon" style={{ background: `${deck.color || '#0891b2'}15`, color: deck.color || '#0891b2' }}>
          {deck.icon || ''}
        </div>
        <div className="deck-card__badges">
          <VisibilityBadge visibility={deck.visibility} />
          {deck.is_official && <span className="vis-badge vis-badge--admin">Chính thức</span>}
        </div>
      </div>
      <h4 className="deck-card__name">{deck.name}</h4>
      <p className="deck-card__subject">{deck.subject_name || 'Flashcard'}</p>
      <div className="deck-card__meta">
        <span>{deck.card_count || 0} thẻ</span>
        {deck.likes && <span>❤️ {deck.likes}</span>}
      </div>
      {!isOwn && deck.owner_name && deck.owner_name !== 'Admin' && (
        <div className="deck-card__owner">
          <span className="deck-owner-badge deck-owner-badge--sv">
            {deck.owner_name}
          </span>
        </div>
      )}
      <QuickLikeWidget 
        likeableType="FlashcardDeck" 
        likeableId={deck.id}
        onViewComments={onViewComments}
      />
      <div className="deck-card__actions">
        <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => onStudy(deck)}>
          ▶ Học ngay
        </button>
        {isOwn && (
          <button className="btn btn-outline deck-card__edit" onClick={() => onEdit(deck)} title="Chỉnh sửa">
          </button>
        )}
      </div>
    </div>
  );
}
// Study View (flip cards)
function StudyView({ deck, onBack, onViewComments }) {
  const [cardIdx, setCardIdx] = useState(0);
  const [known, setKnown] = useState(new Set());
  const [repeat, setRepeat] = useState(new Set());
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  // Load cards for this deck
  useEffect(() => {
    if (deck.id) {
      flashcardApi.getCards(deck.id)
        .then(res => {
          const cardsData = res.data.data || res.data || [];
          setCards(toArray(cardsData));
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load cards:', err);
          setLoading(false);
        });
    }
  }, [deck.id]);

  if (loading) {
    return (
      <div className="fc-study-view page-enter">
        <div className="study-header">
          <button className="btn btn-outline study-back-btn" onClick={onBack}>← Quay lại</button>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="fc-study-view page-enter">
        <div className="study-header">
          <button className="btn btn-outline study-back-btn" onClick={onBack}>← Quay lại</button>
        </div>
        <div className="fc-empty"><span>🔍</span><p>Bộ thẻ này chưa có thẻ nào</p></div>
      </div>
    );
  }

  const card = cards[cardIdx];
  const progress = Math.round((cardIdx / cards.length) * 100);

  const advance = () => cardIdx + 1 >= cards.length ? setDone(true) : setCardIdx(i => i + 1);
  const handleKnow = () => { setKnown(s => new Set([...s, card.id])); advance(); };
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
          <span className="study-deck-icon" style={{ color: deck.color || '#0891b2' }}>{deck.icon || ''}</span>
          <span className="study-deck-name">{deck.name}</span>
        </div>
        {deck.is_official && <span className="vis-badge vis-badge--admin" style={{ fontSize: 11 }}>Chính thức</span>}
      </div>

      {/* Progress */}
      <div className="fc-progress-wrap">
        <div className="fc-progress-info">
          <span className="fc-progress-text">Thẻ <strong>{Math.min(cardIdx + 1, cards.length)}</strong> / {cards.length}</span>
          <div className="fc-progress-stats">
            <span className="fc-stat know">Thuộc: {known.size}</span>
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
            <button className="btn btn-primary" onClick={restart}>Làm lại từ đầu</button>
            {repeat.size > 0 && (
              <button className="btn btn-outline" onClick={() => { setCardIdx(0); setKnown(new Set()); setRepeat(new Set()); setDone(false); }}>
                ↺ Ôn {repeat.size} thẻ chưa thuộc
              </button>
            )}
            <button className="btn btn-outline" onClick={onBack}>← Về danh sách</button>
          </div>

          {/* Comments & Likes */}
          <div className="exam-footer-section container" style={{ marginTop: '32px' }}>
            <div className="exam-footer-row">
              <QuickLikeWidget likeableType="FlashcardDeck" likeableId={deck.id} onViewComments={onViewComments} />
            </div>
            <CommentsSection commentableType="FlashcardDeck" commentableId={deck.id} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function FlashcardPage() {
  const { user } = useAuth();

  const [mainTab, setMainTab] = useState('official');
  const [studyDeck, setStudyDeck] = useState(null);
  const [myDecks, setMyDecks] = useState([]);
  const [communityDecks, setCommunityDecks] = useState([]);
  const [officialDecks, setOfficialDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCommunity, setSearchCommunity] = useState('');
  
  // State for Comments Modal
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedItemForComments, setSelectedItemForComments] = useState(null);

  // Load decks
  useEffect(() => {
    Promise.all([
      flashcardApi.list({ is_official: true }).then(res => {
        const decks = toArray(res.data.data || res.data);
        setOfficialDecks(decks);
      }),
      flashcardApi.list({ is_official: false }).then(res => {
        const decks = toArray(res.data.data || res.data);
        setCommunityDecks(decks);
      }),
      user ? flashcardApi.myDecks().then(res => {
        const decks = toArray(res.data.data || res.data);
        setMyDecks(decks);
      }) : Promise.resolve(),
    ]).then(() => setLoading(false))
      .catch(err => {
        console.error('Failed to load decks:', err);
        setLoading(false);
      });
  }, [user]);

  // Study mode handler with freemium check
  const handleStudyDeck = (deck) => {
    setStudyDeck(deck);
  };

  // Study mode
  if (studyDeck) {
    return (
      <div className="flashcard-page page-enter">
        <PageHeader title="Flashcard" subtitle={studyDeck.name} icon="" accentColor={studyDeck.color} />
        <div className="container fc-body">
          <StudyView deck={studyDeck} onBack={() => setStudyDeck(null)} onViewComments={() => setCommentsModalOpen(true)} />
        </div>
      </div>
    );
  }

  const filteredCommunity = searchCommunity.trim()
    ? communityDecks.filter(d =>
        d.name.toLowerCase().includes(searchCommunity.toLowerCase()) ||
        (d.subject_name && d.subject_name.toLowerCase().includes(searchCommunity.toLowerCase()))
      )
    : communityDecks;

  if (loading) {
    return (
      <div className="flashcard-page page-enter">
        <PageHeader title="Flashcard" subtitle="Lật thẻ ghi nhớ khái niệm" icon="" />
        <div className="container fc-body" style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flashcard-page page-enter">
      <PageHeader
        title="Flashcard"
        subtitle="Lật thẻ ghi nhớ khái niệm — bộ thẻ chính thức từ Admin và cộng đồng sinh viên"
        icon=""
      />

      <div className="container fc-body">
        {/* Main tabs */}
        <div className="fc-tabs">
          <button className={`fc-tab ${mainTab === 'official' ? 'active' : ''}`} onClick={() => setMainTab('official')}>
            Bộ thẻ chính thức
            <span className="fc-tab-count">{officialDecks.length}</span>
          </button>
          <button className={`fc-tab ${mainTab === 'community' ? 'active' : ''}`} onClick={() => setMainTab('community')}>
            Cộng đồng
            <span className="fc-tab-count">{communityDecks.length}</span>
          </button>
          <button className={`fc-tab ${mainTab === 'mine' ? 'active' : ''}`} onClick={() => setMainTab('mine')}>
            Của tôi
            <span className="fc-tab-count">{myDecks.length}</span>
          </button>
        </div>

        {/* TAB: OFFICIAL */}
        {mainTab === 'official' && (
          <div className="fc-tab-content page-enter">
            <div className="fc-tab-header">
              <div>
                <h3 className="fc-section-title">Bộ thẻ chính thức từ Admin</h3>
                <p className="fc-section-sub">Được kiểm duyệt và đảm bảo chất lượng</p>
              </div>
              <span className="fc-official-badge">Đã kiểm duyệt</span>
            </div>
            {officialDecks.length === 0 ? (
              <div className="fc-empty"><span></span><p>Chưa có bộ thẻ chính thức</p></div>
            ) : (
              <div className="deck-grid">
                {officialDecks.map(deck => (
                  <DeckCard 
                    key={deck.id} 
                    deck={deck} 
                    onStudy={handleStudyDeck} 
                    isOwn={false}
                    onViewComments={() => {
                      setSelectedItemForComments({ type: 'FlashcardDeck', id: deck.id, title: deck.name });
                      setCommentsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: COMMUNITY */}
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
            {filteredCommunity.length === 0 ? (
              <div className="fc-empty"><span>🔍</span><p>Không tìm thấy bộ thẻ phù hợp</p></div>
            ) : (
              <div className="deck-grid">
                {filteredCommunity.map(deck => (
                  <DeckCard 
                    key={deck.id} 
                    deck={deck} 
                    onStudy={handleStudyDeck} 
                    isOwn={false}
                    onViewComments={() => {
                      setSelectedItemForComments({ type: 'FlashcardDeck', id: deck.id, title: deck.name });
                      setCommentsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: MINE */}
        {mainTab === 'mine' && (
          <div className="fc-tab-content page-enter">
            <div className="fc-tab-header">
              <div>
                <h3 className="fc-section-title">Bộ thẻ của tôi</h3>
                <p className="fc-section-sub">Tạo và quản lý bộ thẻ cá nhân</p>
              </div>
              {user ? (
                <button className="btn btn-orange" onClick={() => { /* TODO: Implement create deck */ }}>
                  + Tạo bộ thẻ mới
                </button>
              ) : (
                <a href="/login" className="btn btn-outline">Đăng nhập để tạo</a>
              )}
            </div>

            {!user ? (
              <div className="fc-login-prompt">
                <span className="fc-lp-icon"></span>
                <h4>Đăng nhập để tạo bộ thẻ</h4>
                <p>Bạn cần đăng nhập để tạo và quản lý bộ thẻ cá nhân.</p>
                <a href="/login" className="btn btn-primary">Đăng nhập ngay</a>
              </div>
            ) : myDecks.length === 0 ? (
              <div className="fc-empty">
                <span></span>
                <p>Bạn chưa có bộ thẻ nào.</p>
                <button className="btn btn-orange" onClick={() => { /* TODO: Implement create deck */ }}>+ Tạo bộ thẻ đầu tiên</button>
              </div>
            ) : (
              <div className="deck-grid">
                {myDecks.map(deck => (
                  <DeckCard 
                    key={deck.id} 
                    deck={deck} 
                    onStudy={handleStudyDeck} 
                    isOwn={true}
                    onViewComments={() => {
                      setSelectedItemForComments({ type: 'FlashcardDeck', id: deck.id, title: deck.name });
                      setCommentsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
