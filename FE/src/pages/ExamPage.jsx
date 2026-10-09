import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, useMatch } from 'react-router-dom';
import { examApi, documentApi, subscriptionApi } from '../services/api';
import api from '../services/api';
import { useFreemium } from '../hooks/useFreemium';
import './ExamPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// Countdown hook
// ─────────────────────────────────────────────────────────────────────────────
function useCountdown(initialSeconds, onExpire, paused) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);

  // Reset timer when initialSeconds changes (new exam)
  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

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
function QuestionNavigator({ total, current, answers = {}, bookmarks = new Set(), questions = [], onJump, mode = 'exam' }) {
  const getStatus = idx => {
    const question = questions[idx];
    if (!question) return 'unanswered';
    
    // Use question.id as key in answers object, not idx
    const userAnswer = answers[question.id];
    
    // If no answer yet
    if (userAnswer === undefined) {
      if (bookmarks.has(idx + 1)) return 'bookmarked';
      return 'unanswered';
    }
    
    // For exam mode: answered (đã làm) vs unanswered
    if (mode === 'exam') {
      return 'answered';
    }
    
    // For practice mode: show correct/wrong
    const isCorrect = userAnswer === question.correctAnswer;
    return isCorrect ? 'correct' : 'wrong';
  };

  // Count stats based on mode
  let correctCount = 0;
  let wrongCount = 0;
  let answeredCount = 0;
  
  questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans !== undefined) {
      answeredCount++;
      if (mode !== 'exam') {
        if (ans === q.correctAnswer) correctCount++;
        else wrongCount++;
      }
    }
  });

  return (
    <div className="nav-panel">
      <div className="nav-panel__legend">
        {mode === 'exam' ? (
          <>
            <span className="legend-item"><span className="legend-dot answered" />Đã làm ({answeredCount})</span>
            <span className="legend-item"><span className="legend-dot unanswered" />Chưa trả lời ({total - answeredCount})</span>
          </>
        ) : (
          <>
            <span className="legend-item"><span className="legend-dot correct" />Đúng ({correctCount})</span>
            <span className="legend-item"><span className="legend-dot wrong" />Sai ({wrongCount})</span>
            <span className="legend-item"><span className="legend-dot unanswered" />Chưa trả lời ({total - Object.keys(answers).length})</span>
          </>
        )}
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
              title={`Câu ${num}${bookmarks.has(num) ? ' (đã đánh dấu)' : ''}`}
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
        <span className="question-badge">Câu {question.order || question.id || '?'}</span>
        <div className="question-card__actions">
          <span className="question-subject">{question.subject}</span>
          <button
            className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={onBookmark}
            title={isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu câu này'}
          >
            {isBookmarked ? '' : ''}
            <span>{isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}</span>
          </button>
        </div>
      </div>

      <p className="question-text">{question.text}</p>

      {question.options ? (
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
      ) : (
        <div>
          <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px', color: '#666', fontSize: '13px', marginBottom: '12px' }}>
            {question.type === 'essay' ? 'Câu hỏi tự luận' : question.type === 'scenario' ? '🎭 Câu hỏi tình huống' : 'Câu hỏi'}
          </div>
          <textarea
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical'
            }}
            placeholder="Nhập câu trả lời của bạn tại đây..."
            value={selected || ''}
            onChange={(e) => onSelect(e.target.value)}
          />
        </div>
      )}
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

  const grade = pct >= 80 ? { label: 'Xuất sắc', color: '#22c55e', emoji: '' }
              : pct >= 65 ? { label: 'Khá',       color: '#3b82f6', emoji: '' }
              : pct >= 50 ? { label: 'Trung bình', color: '#f59e0b', emoji: '' }
              :             { label: 'Cần cố gắng', color: '#ef4444', emoji: '' };

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
          <button className="btn btn-orange" style={{ flex: 1 }} onClick={onRetry}>Làm lại</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowReview(v => !v)}>
            {showReview ? 'Ẩn đáp án' : 'Xem đáp án'}
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onHome}>Về trang chủ</button>
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
            const isEssayOrScenario = q.type === 'essay' || q.type === 'scenario';

            // Determine status badge and color
            let statusClass = 'correct';
            let statusLabel = 'Đúng';
            if (isEssayOrScenario && skipped) {
              statusClass = 'skipped';
              statusLabel = '— Bỏ qua';
            } else if (isEssayOrScenario && userAns) {
              statusClass = 'pending';
              statusLabel = 'Chờ chấm';
            } else if (!isEssayOrScenario) {
              if (isCorrect) {
                statusClass = 'correct';
                statusLabel = 'Đúng';
              } else if (skipped) {
                statusClass = 'skipped';
                statusLabel = '— Bỏ qua';
              } else {
                statusClass = 'wrong';
                statusLabel = '✗ Sai';
              }
            }

            return (
              <div key={q.id} className={`review-item ${isEssayOrScenario ? 'pending' : isCorrect ? 'correct' : skipped ? 'skipped' : 'wrong'}`}>
                <div className="review-item__head">
                  <span className="review-q-num">Câu {q.order || q.id}</span>
                  <span className={`review-verdict v-${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="review-q-text">{q.text}</p>

                {/* Multiple choice: show options */}
                {q.options && (
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
                )}

                {/* Essay/Scenario: show user's answer */}
                {isEssayOrScenario && (
                  <div className="review-answer-box" style={{ 
                    backgroundColor: '#f9f9f9', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px', 
                    padding: '12px',
                    marginTop: '12px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#333'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '8px' }}>📝 Câu trả lời của bạn:</strong>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {userAns || '(không có câu trả lời)'}
                    </p>
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && !isEssayOrScenario && !isCorrect && (
                  <div className="review-explanation">
                    <strong>💡 Giải thích:</strong> {q.explanation}
                  </div>
                )}

                {/* Pending review note for essay/scenario */}
                {isEssayOrScenario && userAns && (
                  <div className="review-note-pending" style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fcd34d',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#92400e'
                  }}>
                    <strong>Câu này đang chờ giáo viên chấm điểm</strong>
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
  const mode = searchParams.get('mode') || 'exam';
  const { checkAccess: checkFreemiumAccess } = useFreemium();

  // Phân biệt document (tài liệu) vs exam (đề thi thử)
  const isDocument = !!useMatch('/document/:examId');
  const contentApi = isDocument ? documentApi : examApi;

  // Exam meta + questions state
  const [examMeta, setExamMeta]   = useState({ id: examId, title: 'Đề thi', questions_count: 50, duration: 60 });
  const [questions, setQuestions] = useState([]);
  const [loadingQ,  setLoadingQ]  = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [attemptInfo, setAttemptInfo] = useState(null); // Track free attempts

  useEffect(() => {
    // Load exam metadata
    contentApi.get(examId)
      .then(res => {
        setExamMeta(res.data);
        
        // Check subject access
        const checkAccess = async () => {
          try {
            const token = localStorage.getItem('lh_token');
            
            if (!token) {
              console.log('No token - skipping access check');
              loadQuestions(res.data);
              return;
            }
            
            if (!res.data.subject_id) {
              console.log('No subject_id - skipping access check');
              loadQuestions(res.data);
              return;
            }

            // ── Check freemium access for BOTH exams and documents ──
            const freemiumFeature = isDocument ? 'document' : 'exam';
            const freemiumResult = await checkFreemiumAccess(freemiumFeature, {
              exam_id: examId,
              subject_id: res.data.subject_id,
            });

            console.log('📊 Freemium check result:', { feature: freemiumFeature, result: freemiumResult });

            if (!freemiumResult.can_access) {
              console.log('❌ Access denied - paywall');
              setAccessDenied(true);
              setLoadingQ(false);
              return;
            }

            // Store attempt info (only for exams)
            if (!isDocument) {
              setAttemptInfo({
                reason: freemiumResult.reason,
                attempts_used: freemiumResult.attempts_used || 0,
                attempts_remaining: freemiumResult.attempts_remaining !== undefined ? freemiumResult.attempts_remaining : null,
              });

              // Record exam attempt in DB
              try {
                const recordRes = await examApi.recordAttempt(examId, { subject_id: res.data.subject_id });
                console.log('📝 Exam attempt recorded:', recordRes.data);
              } catch (err) {
                console.error('Failed to record attempt:', err);
              }
            }

            console.log('✅ Access granted:', freemiumResult.reason);
          } catch (err) {
            console.error('Error checking access:', err);
          }
          
          // Load questions if access is granted
          loadQuestions(res.data);
        };
        
        checkAccess();
      })
      .catch(err => {
        console.error('Failed to load exam:', err);
        setLoadingQ(false);
      });
  }, [examId, isDocument]);
  
  const loadQuestions = (examMeta) => {
    // Fetch questions with full=1 to get correct_answer in practice mode
    const url = mode === 'practice' 
      ? `/${isDocument ? 'documents' : 'exams'}/${examId}/questions?full=1`
      : `/${isDocument ? 'documents' : 'exams'}/${examId}/questions`;
    
    api.get(url)
      .then(res => {
        setQuestions(res.data.map(q => ({
          id:            q.id,
          order:         q.order,
          type:          q.type,
          text:          q.content,
          options:       q.options,
          correctAnswer: q.correct_answer || null,
          explanation:   q.explanation || null,
          subject:       examMeta.subject || '',
          difficulty:    q.difficulty,
        })));
        setLoadingQ(false);
      })
      .catch(err => {
        console.error('Failed to load questions:', err);
        setQuestions([]);
        setLoadingQ(false);
      });
  };

  const TOTAL_SECS = (examMeta.duration || 60) * 60;

  const [current, setCurrent]         = useState(1);
  const [answers, setAnswers]         = useState({});
  const [bookmarks, setBookmarks]     = useState(new Set());
  const [submitted, setSubmitted]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remainingSecs, setRemaining] = useState(TOTAL_SECS);
  const [apiResults, setApiResults]   = useState(null); // results from /submit API

  // Mode: practice shows answer immediately, exam hides until submit
  // (declared again below after loading guard)

  // Expire callback
  const handleExpire = useCallback(() => { if (!submitted) setSubmitted(true); }, [submitted]);

  // isPractice used here before loading guard — compute from mode
  const { seconds, display } = useCountdown(TOTAL_SECS, handleExpire, submitted || (mode === 'practice'));

  // Keep track of remaining for results
  useEffect(() => { setRemaining(seconds); }, [seconds]);

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

  const handleSubmit = async () => {
    const unanswered = total - Object.keys(answers).length;
    if (unanswered > 0 && !showConfirm) { setShowConfirm(true); return; }
    setShowConfirm(false);

    // Call API submit — merge correct answers into questions for results screen
    try {
      const res = await contentApi.submit(examId, answers);
      const data = res.data; // { score, correct, wrong, skipped, total, results }
      setApiResults(data);
      // Merge correct_answer + explanation into questions
      setQuestions(prev => prev.map(q => {
        const r = data.results?.find(r => r.id === q.id);
        return r ? { ...q, correctAnswer: r.correct_answer, explanation: r.explanation } : q;
      }));
    } catch {
      // Fallback: submit offline using mock correct answers
      setApiResults(null);
    }
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setBookmarks(new Set());
    setCurrent(1);
    setSubmitted(false);
    setShowConfirm(false);
    setApiResults(null);
  };

  // ── Loading / empty guard ──
  if (loadingQ) {
    return (
      <div className="exam-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center', padding:60 }}>
          <div style={{ fontSize:40, marginBottom:16 }}></div>
          <p style={{ fontSize:16, color:'var(--navy)' }}>Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="exam-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center', padding:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
          <h3 style={{ fontSize:20, fontWeight:800, color:'var(--navy)', marginBottom:8 }}>Không có quyền truy cập</h3>
          <p style={{ fontSize:14, color:'var(--text-muted)', marginBottom:24 }}>Bạn không có quyền truy cập vào môn học này. Vui lòng nâng cấp tài khoản hoặc chọn môn học khác.</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>← Quay lại</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="exam-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center', padding:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
          <h3 style={{ fontSize:20, fontWeight:800, color:'var(--navy)', marginBottom:8 }}>Đề thi chưa có câu hỏi</h3>
          <p style={{ fontSize:14, color:'var(--text-muted)', marginBottom:24 }}>Admin chưa thêm câu hỏi cho đề thi này.</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>← Quay lại</button>
        </div>
      </div>
    );
  }

  const isPractice = mode === 'practice';
  const question   = questions[current - 1];
  const total      = questions.length;

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
              {isPractice ? 'Chế độ luyện tập' : 'Thi thật'}
            </span>
            {attemptInfo && attemptInfo.reason === 'free_exam_attempts' && (
              <span className="exam-attempt-badge">
                📝 Lần {attemptInfo.attempts_used + 1}/3 (Free)
              </span>
            )}
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
                questions={questions}
                onJump={goTo}
                mode={mode}
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

      {/* ── Comments & Likes removed ── */}
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
          {question.explanation && (
            <>
              <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>💡 <strong>Giải thích:</strong></p>
              <p className="explanation-text">{question.explanation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
