<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use App\Models\Subscription;
use App\Services\SepayService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PaymentController extends Controller
{
    private const SEPAY_ENDPOINT = 'https://api.sepay.vn/v2';

    /**
     * Create payment transaction via Sepay
     * POST /api/payments/sepay/create
     * Body: {
     *   "plan": "1month|3month|5month|full",
     *   "subjects": [1, 2, 3] (optional if plan=full)
     * }
     */
    public function createPayment(Request $request): JsonResponse
    {
        $request->validate([
            'plan' => 'required|in:1subject,3subject,5subject,full',
            'subjects' => 'nullable|array',
            'subjects.*' => 'integer|exists:subjects,id',
        ]);

        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $selectedPlan = $request->input('plan');
        $selectedSubjects = $request->input('subjects') ?? [];
        
        // Validate: non-full plans MUST have at least one subject
        if ($selectedPlan !== 'full' && empty($selectedSubjects)) {
            return response()->json([
                'error' => 'Subjects required',
                'message' => 'Vui lòng chọn ít nhất một môn học'
            ], 422);
        }
        
        // Keep the selected plan
        $plan = $selectedPlan;

        // Get pricing based on selected plan
        $pricing = $this->getPricing($selectedPlan);
        if (!$pricing) {
            return response()->json(['error' => 'Invalid plan'], 422);
        }

        // Check for existing pending payment
        $existingPayment = PaymentTransaction::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existingPayment) {
            // Check if expired (15 minutes)
            if ($existingPayment->created_at && $existingPayment->created_at->addMinutes(15)->lessThan(now())) {
                // Mark as expired
                $existingPayment->update(['status' => 'expired']);
            } else {
                // Reuse existing payment but update amount + subjects
                $existingPayment->update([
                    'amount' => $pricing['amount'], 
                    'plan' => $plan,
                    'subjects' => $selectedSubjects  // ← Store subjects!
                ]);
                
                $qrUrl = $this->generateSepayQRUrl(
                    $pricing['amount'],
                    $existingPayment->reference_code
                );

                return response()->json([
                    'success' => true,
                    'transaction_id' => $existingPayment->id,
                    'reference_code' => $existingPayment->reference_code,
                    'amount' => $pricing['amount'],
                    'plan' => $plan,
                    'subjects' => $selectedSubjects,  // ← Return subjects!
                    'checkout_url' => $qrUrl,
                    'bank_account' => env('SEPAY_BANK_ACCOUNT'),
                    'account_name' => env('SEPAY_ACCOUNT_NAME'),
                ]);
            }
        }

        // Create new payment transaction
        // Reference code format: LH + random alphanumeric (matches what Sepay returns)
        $referenceCode = 'LH' . Str::random(15);

        $transaction = PaymentTransaction::create([
            'user_id' => $user->id,
            'reference_code' => $referenceCode,
            'amount' => $pricing['amount'],
            'plan' => $plan,
            'subjects' => $selectedSubjects,  // ← Store subjects from request!
            'status' => 'pending',
        ]);

        // Generate Sepay QR
        $qrUrl = $this->generateSepayQRUrl($pricing['amount'], $referenceCode);

        return response()->json([
            'success' => true,
            'transaction_id' => $transaction->id,
            'reference_code' => $referenceCode,
            'amount' => $pricing['amount'],
            'plan' => $plan,
            'subjects' => $selectedSubjects,  // ← Return subjects in response!
            'checkout_url' => $qrUrl,
            'bank_account' => env('SEPAY_BANK_ACCOUNT'),
            'account_name' => env('SEPAY_ACCOUNT_NAME'),
        ]);
    }

    /**
     * Handle Sepay webhook callback
     * POST /api/payments/sepay/webhook
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        $payload = $request->json()->all();
        
        \Log::info('Webhook received - full payload', $payload);

        // Verify webhook signature (skip in development)
        if (!app()->environment('local')) {
            $signature = $request->header('X-Sepay-Signature');
            $body = $request->getContent();

            if (!$this->verifyWebhookSignature($signature, $body)) {
                return response()->json(['error' => 'Invalid signature'], 401);
            }
        }

        // Extract reference code from Sepay webhook
        // Sepay can send it in different fields:
        // 1. content: "LH35uKoq2bPyf38V FT26281611216785 k2PGL3WN/360114"
        // 2. description: "BankAPINotify LH35uKoq2bPyf38V ..."
        // 3. referenceCode: "FT26281305761290"
        
        $refCode = null;
        $description = $payload['description'] ?? '';
        $content = $payload['content'] ?? '';
        
        // Try content field first (most reliable for our use case)
        // Match: LH followed by any alphanumeric characters (stops at space)
        if ($content && preg_match('/\b(LH[A-Za-z0-9]*?)\b/', $content, $matches)) {
            $refCode = $matches[1];
            \Log::info('Extracted reference code from content field', ['refCode' => $refCode, 'content' => $content]);
        }
        
        // If not found, try description field
        if (!$refCode && $description && preg_match('/\b(LH[A-Za-z0-9]*?)\b/', $description, $matches)) {
            $refCode = $matches[1];
            \Log::info('Extracted reference code from description field', ['refCode' => $refCode, 'description' => $description]);
        }
        
        // Last resort: use provided reference code
        if (!$refCode) {
            $refCode = $payload['reference_code'] ?? null;
        }

        // Find transaction by reference code
        $transaction = PaymentTransaction::where('reference_code', $refCode)
            ->first();

        if (!$transaction) {
            \Log::warning('Webhook: Transaction not found', ['reference_code' => $refCode, 'raw_description' => $description]);
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        \Log::info('Webhook: Transaction found', ['reference_code' => $refCode, 'transaction_id' => $transaction->id]);

        // Update transaction status based on Sepay response
        // Sepay indicates success by providing transactionDate field
        $hasTransactionDate = !empty($payload['transactionDate']) || !empty($payload['transaction_date']);
        $isSuccess = $hasTransactionDate || ($payload['status'] ?? null) === 'success';
        
        if ($isSuccess) {
            $transaction->markSuccess($payload);
            $this->createSubscription($transaction);
            
            \Log::info('Webhook: Payment successful', ['transaction_id' => $transaction->id, 'payload' => $payload]);
            return response()->json(['success' => true, 'message' => 'Payment successful']);
        }
        
        // Check for explicit failure
        if (($payload['status'] ?? null) === 'failed') {
            $transaction->markFailed($payload);
            
            \Log::info('Webhook: Payment failed', ['transaction_id' => $transaction->id]);
            return response()->json(['success' => false, 'message' => 'Payment failed']);
        }

        // If neither success nor failure indicators, still mark as success if transaction came through
        // (Sepay sends webhook only after successful transfer)
        $transaction->markSuccess($payload);
        $this->createSubscription($transaction);
        
        \Log::info('Webhook: Payment successful (implicit)', ['transaction_id' => $transaction->id]);
        return response()->json(['success' => true, 'message' => 'Payment recorded']);
    }

    /**
     * Get payment status
     * GET /api/payments/sepay/status/{reference_code}
     */
    public function getPaymentStatus($referenceCode): JsonResponse
    {
        $transaction = PaymentTransaction::where('reference_code', $referenceCode)
            ->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        return response()->json([
            'reference_code' => $referenceCode,
            'status' => $transaction->status,
            'amount' => $transaction->amount,
            'plan' => $transaction->plan,
            'plan_name' => self::getPlanName($transaction->plan),
            'created_at' => $transaction->created_at->toIso8601String(),
            'updated_at' => $transaction->updated_at->toIso8601String(),
        ]);
    }

    /**
     * Manual webhook trigger for local testing
     * POST /api/test/webhook
     * Body: {"reference_code": "LHxxx"}
     */
    public function testWebhook(Request $request): JsonResponse
    {
        $request->validate([
            'reference_code' => 'required|string',
        ]);

        $refCode = $request->input('reference_code');

        // Find transaction by reference code
        $transaction = PaymentTransaction::where('reference_code', $refCode)
            ->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        // Simulate successful payment
        $transaction->markSuccess(['simulated' => true, 'timestamp' => now()]);
        $this->createSubscription($transaction);

        \Log::info('Test webhook: Payment simulated', ['transaction_id' => $transaction->id, 'reference_code' => $refCode]);

        return response()->json(['success' => true, 'message' => 'Payment simulated successfully']);
    }

    /**
     * Get user's payment history with pagination and filtering
     * GET /api/payments/history?page=1&from_date=2026-01-01&to_date=2026-12-31
     */
    public function getPaymentHistory(Request $request): JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $page = $request->input('page', 1);
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');
        $perPage = 10;

        $query = $user->paymentTransactions()
            ->where('status', 'success')
            ->orderBy('created_at', 'desc');

        // Filter by date range
        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }
        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }

        $total = $query->count();
        $transactions = $query->forPage($page, $perPage)
            ->get()
            ->map(function ($txn) {
                return [
                    'id' => $txn->id,
                    'reference_code' => $txn->reference_code,
                    'amount' => $txn->amount,
                    'plan' => $txn->plan,
                    'plan_name' => self::getPlanName($txn->plan),
                    'status' => $txn->status,
                    'created_at' => $txn->created_at->toDateString(),
                    'created_at_full' => $txn->created_at->format('d/m/Y H:i'),
                ];
            });

        $lastPage = ceil($total / $perPage);

        return response()->json([
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => $lastPage,
            'transactions' => $transactions,
        ]);
    }

    // ── Private helper methods ─────────────────────────────────────────────

    /**
     * Get plan pricing
     */
    private function getPricing(string $plan): ?array
    {
        $pricing = [
            '1subject' => ['amount' => 19000, 'duration_days' => 36500],
            '3subject' => ['amount' => 39000, 'duration_days' => 36500],
            '5subject' => ['amount' => 49000, 'duration_days' => 36500],
            'full' => ['amount' => 69000, 'duration_days' => 36500],
        ];

        return $pricing[$plan] ?? null;
    }

    /**
     * Get plan name in Vietnamese
     */
    public static function getPlanName(string $plan): string
    {
        $planNames = [
            '1subject' => 'Gói 1 môn',
            '3subject' => 'Gói 3 môn',
            '5subject' => 'Gói 5 môn',
            'full' => 'Gói Full',
        ];

        return $planNames[$plan] ?? $plan;
    }

    /**
     * Generate Sepay QR URL using qr.sepay.vn endpoint
     * This is the correct way that banks recognize
     */
    private function generateSepayQRUrl(int $amount, string $description): string
    {
        $bankId = '970422';  // MB Bank BIN code
        $accountNo = env('SEPAY_BANK_ACCOUNT', '0772052220');
        
        // Using Sepay's official QR endpoint
        $qrUrl = "https://qr.sepay.vn/img?bank={$bankId}&acc={$accountNo}&template=compact&amount={$amount}&des={$description}";
        
        return $qrUrl;
    }

    /**
     * Verify webhook signature
     */
    private function verifyWebhookSignature(?string $signature, string $body): bool
    {
        if (!$signature) {
            return false;
        }

        $secret = env('SEPAY_WEBHOOK_SECRET', '');
        
        // HMAC-SHA256 verification
        $expectedSignature = hash_hmac('sha256', $body, $secret, true);
        $expectedSignatureBase64 = base64_encode($expectedSignature);

        return hash_equals($expectedSignatureBase64, $signature);
    }

    /**
     * Create subscription after successful payment
     */
    private function createSubscription(PaymentTransaction $transaction): void
    {
        \Log::info('createSubscription called', ['transaction_id' => $transaction->id, 'plan' => $transaction->plan, 'user_id' => $transaction->user_id]);

        $user = $transaction->user;
        if (!$user) {
            \Log::warning('createSubscription: No user found', ['transaction_id' => $transaction->id]);
            return;
        }

        \Log::info('User found for subscription', ['user_id' => $user->id]);

        // Check for existing subscription
        $existingSubscription = $user->subscription()->first();
        $newPlan = $transaction->plan;
        $newSubjects = $transaction->subjects ?? [];

        // If user has existing subscription, merge subjects and keep larger plan
        if ($existingSubscription && $existingSubscription->isValid()) {
            \Log::info('Existing valid subscription found', [
                'subscription_id' => $existingSubscription->id,
                'existing_plan' => $existingSubscription->plan,
                'new_plan' => $newPlan,
            ]);

            // Merge old subjects with new subjects (avoid duplicates)
            $oldSubjects = $existingSubscription->subjects ?? [];
            $mergedSubjects = array_unique(array_merge($oldSubjects, $newSubjects));
            
            // Keep the larger plan
            $largePlan = $this->getLargerPlan($existingSubscription->plan, $newPlan);
            \Log::info('Plan comparison', [
                'existing_plan' => $existingSubscription->plan,
                'new_plan' => $newPlan,
                'larger_plan' => $largePlan,
            ]);

            // Update existing subscription
            $existingSubscription->update([
                'plan' => $largePlan,
                'subjects' => array_values($mergedSubjects), // re-index array
                'price' => $transaction->amount,
                'valid_until' => now()->addDays(365)->toDateString(), // Extend validity
                'is_active' => true,
                'payment_reference' => $transaction->reference_code,
            ]);

            \Log::info('Subscription upgraded', [
                'subscription_id' => $existingSubscription->id,
                'old_plan' => $existingSubscription->plan,
                'new_plan' => $largePlan,
                'merged_subjects_count' => count($mergedSubjects),
            ]);

            return;
        }

        // No existing subscription or expired - delete old one and create new
        if ($existingSubscription) {
            \Log::info('Deleting expired subscription', ['subscription_id' => $existingSubscription->id]);
            $existingSubscription->delete();
        }

        // Get plan duration
        $pricing = $this->getPricing($newPlan);
        if (!$pricing) {
            \Log::warning('createSubscription: Invalid plan', ['plan' => $newPlan, 'transaction_id' => $transaction->id]);
            return;
        }

        \Log::info('Plan pricing found', ['plan' => $newPlan, 'pricing' => $pricing]);

        $durationDays = $pricing['duration_days'];
        $validFrom = now()->toDateString();
        $validUntil = now()->addDays($durationDays)->toDateString();

        \Log::info('Creating new subscription', [
            'user_id' => $user->id,
            'plan' => $newPlan,
            'valid_from' => $validFrom,
            'valid_until' => $validUntil,
            'price' => $transaction->amount,
        ]);

        // Create new subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $newPlan,
            'subjects' => $newSubjects,
            'price' => $transaction->amount,
            'valid_from' => $validFrom,
            'valid_until' => $validUntil,
            'is_active' => true,
            'payment_reference' => $transaction->reference_code,
        ]);

        \Log::info('Subscription created successfully', ['subscription_id' => $subscription->id, 'user_id' => $user->id]);
    }

    /**
     * Compare two plans and return the larger one
     * Plan order: 1subject < 3subject < 5subject < full
     */
    private function getLargerPlan(string $plan1, string $plan2): string
    {
        $planOrder = [
            '1subject' => 1,
            '3subject' => 3,
            '5subject' => 5,
            'full' => 999,
        ];

        $order1 = $planOrder[$plan1] ?? 0;
        $order2 = $planOrder[$plan2] ?? 0;

        return $order2 >= $order1 ? $plan2 : $plan1;
    }
}
