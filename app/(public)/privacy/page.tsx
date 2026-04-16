'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you place an order or create an account, we collect your name, email address, phone number, shipping address, and payment information. This information is necessary to process and deliver your orders.',
        },
        {
          subtitle: 'Browsing Information',
          text: 'We automatically collect certain information about your device, including your IP address, browser type, and browsing behavior on our website. This helps us improve your shopping experience.',
        },
        {
          subtitle: 'Transaction Data',
          text: 'We maintain records of your purchase history, including products ordered, prices paid, and delivery details for order fulfillment and customer service purposes.',
        },
      ],
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Order Processing',
          text: 'We use your information to process orders, arrange delivery, send order confirmations, and provide customer support for your purchases.',
        },
        {
          subtitle: 'Communication',
          text: 'We may send you emails about your orders, new products, special offers, and important updates about our services. You can opt out of marketing emails at any time.',
        },
        {
          subtitle: 'Service Improvement',
          text: 'We analyze browsing and purchase patterns to improve our website, product offerings, and customer experience.',
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We may use your information to comply with legal obligations, resolve disputes, and enforce our agreements.',
        },
      ],
    },
    {
      icon: Eye,
      title: 'Information Sharing',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We share information with trusted third-party service providers who help us operate our business, including payment processors, shipping companies, and email service providers. These partners are contractually obligated to protect your information.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, court order, or government regulation, or to protect our rights and safety.',
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.',
        },
        {
          subtitle: 'No Selling',
          text: 'We do not sell, rent, or trade your personal information to third parties for their marketing purposes.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Protection Measures',
          text: 'We implement industry-standard security measures to protect your personal information, including SSL encryption for data transmission and secure storage systems.',
        },
        {
          subtitle: 'Payment Security',
          text: 'All payment transactions are processed through secure payment gateways. We do not store complete credit card information on our servers.',
        },
        {
          subtitle: 'Access Control',
          text: 'Access to your personal information is restricted to authorized personnel who need it to perform their job functions.',
        },
      ],
    },
    {
      icon: Eye,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access & Correction',
          text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us.',
        },
        {
          subtitle: 'Data Deletion',
          text: 'You can request deletion of your personal information, subject to legal retention requirements and ongoing transactions.',
        },
        {
          subtitle: 'Marketing Opt-Out',
          text: 'You can unsubscribe from marketing emails by clicking the unsubscribe link in any promotional email or contacting us directly.',
        },
        {
          subtitle: 'Cookie Control',
          text: 'You can control cookies through your browser settings, though some features may not function properly if cookies are disabled.',
        },
      ],
    },
    {
      icon: Lock,
      title: 'Cookies & Tracking',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use cookies necessary for website functionality, including shopping cart management and user authentication.',
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We use analytics tools to understand how visitors use our website, helping us improve user experience and site performance.',
        },
        {
          subtitle: 'Marketing Cookies',
          text: 'With your consent, we may use cookies to show you relevant advertisements and measure campaign effectiveness.',
        },
      ],
    },
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
            <Shield size={64} className="mx-auto mb-6 text-amber-400" />
            <h1 className="font-serif text-4xl font-bold md:text-6xl">Privacy Policy</h1>
            <p className="mt-6 text-lg text-gray-300">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
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
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg">
                  <section.icon size={28} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item, i) => (
                  <div key={i} className="border-l-4 border-amber-500 pl-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{item.subtitle}</h3>
                    <p className="leading-relaxed text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-8 md:p-12"
        >
          <h2 className="mb-6 font-serif text-2xl font-bold text-gray-900 md:text-3xl">
            Questions About Privacy?
          </h2>
          <p className="mb-8 text-gray-600">
            If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
          </p>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Mail size={20} className="mt-1 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">Email</p>
                <p className="mt-1 text-sm text-gray-600">{BRAND_CONFIG.contact.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="mt-1 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">Phone</p>
                <p className="mt-1 text-sm text-gray-600">{BRAND_CONFIG.contact.whatsapp}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-1 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">Address</p>
                <p className="mt-1 text-sm text-gray-600">{BRAND_CONFIG.contact.address}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
