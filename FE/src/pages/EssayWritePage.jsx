import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { essayApi } from '../services/api';
import CommentsSection from '../components/CommentsSection';
import LikeButton from '../components/LikeButton';
import './ExamPage.css';

// Simulate AI grading
function simulateAIScore(text) {
  if (text.trim().length < 100) return null;
  const w = text.trim().split(/\s+/).length;
  const hasIntro  = /mở bài|giới thiệu|đặt vấn đề/i.test(text);
  const hasEnd    = /kết bài|kết luận|tóm lại/i.test(text);
  const hasEx     = /ví dụ|thực tiễn|liên hệ|thực tế/i.test(text);
  const hasStruct = /thứ nhất|thứ hai|luận điểm|phân tích/i.test(text);
  return {
    intro:   Math.min(1,  parseFloat((hasIntro ? 1 : (w > 80 ? 0.5 : 0)).toFixed(1))),
    main:    Math.min(6,  parseFloat((Math.round((w/120)*2 + (hasStruct?1.5:0) + (hasEnd?0.5:0) + (text.length>600?1:0) + Math.random()*0.5)).toFixed(1))),
    apply:   Math.min(2,  parseFloat((hasEx ? (Math.random()>0.3?2:1.5) : (Math.random()>0.5?1:0.5)).toFixed(1))),
    writing: Math.min(1,  parseFloat((text.length>200 ? (Math.random()>0.2?1:0.5) : 0.5).toFixed(1))),
  };
}

// Timer Display for inside card
function TimerDisplay({ timeLimit, isActive }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return <>⏱ {minutes}:{seconds < 10 ? '0' : ''}{seconds}</>;
}

// Sticky Timer Bar - appears when card is scrolled out of view
function StickyTimerBar({ timeLimit, isActive, isVisible }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 300;

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: isWarning ? '#ef4444' : 'var(--navy)',
      color: 'white',
      padding: '12px',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: '14px',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
    }}>
      ⏱ Thời gian: {minutes}:{seconds < 10 ? '0' : ''}{seconds}
    </div>
  );
}

const RUBRIC = [
  { id: 'intro',   label: 'Mở bài',           max: 1, icon: '📝', desc: 'Giới thiệu vấn đề rõ ràng, dẫn dắt logic' },
  { id: 'main',    label: 'Luận điểm chính',  max: 6, icon: '🎯', desc: 'Trình bày đủ luận điểm, lập luận chặt chẽ, có dẫn chứng' },
  { id: 'apply',   label: 'Liên hệ thực tế',  max: 2, icon: '💡', desc: 'Liên hệ bản thân, thực tiễn, góc nhìn sáng tạo' },
  { id: 'writing', label: 'Chính tả & Trình bày', max: 1, icon: '✍️', desc: 'Không mắc lỗi chính tả, bố cục đoạn văn rõ ràng' },
];

function RubricBar({ item, score, max, animate }) {
  const pct = score !== null ? (score / max) * 100 : 0;
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? 'var(--orange)' : '#ef4444';
  return (
    <div className="rubric-bar">
      <div className="rubric-bar__head">
        <span className="rubric-icon">{item.icon}</span>
        <div className="rubric-info">
          <span className="rubric-label">{item.label}</span>
          <span className="rubric-desc">{item.desc}</span>
        </div>
        <span className="rubric-score" style={{ color: score !== null ? color : 'var(--gray-400)' }}>
          {score !== null ? `${score}/${max}` : `—/${max}`}
        </span>
      </div>
      <div className="rubric-track">
        <div className="rubric-fill" style={{ width: animate ? `${pct}%` : '0%', background: color, transition: animate ? 'width 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none' }} />
      </div>
    </div>
  );
}

