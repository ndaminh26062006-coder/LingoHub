import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { generateQuestions, examList } from '../data/mockData';
import './ExamPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// Countdown hook
// ─────────────────────────────────────────────────────────────────────────────
function useCountdown(initialSeconds, onExpire, paused) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused, onExpire]);

  const fmt = s => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return { seconds, display: fmt(seconds) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Timer widget
// ─────────────────────────────────────────────────────────────────────────────
function TimerWidget({ seconds, display, totalSeconds }) {
  const pct = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const urgent = seconds < 120;
  const warning = seconds < 300;
  const color = urgent ? '#ef4444' : warning ? '#f59e0b' : 'var(--navy)';

  // SVG circle progress
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className={`timer-widget ${urgent ? 'urgent' : warning ? 'warning' : ''}`}>
      <svg width="60" height="60" viewBox="0 0 60 60" className="timer-svg">
        <circle cx="30" cy="30" r={r} fill="none" stroke="var(--gray-200)" strokeWidth="4" />
        <circle
          cx="30" cy="30" r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 30 30)"
          style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s' }}
        />
      </svg>
      <div className="timer-display" style={{ color }}>
        <span className="timer-time">{display}</span>
        <span className="timer-label">{urgent ? '⚠️ Sắp hết giờ' : 'Còn lại'}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Question Navigator panel
// ─────────────────────────────────────────────────────────────────────────────
function QuestionNavigator({ total, current, answers, bookmarks, onJump }) {
  const getStatus = idx => {
    if (bookmarks.has(idx + 1)) return 'bookmarked';
    if (answers[idx + 1] !== undefined) return 'answered';
    return 'unanswered';
  };

  const counts = {
    answered:   Object.keys(answers).length,
    bookmarked: bookmarks.size,
    unanswered: total - Object.keys(answers).length,
  };

  return (
    <div className="nav-panel">
      <div className="nav-panel__legend">
        <span className="legend-item"><span className="legend-dot answered" />Đã trả lời ({counts.answered})</span>
        <span className="legend-item"><span className="legend-dot bookmarked" />Đánh dấu ({counts.bookmarked})</span>
        <span className="legend-item"><span className="legend-dot unanswered" />Chưa trả lời ({counts.unanswered})</span>
      </div>
      <div className="nav-grid">
        {Array.from({ length: total }, (_, i) => {
          const status = getStatus(i);
          const num = i + 1;
          return (
            <button
              key={num}
              className={`nav-btn nav-btn--${status} ${current === num ? 'nav-btn--current' : ''}`}
              onClick={() => onJump(num)}
              title={`Câu ${num}${status === 'bookmarked' ? ' (đã đánh dấu)' : ''}`}
            >
              {bookmarks.has(num) && <span className="nav-btn__bm">🔖</span>}
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single Question card (exam mode — no answer reveal)
// ─────────────────────────────────────────────────────────────────────────────
function ExamQuestion({ question, selected, onSelect, isBookmarked, onBookmark }) {
  return (
    <div className="question-card">
      <div className="question-card__header">
        <span className="question-badge">Câu {question.id}</span>
        <div className="question-card__actions">
          <span className="question-subject">{question.subject}</span>
          <button
            className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={onBookmark}
            title={isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu câu này'}
          >
            {isBookmarked ? '🔖' : '🏷️'}
            <span>{isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}</span>
          </button>
        </div>
      </div>

      <p className="question-text">{question.text}</p>

      <div className="options-list">
        {question.options.map(opt => (
          <button
            key={opt.id}
            className={`option-btn ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => onSelect(opt.id)}
          >
            <span className="option-letter">{opt.id}</span>
            <span className="option-text">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Results screen
// ─────────────────────────────────────────────────────────────────────────────
function ResultsScreen({ questions, answers, durationSecs, totalSecs, examTitle, onRetry, onHome }) {
  const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const total   = questions.length;
  const pct     = Math.round((correct / total) * 100);
  const timeTaken = totalSecs - durationSecs;

  const grade = pct >= 80 ? { label: 'Xuất sắc', color: '#22c55e', emoji: '🏆' }
              : pct >= 65 ? { label: 'Khá',       color: '#3b82f6', emoji: '👍' }
              : pct >= 50 ? { label: 'Trung bình', color: '#f59e0b', emoji: '📖' }
              :             { label: 'Cần cố gắng', color: '#ef4444', emoji: '💪' };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const [showReview, setShowReview] = useState(false);

  return (
    <div className="results-page page-enter">
      <div className="results-card">
        <div className="results-header" style={{ background: `linear-gradient(135deg, ${grade.color}20, ${grade.color}08)` }}>
          <div className="results-emoji">{grade.emoji}</div>
          <h2 className="results-title">Kết quả bài thi</h2>
          <p className="results-exam-name">{examTitle}</p>
        </div>

        <div className="results-score-ring">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="66" fill="none" stroke="var(--gray-200)" strokeWidth="10" />
            <circle
              cx="80" cy="80" r="66"
              fill="none"
              stroke={grade.color}
              strokeWidth="10"
              strokeDasharray={`${(pct / 100) * 2 * Math.PI * 66} ${2 * Math.PI * 66}`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dasharray 1.2s ease' }}
            />
            <text x="80" y="72" textAnchor="middle" dominantBaseline="middle" fontSize="34" fontWeight="800" fill={grade.color}>{pct}%</text>
            <text x="80" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="var(--text-muted)">{grade.label}</text>
          </svg>
        </div>

        <div className="results-stats">
          <div className="result-stat">
            <span className="result-stat__value" style={{ color: '#22c55e' }}>{correct}</span>
            <span className="result-stat__label">Đúng</span>
          </div>
          <div className="result-stat">
            <span className="result-stat__value" style={{ color: '#ef4444' }}>{total - correct}</span>
            <span className="result-stat__label">Sai</span>
          </div>
          <div className="result-stat">
            <span className="result-stat__value" style={{ color: 'var(--navy)' }}>{total - Object.keys(answers).length}</span>
            <span className="result-stat__label">Bỏ qua</span>
          </div>
          <div className="result-stat">
            <span className="result-stat__value" style={{ color: 'var(--orange-dark)' }}>{fmt(timeTaken)}</span>
            <span className="result-stat__label">Thời gian</span>
          </div>
        </div>

        <div className="results-actions">
          <button className="btn btn-orange" style={{ flex: 1 }} onClick={onRetry}>🔄 Làm lại</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowReview(v => !v)}>
            {showReview ? '▲ Ẩn đáp án' : '📋 Xem đáp án'}
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onHome}>🏠 Về trang chủ</button>
        </div>
      </div>

      {/* Answer review */}
      {showReview && (
        <div className="review-list">
          <h3 className="review-title">Chi tiết từng câu</h3>
          {questions.map(q => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const skipped = userAns === undefined;
            return (
              <div key={q.id} className={`review-item ${isCorrect ? 'correct' : skipped ? 'skipped' : 'wrong'}`}>
                <div className="review-item__head">
                  <span className="review-q-num">Câu {q.id}</span>
                  <span className={`review-verdict ${isCorrect ? 'v-correct' : skipped ? 'v-skip' : 'v-wrong'}`}>
                    {isCorrect ? '✓ Đúng' : skipped ? '— Bỏ qua' : '✗ Sai'}
                  </span>
                </div>
                <p className="review-q-text">{q.text}</p>
                <div className="review-options">
                  {q.options.map(opt => {
                    const isCorrectOpt = opt.id === q.correctAnswer;
                    const isUserOpt = opt.id === userAns;
                    return (
                      <div
                        key={opt.id}
                        className={`review-option ${isCorrectOpt ? 'review-option--correct' : ''} ${isUserOpt && !isCorrect ? 'review-option--wrong' : ''}`}
                      >
                        <span className="option-letter">{opt.id}</span>
                        <span>{opt.text}</span>
                        {isCorrectOpt && <span className="opt-mark">✓</span>}
                        {isUserOpt && !isCorrect && <span className="opt-mark wrong-mark">✗</span>}
                      </div>
                    );
                  })}
                </div>
                {!isCorrect && (
                  <div className="review-explanation">
                    <strong>💡 Giải thích:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ExamPage — orchestrates everything
// ─────────────────────────────────────────────────────────────────────────────
export default function ExamPage() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'exam'; // 'exam' | 'practice'

  // Find exam meta
  const examMeta = examList.find(e => e.id === examId) || {
    id: examId, title: 'Đề thi', questions: 50, duration: 60,
  };
  const TOTAL_SECS = examMeta.duration * 60;

  // State
  const [questions]   = useState(() => generateQuestions(examMeta.questions || 50));
  const [current, setCurrent]       = useState(1);
  const [answers, setAnswers]       = useState({});       // { qId: 'A'|'B'|'C'|'D' }
  const [bookmarks, setBookmarks]   = useState(new Set());
  const [submitted, setSubmitted]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remainingSecs, setRemaining] = useState(TOTAL_SECS);

  // Mode: practice shows answer immediately, exam hides until submit
  const isPractice = mode === 'practice';

  // Expire callback
  const handleExpire = useCallback(() => { if (!submitted) setSubmitted(true); }, [submitted]);

  const { seconds, display } = useCountdown(TOTAL_SECS, handleExpire, submitted || isPractice);

  // Keep track of remaining for results
  useEffect(() => { setRemaining(seconds); }, [seconds]);

  const question = questions[current - 1];
  const total    = questions.length;

  const selectAnswer = (qId, optId) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const toggleBookmark = qNum => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(qNum) ? next.delete(qNum) : next.add(qNum);
      return next;
    });
  };

  const goTo = num => setCurrent(num);
  const goPrev = () => current > 1 && setCurrent(current - 1);
  const goNext = () => current < total && setCurrent(current + 1);

  const handleSubmit = () => {
    const unanswered = total - Object.keys(answers).length;
    if (unanswered > 0 && !showConfirm) { setShowConfirm(true); return; }
    setShowConfirm(false);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setBookmarks(new Set());
    setCurrent(1);
    setSubmitted(false);
    setShowConfirm(false);
  };

  // ── Submitted → show results ──
  if (submitted && !isPractice) {
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        durationSecs={remainingSecs}
        totalSecs={TOTAL_SECS}
        examTitle={examMeta.title}
        onRetry={handleRetry}
        onHome={() => navigate('/')}
      />
    );
  }

  // ── Exam / Practice UI ──
  return (
    <div className="exam-page">
      {/* ── Top bar ── */}
      <div className="exam-topbar">
        <div className="exam-topbar__left">
          <button className="exam-back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div className="exam-topbar__info">
            <span className="exam-topbar__title">{examMeta.title}</span>
            <span className={`exam-topbar__mode ${isPractice ? 'mode-practice' : 'mode-exam'}`}>
              {isPractice ? '📖 Chế độ luyện tập' : '⏱️ Thi thật'}
            </span>
          </div>
        </div>

        <div className="exam-topbar__center">
          <span className="exam-progress-text">
            {Object.keys(answers).length}/{total} câu đã trả lời
          </span>
          <div className="exam-progress-bar">
            <div
              className="exam-progress-fill"
              style={{ width: `${(Object.keys(answers).length / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="exam-topbar__right">
          {!isPractice && (
            <TimerWidget seconds={seconds} display={display} totalSeconds={TOTAL_SECS} />
          )}
          {!isPractice && (
            <button className="btn btn-orange exam-submit-btn" onClick={handleSubmit}>
              Nộp bài
            </button>
          )}
        </div>
      </div>

      {/* ── Main area: question left + navigator right ── */}
      <div className="exam-body">
        {/* LEFT: Question */}
        <div className="exam-main">
          {isPractice ? (
            <PracticeQuestion
              question={question}
              selected={answers[question.id]}
              onSelect={opt => selectAnswer(question.id, opt)}
              isBookmarked={bookmarks.has(current)}
              onBookmark={() => toggleBookmark(current)}
            />
          ) : (
            <ExamQuestion
              question={question}
              selected={answers[question.id]}
              onSelect={opt => selectAnswer(question.id, opt)}
              isBookmarked={bookmarks.has(current)}
              onBookmark={() => toggleBookmark(current)}
            />
          )}

          {/* Navigation arrows */}
          <div className="exam-nav-arrows">
            <button className="btn btn-outline" onClick={goPrev} disabled={current === 1}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Câu trước
            </button>
            <span className="exam-nav-pos">{current} / {total}</span>
            <button className="btn btn-primary" onClick={goNext} disabled={current === total}>
              Câu tiếp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* RIGHT: Navigator */}
        <aside className="exam-sidebar">
          <div className="exam-sidebar__sticky">
            {!isPractice && (
              <div className="sidebar-timer-card">
                <TimerWidget seconds={seconds} display={display} totalSeconds={TOTAL_SECS} />
              </div>
            )}

            <div className="sidebar-nav-card">
              <p className="sidebar-nav-title">Bảng điều hướng</p>
              <QuestionNavigator
                total={total}
                current={current}
                answers={answers}
                bookmarks={bookmarks}
                onJump={goTo}
              />
            </div>

            {!isPractice && (
              <button className="btn btn-orange submit-sidebar-btn" onClick={handleSubmit}>
                Nộp bài ({Object.keys(answers).length}/{total})
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ── Confirm submit modal ── */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Xác nhận nộp bài</h3>
            <p>
              Bạn còn <strong>{total - Object.keys(answers).length}</strong> câu chưa trả lời.
              Bạn có chắc muốn nộp bài?
            </p>
            <div className="modal__actions">
              <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>Tiếp tục làm</button>
              <button className="btn btn-orange" onClick={handleSubmit}>Nộp bài ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Practice Question — shows correct/wrong + explanation after selecting
// (defined here, used in ExamPage above)
// ─────────────────────────────────────────────────────────────────────────────
function PracticeQuestion({ question, selected, onSelect, isBookmarked, onBookmark }) {
  const answered = selected !== undefined;

  const getOptClass = optId => {
    if (!answered) return '';
    if (optId === question.correctAnswer) return 'correct';
    if (optId === selected) return 'wrong';
    return '';
  };

  return (
    <div className="question-card">
      <div className="question-card__header">
        <span className="question-badge">Câu {question.id}</span>
        <div className="question-card__actions">
          <span className="question-subject">{question.subject}</span>
          <button
            className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={onBookmark}
          >
            {isBookmarked ? '🔖' : '🏷️'}
            <span>{isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}</span>
          </button>
        </div>
      </div>

      <p className="question-text">{question.text}</p>

      <div className="options-list">
        {question.options.map(opt => (
          <button
            key={opt.id}
            className={`option-btn ${selected === opt.id ? 'selected' : ''} ${getOptClass(opt.id)}`}
            onClick={() => !answered && onSelect(opt.id)}
            disabled={answered}
          >
            <span className="option-letter">{opt.id}</span>
            <span className="option-text">{opt.text}</span>
            {answered && opt.id === question.correctAnswer && (
              <span className="opt-correct-icon">✓</span>
            )}
            {answered && opt.id === selected && opt.id !== question.correctAnswer && (
              <span className="opt-wrong-icon">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Instant explanation */}
      {answered && (
        <div className={`explanation-box ${selected === question.correctAnswer ? 'explanation-correct' : 'explanation-wrong'}`}>
          <div className="explanation-header">
            {selected === question.correctAnswer
              ? <><span className="expl-icon">✅</span><strong>Chính xác!</strong></>
              : <><span className="expl-icon">❌</span><strong>Chưa đúng.</strong> Đáp án đúng là <strong>{question.correctAnswer}</strong></>
            }
          </div>
          <p className="explanation-text">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
