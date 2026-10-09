<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreemiumUsage;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FreemiumController extends Controller
{
    private const FREE_LIMIT = 2;

    /**
     * Check if user can access feature (freemium or subscription)
     * 
     * POST /api/freemium/check-access
     * Body: {
     *   "feature": "essay|exam|document|flashcard",
     *   "exam_id": 1 (optional, for exams),
     *   "subject_id": 1 (optional, for exams),
     *   "device_id": "fingerprint-hash",
     * }
     */
    public function checkAccess(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'feature' => 'required|in:essay,exam,document,flashcard',
                'device_id' => 'required|string|max:255',
                'exam_id' => 'nullable|integer',
                'subject_id' => 'nullable|integer',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors(),
                'message' => 'Invalid request parameters',
            ], 400);
        }

        $feature = $request->input('feature');
        $deviceId = $request->input('device_id');
        $userId = auth()->id();
        $ipAddress = $this->getClientIp($request);
        $authHeader = $request->header('Authorization');

        \Log::info('FreemiumController::checkAccess called', [
            'feature' => $feature,
            'user_id' => $userId,
            'device_id' => $deviceId,
            'ip' => $ipAddress,
            'auth_header_present' => !!$authHeader,
            'authenticated' => auth()->check(),
        ]);

        // ── EXAMS: New logic with attempt tracking ──────────────────────────
        if ($feature === 'exam') {
            $examId = $request->input('exam_id');
            $subjectId = $request->input('subject_id');

            if (!$examId || !$subjectId) {
                return response()->json(['error' => 'exam_id and subject_id required for exams'], 400);
            }

            // 1. Check subscription first
            if ($userId) {
                $subscription = \App\Models\Subscription::where('user_id', $userId)
                    ->where('is_active', true)
                    ->where('valid_until', '>=', now()->toDateString())
                    ->first();

                if ($subscription) {
                    // Check if subscription includes this subject
                    $subjects = $subscription->subjects ?? [];
                    if ($subscription->plan === 'full' || in_array($subjectId, $subjects)) {
                        return $this->successResponse([
                            'can_access' => true,
                            'reason' => 'subscription',
                            'message' => 'Full access via subscription',
                        ]);
                    }
                }
            }

            // 2. Check free attempts (3 per subject)
            if ($userId) {
                $attemptCount = \App\Models\UserExamAttempt::where('user_id', $userId)
                    ->where('subject_id', $subjectId)
                    ->count();

                if ($attemptCount < 3) {
                    return $this->successResponse([
                        'can_access' => true,
                        'reason' => 'free_exam_attempts',
                        'message' => "Free exam attempt " . ($attemptCount + 1) . " of 3",
                        'attempts_used' => $attemptCount,
                        'attempts_remaining' => 3 - $attemptCount,
                    ]);
                }
            }

            // 3. No access - show paywall
            return $this->denyAccessWithPricing([
                'can_access' => false,
                'reason' => 'exam_limit_exceeded',
                'message' => 'Bạn đã dùng 3 lần làm đề free. Mua gói để tiếp tục.',
            ]);
        }

        // ── OTHER FEATURES: Essays, Documents, Flashcards = Always FREE ──────
        if (in_array($feature, ['essay', 'document', 'flashcard'])) {
            return $this->successResponse([
                'can_access' => true,
                'reason' => 'always_free',
                'message' => 'Full free access to ' . $feature,
            ]);
        }

        // Fallback
        return $this->denyAccessWithPricing([
            'can_access' => false,
            'reason' => 'unknown',
            'message' => 'Unable to determine access',
        ]);
    }

    /**
     * Get pricing tiers for paywall modal
     * GET /api/freemium/pricing
     */
    public function getPricing(): JsonResponse
    {
        $pricing = [
            [
                'id' => '1subject',
                'name' => '1 Môn Lẻ',
                'price' => 19000,
                'currency' => 'VND',
                'duration' => 'Vĩnh viễn',
                'features' => ['1 môn học tự chọn', '✓ Xem Flashcard không giới hạn'],
                'popular' => false,
            ],
            [
                'id' => '3subject',
                'name' => '3 Môn Lẻ',
                'price' => 39000,
                'currency' => 'VND',
                'duration' => 'Vĩnh viễn',
                'features' => ['3 môn học tự chọn', '✓ Xem Flashcard không giới hạn'],
                'popular' => false,
            ],
            [
                'id' => '5subject',
                'name' => '5 Môn Lẻ',
                'price' => 49000,
                'currency' => 'VND',
                'duration' => 'Vĩnh viễn',
                'features' => ['5 môn học tự chọn', '✓ Xem Flashcard không giới hạn'],
                'popular' => false,
            ],
            [
                'id' => 'full',
                'name' => 'Full Access',
                'price' => 69000,
                'currency' => 'VND',
                'duration' => 'Vĩnh viễn',
                'features' => ['Tất cả môn học', '✓ Xem Flashcard không giới hạn', '✓ Nâng cấp miễn phí'],
                'popular' => true,
            ],
        ];

        return response()->json($pricing);
    }

    /**
     * Get usage stats for current device
     * POST /api/freemium/usage-stats
     * Body: {
     *   "device_id": "fingerprint-hash"
     * }
     */
    public function getUsageStats(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|string|max:255',
        ]);

        $deviceId = $request->input('device_id');
        $ipAddress = $this->getClientIp($request);

        $stats = [];
        $features = ['essay', 'exam', 'document', 'flashcard'];

        foreach ($features as $feature) {
            $usage = FreemiumUsage::where('ip_address', $ipAddress)
                ->where('device_id', $deviceId)
                ->where('feature', $feature)
                ->first();

            $stats[$feature] = [
                'used_count' => $usage?->used_count ?? 0,
                'limit' => self::FREE_LIMIT,
                'remaining' => max(0, self::FREE_LIMIT - ($usage?->used_count ?? 0)),
                'is_exceeded' => ($usage?->used_count ?? 0) >= self::FREE_LIMIT,
            ];
        }

        return response()->json([
            'device_id' => $deviceId,
            'ip_address' => $ipAddress,
            'stats' => $stats,
        ]);
    }

    /**
     * Reset usage for admin (development only)
     * DELETE /api/freemium/reset/{device_id}
     */
    public function resetUsage($deviceId): JsonResponse
    {
        // Only allow in development
        if (app()->environment('production')) {
            return response()->json(['error' => 'Not available in production'], 403);
        }

        $ipAddress = request()->getClientIp();

        FreemiumUsage::where('ip_address', $ipAddress)
            ->where('device_id', $deviceId)
            ->delete();

        return response()->json([
            'message' => 'Usage reset successfully',
            'device_id' => $deviceId,
        ]);
    }

    /**
     * Get client IP address (handles proxies)
     */
    private function getClientIp(Request $request): string
    {
        if (!empty($request->server('HTTP_CF_CONNECTING_IP'))) {
            return $request->server('HTTP_CF_CONNECTING_IP');
        } elseif (!empty($request->server('HTTP_X_FORWARDED_FOR'))) {
            $ips = explode(',', $request->server('HTTP_X_FORWARDED_FOR'));
            return trim($ips[0]);
        }
        
        return $request->ip();
    }

    /**
     * Success response helper
     */
    private function successResponse(array $data): JsonResponse
    {
        return response()->json($data, 200);
    }

    /**
     * Deny access with pricing info
     */
    private function denyAccessWithPricing(array $data): JsonResponse
    {
        $data['pricing'] = [
            [
                'id' => '1subject',
                'name' => '1 Môn Lẻ',
                'price' => 19000,
            ],
            [
                'id' => '3subject',
                'name' => '3 Môn Lẻ',
                'price' => 39000,
            ],
            [
                'id' => '5subject',
                'name' => '5 Môn Lẻ',
                'price' => 49000,
            ],
            [
                'id' => 'full',
                'name' => 'Full Access',
                'price' => 69000,
            ],
        ];

        return response()->json($data, 403);
    }
}
