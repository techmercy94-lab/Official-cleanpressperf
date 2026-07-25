# CleanPressperf Testing Guide - Affiliate & Commission System

## Prerequisites
- [ ] App running locally or deployed
- [ ] Supabase project connected
- [ ] Stripe keys configured
- [ ] Database seeded with products

## Test Scenario 1: Lifetime Affiliate Customer Tracking

### Setup
```
Affiliate (Terry): Creates account, joins program
Customer (Sarah): Signs up via Terry's referral link
```

### Steps
1. **Create Affiliate**
   ```
   - Go to /affiliate
   - Click "Join Affiliate Program"
   - Email: terry@example.com / Password: Terry123!
   - Username: terry_affiliate
   - Bio: "I love sharing quality perfumes"
   - Click "Join Program"
   ```

2. **Get Referral Link**
   ```
   - Go to /affiliate/dashboard
   - Copy affiliate code (e.g., AFF_ABC123)
   - Referral link: https://yoursite.com/auth/sign-up?ref=AFF_ABC123
   ```

3. **Customer Signs Up via Referral**
   ```
   - Open referral link in new browser/incognito
   - Email: sarah@example.com / Password: Sarah123!
   - First name: Sarah
   - Click "Sign Up"
   ```

4. **Verify Permanent Linking**
   ```
   - In Supabase dashboard:
   - Query: SELECT * FROM affiliate_customers
   - Should show: affiliate_id (Terry) → customer_id (Sarah)
   - This link is permanent and immutable
   ```

### Expected Result
✅ Sarah's account is permanently linked to Terry's affiliate account
✅ All future Sarah purchases attribute commissions to Terry
✅ Link persists even if affiliate_customers record was created

---

## Test Scenario 2: Commission Generation on Paid Orders

### Setup
```
Same as above: Terry (affiliate), Sarah (referred customer)
```

### Steps
1. **Sarah Places Order**
   ```
   - Log in as Sarah
   - Browse shop (/shop)
   - Add Purple Essence (₦5,000) to cart
   - Go to checkout
   - Use Stripe test card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Complete payment
   ```

2. **Mark Order as Paid**
   ```
   Note: In production, Stripe webhook does this automatically
   For testing: Use admin action or Supabase directly
   
   - In Supabase:
   - Query: UPDATE orders SET status='paid' WHERE id={order_id}
   OR use admin dashboard to mark as paid
   ```

3. **Verify Commission Created**
   ```
   - In Supabase:
   - Query: SELECT * FROM commissions WHERE order_id = {order_id}
   - Should show:
     * affiliate_id: Terry's ID
     * commission_rate: 15
     * commission_amount_naira: 75000 (₦5,000 × 15%)
     * status: 'pending'
   ```

4. **Verify Affiliate Sees Commission**
   ```
   - Log in as Terry
   - Go to /affiliate/dashboard
   - Should show:
     * 1 conversion (Sarah's purchase)
     * Pending Commission: ₦75,000
     * Total Earnings: ₦75,000
   ```

### Expected Result
✅ Commission created automatically when order marked paid
✅ Amount calculated correctly (15% of ₦5,000)
✅ Affiliate dashboard reflects pending commission
✅ Commission tied to correct affiliate (Terry)

---

## Test Scenario 3: Multiple Orders from Same Customer

### Setup
```
Continuing from Scenario 2:
Terry (affiliate), Sarah (referred customer with 1 purchase)
```

### Steps
1. **Sarah Places Second Order**
   ```
   - Log in as Sarah (still same account)
   - Order: Azure Wave (₦5,000)
   - Complete payment (mark as paid)
   ```

2. **Verify Second Commission**
   ```
   - In Supabase:
   - Query: SELECT * FROM commissions WHERE affiliate_id = {terry_id}
   - Should show 2 commissions:
     * First: ₦75,000 (pending)
     * Second: ₦75,000 (pending)
     * Total: ₦150,000
   ```

3. **Verify Affiliate Dashboard**
   ```
   - Log in as Terry
   - Dashboard shows:
     * 1 customer referred (Sarah)
     * 2 conversions (2 purchases)
     * ₦150,000 pending commission
   ```

### Expected Result
✅ Lifetime tracking works - same customer linked across multiple orders
✅ Commissions accumulate indefinitely
✅ Each order generates separate commission
✅ Affiliate dashboard accurately totals all commissions

---

## Test Scenario 4: Existing Customer Upgrade to Affiliate

### Setup
```
- Have a customer account (not affiliate)
- Want to convert to affiliate without creating new account
```

### Steps
1. **Create Test Customer**
   ```
   - Sign up: john@example.com / John123!
   - Make a purchase to establish as customer
   ```

2. **Upgrade to Affiliate**
   ```
   - Log in as John
   - Go to /affiliate
   - Click "Join Affiliate Program"
   - Choose username: john_aff
   - Click "Join Program"
   ```

