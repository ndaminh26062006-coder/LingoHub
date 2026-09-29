import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import './EssayPage.css';

// ── Mock rubric definition ────────────────────────────────────────────────────
const RUBRIC = [
  { id: 'intro',    label: 'Mở bài',                   max: 1, icon: '📝', desc: 'Giới thiệu vấn đề rõ ràng, dẫn dắt logic' },
  { id: 'main',     label: 'Luận điểm chính',           max: 6, icon: '🎯', desc: 'Trình bày đủ luận điểm, lập luận chặt chẽ, có dẫn chứng' },
  { id: 'apply',    label: 'Liên hệ thực tế / Sáng tạo', max: 2, icon: '💡', desc: 'Liên hệ bản thân, thực tiễn, có góc nhìn sáng tạo' },
  { id: 'writing',  label: 'Chính tả & Trình bày',      max: 1, icon: '✍️', desc: 'Không mắc lỗi chính tả, bố cục đoạn văn rõ ràng' },
];

// ── Sample exam questions ─────────────────────────────────────────────────────
const ESSAY_QUESTIONS = [
  {
    id: 1,
    subject: 'Tư tưởng Hồ Chí Minh',
    question: 'Phân tích tư tưởng Hồ Chí Minh về vấn đề dân tộc và cách mạng giải phóng dân tộc. Liên hệ với thực tiễn Việt Nam hiện nay.',
    time: 45,
    sampleAnswer: `**Mở bài:** Tư tưởng Hồ Chí Minh về vấn đề dân tộc là một trong những di sản lý luận vĩ đại nhất của lịch sử cách mạng Việt Nam...

**Luận điểm 1 — Độc lập dân tộc gắn liền với chủ nghĩa xã hội:**
Hồ Chí Minh khẳng định: "Không có gì quý hơn độc lập, tự do". Người xác định con đường cứu nước duy nhất đúng đắn là kết hợp độc lập dân tộc với chủ nghĩa xã hội...

**Luận điểm 2 — Cách mạng giải phóng dân tộc phải do Đảng Cộng sản lãnh đạo:**
Người chỉ rõ vai trò tiên phong của Đảng Cộng sản — đội ngũ tiên phong của giai cấp công nhân, nhân dân lao động và dân tộc Việt Nam...

**Luận điểm 3 — Sức mạnh đại đoàn kết toàn dân tộc:**
"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công." — Đây là s���i chỉ đỏ xuyên suốt tư tưởng Hồ Chí Minh...

**Liên hệ thực tiễn:**
Trong bối cảnh toàn cầu hóa hiện nay, tư tưởng của Người vẫn là kim chỉ nam: giữ vững độc lập, chủ quyền trong hội nhập quốc tế, phát huy sức mạnh đại đoàn kết dân tộc để xây dựng đất nước phồn vinh...

**Kết bài:** Tư tưởng Hồ Chí Minh về vấn đề dân tộc mãi là ánh sáng soi đường cho sự nghiệp xây dựng và bảo vệ Tổ quốc Việt Nam xã hội chủ nghĩa.`,
  },
  {
    id: 2,
    subject: 'Lịch sử Đảng',
    question: 'Trình bày ý nghĩa lịch sử của Cách mạng tháng Tám năm 1945. Tại sao đây được coi là mốc son chói lọi trong lịch sử dân tộc Việt Nam?',
    time: 40,
    sampleAnswer: `**Mở bài:** Cách mạng tháng Tám năm 1945 là một trong những sự kiện vĩ đại nhất trong lịch sử hàng nghìn năm dựng nước và giữ nước của dân tộc Việt Nam...

**Luận điểm 1 — Ý nghĩa dân tộc:**
Cách mạng tháng Tám đã chấm dứt ách thống trị hơn 80 năm của thực dân Pháp và phát xít Nhật, lập nên nước Việt Nam Dân chủ Cộng hòa...

**Luận điểm 2 — Ý nghĩa giai cấp:**
Lần đầu tiên trong lịch sử, chính quyền về tay nhân dân. Giai cấp công nhân, nông dân và các tầng lớp lao động trở thành chủ nhân đất nước...

**Luận điểm 3 — Ý nghĩa quốc tế:**
Cách mạng tháng Tám góp phần cổ vũ phong trào giải phóng dân tộc ở các nước thuộc địa trên toàn thế giới...

**Liên hệ thực tiễn:**
Bài học về chớp thời cơ, phát huy sức mạnh toàn dân tộc vẫn còn nguyên giá trị trong công cuộc đổi mới và hội nhập quốc tế hiện nay...`,
  },
  {
    id: 3,
    subject: 'Kinh tế chính trị',
    question: 'Phân tích quy luật giá trị trong nền kinh tế hàng hóa. Vận dụng quy luật này vào thực tiễn nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam.',
    time: 45,
    sampleAnswer: `**Mở bài:** Quy luật giá trị là quy luật kinh tế cơ bản nhất của sản xuất và lưu thông hàng hóa, chi phối mọi hoạt động kinh tế trong nền kinh tế hàng hóa...`,
  },
];

