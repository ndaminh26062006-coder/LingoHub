# 🧪 LingoHub Freemium System - E2E Testing Guide

## Setup

### Prerequisites
- Backend server running: `php artisan serve` (http://localhost:8000)
- Frontend dev server running: `npm run dev` (http://localhost:5173)
- Browser: Chrome/Firefox/Safari (latest)
- Clear browser cache and localStorage before each test

### Test Data
- **Test User**: test@example.com / password123
- **Test Device IDs**: Use distinct device IDs for testing device independence
- **Features**: essay, exam, document, flashcard

---

## 📋 Test Scenarios

### SCENARIO 1: 2 Free Uses Per Device (All 4 Features)

**Objective**: Verify that each feature allows exactly 2 free uses per device before showing paywall

**Setup**:
```
1. Clear localStorage: DevTools → Application → Clear All
2. Close all browser tabs for LingoHub
3. Open fresh instance in incognito mode
```

**Test Steps**:

#### Feature 1: ESSAY (Tự luận)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to /tu-luan (Essays page) | Page loads, see list of essay topics | ✓ |
| 2 | Click "Làm bài" on any essay | Paywall does NOT show, essay page loads | ✓ |
| 3 | Go back to /tu-luan | Page reloads, see essay list | ✓ |
| 4 | Click "Làm bài" on different essay | Paywall does NOT show, essay page loads (2/2 uses) | ✓ |
| 5 | Go back to /tu-luan | Page reloads | ✓ |
| 6 | Click "Làm bài" on any essay | **PAYWALL SHOWS** with pricing tiers | ✓ |
| 7 | Check usage stats in localStorage | `essay.used_count = 2, essay.remaining = 0` | ✓ |

#### Feature 2: EXAM (Thi thử)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to /exams | Page loads, see list of exams | ✓ |
| 2 | Click "Thi thật" on any exam | Paywall does NOT show, exam page loads | ✓ |
| 3 | Go back to /exams | Page reloads | ✓ |
| 4 | Click "Luyện tập" on different exam | Paywall does NOT show, exam page loads (2/2 uses) | ✓ |
| 5 | Go back to /exams | Page reloads | ✓ |
| 6 | Click "Thi thật" on any exam | **PAYWALL SHOWS** with pricing tiers | ✓ |
| 7 | Verify: exam usage independent from essay | `exam.used_count = 2, essay.used_count = 2` | ✓ |

#### Feature 3: DOCUMENT (Tài liệu trắc nghiệm)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to /on-tap (Categories page) | Page loads, see subjects | ✓ |
| 2 | Click any subject | Documents list loads | ✓ |
| 3 | Click "Luyện tập" on first document | Paywall does NOT show, document loads | ✓ |
| 4 | Go back to /on-tap | Back to categories | ✓ |
| 5 | Select same/different subject | Documents list loads | ✓ |
| 6 | Click "Luyện tập" on different document | Paywall does NOT show (2/2 uses) | ✓ |
| 7 | Go back to /on-tap → select subject | Back to documents | ✓ |
| 8 | Click "Luyện tập" on any document | **PAYWALL SHOWS** | ✓ |
| 9 | Verify: independent from essay/exam | `document.used_count = 2, essay = 2, exam = 2` | ✓ |

#### Feature 4: FLASHCARD (Flashcard)

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to /flashcard | Page loads, see deck tabs | ✓ |
| 2 | Click "Study" on first official deck | Paywall does NOT show, study mode loads | ✓ |
| 3 | Go back (close study mode) | Back to deck list | ✓ |
| 4 | Click "Study" on different deck | Paywall does NOT show (2/2 uses) | ✓ |
| 5 | Go back | Back to deck list | ✓ |
| 6 | Click "Study" on any deck | **PAYWALL SHOWS** | ✓ |
| 7 | Verify: all 4 features at limit | All usage = 2/2 | ✓ |

**Expected Result**: 
- ✅ Each feature has independent 2-use limit
- ✅ Paywall appears on 3rd use
- ✅ Usage count persists in localStorage
- ✅ Paywall shows correct remaining uses count

---

### SCENARIO 2: Paywall Modal on 3rd Attempt

**Objective**: Verify paywall displays correctly with all options

**Setup**: Complete Scenario 1 up to any paywall appearance

**Test Steps**:

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Click "Làm bài" to trigger paywall (3rd use) | Paywall modal slides in with overlay | ✓ |
| 2 | Verify modal header | Shows "Unlock Premium Features" + feature name | ✓ |
| 3 | Verify 4 pricing cards visible | 1môn (49K), 3môn (99K), 5môn (129K), FULL (199K) | ✓ |
| 4 | Check "3 Môn Lẻ" is highlighted | "Most Popular" badge visible, different styling | ✓ |
| 5 | Click "Select" on 1 Môn plan | Plan highlights, subject checkboxes appear | ✓ |
| 6 | Verify subject list | Shows Triết học, Lịch sử Đảng, Địa lý | ✓ |
| 7 | Select 2 subjects | Checkboxes tick, "Selected" button shows | ✓ |
| 8 | Click "Proceed to Payment" | POST to /api/payments/sepay/create triggered | ✓ |
| 9 | Verify: login redirect if not auth | Redirects to /login?redirect=/payment | ✓ |
| 10 | Close modal (X button) | Modal closes smoothly, user back to page | ✓ |
| 11 | Click "Continue Free" button | Modal closes | ✓ |

**Expected Result**: 
- ✅ Paywall modal appears with smooth animation
- ✅ All 4 plans display correctly
- ✅ Popular plan highlighted
- ✅ Subject selection works
- ✅ Close/Continue buttons functional

---

### SCENARIO 3: Sepay Payment Flow (Sandbox)

**Objective**: Test complete payment and subscription creation

**Setup**: 
- User logged in (test@example.com)
- Has hit freemium limit on one feature
- Paywall modal showing

**Test Steps**:

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select "FULL" plan | No subject selection needed, "Selected" shows | ✓ |
| 2 | Click "Proceed to Payment" | Sepay page loads (mock in dev, real in prod) | ✓ |
| 3 | Check network: POST /api/payments/sepay/create | Request body: `{plan: "full", subjects: []}` | ✓ |
| 4 | Verify response | Returns transaction_id, reference_code, checkout_url | ✓ |
| 5 | Check DB: payment_transactions table | New row with status='pending' | ✓ |
| 6 | Simulate payment success | POST to /api/payments/sepay/webhook | ✓ |
| 7 | Webhook body | `{reference_code: "...", status: "success"}` | ✓ |
| 8 | Check DB: payment_transactions | Status changed to 'success' | ✓ |
| 9 | Check DB: subscriptions | New row created for user with plan='full' | ✓ |
| 10 | Visit /payment/callback?reference_code=...&status=success | Success page loads with auto-redirect | ✓ |
| 11 | Verify: message shows "Payment successful" | 🎉 emoji + success message | ✓ |
| 12 | Auto-redirect after 5s | Redirects to /on-tap | ✓ |

**Expected Result**: 
- ✅ Payment transaction created in DB
- ✅ Transaction status updated to 'success'
- ✅ Subscription row created
- ✅ User redirected to callback page
- ✅ Success message displays

---

### SCENARIO 4: Subscription Unlocks Features (Bypass Freemium)

**Objective**: Verify user with subscription can access features without limit

**Setup**: 
- Complete Scenario 3 (user has 'full' subscription)
- Browser localStorage still shows usage = 2/2

**Test Steps**:

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Hard refresh page (Ctrl+F5) | Clears cache, FreemiumContext reloads | ✓ |
| 2 | Call GET /api/subscriptions/me | Returns active subscription with plan='full' | ✓ |
| 3 | Navigate to /tu-luan (Essays) | Page loads | ✓ |
| 4 | Click "Làm bài" on essay | **NO PAYWALL**, essay page loads directly | ✓ |
| 5 | Go back, click "Làm bài" again | **NO PAYWALL**, essay page loads (subscription bypass) | ✓ |
| 6 | Verify: checkAccess returns reason='subscription' | Response shows `reason: "subscription"` | ✓ |
| 7 | Navigate to /exams | Page loads | ✓ |
| 8 | Click "Thi thật" multiple times | **NO PAYWALL**, exam loads every time | ✓ |
| 9 | Navigate to /on-tap → select subject → click document | **NO PAYWALL**, document loads | ✓ |
| 10 | Navigate to /flashcard → click deck | **NO PAYWALL**, study mode loads | ✓ |
| 11 | Verify: unlimited access to all 4 features | All features accessible without paywall | ✓ |
| 12 | Check GET /api/subscriptions/me | `can_access_all: true, days_remaining: 365` | ✓ |

**Expected Result**: 
- ✅ Subscription loaded from backend
- ✅ All 4 features accessible without limit
- ✅ checkAccess returns reason='subscription'
- ✅ No paywall modal shows
- ✅ Subscription info displays correctly

---

### SCENARIO 5: Limited Plan (1 Môn) with Subject Selection

**Objective**: Test subscription with specific subjects (not full access)

**Setup**: 
- Create new payment with "1month" plan
- Select only "Triết học" (subject_id = 1)
- Complete webhook to create subscription

**Test Steps**:

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Check DB: subscription.subjects | Stored as JSON: `["1"]` | ✓ |
| 2 | GET /api/subscriptions/me | Returns `subjects: [1]` | ✓ |
| 3 | Verify plan_display | Shows "1 Môn Lẻ" | ✓ |
| 4 | POST /api/subscriptions/check-subject with subject_id=1 | Returns `has_access: true` | ✓ |
| 5 | POST /api/subscriptions/check-subject with subject_id=2 | Returns `has_access: false` | ✓ |
| 6 | Verify: Triết học features accessible | Essays, exams, documents of Triết học load | ✓ |
| 7 | Verify: Other subjects blocked | POST /api/freemium/check-access from Lịch sử Đảng → shows paywall | ✓ |

**Expected Result**: 
- ✅ Limited subjects correctly enforced
- ✅ check-subject returns correct access
- ✅ Only subscribed subjects accessible
- ✅ Other subjects show upgrade prompt

---

## 🧪 Test Checklist

### Backend Tests
- [ ] Database migrations run successfully
- [ ] All 3 tables exist (subscriptions, freemium_usages, payment_transactions)
- [ ] Indices and foreign keys configured
- [ ] Models have all required methods
- [ ] All endpoints return correct status codes
- [ ] Freemium check increments usage
- [ ] Paywall returns pricing tiers
- [ ] Payment creates transaction
- [ ] Webhook creates subscription

### Frontend Tests
- [ ] Device ID generated and stored in localStorage
- [ ] Device ID persists across page reloads
- [ ] FreemiumProvider initializes on app load
- [ ] PaywallModal displays correctly
- [ ] All 4 features have access checks
- [ ] Usage stats loaded from backend
- [ ] Pricing tiers display in paywall
- [ ] Subject selection works
- [ ] Payment redirect to Sepay works

### Integration Tests
- [ ] 2 free uses enforced per feature
- [ ] 3rd use shows paywall
- [ ] Different devices have independent limits
- [ ] Each feature has independent counter
- [ ] Subscription bypasses freemium limit
- [ ] Limited plans enforce subject access
- [ ] Payment flow creates subscription
- [ ] Callback page shows success/failure
- [ ] Auto-redirect works

### Browser Tests (Chrome, Firefox, Safari)
- [ ] All animations smooth
- [ ] Modal responsive on mobile
- [ ] Touch interactions work
- [ ] localStorage works
- [ ] API calls successful
- [ ] Error handling graceful

### Edge Cases
- [ ] User without subscription can't access after 2 uses
- [ ] Subscription expired still blocks access (if date < today)
- [ ] Multiple payments don't duplicate subscriptions
- [ ] Device ID changes if fingerprint library fails
- [ ] Webhook validates signature (in production)
- [ ] Invalid plans reject gracefully
- [ ] Missing subjects handled correctly

---

## 🚀 Testing Workflow

### Manual Testing Steps

1. **Prepare Environment**
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

2. **Test Scenario 1** (All Features 2 Uses)
   - Clear cache/localStorage
   - Complete all 4 features to 3rd use
   - Verify paywall on each 3rd attempt

3. **Test Scenario 2** (Paywall Display)
   - Trigger paywall
   - Verify all plan options
   - Test subject selection
   - Test close/continue buttons

4. **Test Scenario 3** (Payment Flow)
   - Select plan and subjects
   - Click "Proceed to Payment"
   - Monitor network requests
   - Check database changes
   - Visit callback page

5. **Test Scenario 4** (Subscription Access)
   - Refresh page
   - Verify subscription loaded
   - Test all 4 features accessible
   - Verify no paywall shows

6. **Test Scenario 5** (Limited Plans)
   - Create limited subscription
   - Verify subject restrictions
   - Test check-subject endpoint

---

## 📊 Test Results

### Summary Template

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Two Free Uses | ⏳ | |
| 2. Paywall Display | ⏳ | |
| 3. Sepay Payment | ⏳ | |
| 4. Subscription Access | ⏳ | |
| 5. Limited Plans | ⏳ | |

### Known Issues / Limitations

(To be filled during testing)

---

## 🔧 Debugging

### Check FreemiumContext State
```javascript
// In browser console
const ctx = document.querySelectorAll('[data-testid="freemium-context"]');
console.log(ctx);
```

### Check Device ID
```javascript
localStorage.getItem('lingohub_device_id')
localStorage.getItem('lingohub_device_id_expiry')
```

### Check Usage Stats
```javascript
fetch('http://localhost:8000/api/freemium/usage-stats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ device_id: localStorage.getItem('lingohub_device_id') })
}).then(r => r.json()).then(console.log)
```

### Check Subscription
```javascript
fetch('http://localhost:8000/api/subscriptions/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
}).then(r => r.json()).then(console.log)
```

### View Database
```bash
# MySQL
mysql -u root lingohub
SELECT * FROM freemium_usages;
SELECT * FROM subscriptions;
SELECT * FROM payment_transactions;
```

---

## ✅ Success Criteria

All tests pass when:
1. ✅ Users get exactly 2 free uses per feature per device
2. ✅ Paywall shows on 3rd attempt with pricing & subject selection
3. ✅ Payment creates subscription in database
4. ✅ Subscription grants unlimited access to subscribed subjects
5. ✅ Different devices have independent limits
6. ✅ Each feature has independent counters
7. ✅ Limited plans enforce subject restrictions
8. ✅ Callback page shows payment status
9. ✅ All UI responsive on mobile/tablet/desktop
10. ✅ No console errors or warnings

---

## 📞 Support

For issues during testing:
1. Check browser console for errors
2. Check backend logs: `php artisan tinker`
3. Check network tab for failed requests
4. Clear cache and retry
5. Check database state
