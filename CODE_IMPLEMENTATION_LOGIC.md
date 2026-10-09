# Code Implementation Logic - Deep Dive

## Main Method: `createSubscription()`

### Location
```
c:\laragon\www\LingoHub\BE\app\Http\Controllers\Api\PaymentController.php
Lines: 375-490
```

### When Called
```
Called from: handleWebhook() method
Triggered by: Sepay payment webhook (success status)
After: PaymentTransaction record created
```

### Step-by-Step Logic

#### Step 1: Check User Exists
```php
$user = $transaction->user;
if (!$user) {
    \Log::warning('createSubscription: No user found', ...);
    return; // EXIT early if user not found
}
```

#### Step 2: Get Existing Subscription (if any)
```php
$existingSubscription = $user->subscription()->first();
// Returns: Subscription object OR null
```

#### Step 3: Extract New Data from Transaction
```php
$newPlan = $transaction->plan;           // '1subject', '3subject', etc
$newSubjects = $transaction->subjects ?? [];  // [1, 2, 3]
```

#### Step 4: Branch A - Existing Valid Subscription
```php
if ($existingSubscription && $existingSubscription->isValid()) {
    // ✅ Enter MERGE/UPGRADE logic
```

##### Step 4A: Get Old Subjects
```php
$oldSubjects = $existingSubscription->subjects ?? [];
// If subscription->subjects is NULL, use empty array
// Handles edge case of empty subjects
```

##### Step 4B: Merge Subjects
```php
$mergedSubjects = array_unique(
    array_merge($oldSubjects, $newSubjects)
);
// array_merge: Combine two arrays
// array_unique: Remove duplicate values
//
// Example:
// $oldSubjects = [1, 2]
// $newSubjects = [2, 3]
// array_merge = [1, 2, 2, 3]
// array_unique = [1, 2, 3] ✅
```

##### Step 4C: Compare Plans
```php
$largePlan = $this->getLargerPlan(
    $existingSubscription->plan,  // e.g., '1subject'
    $newPlan                      // e.g., '3subject'
);
// Calls helper method to determine larger plan
```

##### Step 4D: Update Subscription
```php
$existingSubscription->update([
    'plan' => $largePlan,                              // '3subject'
    'subjects' => array_values($mergedSubjects),       // [1, 2, 3]
    'price' => $transaction->amount,                   // Latest price
    'valid_until' => now()->addDays(365)->toDateString(),  // Extend!
    'is_active' => true,
    'payment_reference' => $transaction->reference_code,
]);

// array_values(): Re-index array after merge
//   Before: [0=>1, 2=>3, 1=>2]
//   After:  [0=>1, 1=>2, 2=>3]
//
// Valid until: Always set to +365 days from NOW
//   not from old valid_until date
```

##### Step 4E: Log Upgrade
```php
\Log::info('Subscription upgraded', [
    'subscription_id' => $existingSubscription->id,
    'old_plan' => $existingSubscription->plan,  // BEFORE
    'new_plan' => $largePlan,                   // AFTER
    'merged_subjects_count' => count($mergedSubjects),
]);
// For debugging and tracking upgrades
```

##### Step 4F: Return Early
```php
return; // EXIT here - no more code execution
// Do NOT create new subscription
// Subscription already updated
```

#### Step 5: Branch B - No Existing or Expired
```php
// This code only runs if Step 4 condition was FALSE
if ($existingSubscription) {
    \Log::info('Deleting expired subscription', ...);
    $existingSubscription->delete();
    // Only delete if subscription exists AND is expired
}
```

#### Step 6: Get Plan Pricing
```php
$pricing = $this->getPricing($newPlan);
// Returns array: ['duration_days' => 365, ...]
if (!$pricing) {
    \Log::warning('createSubscription: Invalid plan', ...);
    return; // EXIT if plan not recognized
}
```

#### Step 7: Calculate Validity Dates
```php
$durationDays = $pricing['duration_days'];
$validFrom = now()->toDateString();           // TODAY
$validUntil = now()->addDays($durationDays)->toDateString();
// 365 days for all current plans
// Example: TODAY = 2026-10-09, UNTIL = 2027-10-09
```

#### Step 8: Create New Subscription
```php
$subscription = Subscription::create([
    'user_id' => $user->id,                    // Link to user
    'plan' => $newPlan,                        // '1subject'
    'subjects' => $newSubjects,                // [1]
    'price' => $transaction->amount,           // 19000
    'valid_from' => $validFrom,                // TODAY
    'valid_until' => $validUntil,              // TODAY + 365d
    'is_active' => true,                       // Active immediately
    'payment_reference' => $transaction->reference_code,
]);
```