export default function EssayWritePage() {
  const { essayId } = useParams();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState(null);
  const [grading, setGrading] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [tab, setTab] = useState('write');
  const [timerActive, setTimerActive] = useState(false);
  const [showStickyTimer, setShowStickyTimer] = useState(false);

  // Load essay on mount
  useEffect(() => {
    if (essayId) {
      essayApi.get(essayId)
        .then(res => {
          setEssay(res.data);
          setLoading(false);
          setTimerActive(true); // Start timer when essay loads
        })
        .catch(err => {
          console.error('Failed to load essay:', err);
          setLoading(false);
        });
    }
  }, [essayId]);

  // Detect if timer is out of view to show sticky timer
  useEffect(() => {
    if (!timerRef.current || !timerActive || submitted) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Show sticky timer when timer element is NOT visible
      setShowStickyTimer(!entry.isIntersecting);
    }, { threshold: 0 });

    observer.observe(timerRef.current);
    return () => observer.disconnect();
  }, [timerActive, submitted]);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const total = scores ? parseFloat(Object.values(scores).reduce((a, b) => a + b, 0).toFixed(1)) : 0;
  const totalMax = 10;
  const grade = total >= 8.5 ? { label: 'Xuất sắc',   color: '#22c55e',       emoji: '🏆' }
               : total >= 7   ? { label: 'Khá',         color: '#3b82f6',       emoji: '👍' }
               : total >= 5   ? { label: 'Trung bình',  color: 'var(--orange)', emoji: '📖' }
               :                { label: 'Cần cố gắng', color: '#ef4444',       emoji: '💪' };

  const handleSubmit = () => {
    if (answer.trim().length < 50) return;
    setGrading(true);
    setTab('result');
    setTimerActive(false);
    setTimeout(() => {
      const s = simulateAIScore(answer);
      setScores(s);
      setSubmitted(true);
      setGrading(false);
      setTimeout(() => setAnimateBar(true), 100);
    }, 2200);
  };

  const handleReset = () => {
    setAnswer('');
    setSubmitted(false);
    setScores(null);
    setShowSample(false);
    setGrading(false);
    setAnimateBar(false);
    setTab('write');
    setTimerActive(true);
  };

  if (loading) {
    return <div className="exam-page" style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>;
  }

  if (!essay) {
    return (
      <div className="exam-page" style={{ padding: '40px', textAlign: 'center' }}>
        <p>Không tìm thấy câu hỏi</p>
        <button className="btn btn-primary" onClick={() => navigate('/essays')} style={{ marginTop: '16px' }}>
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="exam-page page-enter">
      <div className="container exam-page__body" style={{ paddingBottom: showStickyTimer ? '70px' : '0' }}>
        {/* Back button */}
        <button className="btn btn-outline" onClick={() => navigate('/essays')} style={{ marginBottom: '20px' }}>
          ← Quay lại danh sách
        </button>

        {/* Question card with border and timer - timer element ref for intersection detection */}
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          border: '2px solid var(--navy)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          position: 'relative'
        }}>
          {/* Timer positioned at top-right of card */}
          {tab === 'write' && (
            <div ref={timerRef} style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: timerActive && !submitted && Math.floor((essay.time_limit || 40) * 60 / 60) < 5 ? '#ef4444' : 'var(--navy)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              zIndex: 10,
            }}>
              <TimerDisplay timeLimit={essay.time_limit || 40} isActive={timerActive && !submitted} />
            </div>
          )}

          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', paddingRight: '80px' }}>{essay.title}</h2>
          {essay.chapter && <p style={{ fontSize: '12px', color: 'var(--navy)', fontWeight: '600', marginBottom: '8px' }}>📑 {essay.chapter}</p>}
          <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '16px', color: 'var(--text-primary)' }}>{essay.question}</p>
          
          {/* Hint/Tips from database */}
          {essay.hint && (
            <div style={{
              padding: '12px',
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#854d0e',
              display: 'flex',
              gap: '8px'
            }}>
              <span style={{ minWidth: '20px' }}>💡</span>
              <span><strong>Gợi ý:</strong> {essay.hint}</span>
            </div>
          )}
          
          {/* Rubric chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>📊 Thang điểm:</span>
            {RUBRIC.map(r => (
              <span key={r.id} style={{ fontSize: '12px', padding: '4px 8px', background: 'var(--gray-100)', borderRadius: '4px' }}>
                {r.icon} {r.label} ({r.max}đ)
              </span>
            ))}
          </div>
        </div>

        {/* Tabs with border */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '20px', 
          borderBottom: '2px solid var(--navy)',
          background: 'white',
          borderRadius: '8px 8px 0 0',
          border: '2px solid var(--navy)',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0'
        }}>
          <button
            onClick={() => setTab('write')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: tab === 'write' ? 'white' : 'transparent',
              borderBottom: tab === 'write' ? '2px solid var(--primary)' : 'none',
              color: tab === 'write' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: tab === 'write' ? '600' : '500',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ✏️ Bài làm
          </button>
          <button
            onClick={() => setTab('result')}
            disabled={!submitted && !grading}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: tab === 'result' ? 'white' : 'transparent',
              borderBottom: tab === 'result' ? '2px solid var(--primary)' : 'none',
              color: tab === 'result' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: tab === 'result' ? '600' : '500',
              cursor: !submitted && !grading ? 'not-allowed' : 'pointer',
              opacity: !submitted && !grading ? 0.5 : 1,
              fontSize: '14px',
            }}
          >
            📊 Kết quả AI{submitted ? ` (${total}/10)` : ''}
          </button>
        </div>

        {/* Write panel with border */}
        {tab === 'write' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '0 0 8px 8px', border: '2px solid var(--navy)', borderTop: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <textarea
              placeholder="Viết bài tự luận của bạn tại đây...\n\nGợi ý cấu trúc:\n• Mở bài: Giới thiệu vấn đề\n• Thân bài: Triển khai từng luận điểm\n• Liên hệ thực tiễn\n• Kết bài: Tổng kết"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={submitted}
              style={{
                width: '100%',
                minHeight: '400px',
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {wordCount < 100 ? <span style={{ color: '#ef4444' }}>⚠️ {wordCount} từ (khuyến nghị ≥ 150)</span> : `✅ ${wordCount} từ`}
              </span>
            </div>
            {!submitted ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={answer.trim().length < 50}
                style={{ width: '100%' }}
              >
                Nộp bài & Nhờ AI chấm điểm
              </button>
            ) : (
              <div style={{ padding: '12px', background: 'var(--green-light)', borderRadius: '6px', color: '#22c55e', fontSize: '14px' }}>
                Bài đã nộp — xem kết quả ở tab <strong>Kết quả AI</strong>
              </div>
            )}
          </div>
        )}

        {/* Result panel with border */}
        {tab === 'result' && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '0 0 8px 8px', border: '2px solid var(--navy)', borderTop: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {grading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}></div>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>AI đang chấm bài...</p>
                {['Phân tích cấu trúc bài viết','Đánh giá luận điểm theo rubric','So sánh với bài làm mẫu','Tổng hợp điểm số & nhận xét'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', fontSize: '13px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)', animation: `pulse 1.5s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
                    {s}
                  </div>
                ))}
              </div>
            ) : scores && (
              <>
                {/* Score summary */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom: '12px' }}>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gray-200)" strokeWidth="8"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke={grade.color} strokeWidth="8"
                        strokeDasharray={`${(total/totalMax)*2*Math.PI*50} ${2*Math.PI*50}`}
                        strokeLinecap="round" transform="rotate(-90 60 60)"
                        style={{ transition:'stroke-dasharray 1s ease' }}
                      />
                      <text x="60" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill={grade.color}>{total}</text>
                      <text x="60" y="75" textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="var(--text-muted)">trên 10</text>
                    </svg>
                    <span style={{ fontSize: '32px' }}>{grade.emoji}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      Tổng điểm: <span style={{ color: grade.color }}>{total}/10 — {grade.label}</span>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                      {total >= 8.5 ? 'Bài làm xuất sắc! Lập luận chặt chẽ, đầy đủ luận điểm và liên hệ thực tiễn tốt.'
                       : total >= 7 ? 'Bài khá tốt! Cần bổ sung thêm ví dụ thực tế và trình bày ý rõ ràng hơn.'
                       : total >= 5 ? 'Đạt yêu cầu nhưng còn thiếu chiều sâu lập luận. Cần học hỏi thêm qua bài mẫu.'
                       : 'Bài còn nhiều điểm cần cải thiện. Hãy xem bài làm mẫu để tham khảo cách trình bày.'}
                    </p>
                    <button className="btn btn-outline" onClick={handleReset} style={{ marginTop: '12px' }}>
                      🔄 Làm lại
                    </button>
                  </div>
                </div>

                {/* Rubric breakdown */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Chi tiết theo tiêu chí</h4>
                  {RUBRIC.map(r => <RubricBar key={r.id} item={r} score={scores[r.id]} max={r.max} animate={animateBar} />)}
                </div>

                {/* Comments */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>💬 Nhận xét từ AI</h4>
                  {[
                    { icon:'✅', color:'#22c55e', title:'Điểm mạnh', text: scores.main >= 4 ? 'Luận điểm chính trình bày tương đối đầy đủ, có sự mạch lạc trong lập luận.' : 'Bạn đã cố gắng trình bày vấn đề. Cần rèn luyện thêm cách xây dựng luận điểm.' },
                    { icon:'⚠️', color:'var(--orange)', title:'Cần cải thiện', text: scores.apply < 1.5 ? 'Phần liên hệ thực tiễn còn mỏng, nên bổ sung ví dụ cụ thể từ thực tế Việt Nam.' : 'Bài viết cần chú ý hơn đến tính hệ thống và cấu trúc đoạn văn.' },
                    { icon:'💡', color:'var(--navy)', title:'Gợi ý học tập', text: 'Tham khảo bài làm mẫu điểm 10 bên dưới để học cách diễn đạt và sắp xếp ý tưởng.' },
                  ].map((c, i) => (
                    <div key={i} style={{ padding: '16px', background: 'var(--gray-100)', borderRadius: '6px', borderLeft: `4px solid ${c.color}`, marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '18px' }}>{c.icon}</span>
                        <div>
                          <strong style={{ color: c.color, fontSize: '14px' }}>{c.title}:</strong>
                          <p style={{ fontSize: '13px', marginTop: '4px', color: 'var(--text-muted)' }}>{c.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sample answer */}
                <div style={{ background: 'var(--gray-50)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  {!showSample ? (
                    <div style={{ textAlign: 'center', padding: '32px 24px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Bài làm mẫu điểm 10</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>Bạn đã nộp bài — mở khóa để xem bài làm mẫu và học hỏi cách trình bày chuẩn.</p>
                      <button className="btn btn-primary" onClick={() => setShowSample(true)}>
                        🔓 Mở khóa bài mẫu
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>📄 Bài làm mẫu điểm 10</span>
                        <span style={{ fontSize: '12px', background: 'var(--green-light)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px' }}>✨ Đã mở khóa</span>
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                        {essay.sample_answer ? essay.sample_answer.split('\n\n').map((para, i) => (
                          <p key={i} style={{ marginBottom: '12px' }}>{para}</p>
                        )) : 'Bài làm mẫu sẽ được cập nhật sớm.'}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .rubric-bar {
          margin-bottom: 16px;
        }
        .rubric-bar__head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .rubric-icon {
          font-size: 18px;
        }
        .rubric-info {
          flex: 1;
        }
        .rubric-label {
          display: block;
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
        }
        .rubric-desc {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
        }
        .rubric-score {
          font-weight: 600;
          font-size: 14px;
          min-width: 40px;
          text-align: right;
        }
        .rubric-track {
          height: 8px;
          background: var(--gray-200);
          border-radius: 4px;
          overflow: hidden;
        }
        .rubric-fill {
          height: 100%;
          border-radius: 4px;
        }
      `}</style>

      {/* Sticky timer bar appears when card is out of view */}
      <StickyTimerBar 
        timeLimit={essay?.time_limit || 40} 
        isActive={timerActive && !submitted}
        isVisible={showStickyTimer}
      />

      {/* Comments & Likes */}
      <div className="exam-footer-section container">
        <div className="exam-footer-row">
          <LikeButton likeableType="EssayQuestion" likeableId={essayId} />
        </div>
        <CommentsSection commentableType="EssayQuestion" commentableId={essayId} />
      </div>
    </div>
  );
}
