'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';

import { useCart } from '@/lib/store';
import { calculateFinalPrice, calculateOrderTotals } from '@/lib/pricing';
import { BRAND_CONFIG } from '@/config/brand';

// Checkout page
export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [currentRate, setCurrentRate] = useState(6500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepError, setStepError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [address, setAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
    state: ''
  });

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch('/api/gold-rate');
        const data = await res.json();
        if (typeof data.rate === 'number') {
          setCurrentRate(data.rate);
        }
      } catch (err) {
        console.error('[Checkout] Gold rate fetch failed:', err);
      }
    }
    fetchRate();
  }, []);

  function goToPayment() {
    if (!address.fullName.trim()) return setStepError('Full name is required');
    if (!address.phone.trim()) return setStepError('Phone number is required');
    if (!address.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) return setStepError('Valid email is required for order confirmation');
    if (!address.street.trim()) return setStepError('Street address is required');
    if (!address.city.trim()) return setStepError('City is required');
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) return setStepError('Valid 6-digit pincode required');
    if (!address.state.trim()) return setStepError('State is required');
    setStepError('');
    setStep(2);
  }

  const linePricing = (item: (typeof items)[0]) =>
    calculateFinalPrice({
      goldWeightGrams: item.goldWeight,
      todayRatePerGram: currentRate,
      makingChargeType: item.makingChargeType,
      makingChargeValue: item.makingChargeValue,
      jewellerMargin: item.jewellerMargin,
    });

  const merchandiseExGst = items.reduce((acc, item) => {
    const p = linePricing(item);
    return acc + p.subtotal * item.quantity;
  }, 0);

  const orderTotals = calculateOrderTotals(merchandiseExGst);
  const gstAmount = orderTotals.gst;
  const orderTotal = orderTotals.total;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setStepError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customerInfo: {
            name: address.fullName,
            phone: address.phone,
            email: address.email,
            address: {
              street: address.street,
              city: address.city,
              pincode: address.pincode,
              state: address.state,
            },
          },
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStepError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      if (paymentMethod === 'razorpay' && data.paymentMode === 'demo') {
        const q = new URLSearchParams({
          orderId: data.orderId,
          phone: address.phone,
          token: data.demoToken,
        });

        if (address.email) {
          q.set('email', address.email);
        }

        router.push(`/payment/demo?${q.toString()}`);
        return;
      }

      // Razorpay flow â€” open the payment modal
      if (paymentMethod === 'razorpay' && data.razorpayOrderId) {
        const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        if (!rzpKeyId) {
          setStepError('Online payment access is being finalised. Please continue through the secure payment review step or choose Cash on Delivery.');
          return;
        }

        // Load Razorpay checkout script on demand
        await new Promise<void>((resolve, reject) => {
          if ((window as any).Razorpay) { resolve(); return; }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.body.appendChild(script);
        });

        const rzp = new (window as any).Razorpay({
          key: rzpKeyId,
          order_id: data.razorpayOrderId,
          amount: Math.round(data.amount * 100),
          currency: 'INR',
          name: BRAND_CONFIG.name,
          description: '22K Gold Jewellery Order',
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          handler: () => {
            // Payment captured â€” webhook will mark it paid in DB
            clearCart();
            const q = new URLSearchParams({
              orderId: data.orderId,
              phone: address.phone,
            });
            if (address.email) q.set('email', address.email);
            router.push(`/order-confirmation?${q.toString()}`);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        });
        rzp.open();
        return; 
      }

      // COD flow
      clearCart();
      const q = new URLSearchParams({
        orderId: data.orderId,
        phone: address.phone,
      });
      if (address.email) {
        q.set('email', address.email);
      }
      router.push(`/order-confirmation?${q.toString()}`);

    } catch (err) {
      console.error('[Checkout] Order failed:', err);
      setStepError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-serif mb-6 uppercase tracking-widest">Your bag is empty</h1>
        <Link href="/collections" className="text-xs uppercase tracking-[0.3em] font-bold border-b border-black pb-2">
          Discover Our Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-16 px-4 md:px-8 md:pt-14 md:pb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        
        {/* Left: Multistep Form */}
        <div className="lg:col-span-7 space-y-8 md:space-y-12">
          <header>
            <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em] mb-4">
              <span className={step >= 1 ? 'text-brand-accent' : 'opacity-30'}>01 Shipping</span>
              <span className="opacity-10">/</span>
              <span className={step >= 2 ? 'text-brand-accent' : 'opacity-30'}>02 Payment</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif">Checkout</h1>
          </header>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 md:space-y-8 luxury-panel rounded-[2rem] p-5 md:p-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Full Name</label>
                    <input type="text" required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors" placeholder="Vikas Khanna" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Phone</label>
                    <input type="tel" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Email <span className="text-brand-accent">*</span></label>
                    <input type="email" required value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors" placeholder="vikas@example.com" />
                    <p className="text-[9px] opacity-40">Order confirmation will be sent here</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Shipping Address</label>
                    <input type="text" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors" placeholder="House No, Street, Area" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">City</label>
                    <input type="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Pincode</label>
                    <input type="text" required value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors" placeholder="400001" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60">State</label>
                    <input type="text" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full border-b border-black/10 py-2 focus:border-brand-accent outline-none text-sm transition-colors" placeholder="Maharashtra" />
                  </div>
                </div>

                {stepError && (
                  <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{stepError}</p>
                )}

                <button onClick={goToPayment} className="button-primary mt-8 h-14 w-full rounded-full md:mt-12 md:h-16">
                  Continue to Payment
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 md:space-y-8 luxury-panel rounded-[2rem] p-5 md:p-12"
              >
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`w-full p-6 border flex items-center justify-between text-left transition-colors ${
                      paymentMethod === 'razorpay'
                        ? 'border-brand-accent bg-brand-accent/5'
                        : 'border-black/10 hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard size={18} className="text-brand-accent" />
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest">Pay with Razorpay</p>
                        <p className="text-[10px] opacity-60">UPI, cards, and netbanking with guided confirmation while gateway access is being finalised.</p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full shrink-0 ${
                        paymentMethod === 'razorpay' ? 'border-4 border-brand-accent' : 'border border-black/20'
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full p-6 border flex items-center justify-between text-left transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-brand-accent bg-brand-accent/5'
                        : 'border-black/10 hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Truck size={18} />
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest">Cash on delivery</p>
                        <p className="text-[10px] opacity-60">Pay when your order arrives</p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full shrink-0 ${
                        paymentMethod === 'cod' ? 'border-4 border-brand-accent' : 'border border-black/20'
                      }`}
                    />
                  </button>
                </div>

                {stepError && (
                  <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{stepError}</p>
                )}

                <div className="flex gap-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 h-16 border border-black/10 text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-4 hover:bg-black/5 transition-all"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-[2] h-16 bg-brand-primary text-white text-xs uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all duration-500 disabled:opacity-50"
                  >
                    {isProcessing
                      ? 'Locking prices...'
                      : paymentMethod === 'cod'
                        ? `Place order - ${BRAND_CONFIG.currency.symbol}${orderTotal.toLocaleString(BRAND_CONFIG.currency.locale)}`
                        : `Pay ${BRAND_CONFIG.currency.symbol}${orderTotal.toLocaleString(BRAND_CONFIG.currency.locale)}`}
                    {!isProcessing && <ShieldCheck size={14} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="luxury-panel rounded-[2rem] p-6 md:p-10 lg:sticky lg:top-36">
            <p className="section-kicker mb-4">Order summary</p>
            <h2 className="text-lg md:text-2xl font-serif mb-8 md:mb-10">Locked with today&apos;s gold rate</h2>
            
            <div className="space-y-6 md:space-y-8 mb-8 md:mb-12 max-h-[30vh] md:max-h-[40vh] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest">{item.name}</p>
                    <p className="text-[10px] opacity-40">Qty: {item.quantity} x {item.goldWeight}g</p>
                  </div>
                  <span className="text-xs font-serif font-bold opacity-80">
                    {BRAND_CONFIG.currency.symbol}
                    {(linePricing(item).subtotal * item.quantity).toLocaleString(BRAND_CONFIG.currency.locale)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-black/5">
              <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                <span>Gold rate (22K)</span>
                <span>{BRAND_CONFIG.currency.symbol}{currentRate.toLocaleString()}/g</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                <span>Subtotal (excl. GST)</span>
                <span>{BRAND_CONFIG.currency.symbol}{merchandiseExGst.toLocaleString(BRAND_CONFIG.currency.locale)}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                <span>GST (3%)</span>
                <span>{BRAND_CONFIG.currency.symbol}{gstAmount.toLocaleString(BRAND_CONFIG.currency.locale)}</span>
              </div>
              <div className="flex justify-between text-2xl font-serif pt-4 border-t border-black/5">
                <span>Total</span>
                <span>{BRAND_CONFIG.currency.symbol}{orderTotal.toLocaleString(BRAND_CONFIG.currency.locale)}</span>
              </div>
              <p className="text-[8px] uppercase tracking-widest opacity-40 text-center pt-8">
                Hallmarked & Insured by BIS Standards.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}




