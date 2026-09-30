import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import './EssayPage.css';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'tu-tuong-hcm',
    name: 'Tư tưởng Hồ Chí Minh',
    icon: '⭐',
    color: '#c0392b',
    desc: 'Các câu hỏi tự luận về tư tưởng, đạo đức và phong cách Hồ Chí Minh',
    count: 12,
  },
  {
    id: 'lich-su-dang',
    name: 'Lịch sử Đảng',
    icon: '🏛️',
    color: '#1B3A6B',
    desc: 'Lịch sử hình thành và phát triển của Đảng Cộng sản Việt Nam',
    count: 10,
  },
  {
    id: 'ktct',
    name: 'Kinh tế Chính trị',
    icon: '📊',
    color: '#F5A623',
    desc: 'Các quy luật kinh tế, học thuyết giá trị và kinh tế thị trường',
    count: 9,
  },
  {
    id: 'cnxhkh',
    name: 'Chủ nghĩa XH Khoa học',
    icon: '🔬',
    color: '#254d8f',
    desc: 'Lý luận về chủ nghĩa xã hội và con đường đi lên CNXH',
    count: 8,
  },
  {
    id: 'phap-luat',
    name: 'Pháp luật đại cương',
    icon: '⚖️',
    color: '#16a34a',
    desc: 'Cơ bản về nhà nước, pháp luật và hệ thống pháp luật Việt Nam',
    count: 11,
  },
  {
    id: 'triet-hoc',
    name: 'Triết học Mác-Lênin',
    icon: '🧠',
    color: '#7c3aed',
    desc: 'Phép biện chứng duy vật, nhận thức luận và các quy luật triết học',
    count: 14,
  },
];

