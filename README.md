# CleanPressperf - Luxury Perfume E-Commerce Platform

A production-ready luxury e-commerce platform with lifetime affiliate program, comprehensive admin dashboard, and full Stripe payment integration.

**Tagline**: Smell Premium. Earn Premium.

## Features

### Customer Features
- **Product Catalog**: Browse luxury perfumes with detailed descriptions, ratings, and reviews
- **Shopping Experience**: Add to cart, wishlist, and checkout with Stripe payment
- **Order Management**: Track orders and view order history
- **User Profiles**: Manage account settings, profile information, and preferences

### Affiliate Program
- **Lifetime Commissions**: Earn 15% on all referred customer purchases
- **Affiliate Dashboard**: Real-time stats on clicks, referrals, and earnings
- **Affiliate Settings**: Manage referral links and profile information
- **Withdrawal System**: Request payments directly to bank accounts
- **Link Tracking**: Comprehensive lifetime tracking of affiliate referrals

### Admin Dashboard
- **Analytics**: View total orders, revenue, active affiliates, and key metrics
- **Commission Management**: Approve and manage affiliate commissions
- **Withdrawal Management**: Review and process withdrawal requests
- **Order Management**: Track and manage all customer orders
- **User Management**: Manage customer and affiliate accounts

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React hooks with Supabase real-time
- **Styling**: Tailwind CSS v4 with custom design tokens

### Backend
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Payment Processing**: Stripe integration
- **API**: Next.js API Routes and Server Actions
- **Search/Filtering**: Native SQL queries with Supabase REST API

### Design System
- **Brand Colors**: Purple (#7c3aed) and Gold (#c4b5fd)
- **Typography**: Responsive typography system
- **Accessibility**: Full WCAG 2.1 AA compliance
- **Responsive**: Mobile-first design with breakpoints for all devices

## Database Schema

### Core Tables
- `profiles`: User accounts with affiliate tracking
- `products`: Product catalog with pricing and inventory
- `categories`: Product categorization
- `orders`: Customer orders with shipping/billing
- `order_items`: Order line items
- `cart`: Shopping cart items
- `wishlist`: Saved products

### Affiliate Tables
- `affiliate_customers`: Lifetime customer referral tracking
- `affiliate_clicks`: Click tracking for referrals
- `commissions`: Commission tracking and approval workflow
- `withdrawal_requests`: Payout requests with bank details

### Additional Tables
- `reviews`: Product reviews and ratings
- `notifications`: User notifications
- `coupons`: Promotional codes
- `settings`: Store configuration

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase account and project
- Stripe account for payments

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-repo/cleanpressperf.git
cd cleanpressperf
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run the development server
```bash
pnpm dev
```

5. Seed the database (optional)
```bash
curl -X POST http://localhost:3000/api/seed
```

Visit http://localhost:3000 to see the application.

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── shop/                    # Product catalog
├── cart/                    # Shopping cart
├── checkout/                # Stripe checkout
├── orders/                  # Order history
├── profile/                 # User profile
├── affiliate/               # Affiliate program
│   ├── page.tsx            # Program overview
│   ├── dashboard/          # Affiliate dashboard
│   ├── settings/           # Affiliate settings
│   └── withdraw/           # Withdrawal requests
├── admin/                   # Admin dashboard
│   ├── dashboard/          # Overview and analytics
│   ├── commissions/        # Commission management
│   └── withdrawals/        # Withdrawal approval
└── auth/                    # Authentication pages
    ├── login/
    ├── sign-up/
    ├── callback/
    └── error/

components/
├── header.tsx              # Navigation header
├── footer.tsx              # Footer
├── product-card.tsx        # Product display card
└── ui/                      # shadcn components

lib/
├── supabase/               # Supabase client setup
│   ├── client.ts          # Browser client
│   ├── server.ts          # Server client
│   └── proxy.ts           # Middleware proxy
├── types.ts                # TypeScript types
├── utils-custom.ts         # Utility functions
└── stripe.ts               # Stripe client

app/actions/                # Server actions
├── products.ts             # Product operations
├── cart.ts                 # Cart management
├── orders.ts               # Order processing
├── affiliate.ts            # Affiliate operations
├── admin.ts                # Admin operations
├── auth.ts                 # Authentication
└── stripe.ts               # Payment processing

public/
├── images/                 # Product images
└── ...

scripts/
└── seed.ts                 # Database seeding
```

## Key Features Implementation

### Affiliate Program
The affiliate system provides lifetime tracking and earnings:
- **Referral Links**: Unique URLs with affiliate codes
- **Commission Calculation**: 15% of order total stored in commissions table
- **Approval Workflow**: Admin approval before payment
- **Withdrawal System**: Direct bank transfer requests
- **Real-time Stats**: Dashboard shows clicks, conversions, earnings

### Payment Processing
- **Stripe Integration**: Secure checkout with EmbeddedCheckout
- **Order Management**: Automatic order creation after successful payment
- **Commission Tracking**: Commissions created when order is placed
- **Affiliate Attribution**: Automatic attribution based on referral URL

### Admin Features
- **Dashboard Analytics**: KPIs and metrics at a glance
- **Commission Management**: Bulk approve/pay commissions
- **Withdrawal Processing**: Review and approve withdrawal requests
- **Report Viewing**: Comprehensive transaction reports

## Security

- **Row Level Security (RLS)**: All tables have RLS policies
- **Server-side Validation**: All data validated on the server
- **Parameterized Queries**: Protection against SQL injection
- **Secure Authentication**: Supabase Auth with session management
- **API Security**: Next.js API routes with authentication

## Customization

### Changing Commission Rate
Edit `lib/types.ts` and update the `COMMISSION_RATE` constant:
```typescript
export const COMMISSION_RATE = 15; // percentage
```

### Updating Brand Colors
Edit `app/globals.css` and modify the design token variables:
```css
--primary: #7c3aed;  /* Purple */
--accent: #c4b5fd;   /* Gold */
```

### Adding New Products
Use the admin dashboard or insert directly into the products table:
```typescript
await supabase.from('products').insert({
  name: 'Product Name',
  price_naira: 50000 * 100, // In kobo (smallest unit)
  category_id: categoryId,
  description: 'Product description',
  image_urls: ['/images/product.png']
})
```

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
vercel deploy --prod
```

### Database Deployment
Supabase automatically manages backups and scaling.

## API Endpoints

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Affiliate
- `GET /api/affiliate/stats` - Get affiliate statistics
- `POST /api/affiliate/withdraw` - Submit withdrawal request
- `GET /api/affiliate/commissions` - List commissions

### Admin
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/commissions` - List all commissions
- `POST /api/admin/commissions/:id/approve` - Approve commission

## Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Database Indexing**: Strategic indexes on frequently queried columns
- **Caching**: Supabase cache with 1-hour TTL
- **Code Splitting**: Route-based code splitting with Next.js
- **API Optimization**: Server-side filtering and pagination

## Support

For issues or questions:
1. Check the documentation
2. Open an issue on GitHub
3. Contact support at contact@cleanpressperf.com

## License

This project is proprietary and confidential.

---

**Built with ❤️ for premium perfume enthusiasts**
