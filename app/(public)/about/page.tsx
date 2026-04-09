import React from 'react';
import Link from 'next/link';
import { Award, Heart, Shield, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Heritage',
  description: 'Three decades of handcrafted 22K gold jewellery. BIS hallmarked, transparently priced, and designed with modern Indian luxury in mind.',
};

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
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-4 pb-18 pt-12 text-white md:px-8 md:pb-24 md:pt-18">
        <div className="absolute inset-0 bg-brand-primary" />
        <div className="halo-orb left-[10%] top-20 h-56 w-56 bg-[radial-gradient(circle,rgba(214,190,118,0.16)_0%,transparent_72%)]" />
        <div className="halo-orb right-[12%] top-28 h-72 w-72 bg-[radial-gradient(circle,rgba(214,190,118,0.12)_0%,transparent_76%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="luxury-outline rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 md:px-10 md:py-14">
            <p className="section-kicker text-brand-accent/90">The House Story</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.9] md:text-7xl lg:text-[5.6rem]">
              Jewellery that respects legacy without feeling trapped in it.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-white/62 md:text-base">
              The brand language here is rooted in Indian craftsmanship, but the buying experience is intentionally cleaner, slower, and more premium than a typical catalogue grid.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-18 md:px-8 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="luxury-panel rounded-[2rem] p-8 md:p-10">
            <p className="section-kicker">Why this matters</p>
            <h2 className="mt-4 font-serif text-4xl leading-none text-brand-primary">The customer should feel certainty before they ever feel urgency.</h2>
          </div>
          <div className="flex items-center">
            <p className="text-sm leading-8 copy-muted md:text-base">
              That is why this storefront emphasizes hallmark confidence, product clarity, and rate transparency first. The aesthetic is there to elevate the work, not distract from it.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-18 md:px-8 md:pb-24">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="luxury-panel rounded-[1.8rem] p-7 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div className="inline-flex rounded-full border border-black/8 bg-white/58 p-3 text-brand-accent">
                <value.icon size={18} />
              </div>
              <h3 className="mt-5 font-serif text-3xl leading-none text-brand-primary">{value.title}</h3>
              <p className="mt-4 text-sm leading-7 copy-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-18 md:px-8 md:pb-24">
        <div className="mx-auto max-w-6xl luxury-panel rounded-[2rem] p-8 md:p-12">
          <div className="mb-10">
            <p className="section-kicker">From atelier to order</p>
            <h2 className="mt-4 font-serif text-4xl leading-none text-brand-primary md:text-5xl">A four-step cadence for a calmer jewellery purchase.</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {processSteps.map((step) => (
              <div key={step.number} className="rounded-[1.5rem] border border-black/8 bg-white/55 p-6">
                <p className="font-serif text-4xl text-brand-accent/55">{step.number}</p>
                <h3 className="mt-4 font-serif text-3xl text-brand-primary">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 copy-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-primary px-4 py-18 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="section-kicker text-brand-accent/90">Continue browsing</p>
          <h2 className="mt-5 font-serif text-4xl leading-none md:text-6xl">Explore the collection with the same editorial calm carried through every product page.</h2>
          <Link href="/collections" className="button-secondary mt-8 border-white/20 bg-white/6 text-white hover:bg-white/10">
            Explore Collections
          </Link>
        </div>
      </section>
    </div>
  );
}
