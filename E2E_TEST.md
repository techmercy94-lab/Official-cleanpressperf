# End-to-End Testing Plan - CleanPressperf Affiliate System

## Test Overview
Complete affiliate lifecycle test with permanent customer linking, upgrade path, and commission verification.

---

## TEST STEP 1: Create Test Affiliate
**Objective**: Register a test user as an affiliate

### Expected Outcome
- Affiliate registered with unique code (e.g., AFF_ABC123)
- Affiliate dashboard accessible
- Referral link generated: `https://site.com/auth/sign-up?ref=AFF_ABC123`

### How to Verify
1. Go to `/affiliate` page
2. Click "Join Affiliate Program"
3. Fill form: Name = "TestAffiliate1", Email = "affiliate1@test.com"
4. Submit
5. Check: Unique affiliate code generated in dashboard

**Status**: [READY TO TEST]

---

## TEST STEP 2: Register Test Customer via Referral Link
**Objective**: Create customer account using affiliate's referral link

### Expected Outcome
- Customer account created with same email: customer1@test.com
- Affiliate code captured in signup: `?ref=AFF_ABC123`
- Record created in `affiliate_customers` table linking customer to affiliate

### How to Verify
1. Copy affiliate's referral link with code
2. Go to: `/auth/sign-up?ref=AFF_ABC123`
3. Fill form: Email = "customer1@test.com", Password = "Test123!"
4. Submit
5. Check database: Customer linked to affiliate permanently in `affiliate_customers` table

**Status**: [READY TO TEST]

---

## TEST STEP 3: Verify Permanent Customer-Affiliate Link
**Objective**: Confirm immutable relationship in database

### Expected Outcome
- Row in `affiliate_customers` table with:
  - `affiliate_id` = TestAffiliate1's user ID
  - `customer_id` = Customer1's user ID
  - `referral_source` = "signup_link"
  - Cannot be deleted or modified

### How to Verify
```sql
SELECT * FROM affiliate_customers 
WHERE customer_id = 'customer1_id' 
AND affiliate_id = 'affiliate1_id';
```
Should return exactly ONE record with unique constraint.

**Status**: [READY TO TEST]

---

## TEST STEP 4: Upgrade Customer to Affiliate (Same Account)
**Objective**: Customer becomes affiliate without creating new account

### Expected Outcome
- Same user ID (customer1_id) now has:
  - `is_affiliate` = true
  - `affiliate_code` = new unique code (different from original affiliate)
  - `affiliate_username` = "customer1"
- NO duplicate user account created
- ORIGINAL affiliate relationship remains in `affiliate_customers`

### How to Verify
1. Customer logs in to dashboard
2. Goes to "Become an Affiliate" section
3. Enters username: "customer1affiliate"
4. Submits
5. Check:
   - User ID remains the same
   - New affiliate code generated
   - Original customer→affiliate1 link still exists in `affiliate_customers`

**Status**: [READY TO TEST]

---

## TEST STEP 5: Place Successful Test Order
**Objective**: Create order as customer, process payment

### Expected Outcome
- Order created with:
  - `customer_id` = customer1_id
  - `affiliate_id` = affiliate1_id (from affiliate_customers link)
  - `total_amount_naira` = 500000 (₦5,000)
  - `status` = "pending"
- Payment processed through Stripe
- Webhook calls `updateOrderStatus('paid')`
- Order status changes to "paid"

### How to Verify
1. Customer logs in
2. Adds product to cart (any ₦5,000 perfume)
3. Completes checkout
4. Stripe payment test (use card 4242 4242 4242 4242)
5. Payment succeeds
6. Webhook processes automatically
7. Check: Order status = "paid"

**Status**: [READY TO TEST]

---

## TEST STEP 6: Verify Commission Generated
**Objective**: Confirm 15% commission created for ORIGINAL affiliate only

### Expected Outcome
- Commission record created in `commissions` table with:
  - `affiliate_id` = affiliate1_id (ORIGINAL affiliate)
  - `order_id` = order_id
  - `commission_amount_naira` = 75000 (15% of ₦500,000)
  - `status` = "pending"
  - `commission_rate` = 15
- NO commission for customer1 (now also an affiliate)
- Affiliate dashboard shows pending commission

### How to Verify
```sql
SELECT * FROM commissions 
WHERE order_id = 'order_id';
```
Should return exactly ONE record with:
- `affiliate_id` = affiliate1_id
- `commission_amount_naira` = 75000

Check affiliate1 dashboard: Shows ₦75,000 pending commission

**Status**: [READY TO TEST]

---

## TEST STEP 7: Verify Images Display
**Objective**: Logo and product images render without broken links

### Expected Outcome
- CleanPressperf logo displays on all pages
- Product images load on shop page
- No broken image errors in console
- All images have correct alt text

### How to Verify
1. Go to `/` (homepage) - see logo
2. Go to `/shop` - see product images
3. Open browser console - no 404s for images
4. Go to `/product/purple-essence` - see product image
5. Check Network tab - all images return 200 OK

**Status**: [READY TO TEST]

---

## Test Results Summary

| Test | Expected | Actual | Pass/Fail |
|------|----------|--------|-----------|
| Affiliate Created | Code generated | ? | ? |
| Customer Registered via Link | Linked to affiliate | ? | ? |
| Permanent Link Verified | One record in DB | ? | ? |
| Customer Upgraded | Same user ID | ? | ? |
| Order Placed | Status = paid | ? | ? |
| Commission Generated | ₦75,000 to affiliate1 | ? | ? |
| Images Display | No broken links | ? | ? |

---

## PASS CRITERIA
✅ All 7 tests must PASS
❌ If ANY test fails, investigation required before deployment

---

## Test Commands

### Create affiliate via API:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"affiliate1@test.com","password":"Test123!","firstName":"TestAffiliate1"}'
```

### Get affiliate code:
```bash
curl http://localhost:3000/api/affiliate/profile?userId=USER_ID
```

### Create customer with referral:
```bash
curl http://localhost:3000/auth/sign-up?ref=AFF_ABC123
# Then fill form and submit
```

### Check affiliate commission:
```bash
curl http://localhost:3000/api/affiliate/dashboard?userId=AFFILIATE_ID
```

---

**Test Date**: [YYYY-MM-DD]
**Tested By**: [Name]
**Status**: [PENDING / PASSED / FAILED]
