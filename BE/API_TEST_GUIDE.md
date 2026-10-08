# 🧪 LingoHub Freemium API Testing Guide

## Setup

### 1. Start Backend Server
```bash
cd c:\laragon\www\LingoHub\BE
php artisan serve
# Server runs on http://localhost:8000
```

### 2. Import Postman Collection
- Open Postman
- File → Import → Select `postman_collection.json`
- Update `YOUR_API_TOKEN` with actual token from login response
- Update `YOUR_ADMIN_TOKEN` if testing admin endpoints

---

## 🔐 Test Scenarios

### SCENARIO 1: Freemium Limit (2 Free Uses)

#### Step 1: Get Pricing Tiers
```
GET /api/freemium/pricing
Expected: 4 pricing tiers [1month, 3month, 5month, full]
```

#### Step 2: First Free Use
```
POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "test_device_001"
}

Expected Response (200 OK):
{
  "can_access": true,
  "reason": "freemium",
  "message": "Free use 1 of 2",
  "remaining_uses": 1
}
```

#### Step 3: Second Free Use (Same Device)
```
POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "test_device_001"
}

Expected Response (200 OK):
{
  "can_access": true,
  "reason": "freemium",
  "message": "Free use 2 of 2",
  "remaining_uses": 0
}
```

#### Step 4: Third Use (Should Deny + Show Pricing)
```
POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "test_device_001"
}

Expected Response (403 FORBIDDEN):
{
  "can_access": false,
  "reason": "limit_exceeded",
  "message": "You have used all free attempts. Please subscribe to continue.",
  "used_count": 2,
  "limit": 2,
  "pricing": [
    {
      "id": "1month",
      "name": "1 Môn Lẻ",
      "price": 49000
    },
    ...
  ]
}
```

#### Step 5: Check Usage Stats
```
POST /api/freemium/usage-stats
Body: {
  "device_id": "test_device_001"
}

Expected Response:
{
  "device_id": "test_device_001",
  "ip_address": "127.0.0.1",
  "stats": {
    "essay": {
      "used_count": 2,
      "limit": 2,
      "remaining": 0,
      "is_exceeded": true
    },
    "exam": {
      "used_count": 0,
      "limit": 2,
      "remaining": 2,
      "is_exceeded": false
    },
    ...
  }
}
```

---

### SCENARIO 2: Subscription Access (Bypass Freemium)

#### Step 1: Register & Login User
```
POST /api/auth/register
Body: {
  "name": "Premium User",
  "email": "premium@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Save the API token from response
```

#### Step 2: Manually Create Subscription (via DB or Seeder)
```
INSERT INTO subscriptions 
VALUES (
  NULL, 1, 'full', NULL, 199000,
  '2026-10-07', '2027-10-07', 1, NULL, NOW(), NOW()
)
```

#### Step 3: Check Access (Should Use Subscription)
```
POST /api/freemium/check-access
Header: Authorization: Bearer {token}
Body: {
  "feature": "essay",
  "device_id": "test_device_002"
}

Expected Response (200 OK):
{
  "can_access": true,
  "reason": "subscription",
  "message": "Access granted via subscription",
  "subscription": {
    "plan": "Full Access",
    "valid_until": "2027-10-07"
  }
}
```

#### Step 4: Get User's Subscription
```
GET /api/subscriptions/me
Header: Authorization: Bearer {token}

Expected Response:
{
  "has_subscription": true,
  "subscription": {
    "id": 1,
    "plan": "full",
    "plan_display": "Full Access",
    "price": 199000,
    "subjects": null,
    "valid_from": "2026-10-07",
    "valid_until": "2027-10-07",
    "days_remaining": 365,
    "can_access_all": true
  }
}
```

---

### SCENARIO 3: Payment Flow (Mock Sepay)

#### Step 1: Create Payment Transaction
```
POST /api/payments/sepay/create
Header: Authorization: Bearer {token}
Body: {
  "plan": "1month",
  "subjects": [1, 2]
}

Expected Response (200 OK):
{
  "success": true,
  "transaction_id": 1,
  "reference_code": "LINGOHUB_1_ABC123DEF_1234567890",
  "amount": 49000,
  "plan": "1month",
  "checkout_url": "http://localhost:8000/payment/checkout?ref=...",
  "sepay_transfer_id": "mock_transfer_1234567890"
}

Save: reference_code, transaction_id
```

