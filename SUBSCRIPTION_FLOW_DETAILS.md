# Subscription Purchase Flow - Chi Tiết Từng Trường Hợp

## Flow 1️⃣: Tài khoản CHƯA có Subscription

```
Status Before: NO subscription

User mua: Gói 1 Môn (Môn A)

Logic:
  1. Check existing subscription → NULL
  2. Skip merge logic (không có cái cũ)
  3. Get pricing → duration_days = 365
  4. Create NEW subscription
  
Result:
  ✅ Subscription created:
     - Plan: 1subject
     - Subjects: [A]
     - Valid from: TODAY
     - Valid until: TODAY + 365 days
     - is_active: true
     
Display on profile:
  ┌─────────────────────┐
  │ Nguyễn Văn A        │
  │ email@lingohub.vn   │
  │ 🟡 Gói 1 Môn ⭐    │  ← Plan name
  ├─────────────────────┤
  │ Lịch sự giao dịch   │
  │ Tiến độ học tập     │
  │ Nâng cấp tài khoản  │
  └─────────────────────┘
```

---

## Flow 2️⃣: Có Subscription "1 Môn" → Mua Thêm "1 Môn"

```
Status Before:
  - Plan: 1subject
  - Subjects: [A] (e.g., Triết học ID=1)
  - Valid until: 2026-12-09
  - is_active: true

User mua: Gói 1 Môn (Môn B)

Logic:
  1. Check existing subscription → FOUND + isValid() = TRUE
  2. Enter MERGE logic
  3. Old subjects: [A]
     New subjects: [B]
     Merged: [A, B] (array_unique → no duplicates)
  4. Compare plans: 1subject vs 1subject
     → getLargerPlan(1subject, 1subject) = 1subject (same)
  5. UPDATE (không delete, chỉ update):
     - plan: 1subject (giữ nguyên)
     - subjects: [A, B] (gộp lại)
     - valid_until: TODAY + 365 days (extend)
     - is_active: true

Result:
  ✅ Subscription UPDATED (không tạo mới):
     - Plan: 1subject (unchanged)
     - Subjects: [A, B] ← MERGED!
     - Valid until: 2027-10-09 (extended)
     
Display on profile:
  ┌─────────────────────┐
  │ Nguyễn Văn A        │
  │ email@lingohub.vn   │
  │ 🟡 Gói 1 Môn ⭐    │  ← Still "1 Môn"
  └─────────────────────┘
  
Note: Tên gói không thay đổi vì cùng size
      Nhưng user có 2 môn (A, B) thay vì 1
```

---

## Flow 3️⃣: Có Subscription "1 Môn" → Mua "3 Môn" hoặc lớn hơn

```
Status Before:
  - Plan: 1subject
  - Subjects: [A] (Triết học, ID=1)
  - Valid until: 2026-12-09
  - is_active: true

User mua: Gói 3 Môn (Lịch sử ID=2, Địa lý ID=3)

Logic:
  1. Check existing subscription → FOUND + isValid() = TRUE
  2. Enter MERGE logic
  3. Old subjects: [A] = [1]
     New subjects: [B, C] = [2, 3]
     Merged: [1, 2, 3] (array_unique)
  4. Compare plans: 1subject vs 3subject
     → getLargerPlan(1subject, 3subject) = 3subject ✅ UPGRADE!
  5. UPDATE subscription:
     - plan: 3subject (upgraded from 1subject!)
     - subjects: [1, 2, 3]
     - valid_until: TODAY + 365 days
     - is_active: true

Result:
  ✅ Subscription UPGRADED + MERGED:
     - Plan: 3subject ← CHANGED! (1 → 3)
     - Subjects: [1, 2, 3] ← MERGED all 3!
     - Valid until: 2027-10-09
     
Display on profile:
  ┌─────────────────────┐
  │ Nguyễn Văn A        │
  │ email@lingohub.vn   │
  │ 🟢 Gói 3 Môn ⭐    │  ← UPGRADED! (1 → 3)
  └─────────────────────┘
  
Email also shows: "Gói 3 Môn" (updated)
Subjects: Triết học, Lịch sử, Địa lý

⭐ KEY POINT: Plan name on profile CHANGES to show larger plan!
```

---

## Flow 4️⃣: Có Subscription "3 Môn" → Mua Thêm "1 Môn"

```
Status Before:
  - Plan: 3subject
  - Subjects: [A, B, C] = [1, 2, 3]
  - Valid until: 2026-12-09
  - is_active: true

User mua: Gói 1 Môn (Toán học ID=4)

Logic:
  1. Check existing subscription → FOUND + isValid() = TRUE
  2. Enter MERGE logic
  3. Old subjects: [A, B, C] = [1, 2, 3]
     New subjects: [D] = [4]
     Merged: [1, 2, 3, 4] (array_unique)
  4. Compare plans: 3subject vs 1subject
     → getLargerPlan(3subject, 1subject) = 3subject ✅ KEEP LARGER!
  5. UPDATE subscription:
     - plan: 3subject (unchanged - 3 > 1)
     - subjects: [1, 2, 3, 4] (merged, now 4 môn!)
     - valid_until: TODAY + 365 days
     - is_active: true

Result:
  ✅ Subscription ENHANCED (added subject but plan stays same):
     - Plan: 3subject ← KEPT! (3subject > 1subject)
     - Subjects: [1, 2, 3, 4] ← NOW 4 SUBJECTS!
     - Valid until: 2027-10-09
     
Display on profile:
  ┌─────────────────────┐
  │ Nguyễn Văn A        │
  │ email@lingohub.vn   │
  │ 🟢 Gói 3 Môn ⭐    │  ← Still "3 Môn" (not changed)
  └─────────────────────┘
  
Subjects: Triết học, Lịch sử, Địa lý, Toán học (4 môn total)

⭐ KEY POINT: Even though bought "1 Môn", kept "3 Môn" plan
             because 3subject > 1subject
             User gets extra subject for free essentially!
```