// ── AI Score simulation ────────────────────────────────────────────────────────
function simulateAIScore(text) {
  const len = text.trim().length;
  if (len < 100) return null;

  const wordCount = text.trim().split(/\s+/).length;
  const hasIntro     = /mở bài|giới thiệu|đặt vấn đề/i.test(text);
  const hasConclusion= /kết bài|kết luận|tóm lại/i.test(text);
  const hasExample   = /ví dụ|thực tiễn|liên hệ|thực tế/i.test(text);
  const hasStructure = /thứ nhất|thứ hai|luận điểm|phân tích/i.test(text);

  const intro   = hasIntro ? 1 : (wordCount > 80 ? 0.5 : 0);
  const main    = Math.min(6, Math.round(
    (wordCount / 120) * 2 +
    (hasStructure ? 1.5 : 0) +
    (hasConclusion ? 0.5 : 0) +
    (text.length > 600 ? 1 : 0) +
    Math.random() * 0.5
  ));
  const apply   = hasExample ? (Math.random() > 0.3 ? 2 : 1.5) : (Math.random() > 0.5 ? 1 : 0.5);
  const writing = text.length > 200 ? (Math.random() > 0.2 ? 1 : 0.5) : 0.5;

  return {
    intro:   Math.min(1, parseFloat(intro.toFixed(1))),
    main:    Math.min(6, parseFloat(main.toFixed(1))),
    apply:   Math.min(2, parseFloat(apply.toFixed(1))),
    writing: Math.min(1, parseFloat(writing.toFixed(1))),
  };
}

