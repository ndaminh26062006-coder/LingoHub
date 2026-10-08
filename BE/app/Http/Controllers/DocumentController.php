<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\UserStatsService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    // GET /api/documents
    public function index(Request $request)
    {
        $query = Document::with(['subjectModel.category'])
            ->where('status', 'published');

        // Filter theo category (qua subject)
        if ($request->filled('category')) {
            $query->whereHas('subjectModel.category', fn ($q) =>
                $q->where('slug', $request->category)
                  ->orWhere('id', $request->category)
            );
        }

        // Filter theo subject
        if ($request->filled('subject')) {
            $query->where('subject_id', $request->subject);
        }

        // Tìm kiếm theo title hoặc chapter
        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->q . '%')
                  ->orWhere('chapter', 'like', '%' . $request->q . '%')
                  ->orWhereHas('subjectModel', fn ($sq) =>
                      $sq->where('name', 'like', '%' . $request->q . '%')
                  );
            });
        }

        $docs = $query->orderByDesc('created_at')->paginate(20);

        return response()->json([
            'data' => $docs->items(),
            'meta' => [
                'current_page' => $docs->currentPage(),
                'last_page'    => $docs->lastPage(),
                'total'        => $docs->total(),
            ],
        ]);
    }

    // GET /api/documents/{id}
    public function show(Document $document)
    {
        if ($document->status !== 'published') {
            return response()->json(['message' => 'Không tìm thấy.'], 404);
        }
        return response()->json($document->load('subjectModel.category'));
    }

    // GET /api/documents/{id}/questions?full=1
    public function questions(Document $document)
    {
        $full = request()->filled('full');
        
        $questions = $document->questions()
            ->orderBy('order')
            ->get()
            ->map(fn ($q) => [
                'id'         => $q->id,
                'order'      => $q->order,
                'content'    => $q->content,
                'options'    => $q->options,
                'difficulty' => $q->difficulty,
                ...$full ? [
                    'correct_answer' => $q->correct_answer,
                    'explanation'    => $q->explanation,
                ] : [],
            ]);

        return response()->json($questions);
    }

    // POST /api/documents/{id}/submit
    public function submit(Request $request, Document $document)
    {
        $request->validate([
            'answers' => 'required|array',
            'time_spent_seconds' => 'integer|min:0',
        ]);

        $questions = $document->questions()->orderBy('order')->get();
        $answers   = $request->answers;
        $results   = [];
        $correct   = 0;
        $answered  = 0;

        foreach ($questions as $q) {
            $userAnswer = $answers[$q->id] ?? null;
            $isCorrect  = $userAnswer === $q->correct_answer;
            if ($isCorrect) $correct++;
            if ($userAnswer !== null) $answered++;

            $results[] = [
                'id'             => $q->id,
                'user_answer'    => $userAnswer,
                'correct_answer' => $q->correct_answer,
                'is_correct'     => $isCorrect,
                'explanation'    => $q->explanation,
            ];
        }

        $total = $questions->count();
        $score = $total > 0 ? round(($correct / $total) * 10, 1) : 0;
        $skipped = $total - $answered;
        $accuracy = $total > 0 ? round(($correct / $total) * 100, 2) : 0;
        
        $timeSpent = $request->input('time_spent_seconds', 0);
        $avgTimePerQuestion = $answered > 0 ? round($timeSpent / $answered, 2) : 0;

        $document->increment('attempts');

        // If authenticated, create submission and update user stats
        if ($request->user()) {
            $user = $request->user();

            // Create submission record
            $submission = $user->userDocumentSubmissions()->create([
                'document_id' => $document->id,
                'score' => $score,
                'correct_count' => $correct,
                'total_questions' => $total,
                'accuracy_percent' => $accuracy,
                'time_spent_seconds' => $timeSpent,
                'avg_time_per_question' => $avgTimePerQuestion,
                'answered_count' => $answered,
                'skipped_count' => $skipped,
                'is_passed' => $score >= 5.0,
                'completed_at' => now(),
            ]);

            // Update user stats using service
            UserStatsService::updateAfterDocumentSubmission($user, $submission);
        }

        return response()->json([
            'score'   => $score,
            'correct' => $correct,
            'wrong'   => $total - $correct - $skipped,
            'skipped' => $skipped,
            'total'   => $total,
            'accuracy' => $accuracy,
            'avg_time_per_question' => $avgTimePerQuestion,
            'results' => $results,
        ]);
    }

    // ── Admin CRUD ─────────────────────────────────────────────────────────

    // POST /api/admin/documents
    public function store(Request $request)
    {
        $data = $request->validate([
            'subject_id'      => 'required|exists:subjects,id',
            'title'           => 'required|string|max:255',
            'chapter'         => 'nullable|string|max:255',
            'description'     => 'nullable|string',
            'questions_count' => 'integer|min:1',
            'status'          => 'in:published,draft',
        ]);

        $data['created_by'] = $request->user()->id;
        $doc = Document::create($data);

        return response()->json($doc->load('subjectModel.category'), 201);
    }

    // PUT /api/admin/documents/{id}
    public function update(Request $request, Document $document)
    {
        $data = $request->validate([
            'subject_id'      => 'nullable|exists:subjects,id',
            'title'           => 'sometimes|string|max:255',
            'chapter'         => 'nullable|string|max:255',
            'description'     => 'nullable|string',
            'questions_count' => 'integer|min:1',
            'status'          => 'in:published,draft',
        ]);

        $document->update($data);
        return response()->json($document->fresh()->load('subjectModel.category'));
    }

    // DELETE /api/admin/documents/{id}
    public function destroy(Document $document)
    {
        $document->delete();
        return response()->json(['message' => 'Xóa thành công.']);
    }

    // GET /api/admin/documents/{id}/questions (full data with correct_answer)
    public function adminQuestions(Document $document)
    {
        $questions = $document->questions()
            ->orderBy('order')
            ->get()
            ->map(fn ($q) => [
                'id'             => $q->id,
                'order'          => $q->order,
                'content'        => $q->content,
                'options'        => $q->options,
                'correct_answer' => $q->correct_answer,
                'explanation'    => $q->explanation,
                'difficulty'     => $q->difficulty,
            ]);

        return response()->json($questions);
    }

    // POST /api/admin/documents/{id}/questions/bulk
    public function bulkStoreQuestions(Request $request, Document $document)
    {
        $request->validate([
            'questions'                  => 'required|array|min:1',
            'questions.*.content'        => 'required|string',
            'questions.*.options'        => 'required|array|size:4',
            'questions.*.options.*.id'   => 'required|in:A,B,C,D',
            'questions.*.options.*.text' => 'required|string',
            'questions.*.correct_answer' => 'required|in:A,B,C,D',
            'questions.*.explanation'    => 'nullable|string',
        ]);

        $document->questions()->delete();

        $created = [];
        foreach ($request->questions as $idx => $q) {
            $created[] = $document->questions()->create([
                'order'          => $idx + 1,
                'content'        => $q['content'],
                'options'        => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'explanation'    => $q['explanation'] ?? null,
                'difficulty'     => 'Trung bình',
            ]);
        }

        $document->update(['questions_count' => count($created), 'status' => 'published']);

        return response()->json([
            'message' => 'Đã lưu ' . count($created) . ' câu hỏi.',
            'count'   => count($created),
        ], 201);
    }
}
