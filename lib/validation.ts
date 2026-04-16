import { z } from 'zod';


export const loginSchema = z.object({
  email:    z.string().min(1, 'Email required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});



export const cartItemSchema = z.object({
  slug:     z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
  customerInfo: z.object({
    name:  z.string().min(1, 'Name required'),
    phone: z.string().min(1, 'Phone required'),
    email: z.string().email('Valid email required'), // required — confirmation email sent here
    address: z.object({
      street:  z.string().min(1),
      city:    z.string().min(1),
      pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
      state:   z.string().min(1),
    }),
  }),
  paymentMethod: z.enum(['razorpay', 'cod']),
});


export const goldRateSchema = z.object({
  ratePerGram: z.number().positive().min(1000, 'Too low').max(50000, 'Too high'),
});

export const orderStatusValues = [
  'pending',
  'pending_payment',
  'manual_review_required',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
] as const;

export const orderStatusSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  status:  z.enum(orderStatusValues),
});

export const productSchema = z.object({
  name:              z.string().min(1).max(200),
  slug:              z.string().min(1).regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  description:       z.string().optional(),
  category:          z.enum(['ring', 'chain', 'earring', 'bangle', 'pendant', 'necklace']),
  goldWeightGrams:   z.number().positive().max(1000),
  goldPurity:        z.enum(['18K', '22K']).default('22K'),
  availableInBothPurities: z.boolean().default(false),
  makingChargeType:  z.enum(['fixed', 'percentage']),
  makingChargeValue: z.number().positive(),
  jewellerMargin:    z.number().min(0),
  stockQuantity:     z.number().int().min(0).default(0),
  isActive:          z.boolean().default(true),
  isFeatured:        z.boolean().default(false),
  hallmarkNumber:    z.string().optional(),
  images:            z.array(z.string().url()).optional(),
});

export const updateProductSchema = productSchema.partial();


export type LoginInput       = z.infer<typeof loginSchema>;
export type CheckoutInput    = z.infer<typeof checkoutSchema>;
export type GoldRateInput    = z.infer<typeof goldRateSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type OrderStatus      = (typeof orderStatusValues)[number];
export type ProductInput     = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AddressInput     = z.infer<typeof addressSchema>;


export const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  email:    z.string().email(),
  phone:    z.string().regex(/^[\d\s\-+()]{10,}$/, 'Invalid phone number'),
  street:   z.string().min(5),
  city:     z.string().min(2),
  pincode:  z.string().regex(/^\d{6}$/, '6-digit pincode required'),
  state:    z.string().min(2),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  reviewText: z.string().min(10).max(2000),
});

export const couponSchema = z.object({
  code: z.string().min(3).max(50).regex(/^[A-Z0-9]+$/, 'Coupon code must be uppercase letters and numbers only'),
  description: z.string().max(500).optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minOrderValue: z.number().min(0).default(0),
  maxDiscountAmount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type CouponInput = z.infer<typeof couponSchema>;

