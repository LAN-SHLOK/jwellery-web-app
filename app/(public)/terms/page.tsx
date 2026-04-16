'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShoppingBag, CreditCard, RefreshCw, AlertCircle, Scale } from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement',
          text: 'By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.',
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes constitutes acceptance of the modified terms.',
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old to make purchases on our website. By placing an order, you represent that you are of legal age and have the authority to enter into this agreement.',
        },
      ],
    },
    {
      icon: ShoppingBag,
      title: 'Product Information & Pricing',
      content: [
        {
          subtitle: 'Product Descriptions',
          text: 'We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.',
        },
        {
          subtitle: 'Live Gold Pricing',
          text: 'All jewelry prices are calculated based on current gold rates and are subject to change. Prices are locked at the time of order placement and will not change after confirmation.',
        },
        {
          subtitle: 'BIS Hallmarking',
          text: 'All gold jewelry is BIS hallmarked and certified for purity. The purity percentage (22K = 91.67%, 18K = 75%) is clearly displayed for each product.',
        },
        {
          subtitle: 'Pricing Errors',
          text: 'In the event of a pricing error, we reserve the right to cancel the order and issue a full refund. We will notify you promptly if this occurs.',
        },
      ],
    },
    {
      icon: CreditCard,
      title: 'Orders & Payment',
      content: [
        {
          subtitle: 'Order Acceptance',
          text: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including suspected fraud or unauthorized transactions.',
        },
        {
          subtitle: 'Payment Methods',
          text: 'We accept payments through Razorpay (UPI, cards, netbanking) and Cash on Delivery. All online payments are processed securely through encrypted payment gateways.',
        },
        {
          subtitle: 'Payment Confirmation',
          text: 'Orders are processed only after payment confirmation. For COD orders, payment must be made in cash at the time of delivery.',
        },
        {
          subtitle: 'GST & Taxes',
          text: 'All prices include applicable GST (3% on gold jewelry). Tax breakdowns are clearly shown before checkout.',
        },
      ],
    },
    {
      icon: RefreshCw,
      title: 'Returns & Exchanges',
      content: [
        {
          subtitle: 'Return Policy',
          text: 'We accept returns within 7 days of delivery for unused, undamaged products in original packaging with all tags and certificates intact.',
        },
        {
          subtitle: 'Exchange Policy',
          text: 'Exchanges are available for size adjustments or product defects. Exchange requests must be made within 7 days of delivery.',
        },
        {
          subtitle: 'Non-Returnable Items',
          text: 'Customized or personalized jewelry, items without BIS hallmark certificates, and products showing signs of wear cannot be returned.',
        },
        {
          subtitle: 'Refund Process',
          text: 'Approved returns will be refunded to the original payment method within 7-10 business days after we receive and inspect the returned item.',
        },
      ],
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: [
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain website availability but do not guarantee uninterrupted access. We are not liable for any loss resulting from website downtime or technical issues.',
        },
        {
          subtitle: 'Product Liability',
          text: 'Our liability is limited to the purchase price of the product. We are not liable for any indirect, incidental, or consequential damages.',
        },
        {
          subtitle: 'Third-Party Services',
          text: 'We are not responsible for delays or issues caused by third-party service providers, including shipping companies and payment processors.',
        },
        {
          subtitle: 'Force Majeure',
          text: 'We are not liable for failure to perform due to circumstances beyond our reasonable control, including natural disasters, strikes, or government actions.',
        },
      ],
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      content: [
        {
          subtitle: 'Copyright',
          text: 'All content on this website, including text, images, logos, and designs, is protected by copyright and owned by us or our licensors.',
        },
        {
          subtitle: 'Trademarks',
          text: 'Our brand name, logo, and product names are trademarks. You may not use these without our prior written permission.',
        },
        {
          subtitle: 'Prohibited Use',
          text: 'You may not copy, reproduce, distribute, or create derivative works from our website content without authorization.',
        },
        {
          subtitle: 'User Content',
          text: 'By submitting reviews or other content, you grant us a non-exclusive, royalty-free license to use, reproduce, and display that content.',
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
            <Scale size={64} className="mx-auto mb-6 text-amber-400" />
            <h1 className="font-serif text-4xl font-bold md:text-6xl">Terms of Service</h1>
            <p className="mt-6 text-lg text-gray-300">
              Please read these terms carefully before using our website and services.
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
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                  <section.icon size={28} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{item.subtitle}</h3>
                    <p className="leading-relaxed text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border-2 border-amber-500 bg-amber-50 p-8 md:p-12"
        >
          <div className="flex items-start gap-4">
            <AlertCircle size={32} className="flex-shrink-0 text-amber-600" />
            <div>
              <h2 className="mb-4 font-serif text-2xl font-bold text-gray-900">
                Important Notice
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                These Terms of Service constitute a legally binding agreement between you and our company. By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
              <p className="leading-relaxed text-gray-700">
                If you have any questions about these terms, please contact us before making a purchase. We are here to help clarify any concerns you may have.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Governing Law */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12"
        >
          <h2 className="mb-4 font-serif text-2xl font-bold text-gray-900">
            Governing Law & Jurisdiction
          </h2>
          <p className="leading-relaxed text-gray-600">
            These Terms of Service are governed by the laws of India. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
