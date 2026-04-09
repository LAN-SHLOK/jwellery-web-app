'use client';

import React, { useState } from 'react';
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
    <div className="min-h-screen px-4 pb-20 pt-10 md:px-8 md:pb-24 md:pt-14">
      <div className="mx-auto max-w-7xl">
        <section className="luxury-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="section-kicker">Concierge desk</p>
              <h1 className="mt-4 font-serif text-5xl leading-[0.92] text-brand-primary md:text-7xl">
                Start the conversation the way fine jewellery should begin.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-8 copy-muted md:text-base">
                Use the form for enquiries, sourcing requests, gifting help, or a custom brief. For urgent questions, the WhatsApp concierge remains the fastest route.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.4rem] border border-black/8 bg-white/60 p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Response</p>
                  <p className="mt-3 font-serif text-3xl text-brand-primary">24h</p>
                </div>
                <div className="rounded-[1.4rem] border border-black/8 bg-white/60 p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Channel</p>
                  <p className="mt-3 font-serif text-3xl text-brand-primary">Direct</p>
                </div>
                <div className="rounded-[1.4rem] border border-black/8 bg-white/60 p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Availability</p>
                  <p className="mt-3 font-serif text-3xl text-brand-primary">Mon-Sat</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <a
                href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[1.8rem] border border-emerald-200 bg-[linear-gradient(180deg,rgba(241,255,247,0.95)_0%,rgba(226,249,236,0.92)_100%)] p-6 text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <MessageCircle size={24} className="text-emerald-600" />
                <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-emerald-700">WhatsApp concierge</p>
                <p className="mt-3 font-serif text-3xl leading-none text-brand-primary">Instant help for fast purchase decisions.</p>
              </a>

              <div className="rounded-[1.8rem] border border-black/8 bg-white/58 p-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Phone size={16} className="mt-1 text-brand-accent" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Phone</p>
                      <p className="mt-2 text-sm text-brand-text/72">{BRAND_CONFIG.contact.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail size={16} className="mt-1 text-brand-accent" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Email</p>
                      <p className="mt-2 text-sm text-brand-text/72">{BRAND_CONFIG.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin size={16} className="mt-1 text-brand-accent" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">Atelier</p>
                      <p className="mt-2 text-sm leading-7 text-brand-text/72">{BRAND_CONFIG.contact.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/6 pt-6 text-sm text-brand-text/62">
                  <div className="flex justify-between gap-6">
                    <span>Monday - Saturday</span>
                    <span>{BRAND_CONFIG.hours.weekdays.split(': ')[1]}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-6">
                    <span>Sunday</span>
                    <span>{BRAND_CONFIG.hours.sunday.split(': ')[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 pt-4">
            <p className="section-kicker">What to include</p>
            <h2 className="font-serif text-4xl leading-none text-brand-primary">Tell us the category, the occasion, and your preferred gold weight if you have it.</h2>
            <p className="text-sm leading-8 copy-muted">
              That helps the concierge respond with sharper recommendations and a faster pricing discussion.
            </p>
          </div>

          <div className="luxury-panel rounded-[2rem] p-6 md:p-8">
            {submitted ? (
              <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
                <CheckCircle2 size={46} className="text-brand-accent" />
                <h3 className="mt-6 font-serif text-4xl text-brand-primary">Inquiry received.</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 copy-muted">
                  The concierge team will respond as soon as possible. If the request is urgent, continue the conversation on WhatsApp as well.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-brand-text/45">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                      className="w-full rounded-[1.1rem] border border-black/8 bg-white/58 px-4 py-3 outline-none transition-colors focus:border-brand-accent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.28em] text-brand-text/45">Email</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                      className="w-full rounded-[1.1rem] border border-black/8 bg-white/58 px-4 py-3 outline-none transition-colors focus:border-brand-accent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.28em] text-brand-text/45">Phone</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(event) => setFormState({ ...formState, phone: event.target.value })}
                    className="w-full rounded-[1.1rem] border border-black/8 bg-white/58 px-4 py-3 outline-none transition-colors focus:border-brand-accent"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.28em] text-brand-text/45">Your inquiry</label>
                  <textarea
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(event) => setFormState({ ...formState, message: event.target.value })}
                    className="w-full rounded-[1.1rem] border border-black/8 bg-white/58 px-4 py-3 outline-none transition-colors focus:border-brand-accent"
                    placeholder="Tell us about the piece, occasion, or custom direction you have in mind."
                  />
                </div>

                {submitError && (
                  <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-xs uppercase tracking-[0.22em] text-red-600">
                    {submitError}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="button-primary w-full rounded-full">
                  {isSubmitting ? 'Sending inquiry...' : 'Send inquiry'}
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
