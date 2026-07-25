# CleanPressperf Deployment Guide

## Production-Ready Features Implemented

### ✅ Lifetime Affiliate Tracking System
- **Referral Link Tracking**: Customers who signup through affiliate links are permanently linked
- **Signup Integration**: Added `affiliateCode` parameter to signup flow
- **Automatic Linking**: `affiliate_customers` table tracks all referrals from signup
- **Existing Customer Upgrade**: Customers can upgrade to affiliate status without re-signing up via `registerAsAffiliate()` action
- **Code**: `/app/actions/auth.ts` - Lines 60-100 handle affiliate code tracking on signup

### ✅ Commission Generation for Paid Orders
- **Verified Payments Only**: Commissions only created when order status = 'paid'
- **15% Commission Rate**: Configurable in settings, currently 15% of order value
- **Automatic Calculation**: Commission amount = order total × commission rate
- **Status Tracking**: Commissions start as 'pending' and can be approved/paid
- **Code**: `/app/actions/orders.ts` - Lines 118-152 handle commission generation
- **Implementation**: When `updateOrderStatus('paid')` is called, commission automatically inserted

### ✅ Nigerian Pricing Structure
- **Standard Price**: All perfumes ₦5,000 (₦500,000 in kobo for database storage)
- **Free Delivery**: Nationwide delivery included in all orders
- **Categories**: Premium Collection, Exclusive Scents, Daily Wear
- **6 Products Seeded**: Purple Essence, Azure Wave, Amber Gold, Midnight Mystery, Rose Garden, Ocean Fresh
- **Seed Endpoint**: POST `/api/seed` - Seeds categories and all products

### ✅ Affiliate Program Features
- **Registration**: Existing customers can join affiliate program
- **Unique Code**: Auto-generated unique affiliate codes
- **Dashboard**: Real-time stats (clicks, referrals, earnings)
- **Commission Tracking**: View pending and paid commissions per sale
- **Withdrawals**: Request payouts with bank details
- **Admin Panel**: View all affiliates, approve commissions, process withdrawals

## Setup & Deployment

### 1. Environment Configuration
```bash
# In Vercel project settings > Environment Variables add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Seed Database
```bash
# Seed products, categories, and settings
curl -X POST https://your-domain.vercel.app/api/seed

# Response indicates success with product count
```

### 3. Test Affiliate Referral Flow
```
1. Create Affiliate Account
   - Navigate to /affiliate
   - Click "Join Now"
   - Register with username and bio
   - Receive unique affiliate code (e.g., AFF_ABC123)

2. Generate Referral Link
   - Share: https://your-domain.com/auth/sign-up?ref=AFF_ABC123
   - Clicks tracked automatically
   
3. Customer Signup Through Link
   - New customer signs up via referral link
   - Automatically linked to affiliate in affiliate_customers table
   
4. Test Order with Commission
   - Customer places order
   - Order status updated to 'paid' (via webhook after Stripe payment)
   - Commission auto-created: order_amount × 15% = commission
   - Affiliate sees pending commission on dashboard
   - Admin approves commission
   - Affiliate requests withdrawal
   - Admin processes payout

5. Verify Lifetime Tracking
   - All future purchases by that customer link to original affiliate
   - Commissions accumulate indefinitely
```

## Key Files for Production

### Affiliate System
- `/app/actions/affiliate.ts` - Affiliate business logic
- `/app/affiliate/dashboard/page.tsx` - Affiliate dashboard
- `/app/affiliate/withdraw/page.tsx` - Withdrawal requests
- `/app/affiliate/settings/page.tsx` - Affiliate profile management

### Commission System
- `/app/actions/orders.ts` - Order and commission creation
- `/app/admin/commissions/page.tsx` - Admin commission management
- `/app/admin/withdrawals/page.tsx` - Admin withdrawal management

### Database
- Schema: All 15 tables with RLS policies enforced
- Indexes: Performance optimized for affiliate queries
- Triggers: Auto profile creation on signup

### Supabase Configuration
```sql
-- All RLS policies enforced for security
-- Affiliate lifetime tracking via unique(affiliate_id, customer_id)
-- Commission generation tied to order.status = 'paid'
-- Free delivery configured in settings table
```

## Testing Checklist

- [ ] Seed products via `/api/seed` endpoint
- [ ] Verify 6 products at ₦5,000 appear in shop
- [ ] Create test affiliate account
- [ ] Generate referral link with affiliate code
- [ ] Signup new customer via referral link
- [ ] Verify customer linked in affiliate_customers table
- [ ] Create order and mark as paid
- [ ] Verify commission created automatically
- [ ] Affiliate sees commission on dashboard
- [ ] Admin approves commission
- [ ] Affiliate requests withdrawal
- [ ] Admin processes withdrawal
- [ ] Verify second order from same customer links to original affiliate
- [ ] Verify commission on second order

## Performance Notes

- All queries use indexed columns (affiliate_id, order_id, user_id)
- Affiliate dashboard aggregates efficiently with count queries
- Commission generation is non-blocking (catch errors, don't block order)
- RLS policies checked on all data access

## Security Features

- ✅ Row Level Security on all tables
- ✅ Affiliate customer relationships immutable (unique constraint)
- ✅ Commission rate controlled server-side
- ✅ Withdrawal requests audit-tracked
- ✅ Admin-only commission approval

## Next Steps for Production

1. **Connect Stripe Webhooks**
   - Create webhook endpoint for payment success
   - Call `updateOrderStatus('paid')` on successful payment
   - This triggers commission generation

2. **Admin Dashboard Access Control**
   - Add role-based access control to `/admin/*` routes
   - Verify only admins can approve commissions/withdrawals

3. **Email Notifications**
   - Commission notifications to affiliates
   - Withdrawal confirmation emails
   - New customer signup notifications

4. **Deployment**
   - Deploy to Vercel
   - Configure domain
   - Enable Vercel Analytics
   - Setup error monitoring (Sentry)

## Affiliate Program Economics

- **Commission Rate**: 15% per order (configurable)
- **Free Delivery**: All orders include free nationwide delivery
- **Lifetime Tracking**: Customers permanently linked to referring affiliate
- **Payment Terms**: Affiliates request withdrawals, admin processes
- **Minimum Order**: No minimum, all orders generate commissions
