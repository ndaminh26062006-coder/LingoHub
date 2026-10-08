<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        $categories = Category::where('status', 'active')
            ->orderBy('order')
            ->get()
            ->map(fn ($c) => $this->format($c));

        return response()->json($categories);
    }

    // GET /api/categories/{slug}
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->firstOrFail();

        return response()->json($this->format($category));
    }

    // POST /api/admin/categories
    public function store(Request $request)
    {
        $data = $request->validate([
            'slug'        => 'required|string|unique:categories',
            'name'        => 'required|string|max:255',
            'icon'        => 'nullable|string',
            'color'       => 'nullable|string',
            'description' => 'nullable|string',
            'status'      => 'in:active,draft',
            'order'       => 'nullable|integer',
        ]);

        $category = Category::create($data);

        return response()->json($this->format($category), 201);
    }

    // PUT /api/admin/categories/{id}
    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'icon'        => 'nullable|string',
            'color'       => 'nullable|string',
            'description' => 'nullable|string',
            'status'      => 'in:active,draft',
            'order'       => 'nullable|integer',
        ]);

        $category->update($data);

        return response()->json($this->format($category->fresh()));
    }

    // DELETE /api/admin/categories/{id}
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Xóa thành công.']);
    }

    private function format(Category $c): array
    {
        return [
            'id'          => $c->id,
            'slug'        => $c->slug,
            'name'        => $c->name,
            'icon'        => $c->icon,
            'color'       => $c->color,
            'description' => $c->description,
            'status'      => $c->status,
            'order'       => $c->order,
        ];
    }
}
