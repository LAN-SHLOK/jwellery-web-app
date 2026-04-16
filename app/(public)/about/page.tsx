'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Heart, Shield, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

const values = [
  {
    icon: Award,
    title: 'Heritage Craft',
    description: 'Every piece is crafted using traditional Indian goldsmithing techniques, refined for contemporary elegance.',
  },
  {
    icon: Shield,
    title: 'BIS Certified',
    description: 'All jewelry is hallmarked and certified for purity, ensuring trust and quality in every purchase.',
  },
  {
    icon: Heart,
    title: 'Transparent Pricing',
    description: 'Clear breakdown of gold value, making charges, and GST - no hidden costs, complete transparency.',
  },
  {
    icon: Sparkles,
    title: 'Modern Design',
    description: 'Timeless designs that blend traditional craftsmanship with modern aesthetics for everyday elegance.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Source',
    description: 'Premium 22K gold sourced with certified provenance, ensuring material integrity from the start.',
  },
  {
    number: '02',
    title: 'Craft',
    description: 'Expert artisans shape each piece with precision, balancing traditional techniques with modern design.',
  },
  {
    number: '03',
    title: 'Certify',
    description: 'Every piece receives BIS hallmark certification, guaranteeing purity and quality standards.',
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'Secure packaging and insured delivery ensure your jewelry arrives safely at your doorstep.',
  },
];

const faqs = [
  {
    question: 'What is BIS Hallmarking?',
    answer: 'BIS (Bureau of Indian Standards) hallmarking is a certification that guarantees the purity of gold. All our jewelry carries this certification, ensuring you receive authentic 22K gold.',
  },
  {
    question: 'How is pricing calculated?',
    answer: 'Our pricing is transparent: Gold weight × Current gold rate + Making charges + Jeweller margin + 3% GST. You can see the complete breakdown on each product page.',
  },
  {
    question: 'Do you offer customization?',
    answer: 'Yes! Contact us via WhatsApp or email to discuss custom designs. Our artisans can create bespoke pieces tailored to your preferences.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy for unused items in original condition. Custom pieces are non-returnable. Contact us for detailed terms.',
  },
];

export default function AboutPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              Our Story
            </motion.span>
            <h1 className="mt-6 font-serif text-4xl font-medium text-gray-900 md:text-6xl lg:text-7xl">
              Crafting Modern Heirlooms
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              {BRAND_CONFIG.name} brings together traditional Indian craftsmanship with contemporary design, 
              offering BIS-certified 22K gold jewelry with complete price transparency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-serif text-3xl font-medium text-gray-900 md:text-4xl">
              What We Stand For
            </h2>
            <p className="mt-4 text-gray-600">
              Our commitment to quality, transparency, and craftsmanship
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="card-hover group cursor-pointer rounded-lg border border-gray-200 bg-white p-6"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900"
                >
                  <value.icon size={24} />
                </motion.div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-serif text-3xl font-medium text-gray-900 md:text-4xl">
              Our Process
            </h2>
            <p className="mt-4 text-gray-600">
              From sourcing to delivery, every step is carefully managed
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="card-hover group cursor-pointer rounded-lg border border-gray-200 bg-white p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 font-serif text-2xl font-medium text-white"
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-serif text-3xl font-medium text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600">
              Everything you need to know about our jewelry
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <motion.button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  whileTap={{ scale: 0.99 }}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className="text-gray-600" />
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 px-4 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl font-medium md:text-5xl">
              Ready to Find Your Perfect Piece?
            </h2>
            <p className="mt-6 text-lg text-gray-300">
              Explore our collection of handcrafted 22K gold jewelry with transparent pricing and BIS certification.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-100"
                >
                  Browse Collections
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
