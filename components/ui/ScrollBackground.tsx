'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollBackground() {
  useEffect(() => {
    // Define color transitions for different scroll positions
    const colors = [
      { start: 0, end: 0.2, color: '#ffffff' }, // White
      { start: 0.2, end: 0.4, color: '#fef3c7' }, // Amber-100
      { start: 0.4, end: 0.6, color: '#fce7f3' }, // Pink-100
      { start: 0.6, end: 0.8, color: '#dbeafe' }, // Blue-100
      { start: 0.8, end: 1, color: '#f3e8ff' }, // Purple-100
    ];

    // Create scroll-triggered background color changes
    colors.forEach((colorStop, index) => {
      if (index < colors.length - 1) {
        gsap.to('body', {
          backgroundColor: colorStop.color,
          scrollTrigger: {
            trigger: 'body',
            start: `${colorStop.start * 100}% top`,
            end: `${colorStop.end * 100}% top`,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const nextColor = colors[index + 1].color;
              
              // Interpolate between colors
              const r1 = parseInt(colorStop.color.slice(1, 3), 16);
              const g1 = parseInt(colorStop.color.slice(3, 5), 16);
              const b1 = parseInt(colorStop.color.slice(5, 7), 16);
              
              const r2 = parseInt(nextColor.slice(1, 3), 16);
              const g2 = parseInt(nextColor.slice(3, 5), 16);
              const b2 = parseInt(nextColor.slice(5, 7), 16);
              
              const r = Math.round(r1 + (r2 - r1) * progress);
              const g = Math.round(g1 + (g2 - g1) * progress);
              const b = Math.round(b1 + (b2 - b1) * progress);
              
              document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            },
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      document.body.style.backgroundColor = '';
    };
  }, []);

  return null;
}
