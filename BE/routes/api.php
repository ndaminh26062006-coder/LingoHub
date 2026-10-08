<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EssayController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UsageController;
use App\Http\Controllers\Api\FreemiumController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LeaderboardController;

/*
|--------------------------------------------------------------------------
| LingoHub API Routes
|--------------------------------------------------------------------------
*/

// ── Auth (public) ──────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// ── Auth (protected) ───────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('logout',          [AuthController::class, 'logout']);
    Route::get('me',               [AuthController::class, 'me']);
    Route::put('profile',          [AuthController::class, 'updateProfile']);
    Route::put('password',         [AuthController::class, 'changePassword']);
});

// ── Public API ─────────────────────────────────────────────────────────────
Route::get('categories',          [CategoryController::class,  'index']);
Route::get('categories/{slug}',   [CategoryController::class,  'show']);

// Freemium endpoints (public - pricing, usage stats; check-access supports optional auth)
Route::prefix('freemium')->group(function () {
    Route::post('check-access',      [FreemiumController::class, 'checkAccess'])->middleware('auth:sanctum');
    Route::get('pricing',            [FreemiumController::class, 'getPricing']);
    Route::post('usage-stats',       [FreemiumController::class, 'getUsageStats']);
});

// Sepay payment webhook (public - no auth required)
Route::post('payments/sepay/webhook', [PaymentController::class, 'handleWebhook']);

// Comments stats (public read)
Route::get('comments/{commentableType}/{commentableId}', [CommentController::class, 'index']);
Route::get('likes/stats/{likeableType}/{likeableId}', [LikeController::class, 'stats']);

// Public stats for homepage
Route::get('stats/dashboard', [StatsController::class, 'dashboard']);

// Leaderboard (public read)
Route::get('leaderboard', [LeaderboardController::class, 'index']);

// Môn học (subjects)
Route::get('subjects',            [SubjectController::class,   'index']);
Route::get('subjects/{subject}',  [SubjectController::class,   'show']);

// Tài liệu trắc nghiệm (bảng documents)
Route::get('documents',                      [DocumentController::class, 'index']);
Route::get('documents/{document}',           [DocumentController::class, 'show']);
Route::get('documents/{document}/questions', [DocumentController::class, 'questions']);

// Đề thi thử (bảng exams mới - hiện chưa có data)
Route::get('exams',               [ExamController::class,      'index']);
Route::get('exams/{exam}',        [ExamController::class,      'show']);
Route::get('exams/{exam}/questions', [ExamController::class,   'questions']);

Route::get('essays',              [EssayController::class,     'index']);
Route::get('essays/{essay}',      [EssayController::class,     'show']);

Route::get('flashcards',           [FlashcardController::class, 'index']);
Route::get('flashcards/admin',     [FlashcardController::class, 'adminDecks']);
Route::get('flashcards/community', [FlashcardController::class, 'communityDecks']);

// ── Protected user API ─────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Comments (create/update/delete - protected)
    Route::post('comments', [CommentController::class, 'store']);
    Route::get('comments/{comment}', [CommentController::class, 'show']);
    Route::put('comments/{comment}', [CommentController::class, 'update']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Likes (vote - protected)
    Route::post('likes', [LikeController::class, 'store']);
    Route::delete('likes/{like}', [LikeController::class, 'destroy']);

    // Subscriptions
    Route::prefix('subscriptions')->group(function () {
        Route::get('me',                 [SubscriptionController::class, 'me']);
        Route::post('check-subject',     [SubscriptionController::class, 'checkSubjectAccess']);
        Route::post('update-subjects',   [SubscriptionController::class, 'updateSubjects']);
        Route::get('history',            [SubscriptionController::class, 'history']);
    });

    // Payments
    Route::prefix('payments')->group(function () {
        Route::post('sepay/create',      [PaymentController::class, 'createPayment']);
        Route::get('sepay/status/{reference_code}', [PaymentController::class, 'getPaymentStatus']);
        Route::get('history',            [PaymentController::class, 'getPaymentHistory']);
    });

    // Test webhook (for local development only)
    Route::post('test/webhook',         [PaymentController::class, 'testWebhook']);

    // Freemium usage
    Route::get('usage/check',   [UsageController::class, 'check']);
    Route::post('usage/consume', [UsageController::class, 'consume']);
    Route::post('exams/{exam}/submit',            [ExamController::class,      'submit']);
    Route::post('documents/{document}/submit',    [DocumentController::class,  'submit']);
    Route::post('essays/{essay}/unlock-sample',   [EssayController::class,     'unlockSample']);

    // Dashboard
    Route::get('user/dashboard', [DashboardController::class, 'dashboard']);

    Route::get('flashcards/mine',                 [FlashcardController::class, 'myDecks']);
    Route::get('flashcards/{deck}',               [FlashcardController::class, 'show']);
    Route::post('flashcards',                     [FlashcardController::class, 'store']);
    Route::put('flashcards/{deck}',               [FlashcardController::class, 'update']);
    Route::delete('flashcards/{deck}',            [FlashcardController::class, 'destroy']);
});

