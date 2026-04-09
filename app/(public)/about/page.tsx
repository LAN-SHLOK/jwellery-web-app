'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Heart, Shield, Sparkles } from 'lucide-react';

const values = [
  {
    icon: Award,
    title: 'Heritage Craft',
    description:
      'Every piece is informed by regional Indian goldsmithing traditions, then refined for a calmer, more contemporary silhouette.',
  },
  {
    icon: Shield,
    title: 'Certified Purity',
    description:
      'Hallmark-led trust remains central to the experience, from product detail to order confirmation and fulfilment.',
  },
  {
    icon: Heart,
    title: 'Transparent Pricing',
    description:
      'Gold value, making charges, jeweller margin, and GST are all exposed so the buyer never has to guess what creates the total.',
  },
  {
    icon: Sparkles,
    title: 'Modern Heirlooms',
    description:
      'The visual direction avoids noise. Pieces are presented the way fine jewellery should feel: measured, sculptural, and gift-worthy.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Source',
    description: 'Gold enters the workshop with certified provenance so every piece starts with material integrity.',
  },
  {
    number: '02',
    title: 'Shape',
    description: 'Designs are refined to balance bridal richness with a modern wardrobe sensibility.',
  },
  {
    number: '03',
    title: 'Hallmark',
    description: 'Each finished piece is aligned to BIS expectations before being positioned for sale.',
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'Orders are documented with the live gold rate used at purchase time and move through a protected fulfilment flow.',
  },
];

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen">
      <motion.section 
        className="relative overflow-hidden px-4 pb-18 pt-12 text-white md:px-8 md:pb-24 md:pt-18"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-brand-primary" />
        <motion.div 
          className="halo-orb left-[10%] top-20 h-56 w-56 bg-[radial-gradient(circle,rgba(214,190,118,0.16)_0%,transparent_72%)]"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="halo-orb right-[12%] top-28 h-72 w-72 bg-[radial-gradient(circle,rgba(214,190,118,0.12)_0%,transparent_76%)]"
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative mx-auto max-w-6xl">
          <motion.div 
            className="luxury-outline rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 md:px-10 md:py-14"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="section-kicker text-brand-accent/90"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              The House Story
            </motion.p>
            <motion.h1 
              className="mt-5 max-w-4xl font-serif text-5xl leading-[0.9] md:text-7xl lg:text-[5.6rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Jewellery that respects legacy without feeling trapped in it.
            </motion.h1>
            <motion.p 
              className="mt-6 max-w-2xl text-sm leading-8 text-white/75 md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              The brand language here is rooted in Indian craftsmanship, but the buying experience is intentionally cleaner, slower, and more premium than a typical catalogue grid.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl px-4 py-18 md:px-8 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div 
            className="luxury-panel rounded-[2rem] p-8 md:p-10"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.1)" }}
          >
            <p className="section-kicker">Why this matters</p>
            <h2 className="mt-4 font-serif text-4xl leading-none text-brand-primary">The customer should feel certainty before they ever feel urgency.</h2>
          </motion.div>
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sm leading-8 copy-muted md:text-base">
              That is why this storefront emphasizes hallmark confidence, product clarity, and rate transparency first. The aesthetic is there to elevate the work, not distract from it.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-18 md:px-8 md:pb-24">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="luxury-panel rounded-[1.8rem] p-7"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
            >
              <motion.div 
                className="inline-flex rounded-full border border-black/8 bg-white/58 p-3 text-brand-accent"
                whileHover={{ rotate: 360, scale: 1.15 }}
                transition={{ duration: 0.5 }}
              >
                <value.icon size={18} />
              </motion.div>
              <h3 className="mt-5 font-serif text-3xl leading-none text-brand-primary">{value.title}</h3>
              <p className="mt-4 text-sm leading-7 copy-muted">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-18 md:px-8 md:pb-24">
        <motion.div 
          className="mx-auto max-w-6xl luxury-panel rounded-[2rem] p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-kicker">From atelier to order</p>
            <h2 className="mt-4 font-serif text-4xl leading-none text-brand-primary md:text-5xl">A four-step cadence for a calmer jewellery purchase.</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <motion.div 
                key={step.number}
                className="rounded-[1.5rem] border border-black/8 bg-white/55 p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ 
                  y: -5, 
                  backgroundColor: "rgba(255,255,255,0.75)",
                  borderColor: "rgba(214,190,118,0.3)"
                }}
              >
                <motion.p 
                  className="font-serif text-4xl text-brand-accent/55"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                >
                  {step.number}
                </motion.p>
                <h3 className="mt-4 font-serif text-3xl text-brand-primary">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 copy-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.section 
        className="bg-brand-primary px-4 py-18 text-white md:px-8 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <motion.p 
            className="section-kicker text-brand-accent/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Continue browsing
          </motion.p>
          <motion.h2 
            className="mt-5 font-serif text-4xl leading-none md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Explore the collection with the same editorial calm carried through every product page.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/collections" className="button-secondary mt-8 inline-flex items-center gap-3 border-white/20 bg-white/6 text-white hover:bg-white/10">
              Explore Collections
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
