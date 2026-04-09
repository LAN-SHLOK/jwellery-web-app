'use client';

import { useEffect, useState } from 'react';

export default function DeferredMount({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setMounted(true), { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      // fallback for Safari
      const t = setTimeout(() => setMounted(true), 200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
}
