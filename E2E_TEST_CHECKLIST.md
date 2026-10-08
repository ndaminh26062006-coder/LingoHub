# ✅ LingoHub Freemium E2E Test Checklist

## Quick Start

```bash
# Terminal 1: Backend
cd c:\laragon\www\LingoHub\BE
php artisan serve

# Terminal 2: Frontend  
cd c:\laragon\www\LingoHub\FE
npm run dev

# Browser
http://localhost:5173
```

---

## TEST 1: 2 Free Uses Per Feature ⏳

**Device**: Fresh incognito window, clear localStorage

### Essay (Tự luận)
- [ ] Use 1: Click "Làm bài" → NO paywall ✓
- [ ] Use 2: Click "Làm bài" again → NO paywall ✓
- [ ] Use 3: Click "Làm bài" again → PAYWALL SHOWS ✓
- [ ] Check: `localStorage.lingohub_device_id` exists ✓

### Exam (Thi thử)
- [ ] Use 1: Click "Thi thật" → NO paywall ✓
- [ ] Use 2: Click "Luyện tập" → NO paywall ✓
- [ ] Use 3: Click "Thi thật" → PAYWALL SHOWS ✓
- [ ] Check: Independent from Essay (essay=2, exam=2) ✓

### Document (Tài liệu trắc nghiệm)
- [ ] Use 1: Click "Luyện tập" → NO paywall ✓
- [ ] Use 2: Click "Luyện tập" → NO paywall ✓
- [ ] Use 3: Click "Luyện tập" → PAYWALL SHOWS ✓
- [ ] Check: Independent counters (essay=2, exam=2, doc=2) ✓

### Flashcard
- [ ] Use 1: Click deck Study → NO paywall ✓
- [ ] Use 2: Click deck Study → NO paywall ✓
- [ ] Use 3: Click deck Study → PAYWALL SHOWS ✓
- [ ] Check: All 4 features at 2/2 limit ✓

**Result**: ☐ PASS ☐ FAIL

---

## TEST 2: Paywall Modal Display ⏳

**Trigger**: Click on any feature 3rd time to show paywall

- [ ] Modal slides in from bottom ✓
- [ ] Dark overlay appears ✓
- [ ] Header shows "Unlock Premium Features" ✓
- [ ] 4 pricing cards visible: 1môn, 3môn, 5môn, FULL ✓
- [ ] 3môn highlighted as "Most Popular" ✓
- [ ] Click plan → subject checkboxes appear ✓
- [ ] Can select multiple subjects ✓
- [ ] "Proceed to Payment" button clickable ✓
- [ ] "Continue Free" button dismisses modal ✓
- [ ] X button closes modal ✓

**Result**: ☐ PASS ☐ FAIL

---

## TEST 3: Sepay Payment Flow ⏳

**Setup**: User logged in (test@example.com), paywall showing

- [ ] Select "1 Môn Lẻ" plan ✓
- [ ] Select "Triết học" subject ✓
- [ ] Click "Proceed to Payment" ✓
- [ ] Network: POST /api/payments/sepay/create ✓
- [ ] Response: `transaction_id`, `reference_code`, `checkout_url` ✓
- [ ] DB check: payment_transactions row created (status='pending') ✓
- [ ] Simulate webhook: POST /api/payments/sepay/webhook ✓
- [ ] DB check: payment_transactions status='success' ✓
- [ ] DB check: subscriptions row created (plan='1month') ✓
- [ ] Visit /payment/callback?reference_code=...&status=success ✓
- [ ] Success page shows: 🎉 "Payment successful" ✓
- [ ] Auto-redirect to /on-tap after 5s ✓

**Webhook Simulation**:
```bash
curl -X POST http://localhost:8000/api/payments/sepay/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "reference_code": "LINGOHUB_1_ABC_123",
    "status": "success",
    "amount": 49000
  }'
```

**Result**: ☐ PASS ☐ FAIL

---

## TEST 4: Subscription Unlocks Features ⏳

**Setup**: User has active subscription (from TEST 3)

- [ ] Hard refresh page (Ctrl+F5) ✓
- [ ] Backend call: GET /api/subscriptions/me ✓
- [ ] Response: `has_subscription: true, plan: "1month"` ✓
- [ ] Navigate to /tu-luan → click "Làm bài" → NO paywall ✓
- [ ] Navigate to /exams → click "Thi thật" → NO paywall ✓
- [ ] Navigate to /on-tap → select subject → click document → NO paywall ✓
- [ ] Navigate to /flashcard → click deck → NO paywall ✓
- [ ] All features unlimited (no paywall) ✓
- [ ] checkAccess returns `reason: "subscription"` ✓

**Check Subscription**:
```javascript
// In browser console
fetch('http://localhost:8000/api/subscriptions/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
}).then(r => r.json()).then(console.log)
```

**Result**: ☐ PASS ☐ FAIL

---

## TEST 5: Subject Restrictions (Limited Plan) ⏳

**Setup**: User with "1 Môn Lẻ" subscription for "Triết học" only