---

## Flow 5️⃣: Có Subscription "Full Access" → Mua Bất Kỳ Gói Nào

```
Status Before:
  - Plan: full
  - Subjects: ALL (full access)
  - Valid until: 2026-12-09
  - is_active: true

User mua: Gói 1 Môn / 3 Môn / 5 Môn / Full

Logic (same for all):
  1. Check existing subscription → FOUND + isValid() = TRUE
  2. Enter MERGE logic
  3. Old subjects: [ALL] (full access, every subject)
     New subjects: [any selection]
     Merged: [ALL] (all subjects already in old, new is subset)
  4. Compare plans: full vs 1subject/3subject/5subject/full
     → getLargerPlan(full, X) = full ✅ ALWAYS FULL!
  5. UPDATE subscription:
     - plan: full (unchanged)
     - subjects: [ALL] (unchanged - still full access)
     - valid_until: TODAY + 365 days (extend)
     - is_active: true

Result:
  ✅ Subscription EXTENDED (plan & subjects unchanged):
     - Plan: full ← UNCHANGED (full is highest)
     - Subjects: ALL ← UNCHANGED (still full access)
     - Valid until: 2027-10-09 (extended)
     
Display on profile:
  ┌─────────────────────┐
  │ Nguyễn Văn A        │
  │ email@lingohub.vn   │
  │ 🔵 Full Access ⭐  │  ← Still "Full Access"
  └─────────────────────┘

⭐ KEY POINT: Full access cannot be downgraded
             Buying any plan just extends validity
             Subjects remain unchanged (full)
```

---

## Summary Table

| Before Plan | Buy Plan | After Plan | Subjects | Action |
|---|---|---|---|---|
| ❌ NONE | 1 Môn | **1 Môn** | [A] | **CREATE** |
| 1 Môn | 1 Môn | **1 Môn** | [A, B] | **MERGE** |
| 1 Môn | 3 Môn | **3 Môn** ⬆️ | [A, B, C] | **UPGRADE + MERGE** |
| 3 Môn | 1 Môn | **3 Môn** | [A, B, C, D] | **MERGE** (keep larger) |
| Full | Any | **Full** | ALL | **EXTEND** (keep full) |

---

## Implementation Rules

### Rule 1: Plan Comparison
```php
private function getLargerPlan(string $plan1, string $plan2): string
{
    $planOrder = [
        '1subject' => 1,
        '3subject' => 3,
        '5subject' => 5,
        'full' => 999,
    ];
    return ($planOrder[$plan2] >= $planOrder[$plan1]) ? $plan2 : $plan1;
}
```

### Rule 2: Subject Merging
```php
$oldSubjects = $existingSubscription->subjects ?? [];
$newSubjects = $transaction->subjects ?? [];
$mergedSubjects = array_unique(array_merge($oldSubjects, $newSubjects));
// Remove duplicates automatically
```

### Rule 3: Validity Extension
```php
'valid_until' => now()->addDays(365)->toDateString()
// Always extend to +365 days from purchase date
```

### Rule 4: No Deletion
```php
// Always UPDATE existing subscription (never DELETE)
$existingSubscription->update([...]);
// User always has exactly 1 active subscription
```

---

## Edge Cases & Handling

### Edge Case 1: Expired Subscription
```
If subscription->isValid() = FALSE (expired):
  1. Delete old subscription (make room)
  2. Create NEW subscription (like Flow 1)
```

### Edge Case 2: User with NULL subjects
```
If subjects array is NULL/empty:
  Old: []
  New: [A, B]
  Merged: [A, B] ✅ (null coalescing handles it)
```

### Edge Case 3: Duplicate Subjects in Same Purchase
```
User selects: [A, A, B] in one purchase
  → array_unique() removes duplicates → [A, B]
```

### Edge Case 4: Merge with Existing Duplicates
```
Old: [1, 2]
New: [2, 3]
Merged: array_unique([1, 2, 2, 3]) = [1, 2, 3] ✅
```

---

## Testing Commands

```bash
# Test Case 1: No subscription → Buy 1 Môn
curl -X POST http://localhost:8000/api/payments/sepay/create \
  -H "Authorization: Bearer TOKEN" \
  -d '{"plan":"1subject","subjects":[1]}'

# Test Case 2: 1 Môn → Buy 3 Môn
# (same endpoint, system handles merging automatically)

# Verify result
curl http://localhost:8000/api/subscriptions/me \
  -H "Authorization: Bearer TOKEN"
# Should show: plan: "3subject", subjects: [1, 2, 3]
```

---

## Display Logic (Frontend)

### Profile Component
```jsx
const planDisplay = subscription.plan === 'full' 
  ? 'Full Access' 
  : `Gói ${subscription.plan.replace('subject', '')} Môn`;

// Examples:
// '1subject' → 'Gói 1 Môn'
// '3subject' → 'Gói 3 Môn'
// 'full' → 'Full Access'
```

### Email Notification
```
Chúc mừng! Bạn đã nâng cấp gói thành công.

Gói hiện tại: Gói 3 Môn  ← Shows LARGER plan
Môn học: Triết học, Lịch sử, Địa lý
Hạn sử dụng: 2027-10-09
```
