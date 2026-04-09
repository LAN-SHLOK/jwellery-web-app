'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // default true — avoids flash on mobile

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { stiffness: 700, damping: 45, mass: 0.3 });
  const y = useSpring(mouseY, { stiffness: 700, damping: 45, mass: 0.3 });

  // trailing dot — lags behind for the tail effect
  const trailX = useSpring(mouseX, { stiffness: 100, damping: 20, mass: 0.8 });
  const trailY = useSpring(mouseY, { stiffness: 100, damping: 20, mass: 0.8 });

  useEffect(() => {
    // only show on pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsMobile(false);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      const el = e.target as HTMLElement;
      setHovering(!!el.closest('a, button, [role="button"], input, textarea, select'));
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY, visible]);

  if (isMobile) return null;

  return (
    <>
      {}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'hsl(45,60%,65%)',
        }}
        animate={{
          width:   hovering ? 40 : 8,
          height:  hovering ? 40 : 8,
          opacity: visible ? (hovering ? 0.12 : 0.3) : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99998]"
      />

      {/* diamond cursor */}
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
      >
        <motion.div
          animate={{
            scale:  clicking ? 0.65 : hovering ? 1.7 : 1,
            rotate: 45,
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 11,
            height: 11,
            background: hovering ? 'transparent' : 'hsl(45,60%,65%)',
            border: '1.5px solid hsl(45,60%,65%)',
            boxShadow: hovering
              ? '0 0 14px hsla(45,60%,65%,0.6)'
              : '0 0 6px hsla(45,60%,65%,0.35)',
          }}
        />
      </motion.div>
    </>
  );
}