- [ ] DB: subscriptions.subjects = `["1"]` (Triết học) ✓
- [ ] GET /api/subscriptions/me → `subjects: [1]` ✓
- [ ] POST /api/subscriptions/check-subject (subject_id=1) → `has_access: true` ✓
- [ ] POST /api/subscriptions/check-subject (subject_id=2) → `has_access: false` ✓
- [ ] Can access Triết học essays without paywall ✓
- [ ] Other subjects blocked, show paywall/upgrade ✓

**Result**: ☐ PASS ☐ FAIL

---

## TEST 6: Device Independence ⏳

**Scenario**: Two different devices/browsers

**Device A (Chrome)**:
- [ ] Clear localStorage, open LingoHub
- [ ] Use essay 2 times → on 3rd, paywall shows ✓
- [ ] Note device_id in console ✓

**Device B (Firefox / Incognito)**:
- [ ] Clear localStorage, open LingoHub
- [ ] Use essay 1 time → NO paywall ✓
- [ ] Note device_id (different from Device A) ✓
- [ ] Use essay 2nd time → NO paywall ✓
- [ ] Use essay 3rd time → paywall shows ✓
- [ ] Device A's 2 uses don't affect Device B ✓

**Result**: ☐ PASS ☐ FAIL

---

## TEST 7: Feature Independence ⏳

**Scenario**: All 4 features have separate counters

- [ ] Use essay 2 times ✓
- [ ] Use exam 2 times ✓
- [ ] Use document 2 times ✓
- [ ] Use flashcard 2 times ✓
- [ ] Check API: `/api/freemium/usage-stats` ✓
- [ ] Response shows all 4 with `used_count: 2` ✓
- [ ] Essay 3rd attempt → paywall ✓
- [ ] Exam 3rd attempt → paywall (independent) ✓
- [ ] Document 3rd attempt → paywall (independent) ✓
- [ ] Flashcard 3rd attempt → paywall (independent) ✓

**Result**: ☐ PASS ☐ FAIL

---

## TEST 8: Error Handling ⏳

- [ ] Invalid plan selection → error message ✓
- [ ] No subject selected (required for limited plans) → error ✓
- [ ] Failed payment → callback shows failure page ✓
- [ ] Pending payment → callback shows pending, option to check later ✓
- [ ] Missing reference_code → callback shows error ✓
- [ ] Expired subscription → treated as no subscription ✓

**Result**: ☐ PASS ☐ FAIL

---

## TEST 9: Responsive Design ⏳

### Mobile (375px width)
- [ ] Paywall modal responsive ✓
- [ ] Pricing cards stack vertically ✓
- [ ] Subject checkboxes fit ✓
- [ ] Buttons touch-friendly (44px+ height) ✓

### Tablet (768px width)
- [ ] Layout adjusts properly ✓
- [ ] Modal readable ✓
- [ ] All interactions work ✓

### Desktop (1920px width)
- [ ] Modal centered ✓
- [ ] Pricing cards in grid ✓
- [ ] All features polished ✓

**Result**: ☐ PASS ☐ FAIL

---

## TEST 10: Browser Compatibility ⏳

- [ ] Chrome (latest) ✓
- [ ] Firefox (latest) ✓
- [ ] Safari (latest) ✓
- [ ] Edge (latest) ✓

**Result**: ☐ PASS ☐ FAIL

---

## FINAL RESULTS

### Summary
| Test | Status | Notes |
|------|--------|-------|
| 1. Two Free Uses | ⏳ | |
| 2. Paywall Modal | ⏳ | |
| 3. Sepay Payment | ⏳ | |
| 4. Subscription Access | ⏳ | |
| 5. Subject Restrictions | ⏳ | |
| 6. Device Independence | ⏳ | |
| 7. Feature Independence | ⏳ | |
| 8. Error Handling | ⏳ | |
| 9. Responsive Design | ⏳ | |
| 10. Browser Support | ⏳ | |

### Overall: ☐ PASS ☐ FAIL

---

## Database Queries for Verification

```sql
-- Check freemium usage
SELECT * FROM freemium_usages;

-- Check subscriptions
SELECT * FROM subscriptions;

-- Check payment transactions
SELECT * FROM payment_transactions;

-- Check specific user
SELECT id, name, email FROM users WHERE email = 'test@example.com';
SELECT * FROM subscriptions WHERE user_id = 1;
SELECT * FROM payment_transactions WHERE user_id = 1;
```

---

## Debugging Commands

```javascript
// Check device ID
console.log('Device ID:', localStorage.getItem('lingohub_device_id'))

// Check usage stats
fetch('http://localhost:8000/api/freemium/usage-stats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ device_id: localStorage.getItem('lingohub_device_id') })
}).then(r => r.json()).then(d => console.table(d.stats))

// Check subscription
fetch('http://localhost:8000/api/subscriptions/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
}).then(r => r.json()).then(console.log)

// Check pricing
fetch('http://localhost:8000/api/freemium/pricing')
  .then(r => r.json())
  .then(p => console.table(p))
```

---

## Sign-off

**Tester**: ____________________

**Date**: ____________________

**All Tests Passed**: ☐ YES ☐ NO

**Critical Issues**: 

**Minor Issues**: 

**Sign-off**: ____________________
