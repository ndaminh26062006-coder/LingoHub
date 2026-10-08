# Sepay Payment Flow Manual Testing Guide

**Status:** Ready to test end-to-end payment flow  
**Date:** September 29, 2026  
**Backend:** http://localhost:8000  
**Frontend:** http://localhost:5173  

---

## Quick Start (10 Steps)

### Step 1: Reset Device Usage (Start Fresh)
1. Open browser DevTools → Application → LocalStorage
2. Note your `device_id` value (e.g., `fp_abc123...`)
3. In Terminal, run reset command:
   ```bash
   cd c:\laragon\www\LingoHub\BE
   php artisan tinker
   >>> $devices = \App\Models\FreemiumUsage::where('device_id', 'fp_abc123...')->get();
   >>> $devices->each->delete();
   >>> exit
   ```

### Step 2: Test 1st Free Use
1. Go to http://localhost:5173
2. Click on **Categories** → Select category → **Luyện tập** button (Documents)
3. Should succeed with message: "✓ Access granted. Uses remaining: 1/2"
4. Verify DB: 
   ```bash
   SELECT * FROM freemium_usages WHERE device_id='fp_abc123...';
   ```
   Should show 1 usage record with feature='document'

### Step 3: Test 2nd Free Use  
1. Go back to Categories
2. Click **Luyện tập** button again on DIFFERENT document
3. Should succeed with: "✓ Access granted. Uses remaining: 0/2"
4. Verify DB shows 2 usage records

### Step 4: Test Paywall on 3rd Attempt
1. Try to access another document's **Luyện tập** button
2. Should show **PAYWALL MODAL** with 4 pricing tiers
3. Verify modal shows:
   - 49K (1 month) - 1 subject
   - 99K (3 months) - 3 subjects  
   - 129K (5 months) - 5 subjects
   - 199K (1 year) - ALL subjects ⭐ (highlighted)

### Step 5: Test Payment Creation
1. In Paywall modal, select **199K (Full)** tier
2. Click **Thanh toán** button
3. Should redirect to Sepay checkout page or mock response with:
   - `transaction_id`
   - `reference_code` (e.g., `LINGOHUB_1_ABC123_1234567890`)
   - `amount: 199000`
   - `checkout_url`

### Step 6: Verify Transaction Created
1. In Backend Terminal:
   ```bash
   SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 1;
   ```
   Should show:
   - `status: 'pending'`
   - `plan: 'full'`
   - `amount: 199000`
   - `reference_code` matches from Step 5

### Step 7: Simulate Webhook Success
1. Use curl to send webhook (Windows PowerShell):
   ```powershell
   $body = @{
       "reference_code" = "LINGOHUB_1_ABC123_1234567890"
       "status" = "success"
       "amount" = 199000
   } | ConvertTo-Json
   
   Invoke-WebRequest -Uri "http://localhost:8000/api/payments/sepay/webhook" `
     -Method POST `
     -Headers @{"Content-Type"="application/json"} `
     -Body $body
   ```

2. Check response: `{"success": true, "message": "Payment successful"}`

### Step 8: Verify Subscription Created
1. In Backend Terminal:
   ```bash
   SELECT * FROM subscriptions WHERE user_id=1 ORDER BY created_at DESC LIMIT 1;
   ```
   Should show:
   - `plan: 'full'`
   - `is_active: 1`
   - `valid_from`: today
   - `valid_until`: 365 days from today
   - `payment_reference`: matches reference_code

### Step 9: Verify Payment Transaction Updated
1. In Backend Terminal:
   ```bash
   SELECT * FROM payment_transactions WHERE reference_code='LINGOHUB_1_ABC123_1234567890';
   ```
   Should show:
   - `status: 'success'`
   - `completed_at`: today

### Step 10: Test Unlimited Access
1. Hard refresh frontend: **Ctrl+Shift+R**
2. Go to Categories → Try accessing 3rd, 4th, 5th documents' **Luyện tập**
3. All should succeed WITHOUT showing paywall
4. Verify API response includes: `"subscription": {..., "is_active": true}`

---

## Detailed API Testing (With Postman)

### 1. Check Pricing Tiers
**GET** `http://localhost:8000/api/freemium/pricing`
```json
Response (expected):
[
  {
    "id": 1,
    "plan": "1month",
    "amount": 49000,
    "name": "1 Tháng",
    "color": "#FF6B6B"
  },
  ...
]
```

### 2. Check Access (No Auth)
**POST** `http://localhost:8000/api/freemium/check-access`
```json
Body:
{
  "feature": "document",
  "device_id": "fp_abc123..."
}

Response (first 2 uses):
{
  "can_access": true,
  "reason": "free_uses_available",
  "message": "Access granted. Uses remaining: 1/2",
  "remaining_uses": 1
}

Response (3rd+ use):
{
  "can_access": false,
  "reason": "limit_exceeded",
  "message": "Free uses limit exceeded. Subscribe to continue.",
  "pricing": [...],
  "remaining_uses": 0
}
```

### 3. Check Access (With Subscription)
**POST** `http://localhost:8000/api/freemium/check-access`
```
Header: Authorization: Bearer YOUR_TOKEN

Body:
{
  "feature": "document",
  "device_id": "fp_abc123..."
}

Response (should always succeed):
{
  "can_access": true,
  "reason": "subscription_active",
  "message": "Access granted via subscription",
  "subscription": {
    "plan": "full",
    "valid_until": "2027-09-28",
    "can_access_all": true
  }
}
```

