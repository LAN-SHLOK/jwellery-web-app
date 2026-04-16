'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, MapPin, Clock, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ShippingPolicyPage() {
  const sections = [
    {
      icon: Truck,
      title: 'Shipping Coverage',
      content: [
        {
          subtitle: 'Pan-India Delivery',
          text: 'We deliver to all serviceable pin codes across India. Enter your pin code at checkout to verify delivery availability in your area.',
        },
        {
          subtitle: 'Insured Shipping',
          text: 'All jewelry shipments are fully insured against loss, theft, or damage during transit. Your precious purchase is protected from our door to yours.',
        },
        {
          subtitle: 'Secure Packaging',
          text: 'Every piece is carefully packaged in tamper-proof, discreet packaging to ensure safe delivery and maintain confidentiality.',
        },
      ],
    },
    {
      icon: Clock,
      title: 'Delivery Timeline',
      content: [
        {
          subtitle: 'Processing Time',
          text: 'Orders are processed within 1-2 business days after payment confirmation. You will receive a confirmation email once your order is dispatched.',
        },
        {
          subtitle: 'Metro Cities',
          text: 'Delivery to major metro cities (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad) typically takes 3-5 business days.',
        },
        {
          subtitle: 'Other Cities',
          text: 'Delivery to tier-2 and tier-3 cities may take 5-7 business days depending on location and courier availability.',
        },
        {
          subtitle: 'Remote Areas',
          text: 'Delivery to remote or hard-to-reach areas may take 7-10 business days. We will notify you if additional time is required.',
        },
      ],
    },
    {
      icon: Package,
      title: 'Shipping Charges',
      content: [
        {
          subtitle: 'Free Shipping',
          text: 'We offer FREE insured shipping on all orders across India. No minimum order value required.',
        },
        {
          subtitle: 'No Hidden Costs',
          text: 'The price you see at checkout is the final price. There are no additional shipping charges, handling fees, or surprise costs.',
        },
        {
          subtitle: 'International Shipping',
          text: 'Currently, we only ship within India. International shipping is not available at this time.',
        },
      ],
    },
    {
      icon: MapPin,
      title: 'Order Tracking',
      content: [
        {
          subtitle: 'Tracking Information',
          text: 'Once your order is shipped, you will receive a tracking number via email and SMS. Use this to track your package in real-time.',
        },
        {
          subtitle: 'Delivery Updates',
          text: 'You will receive SMS and email notifications at key stages: order confirmed, dispatched, out for delivery, and delivered.',
        },
        {
          subtitle: 'Delivery Attempts',
          text: 'Our courier partners will make up to 3 delivery attempts. If delivery fails after 3 attempts, the package will be returned to us.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Delivery Requirements',
      content: [
        {
          subtitle: 'Signature Required',
          text: 'All jewelry deliveries require a signature upon receipt. Please ensure someone is available to receive the package.',
        },
        {
          subtitle: 'ID Verification',
          text: 'For high-value orders, the courier may request government-issued ID verification before handing over the package.',
        },
        {
          subtitle: 'Delivery Address',
          text: 'Please provide a complete and accurate delivery address. We cannot be held responsible for delays or non-delivery due to incorrect addresses.',
        },
        {
          subtitle: 'Address Changes',
          text: 'Address changes are only possible before the order is dispatched. Contact us immediately if you need to update your delivery address.',
        },
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Delivery Issues',
      content: [
        {
          subtitle: 'Damaged Package',
          text: 'If you receive a damaged package, do not accept delivery. Refuse the package and contact us immediately. We will arrange a replacement.',
        },
        {
          subtitle: 'Missing Items',
          text: 'If any items are missing from your order, contact us within 24 hours of delivery with photos of the package and contents.',
        },
        {
          subtitle: 'Wrong Item',
          text: 'If you receive the wrong item, do not use or remove tags. Contact us within 24 hours, and we will arrange for exchange at no additional cost.',
        },
        {
          subtitle: 'Delayed Delivery',
          text: 'If your order is significantly delayed beyond the estimated delivery date, contact us for assistance. We will track your package and provide updates.',
        },
      ],
    },
  ];

  const deliverySteps = [
    { icon: CheckCircle, title: 'Order Placed', desc: 'Payment confirmed' },
    { icon: Package, title: 'Processing', desc: '1-2 business days' },
    { icon: Truck, title: 'Dispatched', desc: 'Tracking number sent' },
    { icon: MapPin, title: 'In Transit', desc: '3-7 business days' },
    { icon: CheckCircle, title: 'Delivered', desc: 'Signature required' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Truck size={64} className="mx-auto mb-6 text-amber-400" />
            <h1 className="font-serif text-4xl font-bold md:text-6xl">Shipping Policy</h1>
            <p className="mt-6 text-lg text-gray-300">
              Free, insured delivery across India. Your jewelry reaches you safely and securely.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            Delivery Process
          </h2>
          <p className="mt-4 text-gray-600">
            Track your order every step of the way
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-5">
          {deliverySteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <step.icon size={28} className="text-white" />
              </div>
              <h3 className="mb-2 font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
              
              {index < deliverySteps.length - 1 && (
                <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-green-500 to-emerald-600 md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="rounded-2xl bg-white p-8 shadow-lg md:p-12"
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <section.icon size={28} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item, i) => (
                  <div key={i} className="border-l-4 border-green-500 pl-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{item.subtitle}</h3>
                    <p className="leading-relaxed text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center">
            <CheckCircle size={40} className="mx-auto mb-4 text-green-600" />
            <h3 className="mb-2 font-bold text-gray-900">Free Shipping</h3>
            <p className="text-sm text-gray-600">On all orders across India</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 text-center">
            <Shield size={40} className="mx-auto mb-4 text-blue-600" />
            <h3 className="mb-2 font-bold text-gray-900">Fully Insured</h3>
            <p className="text-sm text-gray-600">Complete protection in transit</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-6 text-center">
            <Clock size={40} className="mx-auto mb-4 text-amber-600" />
            <h3 className="mb-2 font-bold text-gray-900">Fast Delivery</h3>
            <p className="text-sm text-gray-600">3-7 business days</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
