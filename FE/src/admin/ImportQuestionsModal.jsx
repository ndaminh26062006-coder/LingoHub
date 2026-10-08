import { useState } from 'react';
import { parseQuestions } from '../services/questionParser';
import { adminApi } from '../services/api';
import './AdminLayout.css';

export default function ImportQuestionsModal({ exam, onClose, onSuccess }) {
  const [step, setStep] = useState('input'); // input, preview, confirm, done
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleParse = () => {
    setError('');
    const result = parseQuestions(text);
    
    if (!result.success) {
      setError(result.error);
      return;
    }

    setParsed(result);
    setSelectedQuestions(result.data.map((_, idx) => idx)); // Select all by default
    setStep('preview');
  };

  const toggleQuestion = (idx) => {
    setSelectedQuestions(prev => 
      prev.includes(idx) 
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  const handleConfirm = async () => {
    if (selectedQuestions.length === 0) {
      setError('Vui lòng chọn ít nhất một câu hỏi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const questionsToSave = selectedQuestions.map(idx => parsed.data[idx]);
      const res = await adminApi.bulkStoreDocumentQuestions(exam.id, questionsToSave);
      
      setStep('done');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu câu hỏi');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setParsed(null);
    setSelectedQuestions([]);
    setError('');
    setStep('input');
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="admin-modal" style={{ maxWidth: '90vw', width: 900, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div className="admin-modal__head">
          <span className="admin-modal__title">
            {step === 'input' && 'Nhập câu hỏi từ text'}
            {step === 'preview' && '👁️ Xem trước câu hỏi'}
            {step === 'done' && '✅ Import thành công'}
          </span>
          {step !== 'done' && (
            <button className="admin-modal__close" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="admin-modal__body" style={{ flex: 1, overflow: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '24px', paddingRight: '24px' }}>
          {/* STEP 1: Input */}
          {step === 'input' && (
            <div style={{ width: '100%', maxWidth: 700 }}>
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
                value={text}
                onChange={e => setText(e.target.value)}
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
                }}
              />
              {error && (
                <div style={{ marginTop: 12, padding: 12, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, color: '#991b1b', fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Preview */}
          {step === 'preview' && parsed && (
            <div style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--blue-50)', borderRadius: 6, border: '1px solid var(--blue-200)', color: 'var(--blue-900)', fontSize: 13 }}>
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
                <div style={{ marginTop: 12, padding: 12, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, color: '#991b1b', fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Done */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Import thành công!
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {selectedQuestions.length} câu hỏi đã được lưu vào đề thi.
              </div>
            </div>
          )}
        </div>

        <div className="admin-modal__footer" style={{ flexShrink: 0, borderTop: '1px solid var(--gray-200)' }}>
          {step === 'input' && (
            <>
              <button className="btn btn-outline" onClick={onClose}>Hủy</button>
              <button 
                className="btn btn-primary" 
                onClick={handleParse}
                disabled={!text.trim()}
              >
                Phân tích
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button className="btn btn-outline" onClick={handleReset}>← Quay lại</button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirm}
                disabled={selectedQuestions.length === 0 || loading}
              >
                {loading ? 'Đang lưu...' : `Lưu ${selectedQuestions.length} câu`}
              </button>
            </>
          )}

          {step === 'done' && (
            <button className="btn btn-primary" onClick={() => { onSuccess(); onClose(); }}>
              Hoàn thành
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