#### Step 2: Get Payment Status (Pending)
```
GET /api/payments/sepay/status/LINGOHUB_1_ABC123DEF_1234567890
Expected: status = "pending"
```

#### Step 3: Simulate Webhook Success
```
POST /api/payments/sepay/webhook
Header: X-Sepay-Signature: {valid_signature}
Body: {
  "reference_code": "LINGOHUB_1_ABC123DEF_1234567890",
  "status": "success",
  "amount": 49000,
  "id": "mock_transfer_1234567890"
}

Note: For now, webhook signature verification will fail in dev
      → Need to update webhook to skip verification in local env
```

#### Step 4: Get Payment Status (Success)
```
GET /api/payments/sepay/status/LINGOHUB_1_ABC123DEF_1234567890
Expected: status = "success"
```

#### Step 5: Verify Subscription Created
```
GET /api/subscriptions/me
Header: Authorization: Bearer {token}

Expected: 
- subscription is now active
- valid_from = today
- valid_until = today + 30 days (for 1month plan)
```

---

### SCENARIO 4: Different Devices = Independent Limits

#### Device A: 2 Uses
```
POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "device_A"
}
→ Use 1 of 2 ✓

POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "device_A"
}
→ Use 2 of 2 ✓

POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "device_A"
}
→ DENIED (Paywall) ✗
```

#### Device B: Fresh Limit
```
POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "device_B"
}
→ Use 1 of 2 ✓ (Different device, fresh quota!)
```

---

### SCENARIO 5: Feature Independence

Each feature has its own 2-use limit:

```
POST /api/freemium/check-access
Body: {
  "feature": "essay",
  "device_id": "device_001"
}
→ essay use 1 of 2 ✓

POST /api/freemium/check-access
Body: {
  "feature": "exam",
  "device_id": "device_001"
}
→ exam use 1 of 2 ✓ (Different feature, separate counter!)

POST /api/freemium/check-access
Body: {
  "feature": "flashcard",
  "device_id": "device_001"
}
→ flashcard use 1 of 2 ✓
```

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
**Cause**: Invalid or missing API token
**Fix**: 
- Login again to get new token
- Update `Authorization: Bearer {token}` header
- Ensure token hasn't expired

### Issue: Webhook signature verification fails
**Cause**: Signature not provided or incorrect
**Fix**:
- In `PaymentController::handleWebhook()`, add dev bypass:
```php
if (app()->environment('local')) {
    // Skip signature check in development
} else {
    if (!$this->verifyWebhookSignature($signature, $body)) {
        return response()->json(['error' => 'Invalid signature'], 401);
    }
}
```

### Issue: Subscription not created after payment
**Cause**: PaymentController not calling createSubscription
**Fix**:
- Check `handleWebhook()` response status
- Verify transaction status in DB is 'success'
- Check subscription table for new entry

### Issue: Database tables don't exist
**Cause**: Migrations not run
**Fix**:
```bash
php artisan migrate
```

---

## 📋 Checklist

- [ ] All 3 migrations run successfully
- [ ] `/api/freemium/pricing` returns 4 tiers
- [ ] 2 free uses work (1st, 2nd allow; 3rd denies)
- [ ] Different devices have independent limits
- [ ] Each feature has its own counter
- [ ] Subscription bypasses freemium limit
- [ ] Payment creates transaction with reference_code
- [ ] Webhook creates subscription on success
- [ ] Admin reset endpoint works (dev only)
- [ ] All responses have correct status codes

---

## 🔗 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/freemium/pricing` | No | Get pricing tiers |
| POST | `/api/freemium/check-access` | No | Check freemium access |
| POST | `/api/freemium/usage-stats` | No | Get device usage stats |
| DELETE | `/api/admin/freemium/reset/{device_id}` | Admin | Reset usage (dev) |
| GET | `/api/subscriptions/me` | Yes | Get my subscription |
| POST | `/api/subscriptions/check-subject` | Yes | Check subject access |
| GET | `/api/subscriptions/history` | Yes | Get subscription history |
| POST | `/api/payments/sepay/create` | Yes | Create payment |
| GET | `/api/payments/sepay/status/{ref}` | Yes | Get payment status |
| POST | `/api/payments/sepay/webhook` | No | Sepay webhook |
| GET | `/api/payments/history` | Yes | Get payment history |
