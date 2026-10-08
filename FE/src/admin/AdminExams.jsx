import { useState, useEffect } from 'react';
import { categoryApi, subjectApi, adminApi, toArray } from '../services/api';
import { parseQuestions } from '../services/questionParser';
import './AdminLayout.css';
import './AdminOnTap.css'; // reuse same CSS

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const BLANK = { title: '', subject_id: '', questions_count: 10, essay_questions_count: 0, scenario_questions_count: 0, duration: 60, status: 'published' };
const BLANK_MC = () => ({ content: '', options: [{ id:'A', text:'' },{ id:'B', text:'' },{ id:'C', text:'' },{ id:'D', text:'' }], correct_answer: '', explanation: '' });
const BLANK_ESSAY = () => ({ content: '', sub_questions: [], explanation: '' });
const BLANK_SCENARIO = () => ({ content: '', sub_questions: [], explanation: '' });

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Thông tin đề thi
// ─────────────────────────────────────────────────────────────────────────────
function StepInfo({ categories, data, setData, onNext, onCancel, isEdit, editId }) {
  const [customCat,  setCustomCat]  = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [subjects,   setSubjects]   = useState([]);
  const [customSub,  setCustomSub]  = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState({});

  const set  = f => v => setData(d => ({ ...d, [f]: v }));
  const setE = f => e => set(f)(e.target.value);

  useEffect(() => {
    if (!data.category_id) { setSubjects([]); return; }
    subjectApi.list({ category: data.category_id })
      .then(res => setSubjects(toArray(res.data)))
      .catch(() => setSubjects([]));
  }, [data.category_id]);

  const validate = () => {
    const e = {};
    if (!data.category_id && !newCatName.trim()) e.category = 'Vui lòng chọn hoặc nhập danh mục';
    return e;
  };

  const handleNext = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      let categoryId = data.category_id;
      let subjectId  = data.subject_id || null;

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

      const subjectName = customSub ? newSubName : (subjects.find(s => String(s.id) === String(subjectId))?.name || '');

      const payload = {
        subject_id:            subjectId,
        title:                 data.title.trim() || subjectName || 'Đề thi',
        questions_count:       Number(data.questions_count || 0),
        essay_questions_count: Number(data.essay_questions_count || 0),
        scenario_questions_count: Number(data.scenario_questions_count || 0),
        duration:              Number(data.duration) || 60,
        status:                'draft',
      };

      let exam;
      if (isEdit && editId) {
        const res = await adminApi.updateExam(editId, payload);
        exam = { ...res.data, ...payload };
      } else {
        const res = await adminApi.createExam(payload);
        exam = { ...res.data, ...payload };
      }
      onNext(exam);
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
        <h2 className="wizard-title">{isEdit ? 'Sửa thông tin đề thi' : 'Thông tin đề thi thử'}</h2>
        <p className="wizard-sub">Nhập thông tin cơ bản trước khi nhập câu hỏi</p>
      </div>

      <div className="wizard-body">
        {/* Danh mục */}
        <div className="admin-form-group">
          <label className="admin-form-label">Danh mục *</label>
          {!customCat ? (
            <select className={`admin-form-select ${errors.category ? 'input-error' : ''}`} value={data.category_id}
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
            <select className="admin-form-select" value={data.subject_id}
              onChange={e => {
                if (e.target.value === '__other__') { setCustomSub(true); set('subject_id')(''); }
                else { set('subject_id')(e.target.value); }
              }}
              disabled={!data.category_id && !customCat}>
              <option value="">{data.category_id ? '-- Chọn môn học --' : '-- Chọn danh mục trước --'}</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              <option value="__other__">➕ Khác (nhập môn mới)</option>
            </select>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <input className="admin-form-input" placeholder="Nhập tên môn học mới..." value={newSubName} onChange={e => setNewSubName(e.target.value)} style={{ flex:1 }} />
              <button className="btn btn-outline" style={{ fontSize:12, padding:'9px 12px', flexShrink:0 }} onClick={() => { setCustomSub(false); setNewSubName(''); set('subject_id')(''); }}>← Có sẵn</button>
            </div>
          )}
        </div>

        {/* Tên đề */}
        <div className="admin-form-group">
          <label className="admin-form-label">Tên đề</label>
          <input className="admin-form-input" placeholder="VD: Đề thi cuối kỳ HK2 2024" value={data.title || ''} onChange={setE('title')} />
        </div>

        {/* Loại câu hỏi */}
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)', marginTop: 20 }}>Loại câu hỏi</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {/* Trắc nghiệm */}
          <div style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox" 
                checked={(data.questions_count || 0) > 0} 
                onChange={e => setData(d => ({ ...d, questions_count: e.target.checked ? 10 : 0 }))}
                style={{ cursor: 'pointer', width: 16, height: 16, minWidth: 16, minHeight: 16, margin: 0, padding: 0 }}
              />
              <label style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14, flex: 1 }}>📝 Trắc nghiệm</label>
            </div>
            {(data.questions_count || 0) > 0 && (
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Số câu</label>
                <input 
                  type="number" 
                  min={1} 
                  max={200} 
                  className="admin-form-input"
                  value={data.questions_count || ''} 
                  placeholder="Nhập số câu..."
                  onChange={e => set('questions_count')(e.target.value ? Number(e.target.value) : 0)}
                  style={{ marginTop: 4 }}
                />
              </div>
            )}
          </div>

          {/* Tự luận */}
          <div style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox" 
                checked={(data.essay_questions_count || 0) > 0} 
                onChange={e => setData(d => ({ ...d, essay_questions_count: e.target.checked ? 1 : 0 }))}
                style={{ cursor: 'pointer', width: 16, height: 16, minWidth: 16, minHeight: 16, margin: 0, padding: 0 }}
              />
              <label style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14, flex: 1 }}>✍️ Tự luận</label>
            </div>
            {(data.essay_questions_count || 0) > 0 && (
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Số câu</label>
                <input 
                  type="number" 
                  min={1} 
                  max={200} 
                  className="admin-form-input"
                  value={data.essay_questions_count || ''} 
                  placeholder="Nhập số câu..."
                  onChange={e => set('essay_questions_count')(e.target.value ? Number(e.target.value) : 0)}
                  style={{ marginTop: 4 }}
                />
              </div>
            )}
          </div>

          {/* Tình huống */}
          <div style={{ padding: 16, border: '1px solid var(--gray-200)', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input 
                type="checkbox" 
                checked={(data.scenario_questions_count || 0) > 0} 
                onChange={e => setData(d => ({ ...d, scenario_questions_count: e.target.checked ? 1 : 0 }))}
                style={{ cursor: 'pointer', width: 16, height: 16, minWidth: 16, minHeight: 16, margin: 0, padding: 0 }}
              />
              <label style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14, flex: 1 }}>🎭 Tình huống</label>
            </div>
            {(data.scenario_questions_count || 0) > 0 && (
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Số câu</label>
                <input 
                  type="number" 
                  min={1} 
                  max={200} 
                  className="admin-form-input"
                  value={data.scenario_questions_count || ''} 
                  placeholder="Nhập số câu..."
                  onChange={e => set('scenario_questions_count')(e.target.value ? Number(e.target.value) : 0)}
                  style={{ marginTop: 4 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Thời gian */}
        <div className="admin-form-group" style={{ maxWidth: 250 }}>
          <label className="admin-form-label">Thời gian (phút)</label>
          <input type="number" min={5} max={300} className="admin-form-input" value={data.duration} onChange={e => set('duration')(Number(e.target.value))} />
          <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>Mặc định 60 phút</p>
        </div>

        {errors.count && <p className="field-error">{errors.count}</p>}
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
// Tab Components
// ─────────────────────────────────────────────────────────────────────────────
function TabMultipleChoice({ questions, setQuestions, total }) {
  const [current, setCurrent] = useState(0);
  const [inputMode, setInputMode] = useState('choice'); // 'choice', 'paste', 'preview', 'manual'
  
  // Paste mode state
  const [pasteText, setPasteText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [error, setError] = useState('');

  const handleParse = () => {
    setError('');
    const result = parseQuestions(pasteText);
    
    if (!result.success) {
      setError(result.error);
      return;
    }

    setParsed(result);
    setSelectedQuestions(result.data.map((_, idx) => idx)); // Select all by default
    setInputMode('preview');
  };

  const toggleQuestion = (idx) => {
    setSelectedQuestions(prev => 
      prev.includes(idx) 
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  const handleConfirm = () => {
    if (selectedQuestions.length === 0) {
      setError('Vui lòng chọn ít nhất một câu hỏi');
      return;
    }

    const questionsToSave = selectedQuestions.map(idx => parsed.data[idx]);
    const merged = [...questionsToSave];
    while (merged.length < total) merged.push(BLANK_MC());
    
    setQuestions(merged.slice(0, total));
    setPasteText('');
    setParsed(null);
    setSelectedQuestions([]);
    setError('');
    setInputMode('manual');
  };

  const handleReset = () => {
    setPasteText('');
    setParsed(null);
    setSelectedQuestions([]);
    setError('');
    setInputMode('choice');
  };

  
  // Safety check
  if (!questions || questions.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>;
  }

  // Parse pasted text - removed, using ImportQuestionsModal instead

  // Edit mode - show question navigator
  const q = questions[current];
  const setQ = u => setQuestions(qs => qs.map((item, i) => i === current ? u(item) : item));
  const setField = f => v => setQ(q => ({ ...q, [f]: v }));
  const setFieldE = f => e => setField(f)(e.target.value);
  const setOptText = idx => e => setQ(q => {
    const opts = [...q.options]; opts[idx] = { ...opts[idx], text: e.target.value };
    return { ...q, options: opts };
  });

  const isComplete = q => q.content.trim() && q.correct_answer && q.options.every(o => o.text.trim());
  const completedCount = questions.filter(isComplete).length;

  // Show choice screen if inputMode is 'choice'
  if (inputMode === 'choice') {
    return (
      <div className="q-tab-content" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 30, textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Chọn cách nhập câu hỏi</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Trắc nghiệm · {total} câu</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 600, width: '100%' }}>
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
            onClick={() => setInputMode('paste')}
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
      </div>
    );
  }

  // Paste input step
  if (inputMode === 'paste') {
    return (
      <div className="q-tab-content" style={{ padding: '20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            Dán nội dung câu hỏi vào dưới đây. Hỗ trợ 2 format:
          </p>
          <div style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', maxHeight: 100, overflow: 'auto' }}>
            <strong>Format 1:</strong><br/>
            Câu 1. Nội dung?<br/>
            A. Đáp án<br/>
            → Đáp án: B. Giải thích: ...<br/><br/>
            <strong>Format 2:</strong><br/>
            Câu 1: Nội dung?<br/>
            A. Đáp án<br/>
            Đáp án: B<br/>
            Giải thích: ...
          </div>
          <textarea
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            placeholder="Dán nội dung câu hỏi ở đây..."
            style={{
              width: '100%',
              height: 200,
              padding: 12,
              border: '1px solid var(--gray-200)',
              borderRadius: 6,
              fontFamily: 'monospace',
              fontSize: 13,
              resize: 'vertical',
              marginBottom: 16,
            }}
          />
          {error && (
            <div style={{ marginBottom: 12, padding: 12, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, color: '#991b1b', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={handleReset}>← Quay lại</button>
            <button 
              className="btn btn-primary" 
              onClick={handleParse}
              disabled={!pasteText.trim()}
            >
              Phân tích
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview step
  if (inputMode === 'preview' && parsed) {
    return (
      <div className="q-tab-content" style={{ padding: '20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 12, background: 'var(--blue-50)', borderRadius: 6, border: '1px solid var(--blue-200)', color: 'var(--blue-900)', fontSize: 13 }}>
            ℹ️ Tìm thấy <strong>{parsed.count} câu hỏi</strong>. Chọn câu hỏi để lưu.
            {parsed.warnings.length > 0 && (
              <div style={{ marginTop: 8, color: 'var(--yellow-800)' }}>
                ⚠️ Cảnh báo: {parsed.warnings.join(', ')}
              </div>
            )}
          </div>

          <div style={{ maxHeight: '45vh', overflow: 'auto', border: '1px solid var(--gray-200)', borderRadius: 6 }}>
            {parsed.data.map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: 12,
                  borderBottom: idx < parsed.data.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  background: selectedQuestions.includes(idx) ? 'var(--blue-50)' : 'white',
                  cursor: 'pointer',
                }}
                onClick={() => toggleQuestion(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(idx)}
                    onChange={() => toggleQuestion(idx)}
                    style={{ marginTop: 3 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, fontSize: 13 }}>
                      Câu {idx + 1}: {q.content.substring(0, 80)}...
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {['A', 'B', 'C', 'D'].map(letter => (
                        <div key={letter} style={{ marginBottom: 3 }}>
                          <strong>{letter}:</strong> {q.options.find(o => o.id === letter)?.text || ''}
                          {q.correct_answer === letter && <span style={{ color: 'var(--green-600)' }}> ✓</span>}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic', paddingTop: 6, borderTop: '1px solid var(--gray-100)' }}>
                        💡 {q.explanation.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ padding: 12, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, color: '#991b1b', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={handleReset}>← Quay lại</button>
            <button 
              className="btn btn-primary" 
              onClick={handleConfirm}
              disabled={selectedQuestions.length === 0}
            >
              💾 Lưu {selectedQuestions.length} câu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="q-tab-content">
      {inputMode === 'manual' ? (
        <>
          <div className="q-navigator">
            {questions.map((q, i) => (
              <button key={i} className={`q-nav-btn ${i===current?'q-nav-btn--active':''} ${isComplete(q)?'q-nav-btn--done':''}`} onClick={() => setCurrent(i)}>{i + 1}</button>
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

          <div className="q-tab-footer" style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
            <button className="btn btn-outline" onClick={() => setCurrent(c => Math.max(0, c-1))} disabled={current===0}>← Trước</button>
            <span style={{ fontSize:13, color:'var(--text-muted)' }}>{completedCount}/{total} ({Math.round((completedCount/total)*100)}%)</span>
            <button className="btn btn-outline" onClick={() => setCurrent(c => Math.min(total-1, c+1))} disabled={current===total-1}>Tiếp →</button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function TabEssay({ questions, setQuestions, total }) {
  const [current, setCurrent] = useState(0);
  
  // Safety check
  if (!questions || questions.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>;
  }

  const q = questions[current];
  const setQ = u => setQuestions(qs => qs.map((item, i) => i === current ? u(item) : item));
  const setField = f => v => setQ(q => ({ ...q, [f]: v }));
  const setFieldE = f => e => setField(f)(e.target.value);

  const addSubQuestion = () => {
    setQ(q => ({ ...q, sub_questions: [...(q.sub_questions || []), { id: String.fromCharCode(97 + (q.sub_questions?.length || 0)), content: '' }] }));
  };

  const removeSubQuestion = idx => {
    setQ(q => ({ ...q, sub_questions: q.sub_questions.filter((_, i) => i !== idx) }));
  };

  const setSubQuestion = (idx, content) => {
    setQ(q => {
      const subs = [...(q.sub_questions || [])];
      subs[idx] = { ...subs[idx], content };
      return { ...q, sub_questions: subs };
    });
  };

  const isComplete = q => q.content.trim();
  const completedCount = questions.filter(isComplete).length;

  return (
    <div className="q-tab-content">
      <div className="q-navigator">
        {questions.map((q, i) => (
          <button key={i} className={`q-nav-btn ${i===current?'q-nav-btn--active':''} ${isComplete(q)?'q-nav-btn--done':''}`} onClick={() => setCurrent(i)}>{i + 1}</button>
        ))}
      </div>

      <div className="q-form">
        <div className="q-form__num">Câu {current + 1}</div>
        <div className="admin-form-group">
          <label className="admin-form-label">Nội dung câu hỏi chính *</label>
          <textarea className="admin-form-textarea" rows={3} placeholder="Nhập nội dung câu hỏi..." value={q.content} onChange={setFieldE('content')} />
        </div>

        <div className="admin-form-group">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <label className="admin-form-label">Câu hỏi phụ (a, b, c,...)</label>
            <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 12px' }} onClick={addSubQuestion}>+ Thêm</button>
          </div>
          {q.sub_questions && q.sub_questions.map((sub, idx) => (
            <div key={idx} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <div style={{ minWidth:30, paddingTop:8, fontWeight:700, color:'var(--text-muted)' }}>{sub.id})</div>
              <input className="admin-form-input" placeholder={`Câu hỏi phụ ${sub.id}`} value={sub.content} onChange={e => setSubQuestion(idx, e.target.value)} style={{ flex:1 }} />
              <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 10px', color:'var(--danger)' }} onClick={() => removeSubQuestion(idx)}>✕</button>
            </div>
          ))}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Gợi ý / Đáp án (tuỳ chọn)</label>
          <textarea className="admin-form-textarea" rows={2} placeholder="Gợi ý hoặc hướng dẫn trả lời..." value={q.explanation} onChange={setFieldE('explanation')} />
        </div>
      </div>

      <div className="q-tab-footer" style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
        <button className="btn btn-outline" onClick={() => setCurrent(c => Math.max(0, c-1))} disabled={current===0}>← Trước</button>
        <span style={{ fontSize:13, color:'var(--text-muted)' }}>{completedCount}/{total} ({Math.round((completedCount/total)*100)}%)</span>
        <button className="btn btn-outline" onClick={() => setCurrent(c => Math.min(total-1, c+1))} disabled={current===total-1}>Tiếp →</button>
      </div>
    </div>
  );
}

function TabScenario({ questions, setQuestions, total }) {
  return <TabEssay questions={questions} setQuestions={setQuestions} total={total} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Multi-tab Question Input
// ─────────────────────────────────────────────────────────────────────────────
function StepQuestions({ exam, onDone, onBack, isEdit }) {
  const [activeTab, setActiveTab] = useState('mc');
  const [mcQuestions, setMcQuestions]       = useState([]);
  const [essayQuestions, setEssayQuestions] = useState([]);
  const [scenarioQuestions, setScenarioQuestions] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mcTotal = exam.questions_count || 0;
  const essayTotal = exam.essay_questions_count || 0;
  const scenarioTotal = exam.scenario_questions_count || 0;

  useEffect(() => {
    if (!isEdit) {
      setMcQuestions(Array.from({ length: mcTotal }, () => BLANK_MC()));
      setEssayQuestions(Array.from({ length: essayTotal }, () => BLANK_ESSAY()));
      setScenarioQuestions(Array.from({ length: scenarioTotal }, () => BLANK_SCENARIO()));
      return;
    }

    setLoading(true);
    adminApi.getExamQuestions(exam.id)
      .then(res => {
        const existing = toArray(res.data);
        const mc = existing.filter(q => q.type === 'multiple_choice' || !q.type);
        const essay = existing.filter(q => q.type === 'essay');
        const scenario = existing.filter(q => q.type === 'scenario');

        while (mc.length < mcTotal) mc.push(BLANK_MC());
        while (essay.length < essayTotal) essay.push(BLANK_ESSAY());
        while (scenario.length < scenarioTotal) scenario.push(BLANK_SCENARIO());

        setMcQuestions(mc.slice(0, mcTotal));
        setEssayQuestions(essay.slice(0, essayTotal));
        setScenarioQuestions(scenario.slice(0, scenarioTotal));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [exam.id, isEdit, mcTotal, essayTotal, scenarioTotal]);

  const validateAll = () => {
    const errors = [];
    if (mcTotal > 0) {
      const mcComplete = mcQuestions.filter(q => q.content.trim() && q.correct_answer && q.options.every(o => o.text.trim()));
      if (mcComplete.length === 0) errors.push('Cần ít nhất 1 câu trắc nghiệm đầy đủ');
    }
    if (essayTotal > 0) {
      const essayComplete = essayQuestions.filter(q => q.content.trim());
      if (essayComplete.length === 0) errors.push('Cần ít nhất 1 câu tự luận');
    }
    if (scenarioTotal > 0) {
      const scenarioComplete = scenarioQuestions.filter(q => q.content.trim());
      if (scenarioComplete.length === 0) errors.push('Cần ít nhất 1 câu tình huống');
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = validateAll();
    if (errors.length) { alert(errors.join('\n')); return; }

    const allQuestions = [
      ...mcQuestions.filter(q => q.content.trim() && q.correct_answer && q.options && q.options.length > 0 && q.options.every(o => o.text.trim())).map(q => ({ ...q, type: 'multiple_choice' })),
      ...essayQuestions.filter(q => q.content.trim()).map(q => ({ content: q.content, sub_questions: q.sub_questions, explanation: q.explanation, type: 'essay' })),
      ...scenarioQuestions.filter(q => q.content.trim()).map(q => ({ content: q.content, sub_questions: q.sub_questions, explanation: q.explanation, type: 'scenario' })),
    ];

    if (!allQuestions.length) { alert('Chưa có câu nào đầy đủ.'); return; }
    setSaving(true);
    try {
      await adminApi.bulkStoreQuestions(exam.id, allQuestions);
      setSaved(true);
    } catch (err) {
      alert('Lỗi: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="wizard-step page-enter" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60 }}>
      <div style={{ textAlign:'center' }}><div style={{ fontSize:40, marginBottom:12 }}></div><p style={{ color:'var(--text-muted)' }}>Đang tải câu hỏi...</p></div>
    </div>
  );

  if (saved) return (
    <div className="wizard-step page-enter">
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 32px', gap:20, textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(34,197,94,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>✅</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#16a34a', margin:0 }}>{isEdit ? 'Cập nhật thành công!' : 'Tạo đề thi thành công!'}</h2>
        <p style={{ fontSize:14, color:'var(--text-muted)', margin:0, maxWidth:360, lineHeight:1.6 }}>
          Đã lưu {mcQuestions.filter(q => q.content.trim()).length + essayQuestions.filter(q => q.content.trim()).length + scenarioQuestions.filter(q => q.content.trim()).length} câu · {exam.duration} phút
        </p>
        <div style={{ marginTop:12 }}><button className="btn btn-primary" onClick={onDone}>✓ Về danh sách</button></div>
      </div>
    </div>
  );

  return (
    <div className="wizard-step page-enter">
      <div className="wizard-step__head">
        <div className="wizard-badge">{isEdit ? 'Sửa câu hỏi' : 'Bước 2 / 2'}</div>
        <h2 className="wizard-title">{isEdit ? 'Sửa câu hỏi' : 'Nhập câu hỏi'}</h2>
        <p className="wizard-sub">
          {exam.title} · {mcTotal > 0 ? `${mcTotal} trắc nghiệm` : ''}{mcTotal > 0 && (essayTotal > 0 || scenarioTotal > 0) ? ' · ' : ''}{essayTotal > 0 ? `${essayTotal} tự luận` : ''}{(mcTotal > 0 || essayTotal > 0) && scenarioTotal > 0 ? ' · ' : ''}{scenarioTotal > 0 ? `${scenarioTotal} tình huống` : ''} · ⏱ {exam.duration} phút
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, borderBottom:'1px solid var(--gray-200)', paddingBottom:12, paddingTop: 12 }}>
        {mcTotal > 0 && (
          <button className={`btn ${activeTab === 'mc' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize:14, padding:'8px 16px' }} onClick={() => setActiveTab('mc')}>
            📝 Trắc nghiệm ({mcTotal})
          </button>
        )}
        <button className={`btn ${activeTab === 'essay' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize:14, padding:'8px 16px' }} onClick={() => setActiveTab('essay')}>
          ✏️ Tự luận ({essayTotal})
        </button>
        <button className={`btn ${activeTab === 'scenario' ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize:14, padding:'8px 16px' }} onClick={() => setActiveTab('scenario')}>
          💼 Tình huống ({scenarioTotal})
        </button>
      </div>

      {/* Tab contents */}
      {activeTab === 'mc' && mcTotal > 0 && <TabMultipleChoice questions={mcQuestions} setQuestions={setMcQuestions} total={mcTotal} />}
      {activeTab === 'essay' && (
        essayTotal > 0 ? (
          <TabEssay questions={essayQuestions} setQuestions={setEssayQuestions} total={essayTotal} />
        ) : (
          <div style={{ padding:'20px', textAlign:'center', color:'var(--gray-500)', fontSize:14 }}>
            Vui lòng nhập số câu tự luận ở bước 1 để bắt đầu
          </div>
        )
      )}
      {activeTab === 'scenario' && (
        scenarioTotal > 0 ? (
          <TabScenario questions={scenarioQuestions} setQuestions={setScenarioQuestions} total={scenarioTotal} />
        ) : (
          <div style={{ padding:'20px', textAlign:'center', color:'var(--gray-500)', fontSize:14 }}>
            Vui lòng nhập số câu tình huống ở bước 1 để bắt đầu
          </div>
        )
      )}


      {/* Action footer - Bottom */}
      <div className="wizard-footer">
        <button className="btn btn-outline" onClick={onBack}>← Quay lại</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : `Lưu đề thi`}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminExams
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminExams() {
  const [categories,  setCategories]  = useState([]);
  const [exams,       setExams]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');

  const [wizard,      setWizard]      = useState(null);
  const [formData,    setFormData]    = useState({ ...BLANK });
  const [createdExam, setCreatedExam] = useState(null);
  const [isEdit,      setIsEdit]      = useState(false);
  const [editId,      setEditId]      = useState(null);

  const reload = () => {
    setLoading(true);
    Promise.all([
      categoryApi.list().then(r => toArray(r.data)),
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/admin/exams?per_page=100`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('lh_token')}`, Accept: 'application/json' }
      }).then(r => r.json()).then(d => d.data || []),
    ])
      .then(([cats, exs]) => { setCategories(cats); setExams(exs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const filtered = exams.filter(e => !search || e.title?.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setIsEdit(false); setEditId(null);
    setFormData({ ...BLANK }); setCreatedExam(null);
    setWizard('step1');
  };

  const openEdit = e => {
    setIsEdit(true); setEditId(e.id);
    setFormData({
      title:                    e.title || '',
      subject_id:               e.subject_id || e.subject_model?.id || '',
      category_id:              e.subject_model?.category_id || e.subject_model?.category?.id || '',
      questions_count:          e.questions_count || 0,
      essay_questions_count:    e.essay_questions_count || 0,
      scenario_questions_count: e.scenario_questions_count || 0,
      duration:                 e.duration || 60,
      status:                   e.status || 'published',
    });
    setCreatedExam(e); setWizard('step1');
  };

  const handleDone = () => { setWizard(null); reload(); };

  if (wizard === 'step1') return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa đề thi' : 'Thêm đề thi thử'}</h1>
      </div>
      <StepInfo categories={categories} data={formData} setData={setFormData}
        onNext={exam => { setCreatedExam(exam); setWizard('step2'); }}
        onCancel={() => setWizard(null)} isEdit={isEdit} editId={editId} />
    </div>
  );

  if (wizard === 'step2' && createdExam) return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa câu hỏi' : 'Nhập câu hỏi'}</h1>
      </div>
      <StepQuestions exam={createdExam} onDone={handleDone} onBack={() => setWizard('step1')} isEdit={isEdit} />
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đề thi thử</h1>
          <p className="admin-page-sub">{exams.length} đề thi</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm đề thi</button>
      </div>

      <div className="admin-card" style={{ marginBottom:16 }}>
        <div className="admin-filter-bar">
          <div className="admin-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Tìm đề thi..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize:13, color:'var(--text-muted)', marginLeft:'auto' }}>{filtered.length} kết quả</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Tên đề</th><th>Môn học</th><th>Danh mục</th><th>Câu</th><th>Phút</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="admin-empty"><span></span><p>Đang tải...</p></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="admin-empty"><span></span><p>Chưa có đề thi nào</p></div></td></tr>
              ) : filtered.map(e => (
                <tr key={e.id}>
                  <td style={{ maxWidth:260 }}>
                    <div style={{ fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.title}</div>
                    {(e.questions_count || e.essay_questions_count || e.scenario_questions_count) && <div style={{ fontSize:11, color:'var(--navy)', fontWeight:600, marginTop:2 }}>
                      {e.questions_count ? `${e.questions_count} TN` : ''}{e.questions_count && (e.essay_questions_count || e.scenario_questions_count) ? ' · ' : ''}{e.essay_questions_count ? `${e.essay_questions_count} TL` : ''}{(e.questions_count || e.essay_questions_count) && e.scenario_questions_count ? ' · ' : ''}{e.scenario_questions_count ? `${e.scenario_questions_count} TH` : ''}
                    </div>}
                  </td>
                  <td style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{e.subject_model?.name || '—'}</td>
                  <td><span className="admin-badge admin-badge--blue">{e.subject_model?.category?.name || '—'}</span></td>
                  <td style={{ textAlign:'center', fontWeight:600 }}>{(e.questions_count || 0) + (e.essay_questions_count || 0) + (e.scenario_questions_count || 0)}</td>
                  <td style={{ textAlign:'center' }}>{e.duration ?? 60}'</td>
                  <td><span className={`admin-badge ${e.status==='published'?'admin-badge--green':'admin-badge--gray'}`}>{e.status==='published'?'Đã đăng':'Ẩn'}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="admin-action-btn admin-action-btn--primary" onClick={() => openEdit(e)}>Sửa</button>
                      <button className="admin-action-btn" onClick={async () => {
                        try {
                          const s = e.status==='published' ? 'draft' : 'published';
                          await adminApi.updateExam(e.id, { status: s });
                          setExams(p => p.map(x => x.id===e.id ? { ...x, status: s } : x));
                        } catch {}
                      }}>{e.status==='published' ? 'Ẩn' : 'Hiện'}</button>
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
