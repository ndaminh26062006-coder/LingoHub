# Subscription Upgrade Logic

## Overview
When a user purchases a new subscription while having an existing valid subscription, the system now:
1. **Merges subjects** from both subscriptions
2. **Keeps the larger plan** (e.g., if user has "1 Môn" and buys "3 Môn" → result is "3 Môn")
3. **Extends validity** to 365 days from purchase date
4. **Updates instead of delete** the existing subscription

## Plan Hierarchy
```
1subject (1) < 3subject (3) < 5subject (5) < full (999)
```

## Example Scenarios

### Scenario 1: Upgrade from 1 Môn to 3 Môn
```
User Status Before:
  - Plan: 1subject
  - Subjects: [Triết học (ID: 1)]
  - Valid until: 2026-12-09

User Purchases: 3 Môn with Lịch sử, Địa lý (ID: 2, 3)

Result After Payment:
  - Plan: 3subject (larger plan)
  - Subjects: [1, 2, 3] (merged, unique)
  - Valid until: 2027-10-09 (extended)
  - Name displayed: "Gói 3 Môn" (shown under email)
```

### Scenario 2: Upgrade from 3 Môn to 5 Môn
```
User Status Before:
  - Plan: 3subject
  - Subjects: [1, 2, 3]
  - Valid until: 2026-12-09

User Purchases: 5 Môn with [2, 3, 4, 5] (overlaps with existing)

Result After Payment:
  - Plan: 5subject (larger plan)
  - Subjects: [1, 2, 3, 4, 5] (merged, duplicates removed)
  - Valid until: 2027-10-09 (extended)
```

### Scenario 3: Downgrade attempt (1 Môn → Full, Full wins)
```
User Status Before:
  - Plan: full
  - Subjects: [all]

User Purchases: 1 Môn

Result After Payment:
  - Plan: full (kept because full > 1subject)
  - Subjects: [all] (full access, all subjects retained)
  - Valid until: 2027-10-09 (extended)
```

### Scenario 4: Same plan with different subjects
```
User Status Before:
  - Plan: 3subject
  - Subjects: [1, 2, 3]

User Purchases: 3 Môn with [3, 4, 5]

Result After Payment:
  - Plan: 3subject (same size)
  - Subjects: [1, 2, 3, 4, 5] (merged all 5)
  - Valid until: 2027-10-09 (extended)
```

## Implementation Details

### createSubscription() Method Changes
1. Check if user has **existing valid subscription**
2. If yes:
   - Merge `oldSubjects` + `newSubjects` using `array_unique()`
   - Compare plans using `getLargerPlan()`
   - **UPDATE** subscription with:
     - `plan` = larger plan
     - `subjects` = merged array
     - `valid_until` = +365 days
     - `is_active` = true
   - Log upgrade action
3. If no valid subscription:
   - Delete expired subscription (if any)
   - Create new subscription normally

### getLargerPlan() Helper Method
Compares two plan names and returns the larger one:
```php
'1subject' = 1 point
'3subject' = 3 points
'5subject' = 5 points
'full' = 999 points
```

Returns the plan with higher points.

## Database Impact
- No new subscriptions created (UPDATE only)
- User always has **exactly 1 active subscription**
- Old subjects preserved + new subjects added
- Validity extended to +365 days from purchase

## Frontend Display
- Profile page shows: **"Gói 3 Môn"** (larger plan name)
- Subjects list shows: All merged subjects
- Valid until: Extended date
- No confusing multiple subscriptions

## Testing Checklist
- [ ] Purchase 1 Môn first time
- [ ] Upgrade from 1 Môn to 3 Môn
- [ ] Upgrade from 3 Môn to 5 Môn
- [ ] Purchase Full plan
- [ ] Verify merged subjects in `/subscriptions/me` API
- [ ] Check email displays correct plan name
- [ ] Verify logs show upgrade action
