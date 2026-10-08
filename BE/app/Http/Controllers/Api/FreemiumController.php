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
     *   "device_id": "fingerprint-hash",
     *   "user_id": 1 (optional, if logged in)
     * }
     */
    public function checkAccess(Request $request): JsonResponse
    {
        $request->validate([
            'feature' => 'required|in:essay,exam,document,flashcard',
            'device_id' => 'required|string|max:255',
        ]);

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

        // 1. Check if user has active subscription
        if ($userId) {
            $subscription = Subscription::where('user_id', $userId)
                ->where('is_active', true)
                ->where('valid_until', '>=', now()->toDateString())
                ->first();

            \Log::info('Subscription check result', [
                'user_id' => $userId,
                'has_subscription' => !!$subscription,
                'subscription' => $subscription ? ['id' => $subscription->id, 'plan' => $subscription->plan] : null,
            ]);

            if ($subscription) {
                \Log::info('User has active subscription - granting access', [
                    'user_id' => $userId,
                    'plan' => $subscription->plan,
                ]);
                return $this->successResponse([
                    'can_access' => true,
                    'reason' => 'subscription',
                    'message' => 'Access granted via subscription',
                    'subscription' => [
                        'plan' => $subscription->getPlanDisplay(),
                        'valid_until' => $subscription->valid_until->toDateString(),
                    ],
                ]);
            }
        }

        // 2. Check freemium usage (IP + Device) - only if no subscription
        $usage = FreemiumUsage::getOrCreate($ipAddress, $deviceId, $feature);

        \Log::info('Freemium usage check', [
            'device_id' => $deviceId,
            'feature' => $feature,
            'used_count' => $usage->used_count,
            'limit' => self::FREE_LIMIT,
            'has_remaining' => $usage->hasRemainingUses(self::FREE_LIMIT),
        ]);

        if ($usage->hasRemainingUses(self::FREE_LIMIT)) {
            // Increment usage
            $usage->incrementUsage();

            \Log::info('Freemium access granted', [
                'feature' => $feature,
                'used_count' => $usage->used_count,
                'limit' => self::FREE_LIMIT,
            ]);

            return $this->successResponse([
                'can_access' => true,
                'reason' => 'freemium',
                'message' => "Free use {$usage->used_count} of " . self::FREE_LIMIT,
                'remaining_uses' => self::FREE_LIMIT - $usage->used_count,
            ]);
        }

        // 3. No access - show pricing modal
        \Log::info('Freemium access denied - limit exceeded', [
            'feature' => $feature,
            'used_count' => $usage->used_count,
            'limit' => self::FREE_LIMIT,
        ]);

        return $this->denyAccessWithPricing([
            'can_access' => false,
            'reason' => 'limit_exceeded',
            'message' => 'You have used all free attempts. Please subscribe to continue.',
            'used_count' => $usage->used_count,
            'limit' => self::FREE_LIMIT,
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
