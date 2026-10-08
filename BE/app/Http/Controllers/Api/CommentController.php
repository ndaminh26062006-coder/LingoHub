<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * Get comments for an item (document, exam, essay, flashcard)
     * 
     * GET /api/comments/{commentable_type}/{commentable_id}
     */
    public function index($commentableType, $commentableId): JsonResponse
    {
        $comments = Comment::where('commentable_type', $commentableType)
            ->where('commentable_id', $commentableId)
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Create a new comment (require authentication)
     * 
     * POST /api/comments
     * Body: {
     *   "commentable_type": "Document|Exam|EssayQuestion|FlashcardDeck",
     *   "commentable_id": 1,
     *   "content": "Great material!"
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'commentable_type' => 'required|in:Document,Exam,EssayQuestion,FlashcardDeck',
            'commentable_id' => 'required|integer|min:1',
            'content' => 'required|string|min:1|max:5000',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'commentable_type' => $request->input('commentable_type'),
            'commentable_id' => $request->input('commentable_id'),
            'content' => $request->input('content'),
        ]);

        $comment->load('user:id,name,email');

        return response()->json($comment, 201);
    }

    /**
     * Get a single comment
     * 
     * GET /api/comments/{id}
     */
    public function show(Comment $comment): JsonResponse
    {
        $comment->load('user:id,name,email');
        return response()->json($comment);
    }

    /**
     * Update a comment (only owner or admin)
     * 
     * PUT /api/comments/{id}
     * Body: { "content": "Updated comment" }
     */
    public function update(Request $request, Comment $comment): JsonResponse
    {
        // Check ownership
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string|min:1|max:5000',
        ]);

        $comment->update([
            'content' => $request->input('content'),
        ]);

        $comment->load('user:id,name,email');

        return response()->json($comment);
    }

    /**
     * Delete a comment (only owner or admin)
     * 
     * DELETE /api/comments/{id}
     */
    public function destroy(Comment $comment): JsonResponse
    {
        // Check ownership
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