### 4. Create Payment (Auth Required)
**POST** `http://localhost:8000/api/payments/sepay/create`
```
Header: Authorization: Bearer YOUR_TOKEN

Body:
{
  "plan": "full",
  "subjects": []
}

Response:
{
  "success": true,
  "transaction_id": 1,
  "reference_code": "LINGOHUB_1_ABC123_1234567890",
  "amount": 199000,
  "plan": "full",
  "checkout_url": "http://...",
  "sepay_transfer_id": "mock_transfer_..."
}
```

### 5. Webhook (No Auth)
**POST** `http://localhost:8000/api/payments/sepay/webhook`
```json
Body:
{
  "reference_code": "LINGOHUB_1_ABC123_1234567890",
  "status": "success",
  "amount": 199000
}

Response:
{
  "success": true,
  "message": "Payment successful"
}
```

### 6. Get Payment Status
**GET** `http://localhost:8000/api/payments/sepay/status/LINGOHUB_1_ABC123_1234567890`
```json
Response:
{
  "reference_code": "LINGOHUB_1_ABC123_1234567890",
  "status": "success",
  "amount": 199000,
  "plan": "full",
  "created_at": "2026-09-29T10:30:00Z",
  "updated_at": "2026-09-29T10:35:00Z"
}
```

### 7. Get My Subscription
**GET** `http://localhost:8000/api/subscriptions/me`
```
Header: Authorization: Bearer YOUR_TOKEN

Response:
{
  "has_subscription": true,
  "subscription": {
    "id": 1,
    "plan": "full",
    "is_active": true,
    "valid_from": "2026-09-29",
    "valid_until": "2027-09-28",
    "can_access_all": true,
    "subjects_count": 0
  }
}
```

---

## Frontend Testing Scenarios

### Scenario A: No Subscription, 1st Use
1. Clear localStorage (except lh_token if logged in)
2. Click feature button
3. ✅ Should allow access, increment usage counter

### Scenario B: No Subscription, 2nd Use  
1. Click different feature button (or same with different item)
2. ✅ Should allow access, usage shows 1/2

### Scenario C: No Subscription, 3rd+ Use
1. Click feature button
2. ✅ Should show Paywall Modal
3. ✅ User cannot proceed without payment

### Scenario D: After Successful Payment
1. Complete payment flow via webhook
2. Hard refresh page
3. ✅ Paywall should NOT show
4. ✅ Access granted for unlimited features
5. ✅ All 4 features work: documents, exams, essays, flashcards

### Scenario E: Device Independence
1. Test with Device A (current), confirm usage counter works
2. Open Private/Incognito window (different device_id)
3. ✅ Usage counter should reset to 0/2
4. ✅ Can access 2 free uses on new device

---

## Troubleshooting

### Issue: "TypeError: api.get is not a function"
✅ **Fixed** - Changed to use `axios` directly with proper headers

### Issue: "Uncaught TypeError: gate is not a function"  
✅ **Fixed** - Removed old gate() function from ExamPage

### Issue: Can't access any feature (paywall shows immediately)
**Check:**
1. Is device_id generating? DevTools → Application → LocalStorage → `device_id`
2. Is backend running? Test: `curl http://localhost:8000/api/freemium/pricing`
3. Are migrations applied? `php artisan migrate --path=database/migrations/2026_*`
4. Check DB has freemium_usages table: `SHOW TABLES;`

### Issue: Paywall shows wrong pricing  
1. Check `/api/freemium/pricing` returns 4 tiers
2. Verify PaywallModal.jsx maps pricing correctly

### Issue: Webhook doesn't create subscription
1. Check `payment_transactions` has correct status='success'
2. Check `subscriptions` table for new row
3. Verify PaymentController.php `createSubscription()` is called

---

## Database Queries for Verification

```sql
-- Check usage counter
SELECT device_id, feature, use_count, is_exceeded, created_at 
FROM freemium_usages 
WHERE device_id = 'fp_abc123...' 
ORDER BY created_at DESC;

-- Check payments
SELECT id, user_id, reference_code, status, plan, amount, created_at 
FROM payment_transactions 
WHERE user_id = 1 
ORDER BY created_at DESC;

-- Check subscriptions
SELECT id, user_id, plan, is_active, valid_from, valid_until, created_at 
FROM subscriptions 
WHERE user_id = 1 
ORDER BY created_at DESC;

-- Check pricing
SELECT * FROM pricing_tiers;
```

---

## Success Criteria ✅

- [ ] 1st feature access succeeds
- [ ] 2nd feature access succeeds
- [ ] 3rd feature access shows paywall
- [ ] Paywall modal displays all 4 tiers correctly
- [ ] Payment creation generates reference code
- [ ] Webhook marks transaction as success
- [ ] Subscription created with correct duration
- [ ] After payment, unlimited access works
- [ ] Device ID persists in localStorage
- [ ] Different devices have independent counters

---

## Next Steps

1. **If all tests pass** → Mark PHASE 5 complete → Ready for deployment
2. **If any test fails** → Debug using queries above → Re-test → Report issue
3. **For production** → Replace SEPAY_MODE sandbox with real credentials

