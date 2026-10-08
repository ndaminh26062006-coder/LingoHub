# 📋 LingoHub Freemium System - Phương Án Chi Tiết (Updated)

## 🎯 Mục Tiêu
- IP-based + Device Fingerprinting: 2 lần FREE per device
- **Flashcard CŨNG tracked** (2 free uses, FREE khi có subscription)
- Subscription tiers: 1 môn (49K), 3 môn (99K), 5 môn (129K), FULL (199K)
- Payment: **Sepay integration** (thay VNPay - dễ hơn cho MVP)
- Stable & scalable architecture

---

## 🔧 CHANGES FROM ORIGINAL PLAN

### Flashcard Status
```
BEFORE: Free for all
AFTER:  2 free uses per device, FREE khi có subscription ✅
```

### Pricing Tiers (Updated)
```
1 môn lẻ:   49K  (instead of 19K)
3 môn lẻ:   99K  (instead of 39K)
5 môn lẻ:  129K  (instead of 49K)
FULL:      199K  (instead of 69K)
```

### Device Fingerprinting
```
✅ Use fingerprint.js library
✅ Generate on first visit
✅ Store in localStorage
✅ Send with every freemium check
```

### Payment Gateway
```
VNPay  → Complex, requires VNPAY merchant account
Sepay  ✅ → Simple, webhook-based, test-friendly
```

### Users Table (Existing)
```sql
id, email, password, name, role, created_at, updated_at
```

### New: Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  plan VARCHAR(20) -- '1month' | '3month' | '5month' | 'full'
  subjects JSON -- ["Triết học", "Lịch sử Đảng", ...]
  price INT -- 19000, 39000, 49000, 69000
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  payment_reference VARCHAR(255), -- VNPay txn_ref
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_active (user_id, is_active),
  INDEX idx_valid_until (valid_until)
);
```

### New: Freemium Usage Tracking
```sql
CREATE TABLE freemium_usages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ip_address VARCHAR(45), -- IPv4 or IPv6
  device_id VARCHAR(255), -- Browser fingerprint (device_id from localStorage)
  feature VARCHAR(50), -- 'essay' | 'exam' | 'document' (flashcard never tracked)
  used_count INT DEFAULT 1,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  UNIQUE KEY unique_ip_device (ip_address, device_id),
  INDEX idx_ip (ip_address),
  INDEX idx_used_count (used_count),
  INDEX idx_last_used (last_used_at)
);
```

### New: Payment Transactions (Optional, for analytics)
```sql
CREATE TABLE payment_transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  vnpay_txn_ref VARCHAR(255) UNIQUE,
  amount INT,
  plan VARCHAR(20),
  subjects JSON,
  status VARCHAR(20), -- 'pending' | 'success' | 'failed'
  vnpay_response JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_txn (user_id, status)
);
```

---

## 🔌 2. API ENDPOINTS

### Freemium Check Access
```
POST /api/freemium/check-access
Request:
{
  feature: 'essay' | 'exam' | 'document' | 'flashcard',
  subject_id: INT (optional, để check subscription subjects)
}

Response (Success - Allow):
{
  allowed: true,
  reason: 'free' | 'subscription' | 'flashcard_free',
  remaining_free_uses: 0-2,
  subscription: null | { plan, subjects, valid_until }
}

Response (Fail - Paywall):
{
  allowed: false,
  reason: 'exceeds_free_limit',
  remaining_free_uses: 0,
  pricing_tiers: [
    { plan: '1month', price: 19000, duration: '1 tháng' },
    { plan: '3month', price: 39000, duration: '3 tháng' },
    { plan: '5month', price: 49000, duration: '5 tháng' },
    { plan: 'full', price: 69000, duration: 'Vĩnh viễn' }
  ]
}
```

### Get Subscription Info
```
GET /api/subscriptions/me
Response:
{
  subscription: {
    plan: '1month' | '3month' | '5month' | 'full',
    subjects: ['Triết học', 'Lịch sử Đảng', ...],
    valid_until: '2026-12-31',
    is_active: true,
    days_remaining: 45
  }
}
```

### Create Payment (VNPay)
```
POST /api/payments/vnpay/create
Request:
{
  plan: '1month' | '3month' | '5month' | 'full',
  subjects: ['Triết học', ...], (empty = FULL plan)
  redirect_url: 'http://localhost:5173/payment/callback'
}

