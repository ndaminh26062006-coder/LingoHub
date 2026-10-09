# Subscription Purchase Flowchart

## Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│ User completes payment for subscription                      │
│ (Plan: X, Subjects: [new selection])                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │ Check: Has existing     │
    │ subscription?           │
    └─────────┬───────────────┘
              │
        ┌─────┴─────┐
        │           │
      NO            YES
        │           │
        │           ▼
        │    ┌──────────────────┐
        │    │ isValid()?       │
        │    │ (not expired)    │
        │    └──────┬───────────┘
        │           │
        │      ┌────┴────┐
        │      │         │
        │     YES        NO
        │      │         │
        │      │         ├──→ Delete old subscription
        │      │                 ↓
        │      │         ┌─ CREATE NEW ─┐
        │      │         
        │      ├──→ MERGE LOGIC ─┐
        │      │                  │
        │      │  • Merge subjects│
        │      │    OLD: [A]      │
        │      │    NEW: [B]      │
        │      │    RESULT:[A,B]  │
        │      │                  │
        │      │  • Compare plans │
        │      │    1sub vs 3sub? │
        │      │    → Keep 3sub   │
        │      │                  │
        │      ├──────────────────┤
        │      │ UPDATE           │
        │      │ subscription     │
        │      │ with merged      │
        │      │ data             │
        │      │                  │
        └──────┴──────────────────┴──────┐
               │                         │
               ▼                         ▼
        ┌─────────────────┐      ┌─────────────────┐
        │ ✅ MERGED       │      │ ✅ CREATED      │
        │ Subscription    │      │ Subscription    │
        │ UPDATED         │      │ CREATED         │
        └─────────────────┘      └─────────────────┘
               │                         │
               └────────────┬────────────┘
                            │
                            ▼
        ┌──────────────────────────────────┐
        │ Webhook/Callback                 │
        │ - Send email notification        │
        │ - Update FreemiumContext         │
        │ - Redirect to dashboard          │
        └──────────────────────────────────┘