#### Step 9: Log Success
```php
\Log::info('Subscription created successfully', [
    'subscription_id' => $subscription->id,
    'user_id' => $user->id,
]);
```

---

## Helper Method: `getLargerPlan()`

### Location
```php
Lines: 473-490
```

### Purpose
Compare two plan names and return the larger one based on capacity

### Implementation
```php
private function getLargerPlan(string $plan1, string $plan2): string
{
    // Define plan hierarchy
    $planOrder = [
        '1subject' => 1,      // Lowest
        '3subject' => 3,
        '5subject' => 5,
        'full' => 999,        // Highest (always wins)
    ];

    // Get order value, default to 0 if unknown
    $order1 = $planOrder[$plan1] ?? 0;
    $order2 = $planOrder[$plan2] ?? 0;

    // Return the plan with higher order value
    return $order2 >= $order1 ? $plan2 : $plan1;
}
```

### Examples
```php
// Example 1: Upgrade
getLargerPlan('1subject', '3subject')
├─ order1 = 1
├─ order2 = 3
└─ return: '3subject' ✅ (3 > 1)

// Example 2: Keep larger
getLargerPlan('3subject', '1subject')
├─ order1 = 3
├─ order2 = 1
└─ return: '3subject' ✅ (3 > 1)

// Example 3: Same size
getLargerPlan('3subject', '3subject')
├─ order1 = 3
├─ order2 = 3
├─ 3 >= 3? YES
└─ return: '3subject' ✅ (same = keep either)

// Example 4: Full always wins
getLargerPlan('full', '1subject')
├─ order1 = 999
├─ order2 = 1
└─ return: 'full' ✅ (999 > 1)

getLargerPlan('1subject', 'full')
├─ order1 = 1
├─ order2 = 999
└─ return: 'full' ✅ (999 > 1)
```

---

## Subscription Model: `isValid()` Method

### Purpose
Check if subscription is still active (not expired)

### Location
```
c:\laragon\www\LingoHub\BE\app\Models\Subscription.php
```

### Implementation (assumed)
```php
public function isValid(): bool
{
    return $this->is_active 
        && $this->valid_until >= now()->toDateString();
    // Must have is_active = true
    // AND valid_until date must be today or later
}
```

### Usage in createSubscription()
```php
if ($existingSubscription && $existingSubscription->isValid()) {
    // Only merge if subscription is BOTH:
    // 1. Exists
    // 2. is_active = true
    // 3. valid_until >= TODAY
}
```

---

## Database Schema Impact

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id BIGINT PRIMARY KEY,
    user_id BIGINT UNIQUE,          -- ⚠️ UNIQUE constraint
    plan ENUM('1subject', '3subject', '5subject', 'full'),
    subjects JSON,                  -- Stores array of subject IDs
    price INT,
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT true,
    payment_reference VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- ⚠️ IMPORTANT: user_id is UNIQUE
-- This means only 1 subscription per user allowed!
-- That's why we UPDATE instead of CREATE when subscription exists
```

### Insertion Behavior
```
Scenario 1: New subscription
INSERT INTO subscriptions (user_id, plan, subjects, ...)
VALUES (1, '1subject', JSON_ARRAY(1), ...)
✅ SUCCESS

Scenario 2: Existing subscription (OLD CODE)
DELETE FROM subscriptions WHERE user_id = 1
INSERT INTO subscriptions (user_id, plan, subjects, ...)
VALUES (1, '1subject', JSON_ARRAY(1, 2), ...)
✅ SUCCESS but loses data in between

Scenario 3: Existing subscription (NEW CODE)
UPDATE subscriptions 
SET plan = '3subject', subjects = JSON_ARRAY(1, 2, 3), ...
WHERE user_id = 1
✅ SUCCESS - atomic operation, no data loss
```

---

## Transaction Table Schema

### How New Purchase Data Arrives
```sql
CREATE TABLE payment_transactions (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    plan VARCHAR(50),           -- '1subject', '3subject', etc.
    subjects JSON,              -- [1, 2, 3] - selected by user
    amount INT,
    reference_code VARCHAR(255), -- Sepay transaction ID
    status ENUM('pending', 'success', 'failed'),
    created_at TIMESTAMP,
    ...
);

