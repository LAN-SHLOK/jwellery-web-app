'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';

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
  const [focusedField, setFocusedField] = useState('');

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
        <motion.section 
          className="luxury-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-accent/10 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="section-kicker">Concierge desk</p>
                <h1 className="mt-4 font-serif text-5xl leading-[0.92] text-brand-primary md:text-7xl">
                  Start the conversation the way fine jewellery should begin.
                </h1>
              </motion.div>
              
              <motion.p 
                className="mt-5 max-w-xl text-sm leading-8 copy-muted md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Use the form for enquiries, sourcing requests, gifting help, or a custom brief. For urgent questions, the WhatsApp concierge remains the fastest route.
              </motion.p>

              <motion.div 
                className="mt-8 grid gap-4 sm:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { label: 'Response', value: '24h' },
                  { label: 'Channel', value: 'Direct' },
                  { label: 'Availability', value: 'Mon-Sat' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-[1.4rem] border border-black/8 bg-white/60 p-5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">{item.label}</p>
                    <p className="mt-3 font-serif text-3xl text-brand-primary">{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.a
                href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[1.8rem] border border-emerald-200 bg-[linear-gradient(180deg,rgba(241,255,247,0.95)_0%,rgba(226,249,236,0.92)_100%)] p-6 text-left relative overflow-hidden group"
                whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(16,185,129,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MessageCircle size={24} className="text-emerald-600" />
                </motion.div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-emerald-700">WhatsApp concierge</p>
                <p className="mt-3 font-serif text-3xl leading-none text-brand-primary">Instant help for fast purchase decisions.</p>
              </motion.a>

              <motion.div 
                className="rounded-[1.8rem] border border-black/8 bg-white/58 p-6"
                whileHover={{ borderColor: "rgba(214,190,118,0.3)" }}
              >
                <div className="space-y-5">
                  {[
                    { icon: Phone, label: 'Phone', value: BRAND_CONFIG.contact.whatsapp },
                    { icon: Mail, label: 'Email', value: BRAND_CONFIG.contact.email },
                    { icon: MapPin, label: 'Atelier', value: BRAND_CONFIG.contact.address }
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon size={16} className="mt-1 text-brand-accent" />
                      </motion.div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-brand-text/38">{item.label}</p>
                        <p className="mt-2 text-sm text-brand-text/72">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
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
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div 
            className="space-y-4 pt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-kicker">What to include</p>
            <h2 className="font-serif text-4xl leading-none text-brand-primary">Tell us the category, the occasion, and your preferred gold weight if you have it.</h2>
            <p className="text-sm leading-8 copy-muted">
              That helps the concierge respond with sharper recommendations and a faster pricing discussion.
            </p>
          </motion.div>

          <motion.div 
            className="luxury-panel rounded-[2rem] p-6 md:p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex min-h-[24rem] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle2 size={46} className="text-brand-accent" />
                  </motion.div>
                  <motion.h3 
                    className="mt-6 font-serif text-4xl text-brand-primary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Inquiry received.
                  </motion.h3>
                  <motion.p 
                    className="mt-4 max-w-sm text-sm leading-7 copy-muted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    The concierge team will respond as soon as possible. If the request is urgent, continue the conversation on WhatsApp as well.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
                      { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', required: true }
                    ].map((field, index) => (
                      <motion.div 
                        key={field.name}
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <label className="text-[10px] uppercase tracking-[0.28em] text-brand-text/45">{field.label}</label>
                        <motion.input
                          type={field.type}
                          required={field.required}
                          value={formState[field.name as keyof typeof formState]}
                          onChange={(e) => setFormState({ ...formState, [field.name]: e.target.value })}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField('')}
                          className="w-full rounded-[1.1rem] border border-black/8 bg-white/58 px-4 py-3 outline-none transition-all"
                          placeholder={field.placeholder}
                          animate={{
                            borderColor: focusedField === field.name ? 'rgba(214,190,118,0.5)' : 'rgba(0,0,0,0.08)',
                            backgroundColor: focusedField === field.name ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.58)'
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-[10px] uppercase tracking-[0.28em] text-brand-text/45">Phone</label>
                    <motion.input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      className="w-full rounded-[1.1rem] border border-black/8 bg-white/58 px-4 py-3 outline-none transition-all"
                      placeholder="+91 XXXXX XXXXX"
                      animate={{
                        borderColor: focusedField === 'phone' ? 'rgba(214,190,118,0.5)' : 'rgba(0,0,0,0.08)',
                        backgroundColor: focusedField === 'phone' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.58)'
                      }}
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-[10px] uppercase tracking-[0.28em] text-brand-text/45">Your inquiry</label>
                    <motion.textarea
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField('')}
                      className="w-full rounded-[1.1rem] border border-black/8 bg-white/58 px-4 py-3 outline-none transition-all"
                      placeholder="Tell us about the piece, occasion, or custom direction you have in mind."
                      animate={{
                        borderColor: focusedField === 'message' ? 'rgba(214,190,118,0.5)' : 'rgba(0,0,0,0.08)',
                        backgroundColor: focusedField === 'message' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.58)'
                      }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-xs uppercase tracking-[0.22em] text-red-600"
                      >
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary w-full rounded-full flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending inquiry...
                      </>
                    ) : (
                      <>
                        Send inquiry
                        <Send size={14} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