// ── RubricBar component ───────────────────────────────────────────────────────
function RubricBar({ item, score, max, animate }) {
  const pct = score !== null ? (score / max) * 100 : 0;
  const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--orange)' : '#ef4444';
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
        <div
          className="rubric-fill"
          style={{
            width: animate ? `${pct}%` : '0%',
            background: color,
            transition: animate ? 'width 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EssayPage() {
  const [selectedQ, setSelectedQ] = useState(0);
  const [answer, setAnswer]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores]       = useState(null);
  const [showSample, setShowSample] = useState(false);
  const [grading, setGrading]     = useState(false);
  const [animateBar, setAnimateBar] = useState(false);
  const [tab, setTab]             = useState('write'); // 'write' | 'result'

  const question = ESSAY_QUESTIONS[selectedQ];
  const total    = scores ? Object.values(scores).reduce((a, b) => a + b, 0) : 0;
  const totalMax = 10;

  const handleSubmit = () => {
    if (answer.trim().length < 50) return;
    setGrading(true);
    setTab('result');
    // Simulate AI grading delay
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
  };

  const grade = total >= 8.5 ? { label: 'Xuất sắc', color: 'var(--success)', emoji: '🏆' }
              : total >= 7   ? { label: 'Khá',       color: '#3b82f6',        emoji: '👍' }
              : total >= 5   ? { label: 'Trung bình', color: 'var(--orange)',  emoji: '📖' }
              :                { label: 'Cần cố gắng', color: '#ef4444',       emoji: '💪' };

  return (
    <div className="essay-page page-enter">
      <PageHeader
        title="Kho câu hỏi tự luận"
        subtitle="Nộp bài tự luận — AI chấm theo rubric chuẩn đại học, giải thích chi tiết từng tiêu chí"
        icon="🤖"
      />

      <div className="container essay-body">

        {/* ── Question selector ── */}
        <div className="essay-question-picker">
          {ESSAY_QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              className={`qpick-btn ${selectedQ === i ? 'active' : ''}`}
              onClick={() => { setSelectedQ(i); handleReset(); }}
            >
              <span className="qpick-subject">{q.subject}</span>
              <span className="qpick-time">⏱ {q.time} phút</span>
            </button>
          ))}
        </div>

        {/* ── Question card ── */}
        <div className="essay-question-card">
          <div className="essay-question-card__badge">
            <span>📋 Đề bài</span>
            <span className="eq-subject-badge">{question.subject}</span>
          </div>
          <p className="essay-question-text">{question.question}</p>
        </div>

        {/* ── Rubric info ── */}
        <div className="rubric-info-bar">
          <span className="rubric-info-label">📊 Thang điểm rubric:</span>
          {RUBRIC.map(r => (
            <span key={r.id} className="rubric-chip">
              {r.icon} {r.label} ({r.max}đ)
            </span>
          ))}
        </div>

        {/* ── Tab: Write / Result ── */}
        <div className="essay-tabs">
          <button className={`essay-tab ${tab === 'write' ? 'active' : ''}`} onClick={() => setTab('write')}>
            ✏️ Bài làm
          </button>
          <button
            className={`essay-tab ${tab === 'result' ? 'active' : ''}`}
            onClick={() => setTab('result')}
            disabled={!submitted && !grading}
          >
            📊 Kết quả AI {submitted && `(${total.toFixed(1)}/10)`}
          </button>
        </div>

        {/* ── Write tab ── */}
        {tab === 'write' && (
          <div className="essay-write-panel">
            <div className="essay-textarea-wrap">
              <textarea
                className="essay-textarea"
                placeholder="Viết bài tự luận của bạn tại đây...&#10;&#10;Gợi ý: Bắt đầu bằng Mở bài → Triển khai từng Luận điểm → Liên hệ thực tế → Kết bài"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={submitted}
                rows={16}
              />
              <div className="essay-counter">
                <span className={answer.trim().split(/\s+/).filter(Boolean).length < 100 ? 'counter-warn' : 'counter-ok'}>
                  {answer.trim().split(/\s+/).filter(Boolean).length} từ
                </span>
                <span className="counter-hint">(khuyến nghị ≥ 150 từ)</span>
              </div>
            </div>
            {!submitted ? (
              <button
                className="btn btn-primary essay-submit-btn"
                onClick={handleSubmit}
                disabled={answer.trim().length < 50}
              >
                🤖 Nộp bài & Nhờ AI chấm điểm
              </button>
            ) : (
              <div className="essay-submitted-note">
                ✅ Bài đã nộp — xem kết quả ở tab <strong>Kết quả AI</strong>
              </div>
            )}
          </div>
        )}

        {/* ── Result tab ── */}
        {tab === 'result' && (
          <div className="essay-result-panel">
            {grading ? (
              <div className="essay-grading">
                <div className="grading-spinner" />
                <div className="grading-steps">
                  <p className="grading-title">🤖 AI đang chấm bài...</p>
                  {['Phân tích cấu trúc bài viết', 'Đánh giá luận điểm theo rubric', 'So sánh với bài làm mẫu', 'Tổng hợp điểm số & nhận xét'].map((s, i) => (
                    <div key={i} className="grading-step">
                      <div className="grading-step__dot" style={{ animationDelay: `${i * 0.5}s` }} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : scores && (
              <div className="essay-scores">
                {/* Total score ring */}
                <div className="score-summary">
                  <div className="score-ring-wrap">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="56" fill="none" stroke="var(--gray-200)" strokeWidth="10"/>
                      <circle
                        cx="70" cy="70" r="56"
                        fill="none"
                        stroke={grade.color}
                        strokeWidth="10"
                        strokeDasharray={`${(total / totalMax) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                      />
                      <text x="70" y="64" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="800" fill={grade.color}>{total.toFixed(1)}</text>
                      <text x="70" y="86" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="var(--text-muted)">{grade.label}</text>
                    </svg>
                    <span className="score-emoji">{grade.emoji}</span>
                  </div>
                  <div className="score-summary__info">
                    <h3>Tổng điểm: <span style={{ color: grade.color }}>{total.toFixed(1)}/10</span></h3>
                    <p className="score-feedback">
                      {total >= 8.5 ? 'Bài làm xuất sắc! Lập luận chặt chẽ, đầy đủ luận điểm và liên hệ thực tiễn tốt.' :
                       total >= 7   ? 'Bài khá tốt! Cần bổ sung thêm ví dụ thực tế và trình bày ý rõ ràng hơn.' :
                       total >= 5   ? 'Đạt yêu cầu nhưng còn thiếu chiều sâu lập luận. Cần học hỏi thêm qua bài mẫu.' :
                                      'Bài còn nhiều điểm cần cải thiện. Hãy xem bài làm mẫu để tham khảo cách trình bày.'}
                    </p>
                    <button className="btn btn-outline" onClick={handleReset} style={{ marginTop: 12 }}>
                      🔄 Làm lại
                    </button>
                  </div>
                </div>

                {/* Rubric breakdown */}
                <div className="rubric-breakdown">
                  <h4 className="rubric-breakdown__title">Chi tiết theo tiêu chí</h4>
                  {RUBRIC.map(r => (
                    <RubricBar
                      key={r.id}
                      item={r}
                      score={scores[r.id]}
                      max={r.max}
                      animate={animateBar}
                    />
                  ))}
                </div>

                {/* AI Comments */}
                <div className="ai-comments">
                  <h4 className="ai-comments__title">💬 Nhận xét chi tiết từ AI</h4>
                  <div className="ai-comment-list">
                    {[
                      { icon: '✅', color: '#22c55e', title: 'Điểm mạnh', text: scores.main >= 4 ? 'Luận điểm chính trình bày tương đối đầy đủ, có sự mạch lạc trong lập luận.' : 'Bạn đã cố gắng trình bày vấn đề. Cần rèn luyện thêm cách xây dựng luận điểm.' },
                      { icon: '⚠️', color: 'var(--orange)', title: 'Cần cải thiện', text: scores.apply < 1.5 ? 'Phần liên hệ thực tiễn còn mỏng, nên bổ sung ví dụ cụ thể từ thực tế Việt Nam.' : 'Bài viết cần chú ý hơn đến tính hệ thống và cấu trúc đoạn văn.' },
                      { icon: '💡', color: 'var(--navy)', title: 'Gợi ý học tập', text: 'Tham khảo bài làm mẫu điểm 10 bên dưới để học cách diễn đạt và sắp xếp ý tưởng.' },
                    ].map((c, i) => (
                      <div key={i} className="ai-comment-item" style={{ borderLeftColor: c.color }}>
                        <span className="ai-comment-icon">{c.icon}</span>
                        <div>
                          <strong style={{ color: c.color }}>{c.title}:</strong>
                          <p>{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample answer gate */}
                <div className="sample-answer-section">
                  {!showSample ? (
                    <div className="sample-locked">
                      <div className="sample-locked__icon">🔒</div>
                      <div className="sample-locked__text">
                        <h4>Bài làm mẫu điểm 10</h4>
                        <p>Bạn đã nộp bài — hãy mở khóa để xem bài làm mẫu và học hỏi cách trình bày chuẩn.</p>
                      </div>
                      <button className="btn btn-orange sample-unlock-btn" onClick={() => setShowSample(true)}>
                        🔓 Mở khóa bài mẫu
                      </button>
                    </div>
                  ) : (
                    <div className="sample-unlocked">
                      <div className="sample-unlocked__head">
                        <span>📄 Bài làm mẫu điểm 10</span>
                        <span className="sample-badge">✨ Đã mở khóa</span>
                      </div>
                      <div className="sample-content">
                        {question.sampleAnswer.split('\n\n').map((para, i) => (
                          <p key={i} className="sample-para">{para}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
