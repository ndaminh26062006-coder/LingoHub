<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Services\UserStatsService;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    // GET /api/exams
    public function index(Request $request)
    {
        $query = Exam::with(['subjectModel.category', 'examQuestions'])
            ->where('status', 'published');

        if ($request->filled('category')) {
            $query->whereHas('subjectModel.category', fn ($q) =>
                $q->where('slug', $request->category)
                  ->orWhere('id', $request->category)
            );
        }

        if ($request->filled('subject')) {
            $query->where('subject_id', $request->subject);
        }

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->q . '%')
                  ->orWhere('chapter', 'like', '%' . $request->q . '%');
            });
        }

        $exams = $query->orderByDesc('created_at')->paginate(20);

        // Add question type breakdown to each exam
        $items = $exams->items();
        foreach ($items as $exam) {
            $exam->mc_count = $exam->examQuestions->where('type', 'multiple_choice')->count();
            $exam->essay_count = $exam->examQuestions->where('type', 'essay')->count();
            $exam->scenario_count = $exam->examQuestions->where('type', 'scenario')->count();
            $exam->total_questions = $exam->mc_count + $exam->essay_count + $exam->scenario_count;
        }

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $exams->currentPage(),
                'last_page'    => $exams->lastPage(),
                'total'        => $exams->total(),
            ],
        ]);
    }

    public function adminIndex(Request $request)
    {
        $query = Exam::with(['subjectModel.category']);

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->q . '%')
                  ->orWhere('chapter', 'like', '%' . $request->q . '%');
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('subjectModel.category', fn ($q) =>
                $q->where('id', $request->category)
                  ->orWhere('slug', $request->category)
            );
        }

        if ($request->filled('subjects')) {
            $subjects = explode(',', $request->subjects);
            $query->whereIn('subject_id', $subjects);
        }

        $perPage = $request->input('per_page', 8);
        $exams = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'data' => $exams->items(),
            'current_page' => $exams->currentPage(),
            'last_page'    => $exams->lastPage(),
            'total'        => $exams->total(),
            'per_page'     => $exams->perPage(),
        ]);
    }

    // GET /api/exams/{id}
    public function show(Exam $exam)
    {
        if ($exam->status !== 'published') {
            return response()->json(['message' => 'Không tìm thấy.'], 404);
        }
        return response()->json($exam->load('subjectModel.category'));
    }

    // GET /api/exams/{id}/questions?full=1
    public function questions(Exam $exam)
    {
        $full = request()->filled('full');
        
        $questions = $exam->examQuestions()
            ->orderBy('order')
            ->get()
            ->map(fn ($q) => [
                'id'      => $q->id,
                'order'   => $q->order,
                'type'    => $q->type ?? 'multiple_choice',
                'content' => $q->content,
                'text'    => $q->content, // for backwards compatibility
                'options' => $q->type === 'multiple_choice' ? $q->options : null,
                'sub_questions' => in_array($q->type, ['essay', 'scenario']) ? $q->sub_questions : null,
                ...$full ? [
                    'correct_answer' => $q->correct_answer,
                    'explanation'    => $q->explanation,
                ] : [],
            ]);
        
        return response()->json($questions);
    }

    // POST /api/exams/{id}/submit
    public function submit(Request $request, Exam $exam)
    {
        $request->validate([
            'answers' => 'required|array',
            'time_spent_seconds' => 'integer|min:0',
            'mode' => 'in:exam,practice',
        ]);

        $questions = $exam->examQuestions()->get();
        $answers   = $request->answers;
        $results   = [];
        $correct   = 0;
        $answered  = 0;

        foreach ($questions as $q) {
            $userAnswer = $answers[$q->id] ?? null;
            $isCorrect  = false;
            $status     = 'unanswered';

            if ($userAnswer !== null) {
                $answered++;
                
                if ($q->type === 'multiple_choice') {
                    // Auto-grade: check if answer matches correct_answer
                    $isCorrect = $userAnswer === $q->correct_answer;
                    $status = $isCorrect ? 'correct' : 'incorrect';
                } else if (in_array($q->type, ['essay', 'scenario'])) {
                    // Manual review needed - mark as submitted, not graded yet
                    $status = 'submitted'; // pending teacher review
                    $isCorrect = false; // Will be graded later
                }
                
                if ($isCorrect) $correct++;
            }

            $results[] = [
                'id'             => $q->id,
                'type'           => $q->type,
                'user_answer'    => $userAnswer,
                'correct_answer' => $q->type === 'multiple_choice' ? $q->correct_answer : null,
                'is_correct'     => $isCorrect,
                'status'         => $status,
                'explanation'    => $q->explanation,
            ];
        }

        $total = $questions->count();
        $mcTotal = $questions->where('type', 'multiple_choice')->count();
        $score = $mcTotal > 0 ? round(($correct / $mcTotal) * 10, 1) : 0;
        $skipped = $total - $answered;
        $accuracy = $mcTotal > 0 ? round(($correct / $mcTotal) * 100, 2) : 0;
        
        $timeSpent = $request->input('time_spent_seconds', 0);
        $avgTimePerQuestion = $answered > 0 ? round($timeSpent / $answered, 2) : 0;

        // Increment global exam attempts
        $exam->increment('attempts');

        // If authenticated, persist submission and update user stats
        if ($request->user()) {
            $user = $request->user();
            
            // Create submission record
            $submission = $user->userExamSubmissions()->create([
                'exam_id' => $exam->id,
                'score' => $score,
                'correct_count' => $correct,
                'total_questions' => $total,
                'accuracy_percent' => $accuracy,
                'time_spent_seconds' => $timeSpent,
                'avg_time_per_question' => $avgTimePerQuestion,
                'answered_count' => $answered,
                'skipped_count' => $skipped,
                'mode' => $request->input('mode', 'exam'),
                'is_passed' => $score >= 5.0,
                'completed_at' => now(),
            ]);

            // Update user stats using service
            UserStatsService::updateAfterSubmission($user, $submission);
        }

        return response()->json([
            'score'   => $score,
            'correct' => $correct,
            'wrong'   => $mcTotal - $correct - $skipped,
            'skipped' => $skipped,
            'total'   => $total,
            'accuracy' => $accuracy,
            'avg_time_per_question' => $avgTimePerQuestion,
            'results' => $results,
        ]);
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    // POST /api/admin/exams
    public function store(Request $request)
    {
        $data = $request->validate([
            'subject_id'      => 'nullable|exists:subjects,id',
            'title'           => 'required|string|max:255',
            'chapter'         => 'nullable|string|max:255',
            'description'     => 'nullable|string',
            'questions_count' => 'nullable|integer|min:0',
            'essay_questions_count' => 'nullable|integer|min:0',
            'scenario_questions_count' => 'nullable|integer|min:0',
            'duration'        => 'integer|min:1',
            'status'          => 'in:published,draft',
        ]);

        // Set questions_count mặc định = 0 nếu không có
        if (!isset($data['questions_count']) || $data['questions_count'] === null) {
            $data['questions_count'] = 0;
        }

        // Chỉ lưu questions_count, không lưu essay/scenario counts ở bảng exams
        unset($data['essay_questions_count']);
        unset($data['scenario_questions_count']);

        $data['created_by'] = $request->user()->id;
        $exam = Exam::create($data);

        return response()->json($exam->load('subjectModel.category'), 201);
    }

    // PUT /api/admin/exams/{id}
    public function update(Request $request, Exam $exam)
    {
        $data = $request->validate([
            'subject_id'      => 'nullable|exists:subjects,id',
            'title'           => 'sometimes|string|max:255',
            'chapter'         => 'nullable|string|max:255',
            'description'     => 'nullable|string',
            'questions_count' => 'nullable|integer|min:0',
            'essay_questions_count' => 'nullable|integer|min:0',
            'scenario_questions_count' => 'nullable|integer|min:0',
            'duration'        => 'integer|min:1',
            'status'          => 'in:published,draft',
        ]);

        // Set questions_count mặc định = 0 nếu không có
        if (!isset($data['questions_count']) || $data['questions_count'] === null) {
            $data['questions_count'] = 0;
        }

        // Chỉ lưu questions_count, không lưu essay/scenario counts ở bảng exams
        unset($data['essay_questions_count']);
        unset($data['scenario_questions_count']);

        $exam->update($data);
        return response()->json($exam->fresh()->load('subjectModel.category'));
    }

    // DELETE /api/admin/exams/{id}
    public function destroy(Exam $exam)
    {
        $exam->delete();
        return response()->json(['message' => 'Xóa thành công.']);
    }

    // GET /api/admin/exams/{id}/questions
    public function adminQuestions(Exam $exam)
    {
        return response()->json(
            $exam->examQuestions()->get()->map(fn ($q) => [
                'id'             => $q->id,
                'order'          => $q->order,
                'type'           => $q->type,
                'content'        => $q->content,
                'options'        => $q->options,
                'correct_answer' => $q->correct_answer,
                'sub_questions'  => $q->sub_questions,
                'explanation'    => $q->explanation,
            ])
        );
    }

    // POST /api/admin/exams/{id}/questions/bulk
    public function bulkStoreQuestions(Request $request, Exam $exam)
    {
        $request->validate([
            'questions'                  => 'required|array|min:1',
            'questions.*.type'           => 'required|in:multiple_choice,essay,scenario',
            'questions.*.content'        => 'required|string',
            'questions.*.options'        => 'required_if:questions.*.type,multiple_choice|array|size:4',
            'questions.*.options.*.id'   => 'required_if:questions.*.type,multiple_choice|in:A,B,C,D',
            'questions.*.options.*.text' => 'required_if:questions.*.type,multiple_choice|string',
            'questions.*.correct_answer' => 'required_if:questions.*.type,multiple_choice|in:A,B,C,D',
            'questions.*.sub_questions'  => 'nullable|array',
            'questions.*.explanation'    => 'nullable|string',
        ]);

        $exam->examQuestions()->delete();

        $created = [];
        foreach ($request->questions as $idx => $q) {
            $created[] = ExamQuestion::create([
                'exam_id'        => $exam->id,
                'order'          => $idx + 1,
                'type'           => $q['type'],
                'content'        => $q['content'],
                'options'        => $q['options'] ?? null,
                'correct_answer' => $q['correct_answer'] ?? null,
                'sub_questions'  => $q['sub_questions'] ?? null,
                'explanation'    => $q['explanation'] ?? null,
                'difficulty'     => 0,
            ]);
        }

        // Update counts
        $mcCount = count(array_filter($request->questions, fn($q) => $q['type'] === 'multiple_choice'));
        $essayCount = count(array_filter($request->questions, fn($q) => $q['type'] === 'essay'));
        $scenarioCount = count(array_filter($request->questions, fn($q) => $q['type'] === 'scenario'));

        $exam->update([
            'questions_count' => $mcCount,
            'essay_questions_count' => $essayCount,
            'scenario_questions_count' => $scenarioCount,
            'status' => 'published'
        ]);

        return response()->json([
            'message' => 'Đã lưu ' . count($created) . ' câu hỏi.',
            'count'   => count($created),
        ], 201);
    }

    // POST /api/admin/exams/{id}/questions/import-text
    // Just validate and return parsed data (frontend will call bulkStoreQuestions after user confirms)
    public function importQuestionsFromText(Request $request, Exam $exam)
    {
        $request->validate([
            'text' => 'required|string|min:50',
        ]);

        // Simple regex-based parser on backend (frontend already has detailed parser)
        $text = $request->text;
        $questionBlocks = preg_split('/(?=Câu\s+\d+[\.:])/', $text, -1, PREG_SPLIT_NO_EMPTY);
        
        if (empty($questionBlocks)) {
            return response()->json(['message' => 'Không tìm thấy câu hỏi'], 422);
        }

        $questions = [];
        foreach ($questionBlocks as $block) {
            $q = $this->parseQuestionBlock($block);
            if ($q) {
                $questions[] = $q;
            }
        }

        if (empty($questions)) {
            return response()->json(['message' => 'Không thể parse câu hỏi từ text'], 422);
        }

        return response()->json([
            'message' => "Tìm thấy " . count($questions) . " câu hỏi. Hãy xác nhận để lưu.",
            'questions' => $questions,
            'count' => count($questions),
        ]);
    }

    private function parseQuestionBlock($block)
    {
        // Extract content (từ "Câu X." đến trước "A.")
        if (!preg_match('/Câu\s+\d+[\.:]\s*(.+?)(?=\n\s*[A-D]\.)/s', $block, $matches)) {
            return null;
        }
        $content = trim($matches[1]);

        // Extract options A, B, C, D
        $options = [];
        if (!preg_match_all('/([A-D])\.\s*(.+?)(?=\n\s*[A-D]\.|→|Đáp án|$)/s', $block, $matches)) {
            return null;
        }

        for ($i = 0; $i < count($matches[0]); $i++) {
            $letter = $matches[1][$i];
            $text = trim($matches[2][$i]);
            if ($text) {
                $options[$letter] = $text;
            }
        }

        if (count($options) < 4) {
            return null;
        }

        // Extract correct answer
        $correctAnswer = null;
        if (preg_match('/(?:→|Đáp án\s*[:\s]*)([A-D])/i', $block, $matches)) {
            $correctAnswer = strtoupper($matches[1]);
        } elseif (preg_match('/Đáp án\s+đúng[\s:]*([A-D])/i', $block, $matches)) {
            $correctAnswer = strtoupper($matches[1]);
        }

        if (!$correctAnswer || !isset($options[$correctAnswer])) {
            return null;
        }

        // Extract explanation
        $explanation = '';
        if (preg_match('/(?:Giải thích[\s:]*|→\s*Đáp án[\s:]*[A-D]\.)\s*(.+?)(?=\n\s*Câu|$)/s', $block, $matches)) {
            $explanation = trim($matches[1]);
        }

        return [
            'content' => $content,
            'options' => [
                ['id' => 'A', 'text' => $options['A'] ?? ''],
                ['id' => 'B', 'text' => $options['B'] ?? ''],
                ['id' => 'C', 'text' => $options['C'] ?? ''],
                ['id' => 'D', 'text' => $options['D'] ?? ''],
            ],
            'correct_answer' => $correctAnswer,
            'explanation' => $explanation,
            'difficulty' => 'Trung bình',
        ];
    }

    /**
     * Record exam attempt for freemium tracking
     * 
     * POST /api/exams/{exam}/record-attempt
     * Body: {
     *   "subject_id": 1
     * }
     */
    public function recordAttempt(Request $request, Exam $exam)
    {
        $request->validate([
            'subject_id' => 'required|integer',
        ]);

        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $subjectId = $request->input('subject_id');

        // Check if already attempted this exact exam
        $existing = \App\Models\UserExamAttempt::where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->where('subject_id', $subjectId)
            ->first();

        if (!$existing) {
            // Create new attempt record
            \App\Models\UserExamAttempt::create([
                'user_id' => $user->id,
                'exam_id' => $exam->id,
                'subject_id' => $subjectId,
                'attempted_at' => now(),
            ]);
        }

        // Get total attempts for this subject
        $totalAttempts = \App\Models\UserExamAttempt::where('user_id', $user->id)
            ->where('subject_id', $subjectId)
            ->count();

        return response()->json([
            'message' => 'Attempt recorded',
            'attempt_number' => $totalAttempts,
            'can_continue' => true,
        ]);
    }
}
