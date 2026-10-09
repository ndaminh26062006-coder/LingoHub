<?php

namespace App\Http\Controllers;

use App\Models\EssayQuestion;
use Illuminate\Http\Request;

class EssayController extends Controller
{
    // GET /api/essays
    public function index(Request $request)
    {
        $query = EssayQuestion::with(['subjectModel.category'])
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

        $essays = $query->orderByDesc('created_at')->paginate(20);

        return response()->json([
            'data' => $essays->items(),
            'meta' => [
                'current_page' => $essays->currentPage(),
                'last_page'    => $essays->lastPage(),
                'total'        => $essays->total(),
            ],
        ]);
    }

    // GET /api/essays/{id}
    public function show(EssayQuestion $essay)
    {
        if ($essay->status !== 'published') {
            return response()->json(['message' => 'KhÃ´ng tÃ¬m tháº¥y.'], 404);
        }

        return response()->json($this->format($essay, false));
    }

    // POST /api/essays/{id}/unlock-sample
    // Only after user has submitted â€” return the sample answer
    public function unlockSample(EssayQuestion $essay)
    {
        return response()->json([
            'sample_answer' => $essay->sample_answer,
        ]);
    }

    // â”€â”€ Admin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    // GET /api/admin/essays
    public function adminIndex(Request $request)
    {
        $query = EssayQuestion::with(['subjectModel.category']);

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->q . '%')
                  ->orWhere('question', 'like', '%' . $request->q . '%');
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
        $essays = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'data' => $essays->getCollection()->map(fn ($e) => $this->format($e, false)),
            'current_page' => $essays->currentPage(),
            'last_page'    => $essays->lastPage(),
            'total'        => $essays->total(),
            'per_page'     => $essays->perPage(),
        ]);
    }

    // POST /api/admin/essays
    public function store(Request $request)
    {
        $data = $request->validate([
            'subject_id'    => 'nullable|exists:subjects,id',
            'title'         => 'required|string|max:500',
            'chapter'       => 'nullable|string|max:255',
            'question'      => 'nullable|string',
            'hint'          => 'nullable|string',
            'sample_answer' => 'nullable|string',
            'time_limit'    => 'integer|min:10',
            'status'        => 'in:published,draft',
        ]);

        $data['created_by'] = $request->user()->id;
        $essay = EssayQuestion::create($data);

        return response()->json($this->format($essay->load('subjectModel.category'), true), 201);
    }

    // PUT /api/admin/essays/{id}
    public function update(Request $request, EssayQuestion $essay)
    {
        $data = $request->validate([
            'subject_id'    => 'nullable|exists:subjects,id',
            'title'         => 'sometimes|string|max:500',
            'chapter'       => 'nullable|string|max:255',
            'question'      => 'nullable|string',
            'hint'          => 'nullable|string',
            'sample_answer' => 'nullable|string',
            'time_limit'    => 'integer|min:10',
            'status'        => 'in:published,draft',
        ]);

        $essay->update($data);

        return response()->json($this->format($essay->fresh()->load('subjectModel.category'), true));
    }

    // DELETE /api/admin/essays/{id}
    public function destroy(EssayQuestion $essay)
    {
        $essay->delete();

        return response()->json(['message' => 'XÃ³a thÃ nh cÃ´ng.']);
    }

    private function format(EssayQuestion $e, bool $includeSample): array
    {
        $data = [
            'id'         => $e->id,
            'title'      => $e->title,
            'chapter'    => $e->chapter,
            'question'   => $e->question,
            'hint'       => $e->hint,
            'time_limit' => $e->time_limit,
            'difficulty' => $e->difficulty,
            'status'     => $e->status,
            'attempts'   => $e->attempts,
            'subject_model' => $e->subjectModel ? [
                'id'   => $e->subjectModel->id,
                'name' => $e->subjectModel->name,
                'category' => $e->subjectModel->category ? ['id' => $e->subjectModel->category->id, 'name' => $e->subjectModel->category->name] : null,
            ] : null,
        ];

        if ($includeSample) {
            $data['sample_answer'] = $e->sample_answer;
        }

        return $data;
    }
}
