<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LikeController extends Controller
{
    /**
     * Get likes/dislikes count for an item
     * 
     * GET /api/likes/stats/{likeable_type}/{likeable_id}
     */
    public function stats($likeableType, $likeableId): JsonResponse
    {
        $likes = Like::where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->where('is_liked', true)
            ->count();

        $dislikes = Like::where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->where('is_liked', false)
            ->count();

        $userLike = null;
        if (auth()->check()) {
            $userLike = Like::where('likeable_type', $likeableType)
                ->where('likeable_id', $likeableId)
                ->where('user_id', auth()->id())
                ->first();
        }

        return response()->json([
            'likes' => $likes,
            'dislikes' => $dislikes,
            'user_like' => $userLike ? ['id' => $userLike->id, 'is_liked' => $userLike->is_liked] : null,
        ]);
    }

    /**
     * Like or dislike an item
     * 
     * POST /api/likes
     * Body: {
     *   "likeable_type": "Document|Exam|EssayQuestion|FlashcardDeck",
     *   "likeable_id": 1,
     *   "is_liked": true (true for like, false for dislike)
     * }
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'likeable_type' => 'required|in:Document,Exam,EssayQuestion,FlashcardDeck',
            'likeable_id' => 'required|integer|min:1',
            'is_liked' => 'required|boolean',
        ]);

        $likeableType = $request->input('likeable_type');
        $likeableId = $request->input('likeable_id');
        $isLiked = $request->input('is_liked');

        // Check if user already has a like/dislike for this item
        $existingLike = Like::where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingLike) {
            // Update existing
            if ($existingLike->is_liked === $isLiked) {
                // Same vote - remove it (toggle off)
                $existingLike->delete();
                return response()->json(['message' => 'Vote removed', 'voted' => false], 200);
            } else {
                // Different vote - update it (change from like to dislike or vice versa)
                $existingLike->update(['is_liked' => $isLiked]);
                return response()->json([
                    'message' => 'Vote updated',
                    'voted' => true,
                    'is_liked' => $isLiked
                ], 200);
            }
        }

        // Create new like/dislike
        $like = Like::create([
            'user_id' => auth()->id(),
            'likeable_type' => $likeableType,
            'likeable_id' => $likeableId,
            'is_liked' => $isLiked,
        ]);

        return response()->json([
            'message' => 'Vote created',
            'voted' => true,
            'is_liked' => $isLiked,
            'id' => $like->id
        ], 201);
    }

    /**
     * Remove a like/dislike
     * 
     * DELETE /api/likes/{id}
     */
    public function destroy(Like $like): JsonResponse
    {
        // Check ownership
        if ($like->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $like->delete();

        return response()->json(['message' => 'Vote removed']);
    }
}
