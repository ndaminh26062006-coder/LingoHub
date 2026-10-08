<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UsageController extends Controller
{
    /**
     * GET /api/usage/check
     * Returns current free_uses count for the authenticated user.
     */
    public function check(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'free_uses' => $user->free_uses,
            'has_free'  => $user->free_uses > 0,
        ]);
    }

    /**
     * POST /api/usage/consume
     * Decrements free_uses by 1 if user still has free quota.
     * Returns updated count.
     * Admin users are never charged.
     */
    public function consume(Request $request)
    {
        $user = $request->user();

        // Admins have unlimited access
        if ($user->isAdmin()) {
            return response()->json([
                'free_uses'  => 999,
                'has_free'   => true,
                'consumed'   => false,
            ]);
        }

        if ($user->free_uses <= 0) {
            return response()->json([
                'free_uses' => 0,
                'has_free'  => false,
                'consumed'  => false,
                'paywall'   => true,
            ], 402); // 402 Payment Required
        }

        $user->decrement('free_uses');

        return response()->json([
            'free_uses' => $user->free_uses,
            'has_free'  => $user->free_uses > 0,
            'consumed'  => true,
        ]);
    }
}
