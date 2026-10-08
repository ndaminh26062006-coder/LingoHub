<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Category;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    // GET /api/subjects — tất cả môn học active
    public function index(Request $request)
    {
        $query = Subject::with('category')->where('status', 'active');

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) =>
                $q->where('slug', $request->category)
                  ->orWhere('id', $request->category)
            );
        }

        $subjects = $query->orderBy('order')->orderBy('name')->get()
            ->map(fn ($s) => $this->format($s));

        return response()->json($subjects);
    }

    // GET /api/subjects/{id}
    public function show(Subject $subject)
    {
        return response()->json($this->format($subject->load('category')));
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    // POST /api/admin/subjects
    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|unique:subjects',
            'icon'        => 'nullable|string',
            'description' => 'nullable|string',
            'status'      => 'in:active,draft',
            'order'       => 'nullable|integer',
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = $this->makeSlug($data['name']);
        }

        $subject = Subject::create($data);
        return response()->json($this->format($subject->load('category')), 201);
    }

    // PUT /api/admin/subjects/{id}
    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'icon'        => 'nullable|string',
            'description' => 'nullable|string',
            'status'      => 'in:active,draft',
            'order'       => 'nullable|integer',
        ]);

        $subject->update($data);
        return response()->json($this->format($subject->fresh()->load('category')));
    }

    // DELETE /api/admin/subjects/{id}
    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Xóa thành công.']);
    }

    private function format(Subject $s): array
    {
        return [
            'id'          => $s->id,
            'name'        => $s->name,
            'slug'        => $s->slug,
            'icon'        => $s->icon,
            'description' => $s->description,
            'status'      => $s->status,
            'order'       => $s->order,
            'category_id' => $s->category_id,
            'category'    => $s->category ? [
                'id'   => $s->category->id,
                'name' => $s->category->name,
                'slug' => $s->category->slug,
                'icon' => $s->category->icon,
                'color'=> $s->category->color,
            ] : null,
            'documents_count' => $s->documents_count ?? null,
        ];
    }

    private function makeSlug(string $name): string
    {
        return str()->slug($name) ?: 'subject-' . time();
    }
}