const QUESTIONS_BY_CAT = {
  'tu-tuong-hcm': [
    { id: 1, title: 'Tư tưởng Hồ Chí Minh về vấn đề dân tộc', difficulty: 'Trung bình', time: 45,
      question: 'Phân tích tư tưởng Hồ Chí Minh về vấn đề dân tộc và cách mạng giải phóng dân tộc. Liên hệ với thực tiễn Việt Nam hiện nay.',
      hint: 'Cần trình bày: (1) Độc lập dân tộc gắn CNXH, (2) Vai trò của Đảng, (3) Đại đoàn kết toàn dân',
      sampleAnswer: `**Mở bài:** Tư tưởng Hồ Chí Minh về vấn đề dân tộc là một trong những di sản lý luận vĩ đại nhất của lịch sử cách mạng Việt Nam...\n\n**Luận điểm 1 — Độc lập dân tộc gắn liền với chủ nghĩa xã hội:**\nHồ Chí Minh khẳng định: "Không có gì quý hơn độc lập, tự do". Người xác định con đường cứu nước duy nhất đúng đắn là kết hợp độc lập dân tộc với chủ nghĩa xã hội...\n\n**Luận điểm 2 — Cách mạng giải phóng dân tộc phải do Đảng Cộng sản lãnh đạo:**\nNgười chỉ rõ vai trò tiên phong của Đảng Cộng sản — đội ngũ tiên phong của giai cấp công nhân, nhân dân lao động và dân tộc Việt Nam...\n\n**Luận điểm 3 — Sức mạnh đại đoàn kết toàn dân tộc:**\n"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công."...\n\n**Kết bài:** Tư tưởng Hồ Chí Minh về vấn đề dân tộc mãi là ánh sáng soi đường cho sự nghiệp xây dựng và bảo vệ Tổ quốc.` },
    { id: 2, title: 'Tư tưởng HCM về đạo đức cách mạng', difficulty: 'Dễ', time: 35,
      question: 'Trình bày những nội dung cơ bản trong tư tưởng Hồ Chí Minh về đạo đức cách mạng. Ý nghĩa của việc tu dưỡng đạo đức theo tư tưởng Người đối với thanh niên hiện nay.',
      hint: 'Trình bày: Trung với nước, hiếu với dân; Cần kiệm liêm chính, chí công vô tư; Yêu thương con người; Tinh thần quốc tế trong sáng',
      sampleAnswer: `**Mở bài:** Đạo đức cách mạng là vấn đề cốt lõi trong tư tưởng Hồ Chí Minh...\n\n**Nội dung 1 — Trung với nước, hiếu với dân:**\nĐây là phẩm chất đạo đức quan trọng nhất, bao trùm nhất. "Trung" không phải trung với vua mà là trung với Tổ quốc, với nhân dân...\n\n**Nội dung 2 — Cần, kiệm, liêm, chính, chí công vô tư:**\nĐây là những đức tính gắn liền với hoạt động hàng ngày của mỗi người...\n\n**Kết bài:** Việc học tập và làm theo tư tưởng HCM về đạo đức có ý nghĩa thiết thực đối với thanh niên ngày nay.` },
    { id: 3, title: 'Tư tưởng HCM về Đảng Cộng sản', difficulty: 'Khó', time: 50,
      question: 'Phân tích tư tưởng Hồ Chí Minh về Đảng Cộng sản Việt Nam. Tại sao Người khẳng định Đảng phải thật sự trong sạch, vững mạnh?',
      hint: 'Trình bày: Bản chất giai cấp, nguyên tắc tổ chức, đạo đức của Đảng và cán bộ đảng viên',
      sampleAnswer: `**Mở bài:** Trong hệ thống tư tưởng Hồ Chí Minh, vấn đề về Đảng Cộng sản Việt Nam có vị trí đặc biệt quan trọng...\n\n**Luận điểm chính:** Đảng là đội ngũ tiên phong của giai cấp công nhân, đồng thời là đội ngũ tiên phong của nhân dân lao động và dân tộc Việt Nam...` },
  ],
  'lich-su-dang': [
    { id: 4, title: 'Ý nghĩa Cách mạng tháng Tám 1945', difficulty: 'Trung bình', time: 40,
      question: 'Trình bày ý nghĩa lịch sử của Cách mạng tháng Tám năm 1945. Tại sao đây được coi là mốc son chói lọi trong lịch sử dân tộc Việt Nam?',
      hint: 'Phân tích theo 3 ý nghĩa: dân tộc, giai cấp, quốc tế. Liên hệ với bài học lịch sử.',
      sampleAnswer: `**Mở bài:** Cách mạng tháng Tám năm 1945 là một trong những sự kiện vĩ đại nhất trong lịch sử Việt Nam...\n\n**Ý nghĩa dân tộc:** Chấm dứt ách thống trị hơn 80 năm của thực dân Pháp và phát xít Nhật...\n\n**Ý nghĩa giai cấp:** Lần đầu tiên trong lịch sử, chính quyền về tay nhân dân...\n\n**Ý nghĩa quốc tế:** Góp phần cổ vũ phong trào giải phóng dân tộc trên thế giới...` },
    { id: 5, title: 'Đại hội Đảng lần thứ VI và công cuộc Đổi mới', difficulty: 'Trung bình', time: 40,
      question: 'Phân tích ý nghĩa và nội dung cơ bản của Đại hội Đảng lần thứ VI (1986). Tại sao Đại hội VI được coi là bước ngoặt lịch sử của công cuộc đổi mới ở Việt Nam?',
      hint: 'Trình bày bối cảnh lịch sử, nội dung đổi mới kinh tế, chính trị và ý nghĩa với đất nước',
      sampleAnswer: `**Mở bài:** Đại hội Đảng lần thứ VI tháng 12/1986 đánh dấu bước ngoặt quan trọng trong lịch sử Đảng...` },
    { id: 6, title: 'Chiến thắng Điện Biên Phủ 1954', difficulty: 'Dễ', time: 35,
      question: 'Phân tích nguyên nhân thắng lợi và ý nghĩa lịch sử của chiến thắng Điện Biên Phủ năm 1954.',
      hint: 'Trình bày nguyên nhân khách quan, chủ quan và ý nghĩa đối với dân tộc, quốc tế',
      sampleAnswer: `**Mở bài:** Chiến thắng Điện Biên Phủ ngày 7/5/1954 là đỉnh cao của cuộc kháng chiến chống Pháp...` },
  ],
  'ktct': [
    { id: 7, title: 'Quy luật giá trị trong kinh tế hàng hóa', difficulty: 'Khó', time: 45,
      question: 'Phân tích quy luật giá trị trong nền kinh tế hàng hóa. Vận dụng quy luật này vào thực tiễn nền kinh tế thị trường định hướng XHCN ở Việt Nam.',
      hint: 'Trình bày: khái niệm, nội dung quy luật, biểu hiện và tác động trong kinh tế thị trường VN',
      sampleAnswer: `**Mở bài:** Quy luật giá trị là quy luật kinh tế cơ bản nhất của sản xuất và lưu thông hàng hóa...` },
    { id: 8, title: 'Giá trị thặng dư và bóc lột tư bản', difficulty: 'Khó', time: 50,
      question: 'Phân tích học thuyết giá trị thặng dư của Marx. Tại sao học thuyết này được coi là "hòn đá tảng" của kinh tế chính trị Marx?',
      hint: 'Trình bày: nguồn gốc, bản chất giá trị thặng dư, phương pháp sản xuất và ý nghĩa lý luận',
      sampleAnswer: `**Mở bài:** Học thuyết giá trị thặng dư là phát kiến khoa học vĩ đại nhất của Marx trong lĩnh vực kinh tế...` },
    { id: 9, title: 'Kinh tế thị trường định hướng XHCN', difficulty: 'Trung bình', time: 40,
      question: 'Phân tích những đặc trưng của nền kinh tế thị trường định hướng xã hội chủ nghĩa ở Việt Nam. So sánh với kinh tế thị trường tư bản chủ nghĩa.',
      hint: 'Trình bày đặc trưng, vai trò của nhà nước, điểm khác biệt về mục tiêu phát triển',
      sampleAnswer: `**Mở bài:** Kinh tế thị trường định hướng XHCN là mô hình kinh tế đặc thù của Việt Nam...` },
  ],
  'cnxhkh': [
    { id: 10, title: 'Sứ mệnh lịch sử của giai cấp công nhân', difficulty: 'Trung bình', time: 40,
      question: 'Phân tích sứ mệnh lịch sử của giai cấp công nhân theo quan điểm của Chủ nghĩa Marx-Lenin. Liên hệ với thực tiễn giai cấp công nhân Việt Nam hiện nay.',
      hint: 'Trình bày: cơ sở khách quan, đặc điểm giai cấp công nhân và sứ mệnh lịch sử trong thời đại mới',
      sampleAnswer: `**Mở bài:** Giai cấp công nhân là giai cấp tiên tiến nhất, cách mạng nhất trong xã hội tư bản...` },
    { id: 11, title: 'Xây dựng chủ nghĩa xã hội ở Việt Nam', difficulty: 'Khó', time: 50,
      question: 'Phân tích những đặc trưng của xã hội xã hội chủ nghĩa mà Việt Nam đang xây dựng. Những thành tựu và thách thức trong quá trình xây dựng CNXH ở nước ta.',
      hint: 'Trình bày 8 đặc trưng cơ bản theo Cương lĩnh 2011, thành tựu Đổi mới và thách thức hiện tại',
      sampleAnswer: `**Mở bài:** Theo Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên CNXH (bổ sung, phát triển 2011)...` },
  ],
  'phap-luat': [
    { id: 12, title: 'Bản chất và chức năng của nhà nước', difficulty: 'Dễ', time: 35,
      question: 'Phân tích bản chất và các chức năng của nhà nước. Nhà nước pháp quyền XHCN Việt Nam có những đặc trưng gì nổi bật?',
      hint: 'Trình bày: bản chất giai cấp, xã hội; chức năng đối nội, đối ngoại; đặc trưng NNPQ Việt Nam',
      sampleAnswer: `**Mở bài:** Nhà nước là thiết chế chính trị quan trọng nhất trong kiến trúc thượng tầng của xã hội...` },
    { id: 13, title: 'Hệ thống pháp luật Việt Nam', difficulty: 'Trung bình', time: 40,
      question: 'Trình bày cấu trúc hệ thống pháp luật Việt Nam. Phân tích mối quan hệ giữa Hiến pháp và các văn bản pháp luật khác trong hệ thống.',
      hint: 'Trình bày: Hiến pháp, luật, nghị định, thông tư và nguyên tắc thứ bậc hiệu lực',
      sampleAnswer: `**Mở bài:** Hệ thống pháp luật Việt Nam được xây dựng theo nguyên tắc thứ bậc, thống nhất...` },
  ],
  'triet-hoc': [
    { id: 14, title: 'Vật chất và ý thức theo chủ nghĩa duy vật', difficulty: 'Trung bình', time: 40,
      question: 'Phân tích quan điểm của chủ nghĩa duy vật biện chứng về mối quan hệ giữa vật chất và ý thức. Ý nghĩa phương pháp luận của vấn đề này.',
      hint: 'Trình bày: định nghĩa vật chất (Lênin), nguồn gốc ý thức, mối quan hệ biện chứng và ý nghĩa thực tiễn',
      sampleAnswer: `**Mở bài:** Mối quan hệ giữa vật chất và ý thức là vấn đề cơ bản của triết học...` },
    { id: 15, title: 'Phép biện chứng duy vật', difficulty: 'Khó', time: 50,
      question: 'Trình bày nội dung và ý nghĩa của ba quy luật cơ bản của phép biện chứng duy vật. Lấy ví dụ minh họa từ thực tiễn Việt Nam.',
      hint: 'Trình bày 3 quy luật: lượng-chất, mâu thuẫn, phủ định của phủ định; kết hợp lý thuyết và ví dụ',
      sampleAnswer: `**Mở bài:** Phép biện chứng duy vật là hạt nhân lý luận của triết học Mác-Lênin...` },
    { id: 16, title: 'Thực tiễn và nhận thức', difficulty: 'Trung bình', time: 40,
      question: 'Phân tích vai trò của thực tiễn đối với nhận thức theo quan điểm triết học Mác-Lênin. Tại sao nói thực tiễn là tiêu chuẩn của chân lý?',
      hint: 'Trình bày: khái niệm thực tiễn, 4 vai trò của thực tiễn với nhận thức, và ý nghĩa phương pháp luận',
      sampleAnswer: `**Mở bài:** Trong triết học Mác-Lênin, thực tiễn có vai trò nền tảng, quyết định đối với nhận thức...` },
  ],
};

