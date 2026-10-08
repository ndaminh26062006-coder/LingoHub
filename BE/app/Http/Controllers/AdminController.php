<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Exam;
use App\Models\Category;
use App\Models\EssayQuestion;
use App\Models\FlashcardDeck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // GET /api/admin/stats
    public function stats()
    {
        // Gather activity statistics
        $recentUsers = User::where('role', 'student')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'school' => $user->school ?? 'Chưa cập nhật',
                    'joined' => $user->created_at->diffForHumans(),
                    'active' => $user->status === 'active',
                ];
            });

        // Get exam activity by day of week
        $examActivity = Exam::select(
                DB::raw('DAYOFWEEK(created_at) as day_num'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy(DB::raw('DAYOFWEEK(created_at)'))
            ->orderBy(DB::raw('DAYOFWEEK(created_at)'))
            ->get();

        // Build week template (Sunday=1, Monday=2, ..., Saturday=7)
        $dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']; // index 0=Sunday
        $examActivityByDay = array_map(function ($i) use ($dayNames) {
            return ['day' => $dayNames[$i], 'count' => 0];
        }, range(0, 6));

        // Fill in actual data
        foreach ($examActivity as $activity) {
            $dayIndex = (int)$activity->day_num - 1; // Convert 1-based to 0-based
            if (isset($examActivityByDay[$dayIndex])) {
                $examActivityByDay[$dayIndex]['count'] = (int)$activity->count;
            }
        }

        return response()->json([
            'users'        => User::count(),
            'students'     => User::where('role', 'student')->count(),
            'active_users' => User::where('status', 'active')->count(),
            'exams'        => Exam::count(),
            'published_exams' => Exam::where('status', 'published')->count(),
            'essays'       => EssayQuestion::count(),
            'flashcard_decks' => FlashcardDeck::count(),
            'categories'   => Category::count(),
            'total_attempts' => (int)(Exam::sum('attempts') ?? 0),
            'recent_users' => $recentUsers,
            'exam_activity' => $examActivityByDay,
        ]);
    }

    // GET /api/admin/users
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->q . '%')
                  ->orWhere('email', 'like', '%' . $request->q . '%');
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->orderByDesc('created_at')->paginate(20);

        // Enrich each user with stats
        $enriched = $users->items();
        foreach ($enriched as $user) {
            // Count completed exams
            $user->exams = \App\Models\UserExamSubmission::where('user_id', $user->id)->count();
            
            // Get streak info
            $streak = \App\Models\UserLearningStreak::where('user_id', $user->id)->first();
            $user->streak = $streak ? $streak->current_streak_days : 0;
        }

        return response()->json([
            'data' => $enriched,
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
            ],
        ]);
    }

    // GET /api/admin/users/{id}
    public function showUser(User $user)
    {
        return response()->json($user);
    }

    // PUT /api/admin/users/{id}/toggle-block
    public function toggleBlock(User $user)
    {
        // Prevent blocking admins
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Không thể khóa tài khoản admin.'], 403);
        }

        $user->update([
            'status' => $user->status === 'active' ? 'blocked' : 'active',
        ]);

        return response()->json([
            'id'     => $user->id,
            'status' => $user->fresh()->status,
        ]);
    }

    // PUT /api/admin/users/{id}
    public function updateUser(Request $request, User $user)
    {
        $data = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'role'       => 'sometimes|in:student,admin',
            'admin_role' => 'nullable|in:super,content',
            'status'     => 'sometimes|in:active,blocked',
            'school'     => 'nullable|string',
            'major'      => 'nullable|string',
        ]);

        // If changing to admin, set default admin_role to 'super' if not provided
        if ($request->filled('role') && $data['role'] === 'admin') {
            if (! $request->filled('admin_role')) {
                $data['admin_role'] = 'super'; // Default to super admin
            }
        }

        // If changing from admin to student, clear admin_role
        if ($request->filled('role') && $data['role'] === 'student') {
            $data['admin_role'] = null;
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    // DELETE /api/admin/users/{id}
    public function deleteUser(User $user)
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Không thể xóa tài khoản admin.'], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Xóa thành công.']);
    }
}
