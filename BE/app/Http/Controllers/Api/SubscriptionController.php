<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    /**
     * Get current user's subscription
     * GET /api/subscriptions/me
     */
    public function me(): JsonResponse
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        \Log::info('SubscriptionController::me() called for user', ['user_id' => $user->id, 'email' => $user->email]);

        $subscription = $user->subscription()->first();

        \Log::info('Subscription query result', ['subscription' => $subscription, 'user_id' => $user->id]);

        if (!$subscription) {
            \Log::info('No subscription found for user', ['user_id' => $user->id]);
            return response()->json([
                'has_subscription' => false,
                'subscription' => null,
            ]);
        }

        if (!$subscription->isValid()) {
            \Log::info('Subscription expired for user', ['user_id' => $user->id, 'valid_until' => $subscription->valid_until]);
            return response()->json([
                'has_subscription' => false,
                'subscription' => null,
                'message' => 'Subscription expired',
            ]);
        }

        $response = [
            'has_subscription' => true,
            'subscription' => [
                'id' => $subscription->id,
                'plan' => $subscription->plan,
                'plan_display' => $subscription->getPlanDisplay(),
                'price' => $subscription->price,
                'subjects' => $subscription->subjects,
                'valid_from' => $subscription->valid_from->toDateString(),
                'valid_until' => $subscription->valid_until->toDateString(),
                'days_remaining' => $subscription->getDaysRemaining(),
                'can_access_all' => $subscription->plan === 'full',
            ],
        ];

        \Log::info('Returning subscription response', $response);

        return response()->json($response);
    }

    /**
     * Check if user has access to specific subject
     * POST /api/subscriptions/check-subject
     * Body: {
     *   "subject_id": 1
     * }
     */
    public function checkSubjectAccess(Request $request): JsonResponse
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $user = auth()->user();
        $subjectId = $request->input('subject_id');

        if (!$user) {
            return response()->json([
                'has_access' => false,
                'reason' => 'not_authenticated',
            ]);
        }

        $subscription = $user->subscription()->first();

        if (!$subscription || !$subscription->isValid()) {
            return response()->json([
                'has_access' => false,
                'reason' => 'no_subscription',
            ]);
        }

        $hasAccess = $subscription->hasSubject($subjectId);

        return response()->json([
            'has_access' => $hasAccess,
            'reason' => $hasAccess ? 'subscription' : 'subject_not_included',
            'plan' => $subscription->getPlanDisplay(),
        ]);
    }

    /**
     * Update subscription subjects
     * POST /api/subscriptions/update-subjects
     * Body: {
     *   "subjects": [1, 2, 3]
     * }
     */
    public function updateSubjects(Request $request): JsonResponse
    {
        $request->validate([
            'subjects' => 'required|array',
            'subjects.*' => 'exists:subjects,id',
        ]);

        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $subscription = $user->subscription()->where('is_active', true)->first();

        if (!$subscription) {
            return response()->json(['error' => 'No active subscription found'], 404);
        }

        // Update subjects
        $subscription->update([
            'subjects' => $request->input('subjects'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subjects updated successfully',
            'subjects' => $subscription->subjects,
        ]);
    }

    /**
     * Get all user subscriptions (history)
     * GET /api/subscriptions/history
     */
    public function history(): JsonResponse
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $subscriptions = $user->subscription()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'plan' => $sub->getPlanDisplay(),
                    'price' => $sub->price,
                    'valid_from' => $sub->valid_from->toDateString(),
                    'valid_until' => $sub->valid_until->toDateString(),
                    'is_active' => $sub->is_active,
                    'is_valid' => $sub->isValid(),
                ];
            });

        return response()->json([
            'total' => count($subscriptions),
            'subscriptions' => $subscriptions,
        ]);
    }
}
