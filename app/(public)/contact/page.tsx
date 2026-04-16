'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';

import { BRAND_CONFIG } from '@/config/brand';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send');
      }

      setSubmitted(true);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong. Please try WhatsApp instead.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-medium text-gray-900 md:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-gray-600">
          Have questions? We're here to help with your jewelry needs
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-medium text-gray-900">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="mt-1 text-sm text-gray-600">{BRAND_CONFIG.contact.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Mail size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="mt-1 text-sm text-gray-600">{BRAND_CONFIG.contact.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <MapPin size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="mt-1 text-sm text-gray-600">{BRAND_CONFIG.contact.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Business Hours</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Saturday</span>
                <span className="font-medium text-gray-900">{BRAND_CONFIG.hours.weekdays.split(': ')[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday</span>
                <span className="font-medium text-gray-900">{BRAND_CONFIG.hours.sunday.split(': ')[1]}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-6 transition-colors hover:bg-green-100"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">WhatsApp</p>
              <p className="text-sm text-gray-600">Get instant help</p>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
          {submitted ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-gray-900">Message Sent!</h3>
              <p className="mt-2 text-sm text-gray-600">
                We'll get back to you as soon as possible
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
