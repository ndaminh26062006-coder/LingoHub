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
        try {
            // Validate ID is numeric
            if (!is_numeric($likeableId)) {
                return response()->json([
                    'likes' => 0,
                    'dislikes' => 0,
                    'user_like' => null,
                ], 200);
            }
            
            $likeableId = (int)$likeableId;
            
            // Normalize likeable_type to full class namespace
            $typeMap = [
                'Exam' => 'App\\Models\\Exam',
                'Document' => 'App\\Models\\Document',
                'EssayQuestion' => 'App\\Models\\EssayQuestion',
                'FlashcardDeck' => 'App\\Models\\FlashcardDeck',
            ];
            
            $normalizedType = $typeMap[$likeableType] ?? $likeableType;
            
            // Simple query without morphTo
            $likes = Like::where('likeable_type', $normalizedType)
                ->where('likeable_id', $likeableId)
                ->where('is_liked', 1)
                ->count();

            $dislikes = Like::where('likeable_type', $normalizedType)
                ->where('likeable_id', $likeableId)
                ->where('is_liked', 0)
                ->count();

            $userLike = null;
            
            // Get authenticated user
            $authUser = null;
            try {
                if (auth()->check()) {
                    $authUser = auth()->user();
                }
            } catch (\Exception $e) {
                // Continue without user
            }
            
            // Fallback: check token manually
            if (!$authUser && request()->header('Authorization')) {
                try {
                    $token = request()->bearerToken();
                    if ($token) {
                        $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                        if ($personalAccessToken) {
                            $authUser = $personalAccessToken->tokenable;
                        }
                    }
                } catch (\Exception $e) {
                    // Continue
                }
            }
            
            if ($authUser) {
                $userLike = Like::where('likeable_type', $normalizedType)
                    ->where('likeable_id', $likeableId)
                    ->where('user_id', $authUser->id)
                    ->select('id', 'is_liked')
                    ->first();
                    
                if ($userLike) {
                    $userLike = [
                        'id' => $userLike->id,
                        'is_liked' => (bool)$userLike->is_liked
                    ];
                }
            }

            return response()->json([
                'likes' => (int)$likes,
                'dislikes' => (int)$dislikes,
                'user_like' => $userLike,
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('LikeController@stats error', [
                'message' => $e->getMessage(),
                'likeable_type' => $likeableType,
                'likeable_id' => $likeableId,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            
            // Return safe response even if error
            return response()->json([
                'likes' => 0,
                'dislikes' => 0,
                'user_like' => null,
            ], 200);
        }
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
        
        // Normalize likeable_type to full class namespace
        $typeMap = [
            'Exam' => 'App\\Models\\Exam',
            'Document' => 'App\\Models\\Document',
            'EssayQuestion' => 'App\\Models\\EssayQuestion',
            'FlashcardDeck' => 'App\\Models\\FlashcardDeck',
        ];
        
        $normalizedType = $typeMap[$likeableType] ?? $likeableType;

        // Check if user already has a like/dislike for this item
        $existingLike = Like::where('likeable_type', $normalizedType)
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
                
                // Get updated counts
                $likes = Like::where('likeable_type', $normalizedType)
                    ->where('likeable_id', $likeableId)
                    ->where('is_liked', true)
                    ->count();
                
                $dislikes = Like::where('likeable_type', $normalizedType)
                    ->where('likeable_id', $likeableId)
                    ->where('is_liked', false)
                    ->count();
                
                return response()->json([
                    'message' => 'Vote updated',
                    'voted' => true,
                    'user_like' => ['id' => $existingLike->id, 'is_liked' => $isLiked],
                    'stats' => [
                        'likes' => $likes,
                        'dislikes' => $dislikes,
                    ]
                ], 200);
            }
        }

        // Create new like/dislike
        $like = Like::create([
            'user_id' => auth()->id(),
            'likeable_type' => $normalizedType,
            'likeable_id' => $likeableId,
            'is_liked' => $isLiked,
        ]);

        // Get updated counts
        $likes = Like::where('likeable_type', $normalizedType)
            ->where('likeable_id', $likeableId)
            ->where('is_liked', true)
            ->count();
        
        $dislikes = Like::where('likeable_type', $normalizedType)
            ->where('likeable_id', $likeableId)
            ->where('is_liked', false)
            ->count();

        return response()->json([
            'message' => 'Vote created',
            'voted' => true,
            'user_like' => ['id' => $like->id, 'is_liked' => $like->is_liked],
            'stats' => [
                'likes' => $likes,
                'dislikes' => $dislikes,
            ]
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

        $likeableType = $like->likeable_type;
        $likeableId = $like->likeable_id;
        $like->delete();

        // Get updated counts
        $likes = Like::where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->where('is_liked', true)
            ->count();
        
        $dislikes = Like::where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->where('is_liked', false)
            ->count();

        return response()->json([
            'message' => 'Vote removed',
            'voted' => false,
            'user_like' => null,
            'stats' => [
                'likes' => $likes,
                'dislikes' => $dislikes,
            ]
        ]);
    }
}