Response:
{
  payment_url: 'https://sandbox.vnpayment.vn/payportal/...',
  txn_ref: 'unique_transaction_id'
}
```

### VNPay Callback
```
GET /api/payments/vnpay/callback?vnp_ResponseCode=00&vnp_TxnRef=...
- Verify signature
- Update subscriptions table
- Redirect FE to /payment/success or /payment/failed
```

---

## 🧠 3. FRONTEND ARCHITECTURE

### Global State: `FreemiumContext`
```javascript
// contexts/FreemiumContext.jsx
{
  // Freemium status
  isFreemium: boolean, // true = chưa login hoặc login nhưng ko sub
  usedCount: 0-2,
  
  // Subscription (if any)
  subscription: {
    plan: '1month' | '3month' | '5month' | 'full' | null,
    subjects: string[],
    validUntil: Date,
    isActive: boolean,
    daysRemaining: number
  },
  
  // Paywall state
  showPaywall: boolean,
  paywalledFeature: 'essay' | 'exam' | 'document',
  pricingTiers: [...],
  
  // Methods
  checkAccess(feature, subjectId) → Promise<bool>,
  closePaywall(),
  purchaseSubscription(plan, subjects),
  loadSubscription() // on app init
}
```

### Custom Hook: `useFreemium`
```javascript
// hooks/useFreemium.js
function useFreemium(feature) {
  const { isFreemium, usedCount, showPaywall, subscription } = useContext(FreemiumContext);
  
  async function checkAccess(subjectId) {
    const res = await api.post('/freemium/check-access', {
      feature,
      subject_id: subjectId
    });
    
    if (!res.allowed) {
      // Trigger paywall
      dispatch({ type: 'SHOW_PAYWALL', feature, tiers: res.pricing_tiers });
      return false;
    }
    return true;
  }
  
  return {
    allowed: isFreemium ? usedCount < 2 : true,
    usedCount,
    subscription,
    checkAccess,
    isFlashcardFree: true // Always
  };
}
```

### PaywallModal Component
```javascript
// components/PaywallModal.jsx
<Modal>
  <h2>🔒 Chức năng yêu cầu đăng ký</h2>
  <p>Bạn đã dùng 2 lần FREE. Hãy chọn gói để tiếp tục</p>
  
  <Grid>
    {pricingTiers.map(tier => (
      <Card>
        <h3>{tier.plan_display}</h3>
        <p>{tier.price}đ / {tier.duration}</p>
        <button onClick={() => handlePurchase(tier.plan)}>
          Chọn gói
        </button>
      </Card>
    ))}
  </Grid>
  
  <button onClick={closePaywall}>Hủy</button>
</Modal>
```

### Integration in Pages
```javascript
// CategoriesPage, ExamsPage, EssaysPage
function EssaysPage() {
  const { checkAccess } = useFreemium('essay');
  
  const handleSelectSubject = async (subject) => {
    const allowed = await checkAccess(subject.id);
    if (!allowed) return; // Paywall triggered automatically
    
    // Proceed with subject selection
    selectSubject(subject);
  };
  
  return (
    <>
      {/* Page content */}
    </>
  );
}
```

### Payment Flow Page
```javascript
// pages/PaymentCallbackPage.jsx
- Detect VNPay redirect
- Verify payment
- Update subscription
- Redirect to success/failed page
```

---

## 💳 4. PAYMENT FLOW (Sepay)

### Sepay vs VNPay Comparison
| Aspect | Sepay | VNPay |
|--------|-------|-------|
| Setup | 5 min | 30 min + documents |
| Sandbox | ✅ Free | ❌ Limited |
| Webhook | Simple | Complex |
| Fee | ~2-3% | ~1-2% |
| For MVP | ✅ Best | ⚠️ Later |

### Sepay Payment Flow
```
1. User clicks "Thanh toán" → FE calls POST /payments/sepay/create
2. BE creates transaction, generates payment link
3. FE redirects user to Sepay checkout
4. User pays via bank transfer (instant in sandbox)
5. Sepay sends webhook to BE /payments/sepay/webhook
6. BE verifies webhook signature → update subscriptions
7. FE polls /payments/sepay/status/{txn_ref} until status=success
8. User sees success page, subscription unlocked
```

### Sepay API Integration
```
POST https://sandbox.sepay.vn/api/transfers/create
Headers:
  - Authorization: Bearer {API_KEY}
  - Content-Type: application/json

