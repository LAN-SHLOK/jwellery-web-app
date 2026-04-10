# Jewelry E-Commerce Platform - Exam Preparation Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technical Stack Questions](#technical-stack-questions)
3. [Feature Implementation](#feature-implementation)
4. [Database & Backend](#database--backend)
5. [Frontend & UI](#frontend--ui)
6. [Performance & Optimization](#performance--optimization)
7. [Security & Authentication](#security--authentication)

---

## Architecture Overview

### Q1: What is the overall architecture of this project?

**Answer:**
This is a **full-stack Next.js 14 e-commerce application** using:
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Payments**: Razorpay
- **Image Storage**: Cloudinary
- **Deployment**: Vercel

**Architecture Pattern**: JAMstack (JavaScript, APIs, Markup)
- Static pages generated at build time
- Dynamic data fetched via API routes
- Serverless functions for backend logic

---

### Q2: Explain the folder structure

**Answer:**
```
├── app/                    # Next.js App Router
│   ├── (public)/          # Public-facing pages (grouped route)
│   │   ├── page.tsx       # Homepage
│   │   ├── collections/   # Product listings
│   │   ├── checkout/      # Checkout flow
│   │   └── layout.tsx     # Public layout (navbar, footer)
│   ├── admin/             # Admin dashboard pages
│   └── api/               # API routes (backend)
├── components/            # Reusable React components
│   ├── ui/               # UI components (Navbar, Ticker, etc.)
│   ├── product/          # Product-related components
│   └── cart/             # Shopping cart components
├── lib/                   # Utility functions & business logic
│   ├── pricing.ts        # Gold pricing calculations
│   ├── auth.ts           # Authentication logic
│   ├── store.ts          # Zustand state management
│   └── supabase.ts       # Database client
├── public/               # Static assets
└── *.sql                 # Database schemas & migrations
```

**Key Concepts:**
- **(public)** folder = Route group (doesn't affect URL)
- **app/api/** = Backend API endpoints
- **lib/** = Business logic separated from UI

---

## Technical Stack Questions

### Q3: Why Next.js 14 with App Router?

**Answer:**
**Benefits:**
1. **Server Components**: Reduce JavaScript sent to client
2. **Streaming**: Progressive page rendering
3. **Built-in API Routes**: No separate backend needed
4. **File-based Routing**: Automatic route creation
5. **Image Optimization**: Automatic WebP/AVIF conversion
6. **SEO-friendly**: Server-side rendering for search engines

**App Router vs Pages Router:**
- App Router uses `app/` directory (newer)
- Server Components by default
- Better performance and DX

---

### Q4: What is Zustand and why use it?

**Answer:**
**Zustand** is a lightweight state management library.

**Why Zustand over Redux:**
- ✅ Simpler API (less boilerplate)
- ✅ No providers needed
- ✅ Better TypeScript support
- ✅ Smaller bundle size
- ✅ Built-in persistence

**Example (lib/store.ts):**
```typescript
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' } // Persists to localStorage
  )
);
```

**Usage:**
```typescript
const { items, addItem } = useCart();
```

---

### Q5: Explain the database choice (Supabase)

**Answer:**
**Supabase** = Open-source Firebase alternative (PostgreSQL-based)

**Features Used:**
1. **PostgreSQL Database**: Relational data with SQL
2. **Real-time subscriptions**: Live data updates
3. **Row Level Security (RLS)**: Database-level permissions
4. **RESTful API**: Auto-generated from schema
5. **Storage**: File uploads (not used here, using Cloudinary)

**Why Supabase:**
- ✅ Free tier (500MB database)
- ✅ PostgreSQL (powerful queries)
- ✅ Built-in auth (not used, custom JWT)
- ✅ Easy deployment
- ✅ Real-time capabilities

**Connection (lib/supabase.ts):**
```typescript
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## Feature Implementation

### Q6: How does the Gold Rate Pricing work?

**Answer:**
**Flow:**
1. Admin updates gold rate in `/admin/gold-rate`
2. Rate stored in `gold_rates` table with timestamp
3. API route `/api/gold-rate` fetches latest rate
4. Frontend components fetch rate on mount
5. Product prices calculated dynamically

**Pricing Formula (lib/pricing.ts):**
```typescript
export function calculateFinalPrice(params) {
  // 1. Base gold cost
  const goldCost = goldWeightGrams * todayRatePerGram;
  
  // 2. Making charges
  const makingCharge = makingChargeType === 'percentage'
    ? goldCost * (makingChargeValue / 100)
    : makingChargeValue;
  
  // 3. Jeweller margin
  const margin = (goldCost + makingCharge) * (jewellerMargin / 100);
  
  // 4. Subtotal (before GST)
  const subtotal = goldCost + makingCharge + margin;
  
  // 5. GST (3%)
  const gst = subtotal * 0.03;
  
  // 6. Final price
  return subtotal + gst;
}
```

**Key Points:**
- Prices update automatically when gold rate changes
- No hardcoded prices in database
- Transparent pricing breakdown shown to customers

---

### Q7: Explain the FOMO Badge feature

**Answer:**
**FOMO (Fear of Missing Out) Badge** = Encourages purchases when gold rate is low

**Logic:**
1. Fetch last 7 days of gold rates
2. Calculate average rate
3. If today's rate < 7-day average → Show badge
4. Badge displays "Gold is softer today" message

**Implementation (app/api/gold-rate/route.ts):**
```typescript
// Get last 7 days of rates
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const { data: history } = await supabase
  .from('gold_rates')
  .select('rate_per_gram')
  .gte('created_at', sevenDaysAgo.toISOString())
  .order('created_at', { ascending: false });

// Calculate average
const avg = history.reduce((sum, r) => sum + r.rate_per_gram, 0) / history.length;

// Check if today is below average
const fomoBadge = latestRate < avg;
```

**UI (components/ui/Ticker.tsx):**
- Green badge when FOMO active
- Auto-shows for 5 seconds
- Click to toggle visibility

---

### Q8: How does the Coupon System work?

**Answer:**
**Coupon Flow:**
1. Admin creates coupon in `/admin/coupons`
2. Customer enters code at checkout
3. API validates coupon (`/api/coupons/validate`)
4. Discount applied to order total
5. Usage tracked in `coupon_usage` table

**Validation Logic (lib/coupons.ts):**
```typescript
export async function validateCoupon(code, orderTotal, customerEmail) {
  // 1. Find coupon
  const coupon = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();
  
  // 2. Check expiry
  if (coupon.valid_until && new Date() > new Date(coupon.valid_until)) {
    return { valid: false, error: 'Coupon has expired' };
  }
  
  // 3. Check minimum order value
  if (coupon.min_order_value && orderTotal < coupon.min_order_value) {
    return { valid: false, error: 'Minimum order value not met' };
  }
  
  // 4. Check usage limit
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return { valid: false, error: 'Usage limit reached' };
  }
  
  // 5. Calculate discount
  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (orderTotal * coupon.discount_value) / 100;
    if (coupon.max_discount_amount) {
      discount = Math.min(discount, coupon.max_discount_amount);
    }
  } else {
    discount = coupon.discount_value;
  }
  
  return { valid: true, discount, coupon };
}
```

**Coupon Types:**
- **Percentage**: 10% off (with optional max cap)
- **Fixed**: ₹500 off

---

### Q9: Explain the Reviews System

**Answer:**
**Review Flow:**
1. Customer submits review on product page
2. Review saved with `is_approved = false`
3. Admin sees review in `/admin/reviews`
4. Admin approves/rejects review
5. Only approved reviews show on website

**Database Schema:**
```sql
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  customer_name TEXT,
  customer_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features:**
- **Verified Purchase**: Checks if customer ordered the product
- **Admin Response**: Admin can reply to reviews
- **Approval System**: Prevents spam/fake reviews

**API Routes:**
- `POST /api/reviews` - Submit review (public)
- `GET /api/reviews?productId=X` - Get approved reviews
- `PATCH /api/admin/reviews` - Approve/reject (admin only)

---

### Q10: How does Authentication work?

**Answer:**
**Custom JWT Authentication** (not using Supabase Auth)

**Flow:**
1. Admin logs in at `/admin/login`
2. Credentials verified against `users` table
3. JWT token generated using `jose` library
4. Token stored in HTTP-only cookie
5. Middleware validates token on admin routes

**Implementation (lib/auth.ts):**
```typescript
// Create session (login)
export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
  
  cookies().set('admin_session', token, {
    httpOnly: true,  // Prevents XSS
    secure: true,    // HTTPS only
    sameSite: 'lax', // CSRF protection
  });
}

// Verify session
export async function verifyAdminSession(request) {
  const token = request.headers.get('cookie')
    ?.split(';')
    .find(c => c.includes('admin_session'))
    ?.split('=')[1];
  
  if (!token) return { valid: false };
  
  const payload = await jwtVerify(token, secret);
  return { valid: true, userId: payload.userId };
}
```

**Security Features:**
- ✅ HTTP-only cookies (no JavaScript access)
- ✅ Secure flag (HTTPS only)
- ✅ SameSite protection (CSRF)
- ✅ 24-hour expiration
- ✅ Password hashing (bcrypt)

---

## Database & Backend

### Q11: Explain the database schema

**Answer:**
**Main Tables:**

**1. products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  category VARCHAR,  -- ring, chain, earring, etc.
  gold_weight_grams NUMERIC(6,3),
  gold_purity VARCHAR DEFAULT '22K',
  making_charge_type VARCHAR,  -- 'fixed' or 'percentage'
  making_charge_value NUMERIC(10,2),
  jeweller_margin NUMERIC(10,2),
  images TEXT[],  -- Array of Cloudinary URLs
  stock_quantity INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);
```

**2. gold_rates**
```sql
CREATE TABLE gold_rates (
  id SERIAL PRIMARY KEY,
  rate_per_gram NUMERIC(10,2),
  entered_by VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**3. orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_name VARCHAR,
  customer_email VARCHAR,
  items JSONB,  -- Cart snapshot
  gold_rate_used NUMERIC(10,2),
  total_amount NUMERIC(10,2),
  payment_status VARCHAR,
  order_status VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**4. coupons**
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE,
  discount_type TEXT,  -- 'percentage' or 'fixed'
  discount_value NUMERIC(10,2),
  min_order_value NUMERIC(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);
```

**5. product_reviews**
```sql
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT FALSE
);
```

---

### Q12: How do API Routes work?

**Answer:**
**Next.js API Routes** = Serverless functions

**File Structure:**
```
app/api/
├── gold-rate/
│   └── route.ts          → /api/gold-rate
├── products/
│   └── route.ts          → /api/products
└── admin/
    └── coupons/
        └── route.ts      → /api/admin/coupons
```

**Example (app/api/gold-rate/route.ts):**
```typescript
export async function GET() {
  const { data } = await supabase
    .from('gold_rates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  return NextResponse.json({ rate: data.rate_per_gram });
}
```

**HTTP Methods:**
- `GET` - Fetch data
- `POST` - Create data
- `PATCH` - Update data
- `DELETE` - Delete data

**Benefits:**
- ✅ Serverless (auto-scaling)
- ✅ No CORS issues
- ✅ Same codebase as frontend
- ✅ TypeScript support

---

## Frontend & UI

### Q13: Explain Client vs Server Components

**Answer:**
**Server Components** (default in App Router):
- Render on server
- No JavaScript sent to client
- Can access database directly
- Cannot use hooks (useState, useEffect)

**Client Components** (marked with `'use client'`):
- Render on client
- Can use hooks
- Interactive (onClick, etc.)
- Larger bundle size

**Example:**
```typescript
// Server Component (default)
export default async function ProductsPage() {
  const products = await fetchProducts(); // Direct DB access
  return <ProductGrid products={products} />;
}

// Client Component
'use client';
export default function AddToCartButton() {
  const [loading, setLoading] = useState(false);
  return <button onClick={handleClick}>Add to Cart</button>;
}
```

**When to use Client Components:**
- Need useState, useEffect
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Third-party libraries (Zustand, Framer Motion)

---

### Q14: How does the Shopping Cart work?

**Answer:**
**Cart State Management** (Zustand + localStorage)

**Implementation (lib/store.ts):**
```typescript
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.slug === item.slug);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.slug === item.slug
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      
      removeItem: (slug) => set((state) => ({
        items: state.items.filter(i => i.slug !== slug)
      })),
      
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' } // Persists to localStorage
  )
);
```

**Usage:**
```typescript
const { items, addItem, removeItem } = useCart();

// Add to cart
addItem({
  slug: 'gold-chain-22k',
  name: 'Gold Chain',
  goldWeight: 10.5,
  // ...
});

// Cart persists across page reloads
```

**Key Features:**
- ✅ Persists to localStorage
- ✅ Survives page refresh
- ✅ Quantity management
- ✅ Duplicate prevention

---

### Q15: Explain the Checkout Flow

**Answer:**
**Checkout Steps:**

**Step 1: Shipping Information**
- Customer enters name, email, phone, address
- Validation using Zod schema
- Data stored in component state

**Step 2: Payment Method**
- Choose Razorpay or Cash on Delivery
- Display order summary with gold rate

**Step 3: Place Order**
```typescript
async function handlePlaceOrder() {
  // 1. Create order in database
  const response = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({
      items: cartItems,
      customerInfo: { name, email, phone, address },
      paymentMethod: 'razorpay'
    })
  });
  
  const { orderId, razorpayOrderId } = await response.json();
  
  // 2. Open Razorpay payment modal
  const rzp = new Razorpay({
    key: RAZORPAY_KEY_ID,
    order_id: razorpayOrderId,
    handler: (response) => {
      // 3. Payment successful
      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}`);
    }
  });
  
  rzp.open();
}
```

**Backend (app/api/checkout/route.ts):**
```typescript
export async function POST(request) {
  const { items, customerInfo, paymentMethod } = await request.json();
  
  // 1. Calculate totals
  const goldRate = await getCurrentGoldRate();
  const totals = calculateOrderTotals(items, goldRate);
  
  // 2. Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: totals.final * 100, // Paise
    currency: 'INR'
  });
  
  // 3. Save order to database
  const { data: order } = await supabase
    .from('orders')
    .insert({
      customer_name: customerInfo.name,
      items: items,
      gold_rate_used: goldRate,
      total_amount: totals.final,
      razorpay_order_id: razorpayOrder.id,
      payment_status: 'pending'
    })
    .select()
    .single();
  
  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id
  });
}
```

---

## Performance & Optimization

### Q16: What performance optimizations are implemented?

**Answer:**

**1. Image Optimization**
```typescript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200],
  minimumCacheTTL: 86400, // 24 hours
}
```
- Automatic WebP/AVIF conversion
- Responsive images
- Lazy loading
- CDN caching

**2. Code Splitting**
```typescript
// Dynamic imports
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), {
  ssr: false // Don't render on server
});
```
- Reduces initial bundle size
- Loads components on demand

**3. Mobile Optimizations**
```css
/* Reduced blur on mobile */
@media (max-width: 768px) {
  .luxury-blur {
    backdrop-filter: blur(8px); /* vs 18px on desktop */
  }
  
  /* Disable heavy animations */
  .halo-orb {
    display: none;
  }
}
```

**4. Database Optimization**
- Indexes on frequently queried columns
- Limit queries (`.limit(30)`)
- Select only needed columns

**5. Caching**
- Static page generation
- API route caching
- Image CDN caching

---

### Q17: Explain the mobile-first approach

**Answer:**
**Mobile-First Design** = Design for mobile, then enhance for desktop

**Tailwind CSS Breakpoints:**
```css
/* Mobile (default) */
.text-base

/* Tablet (≥768px) */
.md:text-lg

/* Desktop (≥1024px) */
.lg:text-xl
```

**Mobile-Specific Features:**
1. **Bottom Navigation Bar**
   - Fixed at bottom
   - 5 quick access buttons
   - Hidden on desktop

2. **Simplified Navbar**
   - Hamburger menu
   - Smaller logo
   - Compact ticker

3. **Touch Optimizations**
   - Larger tap targets (min 44px)
   - No hover effects
   - Swipe gestures

4. **Performance**
   - Reduced animations
   - Smaller images
   - Less blur effects

**Desktop Enhancements:**
- Full navigation menu
- Hover effects
- Custom cursor
- Larger layouts
- More animations

---

## Security & Authentication

### Q18: What security measures are implemented?

**Answer:**

**1. Authentication**
- JWT tokens in HTTP-only cookies
- Password hashing (bcrypt)
- 24-hour session expiration

**2. API Protection**
```typescript
// Verify admin session
const authResult = await verifyAdminSession(request);
if (!authResult.valid) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**3. Input Validation**
```typescript
// Using Zod
const couponSchema = z.object({
  code: z.string().min(3).max(50),
  discountValue: z.number().positive(),
  // ...
});

const result = couponSchema.safeParse(input);
if (!result.success) {
  return { error: result.error.message };
}
```

**4. SQL Injection Prevention**
- Using Supabase client (parameterized queries)
- No raw SQL from user input

**5. XSS Prevention**
- React escapes output by default
- HTTP-only cookies
- Content Security Policy

**6. CSRF Protection**
- SameSite cookie attribute
- Origin checking

**7. Rate Limiting**
```typescript
// lib/rate-limit.ts
export async function rateLimit(identifier: string) {
  const key = `rate-limit:${identifier}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  
  if (count > 10) {
    throw new Error('Too many requests');
  }
}
```

---

## Advanced Questions

### Q19: How would you add a new feature?

**Answer:**
**Example: Adding a "Wishlist" feature**

**Step 1: Database Schema**
```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY,
  customer_email VARCHAR,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Step 2: API Routes**
```typescript
// app/api/wishlist/route.ts
export async function POST(request) {
  const { email, productId } = await request.json();
  
  await supabase.from('wishlists').insert({
    customer_email: email,
    product_id: productId
  });
  
  return NextResponse.json({ success: true });
}
```

**Step 3: State Management**
```typescript
// lib/store.ts
export const useWishlist = create<WishlistState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}));
```

**Step 4: UI Component**
```typescript
// components/WishlistButton.tsx
'use client';
export default function WishlistButton({ product }) {
  const { addItem } = useWishlist();
  
  return (
    <button onClick={() => addItem(product)}>
      Add to Wishlist
    </button>
  );
}
```

---

### Q20: Explain the deployment process

**Answer:**
**Deployment on Vercel:**

**Step 1: Connect GitHub**
- Push code to GitHub repository
- Connect repo to Vercel

**Step 2: Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
JWT_SECRET=...
RAZORPAY_KEY_ID=...
```

**Step 3: Build Configuration**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**Step 4: Automatic Deployment**
- Push to `main` branch
- Vercel automatically builds and deploys
- Preview deployments for PRs

**Build Process:**
1. Install dependencies (`npm install`)
2. Run build (`next build`)
3. Generate static pages
4. Deploy to CDN
5. Serverless functions deployed

**Post-Deployment:**
- Custom domain setup
- SSL certificate (automatic)
- Analytics integration
- Error monitoring

---

## Common Interview Questions

### Q21: What challenges did you face?

**Answer:**
**Challenge 1: Dynamic Pricing**
- Problem: Product prices change with gold rate
- Solution: Calculate prices on-the-fly, don't store in DB
- Learning: Separation of data and calculations

**Challenge 2: State Persistence**
- Problem: Cart lost on page refresh
- Solution: Zustand persist middleware with localStorage
- Learning: Client-side storage strategies

**Challenge 3: Mobile Performance**
- Problem: Animations causing lag on mobile
- Solution: Conditional rendering, reduced effects
- Learning: Performance optimization techniques

**Challenge 4: Authentication**
- Problem: Secure admin access
- Solution: JWT tokens in HTTP-only cookies
- Learning: Web security best practices

---

### Q22: How would you scale this application?

**Answer:**

**1. Database Scaling**
- Add read replicas for queries
- Implement caching (Redis)
- Database indexing optimization

**2. API Optimization**
- Implement API caching
- Use CDN for static assets
- Add rate limiting

**3. Frontend Optimization**
- Implement ISR (Incremental Static Regeneration)
- Add service workers (PWA)
- Optimize bundle size

**4. Infrastructure**
- Use edge functions for faster response
- Implement load balancing
- Add monitoring (Sentry, LogRocket)

**5. Features**
- Add search functionality (Algolia)
- Implement real-time inventory
- Add recommendation engine

---

## Key Takeaways

### What You Should Know:

1. **Architecture**: Full-stack Next.js with Supabase
2. **State Management**: Zustand for cart/wishlist
3. **Authentication**: Custom JWT implementation
4. **Pricing Logic**: Dynamic calculation based on gold rate
5. **Database**: PostgreSQL with proper schema design
6. **API Design**: RESTful endpoints with validation
7. **Security**: Input validation, auth, rate limiting
8. **Performance**: Image optimization, code splitting
9. **Mobile-First**: Responsive design with Tailwind
10. **Deployment**: Vercel with automatic CI/CD

### Be Ready to Explain:
- Why you chose each technology
- How data flows through the application
- Security considerations
- Performance optimizations
- Trade-offs you made

---

## Practice Questions

1. Walk me through the checkout process
2. How does the gold rate affect product pricing?
3. Explain the coupon validation logic
4. What happens when a user adds an item to cart?
5. How do you prevent unauthorized admin access?
6. Explain the difference between Server and Client Components
7. How would you add a search feature?
8. What database indexes would you add?
9. How do you handle errors in API routes?
10. Explain the mobile optimization strategy

---

**Good luck with your exam! 🚀**

Remember: Understanding the "why" behind each decision is more important than memorizing code.