3. **Verify Upgrade**
   ```
   - In Supabase profiles table:
   - Query: SELECT * FROM profiles WHERE id = {john_id}
   - Should show:
     * is_affiliate: true
     * affiliate_code: {auto-generated}
     * affiliate_username: john_aff
   ```

4. **Generate New Referrals**
   ```
   - John's affiliate code now active
   - Can share referral link
   - New customers via his link link to his account
   ```

### Expected Result
✅ Existing customers can upgrade without re-registration
✅ Same account (same ID) becomes affiliate
✅ Previous purchase history retained
✅ New affiliate code active immediately

---

## Test Scenario 5: Commission Approval & Withdrawal

### Setup
```
- Terry has pending commissions (₦150,000)
- Need to approve and process withdrawal
```

### Steps
1. **Admin Approves Commission**
   ```
   - Log in as admin
   - Go to /admin/commissions
   - Find Terry's pending commissions
   - Click "Approve" on each
   - Status changes: pending → approved
   ```

2. **Affiliate Requests Withdrawal**
   ```
   - Log in as Terry
   - Go to /affiliate/withdraw
   - Enter:
     * Amount: ₦150,000 (or subset)
     * Bank Name: FirstBank
     * Account Number: 1234567890
     * Account Holder: Terry Name
   - Click "Request Withdrawal"
   ```

3. **Admin Processes Withdrawal**
   ```
   - Log in as admin
   - Go to /admin/withdrawals
   - Find Terry's withdrawal request
   - Verify bank details
   - Click "Approve" → marks as paid
   ```

4. **Verify Final State**
   ```
   - In Supabase:
   - commissions table: status = 'paid', paid_at = {timestamp}
   - withdrawal_requests: status = 'paid', paid_at = {timestamp}
   ```

### Expected Result
✅ Admin can approve pending commissions
✅ Affiliates can request withdrawals with bank details
✅ Admin can process and mark withdrawals as paid
✅ Audit trail shows all timestamps

---

## Test Scenario 6: Referral Link Parameter Validation

### Steps
1. **Valid Referral Link**
   ```
   - Sign up with: ?ref=AFF_ABC123 (valid affiliate code)
   - Should create affiliate_customers link
   ```

2. **Invalid Referral Link**
   ```
   - Sign up with: ?ref=INVALID_CODE_123
   - Should succeed (normal signup)
   - No error, just no link created
   - Check affiliate_customers: no record
   ```

3. **No Referral Link**
   ```
   - Regular signup without ?ref parameter
   - Normal signup flow
   - No affiliate_customers record
   ```

### Expected Result
✅ Valid codes create links
✅ Invalid codes don't error, just skip linking
✅ No referral link = normal signup

---

## Integration Test: Complete Referral → Order → Commission Flow

### Full User Journey
```
1. Affiliate Terry joins program → Gets affiliate code
2. Terry shares referral link on social media
3. New customer Sarah clicks link and signs up → Linked to Terry
4. Sarah browses shop and makes ₦5,000 order
5. Payment processed via Stripe → Order marked paid
6. Commission auto-created: ₦750 (15%)
7. Terry sees commission on affiliate dashboard
8. Admin approves commission
9. Terry requests ₦750 withdrawal
10. Admin processes payout
11. Sarah makes 2nd order → Another ₦750 commission to Terry
12. Terry's lifetime earnings now ₦1,500
```

### Success Criteria
- ✅ All steps complete without errors
- ✅ Each commission ties to correct affiliate
- ✅ Payments only for 'paid' orders
- ✅ Lifetime tracking across multiple orders
- ✅ Admin controls commission workflow

---

## Database Query Verification

### Check Affiliate Customer Link
```sql
SELECT ac.*, p1.email as affiliate_email, p2.email as customer_email
FROM affiliate_customers ac
JOIN profiles p1 ON ac.affiliate_id = p1.id
JOIN profiles p2 ON ac.customer_id = p2.id;
```

### Check Commissions for Affiliate
```sql
SELECT c.*, o.total_amount_naira, p.email
FROM commissions c
JOIN orders o ON c.order_id = o.id
JOIN profiles p ON c.affiliate_id = p.id
ORDER BY c.created_at DESC;
```

### Verify Pending Commissions
```sql
SELECT affiliate_id, COUNT(*) as pending_count, 
       SUM(commission_amount_naira) as total_pending
FROM commissions
WHERE status = 'pending'
GROUP BY affiliate_id;
```

### Check Withdrawal Requests
```sql
SELECT wr.*, p.email, p.affiliate_username
FROM withdrawal_requests wr
JOIN profiles p ON wr.affiliate_id = p.id
ORDER BY wr.requested_at DESC;
```

---

## Performance Benchmarks

For production readiness, verify:
- [ ] Affiliate dashboard loads < 2s (even with 1000+ commissions)
- [ ] Commission creation < 500ms (non-blocking order completion)
- [ ] Withdrawal request creation < 1s
- [ ] Admin commission list paginated (50 per page)
- [ ] No N+1 queries on dashboard

Test with: `agent-browser vitals "http://localhost:3000/affiliate/dashboard" --json`