Request:
{
  to_bank_code: "970422", // Vietcombank
  to_account_number: "YOUR_ACCOUNT",
  amount: 49000,
  description: "LingoHub - 1 môn lẻ",
  reference_code: "unique_txn_ref"
}

Response:
{
  id: "transfer_id",
  reference_code: "txn_ref",
  status: "pending",
  checkout_url: "https://sepay.vn/checkout/..." // Redirect here
}
```

### Webhook (Sepay → BE)
```
POST /api/payments/sepay/webhook
Body:
{
  id: "transfer_id",
  reference_code: "txn_ref",
  status: "success" | "failed" | "pending",
  amount: 49000,
  ...
}

BE Actions:
1. Verify webhook signature (HMAC)
2. Find transaction by reference_code
3. If status=success → Create subscription
4. Return { success: true }
```

---

## 🔐 5. SECURITY & VALIDATION

### BE Validations
```
✅ Verify VNPay signature (HMAC-SHA512)
✅ Check user owns transaction before updating subscription
✅ Validate subjects exist in database
✅ Check IP + device_id collision (fraud detection)
✅ Rate limit /freemium/check-access (prevent abuse)
✅ Validate subscription validity before allowing access
```

### FE Validations
```
✅ Store device_id in localStorage (persistent)
✅ Generate device_id on first visit (fingerprint.js)
✅ Send IP via API (backend will get actual IP from request)
✅ Cache subscription status locally + refresh on tab focus
✅ Prevent multiple Paywall modals
```

---

## 🧪 6. TESTING STRATEGY

### Manual Testing Checklist
```
[ ] Test 2 FREE uses per IP (different devices)
[ ] Test paywall appears on 3rd attempt
[ ] Test VNPay sandbox payment flow
[ ] Test subscription subjects filtering
[ ] Test subscription expiry (valid_until < today)
[ ] Test flashcard access without subscription
[ ] Test multiple subscriptions edge cases
[ ] Test payment callback validation
[ ] Test cancellation/refund flow (future)
```

### Automation
```
• Unit tests: useFreemium hook, PaywallModal
• Integration tests: API endpoints, database queries
• E2E tests: Full user flow (free → paywall → payment → access)
```

---

## 📈 7. MONITORING & ANALYTICS

### Metrics to Track
```
• Total free users (IP-based)
• Free uses per IP
• Subscription conversions (% of paywall → purchase)
• Revenue per tier
• Flashcard usage (subset of total users)
• Failed payments
• Churn rate (subscriptions expired)
```

### Dashboards
```
• Admin: Revenue, active subscriptions, free users
• Analytics: Conversion funnel (free → paywall → payment)
```

---

## 🚀 8. DEPLOYMENT CHECKLIST

### Before Go-Live
```
[ ] Database migrations applied (all 3 new tables)
[ ] VNPay production credentials configured
[ ] Environment variables set (.env)
[ ] CORS configured for payment callback
[ ] Rate limiting enabled on /freemium/check-access
[ ] Payment webhook retry logic implemented
[ ] Error logging & alerting setup
[ ] Backup strategy for payment data
[ ] Load testing (concurrent users, concurrent payments)
[ ] Security audit (SQL injection, XSS, CSRF)
[ ] Documentation updated
```

---

## 📞 9. ROLLBACK PLAN

If issues arise:
```
1. Disable paywall (set FREEMIUM_ENABLED=false)
2. Allow all users access temporarily
3. Debug issues
4. Redeploy with fixes
5. Re-enable gradually (canary deployment)
```

---

## 💡 10. FUTURE ENHANCEMENTS

```
• Promo codes / discounts
• Annual subscription discount
• Family plans
• Trial period (7 days before paywall)
• Subscription management UI (users can switch plans)
• Refund/cancellation flow
• Payment method options (bank transfer, e-wallet)
• Multi-language pricing
```

---

## ✅ SUMMARY

| Component | Status | Priority |
|-----------|--------|----------|
| DB Schema | Design | HIGH |
| API Endpoints | Design | HIGH |
| useFreemium Hook | Design | HIGH |
| PaywallModal | Design | HIGH |
| VNPay Integration | Design | MEDIUM |
| Payment Callback | Design | MEDIUM |
| Testing | Plan | MEDIUM |
| Monitoring | Plan | LOW |

**Ready to implement? Start with Task #1: Database migrations & API contracts.**
