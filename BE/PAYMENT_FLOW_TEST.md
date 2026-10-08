# Sepay Payment Integration Testing Guide

## Overview
This guide explains how to test the complete Sepay payment integration flow for LingoHub subscription system.

## Current Setup
- **API Key**: `0FKUQXDC8KVDJILS3LCX2CZQRFOBQYYNVCJ1RI6FUPJHZ0OWABNP6XTIOE3N4AHM`
- **Webhook URL**: `https://unhook-engulf-slackness.ngrok-free.dev/api/sepay/webhook`
- **Bank Account**: `0772052220` (MB Bank)
- **Account Name**: `LE THI KIEU VY`
- **Pricing**:
  - 1 Month: 49,000 VND
  - 3 Months: 99,000 VND
  - 5 Months: 129,000 VND
  - Full (36,500 days): 199,000 VND

## Test Scenarios

### Scenario 1: Create Payment Request (Frontend → Backend)

**Endpoint**: `POST /api/payments/sepay/create`
**Auth**: Required (Bearer token)
**Body**:
```json
{
  "plan": "1month"
}
```

**Expected Response**:
```json
{
  "success": true,
  "transaction_id": 1,
  "reference_code": "LINGOHUB_1_abc123def_1234567890",
  "amount": 49000,
  "plan": "1month",
  "checkout_url": "https://vietqr.app/img?bank=MBBank&acc=0772052220&...",
  "bank_account": "0772052220",
  "account_name": "LE THI KIEU VY",
  "sepay_transfer_id": "mock_transfer_1234567890"
}
```

**Steps to Test**:
1. Login to the frontend at `http://localhost:5173`
2. Click on your profile dropdown (top right)
3. Click "⭐ Nâng cấp tài khoản"
4. PaymentModal opens with plan selection
5. Select "1 Tháng" plan
6. Click "Tiếp tục"
7. QR code should display with bank payment info

**Database Check**:
```sql
SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 1;
```
Expected: New row with `status='pending'`

---

### Scenario 2: Check Payment Status

**Endpoint**: `GET /api/payments/sepay/status/{reference_code}`
**Auth**: Required (Bearer token)

**Example**:
```
GET /api/payments/sepay/status/LINGOHUB_1_abc123def_1234567890
```

**Expected Response**:
```json
{
  "reference_code": "LINGOHUB_1_abc123def_1234567890",
  "status": "pending",
  "amount": 49000,
  "plan": "1month",
  "created_at": "2024-09-29T...",
  "updated_at": "2024-09-29T..."
}
```

**Frontend Behavior**:
- Modal shows "Đang chờ xác nhận thanh toán..."
- Status checks every 3 seconds automatically
- Shows manual check button

---

### Scenario 3: Simulate Payment Success via Webhook

**Endpoint**: `POST /api/payments/sepay/webhook`
**Auth**: None required (public endpoint)

**Send Request** (use Postman or curl):
```bash
curl -X POST http://localhost:8000/api/payments/sepay/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "reference_code": "LINGOHUB_1_abc123def_1234567890",
    "status": "success",
    "amount": 49000,
    "transaction_date": "2024-09-29T12:00:00Z"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Payment successful"
}
```

**Database Check After Webhook**:
```sql
SELECT * FROM payment_transactions WHERE reference_code = 'LINGOHUB_1_abc123def_1234567890';
SELECT * FROM subscriptions WHERE user_id = 1;
```

Expected:
- `payment_transactions.status` → `'success'`
- `subscriptions` → New row created with `is_active=true`

**Frontend Behavior**:
- Modal automatically transitions to "Thanh toán thành công!" screen
- Shows checkmark icon with animation
- Auto-closes after 2 seconds and reloads page

---

### Scenario 4: Manual Status Check

While in waiting screen, click "🔄 Kiểm tra lại" button.

Expected:
- API call to `/api/payments/sepay/status/{reference_code}`
- If status is "success", transitions to success screen
- If still "pending", stays on waiting screen

---

## End-to-End Test Steps

### Step 1: Prepare Database
```sql
-- Clear old test data
DELETE FROM subscriptions WHERE user_id = 1;
DELETE FROM payment_transactions WHERE user_id = 1;
```

### Step 2: Create Test Payment
1. Open frontend at `http://localhost:5173`
2. Login with test account
3. Open profile dropdown → "Nâng cấp tài khoản"
4. Select "1 Tháng" plan
5. Click "Tiếp tục"
6. Note the QR URL in browser devtools Network tab

### Step 3: Verify Transaction Created
```bash
cd c:\laragon\www\LingoHub\BE
php artisan tinker
>>> $txn = App\Models\PaymentTransaction::latest()->first();
>>> $txn->reference_code;
>>> $txn->status; // should be 'pending'
```

### Step 4: Simulate Payment Success
```bash
curl -X POST http://localhost:8000/api/payments/sepay/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "reference_code": "<from-step-3>",
    "status": "success",
    "amount": 49000,
    "transaction_date": "2024-09-29T12:00:00Z"
  }'
```

### Step 5: Verify Subscription Created
```bash
>>> $sub = App\Models\Subscription::where("user_id", 1)->first();
>>> $sub->plan; // should be '1month'
>>> $sub->is_active; // should be true
>>> $sub->valid_until; // should be 30 days from now
```

---

## API Routes Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/payments/sepay/create` | Yes | Create payment request & QR |
| GET | `/api/payments/sepay/status/{ref}` | Yes | Check payment status |
| POST | `/api/payments/sepay/webhook` | No | Webhook from Sepay/manual test |
| GET | `/api/payments/history` | Yes | Get user's payment history |

---

## Troubleshooting

### Issue: "Failed to load resource: 500"
1. Check BE logs: `tail -f storage/logs/laravel.log`
2. Verify auth token is included in Authorization header
3. Check API key and env vars are set

### Issue: Webhook not updating subscription
1. Verify webhook endpoint is public (no auth middleware)
2. Check reference_code matches a pending transaction
3. View logs: `tail -f storage/logs/laravel.log`

### Issue: QR code not showing
1. Check checkout_url in response
2. Verify Sepay API key is valid
3. Falls back to VietQR mock image if API fails

### Issue: Status keeps showing "pending"
1. Re-run webhook with same reference_code
2. Check DB: `SELECT * FROM payment_transactions WHERE reference_code = '...';`
3. Verify webhook was received

---

## Local Testing with ngrok

If you want to test with real ngrok webhook URL:

1. **Ensure ngrok tunnel is running**:
   ```bash
   ngrok http 8000
   ```

2. **Update .env**:
   ```
   SEPAY_WEBHOOK_URL=https://unhook-engulf-slackness.ngrok-free.dev/api/sepay/webhook
   ```

3. **Test webhook via ngrok URL**:
   ```bash
   curl -X POST https://unhook-engulf-slackness.ngrok-free.dev/api/payments/sepay/webhook \
     -H "Content-Type: application/json" \
     -d '{...}'
   ```

4. **Watch logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

---

## Next Steps

1. **Real Sepay API**: When ready, update `SepayService::generateQR()` with real API integration
2. **Webhook Signature Verification**: Implement production signature verification
3. **Email Notifications**: Send confirmation email after successful payment
4. **Payment History Page**: Create page showing user's past transactions
5. **Admin Dashboard**: Add payment metrics and analytics

