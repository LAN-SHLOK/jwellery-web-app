#  Jewellery E-Commerce Platform

A modern, full-stack e-commerce platform for 22K gold jewellery with live gold rate pricing, admin dashboard, and integrated payment processing.

##  Features

### Customer Features
-  Browse jewellery collections by category (Rings, Chains, Earrings, Bangles, Pendants, Necklaces)
-  Live 22K gold rate pricing with transparent cost breakdown
-  Shopping cart with real-time price calculations
-  Checkout with multiple payment options (Razorpay/COD)
-  Order confirmation emails
-  Fully responsive design with custom cursor effects
-  Luxury UI with smooth animations

### Admin Features
-  Secure admin authentication with JWT
-  Comprehensive dashboard with analytics
-  Daily gold rate management
-  Product management (CRUD operations)
-  Image upload via Cloudinary
-  Order management and tracking
-  Revenue and sales analytics
-  Automated daily gold rate reminders via cron

### Technical Features
-  Built with Next.js 14 (App Router)
-  Supabase for database and storage
-  Tailwind CSS for styling
-  Real-time stock management
-  Rate limiting for security
-  SMTP email integration
-  Razorpay payment gateway
-  Demo payment flow for testing

##  Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: JWT with bcrypt
- **Payment**: Razorpay
- **Image Storage**: Cloudinary
- **Email**: Nodemailer (Gmail SMTP)
- **Deployment**: Vercel

##  Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudinary account
- Gmail account (for SMTP)
- Razorpay account (optional, demo mode available)

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/LAN-SHLOK/jwellery-web-app.git
cd jwellery-web-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

The `.env.example` already contains working credentials for development. You can use them as-is or replace with your own.

### 4. Set up Supabase database

1. Create a new Supabase project
2. Run the SQL scripts in this order:

```sql
-- 1. Create tables
-- Run: schema.sql

-- 2. Create stock decrement function
-- Run: supabase/decrement_stock.sql

-- 3. Seed initial data (optional)
-- Run: init-data.sql
-- Run: seed-products.sql
```

### 5. Create admin user

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@example.com',
  '$2b$10$JTkHRFE1om0/JvvBIRGi4edH4NlSAfblu85WmankCc.3NiqfLuGfu',
  'admin'
);
```

**Default admin credentials:**
- Email: `admin@example.com`
- Password: `admin123`

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

##  Environment Variables

All required environment variables are documented in `.env.example`. Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `JWT_SECRET` | Secret for JWT tokens | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay API key (use placeholder for demo) | ⚠️ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `SMTP_USER` | Gmail address for sending emails | ✅ |
| `SMTP_PASS` | Gmail app password | ✅ |
| `CRON_SECRET` | Secret for cron job authentication | ✅ |

 **Note**: Razorpay keys can be left as placeholders (`rzp_test_placeholder`) to use the demo payment flow.

##  Application Structure

```
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── about/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── collections/
│   │   ├── contact/
│   │   ├── order-confirmation/
│   │   ├── payment/demo/  # Demo payment page
│   │   └── products/
│   ├── admin/             # Admin dashboard
│   │   ├── dashboard/
│   │   ├── gold-rate/
│   │   ├── orders/
│   │   └── products/
│   └── api/               # API routes
│       ├── admin/
│       ├── checkout/
│       ├── cron/
│       ├── gold-rate/
│       ├── orders/
│       └── payments/
├── components/            # React components
├── lib/                   # Utility functions
├── public/               # Static assets
└── supabase/             # Database functions
```

##  Key Features Explained

### Live Gold Rate Pricing

- Admin updates daily 22K gold rate
- All product prices automatically recalculate
- Prices locked at checkout time
- Transparent breakdown: Gold value + Making charges + GST

### Stock Management

- Real-time stock tracking
- Atomic stock decrement on order
- Out-of-stock indicators
- Stock quantity display on products

### Payment Flow

**Demo Mode** (default with placeholder keys):
- Redirects to `/payment/demo`
- Test success, failed, and cancelled scenarios
- No real payment processing

**Live Mode** (with real Razorpay keys):
- Razorpay checkout modal
- UPI, cards, netbanking support
- Webhook for payment verification

### Admin Dashboard

- **Dashboard**: Analytics, revenue charts, order summary
- **Gold Rate**: Update daily rates, view history
- **Products**: Add/edit/delete products with images
- **Orders**: View and manage all orders

### Automated Reminders

- Cron job runs daily at 1:45 PM IST
- Checks if gold rate was updated
- Sends email reminder to admin if not updated
- Configured via `vercel.json`

##  Deployment

### Deploy to Vercel

1. **Push code to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import project in Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Set environment variables**:
   - Copy all variables from `.env.local`
   - Add them in Vercel project settings
   - Deploy

4. **Cron job automatically activates**:
   - Vercel reads `vercel.json`
   - Sets up daily cron job
   - No manual configuration needed

##  Security Features

- JWT-based admin authentication
- Rate limiting on login attempts
- Bcrypt password hashing
- CSRF protection
- Secure cookie handling
- Environment variable validation
- SQL injection prevention (Supabase)

##  Email Configuration

The app uses Gmail SMTP by default. To use Gmail:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this password in `SMTP_PASS`

For other providers (Zoho, Hostinger, etc.), fill in `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE`.

##  Testing

### Test Payment Flow

1. Add products to cart
2. Go to checkout
3. Fill in shipping details
4. Select "Pay with Razorpay"
5. You'll be redirected to `/payment/demo`
6. Test different outcomes:
   -  Payment approved
   -  Payment declined
   -  Payment cancelled

### Test Admin Features

1. Login at `/admin/login`
2. Use default credentials (see Installation section)
3. Test dashboard, gold rate updates, product management

##  API Endpoints

### Public APIs
- `GET /api/products` - Get all products
- `GET /api/gold-rate` - Get current gold rate
- `POST /api/checkout` - Create order
- `POST /api/contact` - Send contact form

### Admin APIs (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET/POST/PATCH/DELETE /api/admin/products` - Product management
- `GET/POST /api/gold-rate` - Gold rate management
- `GET/PATCH /api/orders` - Order management

### Cron APIs
- `GET /api/cron/reminder` - Daily gold rate reminder

##  Troubleshooting

### Database Connection Issues
- Verify Supabase URL and anon key
- Check if RLS is disabled on all tables
- Ensure tables are created with correct schema

### Email Not Sending
- Verify Gmail app password (not regular password)
- Check if 2FA is enabled on Gmail
- Test with `npm run test:email` (if available)

### Payment Issues
- For demo mode: Ensure Razorpay keys are placeholders
- For live mode: Verify real Razorpay keys
- Check webhook secret matches Razorpay dashboard

### Admin Login Issues
- Verify admin user exists in database
- Check JWT_SECRET is set
- Clear browser cookies and try again

##  License

This project is private and proprietary.

##  Support

For issues or questions, contact the development team.

##  Customization

### Branding
Edit `config/brand.ts` to customize:
- Brand name
- Logo
- Currency
- Contact information

### Styling
- Tailwind config: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Color scheme: Update Tailwind theme

### Categories
Add/remove product categories in:
- `app/admin/products/page.tsx`
- Update database schema if needed

##  Updates

To update dependencies:

```bash
npm update
```

To check for outdated packages:

```bash
npm outdated
```

## 📊 Performance

- Lighthouse score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Image optimization via Next.js Image
- Code splitting and lazy loading
- Cached API responses

---

Built using Next.js and modern web technologies.