const RUBRIC = [
  { id: 'intro',   label: 'Mở bài',           max: 1, icon: '📝', desc: 'Giới thiệu vấn đề rõ ràng, dẫn dắt logic' },
  { id: 'main',    label: 'Luận điểm chính',  max: 6, icon: '🎯', desc: 'Trình bày đủ luận điểm, lập luận chặt chẽ, có dẫn chứng' },
  { id: 'apply',   label: 'Liên hệ thực tế',  max: 2, icon: '💡', desc: 'Liên hệ bản thân, thực tiễn, góc nhìn sáng tạo' },
  { id: 'writing', label: 'Chính tả & Trình bày', max: 1, icon: '✍️', desc: 'Không mắc lỗi chính tả, bố cục đoạn văn rõ ràng' },
];

const DIFF_COLOR = { Dễ: 'badge-green', 'Trung bình': 'badge-orange', Khó: 'badge-navy' };

// ─────────────────────────────────────────────────────────────────────────────
// AI Score simulation
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
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

// Breadcrumb
function Breadcrumb({ steps }) {
  return (
    <div className="essay-breadcrumb">
      {steps.map((s, i) => (
        <span key={i} className="essay-bc-item">
          {i > 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>}
          {s.onClick
            ? <button className="essay-bc-link" onClick={s.onClick}>{s.label}</button>
            : <span className="essay-bc-current">{s.label}</span>}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEW 1 — Category list
// ─────────────────────────────────────────────────────────────────────────────
function CategoryView({ onSelect }) {
  return (
    <div className="essay-section page-enter">
      <Breadcrumb steps={[{ label: 'Kho câu hỏi tự luận' }]} />
      <div className="essay-section__head">
        <h2 className="essay-section__title">Chọn môn học</h2>
        <p className="essay-section__sub">Chọn môn học để xem danh sách câu hỏi tự luận</p>
      </div>
      <div className="essay-cat-grid">
        {CATEGORIES.map(cat => (
          <button key={cat.id} className="essay-cat-card" onClick={() => onSelect(cat)}>
            <div className="essay-cat-card__icon" style={{ background: `${cat.color}15`, color: cat.color }}>
              {cat.icon}
            </div>
            <div className="essay-cat-card__body">
              <h3 className="essay-cat-card__name">{cat.name}</h3>
              <p className="essay-cat-card__desc">{cat.desc}</p>
            </div>
            <div className="essay-cat-card__footer" style={{ borderTopColor: `${cat.color}20` }}>
              <span className="essay-cat-card__count" style={{ color: cat.color }}>{cat.count} câu hỏi</span>
              <span className="essay-cat-card__arrow" style={{ color: cat.color }}>
                Xem câu hỏi →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEW 2 — Question list for a category
// ─────────────────────────────────────────────────────────────────────────────
function QuestionListView({ category, onBack, onSelectQ }) {
  const questions = QUESTIONS_BY_CAT[category.id] || [];

  return (
    <div className="essay-section page-enter">
      <Breadcrumb steps={[
        { label: 'Kho câu hỏi tự luận', onClick: onBack },
        { label: category.name },
      ]} />

      <div className="essay-section__head" style={{ borderLeftColor: category.color }}>
        <div className="essay-section__head-icon" style={{ background: `${category.color}15`, color: category.color }}>
          {category.icon}
        </div>
        <div>
          <h2 className="essay-section__title">{category.name}</h2>
          <p className="essay-section__sub">{questions.length} câu hỏi tự luận</p>
        </div>
      </div>

      <div className="essay-q-list">
        {questions.map((q, idx) => (
          <div key={q.id} className="essay-q-card">
            <div className="essay-q-card__num" style={{ background: `${category.color}15`, color: category.color }}>
              {idx + 1}
            </div>
            <div className="essay-q-card__body">
              <div className="essay-q-card__meta">
                <span className={`badge ${DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
                <span className="essay-q-time">⏱ {q.time} phút</span>
              </div>
              <h4 className="essay-q-card__title">{q.title}</h4>
              <p className="essay-q-card__preview">{q.question.slice(0, 100)}...</p>
            </div>
            <button
              className="btn btn-primary essay-q-card__btn"
              onClick={() => onSelectQ(q)}
            >
              Làm bài
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEW 3 — Write + Grade
// ─────────────────────────────────────────────────────────────────────────────
function WriteView({ category, question, onBack, onBackToCat }) {
  const [answer, setAnswer]           = useState('');
  const [submitted, setSubmitted]     = useState(false);
  const [scores, setScores]           = useState(null);
  const [grading, setGrading]         = useState(false);
  const [animateBar, setAnimateBar]   = useState(false);
  const [showSample, setShowSample]   = useState(false);
  const [tab, setTab]                 = useState('write');

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const total     = scores ? parseFloat(Object.values(scores).reduce((a, b) => a + b, 0).toFixed(1)) : 0;
  const totalMax  = 10;
  const grade     = total >= 8.5 ? { label: 'Xuất sắc',   color: '#22c55e',       emoji: '🏆' }
                  : total >= 7   ? { label: 'Khá',         color: '#3b82f6',       emoji: '👍' }
                  : total >= 5   ? { label: 'Trung bình',  color: 'var(--orange)', emoji: '📖' }
                  :                { label: 'Cần cố gắng', color: '#ef4444',       emoji: '💪' };

  const handleSubmit = () => {
    if (answer.trim().length < 50) return;
    setGrading(true);
    setTab('result');
    setTimeout(() => {
      const s = simulateAIScore(answer);
      setScores(s);
      setSubmitted(true);
      setGrading(false);
      setTimeout(() => setAnimateBar(true), 100);
    }, 2200);
  };

  const handleReset = () => {
    setAnswer(''); setSubmitted(false); setScores(null);
    setShowSample(false); setGrading(false); setAnimateBar(false); setTab('write');
  };

  return (
    <div className="essay-section page-enter">
      <Breadcrumb steps={[
        { label: 'Kho câu hỏi tự luận', onClick: onBackToCat },
        { label: category.name, onClick: onBack },
        { label: question.title },
      ]} />

      {/* Question card */}
      <div className="essay-write-question">
        <div className="ewq-top">
          <div className="ewq-badges">
            <span className={`badge ${DIFF_COLOR[question.difficulty]}`}>{question.difficulty}</span>
            <span className="ewq-time">⏱ {question.time} phút</span>
          </div>
          <button className="ewq-other-btn btn btn-outline" onClick={onBack}>
            ← Câu khác
          </button>
        </div>
        <h3 className="ewq-title">{question.title}</h3>
        <p className="ewq-question">{question.question}</p>
        <div className="ewq-hint">
          <span>💡</span>
          <span><strong>Gợi ý:</strong> {question.hint}</span>
        </div>
        {/* Rubric chips */}
        <div className="rubric-info-bar" style={{ marginTop: 12 }}>
          <span className="rubric-info-label">📊 Thang điểm:</span>
          {RUBRIC.map(r => (
            <span key={r.id} className="rubric-chip">{r.icon} {r.label} ({r.max}đ)</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="essay-tabs">
        <button className={`essay-tab ${tab === 'write' ? 'active' : ''}`} onClick={() => setTab('write')}>
          ✏️ Bài làm
        </button>
        <button
          className={`essay-tab ${tab === 'result' ? 'active' : ''}`}
          onClick={() => setTab('result')}
          disabled={!submitted && !grading}
        >
          📊 Kết quả AI{submitted ? ` (${total}/10)` : ''}
        </button>
      </div>

      {/* Write panel */}
      {tab === 'write' && (
        <div className="essay-write-panel">
          <div className="essay-textarea-wrap">
            <textarea
              className="essay-textarea"
              placeholder={`Viết bài tự luận của bạn tại đây...\n\nGợi ý cấu trúc:\n• Mở bài: Giới thiệu vấn đề\n• Thân bài: Triển khai từng luận điểm\n• Liên hệ thực tiễn\n• Kết bài: Tổng kết`}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={submitted}
              rows={16}
            />
            <div className="essay-counter">
              <span className={wordCount < 100 ? 'counter-warn' : 'counter-ok'}>{wordCount} từ</span>
              <span className="counter-hint">(khuyến nghị ≥ 150 từ)</span>
            </div>
          </div>
          {!submitted ? (
            <button className="btn btn-primary essay-submit-btn" onClick={handleSubmit} disabled={answer.trim().length < 50}>
              🤖 Nộp bài & Nhờ AI chấm điểm
            </button>
          ) : (
            <div className="essay-submitted-note">✅ Bài đã nộp — xem kết quả ở tab <strong>Kết quả AI</strong></div>
          )}
        </div>
      )}

      {/* Result panel */}
      {tab === 'result' && (
        <div className="essay-result-panel">
          {grading ? (
            <div className="essay-grading">
              <div className="grading-spinner" />
              <div className="grading-steps">
                <p className="grading-title">🤖 AI đang chấm bài...</p>
                {['Phân tích cấu trúc bài viết','Đánh giá luận điểm theo rubric','So sánh với bài làm mẫu','Tổng hợp điểm số & nhận xét'].map((s, i) => (
                  <div key={i} className="grading-step">
                    <div className="grading-step__dot" style={{ animationDelay: `${i * 0.5}s` }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : scores && (
            <div className="essay-scores">
              <div className="score-summary">
                <div className="score-ring-wrap">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="56" fill="none" stroke="var(--gray-200)" strokeWidth="10"/>
                    <circle cx="70" cy="70" r="56" fill="none" stroke={grade.color} strokeWidth="10"
                      strokeDasharray={`${(total/totalMax)*2*Math.PI*56} ${2*Math.PI*56}`}
                      strokeLinecap="round" transform="rotate(-90 70 70)"
                      style={{ transition:'stroke-dasharray 1s ease' }}
                    />
                    <text x="70" y="64" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="800" fill={grade.color}>{total}</text>
                    <text x="70" y="86" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="var(--text-muted)">{grade.label}</text>
                  </svg>
                  <span className="score-emoji">{grade.emoji}</span>
                </div>
                <div className="score-summary__info">
                  <h3>Tổng điểm: <span style={{ color: grade.color }}>{total}/10</span></h3>
                  <p className="score-feedback">
                    {total >= 8.5 ? 'Bài làm xuất sắc! Lập luận chặt chẽ, đầy đủ luận điểm và liên hệ thực tiễn tốt.'
                     : total >= 7 ? 'Bài khá tốt! Cần bổ sung thêm ví dụ thực tế và trình bày ý rõ ràng hơn.'
                     : total >= 5 ? 'Đạt yêu cầu nhưng còn thiếu chiều sâu lập luận. Cần học hỏi thêm qua bài mẫu.'
                     : 'Bài còn nhiều điểm cần cải thiện. Hãy xem bài làm mẫu để tham khảo cách trình bày.'}
                  </p>
                  <button className="btn btn-outline" onClick={handleReset} style={{ marginTop: 12 }}>🔄 Làm lại</button>
                </div>
              </div>

              <div className="rubric-breakdown">
                <h4 className="rubric-breakdown__title">Chi tiết theo tiêu chí</h4>
                {RUBRIC.map(r => <RubricBar key={r.id} item={r} score={scores[r.id]} max={r.max} animate={animateBar} />)}
              </div>

              <div className="ai-comments">
                <h4 className="ai-comments__title">💬 Nhận xét chi tiết từ AI</h4>
                <div className="ai-comment-list">
                  {[
                    { icon:'✅', color:'#22c55e', title:'Điểm mạnh',      text: scores.main >= 4 ? 'Luận điểm chính trình bày tương đối đầy đủ, có sự mạch lạc trong lập luận.' : 'Bạn đã cố gắng trình bày vấn đề. Cần rèn luyện thêm cách xây dựng luận điểm.' },
                    { icon:'⚠️', color:'var(--orange)', title:'Cần cải thiện', text: scores.apply < 1.5 ? 'Phần liên hệ thực tiễn còn mỏng, nên bổ sung ví dụ cụ thể từ thực tế Việt Nam.' : 'Bài viết cần chú ý hơn đến tính hệ thống và cấu trúc đoạn văn.' },
                    { icon:'💡', color:'var(--navy)', title:'Gợi ý học tập', text: 'Tham khảo bài làm mẫu điểm 10 bên dưới để học cách diễn đạt và sắp xếp ý tưởng.' },
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

              <div className="sample-answer-section">
                {!showSample ? (
                  <div className="sample-locked">
                    <div className="sample-locked__icon">🔒</div>
                    <div className="sample-locked__text">
                      <h4>Bài làm mẫu điểm 10</h4>
                      <p>Bạn đã nộp bài — mở khóa để xem bài làm mẫu và học hỏi cách trình bày chuẩn.</p>
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE — orchestrates 3 views
// ─────────────────────────────────────────────────────────────────────────────
export default function EssayPage() {
  const [view, setView]         = useState('categories'); // 'categories' | 'questions' | 'write'
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const selectCategory = cat => { setActiveCategory(cat); setView('questions'); };
  const selectQuestion  = q   => { setActiveQuestion(q);  setView('write'); };
  const backToCategories = ()  => { setActiveCategory(null); setActiveQuestion(null); setView('categories'); };
  const backToQuestions  = ()  => { setActiveQuestion(null); setView('questions'); };

  return (
    <div className="essay-page page-enter">
      <PageHeader
        title="Kho câu hỏi tự luận"
        subtitle="Luyện viết tự luận — AI chấm theo rubric chuẩn đại học, giải thích chi tiết từng tiêu chí"
        icon="🤖"
        accentColor={activeCategory?.color}
      />

      <div className="container essay-body">
        {view === 'categories' && (
          <CategoryView onSelect={selectCategory} />
        )}
        {view === 'questions' && activeCategory && (
          <QuestionListView
            category={activeCategory}
            onBack={backToCategories}
            onSelectQ={selectQuestion}
          />
        )}
        {view === 'write' && activeCategory && activeQuestion && (
          <WriteView
            category={activeCategory}
            question={activeQuestion}
            onBack={backToQuestions}
            onBackToCat={backToCategories}
          />
        )}
      </div>
    </div>
  );
}
