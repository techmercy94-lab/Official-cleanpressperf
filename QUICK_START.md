# CleanPressperf - Quick Start Guide

## For Affiliates

### Join Program
1. Visit `/affiliate`
2. Click "Join Affiliate Program"
3. Enter username and bio
4. Get affiliate code (e.g., `AFF_ABC123`)

### Share & Earn
1. Share referral link: `https://yoursite.com/auth/sign-up?ref=AFF_ABC123`
2. Every signup → permanent customer link
3. Every customer purchase → 15% commission
4. Check earnings: `/affiliate/dashboard`

### Withdraw Earnings
1. Go to `/affiliate/withdraw`
2. Enter bank details and amount
3. Admin approves → funds transferred

---

## For Customers

### Shop
1. Visit `/shop`
2. Browse 6 premium perfumes at ₦5,000 each
3. Free nationwide delivery included
4. Add to cart and checkout

### Referred Customer Bonus
1. Use affiliate referral link to signup
2. Your purchases automatically support the affiliate
3. No special code needed at checkout
4. Enjoy free delivery on all orders

---

## For Admins

### Approve Commissions
1. Go to `/admin/commissions`
2. Review pending commissions
3. Click "Approve" to process
4. Commission moves to approved status

### Process Withdrawals
1. Go to `/admin/withdrawals`
2. Review affiliate payout requests
3. Verify bank details
4. Click "Approve" to mark paid

### View Dashboard
1. Go to `/admin/dashboard`
2. See real-time stats:
   - Total orders
   - Total affiliates
   - Pending vs paid commissions
   - Revenue overview

---

## Database Seed

```bash
# Populate products and categories
curl -X POST https://yoursite.vercel.app/api/seed
```

Products seeded:
- Purple Essence (₦5,000)
- Azure Wave (₦5,000)
- Amber Gold (₦5,000)
- Midnight Mystery (₦5,000)
- Rose Garden (₦5,000)
- Ocean Fresh (₦5,000)

---

## Key URLs

| Feature | URL |
|---------|-----|
| Homepage | `/` |
| Shop | `/shop` |
| Affiliate Join | `/affiliate` |
| Affiliate Dashboard | `/affiliate/dashboard` |
| Affiliate Settings | `/affiliate/settings` |
| Withdraw Funds | `/affiliate/withdraw` |
| Admin Dashboard | `/admin/dashboard` |
| Manage Commissions | `/admin/commissions` |
| Process Withdrawals | `/admin/withdrawals` |
| Sign Up | `/auth/sign-up` |
| Sign In | `/auth/login` |

---

## Commission Flow

```
1. Affiliate creates account
   → Gets unique code (AFF_ABC123)

2. Customer signs up via affiliate link
   → Linked to affiliate (permanent)

3. Customer makes order (₦5,000)
   → Payment processed via Stripe

4. Order marked as "paid"
   → Commission created (₦750)
   → Status: pending

5. Admin approves commission
   → Status: approved

6. Affiliate requests withdrawal
   → Withdrawal request created

7. Admin processes withdrawal
   → Status: paid
   → Funds transferred
```

---

## Testing Affiliate System

### Test Signup with Referral
```
1. Get affiliate code from /affiliate/dashboard
2. Create signup link: /auth/sign-up?ref=AFF_ABC123
3. Sign up in new browser/incognito
4. Check /affiliate/dashboard for "1 customer referred"
```

### Test Commission
```
1. Make order as referred customer
2. Mark order as paid (admin or Stripe webhook)
3. Check /affiliate/dashboard for pending commission
4. Admin approves on /admin/commissions
5. Check status changes to approved
```

### Test Withdrawal
```
1. Go to /affiliate/withdraw as affiliate
2. Request withdrawal of pending amount
3. Go to /admin/withdrawals as admin
4. Approve withdrawal
5. Check status changed to paid
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Troubleshooting

### Products not showing in shop
- Run seed: `curl -X POST /api/seed`
- Check database for products table populated

### Commission not created
- Verify order status = 'paid' (not 'pending')
- Check affiliate_id set on order
- Look in admin/commissions page

### Affiliate not seeing earnings
- Check affiliate has ?ref code on signup link
- Verify affiliate_customers table has record
- Confirm order marked as 'paid'

### Withdrawal not processing
- Admin must approve commission first
- Then affiliate can request withdrawal
- Admin must approve withdrawal

---

## Support

For detailed information:
- See `PRODUCTION_READY.md` for complete feature list
- See `TESTING.md` for test scenarios
- See `DEPLOYMENT.md` for deployment guide
- See `README.md` for project overview

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Commission Rate | 15% per order |
| Product Price | ₦5,000 each |
| Free Delivery | Nationwide (included) |
| Affiliate Code | Auto-generated, unique |
| Customer Linking | Permanent (lifetime) |
| Commission Timing | Auto-generated on "paid" status |
| Payment Method | Stripe (test/live) |
| Database | Supabase PostgreSQL |
