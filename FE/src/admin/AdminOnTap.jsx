import { useState, useEffect } from 'react';
import { categoryApi, subjectApi, adminApi, documentApi, toArray } from '../services/api';
import ImportQuestionsModal from './ImportQuestionsModal';
import './AdminLayout.css';
import './AdminOnTap.css';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const BLANK_EXAM = { title: '', subject_id: '', category_id: '', chapter: '', questions_count: 10, status: 'published' };
const BLANK_Q    = () => ({ content: '', options: [{ id:'A', text:'' },{ id:'B', text:'' },{ id:'C', text:'' },{ id:'D', text:'' }], correct_answer: '', explanation: '' });

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Thông tin đề (tạo mới hoặc sửa metadata)
// ─────────────────────────────────────────────────────────────────────────────
function StepExamInfo({ categories, examData, setExamData, onNext, onCancel, isEdit, editDocId }) {
  const [customCat,  setCustomCat]  = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [subjects,   setSubjects]   = useState([]);
  const [customSub,  setCustomSub]  = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState({});

  const set  = f => v => setExamData(d => ({ ...d, [f]: v }));
  const setE = f => e => set(f)(e.target.value);

  // Load subjects khi category thay đổi
  useEffect(() => {
    if (!examData.category_id) { setSubjects([]); return; }
    subjectApi.list({ category: examData.category_id })
      .then(res => setSubjects(toArray(res.data)))
      .catch(() => setSubjects([]));
  }, [examData.category_id]);

  const validate = () => {
    const e = {};
    if (!examData.category_id && !newCatName.trim()) e.category = 'Vui lòng chọn hoặc nhập danh mục';
    if (!examData.questions_count || examData.questions_count < 1) e.count = 'Số câu hỏi phải ít nhất 1';
    return e;
  };

  const handleNext = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      let categoryId = examData.category_id;
      let subjectId  = examData.subject_id || null;

      if (customCat && newCatName.trim()) {
        const slug = newCatName.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        const res = await adminApi.createCategory({ name: newCatName.trim(), slug, icon:'', color:'#1B3A6B', description:'', status:'active' });
        categoryId = res.data.id;
      }
      if (customSub && newSubName.trim()) {
        const slug = newSubName.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        const res = await adminApi.createSubject({ category_id: categoryId, name: newSubName.trim(), slug, icon:'📖', status:'active' });
        subjectId = res.data.id;
      }

      // Lấy tên môn học cho title
      const subjectName = customSub ? newSubName : (subjects.find(s => String(s.id) === String(subjectId))?.name || '');

      const payload = {
        subject_id:      subjectId,
        title:           examData.title.trim() || subjectName || 'Tài liệu',
        chapter:         examData.chapter || null,
        questions_count: Number(examData.questions_count),
        status:          'draft',
      };

      let doc;
      if (isEdit && editDocId) {
        const res = await adminApi.updateDocument(editDocId, payload);
        doc = res.data;
      } else {
        const res = await adminApi.createDocument(payload);
        doc = res.data;
      }
      onNext(doc);
    } catch (err) {
      alert('Lỗi: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wizard-step page-enter">
      <div className="wizard-step__head">
        <div className="wizard-badge">{isEdit ? 'Sửa thông tin' : 'Bước 1 / 2'}</div>
        <h2 className="wizard-title">{isEdit ? 'Sửa thông tin tài liệu' : 'Thông tin tài liệu trắc nghiệm'}</h2>
        <p className="wizard-sub">Nhập thông tin cơ bản trước khi nhập câu hỏi</p>
      </div>

      <div className="wizard-body">
        {/* Danh mục */}
        <div className="admin-form-group">
          <label className="admin-form-label">Danh mục *</label>
          {!customCat ? (
            <select className={`admin-form-select ${errors.category ? 'input-error' : ''}`} value={examData.category_id}
              onChange={e => {
                if (e.target.value === '__other__') { setCustomCat(true); set('category_id')(''); set('subject_id')(''); }
                else { setE('category_id')(e); set('subject_id')(''); setCustomSub(false); }
              }}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              <option value="__other__">➕ Khác (nhập mới)</option>
            </select>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <input className={`admin-form-input ${errors.category ? 'input-error' : ''}`} placeholder="Nhập tên danh mục mới..." value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ flex:1 }} />
              <button className="btn btn-outline" style={{ fontSize:12, padding:'9px 12px', flexShrink:0 }} onClick={() => { setCustomCat(false); setNewCatName(''); }}>← Có sẵn</button>
            </div>
          )}
          {errors.category && <p className="field-error">{errors.category}</p>}
        </div>

        {/* Môn học */}
        <div className="admin-form-group">
          <label className="admin-form-label">Môn học</label>
          {!customSub ? (
            <select className="admin-form-select" value={examData.subject_id}
              onChange={e => {
                if (e.target.value === '__other__') { setCustomSub(true); set('subject_id')(''); set('subject')(''); }
                else { set('subject_id')(e.target.value); const f = subjects.find(s => String(s.id) === e.target.value); if (f) set('subject')(f.name); }
              }}
              disabled={!examData.category_id && !customCat}>
              <option value="">{examData.category_id ? '-- Chọn môn học --' : '-- Chọn danh mục trước --'}</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              <option value="__other__">➕ Khác (nhập môn mới)</option>
            </select>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <input className="admin-form-input" placeholder="Nhập tên môn học mới..." value={newSubName} onChange={e => { setNewSubName(e.target.value); set('subject')(e.target.value); }} style={{ flex:1 }} />
              <button className="btn btn-outline" style={{ fontSize:12, padding:'9px 12px', flexShrink:0 }} onClick={() => { setCustomSub(false); setNewSubName(''); set('subject')(''); set('subject_id')(''); }}>← Có sẵn</button>
            </div>
          )}
        </div>

        {/* Tên đề */}
        <div className="admin-form-group">
          <label className="admin-form-label">Tên đề</label>
          <input
            className="admin-form-input"
            placeholder="VD: Đề thi cuối kỳ HK2 2024"
            value={examData.title || ''}
            onChange={setE('title')}
          />
        </div>

        {/* Chương + Số câu */}
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Tên chương <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(không bắt buộc)</span></label>
            <input className="admin-form-input" placeholder="VD: Chương 3 - Phép biện chứng" value={examData.chapter || ''} onChange={setE('chapter')} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Số câu hỏi *</label>
            <input type="number" min={1} max={200} className={`admin-form-input ${errors.count ? 'input-error' : ''}`} value={examData.questions_count} onChange={e => set('questions_count')(Number(e.target.value))} />
            {errors.count && <p className="field-error">{errors.count}</p>}
          </div>
        </div>
      </div>

      <div className="wizard-footer">
        <button className="btn btn-outline" onClick={onCancel}>Hủy</button>
        <button className="btn btn-primary" onClick={handleNext} disabled={saving}>
          {saving ? 'Đang lưu...' : isEdit ? 'Lưu & Sửa câu hỏi →' : 'Tiếp theo — Nhập câu hỏi →'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Nhập / sửa câu hỏi
// ─────────────────────────────────────────────────────────────────────────────
function StepQuestions({ exam, onDone, onBack, isEdit }) {
  const total = exam.questions_count || 10;

  const [inputMode,  setInputMode]  = useState(isEdit ? 'manual' : null); // null, 'manual', 'import'
  const [questions,  setQuestions] = useState(() => Array.from({ length: total }, () => BLANK_Q()));
  const [loadingQ,   setLoadingQ]  = useState(isEdit);
  const [current,    setCurrent]   = useState(0);
  const [saving,     setSaving]    = useState(false);
  const [saved,      setSaved]     = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Khi sửa: load câu hỏi hiện có từ API
  useEffect(() => {
    if (!isEdit) return;
    setLoadingQ(true);
    adminApi.getDocumentQuestions(exam.id)
      .then(res => {
        const existing = toArray(res.data);
        if (existing.length > 0) {
          // Map API data → editor format, pad đến đủ total câu
          const mapped = existing.map(q => ({
            content:        q.content || '',
            options:        Array.isArray(q.options) ? q.options : [{ id:'A', text:'' },{ id:'B', text:'' },{ id:'C', text:'' },{ id:'D', text:'' }],
            correct_answer: q.correct_answer || '',
            explanation:    q.explanation || '',
          }));
          // Pad nếu total > số câu hiện có
          while (mapped.length < total) mapped.push(BLANK_Q());
          setQuestions(mapped.slice(0, total));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingQ(false));
  }, [exam.id, isEdit, total]);

  const q    = questions[current];
  const setQ = updater => setQuestions(qs => qs.map((item, i) => i === current ? updater(item) : item));
  const setField   = f => v   => setQ(q => ({ ...q, [f]: v }));
  const setFieldE  = f => e   => setField(f)(e.target.value);
  const setOptText = idx => e => setQ(q => {
    const opts = [...q.options];
    opts[idx] = { ...opts[idx], text: e.target.value };
    return { ...q, options: opts };
  });

  const isComplete = q => q.content.trim() && q.correct_answer && q.options.every(o => o.text.trim());
  const completedCount = questions.filter(isComplete).length;
  const pct = Math.round((completedCount / total) * 100);

  const handleSaveAll = async () => {
    const incomplete = questions.findIndex(q => !isComplete(q));
    if (incomplete !== -1) {
      if (!window.confirm(`Câu ${incomplete + 1} chưa điền đầy đủ. Bạn có muốn lưu các câu đã điền không?`)) return;
    }
    const toSave = questions.filter(isComplete);
    if (toSave.length === 0) { alert('Chưa có câu hỏi nào đầy đủ để lưu.'); return; }

    setSaving(true);
    try {
      await adminApi.bulkStoreDocumentQuestions(exam.id, toSave);
      setSaved(true);
    } catch (err) {
      alert('Lỗi khi lưu: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loadingQ) {
    return (
      <div className="wizard-step page-enter" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60 }}>
        <div style={{ textAlign:'center' }}><div style={{ fontSize:40, marginBottom:12 }}></div><p style={{ color:'var(--text-muted)' }}>Đang tải câu hỏi...</p></div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="wizard-step page-enter">
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 32px', gap:20, textAlign:'center' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(34,197,94,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>✅</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#16a34a', margin:0 }}>{isEdit ? 'Cập nhật thành công!' : 'Tạo tài liệu thành công!'}</h2>
          <p style={{ fontSize:14, color:'var(--text-muted)', margin:0, maxWidth:360, lineHeight:1.6 }}>
            Đã lưu <strong>{completedCount}</strong> câu hỏi cho <strong>"{exam.title}"</strong>
          </p>
          <div style={{ marginTop:12 }}><button className="btn btn-primary" onClick={onDone}>✓ Về danh sách</button></div>
        </div>
      </div>
    );
  }

  // Mode selection (if not in edit mode)
  if (!isEdit && !inputMode) {
    return (
      <div className="wizard-step page-enter">
        <div className="wizard-step__head">
          <div className="wizard-badge">Bước 2 / 2</div>
          <h2 className="wizard-title">Chọn cách nhập câu hỏi</h2>
          <p className="wizard-sub">{exam.subject || exam.title}{exam.chapter ? ` · ${exam.chapter}` : ''} · {total} câu</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
          {/* Manual Input */}
          <div
            style={{
              padding: 24,
              border: '2px solid var(--gray-200)',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              background: 'white',
            }}
            onClick={() => setInputMode('manual')}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--navy)';
              e.currentTarget.style.background = 'var(--blue-50)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'var(--gray-200)';
              e.currentTarget.style.background = 'white';
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>✏️</div>
            <h3 style={{ margin: 0, marginBottom: 8, fontSize: 16, fontWeight: 600 }}>Nhập từng câu</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
              Nhập câu hỏi và đáp án từng câu một cách chi tiết
            </p>
          </div>

          {/* Paste & Import */}
          <div
            style={{
              padding: 24,
              border: '2px solid var(--gray-200)',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              background: 'white',
            }}
            onClick={() => setShowImport(true)}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--navy)';
              e.currentTarget.style.background = 'var(--blue-50)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'var(--gray-200)';
              e.currentTarget.style.background = 'white';
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <h3 style={{ margin: 0, marginBottom: 8, fontSize: 16, fontWeight: 600 }}>Paste trực tiếp</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
              Dán tất cả câu hỏi, tự động phân tích & nhập
            </p>
          </div>
        </div>

        <div className="wizard-footer">
          <button className="btn btn-outline" onClick={onBack}>← Quay lại</button>
        </div>

        {/* Import Modal */}
        {showImport && (
          <ImportQuestionsModal
            exam={exam}
            onClose={() => setShowImport(false)}
            onSuccess={() => {
              setSaved(true);
              // Refresh the questions from API
              setLoadingQ(true);
              adminApi.getDocumentQuestions(exam.id)
                .then(res => {
                  const existing = toArray(res.data);
                  if (existing.length > 0) {
                    const mapped = existing.map(q => ({
                      content:        q.content || '',
                      options:        Array.isArray(q.options) ? q.options : [{ id:'A', text:'' },{ id:'B', text:'' },{ id:'C', text:'' },{ id:'D', text:'' }],
                      correct_answer: q.correct_answer || '',
                      explanation:    q.explanation || '',
                    }));
                    while (mapped.length < total) mapped.push(BLANK_Q());
                    setQuestions(mapped.slice(0, total));
                  }
                })
                .catch(() => {})
                .finally(() => setLoadingQ(false));
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="wizard-step page-enter">
      <div className="wizard-step__head">
        <div className="wizard-badge">{isEdit ? 'Sửa câu hỏi' : 'Bước 2 / 2'}</div>
        <h2 className="wizard-title">{isEdit ? 'Sửa câu hỏi' : 'Nhập câu hỏi'}</h2>
        <p className="wizard-sub">
          {exam.subject || exam.title}{exam.chapter ? ` · ${exam.chapter}` : ''} · {total} câu ·{' '}
          <span style={{ color: pct === 100 ? '#22c55e' : 'var(--orange)', fontWeight:700 }}>
            {completedCount}/{total} ({pct}%)
          </span>
        </p>
        <div style={{ height:4, background:'var(--gray-200)', borderRadius:2, marginTop:8, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--navy),var(--orange))', borderRadius:2, transition:'width 0.3s' }} />
        </div>
      </div>

      <div className="q-navigator">
        {questions.map((q, i) => (
          <button key={i} className={`q-nav-btn ${i===current?'q-nav-btn--active':''} ${isComplete(q)?'q-nav-btn--done':''}`} onClick={() => setCurrent(i)}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="q-form">
        <div className="q-form__num">Câu {current + 1}</div>

        <div className="admin-form-group">
          <label className="admin-form-label">Nội dung câu hỏi *</label>
          <textarea className="admin-form-textarea" rows={3} placeholder="Nhập nội dung câu hỏi..." value={q.content} onChange={setFieldE('content')} />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Đáp án (click để chọn đáp án đúng) *</label>
          <div className="options-editor">
            {q.options.map((opt, idx) => {
              const isCorrect = q.correct_answer === opt.id;
              return (
                <div key={opt.id} className={`option-editor-row ${isCorrect ? 'option-editor-row--correct' : ''}`} onClick={() => setField('correct_answer')(opt.id)}>
                  <div className={`opt-radio ${isCorrect ? 'opt-radio--checked' : ''}`}>{isCorrect && <div className="opt-radio__dot" />}</div>
                  <div className={`opt-letter ${isCorrect ? 'opt-letter--correct' : ''}`}>{opt.id}</div>
                  <input className="opt-input" placeholder={`Đáp án ${opt.id}...`} value={opt.text} onChange={setOptText(idx)} onClick={e => e.stopPropagation()} />
                  {isCorrect && <span className="opt-correct-mark">✓ Đúng</span>}
                </div>
              );
            })}
          </div>
          {!q.correct_answer && <p className="field-error">Vui lòng chọn đáp án đúng</p>}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Giải thích (tuỳ chọn)</label>
          <textarea className="admin-form-textarea" rows={2} placeholder="Giải thích tại sao đáp án đó đúng..." value={q.explanation} onChange={setFieldE('explanation')} />
        </div>
      </div>

      <div className="wizard-footer">
        <button className="btn btn-outline" onClick={onBack}>← {isEdit ? 'Sửa thông tin' : 'Quay lại'}</button>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-outline" onClick={() => setCurrent(c => Math.max(0, c-1))} disabled={current===0}>← Câu trước</button>
          <button className="btn btn-outline" onClick={() => setCurrent(c => Math.min(total-1, c+1))} disabled={current===total-1}>Câu tiếp →</button>
          <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
            {saving ? 'Đang lưu...' : `Lưu (${completedCount}/${total})`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminOnTap
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminOnTap() {
  const [categories,  setCategories]  = useState([]);
  const [exams,       setExams]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');

  // Wizard: null | 'step1' | 'step2'
  const [wizard,      setWizard]      = useState(null);
  const [examData,    setExamData]    = useState({ ...BLANK_EXAM });
  const [createdExam, setCreatedExam] = useState(null);
  const [isEdit,      setIsEdit]      = useState(false);
  const [editDocId,   setEditDocId]   = useState(null);

  const reload = () => {
    setLoading(true);
    Promise.all([
      categoryApi.list().then(r => toArray(r.data)),
      documentApi.list({ per_page: 100 }).then(r => toArray(r.data)),
    ])
      .then(([cats, docs]) => { setCategories(cats); setExams(docs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const filteredExams = exams.filter(e =>
    !search ||
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.subject?.toLowerCase().includes(search.toLowerCase())
  );

  // Mở wizard tạo mới
  const openCreate = () => {
    setIsEdit(false);
    setEditDocId(null);
    setExamData({ ...BLANK_EXAM });
    setCreatedExam(null);
    setWizard('step1');
  };

  // Mở wizard sửa
  const openEdit = doc => {
    setIsEdit(true);
    setEditDocId(doc.id);
    setExamData({
      title:           doc.title || '',
      subject_id:      doc.subject_id || doc.subjectModel?.id || '',
      category_id:     doc.subjectModel?.category_id || doc.subjectModel?.category?.id || '',
      chapter:         doc.chapter || '',
      questions_count: doc.questions_count || 10,
      status:          doc.status || 'published',
    });
    setCreatedExam(doc);
    setWizard('step1');
  };

  const handleStep1Next = doc => { setCreatedExam(doc); setWizard('step2'); };
  const handleDone      = () => { setWizard(null); reload(); };

  const diffBadge = d => ({
    'Dễ':        <span className="admin-badge admin-badge--green">{d}</span>,
    'Trung bình':<span className="admin-badge admin-badge--orange">{d}</span>,
    'Khó':       <span className="admin-badge admin-badge--red">{d}</span>,
  })[d] || <span className="admin-badge admin-badge--gray">{d || '—'}</span>;

  // ── Wizard views ──────────────────────────────────────────────────────────
  if (wizard === 'step1') {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">{isEdit ? 'Sửa tài liệu' : 'Thêm tài liệu trắc nghiệm'}</h1>
        </div>
        <StepExamInfo
          categories={categories}
          examData={examData}
          setExamData={setExamData}
          onNext={handleStep1Next}
          onCancel={() => setWizard(null)}
          isEdit={isEdit}
          editDocId={editDocId}
        />
      </div>
    );
  }

  if (wizard === 'step2' && createdExam) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">{isEdit ? 'Sửa câu hỏi' : 'Nhập câu hỏi'}</h1>
        </div>
        <StepQuestions
          exam={createdExam}
          onDone={handleDone}
          onBack={() => setWizard('step1')}
          isEdit={isEdit}
        />
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tài liệu trắc nghiệm</h1>
          <p className="admin-page-sub">{exams.length} đề thi · {categories.length} danh mục</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm</button>
      </div>

      <div className="admin-card" style={{ marginBottom:16 }}>
        <div className="admin-filter-bar">
          <div className="admin-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm đề thi..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize:13, color:'var(--text-muted)', marginLeft:'auto' }}>{filteredExams.length} kết quả</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên đề</th>
                <th>Môn học</th>
                <th>Danh mục</th>
                <th>Câu</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div className="admin-empty"><span></span><p>Đang tải...</p></div></td></tr>
              ) : filteredExams.length === 0 ? (
                <tr><td colSpan={6}><div className="admin-empty"><span></span><p>Chưa có đề thi nào</p></div></td></tr>
              ) : filteredExams.map(e => (
                <tr key={e.id}>
                  <td style={{ maxWidth:260 }}>
                    <div style={{ fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {e.title}
                    </div>
                    {e.chapter && (
                      <div style={{ fontSize:11, color:'var(--navy)', fontWeight:600, marginTop:2 }}>
                        📑 {e.chapter}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{e.subject_model?.name || e.subjectModel?.name || '—'}</td>
                  <td>
                    <span className="admin-badge admin-badge--blue">
                      {e.subject_model?.category?.name || e.subjectModel?.category?.name || '—'}
                    </span>
                  </td>
                  <td style={{ textAlign:'center', fontWeight:600 }}>{e.questions_count ?? '—'}</td>
                  <td>
                    <span className={`admin-badge ${e.status==='published'?'admin-badge--green':'admin-badge--gray'}`}>
                      {e.status === 'published' ? 'Đã đăng' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={() => openEdit(e)}>Sửa</button>
                      <button
                        className="admin-action-btn"
                        onClick={async () => {
                          try {
                            const s = e.status === 'published' ? 'draft' : 'published';
                            await adminApi.updateDocument(e.id, { status: s });
                            setExams(p => p.map(x => x.id === e.id ? { ...x, status: s } : x));
                          } catch {}
                        }}
                      >
                        {e.status === 'published' ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
