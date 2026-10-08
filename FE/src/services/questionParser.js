/**
 * Question Parser - Detects format and extracts questions from pasted text
 * Supports Format 1 (→ Đáp án:) and Format 2 (Đáp án:) and Format 3 (Đáp án đúng:)
 */

export function parseQuestions(text) {
  if (!text || text.trim().length === 0) {
    return { success: false, error: 'Vui lòng nhập nội dung' };
  }

  // Split by "Câu X." pattern to get individual questions
  const questionBlocks = text.split(/(?=Câu\s+\d+[\.:])/).filter(block => block.trim());
  
  if (questionBlocks.length === 0) {
    return { success: false, error: 'Không tìm thấy câu hỏi. Định dạng phải bắt đầu với "Câu 1." hoặc "Câu 1:"' };
  }

  const questions = [];
  const errors = [];

  for (let i = 0; i < questionBlocks.length; i++) {
    const block = questionBlocks[i].trim();
    const parsed = parseQuestionBlock(block, i + 1);
    
    if (parsed.success) {
      questions.push(parsed.data);
    } else {
      errors.push(`Câu ${i + 1}: ${parsed.error}`);
    }
  }

  if (questions.length === 0) {
    return { success: false, error: errors.join('\n') || 'Không thể parse câu hỏi' };
  }

  return {
    success: true,
    data: questions,
    warnings: errors.length > 0 ? errors : [],
    count: questions.length,
  };
}

function parseQuestionBlock(block, questionNumber) {
  try {
    // Extract question content (từ "Câu X." đến trước "A.")
    const contentMatch = block.match(/Câu\s+\d+[\.:]\s*(.+?)(?=\n\s*[A-D]\.)/s);
    if (!contentMatch) {
      return { success: false, error: 'Không tìm thấy nội dung câu hỏi' };
    }
    const content = contentMatch[1].trim();

    // Extract options A, B, C, D
    const options = {};
    const optionRegex = /([A-D])\.\s*(.+?)(?=\n\s*[A-D]\.|→|Đáp án|$)/gs;
    let match;
    let optionCount = 0;

    while ((match = optionRegex.exec(block)) !== null) {
      const letter = match[1];
      const text = match[2].trim();
      if (text) {
        options[letter] = text;
        optionCount++;
      }
    }

    if (optionCount < 4) {
      return { success: false, error: `Chỉ tìm thấy ${optionCount}/4 đáp án` };
    }

    // Extract correct answer (nhiều format)
    let correctAnswer = null;
    
    // Format: "→ Đáp án: B. Giải thích:..."
    let answerMatch = block.match(/(?:→|Đáp án\s*[:\s]*)([A-D])/i);
    if (answerMatch) correctAnswer = answerMatch[1].toUpperCase();

    // Format: "Đáp án đúng: B"
    if (!correctAnswer) {
      answerMatch = block.match(/Đáp án\s+đúng[\s:]*([A-D])/i);
      if (answerMatch) correctAnswer = answerMatch[1].toUpperCase();
    }

    // Format: "Đáp án: C"
    if (!correctAnswer) {
      answerMatch = block.match(/Đáp án[\s:]*([A-D])/i);
      if (answerMatch) correctAnswer = answerMatch[1].toUpperCase();
    }

    if (!correctAnswer) {
      return { success: false, error: 'Không tìm thấy đáp án đúng' };
    }

    if (!options[correctAnswer]) {
      return { success: false, error: `Đáp án "${correctAnswer}" không tồn tại trong các lựa chọn` };
    }

    // Extract explanation (sau "Giải thích:" hoặc "→ Đáp án: X.")
    let explanation = '';
    const explanationMatch = block.match(/(?:Giải thích[\s:]*|→\s*Đáp án[\s:]*[A-D]\.)\s*(.+?)(?=\n\s*Câu|$)/s);
    if (explanationMatch) {
      explanation = explanationMatch[1].trim();
    }

    return {
      success: true,
      data: {
        order: questionNumber,
        content: content,
        options: [
          { id: 'A', text: options['A'] },
          { id: 'B', text: options['B'] },
          { id: 'C', text: options['C'] },
          { id: 'D', text: options['D'] },
        ],
        correct_answer: correctAnswer,
        explanation: explanation || '',
        difficulty: 'Trung bình',
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
