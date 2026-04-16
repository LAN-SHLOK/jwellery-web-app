import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Fade in animation
export const fadeIn = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Stagger fade in
export const staggerFadeIn = (elements: string, options = {}) => {
  return gsap.from(elements, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Scale in animation
export const scaleIn = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Slide in from left
export const slideInLeft = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Slide in from right
export const slideInRight = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Parallax effect
export const parallax = (element: string | Element, speed = 0.5) => {
  return gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Text reveal animation
export const textReveal = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    opacity: 0,
    y: 100,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Rotate in animation
export const rotateIn = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    rotation: 180,
    opacity: 0,
    scale: 0.5,
    duration: 1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Cleanup function
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};
