# Innov8 Jewels

A full-stack luxury jewellery e-commerce platform built with Next.js 14. Features live 22K/18K gold rate pricing, Razorpay payments, Cloudinary image management, and a complete admin dashboard.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + Framer Motion + GSAP
- **Auth**: JWT + bcryptjs
- **Payments**: Razorpay (with demo mode fallback)
- **Images**: Cloudinary
- **Email**: Nodemailer (Gmail SMTP)
- **State**: Zustand
- **Validation**: Zod
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/LAN-SHLOK/jwellery-web-app.git
cd jwellery-web-app
npm install
```

### 2. Environment variables

Create `.env.local` from the table below. All variables are required unless marked optional.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `JWT_SECRET` | JWT signing secret (`openssl rand -base64 32`) |
| `RAZORPAY_KEY_ID` | Razorpay API key (use `rzp_test_placeholder` for demo) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as above (public) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `ADMIN_EMAIL` | Admin inbox for notifications |
| `CRON_SECRET` | Cron job auth token |
| `SMTP_HOST` | Custom SMTP host (optional) |
| `SMTP_PORT` | Custom SMTP port (optional) |

### 3. Database setup

Run the single setup file in your Supabase SQL Editor:

```
supabase/complete-database-setup.sql
```

This creates all tables, seeds 12 sample products, sets gold rate to ₹6,500/g, creates the admin user, and adds 3 sample coupons.

**Admin credentials:** `admin@example.com` / `admin123`

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
├── app/
│   ├── (public)/           # Customer-facing pages
│   │   ├── collections/    # Browse by category
│   │   ├── products/[slug] # Product detail
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow
│   │   ├── payment/demo/   # Demo payment page
│   │   └── order-confirmation/
│   ├── admin/              # Admin dashboard
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── gold-rate/
│   │   ├── coupons/
│   │   └── reviews/
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Navbar, Footer, Cart, etc.
│   ├── product/            # ProductCard, ProductGrid, Reviews
│   └── admin/              # AdminLayout, Charts
├── lib/                    # Utilities (pricing, auth, cache, email, etc.)
├── config/
│   └── brand.ts            # Brand name, logo, contact, theme
├── supabase/               # All SQL files
└── public/                 # Static assets + logo
```

---

## Features

### Customer
- Browse jewellery by category (Rings, Chains, Earrings, Bangles, Pendants, Necklaces)
- Live 22K/18K gold rate pricing with transparent cost breakdown
- Purity selector on products that support both 18K and 22K
- Shopping cart with real-time price calculations
- Coupon code validation at checkout
- Razorpay checkout (UPI, cards, netbanking) or Cash on Delivery
- Order confirmation email
- Product reviews

### Admin
- Secure JWT-based login at `/admin/login`
- Dashboard with revenue analytics and order summary
- Daily gold rate management (22K + 18K) with 7-day history
- Product CRUD with Cloudinary image upload
- Order management with status updates
- Coupon management (percentage or fixed, usage limits, validity)
- Review approval workflow
- Daily cron reminder if gold rate not updated by 1:45 PM IST

---

## Pricing Formula

```
Pure Gold Value  = weight (g) × rate (₹/g) × purity multiplier
                   22K multiplier = 0.9167
                   18K multiplier = 0.75

Making Charges   = fixed amount  OR  (Pure Gold Value × percentage / 100)
Subtotal         = Pure Gold Value + Making Charges + Jeweller Margin
GST              = Subtotal × 3%
Final Price      = Subtotal + GST
```

Prices are locked at checkout time — future gold rate changes don't affect placed orders.

---

## API Routes

### Public
| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | List products (optional `?category=`) |
| GET | `/api/gold-rate` | Current 22K/18K rates |
| GET | `/api/gold-rate/history` | 7-day rate history |
| POST | `/api/checkout` | Create order |
| POST | `/api/coupons/validate` | Validate coupon |
| POST | `/api/contact` | Contact form |
| GET/POST | `/api/reviews` | Get/submit reviews |

### Admin (JWT protected)
| Method | Route | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/products/list` | List all products |
| POST/PATCH/DELETE | `/api/admin/products` | Product CRUD |
| GET/POST/PATCH/DELETE | `/api/admin/coupons` | Coupon management |
| GET/PATCH | `/api/orders` | Order management |
| GET/PATCH | `/api/admin/reviews` | Review moderation |

### Webhooks & Cron
| Method | Route | Description |
|---|---|---|
| POST | `/api/razorpay/webhook` | Razorpay payment events |
| GET | `/api/cron/reminder` | Daily gold rate reminder |

---

## Payment Flow

**Demo mode** (default with placeholder Razorpay keys):
- Redirects to `/payment/demo`
- Test success, failure, and cancellation scenarios
- No real payment processing

**Live mode** (real Razorpay keys):
- Razorpay checkout modal
- Webhook verifies payment via HMAC-SHA256
- Stock decremented atomically on success

---

## Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account → Security → App passwords
3. Generate a password for "Mail"
4. Use that password as `SMTP_PASS`

For other providers (Zoho, Hostinger), set `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE`.

---

## Database Schema

| Table | Purpose |
|---|---|
| `products` | Jewellery catalog with gold specs and pricing |
| `gold_rates` | Daily 22K/18K rate history |
| `orders` | Customer orders with locked pricing snapshot |
| `users` | Admin accounts |
| `coupons` | Discount codes |
| `coupon_usage` | Coupon usage tracking per order |
| `product_reviews` | Customer reviews with approval workflow |

All SQL files are in `supabase/`. Run `complete-database-setup.sql` for a full reset and seed.

---

## Branding

Edit `config/brand.ts` to update the brand name, logo, contact info, currency, and theme colors.

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run smtp:verify  # Test SMTP connection
```

---

## Security

- Rate limiting: 100 req/min general, 5/min checkout, 5/15min login
- JWT session auth with HTTP-only cookies
- Bcrypt password hashing
- HMAC-SHA256 webhook verification
- XSS input sanitization
- Security headers on all responses (CSP, X-Frame-Options, etc.)
- Bot detection via user-agent

---

## License

Private and proprietary.