-- Example row:
{
    id: 123,
    user_id: 1,
    plan: '3subject',
    subjects: [2, 3, 4],    -- ← User selected these
    amount: 39000,
    reference_code: 'TF123456',
    status: 'success',
    ...
}
```

---

## Execution Timeline

### Successful Purchase Flow
```
TIME    EVENT                           RESULT
────    ─────────────────────────────   ────────────────────
1:00    User clicks "Thanh toán"        Page redirects to Sepay
1:05    User confirms payment           Sepay processes payment
1:06    Sepay sends webhook             Payment transaction created
                                        ├─ status: 'success'
                                        ├─ plan: '3subject'
                                        └─ subjects: [2, 3, 4]
                                        
1:06    handleWebhook() called          ├─ Verify webhook signature
        createSubscription() triggered   ├─ Check user exists
                                        ├─ Existing subscription? YES
                                        ├─ Merge: [1, 2] + [2,3,4] = [1,2,3,4]
                                        ├─ Compare: 1subject vs 3subject → 3subject
                                        ├─ UPDATE subscription
                                        └─ Log upgrade
                                        
1:06    Success response                ├─ Send email notification
        returned to frontend            ├─ Update FreemiumContext
                                        └─ Redirect to /dashboard
                                        
1:07    User sees profile               Shows: "Gói 3 Môn" ✅
                                        Subjects: [1, 2, 3, 4]
```

---

## Edge Cases Handled

### Edge Case 1: NULL Subjects
```php
$oldSubjects = $existingSubscription->subjects ?? [];
// ?? operator: Use [] if subjects is NULL/undefined
// Handles corrupted data gracefully
```

### Edge Case 2: Duplicate Subjects in Merge
```php
array_unique([1, 2, 2, 3]) // = [1, 2, 3]
// Removes exact duplicates automatically
```

### Edge Case 3: Empty Array After Merge
```php
$mergedSubjects = [];  // If both old and new are empty
// Still valid - user can have "full" plan with no specific selection
```

### Edge Case 4: Invalid Plan
```php
if (!$pricing) {
    return; // EXIT without creating subscription
}
// Prevents creation of subscription with invalid plan
```

### Edge Case 5: User Not Found
```php
if (!$user) {
    return; // EXIT early
}
// Prevents orphan subscriptions without users
```

---

## Performance Considerations

### Database Operations
```
Old approach (DELETE + INSERT):
1. Lock subscriptions table
2. DELETE old subscription
3. INSERT new subscription
4. Unlock
⚠️ Risk of race condition, 2 queries

New approach (UPDATE):
1. Lock single row
2. UPDATE subscription
3. Unlock
✅ Atomic operation, 1 query, faster
```

### Logging
```php
\Log::info('...', [...]);
// Uses Laravel's logging system
// Logs to: storage/logs/laravel.log
// Useful for debugging subscription issues
```

---

## Testing Scenarios

### Test 1: No subscription → Buy 1 Môn
```
Setup: User has no subscription
Action: Click "Thanh toán" for 1 Môn [Triết học]
Expected: 
  - Subscription created
  - Plan: 1subject
  - Subjects: [1]
Verify:
  - GET /api/subscriptions/me
  - Response plan: 1subject
```

### Test 2: 1 Môn → 3 Môn
```
Setup: User has 1 Môn [Triết học]
Action: Click "Thanh toán" for 3 Môn [Lịch sử, Địa lý]
Expected:
  - Subscription updated (not deleted)
  - Plan: 3subject (upgraded!)
  - Subjects: [1, 2, 3]
Verify:
  - GET /api/subscriptions/me
  - Response plan: 3subject
  - Response subjects: [1, 2, 3]
```

### Test 3: 3 Môn → 1 Môn
```
Setup: User has 3 Môn [Triết học, Lịch sử, Địa lý]
Action: Click "Thanh toán" for 1 Môn [Toán học]
Expected:
  - Subscription updated
  - Plan: 3subject (kept - larger!)
  - Subjects: [1, 2, 3, 4] (all merged)
Verify:
  - GET /api/subscriptions/me
  - Response plan: 3subject (not downgraded!)
```

### Test 4: Full → Any plan
```
Setup: User has Full Access
Action: Click "Thanh toán" for any plan
Expected:
  - Subscription updated
  - Plan: full (unchanged)
  - Subjects: [all] (unchanged)
  - Valid_until: extended
Verify:
  - GET /api/subscriptions/me
  - Response plan: full
```