// ── Admin API (auth + admin role check) ────────────────────────────────────
Route::middleware(['auth:sanctum', 'superAdmin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('stats',                           [AdminController::class,     'stats']);

    // Users (Super Admin only)
    Route::get('users',                           [AdminController::class,     'users']);
    Route::get('users/{user}',                    [AdminController::class,     'showUser']);
    Route::put('users/{user}',                    [AdminController::class,     'updateUser']);
    Route::put('users/{user}/toggle-block',       [AdminController::class,     'toggleBlock']);
    Route::delete('users/{user}',                 [AdminController::class,     'deleteUser']);

    // Freemium (development only)
    Route::delete('freemium/reset/{device_id}',  [FreemiumController::class,  'resetUsage']);

    // Categories
    Route::post('categories',                     [CategoryController::class,  'store']);
    Route::put('categories/{category}',           [CategoryController::class,  'update']);
    Route::delete('categories/{category}',        [CategoryController::class,  'destroy']);
});

// ── Admin Content Routes (auth + admin or content admin) ──────────────────
Route::middleware(['auth:sanctum', 'contentAdmin'])->prefix('admin')->group(function () {
    // Subjects (admin)
    Route::post('subjects',                           [SubjectController::class,   'store']);
    Route::put('subjects/{subject}',                  [SubjectController::class,   'update']);
    Route::delete('subjects/{subject}',               [SubjectController::class,   'destroy']);

    // Documents (tài liệu trắc nghiệm)
    Route::post('documents',                          [DocumentController::class,  'store']);
    Route::put('documents/{document}',                [DocumentController::class,  'update']);
    Route::delete('documents/{document}',             [DocumentController::class,  'destroy']);
    Route::get('documents/{document}/questions',      [DocumentController::class,  'adminQuestions']);
    Route::post('documents/{document}/questions/bulk',[DocumentController::class,  'bulkStoreQuestions']);

    // Exams (đề thi thử)
    Route::get('exams',                           [ExamController::class,      'adminIndex']);
    Route::post('exams',                          [ExamController::class,      'store']);
    Route::put('exams/{exam}',                    [ExamController::class,      'update']);
    Route::delete('exams/{exam}',                 [ExamController::class,      'destroy']);
    Route::get('exams/{exam}/questions',          [ExamController::class,      'adminQuestions']);
    Route::post('exams/{exam}/questions/bulk',    [ExamController::class,      'bulkStoreQuestions']);
    Route::post('exams/{exam}/questions/import-text', [ExamController::class, 'importQuestionsFromText']);

    // Essays
    Route::get('essays',                          [EssayController::class,     'adminIndex']);
    Route::post('essays',                         [EssayController::class,     'store']);
    Route::put('essays/{essay}',                  [EssayController::class,     'update']);
    Route::delete('essays/{essay}',               [EssayController::class,     'destroy']);

    // Flashcards
    Route::get('flashcards-list',                 [FlashcardController::class, 'adminIndex']);
    Route::put('flashcards/{deck}',               [FlashcardController::class, 'update']);
    Route::delete('flashcards/{deck}',            [FlashcardController::class, 'destroy']);
});