```

---

## Detailed Paths

### Path A: NO Existing Subscription

```
┌─────────────────────┐
│ No subscription     │
│ User buys: 1 Môn    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ CREATE subscription                 │
├─────────────────────────────────────┤
│ • plan: 1subject                    │
│ • subjects: [A]                     │
│ • valid_from: TODAY                 │
│ • valid_until: TODAY + 365d         │
│ • is_active: true                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│ ✅ SUCCESS          │
│ Display: Gói 1 Môn  │
└─────────────────────┘
```

### Path B: Have 1 Môn → Buy 1 Môn

```
┌──────────────────────────┐
│ Existing: 1 Môn [A]      │
│ Buys: 1 Môn [B]          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ MERGE Subjects                       │
├──────────────────────────────────────┤
│ Old: [A]                             │
│ New: [B]                             │
│ Result: [A, B] (array_unique)        │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Compare Plans                        │
├──────────────────────────────────────┤
│ 1subject vs 1subject?                │
│ → Same = Keep 1subject               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ UPDATE subscription                  │
├──────────────────────────────────────┤
│ • plan: 1subject (no change)         │
│ • subjects: [A, B] (merged!)         │
│ • valid_until: TODAY + 365d          │
└────────┬─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ ✅ SUCCESS                  │
│ Display: Gói 1 Môn          │
│ (but now 2 subjects!)       │
└─────────────────────────────┘
```

### Path C: Have 1 Môn → Buy 3 Môn ⭐ UPGRADE

```
┌──────────────────────────┐
│ Existing: 1 Môn [A]      │
│ Buys: 3 Môn [B, C]       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ MERGE Subjects                       │
├──────────────────────────────────────┤
│ Old: [A]                             │
│ New: [B, C]                          │
│ Result: [A, B, C]                    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Compare Plans                        │
├──────────────────────────────────────┤
│ 1subject (order=1)                   │
│ vs                                   │
│ 3subject (order=3)                   │
│                                      │
│ → 3 > 1? YES!                        │
│ → Keep 3subject ✅ UPGRADE!          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ UPDATE subscription                  │
├──────────────────────────────────────┤
│ • plan: 3subject (UPGRADED!)         │
│ • subjects: [A, B, C] (merged!)      │
│ • valid_until: TODAY + 365d          │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ ✅ UPGRADED + MERGED SUCCESS   │
│ Profile now shows: Gói 3 Môn   │
│ (was Gói 1 Môn)                │
│ With 3 subjects: A, B, C       │
└────────────────────────────────┘
```

### Path D: Have 3 Môn → Buy 1 Môn (Keep Larger)

```
┌──────────────────────────┐
│ Existing: 3 Môn [A,B,C]  │
│ Buys: 1 Môn [D]          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ MERGE Subjects                       │
├──────────────────────────────────────┤
│ Old: [A, B, C]                       │
│ New: [D]                             │
│ Result: [A, B, C, D]                 │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Compare Plans                        │
├──────────────────────────────────────┤
│ 3subject (order=3)                   │
│ vs                                   │
│ 1subject (order=1)                   │
│                                      │
│ → 3 > 1? YES!                        │
│ → Keep 3subject ✅ LARGER!           │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ UPDATE subscription                  │
├──────────────────────────────────────┤
│ • plan: 3subject (no change)         │
│ • subjects: [A, B, C, D] (merged!)   │
│ • valid_until: TODAY + 365d          │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ ✅ ENHANCED SUCCESS            │
│ Profile still: Gói 3 Môn       │
│ But now 4 subjects!            │
│ (user got extra subject!)      │
└────────────────────────────────┘
```

### Path E: Have Full Access → Buy Anything

```
┌─────────────────────────────────┐
│ Existing: Full Access [ALL]      │
│ Buys: Any plan (1/3/5/Full)      │
└────────┬────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ MERGE Subjects                     │
├────────────────────────────────────┤
│ Old: [ALL] (full access)           │
│ New: [any selection]               │
│ Result: [ALL] (all included)       │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Compare Plans                      │
├────────────────────────────────────┤
│ full (order=999)                   │
│ vs                                 │
│ 1/3/5/full (order≤999)             │
│                                    │
│ → full is always larger!           │
│ → Keep full ✅ HIGHEST!            │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ UPDATE subscription                │
├────────────────────────────────────┤
│ • plan: full (unchanged)           │
│ • subjects: [ALL] (unchanged)      │
│ • valid_until: TODAY + 365d        │
│   (EXTENDED!)                      │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ ✅ EXTENDED SUCCESS            │
│ Profile: Full Access (same)    │
│ Validity: Extended for 1 year  │
└────────────────────────────────┘
```

---

## Plan Hierarchy Visualization

```
┌─────────────────────────────────────────────────────┐
│                  PLAN HIERARCHY                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  LOWEST ◄──────────────────────────► HIGHEST       │
│                                                     │
│  1subject (1)                                       │
│      ▲                                              │
│      │ upgrade                                      │
│      │                                              │
│  3subject (3)                                       │
│      ▲                                              │
│      │ upgrade                                      │
│      │                                              │
│  5subject (5)                                       │
│      ▲                                              │
│      │ upgrade                                      │
│      │                                              │
│  full (999) ◄─── HIGHEST / CANNOT DOWNGRADE        │
│                                                     │
├─────────────────────────────────────────────────────┤
│ When buying:                                        │
│ • System always keeps the LARGER plan               │
│ • Subjects always MERGE (never lose old ones)       │
│ • Validity always EXTENDS (+365 days)               │
└─────────────────────────────────────────────────────┘
```

---

## Subject Merging Examples

```
Example 1: No overlap
  Old: [1, 2]       (Triết học, Lịch sử)
  New: [3, 4]       (Địa lý, Toán)
  Result: [1, 2, 3, 4] ✅ All merged

Example 2: Partial overlap
  Old: [1, 2, 3]    (Triết học, Lịch sử, Địa lý)
  New: [2, 3, 4]    (Lịch sử, Địa lý, Toán)
  Result: [1, 2, 3, 4] ✅ Duplicates removed (array_unique)

Example 3: Full overlap
  Old: [1, 2]       (Triết học, Lịch sử)
  New: [1, 2]       (Triết học, Lịch sử)
  Result: [1, 2] ✅ Same subjects kept

Example 4: NULL handling
  Old: [] or null   (no subjects)
  New: [1, 2, 3]    (all subjects)
  Result: [1, 2, 3] ✅ New subjects added
```

---

## Code Execution Flow

```javascript
// webhook handler triggers createSubscription()
if ($webhookStatusOk) {
  createSubscription($transaction);
}

// Inside createSubscription()
1. Get existing subscription
   ├─ if ($existingSubscription && $existingSubscription->isValid())
   │  ├─ Merge subjects
   │  │  └─ $merged = array_unique(array_merge($old, $new))
   │  ├─ Compare plans
   │  │  └─ $plan = getLargerPlan($existing, $new)
   │  └─ UPDATE (not DELETE)
   │     └─ $existingSubscription->update([...])
   │
   └─ else (no subscription or expired)
      ├─ Delete old if exists
      └─ Create new
         └─ Subscription::create([...])

2. Return success
   └─ Log, send notification, redirect
```
